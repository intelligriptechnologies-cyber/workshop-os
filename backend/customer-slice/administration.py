"""Shared-session user administration with no credential disclosure."""
import json,re
from fastapi import APIRouter,Request
from pydantic import BaseModel,ConfigDict
from sqlalchemy import text
from api import fail,hash_password,ROLES
from operations import command,row,mutable
router=APIRouter(prefix='/api/v1/administration')

class UserChange(BaseModel):
    model_config=ConfigDict(extra='forbid')
    operation:str
    id:int|None=None
    version:int|None=None
    name:str=''
    email:str=''
    role:str=''
    password:str|None=None
    reason:str=''

@router.post('/users')
def manage_user(value:UserChange,request:Request):
    # Fingerprint a digest, never store a password in the command/audit tables.
    from api import digest
    body=value.model_dump();body['password']=digest(value.password) if value.password is not None else None
    with command(request,body) as (c,u,replay,save):
        if u['role']!='admin':fail('Only Admin can manage users.',403)
        if replay:return replay
        if value.operation not in ('create','update','archive'):fail('Unknown user operation.',422)
        old=None
        if value.operation!='create':
            old=c.execute(text('SELECT * FROM workshop_user_profiles WHERE id=:id'),{'id':value.id}).mappings().first()
            if not old:fail('User not found.',404)
            mutable(old,value.version)
            if old['email'] in ('general.service.manager@example.com','ppf.paint.manager@example.com'):fail('Preloaded Service Department Manager accounts are locked.',409)
            if old['platform_user_id'] is None:fail('Historical identity requires explicit provisioning.',409)
            if old['role']=='admin' and (value.operation=='archive' or value.role!='admin') and c.scalar(text("SELECT count(*) FROM workshop_user_profiles WHERE role='admin' AND archived_at IS NULL"))<=1:fail('The final active Admin must be retained.',409)
        if value.operation=='archive':
            if value.id==u['profile_id']:fail('You cannot archive your own signed-in account.',409)
            if not value.reason.strip():fail('An archive reason is required.',422)
        else:
            if not value.name.strip():fail('User name is required.',422)
            if not re.fullmatch(r'\S+@\S+\.\S+',value.email.strip()):fail('Enter a valid user email.',422)
            if value.role not in ROLES:fail('Select a valid user role.',422)
            if value.operation=='create' and value.password is None or value.password is not None and len(value.password)<6:fail('User password must contain at least 6 characters.',422)
            if c.scalar(text('SELECT EXISTS(SELECT 1 FROM workshop_user_profiles WHERE lower(email)=lower(:e) AND archived_at IS NULL AND id<>:id)'),{'e':value.email.strip(),'id':value.id or 0}):fail('A user with this email already exists.',409)
        details=dict(name=value.name.strip(),email=value.email.strip().lower(),role=value.role,reason=value.reason.strip())
        result=c.scalar(text('SELECT slice_manage_user(:id,:v,:op,CAST(:d AS jsonb),:h)'),dict(id=value.id,v=value.version,op=value.operation,d=json.dumps(details),h=hash_password(value.password) if value.password is not None else None))
        return save({'id':result})

def users(c):
    return [dict(r,password='********') for r in c.execute(text('SELECT id,name,email,role,archived_at,archived_reason,created_at,updated_at,version FROM workshop_user_profiles ORDER BY id')).mappings()]
