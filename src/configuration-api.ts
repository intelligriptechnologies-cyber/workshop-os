import {request} from './customer-api';
import {operationsApi} from './operations-api';
import {hydrateAdminConfiguration, loadAdminDemoState, type AdminDemoState} from './admin-demo-state';
const versions=new Map<string,number>();
export const configurationApi={
 async read(){const result=await request<{state:AdminDemoState;version:number}>('/configuration');versions.set(JSON.stringify(result.state),result.version);hydrateAdminConfiguration(result.state);return result.state;},
 async save(state:AdminDemoState,base=loadAdminDemoState()){
  const version=versions.get(JSON.stringify(base));
  if(version===undefined)throw new Error('Load configuration before saving.');
  const result=await operationsApi.command<{state:AdminDemoState;version:number}>('/configuration',{state,version});versions.set(JSON.stringify(result.state),result.version);hydrateAdminConfiguration(result.state);return result.state;
 },
};
