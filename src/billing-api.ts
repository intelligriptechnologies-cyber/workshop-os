import type { CreateInvoiceInput, InvoiceEditorInput, PaymentInput } from './db';
import { operationsApi, operationalVersion } from './operations-api';
import { request } from './customer-api';
import type { JobView } from './types';
import { planSnapshots } from './document-snapshots';
import { loadAdminDemoState } from './admin-demo-state';
import { renderLive } from './job-documents';
import { buildReportLines, buildReportValues } from './report-templates';

const paymentBodies = new Map<string, unknown>();
const version=(table:string,record:{id:number})=>(record as {version?:number}).version??operationalVersion(table,record.id);

export const billingApi = {
  create(view:JobView, input:CreateInvoiceInput) {
    return operationsApi.command('/financial/jobs/'+view.job.id+'/invoice', {...input,version:version('job_cards',view.job)});
  },
  save(view:JobView,input:InvoiceEditorInput) {
    return operationsApi.command('/financial/invoices/'+view.invoice!.id,{...input,version:version('invoices',view.invoice!)},'PUT');
  },
  async pay(view:JobView,input:PaymentInput) {
    const invoice=view.invoice!; const id=invoice.id;
    const invoiceVersion=version('invoices',invoice);
    const signature=JSON.stringify([id,invoiceVersion,input]);
    let body=paymentBodies.get(signature);
    if (!body) {
      const preview=await request<{version:number;receiptNumber:string;gatePassNumber:string;timestamp:string;deliveryBy:string}>('/financial/invoices/'+id+'/payment-preview');
      if(preview.version!==invoiceVersion) throw new Error('Record changed. Reload before recording payment.');
      const next:JobView={...view,job:{...view.job,main_status:'CLOSED',delivery_by:preview.deliveryBy,final_km:view.job.final_km??view.vehicle.km,acknowledgement:view.job.acknowledgement||'Payment confirmed and vehicle handed over'},
        invoice:{...invoice,status:'Cleared'},payments:[{id:0,job_card_id:view.job.id,invoice_id:id,amount:invoice.total,mode:input.mode,other_detail:input.otherDetail,reference:input.reference,notes:input.notes??'',created_at:preview.timestamp}],
        receipt:{id:0,job_card_id:view.job.id,invoice_id:id,receipt_no:preview.receiptNumber,created_at:preview.timestamp},
        gate_pass:{id:0,job_card_id:view.job.id,invoice_id:id,gate_pass_no:preview.gatePassNumber,created_at:preview.timestamp}};
      const snapshots=planSnapshots([], [view], [next], loadAdminDemoState(),preview.timestamp)
        .filter(s=>['invoice','payment-receipt','gate-pass'].includes(s.kind))
        .map(({kind,number,templateId,html,values,lines})=>({kind,number,templateId,html,values,lines}));
      body={...input,version:preview.version,receiptNumber:preview.receiptNumber,gatePassNumber:preview.gatePassNumber,snapshots};
      paymentBodies.set(signature,body);
    }
    const result=await operationsApi.command('/financial/invoices/'+id+'/payment',body);
    paymentBodies.delete(signature);
    return result;
  },
  voidInvoice(view:JobView,reason:string) {
    const id=view.invoice!.id; const admin=loadAdminDemoState();
    const snapshot={kind:'invoice',number:view.invoice!.invoice_no,templateId:admin.reportTemplates.find(t=>t.category==='invoice'&&t.active)?.id??'',
      html:renderLive('invoice',view,admin),values:buildReportValues('invoice',view,admin.businessSettings,admin.companyAssets),lines:buildReportLines('invoice',view)};
    return operationsApi.command('/financial/invoices/'+id+'/void',{reason,version:version('invoices',view.invoice!),snapshot});
  },
  voidPayment(id:number,reason:string) {
    return operationsApi.command('/financial/payments/'+id+'/void',{reason,version:operationalVersion('payments',id)});
  },
};
