"""Disposable PostgreSQL acceptance; never run against the development slice."""
import os
assert os.environ.get('SLICE_STAGE') == 'test'
from test_api import login, write, check, checks
from uuid import uuid4
from pathlib import Path
import json, base64

c=login(); start=len(checks)
def projection(client=c):return client.get('/api/v1/operations/projection').json()
def estimate(job_id):return next(e for e in projection()['estimates'] if e['job_card_id']==job_id and not e['archived_at'])
def job(job_id):return next(j for j in projection()['job_cards'] if j['id']==job_id)
def send(path,body,client=c,key=None):
    r=write(client,path,body,**({'key':key} if key else {}))
    return r

p=projection()
check('144 imported estimates loaded',sum(e['id']<=144 for e in p['estimates'])==144)
check('144 imported estimate lines loaded',sum(e['id']<=144 for e in p['estimate_items'])==144)
check('historical media marked unavailable',all(r['availability']=='UNAVAILABLE' and not r['src'] for r in p['photos'] if r['id']<=289))
body=dict(customerName='Estimate '+uuid4().hex[:8],mobile=uuid4().hex[:16],vehicleNo='EST'+uuid4().hex[:10],make='Test',model='Model',color='Blue',km=10,fuel='4 bars',fuelLevelValue='4',fuelLevelUnit='bars',requestedWork='Estimate integration acceptance',advisorId=2)
r=send('/reception/intake',body);check('new linked intake',r.status_code==200);j=r.json()['id']
draft=dict(version=None,discount=100,gst_rate=18,notes='Parity',items=[dict(kind='Service',description='Labour',qty=2,rate=500,gst_type='CGST+SGST',gst_rate=18),dict(kind='Material',description='Part',qty=1,rate=500,gst_type='IGST',gst_rate=12)])
key=str(uuid4());r=send(f'/jobs/{j}/estimate',draft,key=key);check('estimate create '+r.text[:150],r.status_code==200);e=r.json()
check('number preserved',e['number']=='EST-'+job(j)['job_no'])
check('proportional discount and mixed GST',e['totals']['total']==1624 and e['totals']['discount']==100 and e['totals']['gst']==224)
check('create idempotency',send(f'/jobs/{j}/estimate',draft,key=key).json()==e)
check('create conflict fails closed',send(f'/jobs/{j}/estimate',draft).status_code==409)
service=login('service');tech=login('tech');store=login('store')
draft['version']=estimate(j)['version'];draft['items'][0]['gst_type']='No GST';draft['discount']=2000
r=send(f'/jobs/{j}/estimate',draft,service);check('linked advisor edit '+r.text[:120],r.status_code==200)
check('discount capped and No GST normalized',r.json()['totals']['total']==0 and next(x for x in projection()['estimate_items'] if x['estimate_id']==e['id'] and not x['archived_at'])['gst_rate']==0)
check('stale estimate edit',send(f'/jobs/{j}/estimate',draft).status_code==409)
draft['version']=estimate(j)['version']
check('technician cannot edit',send(f'/jobs/{j}/estimate',draft,tech).status_code==403)
check('empty lines invalid',send(f'/jobs/{j}/estimate',{**draft,'items':[]}).status_code==422)
check('negative discount invalid',send(f'/jobs/{j}/estimate',{**draft,'discount':-1}).status_code==422)
check('invalid tax invalid',send(f'/jobs/{j}/estimate',{**draft,'items':[{**draft['items'][0],'gst_type':'IGST','gst_rate':17}]}).status_code==422)
active=[x for x in projection()['estimate_items'] if x['estimate_id']==e['id'] and not x['archived_at']]
check('line relationship unchanged',len(active)==2 and estimate(j)['job_card_id']==j)
snapshot=dict(templateId='acceptance',html='<html><body><h1>Estimate acceptance</h1></body></html>',values={},lines=[])
approval=dict(version=estimate(j)['version'],note='Customer confirmed',snapshot=snapshot)
check('approval note required',send(f'/jobs/{j}/estimate/approve',{**approval,'note':' '}).status_code==422)
check('unsafe document rejected',send(f'/jobs/{j}/estimate/approve',{**approval,'snapshot':{**snapshot,'html':'<script>alert(1)</script>'}}).status_code==422)
check('failed approval stays Draft',estimate(j)['status']=='Draft')
check('wrong role approval denied',send(f'/jobs/{j}/estimate/approve',approval,store).status_code==403)
r=send(f'/jobs/{j}/estimate/approve',approval,service);check('approval atomic '+r.text[:140],r.status_code==200)
check('approval does not advance main status',job(j)['main_status']=='NEW')
check('approval reconciles confirmation checklist atomically',all(i['checked_at'] for i in projection()['checklist_items'] if i['job_card_id']==j))
check('approval history',any(h['job_card_id']==j and h['note']=='Estimate approved: Customer confirmed' for h in projection()['status_history']))
snaps=service.get('/api/v1/documents/snapshots').json()
check('frozen document cross-session',any(s['jobId']==j and s['html']==snapshot['html'] for s in snaps))
check('repeat approval denied',send(f'/jobs/{j}/estimate/approve',{**approval,'version':estimate(j)['version']}).status_code==409)
draft['version']=estimate(j)['version'];draft['discount']=20
r=send(f'/jobs/{j}/estimate',draft);check('approved editor parity '+r.text[:140],r.status_code==200)
check('approved snapshot immutable after explicit edit',next(s for s in c.get('/api/v1/documents/snapshots').json() if s['jobId']==j)['html']==snapshot['html'])
check('approved status retained',estimate(j)['status']=='Approved')
check('approved estimate prefill denied',send(f'/jobs/{j}/estimate/prefill',dict(version=estimate(j)['version'])).status_code==409)
image='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII='
media=dict(label='Before proof',category='Before Work',src='data:image/png;base64,'+image,originalName='proof.png',width=1,height=1)
key=str(uuid4());r=send(f'/jobs/{j}/media',media,service,key);check('durable image upload '+r.text[:120],r.status_code==200);mid=r.json()['id']
check('upload deduplication',send(f'/jobs/{j}/media',media,service,key).json()==r.json())
check('cross-session exact bytes',c.get(f'/api/v1/media/{mid}/content').content==base64.b64decode(image))
check('unauthenticated retrieval denied',__import__('fastapi').testclient.TestClient(__import__('api').app).get(f'/api/v1/media/{mid}/content').status_code==401)
check('historical file not fabricated',c.get('/api/v1/media/1/content').status_code==404)
check('bad signature rejected',send(f'/jobs/{j}/media',{**media,'src':'data:image/png;base64,YmFk'}).status_code==422)
check('wrong phase denied',send(f'/jobs/{j}/media',{**media,'category':'After Work'}).status_code==409)
m=next(x for x in projection()['photos'] if x['id']==mid)
r=send(f'/media/{mid}/metadata',dict(version=m['version'],label='Updated proof',category='Before Work'));check('metadata edit',r.status_code==200)
check('wrong role media denied',send(f'/media/{mid}/metadata',dict(version=m['version'],label='Forbidden',category='Before Work'),tech).status_code==403)
m=next(x for x in projection()['photos'] if x['id']==mid)
check('archive media',send(f'/media/{mid}/archive',dict(version=m['version'],reason='Test complete')).status_code==200)
check('archived content unavailable',c.get(f'/api/v1/media/{mid}/content').status_code==404)
check('media association retained',next(x for x in projection()['photos'] if x['id']==mid)['job_card_id']==j)
check('estimate visible in independent session',any(x['id']==e['id'] for x in projection(service)['estimates']))
p=projection();historical=next(x for x in p['estimates'] if x['id']<=144 and x['status']=='Draft' and any(y['id']==x['job_card_id'] and y['main_status']=='NEW' and not y['archived_at'] for y in p['job_cards']))
hid=historical['job_card_id'];old_id=historical['id']
r=send(f'/jobs/{hid}/estimate',dict(version=historical['version'],discount=0,gst_rate=18,notes='Explicit disposable historical edit',items=[dict(kind='Service',description='Audited historical test edit',qty=1,rate=125,gst_type='CGST+SGST',gst_rate=18)]))
check('imported draft can be explicitly edited with audit '+r.text[:120],r.status_code==200)
check('imported estimate identity retained',estimate(hid)['id']==old_id)
from api import business
# Application reads return no custody payload or credential fields.
check('business projection excludes import custody',all('history_source_sha' not in x and 'historical_values' not in x for x in projection()['estimates']))
from types import SimpleNamespace
from operations import insert
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError,DBAPIError
request_context=SimpleNamespace(cookies=c.cookies,method='GET',headers={},url=SimpleNamespace(path='/api/v1/operations/projection'))
try:
 with business(request_context) as (connection,user):
  metadata=insert(connection,'job_media',dict(job_card_id=j,label='Rolled-back integrity fixture',category='Before Work',src='',created_by=user['user_id'],updated_by=user['user_id']))
  insert(connection,'slice_media_content',dict(job_card_id=1,media_id=metadata['id'],content=b'x',sha256='0'*64,created_by=user['user_id']))
 raise AssertionError('Wrong-job media association was accepted')
except IntegrityError as error:
 check('database rejects cross-job media content',error.orig.diag.constraint_name=='slice_media_content_same_job')
from document_security_test_support import assert_frozen_documents
with business(request_context) as (connection,user):
 assert_frozen_documents(connection,check,{'estimate'})
with business(request_context) as (connection,user):
 connection.execute(text("SELECT set_config('workshopos.branch_ids','{}',true)"))
 check('media bytes hidden outside branch scope',connection.scalar(text('SELECT count(*) FROM slice_media_content'))==0)
Path('/slice/artifacts/estimate-api-tests.json').write_text(json.dumps(dict(passed=len(checks)-start,checks=checks[start:],job_id=j),indent=2))
print(len(checks)-start,'estimate/document/media assertions passed')
