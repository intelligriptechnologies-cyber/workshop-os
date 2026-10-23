import type { Customer, User } from './types';
import prefill from 'virtual:workshop-demo-credentials';

export const customersApiEnabled = true;
export type ApiCustomer = Customer & { version: number };
export type CustomerLinks = { customer: ApiCustomer; vehicles: Array<{id:number;number:string;make:string;model:string}>; jobs: Array<{id:number;job_no:string;main_status:string;vehicle_number:string}> };
let loginCsrf = '';
const revisions = new Map<number,number>();
const pending = new Map<string,string>();
export class CustomerApiError extends Error {}
export const demoPassword = (email:string) => prefill[email] ?? '';
const cookie = (name:string) => document.cookie.split('; ').find(x=>x.startsWith(name+'='))?.slice(name.length+1) ?? '';

export async function request<T>(path:string, init:RequestInit={}):Promise<T> {
  const response=await fetch('/api/v1'+path,{...init,credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json','x-workshopos-csrf':cookie('workshopos_csrf'),...init.headers}});
  const body=await response.json();
  if(!response.ok){
    if(response.status===401 && !path.startsWith('/auth/login')) window.dispatchEvent(new Event('workshop-session-expired'));
    throw new CustomerApiError(body.code ?? 'Request failed.');
  }
  return body as T;
}
export const customerApi = {
  async config(){ const c=await request<{mode:'database';allowDemo:boolean;loginCsrf:string}>('/auth/config'); loginCsrf=c.loginCsrf; return c; },
  session:()=>request<{user:User;expiresAt:string}>('/session'),
  async login(email:string,password:string){ await this.config(); await request('/auth/login',{method:'POST',headers:{'x-login-csrf':loginCsrf},body:JSON.stringify({email,password})}); return this.session(); },
  logout:()=>request('/auth/logout',{method:'POST'}),
  async list(provided?:ApiCustomer[]){ const rows=provided ?? await request<ApiCustomer[]>('/customers'); revisions.clear(); rows.forEach(r=>revisions.set(r.id,r.version)); return rows; },
  detail:(id:number)=>request<CustomerLinks>('/customers/'+id),
  async save(value:Customer){
    const payload={name:value.name,mobile:value.mobile,type:value.type,...(value.address==null?{}:{address:value.address}),...(value.id?{version:(value as ApiCustomer).version ?? revisions.get(value.id)}:{})};
    return this.command(value.id?'/customers/'+value.id:'/customers',value.id?'PUT':'POST',payload);
  },
  archive:(id:number,reason:string)=>customerApi.command('/customers/'+id+'/archive','POST',{reason,version:revisions.get(id)}),
  async command(path:string,method:string,body:unknown){
    const signature=JSON.stringify([path,body]);
    const key=pending.get(signature) ?? crypto.randomUUID(); pending.set(signature,key);
    const row=await request<ApiCustomer>(path,{method,headers:{'Idempotency-Key':key},body:JSON.stringify(body)});
    pending.delete(signature); revisions.set(row.id,row.version);
    window.dispatchEvent(new Event('workshop-customers-changed'));
    return row;
  },
};
