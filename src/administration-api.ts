import {operationsApi,operationalVersion} from './operations-api';
import type {User} from './types';
// Preserve the version of the displayed record even if a later projection arrives out of order.
const versionOf=(user:User)=>(user as User & {version?:number}).version ?? operationalVersion('users',user.id);
export const administrationApi={
  saveUser(user:User,replacePassword = !user.id) {return operationsApi.command('/administration/users',{operation:user.id?'update':'create',...(user.id?{id:user.id,version:versionOf(user)}:{}),name:user.name,email:user.email,role:user.role,...(user.id&&!replacePassword?{}:{password:user.password})});},
  archiveUser(user:User,reason:string) {return operationsApi.command('/administration/users',{operation:'archive',id:user.id,version:versionOf(user),reason});},
};
