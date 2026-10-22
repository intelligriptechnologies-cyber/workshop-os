from test_api import login,write,check,checks
import json
from pathlib import Path
c=login();before=len(checks)
def projection():return c.get('/api/v1/operations/projection').json()
p=projection();j=next(j for j in p['job_cards'] if j['id']<=145 and j['main_status']=='NEW' and len([i for i in p['checklist_items'] if i['job_card_id']==j['id']])==3)
for i in sorted([i for i in p['checklist_items'] if i['job_card_id']==j['id']],key=lambda i:i['sort_order']):
 i=next(x for x in projection()['checklist_items'] if x['id']==i['id'])
 if not i['checked_at']:
  r=write(c,f"/jobs/checklist/{i['id']}",{'version':i['version'],'checked':True});check('existing checklist step '+i['label'],r.status_code==200)
j=next(x for x in projection()['job_cards'] if x['id']==j['id'])
r=write(c,f"/jobs/{j['id']}/command",{'version':j['version'],'operation':'status','values':{'target':'IN_PROGRESS','note':'Isolated lifecycle verification'}});check('start work with complete checklist '+r.text[:100],r.status_code==200)
p=projection();new=next(x for x in p['job_cards'] if x['id']==j['id']);cycle=max([x for x in p['checklist_cycles'] if x['job_card_id']==j['id']],key=lambda x:x['id'])
check('new lifecycle cycle has all seven steps',len([x for x in p['checklist_items'] if x['checklist_cycle_id']==cycle['id']])==7)
check('status and identifier retained',new['main_status']=='IN_PROGRESS' and new['job_no']==j['job_no'])
Path('/slice/artifacts/lifecycle-api-tests.json').write_text(json.dumps({'passed':len(checks)-before,'checks':checks[before:]},indent=2));print(len(checks)-before,'lifecycle assertions passed')
