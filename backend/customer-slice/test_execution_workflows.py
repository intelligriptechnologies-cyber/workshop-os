from test_api import login,write,check,checks
from pathlib import Path
from uuid import uuid4
import json
c=login();tech=login('tech');advisor=login('service');before=len(checks)
def projection(client=c):return client.get('/api/v1/operations/projection').json()
body=dict(customerName='Execution '+uuid4().hex[:8],mobile=uuid4().hex,vehicleNo='EX'+uuid4().hex[:10],make='Test',model='Test',km=10,fuel='4 bars',requestedWork='Execution tests',advisorId=2)
r=write(c,'/reception/intake',body);check('execution test job created',r.status_code==200);job_id=r.json()['id']
def execute(op,values=None,id=None,client=c,version=None,key=None,job=job_id):
    table='tasks' if op.startswith('task-') else 'followups' if op.startswith('followup-') else 'qc_checks'
    record=next(r for r in projection()[table if id else 'job_cards'] if r['id']==(id or job))
    return write(client,'/execution/command',dict(operation=op,jobId=job,id=id,version=version or record['version'],values=values or {}),key=key)
key=str(uuid4());v=next(j for j in projection()['job_cards'] if j['id']==job_id)['version']
r=execute('task-create',{'title':'Added task','notes':'Notes','technician_id':6},client=tech,key=key,version=v);check('technician creates task '+r.text[:150],r.status_code==200);task_id=r.json()['id']
check('idempotent task create',execute('task-create',{'title':'Added task','notes':'Notes','technician_id':6},client=tech,key=key,version=v).json()==r.json())
check('empty task rejected',execute('task-create',{'title':' '}).status_code==422)
check('advisor cannot update technician task',execute('task-update',{'status':'Started'},task_id,advisor).status_code==403)
check('invalid task state rejected',execute('task-update',{'status':'Invented'},task_id).status_code==422)
v=next(t for t in projection()['tasks'] if t['id']==task_id)['version']
for status in ('Started','Paused','Completed'):
    check('task '+status,execute('task-update',{'status':status,'notes':status+' note'},task_id,tech).status_code==200)
check('stale task denied',execute('task-update',{'status':'Paused'},task_id,version=v).status_code==409)
task=next(t for t in projection(advisor)['tasks'] if t['id']==task_id)
check('task timestamps persist across sessions',all(task[k] for k in ('started_at','paused_at','completed_at')) and task['status']=='Completed')
qc=next(q for q in projection()['qc_checks'] if q['job_card_id']==job_id);count=len(projection()['tasks'])
r=execute('qc-rework',{'reason':'Rework required','technician_id':6},qc['id'],tech);check('QC rework transaction '+r.text[:100],r.status_code==200)
check('QC and rework atomic',len(projection()['tasks'])==count+1 and next(q for q in projection()['qc_checks'] if q['id']==qc['id'])['fail_reason']=='Rework required')
check('QC all passes',execute('qc-all',client=tech).status_code==200)
check('washing flag',execute('washing',client=tech).status_code==200)
check('technician cannot create followup',execute('followup-create',{'note':'Denied'},client=tech).status_code==403)
r=execute('followup-create',{'note':'Call customer','due_at':'2026-10-25','done':0},client=advisor);check('advisor followup create '+r.text[:100],r.status_code==200);followup_id=r.json()['id']
check('followup empty denied',execute('followup-create',{'note':' '},client=advisor).status_code==422)
check('followup bad date denied',execute('followup-create',{'note':'Call','due_at':'bad'},client=advisor).status_code==422)
check('resolve prior contacts',execute('followup-create',{'note':'Customer contacted','done':1,'resolvePrevious':True},client=advisor).status_code==200)
check('earlier followup closed',next(f for f in projection()['followups'] if f['id']==followup_id)['done']==1)
check('followup edit',execute('followup-update',{'note':'Edited','due_at':'2026-10-26','done':0},followup_id,advisor).status_code==200)
check('followup complete',execute('followup-done',{'outcome':'Reached'},followup_id,advisor).status_code==200)
check('followup archive',execute('followup-archive',{'reason':'Test complete'},followup_id,advisor).status_code==200)
check('archived followup edit denied',execute('followup-update',{'note':'Denied','done':0},followup_id,advisor).status_code==409)
for role in ('reception','accounts','store','service_manager'):
    client=login(role);check(role+' execution denied',execute('task-create',{'title':'Denied'},client=client).status_code==403)
check('task archive',execute('task-archive',{'reason':'Test complete'},task_id,tech).status_code==200)
j=next(j for j in projection()['job_cards'] if j['id']==job_id)
check('cancel test job',write(c,f'/jobs/{job_id}/command',dict(operation='status',version=j['version'],values=dict(target='CANCELLED',note='Test complete'))).status_code==200)
check('terminal task creation denied',execute('task-create',{'title':'Denied'}).status_code==409)
check('terminal followup creation denied',execute('followup-create',{'note':'Denied'},client=advisor).status_code==409)
Path('/slice/artifacts/execution-api-tests.json').write_text(json.dumps({'passed':len(checks)-before,'checks':checks[before:]},indent=2));print(len(checks)-before,'execution assertions passed')
