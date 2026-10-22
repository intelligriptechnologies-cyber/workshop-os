import type { Vehicle, JobCard, ChecklistItem } from './types';
import { request } from './customer-api';
export type ApiVehicle=Vehicle & {version:number};
export type Projection=Record<string,Array<Record<string,unknown>>>;
let vehicles:ApiVehicle[]=[];
let current:Projection={};
const revision=(table:string,id:number)=>current[table]?.find(r=>r.id===id)?.version;
const keys=new Map<string,string>();
export const operationsApi={
 async read():Promise<Projection>{current=await request<Projection>('/operations/projection');vehicles=current.vehicles as unknown as ApiVehicle[];return current;},
 async command<T>(path:string,body:unknown,method='POST'):Promise<T>{
  const signature=JSON.stringify([path,body]);const key=keys.get(signature)??crypto.randomUUID();keys.set(signature,key);
  const result=await request<T>(path,{method,headers:{'Idempotency-Key':key},body:JSON.stringify(body)});keys.delete(signature);
  if(path==='/reception/intake') window.dispatchEvent(new CustomEvent('workshop-job-created',{detail:(result as {id:number}).id}));
  window.dispatchEvent(new Event('workshop-customers-changed'));return result;
 },
 intake(body:unknown){return this.command<{id:number;job_no:string}>('/reception/intake',body);},
 job(job:JobCard,operation:string,values:unknown){return this.command('/jobs/'+job.id+'/command',{operation,values,version:(job as JobCard & {version?:number}).version??revision('job_cards',job.id)});},
 checklist(item:ChecklistItem,checked:boolean,notApplicable=false){return this.command('/jobs/checklist/'+item.id,{checked,notApplicable,version:(item as ChecklistItem & {version?:number}).version??revision('checklist_items',item.id)});},
 assign(job:JobCard,advisor_id:number){return this.command('/reception/jobs/'+job.id+'/advisor',{advisor_id,version:(job as JobCard & {version?:number}).version??revision('job_cards',job.id)});},
 attendance(user_id:number,date:string,present:boolean){return this.command('/reception/attendance',{user_id,date,present});},
 saveVehicle(v:Vehicle){return this.command<ApiVehicle>(v.id?'/vehicles/'+v.id:'/vehicles',{customer_id:v.customer_id,number:v.number,make:v.make,model:v.model,color:v.color,km:v.km,...(v.engine_no==null?{}:{engine_no:v.engine_no}),...(v.id?{version:(v as ApiVehicle).version??vehicles.find(r=>r.id===v.id)?.version}:{})},v.id?'PUT':'POST');},
 archiveVehicle(id:number,reason:string){return this.command('/vehicles/'+id+'/archive',{reason,version:vehicles.find(v=>v.id===id)?.version});},
};

export function attachOperationalVersions(state: {jobs:Array<{job:JobCard;checklist_items:ChecklistItem[]}>;archived_jobs:Array<{job:JobCard;checklist_items:ChecklistItem[]}>}, projection:Projection=current){
 for(const view of [...state.jobs,...state.archived_jobs]){
  Object.assign(view.job,{version:projection.job_cards?.find(r=>r.id===view.job.id)?.version});
  for(const item of view.checklist_items)Object.assign(item,{version:projection.checklist_items?.find(r=>r.id===item.id)?.version});
 }
}
