import os
assert os.environ.get('SLICE_STAGE')=='test'
from test_api import login,write,check,checks
from uuid import uuid4
from pathlib import Path
import json
from purchase_stock import po_number,po_ordinal
c=login();store=login('store');start=len(checks)
def projection():return c.get('/api/v1/operations/projection').json()
def get(t,id):return next(r for r in projection()[t] if r['id']==id)
def cmd(a,v={},id=None,t=None,client=c):return write(client,'/stock/command',dict(action=a,values=v,id=id,version=get(t,id)['version'] if id else None))
def ok(r):
 assert r.status_code==200,r.text
 return r.json()['id']
for ordinal in [0,99998,99999,2599973,2599974,2699973]:check('number roundtrip '+str(ordinal),po_ordinal(po_number(ordinal))==ordinal)
sids=[ok(cmd('supplier-save',dict(name='Split '+uuid4().hex))) for _ in range(2)]
i=projection()['inventory'][0]['id']
p=ok(cmd('po-save',dict(order_date='2026-10-22',lines=[dict(item_id=i,ordered_qty=2),dict(item_name='New request item',unit='piece',ordered_qty=3)]),client=store))
ls=[l for l in projection()['purchase_order_lines'] if l['purchase_order_id']==p]
ok(cmd('po-quote',dict(purchase_order_line_id=ls[0]['id'],supplier_name='Quoted supplier',quote_date='2026-10-22',quoted_qty=2,unit_cost=19),p,'purchase_orders'));check('quotation persisted',any(q['purchase_order_id']==p for q in projection()['purchase_order_quotations']))
sku='new-'+uuid4().hex[:12]
lines=[dict(purchase_order_line_id=ls[0]['id'],supplier_id=sids[0],unit_cost=10),dict(purchase_order_line_id=ls[1]['id'],supplier_id=sids[1],unit_cost=20,inventory_item=dict(sku=sku,name='New request item',category='Parts',unit='piece',low_stock_qty=1,selling_price=30))]
r=cmd('po-approve',dict(lines=lines),p,'purchase_orders');ok(r);ids=r.json()['ids'];check('supplier-specific split',len(ids)==2)
check('request number retained',get('purchase_orders',p)['po_number'].startswith('PO-WOS-'))
child=get('purchase_orders',ids[1]);check('child retains request link',child['source_purchase_order_id']==p)
new=next(x for x in projection()['inventory'] if x['sku']==sku.upper());check('new SKU has zero opening stock',new['stock_qty']==0)
check('supplier totals correct',[get('purchase_orders',id)['total'] for id in ids]==[20,60])
check('old line identity retained by split',next(l for l in projection()['purchase_order_lines'] if l['purchase_order_id']==ids[1])['source_purchase_order_line_id']==ls[1]['id'])
check('approved request editing denied',cmd('po-save',dict(order_date='2026-10-22',lines=[dict(item_id=i,ordered_qty=1)]),p,'purchase_orders',store).status_code==422)
p2=ok(cmd('po-save',dict(order_date='2026-10-22',lines=[dict(item_id=i,ordered_qty=1)]),client=store));ok(cmd('po-cancel',{},p2,'purchase_orders',store));check('request cancellation',get('purchase_orders',p2)['status']=='Cancelled')
ok(cmd('supplier-archive',{},sids[1],'suppliers'));check('supplier archive retains row',get('suppliers',sids[1])['status']=='Archived')
check('inactive supplier prevents issue',cmd('po-issue',{},ids[1],'purchase_orders').status_code==422)
ok(cmd('inventory-archive',dict(reason='Acceptance complete'),new['id'],'inventory'));check('inventory archive retains history',get('inventory',new['id'])['archived_at'] is not None)
# Fractional stock must not be silently rounded by the inherited numeric scale.
iid=ok(cmd('inventory-create',dict(sku='PREC'+uuid4().hex,name='Precision',category='Parts',unit='metre',stock_qty=0,low_stock_qty=0,selling_price=0)))
ok(cmd('stock-in',dict(qty=0.1234567),iid,'inventory'))
check('fractional signed stock retained',next(l for l in projection()['stock_ledger'] if l['item_id']==iid)['qty']==-0.1234567)
check('store cannot create catalogue outside approval',cmd('inventory-create',dict(sku='DENIED',name='Denied',category='Parts',unit='piece'),client=store).status_code==403)
Path('/slice/artifacts/purchase-stock-edge-tests.json').write_text(json.dumps(dict(passed=len(checks)-start,checks=checks[start:]),indent=2));print(len(checks)-start,'stock edge checks passed')
