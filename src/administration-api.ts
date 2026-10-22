import {operationsApi,operationalVersion} from './operations-api';
import type {User} from './types';
export const administrationApi={
  saveUser(user:User,replacePassword = !user.id) {return operationsApi.command('/administration/users',{operation:user.id?'update':'create',...(user.id?{id:user.id,version:operationalVersion('users',user.id)}:{}),name:user.name,email:user.email,role:user.role,...(user.id&&!replacePassword?{}:{password:user.password})});},
  archiveUser(id:number,reason:string) {return operationsApi.command('/administration/users',{operation:'archive',id,version:operationalVersion('users',id),reason});},
};
