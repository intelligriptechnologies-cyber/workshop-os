import {operationsApi,operationalVersion,recordOperationalVersion} from './operations-api';
const pending=new Map<number,Promise<unknown>>();
export const catalogApi={
 command(operation:string,values:Record<string,unknown>,id?:number){
  const table=operation.startsWith('department-')?'service_departments':operation.startsWith('tasklist-')?'job_task_list_items':operation==='master-save'?String(values.table):'service_catalog_items';
  const send=async()=>{
   const version=id?operationalVersion(table,id):operation==='tasklist-add'?operationalVersion('job_cards',Number(values.job_id)):undefined;
   const result=await operationsApi.command<{id:number;version:number}>('/catalog/command',{operation,values,...(id?{id}:{}),version});
   recordOperationalVersion(table,result.id,result.version);return result;
  };
  if(id&&operation.startsWith('tasklist-')){const result=(pending.get(id)??Promise.resolve()).catch(()=>undefined).then(send);pending.set(id,result);void result.finally(()=>{if(pending.get(id)===result)pending.delete(id);}).catch(()=>undefined);return result;}
  return send();
 },
};
export async function runCatalog(operation:string,values:Record<string,unknown>,id?:number,onError?:(message:string)=>void){
 try{await catalogApi.command(operation,values,id);return true;}catch(error){const message=error instanceof Error?error.message:'Action failed';if(onError)onError(message);else window.alert(message);return false;}
}
