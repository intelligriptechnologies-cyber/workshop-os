from test_api import login,write,check,checks
from pathlib import Path
from uuid import uuid4
import json
c=login();advisor=login('service');before=len(checks)
def projection(client=c):return client.get('/api/v1/operations/projection').json()
def command(op,d,id=None,client=c,version=None,key=None):
    table='service_departments' if op.startswith('department-') else 'job_task_list_items' if op.startswith('tasklist-') else d.get('table') if op=='master-save' else 'service_catalog_items'
    v=next(r['version'] for r in projection()[table] if r['id']==id) if id else next(r['version'] for r in projection()['job_cards'] if r['id']==d['job_id']) if op=='tasklist-add' else None
    return write(client,'/catalog/command',dict(operation=op,values=d,id=id,version=version if version is not None else v),key=key)
def ok(r):check('API command '+r.text[:100],r.status_code==200);return r.json()['id']
p=projection();check('historical departments exact identities',[(d['id'],d['name']) for d in p['service_departments'] if d['id']<=2]==[(1,'General Service Work'),(2,'PPF/Paint Work')])
check('historical manager links preserved',all(x in p['service_department_managers'] for x in [dict(department_id=1,manager_id=9),dict(department_id=2,manager_id=10)]))
name='Catalog test '+uuid4().hex[:8];dep=ok(command('department-create',{'name':name}));v=next(r['version'] for r in projection()['service_departments'] if r['id']==dep)
check('duplicate department rejected',command('department-create',{'name':name}).status_code==422)
ok(command('department-update',{'name':name+' edited','status':'ACTIVE'},dep));check('stale department rejected',command('department-update',{'name':'Stale','status':'ACTIVE'},dep,version=v).status_code==409)
check('invalid manager role rejected',command('department-appoint',{'manager_id':2},dep).status_code==422)
ok(command('department-appoint',{'manager_id':9},dep));ok(command('department-assign',{'manager_id':9,'advisor_id':2},dep))
check('advisor link visible cross-session',dict(department_id=dep,manager_id=9,advisor_id=2) in projection(advisor)['service_advisor_teams'])
ok(command('department-remove-manager',{'manager_id':9},dep));check('remove manager also unassigns team',not any(r['department_id']==dep for r in projection()['service_advisor_teams']))
brand=ok(command('master-save',{'table':'service_brands','name':name}));segment=ok(command('master-save',{'table':'car_segments','name':name}))
item=dict(name=name,base_rate=99.25,gst_rate=9,service_department_id=dep,brand_id=brand,car_segment_id=segment)
catalog=ok(command('catalog-save',item));check('invalid GST rejected',command('catalog-save',{**item,'gst_rate':7}).status_code==422)
check('missing department rejected',command('catalog-save',{**item,'service_department_id':None}).status_code==404)
ok(command('catalog-save',{**item,'base_rate':105.5},catalog))
r=write(c,'/reception/intake',dict(customerName=name,mobile=uuid4().hex,vehicleNo='CAT'+uuid4().hex[:8],make='Test',model='Test',km=10,fuel='4 bars',requestedWork='Catalog task test',advisorId=2));job=ok(r)
task=ok(command('tasklist-add',{'job_id':job,'service_catalog_item_id':catalog},client=advisor));record=next(t for t in projection()['job_task_list_items'] if t['id']==task)
check('catalog snapshot preserves rate and GST',record['base_rate']==105.5 and record['gst_rate']==9)
ok(command('tasklist-update',{'name':name+' task','base_rate':111.11,'done':1},task,advisor))
ok(command('tasklist-add',{'job_id':job,'name':'Manual','base_rate':20,'gst_rate':0},client=advisor))
for role in ('reception','accounts','store','tech','service_manager'):
    client=login(role);check(role+' catalog writes denied',command('catalog-save',item,client=client).status_code==403);check(role+' task list writes denied',command('tasklist-update',{'name':'Denied','base_rate':1,'done':0},task,client).status_code==403)
ok(command('tasklist-archive',{},task,advisor));check('task archived',bool(next(t for t in projection()['job_task_list_items'] if t['id']==task)['archived_at']))
ok(command('catalog-archive',{},catalog));check('catalog archived',bool(next(t for t in projection()['service_catalog_items'] if t['id']==catalog)['archived_at']))
ok(command('department-update',{'name':name,'status':'ARCHIVED'},dep));check('archived department appointment denied',command('department-appoint',{'manager_id':9},dep).status_code==422)
Path('/slice/artifacts/catalog-api-tests.json').write_text(json.dumps({'passed':len(checks)-before,'checks':checks[before:]},indent=2));print(len(checks)-before,'catalog/team assertions passed')
