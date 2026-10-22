"""Ownership changes preserve historical visit/customer associations."""
from test_api import login,write,check,checks
from uuid import uuid4
from pathlib import Path
import json
c=login();before=len(checks)
p=lambda:c.get('/api/v1/operations/projection').json()
original=p();vehicle=next(v for v in original['vehicles'] if v['id']==1)
# Source customer association remains available in immutable import provenance.
vehicle['customer_id']=1
visits=[v for v in original['visits'] if v['vehicle_id']==1];check('fixture has historical visits',bool(visits))
payload={k:vehicle[k] for k in ('customer_id','number','make','model','color','km','engine_no')}
new_owner=write(c,'/customers',dict(name='Ownership '+uuid4().hex[:8],mobile=uuid4().hex,type='Individual')).json()['id']
key=str(uuid4());r=write(c,'/vehicles/1',dict(**{**payload,'customer_id':new_owner},version=vehicle['version']),'PUT',key)
check('historical vehicle current owner changes '+r.text[:100],r.status_code==200)
check('retry deduplicated',write(c,'/vehicles/1',dict(**{**payload,'customer_id':new_owner},version=vehicle['version']),'PUT',key).json()==r.json())
check('historical visits unmodified',[v for v in p()['visits'] if v['vehicle_id']==1]==visits)
other=login('reception');check('new owner cross session',next(v for v in other.get('/api/v1/vehicles').json() if v['id']==1)['customer_id']==new_owner)
check('old customer retains job history',bool(c.get('/api/v1/customers/'+str(vehicle['customer_id'])).json()['jobs']))
check('stale transfer rejected',write(c,'/vehicles/1',dict(**payload,version=vehicle['version']),'PUT').status_code==409)
check('restore owner with audited write',write(c,'/vehicles/1',dict(**payload,version=r.json()['version']),'PUT').status_code==200)
Path('/slice/artifacts/ownership-api-tests.json').write_text(json.dumps(dict(passed=len(checks)-before,checks=checks[before:]),indent=2))
print(len(checks)-before,'ownership checks passed')
