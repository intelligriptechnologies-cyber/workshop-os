from test_api import login,write,check,checks
from fastapi.testclient import TestClient
from api import app,ORIGIN
from uuid import uuid4
from pathlib import Path
import json
c=login();before=len(checks)
def users():return c.get('/api/v1/operations/projection').json()['users']
def user(id):return next(u for u in users() if u['id']==id)
def change(op,id=None,**values):return write(c,'/administration/users',dict(operation=op,**({'id':id,'version':user(id)['version']} if id else {}),**values))
def signin(email,password):
    client=TestClient(app,base_url=ORIGIN);nonce=client.get('/api/v1/auth/config').json()['loginCsrf'];r=client.post('/api/v1/auth/login',json=dict(email=email,password=password),headers={'origin':ORIGIN,'x-login-csrf':nonce});return client,r
email='admin-test-'+uuid4().hex+'@example.com';password=uuid4().hex
body=dict(name='Managed account',email=email,role='reception',password=password)
key=str(uuid4());r=write(c,'/administration/users',dict(operation='create',**body),key=key);check('create account '+r.text[:100],r.status_code==200);id=r.json()['id']
check('idempotent account creation',write(c,'/administration/users',dict(operation='create',**body),key=key).json()==r.json())
check('password never projected',password not in json.dumps(users()) and user(id)['password']=='********')
client,r=signin(email,password);check('new account manual login',r.status_code==200 and client.get('/api/v1/session').json()['user']['role']=='reception')
check('duplicate email denied',change('create',**body).status_code==409)
check('short password denied',change('create',**{**body,'email':'another-'+email,'password':'123'}).status_code==422)
check('invalid role denied',change('create',**{**body,'email':'another-'+email,'role':'superuser'}).status_code==422)
check('update preserves password when omitted',change('update',id,name='Renamed',email=email,role='accounts').status_code==200)
check('old session revoked on role edit',client.get('/api/v1/session').status_code==401)
client,r=signin(email,password);check('same password new role',r.status_code==200 and client.get('/api/v1/session').json()['user']['role']=='accounts')
new_password=uuid4().hex;check('password rotation',change('update',id,name='Renamed',email=email,role='accounts',password=new_password).status_code==200)
check('old password rejected',signin(email,password)[1].status_code==401)
client,r=signin(email,new_password);check('new password accepted',r.status_code==200)
v=user(id)['version'];check('stale user edit denied',write(c,'/administration/users',dict(operation='update',id=id,version=v-1,name='Stale',email=email,role='accounts')).status_code==409)
check('cannot archive self',change('archive',1,reason='Denied').status_code==409)
for role in ('reception','service','service_manager','accounts','store','tech'):
    check(role+' user administration denied',write(login(role),'/administration/users',dict(operation='create',**body)).status_code==403)
locked=next(u for u in users() if u['email']=='general.service.manager@example.com')
check('preloaded manager locked',change('update',locked['id'],name='Denied',email=locked['email'],role=locked['role']).status_code==409)
check('archive account',change('archive',id,reason='Isolated test complete').status_code==200)
check('archive revokes session',client.get('/api/v1/session').status_code==401)
check('archived account login denied',signin(email,new_password)[1].status_code==401)
check('archived history retained',bool(user(id)['archived_at']) and user(id)['archived_reason']=='Isolated test complete')
Path('/slice/artifacts/administration-api-tests.json').write_text(json.dumps({'passed':len(checks)-before,'checks':checks[before:]},indent=2));print(len(checks)-before,'administration assertions passed')
