import type { EstimateDraftInput, JobPhotoInput } from './db';
import type { JobView, Photo } from './types';
import { operationsApi, operationalVersion } from './operations-api';
import { loadAdminDemoState } from './admin-demo-state';
import { planSnapshots } from './document-snapshots';
const version = (table:string,value:{id:number}) => (value as {version?:number}).version ?? operationalVersion(table,value.id);

export const estimateDocumentsApi = {
  save(view: JobView, draft: EstimateDraftInput) {
    return operationsApi.command('/jobs/'+view.job.id+'/estimate', {
      ...draft, version: view.estimate ? version('estimates',view.estimate) : null,
      items: draft.items.map(({kind,description,qty,rate,gst_type,gst_rate}) => ({kind,description,qty,rate,gst_type,gst_rate})),
    });
  },
  approve(view: JobView, note: string) {
    if (!view.estimate) return Promise.reject(new Error('Generate the Estimate before approving it.'));
    const next = {...view, estimate: {...view.estimate,status:'Approved' as const,approval_note:note.trim()}};
    const snapshot = planSnapshots([], [view], [next], loadAdminDemoState()).find(s=>s.kind==='estimate');
    if (!snapshot) return Promise.reject(new Error('The Estimate document could not be generated.'));
    return operationsApi.command('/jobs/'+view.job.id+'/estimate/approve', {
      version:version('estimates',view.estimate),note,
      snapshot:{templateId:snapshot.templateId,html:snapshot.html,values:snapshot.values,lines:snapshot.lines},
    });
  },
  prefill(view: JobView) {
    return operationsApi.command('/jobs/'+view.job.id+'/estimate/prefill',{version:view.estimate?version('estimates',view.estimate):null});
  },
  upload(view: JobView, photo: JobPhotoInput) {
    const {label,category,src,originalName,width,height}=photo;
    return operationsApi.command('/jobs/'+view.job.id+'/media',{label,category,src,originalName,width,height});
  },
  editMedia(photo: Photo, label: string, category: string) {
    return operationsApi.command('/media/'+photo.id+'/metadata',{label,category,version:version('photos',photo)});
  },
  archiveMedia(photo: Photo, reason: string) {
    return operationsApi.command('/media/'+photo.id+'/archive',{reason,version:version('photos',photo)});
  },
  material(view: JobView, operation: 'submit'|'Approved'|'Rejected'|'resubmit', reason='', row_id?: number) {
    return operationsApi.command('/jobs/'+view.job.id+'/material-approval',{
      operation,reason,row_id,version:view.material_approval?version('material_approvals',view.material_approval):null,
    });
  },
};

// Retains existing error surfaces and closes dialogs only after a committed write.
export async function runDocumentCommand(action:()=>Promise<unknown>, onError:(message:string)=>void, onSuccess:()=>void=()=>{}) {
  try {
    await action();
    await new Promise<void>((resolve,reject)=>{
      const updated=()=>{window.clearTimeout(timer);window.removeEventListener('workshop-projection-refreshed',updated);requestAnimationFrame(()=>resolve());};
      const timer=window.setTimeout(()=>{window.removeEventListener('workshop-projection-refreshed',updated);reject(new Error('Saved, but the refreshed data could not be loaded. Reload before continuing.'));},15000);
      window.addEventListener('workshop-projection-refreshed',updated);
    });
    onSuccess();
  } catch(error) { onError(error instanceof Error?error.message:'Action failed'); }
}
