"""Financial acceptance on disposable slice_test; never mutate imported finance."""
import os
assert os.environ.get('SLICE_STAGE')=='test'
from test_api import login,write,check,checks
from uuid import uuid4
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json

c=login(); start=len(checks)
def projection(client=c): return client.get('/api/v1/operations/projection').json()
def get(table,id): return next(r for r in projection()[table] if r['id']==id)
def send(path,body,client=c,key=None,method='POST'):
    return write(client,'/financial'+path,body,method,key)
def ok(response):
    assert response.status_code==200,(response.status_code,response.text[:400])
    return response.json()
def transition(j,target):
    return write(c,f'/jobs/{j}/command',dict(version=get('job_cards',j)['version'],operation='status',values=dict(target=target,note='Financial acceptance')))
def tick(j):
    p=projection();cycle=max((x for x in p['checklist_cycles'] if x['job_card_id']==j),key=lambda x:x['id'])
    for item in sorted((x for x in p['checklist_items'] if x['checklist_cycle_id']==cycle['id']),key=lambda x:x['sort_order']):
        item=get('checklist_items',item['id'])
        if not item['checked_at'] and item['label']!='Payment Received':
            ok(write(c,f"/jobs/checklist/{item['id']}",dict(version=item['version'],checked=True,notApplicable=False)))
def new_job():
    j=ok(write(c,'/reception/intake',dict(customerName='Finance '+uuid4().hex[:8],mobile=uuid4().hex[:16],vehicleNo='FIN'+uuid4().hex[:10],make='Test',model='Model',color='Blue',km=10,fuel='4 bars',fuelLevelValue='4',fuelLevelUnit='bars',requestedWork='Financial acceptance',advisorId=2)))['id']
    e=ok(write(c,f'/jobs/{j}/estimate',dict(version=None,discount=0,gst_rate=18,notes='',items=[dict(kind='Service',description='Labour',qty=1,rate=100,gst_type='CGST+SGST',gst_rate=18)])))
    ok(write(c,f'/jobs/{j}/estimate/approve',dict(version=e['version'],note='Approved test',snapshot=dict(templateId='test',html='<html><body>Estimate</body></html>',values={},lines=[]))))
    ok(transition(j,'IN_PROGRESS'))
    return j
def draft(j): return dict(version=get('job_cards',j)['version'],tallyInvoiceNo='TALLY-TEST',discount=100,notes='Integration test',items=[dict(kind='Service',description='Labour',qty=2,rate=500,gst_type='CGST+SGST',gst_rate=18),dict(kind='Material',description='Part',qty=1,rate=500,gst_type='IGST',gst_rate=12)])
def edit_body(i):
    inv=get('invoices',i)
    return dict(version=inv['version'],tallyInvoiceNo=inv['tally_invoice_no'],discount=float(inv['discount']),notes=inv['notes'],note='',items=[{k:r[k] for k in ['id','kind','description','qty','rate','gst_type','gst_rate','material_row_id']} for r in projection()['invoice_items'] if r['invoice_id']==i and not r['archived_at']])
def snapshot(kind,number):return dict(kind=kind,number=number,templateId='test',html=f'<html><body>{kind} {number}</body></html>',values={},lines=[])
def payment(i):
    preview=ok(c.get(f'/api/v1/financial/invoices/{i}/payment-preview'))
    return dict(version=preview['version'],mode='UPI',otherDetail='',reference='TEST',notes='Acceptance',receiptNumber=preview['receiptNumber'],gatePassNumber=preview['gatePassNumber'],snapshots=[snapshot('invoice',get('invoices',i)['invoice_no']),snapshot('payment-receipt',preview['receiptNumber']),snapshot('gate-pass',preview['gatePassNumber'])])
