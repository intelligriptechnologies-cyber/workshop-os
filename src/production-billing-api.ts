import { authenticatedFetch,type CognitoConfig } from "./auth";
export type BillingAuth={mode:"local";identity:string}|{mode:"cognito";config:CognitoConfig};
export type BillingJob={id:string;branchId:string;jobNumber:string;stage:string;version:number;customerName:string;registration:string;invoice?:{id:string;number:string;originalPayableMinor:string;creditMinor:string;payableMinor:string;version:number};paidMinor:string;balanceMinor:string;workAccepted:boolean;paymentCleared:boolean;deliveryRecorded:boolean;gatePass?:{id:string;number:string;status:string;version:number;validUntil:string};released:boolean;closed:boolean;payments:Array<{id:string;kind:string;amountMinor:string;mode:string;reference:string;occurredAt:string}>;corrections:Array<{id:string;kind:string;amountMinor:string;status:string;version:number}>;invoiceCorrections:Array<{id:string;kind:string;amountMinor:string;status:string;version:number;documentNumber?:string}>};
export class BillingApiError extends Error{constructor(readonly code:string,readonly traceId?:string){super(code.replaceAll("_"," ").toLowerCase());}}
export function createBillingApi(auth:BillingAuth){async function call<T>(path:string,init:RequestInit={}){const headers=new Headers(init.headers);headers.set("content-type","application/json");const response=auth.mode==="cognito"?await authenticatedFetch(auth.config,path,{...init,headers}):await fetch(path,{...init,headers:{...Object.fromEntries(headers),"x-workshopos-identity":auth.identity}});const body=await response.json().catch(()=>({}));if(!response.ok)throw new BillingApiError(body.error??body.code??"REQUEST_FAILED",body.traceId);return body as T;}const command=<T>(path:string,value:unknown,key=crypto.randomUUID())=>call<T>(path,{method:"POST",headers:{"idempotency-key":key},body:JSON.stringify(value)});return{
  get:(jobId:string)=>call<{billing:BillingJob}>(`/api/v1/billing/jobs/${jobId}`).then(x=>x.billing),
  finalize:(jobId:string,version:number)=>command(`/api/v1/billing/jobs/${jobId}/invoice/finalize`,{version}),
  accept:(jobId:string,value:unknown)=>command(`/api/v1/billing/jobs/${jobId}/work-accepted`,value),
  pay:(jobId:string,value:unknown)=>command(`/api/v1/billing/jobs/${jobId}/payments`,value),
  delivery:(jobId:string,value:unknown)=>command(`/api/v1/billing/jobs/${jobId}/delivery-evidence`,value),
  gate:(jobId:string,value:unknown)=>command(`/api/v1/billing/jobs/${jobId}/gate-pass`,value),
  release:(passId:string,value:unknown)=>command(`/api/v1/billing/gate-passes/${passId}/release`,value),
  close:(jobId:string,version:number)=>command(`/api/v1/billing/jobs/${jobId}/close`,{version}),
  requestInvoiceCorrection:(invoiceId:string,value:unknown)=>command(`/api/v1/billing/invoices/${invoiceId}/corrections`,value),
  approveInvoiceCorrection:(adjustmentId:string,version:number)=>command(`/api/v1/billing/invoice-corrections/${adjustmentId}/approve`,{version}),
  requestPaymentCorrection:(paymentId:string,value:unknown)=>command(`/api/v1/billing/payments/${paymentId}/corrections`,value),
  approvePaymentCorrection:(correctionId:string,version:number)=>command(`/api/v1/billing/payment-corrections/${correctionId}/approve`,{version}),
};}
