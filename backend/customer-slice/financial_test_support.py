"""Additive test-only fixtures created through the authorized API, never a reset."""
import os
assert os.environ.get('SLICE_STAGE')=='test'
from test_api import login,write
from uuid import uuid4

c=login()
def projection():return c.get('/api/v1/operations/projection').json()
def get(table,id):return next(r for r in projection()[table] if r['id']==id)
def ok(r):
    assert r.status_code==200,(r.status_code,r.text[:300])
    return r.json()
def new_job():
    j=ok(write(c,'/reception/intake',dict(customerName='Finance fixture '+uuid4().hex[:8],mobile=uuid4().hex[:16],vehicleNo='FF'+uuid4().hex[:10],make='Test',model='Model',color='Blue',km=10,fuel='4 bars',fuelLevelValue='4',fuelLevelUnit='bars',requestedWork='Financial fixture',advisorId=2)))['id']
    e=ok(write(c,f'/jobs/{j}/estimate',dict(version=None,discount=0,gst_rate=18,notes='',items=[dict(kind='Service',description='Labour',qty=1,rate=100,gst_type='CGST+SGST',gst_rate=18)])))
    ok(write(c,f'/jobs/{j}/estimate/approve',dict(version=e['version'],note='Approved fixture',snapshot=dict(templateId='test',html='<html><body>Estimate</body></html>',values={},lines=[]))))
    ok(write(c,f'/jobs/{j}/command',dict(version=get('job_cards',j)['version'],operation='status',values=dict(target='IN_PROGRESS',note='Fixture'))))
    return j
def stock(action,id=None,values=None):
    table='material_requests' if action.startswith('material-') else 'inventory'
    return write(c,'/stock/command',dict(action=action,id=id,version=get(table,id)['version'] if id else None,values=values or {}))
def material(j,item,release=False):
    r=ok(stock('material-add',values=dict(job_id=j,item_id=item,qty=1)))['id'];ok(stock('material-request',r))
    if release:ok(stock('material-release',r))
    return r
if __name__=='__main__':
    for _ in range(2):material(new_job(),1)
    print('Two fresh eligible approval fixtures created through APIs; no data reset')
