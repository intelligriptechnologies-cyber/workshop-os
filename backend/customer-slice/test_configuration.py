from test_api import login,write,check,checks
from pathlib import Path
from copy import deepcopy
from uuid import uuid4
import json
c=login();before=len(checks)
def current(client=c):
    r=client.get('/api/v1/configuration');check('configuration authenticated read',r.status_code==200);return r.json()
original=current();state=deepcopy(original['state'])
def save(s,version=None,key=None,client=c):return write(client,'/configuration',dict(version=current()['version'] if version is None else version,state=s),key=key)
try:
    key=str(uuid4());v=original['version'];state['businessSettings']['profile']['footer']='Configuration test '+uuid4().hex
    r=save(state,v,key);check('configuration save '+r.text[:150],r.status_code==200)
    check('idempotent settings save',save(state,v,key).json()==r.json())
    check('cross-session settings',current(login('reception'))['state']['businessSettings']['profile']['footer']==state['businessSettings']['profile']['footer'])
    check('stale settings conflict',save(state,v).status_code==409)
    bad=deepcopy(state);bad['businessSettings']['profile']['email']='invalid';check('business validation',save(bad).status_code==422)
    bad=deepcopy(state);bad['businessSettings']['billing']['defaultGstPercent']=101;check('GST validation',save(bad).status_code==422)
    bad=deepcopy(state);bad['reportTemplates'][0]['html']='{{unknown.key}}';check('template placeholders validated',save(bad).status_code==422)
    bad=deepcopy(state);bad['companyAssets']['logo']='data:image/png;base64,bm90YW5pbWFnZQ==';check('invalid image content rejected',save(bad).status_code==422)
    bad=deepcopy(state);bad['roles'][0]['status']='archived';check('owner role protected',save(bad).status_code==422)
    bad=deepcopy(state);bad['rolePageAccess']['admin']=[];check('owner admin access protected',save(bad).status_code==422)
    bad=deepcopy(state);bad['roles'][1]['systemRole']='admin';check('system role escalation rejected',save(bad).status_code==422)
    for role in ('reception','service','service_manager','accounts','store','tech'):check(role+' settings writes denied',save(state,client=login(role)).status_code==403)
    custom=dict(id='custom-987654',label='Test review role',description='Metadata only',isBuiltIn=False,status='active',createdAt='2026-10-22T00:00:00Z',updatedAt='2026-10-22T00:00:00Z')
    state['roles'].append(custom);state['rolePageAccess'][custom['id']]=['search'];check('custom role metadata persisted',save(state).status_code==200)
    state['rolePageAccess']['reception']=[p for p in state['rolePageAccess']['reception'] if p!='advance-bookings'];check('role page grant save',save(state).status_code==200)
    reception=login('reception');check('server enforces revoked page',write(reception,'/bookings/command',dict(operation='create',values={})).status_code==403)
finally:
    r=save(original['state']);assert r.status_code==200,r.text
check('test configuration restored',current()['state']==original['state'])
Path('/slice/artifacts/configuration-api-tests.json').write_text(json.dumps({'passed':len(checks)-before,'checks':checks[before:]},indent=2));print(len(checks)-before,'configuration assertions passed')
