"""One cookie/session authentication path and source-compatible Customers API."""
import hashlib
import hmac
import json
import os
import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID
from contextlib import contextmanager

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, ConfigDict
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import IntegrityError
from app.database_auth import hash_password, verify_password

TENANT='eb01f21c-09d1-5cb1-aadb-d15649568fd7'
BRANCH='12809bd1-d793-52d2-878d-7f0f8f1d6e09'
ORIGIN=os.environ['SLICE_ORIGIN']
STAGE=os.environ['SLICE_STAGE']
PREFILL=os.environ.get('SLICE_PREFILL')=='true'
if PREFILL and STAGE not in ('development','test'): raise RuntimeError('Production fixture prohibited')
url=make_url(os.environ['SLICE_DATABASE_URL'])
if (url.host,url.database,url.username) not in [('slice-dev','slice_dev','slice_auth'),('slice-test','slice_test','slice_auth')] or url.query:
    raise RuntimeError('Only isolated slice databases are permitted')
engine=create_engine(url,hide_parameters=True,pool_pre_ping=True)
TTL=int(os.environ.get('SLICE_SESSION_SECONDS','28800'))
SESSION='workshopos_session'; CSRF='workshopos_csrf'; PREAUTH='workshopos_login_nonce'
ROLES={'admin','service','service_manager','reception','accounts','store','tech'}
app=FastAPI()
digest=lambda value: hashlib.sha256(value.encode()).hexdigest()

def fail(code, status=401): raise HTTPException(status,detail={'code':code})

@app.exception_handler(HTTPException)
async def domain_error(_,exc): return JSONResponse(exc.detail,status_code=exc.status_code)

@app.exception_handler(RequestValidationError)
async def validation_error(_,exc): return JSONResponse({'code':'Invalid request.'},status_code=422)

@app.middleware('http')
async def safety(request,call_next):
    try: response=await call_next(request)
    except Exception: response=JSONResponse({'code':'Request failed safely.'},status_code=500)
    response.headers['Cache-Control']='no-store'
    return response

def origin(request):
    if request.headers.get('origin')!=ORIGIN: fail('ORIGIN_INVALID',403)

def context(c):
    c.execute(text("SELECT set_config('workshopos.tenant_id',:t,true),set_config('workshopos.branch_ids',:b,true),set_config('workshopos.read_only','false',true)"),{'t':TENANT,'b':'{'+BRANCH+'}'})

def event(c,kind,user=None):
    c.execute(text('INSERT INTO slice_auth_events(event,user_id) VALUES(:e,:u)'),{'e':kind,'u':user})

def identify(c,request):
    context(c)
    row=c.execute(text('''SELECT s.*,p.id AS profile_id,p.name,p.email,p.role,m.version AS current_version
      FROM database_sessions s JOIN platform_users u ON u.id=s.user_id
      JOIN tenant_memberships m ON m.id=s.membership_id AND m.user_id=u.id AND m.tenant_id=s.tenant_id
      JOIN workshop_user_profiles p ON p.platform_user_id=u.id AND p.tenant_id=s.tenant_id
      JOIN tenants t ON t.id=s.tenant_id
      WHERE s.token_hash=:h AND s.expires_at>now() AND s.tenant_id=:t
      AND u.status='ACTIVE' AND m.status='ACTIVE' AND p.archived_at IS NULL AND m.version=s.membership_version AND p.branch_id=:b
      AND t.lifecycle_state IN ('active','trial','payment_due')'''),
      {'h':digest(request.cookies.get(SESSION,'')),'t':TENANT,'b':BRANCH}).mappings().first()
    if not row or row['role'] not in ROLES: fail('AUTHENTICATION_REQUIRED')
    if request.method not in ('GET','HEAD','OPTIONS'):
        origin(request)
        if not hmac.compare_digest(digest(request.headers.get('x-workshopos-csrf','')),row['csrf_hash']): fail('CSRF_INVALID',403)
    return row

@contextmanager
def business(request,write=False,snapshot=False):
    with engine.begin() as c:
        if snapshot: c.execute(text("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ"))
        user=identify(c,request)
        from configuration import authorize
        authorize(c,user,request.url.path,request.method)
        if write and user['role'] not in ('admin','reception'):
            fail('Customer changes are not permitted for this role.',403)
        c.execute(text("SELECT set_config('workshopos.actor_id',:a,true)"),{'a':str(user['user_id'])})
        c.execute(text('SET LOCAL ROLE workshopos_runtime'))
        yield c,user

