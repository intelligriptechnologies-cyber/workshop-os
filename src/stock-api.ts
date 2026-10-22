import { operationsApi, operationalVersion } from './operations-api';
import { runDocumentCommand } from './estimate-documents-api';
const tableFor=(action:string)=>action.startsWith('supplier-')?'suppliers':action.startsWith('po-')?'purchase_orders':action.startsWith('material-')?'material_requests':action.startsWith('inward-')?'inward_purchases':'inventory';
export const stockApi={
 command(action:string, record:{id:number;version?:number}|undefined, values:unknown={}){
  return operationsApi.command<{id:number}>('/stock/command',{action,id:record?.id||null,version:record?.id?(record.version??operationalVersion(tableFor(action),record.id)):null,values});
 },
};
export function runStock(action:string,record:{id:number;version?:number}|undefined,values:unknown={},onError:(message:string)=>void=window.alert,onSuccess:(id:number)=>void=()=>{}){
 let id=0;return runDocumentCommand(async()=>{id=(await stockApi.command(action,record,values)).id;},onError,()=>onSuccess(id));
}
