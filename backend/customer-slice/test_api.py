import json,uuid
from pathlib import Path
from fastapi.testclient import TestClient
from api import app,ORIGIN
users=json.loads(Path('/slice/.generated/accounts.json').read_text())
checks=[]
def check(name,condition):
 assert condition,name
 checks.append(name)
def login(role='admin'):
 c=TestClient(app,base_url=ORIGIN); n=c.get('/api/v1/auth/config').json()['loginCsrf']; u=next(x for x in users if x['role']==role)
 r=c.post('/api/v1/auth/login',json={'email':u['email'],'password':u['password']},headers={'origin':ORIGIN,'x-login-csrf':n})
 check('login '+role,r.status_code==200)
 return c
def write(c,path,body,method='POST',key=None):
 return c.request(method,'/api/v1'+path,json=body,headers={'origin':ORIGIN,'x-workshopos-csrf':c.cookies['workshopos_csrf'],'idempotency-key':key or str(uuid.uuid4())})
c=login(); other=login('reception')
check('unauthenticated denied',TestClient(app,base_url=ORIGIN).get('/api/v1/customers').status_code==401)
check('121 imported customers',sum(r['id']<=121 for r in c.get('/api/v1/customers').json())==121)
check('session exposes no credentials',not any(x in c.get('/api/v1/session').text for x in ['password','hash','token']))
check('cookie protections',all(x.secure and (x.name!='workshopos_session' or x.has_nonstandard_attr('HttpOnly')) for x in c.cookies.jar))
body={'name':'API Test '+uuid.uuid4().hex[:8],'mobile':uuid.uuid4().hex[:16],'type':'Individual'}
check('csrf denied',c.post('/api/v1/customers',json=body,headers={'origin':ORIGIN,'idempotency-key':str(uuid.uuid4())}).status_code==403)
check('origin denied',c.post('/api/v1/customers',json=body,headers={'origin':'https://evil.example','x-workshopos-csrf':c.cookies['workshopos_csrf'],'idempotency-key':str(uuid.uuid4())}).status_code==403)
key=str(uuid.uuid4()); r=write(c,'/customers',body,key=key)
check('create '+str(r.status_code)+' '+r.text[:150],r.status_code==200); row=r.json(); rid=row['id']
check('repeat command stable',write(c,'/customers',body,key=key).json()==row)
check('duplicate mobile denied',write(c,'/customers',body).status_code==409)
check('required name',write(c,'/customers',{**body,'name':' '}).status_code==422)
check('cross-session read',other.get(f'/api/v1/customers/{rid}').json()['customer']['name']==body['name'])
r=write(c,f'/customers/{rid}',{**body,'name':body['name']+' edited','version':row['version']},'PUT')
check('edit '+r.text[:100],r.status_code==200); updated=r.json()
check('stale edit rejected',write(other,f'/customers/{rid}',{**body,'version':row['version']},'PUT').status_code==409)
check('cross-session edited value',other.get(f'/api/v1/customers/{rid}').json()['customer']['name']==updated['name'])
for role in ['service','service_manager','accounts','store','tech']:
 client=login(role)
 check('read '+role,client.get('/api/v1/customers').status_code==200)
 check('write denied '+role,write(client,'/customers',{**body,'mobile':uuid.uuid4().hex}).status_code==403)
check('archive reason required',write(c,f'/customers/{rid}/archive',{'reason':' ','version':updated['version']}).status_code==422)
r=write(c,f'/customers/{rid}/archive',{'reason':'Isolated API verification','version':updated['version']})
check('archive '+r.text[:100],r.status_code==200 and r.json()['archived_at'])
check('archived update denied',write(c,f'/customers/{rid}',{**body,'version':r.json()['version']},'PUT').status_code==409)
check('delete absent',c.delete(f'/api/v1/customers/{rid}').status_code==405)

original=c.get('/api/v1/customers/1').json()['customer']
edit={k:original[k] for k in ('name','mobile','type','address','version')}
r=write(c,'/customers/1',{**edit,'name':original['name']+' verification'},'PUT')
check('imported customer supports audited edit',r.status_code==200)
r=write(c,'/customers/1',{**edit,'version':r.json()['version']},'PUT')
check('imported values restored through API',r.status_code==200 and r.json()['name']==original['name'])
anon=TestClient(app,base_url=ORIGIN); admin=next(u for u in users if u['role']=='admin')
check('login CSRF required',anon.post('/api/v1/auth/login',json={'email':admin['email'],'password':admin['password']},headers={'origin':ORIGIN}).status_code==403)
n=anon.get('/api/v1/auth/config').json()['loginCsrf']
check('bad password denied',anon.post('/api/v1/auth/login',json={'email':admin['email'],'password':'deliberately-incorrect'},headers={'origin':ORIGIN,'x-login-csrf':n}).status_code==401)
check('failed login creates no session',anon.get('/api/v1/session').status_code==401)

oldcookie=c.cookies['workshopos_session']; check('logout',write(c,'/auth/logout',{}).status_code==200)
c.cookies.set('workshopos_session',oldcookie)
check('revoked replay denied',c.get('/api/v1/session').status_code==401)
Path('/slice/artifacts/backend-tests.json').write_text(json.dumps({'passed':len(checks),'checks':checks},indent=2))
print(f'{len(checks)} backend assertions passed')