@app.get('/api/v1/auth/config')
def config(response:Response):
    nonce=secrets.token_urlsafe(32)
    response.set_cookie(PREAUTH,nonce,max_age=600,httponly=True,secure=True,samesite='strict')
    return {'mode':'database','allowDemo':PREFILL,'loginCsrf':nonce}

class Login(BaseModel):
    email:str
    password:str

@app.post('/api/v1/auth/login')
def login(value:Login,request:Request,response:Response):
    origin(request)
    nonce=request.cookies.get(PREAUTH,'')
    if not nonce or not hmac.compare_digest(nonce,request.headers.get('x-login-csrf','')): fail('LOGIN_CSRF_INVALID',403)
    with engine.begin() as c:
        context(c)
        row=c.execute(text('''SELECT u.id,u.password_hash,m.id AS membership_id,m.version FROM platform_users u
          JOIN tenant_memberships m ON m.user_id=u.id
          JOIN workshop_user_profiles p ON p.platform_user_id=u.id AND p.tenant_id=m.tenant_id
          WHERE lower(u.email)=:e AND m.tenant_id=:t AND u.status='ACTIVE' AND m.status='ACTIVE'
          AND p.archived_at IS NULL'''),{'e':value.email.strip().lower(),'t':TENANT}).mappings().first()
        if not row or not verify_password(value.password,row['password_hash']):
            event(c,'LOGIN_FAILED'); c.commit(); fail('INVALID_CREDENTIALS')
        c.execute(text('DELETE FROM database_sessions WHERE token_hash=:h'),{'h':digest(request.cookies.get(SESSION,''))})
        token=secrets.token_urlsafe(48); csrf=secrets.token_urlsafe(32)
        c.execute(text('''INSERT INTO database_sessions(token_hash,csrf_hash,tenant_id,user_id,membership_id,expires_at,membership_version)
          VALUES(:h,:c,:t,:u,:m,:e,:v)'''),{'h':digest(token),'c':digest(csrf),'t':TENANT,'u':row['id'],'m':row['membership_id'],'v':row['version'],'e':datetime.now(timezone.utc)+timedelta(seconds=TTL)})
        event(c,'LOGIN_SUCCEEDED',row['id'])
    response.set_cookie(SESSION,token,max_age=TTL,httponly=True,secure=True,samesite='lax')
    response.set_cookie(CSRF,csrf,max_age=TTL,secure=True,samesite='lax')
    response.delete_cookie(PREAUTH,secure=True,httponly=True,samesite='strict')
    return {'status':'ok'}

@app.get('/api/v1/session')
def session(request:Request):
    with engine.begin() as c:
        u=identify(c,request)
        return {'user':{'id':u['profile_id'],'name':u['name'],'email':u['email'],'role':u['role']},'expiresAt':u['expires_at']}

@app.post('/api/v1/auth/logout')
def logout(request:Request,response:Response):
    with engine.begin() as c:
        u=identify(c,request)
        c.execute(text('DELETE FROM database_sessions WHERE token_hash=:h'),{'h':u['token_hash']})
        event(c,'LOGOUT',u['user_id'])
    response.delete_cookie(SESSION,secure=True,httponly=True,samesite='lax')
    response.delete_cookie(CSRF,secure=True,samesite='lax')
    return {'status':'ok'}

def customer(row):
    result={k:row[k] for k in ['id','name','mobile','type','address','archived_at','created_at','updated_at','version']}
    result['archived_reason']=row['archive_reason']
    for field in ('created_at','updated_at'):
        if result[field] is None: result[field]=(row.get('historical_values') or {}).get(field)
        if isinstance(result[field],dict): result[field]=None
    return result

@app.get('/api/v1/customers')
def customers(request:Request):
    with business(request) as (c,_):
        return [customer(r) for r in c.execute(text('SELECT * FROM customers ORDER BY id')).mappings()]

@app.get('/api/v1/customers/{customer_id}')
def get_customer(customer_id:int,request:Request):
    with business(request) as (c,_):
        r=c.execute(text('SELECT * FROM customers WHERE id=:id'),{'id':customer_id}).mappings().first()
        if not r: fail('Customer not found.',404)
        vehicles=[dict(v) for v in c.execute(text('SELECT id,customer_id,number,make,model,archived_at FROM vehicles WHERE customer_id=:id ORDER BY id'),{'id':customer_id}).mappings()]
        jobs=[dict(j) for j in c.execute(text('''SELECT j.id,j.job_no,j.status AS main_status,v.number AS vehicle_number
          FROM job_cards j JOIN visits v0 ON v0.id=j.visit_id JOIN vehicles v ON v.id=v0.vehicle_id
          WHERE v0.customer_id=:id ORDER BY j.id DESC'''),{'id':customer_id}).mappings()]
        return {'customer':customer(r),'vehicles':vehicles,'jobs':jobs}

