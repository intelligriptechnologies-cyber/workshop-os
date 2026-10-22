"""Approved CRM and quotation arithmetic, including distinct create/edit GST."""
from datetime import date,datetime,timezone
import json
from fastapi import APIRouter,Request
from pydantic import BaseModel,ConfigDict,Field
from sqlalchemy import text
from api import fail
from operations import command,row,mutable,insert,update_fields
from bookings import parse
from configuration import current
router=APIRouter(prefix='/api/v1/sales')
class Lead(BaseModel):
    model_config=ConfigDict(extra='forbid')
    display_name:str
    phone:str
    company:str=''
    company_not_entered:int=Field(default=0,ge=0,le=1)
    email:str=''
    email_not_entered:int=Field(default=0,ge=0,le=1)
    address:str=''
    service_interest:str=''
    notes:str=''
    stage:str='NEW'
    temperature:str='WARM'
    follow_up_due:date|None=None
    site_visit_completed:int=Field(default=0,ge=0,le=1)
    site_visit_date:date|None=None
class Line(BaseModel):
    model_config=ConfigDict(extra='forbid',allow_inf_nan=False)
    kind:str='Service'
    description:str
    quantity:float=Field(gt=0)
    rate:float=Field(ge=0)
    gst_rate:float=Field(ge=0,le=100)
class Quotation(BaseModel):
    model_config=ConfigDict(extra='forbid',allow_inf_nan=False)
    lead_id:int
    valid_until:date|None=None
    customer_notes:str=''
    discount:float=0
    template_id:str
    template_html:str
    lines:list[Line]=Field(min_length=1,max_length=1000)
class Change(BaseModel):
    model_config=ConfigDict(extra='forbid')
    operation:str
    id:int|None=None
    version:int|None=None
    values:dict

@router.post('/command')
def change(value:Change,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        if u['role']!='admin':fail('Only Owner/Admin may change sales records.',403)
        if replay:return replay
        op=value.operation;now=datetime.now(timezone.utc)
        if op=='lead-save':
            d=parse(Lead,{k:None if k in ('follow_up_due','site_visit_date') and v=='' else v for k,v in value.values.items()})
            if not d['display_name'].strip() or not d['phone'].strip():fail('Lead name and phone are required.',422)
            if d['stage'] not in ('NEW','QUALIFIED','QUOTATION_SENT','WON','LOST') or d['temperature'] not in ('HOT','WARM','COLD'):fail('Invalid lead stage or temperature.',422)
            d={k:v.strip() if isinstance(v,str) else v for k,v in d.items()}
            for k in ('company_not_entered','email_not_entered','site_visit_completed'):d[k]=bool(d[k])
            d.update(updated_by=u['user_id'],updated_at=now)
            if value.id:
                old=row(c,'sales_leads',value.id);mutable(old,value.version);r=update_fields(c,'sales_leads',value.id,d)
            else:r=insert(c,'sales_leads',dict(created_by=u['user_id'],**d))
            return save({'id':r['id'],'version':r['version']})
        if op not in ('quotation-save','quotation-status'):fail('Unknown sales operation.',422)
        old=row(c,'quotations',value.id) if value.id else None
        if old:
            if old['history_source_sha']:fail('Historical quotation financial values are preserved read-only.',409)
            mutable(old,value.version)
        if op=='quotation-status':
            if not old:fail('Quotation required.',422)
            if old['status'] in ('ACCEPTED','REJECTED','EXPIRED'):fail('Terminal quotations cannot be changed.',409)
            status=value.values.get('status')
            if status not in ('DRAFT','SENT','ACCEPTED','REJECTED','EXPIRED'):fail('Invalid quotation status.',422)
            r=update_fields(c,'quotations',value.id,dict(status=status,updated_by=u['user_id'],updated_at=now))
            if status in ('ACCEPTED','REJECTED'):update_fields(c,'sales_leads',old['lead_id'],dict(stage='WON' if status=='ACCEPTED' else 'LOST',updated_by=u['user_id'],updated_at=now))
            return save({'id':r['id'],'version':r['version']})
        if old and old['status']!='DRAFT':fail('Only draft quotations can be edited.',409)
        d=parse(Quotation,{k:None if k=='valid_until' and v=='' else v for k,v in value.values.items()});lead=row(c,'sales_leads',d['lead_id'])
        templates=current(c)['state']['reportTemplates']
        template=next((t for t in templates if t['id']==d['template_id'] and t['category']=='quotation'),None)
        if not (template and template['html']==d['template_html'] or old and old['template_id']==d['template_id'] and old['template_html']==d['template_html']):fail('Reload and select an existing quotation template.',409)
        lines=d.pop('lines')
        for line in lines:
            if not line['description'].strip():fail('Quotation line description is required.',422)
            line['description']=line['description'].strip();line['kind']=line['kind'] or 'Service'
        subtotal=sum(line['quantity']*line['rate'] for line in lines);discount=max(0,d['discount']);taxable=max(0,subtotal-discount)
        # Deliberately preserve the source implementation's different create/edit rules.
        gst=sum(max(0,line['quantity']*line['rate']-(discount*(line['quantity']*line['rate']/subtotal) if subtotal else 0))*line['gst_rate']/100 for line in lines) if old else sum(line['quantity']*line['rate']*line['gst_rate']/100 for line in lines)
        d.update(discount=discount,subtotal=subtotal,gst_amount=gst,total=taxable+gst,customer_notes=d['customer_notes'].strip(),updated_by=u['user_id'],updated_at=now)
        if old:
            r=update_fields(c,'quotations',old['id'],d)
            for line in c.execute(text('SELECT id FROM quotation_lines WHERE quotation_id=:q AND archived_at IS NULL'),{'q':old['id']}).mappings():update_fields(c,'quotation_lines',line['id'],{'archived_at':now})
        else:
            number=c.scalar(text('SELECT coalesce(max(id),0)+1 FROM quotations'))
            while c.scalar(text('SELECT EXISTS(SELECT 1 FROM quotations WHERE quotation_no=:n)'),{'n':f'QT-{number:06d}'}):number+=1
            r=insert(c,'quotations',dict(quotation_no=f'QT-{number:06d}',status='DRAFT',created_by=u['user_id'],document_snapshot='{}',**d))
        for index,line in enumerate(lines):insert(c,'quotation_lines',dict(quotation_id=r['id'],line_no=index+1,**line))
        update_fields(c,'sales_leads',lead['id'],dict(stage='QUOTATION_SENT',updated_by=u['user_id'],updated_at=now))
        return save({'id':r['id'],'version':r['version']})
