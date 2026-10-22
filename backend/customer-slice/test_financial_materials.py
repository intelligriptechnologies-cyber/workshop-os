from financial_test_support import c,projection,get,ok,new_job,stock,material
from test_api import write,check,checks
from uuid import uuid4
from pathlib import Path
import json
start=len(checks)
j=new_job();j2=new_job()
item=ok(stock('inventory-create',values=dict(sku='FIN'+uuid4().hex,name='Financial test part',category='Parts',unit='piece',stock_qty=10,selling_price=20)))['id']
r=material(j,item,True);foreign=material(j2,item,True);unissued=material(j,item)
def invoice(material_id):return dict(version=get('job_cards',j)['version'],tallyInvoiceNo='',discount=0,notes='',items=[dict(kind='Material',description='Part',qty=1,rate=20,gst_type='CGST+SGST',gst_rate=18,material_row_id=material_id)])
def create(body):return write(c,f'/financial/jobs/{j}/invoice',body)
check('foreign job material denied',create(invoice(foreign)).status_code==422)
check('unissued material denied',create(invoice(unissued)).status_code==422)
body=invoice(r);body['items']*=2
check('duplicate material claim denied',create(body).status_code==422)
check('failed claims roll back invoice and claim',not any(i['job_card_id']==j for i in projection()['invoices']) and get('material_requests',r)['invoiced_in'] is None)
ledger=[x for x in projection()['stock_ledger'] if x['item_id']==item]
i=ok(create(invoice(r)))['id']
check('issued material claimed by invoice',get('material_requests',r)['invoiced_in']==i)
check('invoicing never consumes stock twice',ledger==[x for x in projection()['stock_ledger'] if x['item_id']==item])
check('invoiced material stock edit denied',stock('material-edit-issued',r,dict(item_id=item,qty=2,note='Denied')).status_code==422)
line=next(x for x in projection()['invoice_items'] if x['invoice_id']==i and not x['archived_at'])
body=dict(version=get('invoices',i)['version'],tallyInvoiceNo='',discount=0,notes='',note='Remove claimed part',items=[dict(kind='Service',description='Labour',qty=1,rate=10,gst_type='No GST',gst_rate=0)])
ok(write(c,f'/financial/invoices/{i}',body,'PUT'));check('line removal unlocks material without stock replay',get('material_requests',r)['invoiced_in'] is None and ledger==[x for x in projection()['stock_ledger'] if x['item_id']==item])
active=[x for x in projection()['invoice_items'] if x['invoice_id']==i and not x['archived_at']]
body['version']=get('invoices',i)['version'];body['items']=[{k:x[k] for k in ['id','kind','description','qty','rate','gst_type','gst_rate','material_row_id']} for x in active]+invoice(r)['items'];body['note']='Add late issued material'
ok(write(c,f'/financial/invoices/{i}',body,'PUT'));check('late material pickup',get('material_requests',r)['invoiced_in']==i)
check('material linkage is immutable on line edit',write(c,f'/financial/invoices/{i}',{**body,'version':get('invoices',i)['version'],'items':[{**x,'material_row_id':foreign} for x in body['items'] if x.get('id')]},'PUT').status_code==422)
Path('/slice/artifacts/financial-material-tests.json').write_text(json.dumps(dict(passed=len(checks)-start,checks=checks[start:]),indent=2));print(len(checks)-start,'financial material checks passed')
