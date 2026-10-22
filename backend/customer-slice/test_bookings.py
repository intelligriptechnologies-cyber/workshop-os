"""Booking parity against disposable PostgreSQL, never development fixtures."""
from test_api import login, write, check, checks
from uuid import uuid4
from datetime import date, timedelta
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json

c=login(); reception=login('reception'); before=len(checks)
def projection(client=c): return client.get('/api/v1/operations/projection').json()
def get(id): return next(b for b in projection()['bookings'] if b['id']==id)
def change(id,operation,values=None,client=c,key=None,version=None):
    return write(client,f'/bookings/{id}/command',dict(operation=operation,values=values or {},version=version if version is not None else get(id)['version']),key=key)
day=(date.today()+timedelta(days=30+int(uuid4().hex[:4],16))).isoformat()
body=dict(customerName='Booking '+uuid4().hex[:8],mobile=uuid4().hex,vehicleNo='BK'+uuid4().hex[:10],make='Test',model='Test',requestedWork='Inspection',serviceType='Service Work',bookingDate=day)
def create(client=c,data=None,key=None): return write(client,'/bookings/command',dict(operation='create',values=data or body),key=key)
def limits(sw,gc=4,client=c): return write(client,'/bookings/command',dict(operation='capacity',values=dict(bookingDate=day,serviceWork=sw,generalCheckupFollowup=gc)))
p=projection(); customers=len(p['customers']); vehicles=len(p['vehicles']); jobs=len(p['job_cards'])
check('historical booking snapshots exposed exactly',len([b for b in p['bookings'] if b['id']<=2])==2 and all(b['customer_id'] is None for b in p['bookings'] if b['id']<=2))
check('historical booking immutable',change(1,'cancel',{'note':'Must fail'}).status_code==409)
check('reception cannot change limits',limits(1,client=reception).status_code==403)
check('negative capacity denied',limits(-1).status_code==422)
check('set capacity',limits(1).status_code==200)
key=str(uuid4()); r=create(reception,key=key); check('create snapshot booking '+r.text[:100],r.status_code==200); id=r.json()['id']
check('idempotent booking create',create(reception,key=key).json()==r.json())
check('key conflict denied',create(reception,{**body,'model':'Changed'},key).status_code==409)
p=projection(); check('booking does not create masters or job',(len(p['customers']),len(p['vehicles']),len(p['job_cards']))==(customers,vehicles,jobs))
check('cross-session booking visibility',any(b['id']==id for b in projection(reception)['bookings']))
check('capacity denies reception',create(reception).status_code==409)
check('admin override requires reason',create().status_code==422)
r=create(data={**body,'capacityOverrideReason':'Approved test exception'}); check('admin override',r.status_code==200)
check('override audit retained',any(o['booking_id']==r.json()['id'] and o['reason']=='Approved test exception' for o in projection()['booking_capacity_overrides']))
for role in ('service','service_manager','accounts','store','tech'):
    check(role+' booking writes denied',create(login(role)).status_code==403)
check('blank input rejected',create(data={**body,'customerName':' '}).status_code==422)
check('bad date rejected',create(data={**body,'bookingDate':'2026-02-30'}).status_code==422)
check('unknown field rejected',create(data={**body,'trustedActor':1}).status_code==422)
v=get(id)['version']; check('confirm booking',change(id,'confirm').status_code==200)
check('stale version denied',change(id,'call',{'note':'Stale'},version=v).status_code==409)
check('empty call denied',change(id,'call',{'note':' '}).status_code==422)
check('call audit',change(id,'call',{'note':'Confirmed arrival'}).status_code==200)
check('call visible',any(x['booking_id']==id and x['note']=='Confirmed arrival' for x in projection(reception)['booking_call_logs']))
check('reschedule reason required',change(id,'reschedule',{'bookingDate':day,'arrivalWindow':'Evening'}).status_code==422)
check('reschedule',change(id,'reschedule',{'bookingDate':day,'arrivalWindow':'Evening','note':'Later','capacityOverrideReason':'Test capacity exception'}).status_code==200)
arrival=dict(odoReading=10,fuelLevelValue='4',fuelLevelUnit='bars',keys='1',accessories='',requestedWork='Inspection',damageMarks='[]')
check('bad intake rolls back',change(id,'check-in',{**arrival,'damageMarks':'bad'}).status_code==422 and get(id)['status']=='Rescheduled' and len(projection()['job_cards'])==jobs)
v=get(id)['version']; key=str(uuid4()); r=change(id,'check-in',arrival,reception,key,version=v); check('atomic check-in '+r.text[:100],r.status_code==200); result=r.json()
check('check-in retry same job',change(id,'check-in',arrival,reception,key,version=v).json()==result)
b=get(id); p=projection(); j=next(j for j in p['job_cards'] if j['id']==result['jobId'])
check('arrived links',b['status']=='Arrived' and b['visit_id']==j['visit_id'] and b['job_card_id']==j['id'] and b['customer_id']==result['customer_id'] and b['vehicle_id']==result['vehicle_id'])
check('advisor remains unassigned',j['advisor_id']==0)
check('duplicate check-in denied',change(id,'check-in',arrival).status_code==409)
check('terminal booking cannot change',change(id,'cancel',{'note':'Denied'}).status_code==409)
check('created job cross session',any(j['id']==result['jobId'] for j in projection(reception)['job_cards']))
check('intake artifacts present',all(any(r['job_card_id']==j['id'] for r in p[t]) for t in ('checklist_items','tasks','qc_checks','photos')))
day=(date.fromisoformat(day)+timedelta(days=1)).isoformat(); body['bookingDate']=day; check('race capacity setup',limits(1).status_code==200)
with ThreadPoolExecutor(max_workers=2) as pool:
    responses=list(pool.map(lambda _:create(login('reception')).status_code,range(2)))
check('one winner for last slot',sorted(responses)==[200,409])
winner=next(b for b in projection()['bookings'] if b['booking_date']==day)
check('cancel reason required',change(winner['id'],'cancel').status_code==422)
check('cancel frees capacity',change(winner['id'],'cancel',{'note':'Cancelled test'}).status_code==200 and create(reception).status_code==200)
Path('/slice/artifacts/booking-api-tests.json').write_text(json.dumps({'passed':len(checks)-before,'checks':checks[before:]},indent=2))
print(len(checks)-before,'booking assertions passed')