historical={t:[r for r in projection()[t] if r['id']<=n] for t,n in [('invoices',52),('invoice_items',105),('payments',27),('receipts',27),('gate_passes',27)]}
j=new_job(); d=draft(j);key=str(uuid4());r=send(f'/jobs/{j}/invoice',d,key=key);inv=ok(r);i=inv['id']
check('invoice create and mixed tax proportional discount',inv['totals']['total']==1624 and inv['totals']['gst']==224)
check('approved numbering',get('invoices',i)['invoice_no']=='INV-'+str(8900+j).zfill(5))
check('invoice create retry',send(f'/jobs/{j}/invoice',d,key=key).json()==inv)
check('duplicate invoice denied',send(f'/jobs/{j}/invoice',d).status_code==409)
check('conflicting retry denied',send(f'/jobs/{j}/invoice',{**d,'notes':'conflict'},key=key).status_code==409)
accounts=login('accounts');tech=login('tech');service=login('service')
b=edit_body(i);b['items'][0]['rate']=550
check('edit requires note',send(f'/invoices/{i}',b,method='PUT').status_code==422)
b['note']='Rate correction';ok(send(f'/invoices/{i}',b,service,method='PUT'))
check('linked advisor edit persisted',get('invoices',i)['total']>1624)
check('stale edit denied',send(f'/invoices/{i}',b,method='PUT').status_code==409)
b=edit_body(i)
check('accounts edit denied',send(f'/invoices/{i}',b,accounts,method='PUT').status_code==403)
check('technician edit denied',send(f'/invoices/{i}',b,tech,method='PUT').status_code==403)
check('negative discount rejected',send(f'/invoices/{i}',{**b,'discount':-1},method='PUT').status_code==422)
check('empty lines rejected',send(f'/invoices/{i}',{**b,'items':[]},method='PUT').status_code==422)
check('foreign line rejected',send(f'/invoices/{i}',{**b,'items':[{**b['items'][0],'id':1}]},method='PUT').status_code==422)
check('invalid GST rejected',send(f'/invoices/{i}',{**b,'items':[{**b['items'][0],'gst_rate':17}]},method='PUT').status_code==422)
b['discount']=99999;b['note']='Cap discount';b['items'][0]['gst_type']='No GST';ok(send(f'/invoices/{i}',b,method='PUT'))
check('capped discount and no GST parity',get('invoices',i)['total']==0)
b=edit_body(i);b['discount']=0;b['note']='Restore invoice value';b['items']=b['items'][:1];ok(send(f'/invoices/{i}',b,method='PUT'))
check('removed line archived',len([r for r in projection()['invoice_items'] if r['invoice_id']==i and r['archived_at']])==1)
check('payment before completed denied',send(f'/invoices/{i}/payment',payment(i)).status_code==409)
tick(j);ok(transition(j,'COMPLETED'))
check('review reminder gate',send(f'/invoices/{i}/payment',payment(i)).status_code==409)
tick(j)
payment_step=next(x for x in projection()['checklist_items'] if x['job_card_id']==j and x['label']=='Payment Received')
check('existing payment N/A remains nonfinancial',write(c,f"/jobs/checklist/{payment_step['id']}",dict(version=payment_step['version'],checked=True,notApplicable=True)).status_code==200 and not any(x['invoice_id']==i for x in projection()['payments']))
check('existing payment N/A undo',write(c,f"/jobs/checklist/{payment_step['id']}",dict(version=get('checklist_items',payment_step['id'])['version'],checked=False,notApplicable=True)).status_code==200)
pb=payment(i)
check('arbitrary partial amount rejected',send(f'/invoices/{i}/payment',{**pb,'amount':1}).status_code==422)
check('other detail required',send(f'/invoices/{i}/payment',{**pb,'mode':'Other'}).status_code==422)
check('advisor payment denied',send(f'/invoices/{i}/payment',pb,service).status_code==403)
check('document validation rollback',send(f'/invoices/{i}/payment',{**pb,'snapshots':[dict(s,html='<script>bad</script>') for s in pb['snapshots']]}).status_code==422)
check('failed payment left no rows',not any(p['invoice_id']==i for p in projection()['payments']) and get('invoices',i)['status']=='Pending' and get('job_cards',j)['main_status']=='COMPLETED')
key=str(uuid4())
with ThreadPoolExecutor(2) as pool: results=list(pool.map(lambda _:send(f'/invoices/{i}/payment',pb,key=key),range(2)))
check('concurrent same-key payment one result',all(r.status_code==200 for r in results) and results[0].json()==results[1].json())
paid=results[0].json();p=projection()
check('one full payment allocation',len([r for r in p['payments'] if r['invoice_id']==i])==1 and next(r for r in p['payments'] if r['invoice_id']==i)['amount']==get('invoices',i)['total'])
check('invoice cleared and job closed',get('invoices',i)['status']=='Cleared' and get('job_cards',j)['main_status']=='CLOSED')
check('receipt gate pass and acknowledgement atomic',any(r['invoice_id']==i for r in p['receipts']) and any(r['invoice_id']==i for r in p['gate_passes']) and get('job_cards',j)['acknowledgement'])
check('three durable snapshots',len([r for r in p['document_snapshots'] if r['jobId']==j and r['kind'] in ('invoice','payment-receipt','gate-pass')])==3)
check('duplicate different-key payment blocked',send(f'/invoices/{i}/payment',pb).status_code==409)
check('payment payload-key conflict',send(f'/invoices/{i}/payment',{**pb,'reference':'different'},key=key).status_code==409)
check('closed job payment void denied',send(f"/payments/{paid['id']}/void",dict(version=get('payments',paid['id'])['version'],reason='Denied')).status_code==409)
check('closed invoice edit denied',send(f'/invoices/{i}',edit_body(i),method='PUT').status_code==409)
check('independent accounts session sees settlement',next(r for r in projection(accounts)['invoices'] if r['id']==i)['status']=='Cleared')
j2=new_job();i2=ok(send(f'/jobs/{j2}/invoice',draft(j2)))['id'];tick(j2);ok(transition(j2,'COMPLETED'));tick(j2)
vb=dict(version=get('invoices',i2)['version'],reason='Replace unpaid invoice',snapshot=snapshot('invoice',get('invoices',i2)['invoice_no']))
ok(send(f'/invoices/{i2}/void',vb,accounts));check('void retains original invoice',bool(get('invoices',i2)['voided_at']))
check('void document persisted',any(s['jobId']==j2 and s['state']=='void' for s in projection()['document_snapshots']))
i3=ok(send(f'/jobs/{j2}/invoice',draft(j2),accounts))['id'];check('replacement numbering unique',get('invoices',i3)['invoice_no']!=get('invoices',i2)['invoice_no'])
tick(j2);pb2=payment(i3)
with ThreadPoolExecutor(2) as pool: races=list(pool.map(lambda _:send(f'/invoices/{i3}/payment',pb2),range(2)))
check('competing payment identities one winner',sorted(r.status_code for r in races)==[200,409])
for table,records in historical.items():check('historical '+table+' exact preservation',records==[r for r in projection()[table] if r['id'] in {x['id'] for x in records}])
historical_invoice=historical['invoices'][0]
check('historical financial mutation denied',send(f"/invoices/{historical_invoice['id']}",{**edit_body(historical_invoice['id']),'notes':'must not save'},method='PUT').status_code==409)
check('historical payment denied',send(f"/invoices/{historical_invoice['id']}/payment",{**pb,'version':historical_invoice['version']}).status_code==409)
result=dict(passed=len(checks)-start,checks=checks[start:],settled_job=j,invoice_id=i)
Path('/slice/artifacts/financial-api-tests.json').write_text(json.dumps(result,indent=2));print(result['passed'],'financial checks passed')
