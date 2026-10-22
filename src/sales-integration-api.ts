import {operationsApi,operationalVersion} from './operations-api';
export const salesIntegrationApi={
 command(operation:string,values:unknown,id?:number){return operationsApi.command('/sales/command',{operation,values,...(id?{id,version:operationalVersion(operation==='lead-save'?'sales_leads':'sales_quotations',id)}:{})});},
};
export async function runSales(operation:string,values:unknown,id:number|undefined,onError:(message:string)=>void){
 try{await salesIntegrationApi.command(operation,values,id);return true;}catch(error){onError(error instanceof Error?error.message:'Sales action failed');return false;}
}
