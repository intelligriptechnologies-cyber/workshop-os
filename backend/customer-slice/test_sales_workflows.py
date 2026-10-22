from test_api import login,write,check,checks
from uuid import uuid4
from pathlib import Path
import json
c=login();before=len(checks)
def projection(client=c):return client.get('/api/v1/operations/projection').json()
def command(op,d,id=None,client=c,key=None,version=None):
    table='sales_leads' if op=='lead-save' else 'sales_quotations'
    v=next(r['version'] for r in projection()[table] if r['id']==id) if id else None
    return write(client,'/sales/command',dict(operation=op,values=d,id=id,version=version if version is not None else v),key=key)
lead=dict(display_name='CRM '+uuid4().hex[:8],phone=uuid4().hex[:16],company='',company_not_entered=1,email='',email_not_entered=1,follow_up_due='',site_visit_date='',site_visit_completed=0)
key=str(uuid4());r=command('lead-save',lead,key=key);check('lead create '+r.text[:100],r.status_code==200);id=r.json()['id']
check('lead retry deduplicated',command('lead-save',lead,key=key).json()==r.json())
check('blank lead rejected',command('lead-save',{**lead,'display_name':' '}).status_code==422)
check('bad lead stage rejected',command('lead-save',{**lead,'stage':'UNKNOWN'}).status_code==422)
check('lead edit and site visit',command('lead-save',{**lead,'stage':'QUALIFIED','site_visit_completed':1,'site_visit_date':'2026-10-22'},id).status_code==200)
check('lead independent session',any(l['id']==id and l['stage']=='QUALIFIED' for l in projection(login('admin'))['sales_leads']))
template=next(t for t in c.get('/api/v1/configuration').json()['state']['reportTemplates'] if t['category']=='quotation' and t['active'])
draft=dict(lead_id=id,valid_until='',customer_notes='Sales test',discount=10,template_id=template['id'],template_html=template['html'],lines=[dict(kind='Service',description='Labour',quantity=1,rate=100,gst_rate=18)])
key=str(uuid4());r=command('quotation-save',draft,key=key);check('quotation create '+r.text[:120],r.status_code==200);qid=r.json()['id']
check('quotation retry deduplicated',command('quotation-save',draft,key=key).json()==r.json())
q=next(q for q in projection()['sales_quotations'] if q['id']==qid)
check('approved create arithmetic',q['subtotal']==100 and q['discount']==10 and q['gst_amount']==18 and q['total']==108)
check('source quotation numbering',q['quotation_no'].startswith('QT-') and len(q['quotation_no'])>=9)
check('create moves lead to quotation sent',next(l for l in projection()['sales_leads'] if l['id']==id)['stage']=='QUOTATION_SENT')
oldlines=[l['id'] for l in projection()['sales_quotation_lines'] if l['quotation_id']==qid]
check('draft edit',command('quotation-save',draft,qid).status_code==200)
q=next(q for q in projection()['sales_quotations'] if q['id']==qid)
check('approved edit arithmetic',q['gst_amount']==16.2 and q['total']==106.2)
check('replacement lines projected once',len([l for l in projection()['sales_quotation_lines'] if l['quotation_id']==qid])==1 and not any(l['id'] in oldlines for l in projection()['sales_quotation_lines']))
check('invalid quantity denied',command('quotation-save',{**draft,'lines':[{**draft['lines'][0],'quantity':0}]},qid).status_code==422)
check('untrusted template denied',command('quotation-save',{**draft,'template_html':'wrong'},qid).status_code==409)
check('historical quotation immutable',command('quotation-status',{'status':'SENT'},1).status_code==409)
check('mark sent',command('quotation-status',{'status':'SENT'},qid).status_code==200)
check('sent draft edit denied',command('quotation-save',draft,qid).status_code==409)
check('accept',command('quotation-status',{'status':'ACCEPTED'},qid).status_code==200)
check('accepted lead won',next(l for l in projection()['sales_leads'] if l['id']==id)['stage']=='WON')
check('terminal status immutable',command('quotation-status',{'status':'SENT'},qid).status_code==409)
for role in ('service','service_manager','reception','accounts','store','tech'):check(role+' sales write denied',command('lead-save',lead,client=login(role)).status_code==403)
Path('/slice/artifacts/sales-api-tests.json').write_text(json.dumps({'passed':len(checks)-before,'checks':checks[before:]},indent=2));print(len(checks)-before,'sales assertions passed')
