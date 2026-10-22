import os
assert os.environ.get('SLICE_STAGE')=='test'
from test_api import login,write,check,checks
from uuid import uuid4
import json
from pathlib import Path
c=login();store=login('store');start=len(checks)
def projection():return c.get('/api/v1/operations/projection').json()
def get(t,id):return next(r for r in projection()[t] if r['id']==id)
def cmd(action,values={},id=None,table=None,client=c,key=None,version=None):
 body=dict(action=action,values=values,id=id,version=version if version is not None else get(table,id)['version'] if id and table else None)
 return write(client,'/stock/command',body,**({'key':key} if key else {}))
def ok(r):
 assert r.status_code==200,r.text
 return r.json()['id']
check('projection accessible',c.get('/api/v1/operations/projection').status_code==200)
sid=ok(cmd('supplier-save',dict(name='Stock supplier '+uuid4().hex[:6])));check('supplier create',get('suppliers',sid)['status']=='Active')
check('supplier role',cmd('supplier-save',dict(name='Denied'),client=store).status_code==403)
iid=ok(cmd('inventory-create',dict(sku='STK'+uuid4().hex,name='Stock part',category='Parts',unit='piece',stock_qty=10,low_stock_qty=2,selling_price=50)))
check('inventory create',get('inventory',iid)['stock_qty']==10)
po=ok(cmd('po-save',dict(order_date='2026-10-22',notes='Acceptance',lines=[dict(item_id=iid,ordered_qty=5)]),client=store))
ls=[l for l in projection()['purchase_order_lines'] if l['purchase_order_id']==po]
ok(cmd('po-approve',dict(lines=[dict(purchase_order_line_id=ls[0]['id'],supplier_id=sid,unit_cost=20)]),po,'purchase_orders'))
ok(cmd('po-issue',{},po,'purchase_orders'))
ok(cmd('po-receive',dict(lines=[dict(purchase_order_line_id=ls[0]['id'],delivered_qty=5)]),po,'purchase_orders'))
check('receipt does not post stock',not any(l['item_id']==iid for l in projection()['stock_ledger']))
check('over delivery denied',cmd('po-receive',dict(lines=[dict(purchase_order_line_id=ls[0]['id'],delivered_qty=1)]),po,'purchase_orders').status_code==422)
ok(cmd('po-confirm',dict(lines=[dict(purchase_order_line_id=ls[0]['id'],accepted_qty=3,returned_qty=1,damaged_qty=1,wasted_qty=0)]),po,'purchase_orders'))
k=str(uuid4());v=get('purchase_orders',po)['version'];r=cmd('po-close',{},po,'purchase_orders',key=k,version=v);ok(r)
check('close replay',cmd('po-close',{},po,'purchase_orders',key=k,version=v).json()==r.json())
check('one closure posting',len([l for l in projection()['stock_ledger'] if l['item_id']==iid])==1)
check('accepted only posted',next(l for l in projection()['stock_ledger'] if l['item_id']==iid)['qty']==-3)
check('historical four signed rows',len([l for l in projection()['stock_ledger'] if l['id']<=4])==4)
check('historical three inward rows',len([l for l in projection()['stock_inwards'] if l['id']<=3])==3)

def onhand(id):
 p=projection();return float(get('inventory',id)['stock_qty'])-sum(float(l['qty']) for l in p['stock_ledger'] if l['item_id']==id)
check('stock calculation parity',onhand(iid)==13)
ok(cmd('supplier-save',dict(name='Edited supplier '+str(sid),status='On hold'),sid,'suppliers'));check('supplier edit',get('suppliers',sid)['status']=='On hold')
ok(cmd('supplier-save',dict(name='Edited supplier '+str(sid),status='Active'),sid,'suppliers'))
check('stale stock rejected',cmd('stock-adjust',dict(qty=0),iid,'inventory',version=999999).status_code==409)
ok(cmd('stock-adjust',dict(qty=10),iid,'inventory'));check('absolute adjustment',onhand(iid)==10)
job=next(j for j in projection()['job_cards'] if j['main_status']=='IN_PROGRESS' and not j['archived_at'] and not any(a['job_card_id']==j['id'] and a['status'] in ('Pending','Rejected') for a in projection()['material_approvals']))
mid=ok(cmd('material-add',dict(job_id=job['id'],item_id=iid,qty=7)))
ok(cmd('material-edit',dict(item_id=iid,qty=8),mid,'material_requests'))
ok(cmd('material-request',{},mid,'material_requests'));check('request retains on hand',onhand(iid)==10)
ok(cmd('material-release',{},mid,'material_requests',client=store));check('release consumes once',onhand(iid)==2)
check('double consumption rejected',cmd('material-release',{},mid,'material_requests',client=store).status_code==422)
ok(cmd('material-reconcile',dict(used=5,returned=2,wasted=1),mid,'material_requests',client=store));check('return reverses stock',onhand(iid)==4)
ok(cmd('material-reconcile',dict(used=5,returned=2,wasted=1),mid,'material_requests',client=store));check('reconcile repeat has no double return',onhand(iid)==4)
# Concurrent releases compete for the same stock; only one may consume it.
ids=[]
for _ in range(2):
 m=ok(cmd('material-add',dict(job_id=job['id'],item_id=iid,qty=3)));ok(cmd('material-request',{},m,'material_requests'));ids.append(m)