class CustomerInput(BaseModel):
    model_config=ConfigDict(extra='forbid')
    name:str
    mobile:str
    type:str
    address:str|None=None
    version:int|None=None

class ArchiveInput(BaseModel):
    reason:str
    version:int

def change(request,payload,customer_id=None,archive=False):
    data=payload.model_dump(); key=request.headers.get('idempotency-key','')
    try: UUID(key)
    except ValueError: fail('Request identity is required.',422)
    fingerprint=digest(json.dumps([customer_id,archive,data],sort_keys=True))
    with business(request,True) as (c,u):
        c.execute(text('SELECT pg_advisory_xact_lock(hashtext(:t))'),{'t':TENANT+':customers'})
        old=c.execute(text('SELECT * FROM customer_commands WHERE tenant_id=:t AND actor_id=:a AND request_key=:k'),{'t':TENANT,'a':u['user_id'],'k':key}).mappings().first()
        if old:
            if old['fingerprint']!=fingerprint: fail('Request identity conflict.',409)
            return old['result']
        before=None
        if customer_id:
            before=c.execute(text('SELECT * FROM customers WHERE id=:id FOR UPDATE'),{'id':customer_id}).mappings().first()
            if not before: fail('Customer not found.',404)
            if before['archived_at']: fail('Customer is archived.',409)
            if before['version']!=data['version']: fail('Customer changed. Reload before saving.',409)
        params={'id':customer_id,'a':u['user_id'],'t':TENANT,'b':BRANCH}
        if archive:
            if not data['reason'].strip(): fail('Archive reason is required.',422)
            params['reason']=data['reason'].strip()
            sql='UPDATE customers SET archived_at=now(),archived_by=:a,archive_reason=:reason,updated_by=:a,updated_at=now(),version=version+1 WHERE id=:id RETURNING *'
        else:
            for field,label in [('name','name'),('mobile','mobile'),('type','type')]:
                data[field]=data[field].strip()
                if not data[field]: fail(f'Customer {label} is required.',422)
            duplicate=c.scalar(text('SELECT id FROM customers WHERE mobile=:m AND archived_at IS NULL AND id<>:id'),{'m':data['mobile'],'id':customer_id or 0})
            if duplicate: fail('A customer with this mobile already exists.',409)
            params.update({k:data[k] for k in ('name','mobile','type')})
            params['address']=data['address'].strip() if data['address'] is not None else (before['address'] if before else '')
            sql=('UPDATE customers SET name=:name,mobile=:mobile,type=:type,address=:address,updated_by=:a,updated_at=now(),version=version+1 WHERE id=:id RETURNING *' if before else
                 'INSERT INTO customers(tenant_id,branch_id,name,mobile,type,address,created_by,updated_by) VALUES(:t,:b,:name,:mobile,:type,:address,:a,:a) RETURNING *')
        result=customer(c.execute(text(sql),params).mappings().one())
        serial=json.dumps(jsonable_encoder(result))
        c.execute(text('INSERT INTO customer_commands VALUES(:t,:a,:k,:f,CAST(:r AS jsonb))'),{'t':TENANT,'a':u['user_id'],'k':key,'f':fingerprint,'r':serial})
        return result

@app.post('/api/v1/customers')
def create(value:CustomerInput,request:Request): return change(request,value)

@app.put('/api/v1/customers/{customer_id}')
def update(customer_id:int,value:CustomerInput,request:Request): return change(request,value,customer_id)

@app.post('/api/v1/customers/{customer_id}/archive')
def archive(customer_id:int,value:ArchiveInput,request:Request): return change(request,value,customer_id,True)

from operations import router as operations_router
app.include_router(operations_router)
from estimate_documents import router as estimate_documents_router
app.include_router(estimate_documents_router)

from purchase_stock import router as purchase_stock_router
app.include_router(purchase_stock_router)

from financial_workflows import router as financial_router
app.include_router(financial_router)
from bookings import router as bookings_router
app.include_router(bookings_router)
from execution_workflows import router as execution_router
app.include_router(execution_router)
from administration import router as administration_router
app.include_router(administration_router)
from configuration import router as configuration_router
app.include_router(configuration_router)
from catalog_workflows import router as catalog_router
app.include_router(catalog_router)
from sales_workflows import router as sales_router
app.include_router(sales_router)
