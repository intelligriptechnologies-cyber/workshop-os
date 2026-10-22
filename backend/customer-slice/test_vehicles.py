from test_api import login,write,check,checks
from uuid import uuid4
import json
from pathlib import Path
c=login(); before=len(checks)
rows=c.get('/api/v1/vehicles').json();check('132 imported vehicles',sum(r['id']<=132 for r in rows)==132)
v={'customer_id':1,'number':' TEST '+uuid4().hex[:10],'make':'Test','model':'Model','color':'Blue','km':10}
r=write(c,'/vehicles',v);check('vehicle create '+r.text[:80],r.status_code==200);row=r.json();id=row['id']
check('registration normalized',row['number']==v['number'].strip().upper())
check('duplicate registration denied',write(c,'/vehicles',v).status_code==409)
check('invalid parent rejected',write(c,'/vehicles',{**v,'number':uuid4().hex,'customer_id':999999}).status_code==404)
r=write(c,f'/vehicles/{id}',{**v,'customer_id':2,'km':15,'version':row['version']},'PUT');check('vehicle edit association',r.status_code==200 and r.json()['customer_id']==2);updated=r.json()
check('stale vehicle edit denied',write(c,f'/vehicles/{id}',{**v,'version':row['version']},'PUT').status_code==409)
other=login('reception');check('vehicle visible in another session',any(r['id']==id and r['km']==15 for r in other.get('/api/v1/vehicles').json()))
service=login('service');check('unauthorized vehicle mutation',write(service,'/vehicles',{**v,'number':uuid4().hex}).status_code==403)
r=write(c,f'/vehicles/{id}/archive',{'version':updated['version'],'reason':'Isolated test'});check('vehicle archive',r.status_code==200 and r.json()['archived_at'])
check('no destructive vehicle delete',c.delete(f'/api/v1/vehicles/{id}').status_code==405)
Path('/slice/artifacts/vehicle-api-tests.json').write_text(json.dumps({'passed':len(checks)-before,'checks':checks[before:]},indent=2));print(len(checks)-before,'vehicle assertions passed')