from concurrent.futures import ThreadPoolExecutor
clients=[login('store'),login('store')];versions=[get('material_requests',m)['version'] for m in ids]
with ThreadPoolExecutor(2) as pool:
 results=list(pool.map(lambda n:cmd('material-release',{},ids[n],'material_requests',client=clients[n],version=versions[n]),range(2)))
check('concurrent releases one winner',sorted(r.status_code for r in results)==[200,422]);check('no negative stock after race',onhand(iid)==1)
loser=ids[next(n for n,r in enumerate(results) if r.status_code!=200)];ok(cmd('material-cancel',{},loser,'material_requests'));check('cancel unissued does not change stock',onhand(iid)==1)
# Repeated identical idempotency keys from independent sessions of one actor.
k=str(uuid4());version=get('inventory',iid)['version'];clients=[login(),login()]
with ThreadPoolExecutor(2) as pool:
 results=list(pool.map(lambda n:cmd('stock-in',dict(qty=2),iid,'inventory',client=clients[n],version=version,key=k),range(2)))
check('concurrent idempotent inward',all(r.status_code==200 for r in results) and results[0].json()==results[1].json());check('one inward despite replay',onhand(iid)==3)
check('idempotency key payload conflict',cmd('stock-in',dict(qty=3),iid,'inventory',key=k,version=version).status_code==409)
check('invalid negative adjustment',cmd('stock-adjust',dict(qty=-1),iid,'inventory').status_code==422)
check('stock wrong role',cmd('stock-in',dict(qty=1),iid,'inventory',client=login('tech')).status_code==403)
# Separate inward purchase pipeline and durable invoice file.
import base64
pdf=b'%PDF-1.4\nAcceptance invoice file\n%%EOF'
line=dict(item_id=iid,received_qty=4,unit_cost=25,discount=5,gst_rate=18)
pid=ok(cmd('inward-save',dict(supplier_id=sid,supplier_invoice_no='INV-'+uuid4().hex,invoice_date='2026-10-22',lines=[line])))
ok(cmd('inward-send',{},pid,'inward_purchases'));ok(cmd('inward-approve',{},pid,'inward_purchases'))
receipt=get('inward_purchases',pid);pl=next(l for l in projection()['inward_purchase_lines'] if l['purchase_id']==pid)
file=dict(original_name='invoice.pdf',mime_type='application/pdf',byte_size=len(pdf),document_url='data:application/pdf;base64,'+base64.b64encode(pdf).decode())
values=dict(supplier_invoice_no=receipt['supplier_invoice_no'],invoice_date='2026-10-22',lines=[dict(**line,purchase_order_line_id=pl['purchase_order_line_id'])],attachments=[file])
before=onhand(iid);ok(cmd('inward-receive',values,pid,'inward_purchases'));check('receipt posts exact quantity',onhand(iid)==before+4)
check('double receipt rejected',cmd('inward-receive',values,pid,'inward_purchases').status_code==422)
attachment=next(f for f in projection()['inward_purchase_attachments'] if f['purchase_id']==pid)
check('invoice bytes across session',store.get(attachment['document_url']).content==pdf)
ok(cmd('inward-revise',dict(reason='Returned one',lines=[{**line,'received_qty':3}]),pid,'inward_purchases'));check('revision reverses difference',onhand(iid)==before+3)
check('receipt original values retained',next(l for l in projection()['inward_purchase_lines'] if l['purchase_id']==pid)['received_qty']==4)
# A revision that would remove stock already consumed must roll back all rows.
ok(cmd('stock-adjust',dict(qty=0),iid,'inventory'));n=len(projection()['inward_purchase_revisions'])
check('unsafe revision rejected',cmd('inward-revise',dict(reason='Unavailable return',lines=[{**line,'received_qty':1}]),pid,'inward_purchases').status_code==422)
check('failed revision is atomic',len(projection()['inward_purchase_revisions'])==n and onhand(iid)==0)
check('cross session records',any(r['id']==pid for r in store.get('/api/v1/operations/projection').json()['inward_purchases']))
Path('/slice/artifacts/purchase-stock-tests.json').write_text(json.dumps(dict(passed=len(checks)-start,checks=checks[start:],item_id=iid,supplier_id=sid,po_id=po),indent=2));print(len(checks)-start,'stock checks passed')
