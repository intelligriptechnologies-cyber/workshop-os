import os
assert os.environ.get('SLICE_STAGE')=='test'
from test_api import login,write,check,checks
from pathlib import Path
from uuid import uuid4
import json
c=login();service=login('service');store=login('store');before=len(checks)
def projection():return c.get('/api/v1/operations/projection').json()
p=projection()
request=next(r for r in p['material_requests'] if not r['archived_at'] and not r['invoiced_in'] and r['status']=='Requested' and any(j['id']==r['job_card_id'] and j['main_status']=='IN_PROGRESS' and j['advisor_id']==2 and not j['archived_at'] for j in p['job_cards']) and not any(a['job_card_id']==r['job_card_id'] for a in p['material_approvals']))
j=request['job_card_id']
def approval():return next(a for a in projection()['material_approvals'] if a['job_card_id']==j)
def job():return next(a for a in projection()['job_cards'] if a['id']==j)
path=f'/jobs/{j}/material-approval';body=dict(operation='submit',row_id=request['id'])
check('only Store submits',write(c,path,body).status_code==403)
key=str(uuid4());r=write(store,path,body,key=key);check('submit approval '+r.text[:160],r.status_code==200)
check('submission repeatable',write(store,path,body,key=key).json()==r.json())
check('pending and HOLD atomic',approval()['status']=='Pending' and job()['main_status']=='HOLD')
check('held job cannot bypass pending approval',write(c,f'/jobs/{j}/command',dict(version=job()['version'],operation='status',values=dict(target='IN_PROGRESS',note='Bypass attempt'))).status_code==409)
body=dict(operation='Rejected',reason='',version=approval()['version'])
check('rejection reason required',write(c,path,body).status_code==422)
check('failed rejection preserves Pending',approval()['status']=='Pending')
body['reason']='Confirm specification'
check('advisor cannot decide',write(service,path,body).status_code==403)
check('Admin rejection',write(c,path,body).status_code==200)
check('rejection retains HOLD',job()['main_status']=='HOLD' and approval()['rejection_reason']==body['reason'])
check('stale approval rejected',write(c,path,body).status_code==409)
check('only linked advisor resubmits',write(store,path,dict(operation='resubmit',version=approval()['version'])).status_code==403)
r=write(service,path,dict(operation='resubmit',version=approval()['version']));check('advisor resubmits '+r.text[:120],r.status_code==200)
check('resubmit increments revision and clears rejection',approval()['revision']==2 and approval()['rejection_reason'] is None and approval()['status']=='Pending')
r=write(c,path,dict(operation='Approved',version=approval()['version']));check('Admin approves '+r.text[:120],r.status_code==200)
check('approval and job resume atomic',approval()['status']=='Approved' and job()['main_status']=='IN_PROGRESS')
events=[e for e in projection()['material_approval_events'] if e['job_card_id']==j]
check('complete approval audit', [e['action'] for e in sorted(events,key=lambda e:e['id'])]==['Submitted','Rejected','Resubmitted','Approved'])
check('materials not issued or altered',next(r for r in projection()['material_requests'] if r['id']==request['id'])==request)
check('cross-session decision visible',next(a for a in service.get('/api/v1/operations/projection').json()['material_approvals'] if a['job_card_id']==j)['status']=='Approved')
Path('/slice/artifacts/material-approval-tests.json').write_text(json.dumps(dict(passed=len(checks)-before,checks=checks[before:],job_id=j),indent=2))
print(len(checks)-before,'material approval assertions passed')
