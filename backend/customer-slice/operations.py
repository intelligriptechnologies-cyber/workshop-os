"""Approved frontend operations through scoped PostgreSQL transactions."""
import json,hashlib
from uuid import UUID
from contextlib import contextmanager
from fastapi import APIRouter,Request
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel,ConfigDict,Field
from sqlalchemy import text
from api import business,fail,TENANT,BRANCH,customer
router=APIRouter(prefix='/api/v1')

@contextmanager
def command(request,body):
    key=request.headers.get('idempotency-key','')
    try: UUID(key)
    except ValueError: fail('Request identity is required.',422)
    fingerprint=hashlib.sha256(json.dumps([request.url.path,body],sort_keys=True,default=str).encode()).hexdigest()
    with business(request) as (c,u):
        c.execute(text('SELECT pg_advisory_xact_lock(hashtext(:scope))'),{'scope':TENANT+':operations'})
        old=c.execute(text('SELECT * FROM customer_commands WHERE tenant_id=:t AND actor_id=:a AND request_key=:k'),{'t':TENANT,'a':u['user_id'],'k':key}).mappings().first()
        if old and old['fingerprint']!=fingerprint: fail('Request identity conflict.',409)
        def save(result):
            c.execute(text('INSERT INTO customer_commands VALUES(:t,:a,:k,:f,CAST(:r AS jsonb))'),{'t':TENANT,'a':u['user_id'],'k':key,'f':fingerprint,'r':json.dumps(jsonable_encoder(result))})
            return result
        yield c,u,old['result'] if old else None,save

def row(c,table,id):
    r=c.execute(text(f'SELECT * FROM {table} WHERE id=:id FOR UPDATE'),{'id':id}).mappings().first()
    if not r: fail('Record not found.',404)
    return dict(r)

def mutable(r,version):
    if r.get('archived_at'): fail('Record is archived.',409)
    if r['version']!=version: fail('Record changed. Reload before saving.',409)

def vehicle(r):
    return {**{k:r[k] for k in ('id','customer_id','number','make','model','color','km','engine_no','archived_at','created_at','updated_at','version')},'archived_reason':r['archive_reason']}

class VehicleInput(BaseModel):
    model_config=ConfigDict(extra='forbid')
    customer_id:int
    number:str
    make:str
    model:str
    color:str=''
    km:int=Field(default=0,ge=0)
    engine_no:str|None=None
    version:int|None=None

class Archive(BaseModel):
    reason:str
    version:int

def write_vehicle(c,u,data,id=None):
    old=row(c,'vehicles',id) if id else None
    if old: mutable(old,data.get('version'))
    parent=row(c,'customers',data['customer_id'])
    if parent['archived_at']: fail('Vehicle customer is archived.',422)
    for field in ('number','make','model'):
        if not data[field].strip(): fail('Vehicle '+field+' is required.',422)
    data={**data,'number':data['number'].strip().upper(),'make':data['make'].strip(),'model':data['model'].strip(),'color':data['color'].strip()}
    if c.scalar(text('SELECT id FROM vehicles WHERE upper(number)=:n AND archived_at IS NULL AND id<>:id'),{'n':data['number'],'id':id or 0}):fail('A vehicle with this number already exists.',409)
    if old and old['customer_id']!=data['customer_id'] and c.scalar(text('SELECT EXISTS(SELECT 1 FROM visits WHERE vehicle_id=:id)'),{'id':id}):
        fail('Vehicle has visit history. Customer reassignment requires an explicit ownership-transfer workflow.',409)
    values={**data,'id':id,'t':TENANT,'b':BRANCH,'a':u['user_id'],'engine_no':data.get('engine_no') if data.get('engine_no') is not None else ((old or {}).get('engine_no') or '')}
    sql=('UPDATE vehicles SET customer_id=:customer_id,number=:number,make=:make,model=:model,color=:color,km=:km,engine_no=:engine_no,updated_by=:a,updated_at=now(),version=version+1 WHERE id=:id RETURNING *' if old else
      'INSERT INTO vehicles(tenant_id,branch_id,customer_id,number,make,model,color,km,engine_no,created_by,updated_by) VALUES(:t,:b,:customer_id,:number,:make,:model,:color,:km,:engine_no,:a,:a) RETURNING *')
    return vehicle(c.execute(text(sql),values).mappings().one())

@router.get('/vehicles')
def vehicles(request:Request):
    with business(request) as (c,_):return [vehicle(r) for r in c.execute(text('SELECT * FROM vehicles ORDER BY id')).mappings()]

@router.post('/vehicles')
@router.put('/vehicles/{vehicle_id}')
def save_vehicle(value:VehicleInput,request:Request,vehicle_id:int|None=None):
    with command(request,value.model_dump()) as (c,u,replay,save):
        if u['role'] not in ('admin','reception'):fail('Vehicle changes are not permitted for this role.',403)
        return replay or save(write_vehicle(c,u,value.model_dump(),vehicle_id))

@router.post('/vehicles/{vehicle_id}/archive')
def archive_vehicle(vehicle_id:int,value:Archive,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        if u['role'] not in ('admin','reception'):fail('Vehicle changes are not permitted for this role.',403)
        if replay:return replay
        old=row(c,'vehicles',vehicle_id);mutable(old,value.version)
        if not value.reason.strip():fail('Archive reason is required.',422)
        r=c.execute(text('UPDATE vehicles SET archived_at=now(),archived_by=:a,archive_reason=:r,updated_at=now(),updated_by=:a,version=version+1 WHERE id=:id RETURNING *'),{'id':vehicle_id,'a':u['user_id'],'r':value.reason.strip()}).mappings().one()
        return save(vehicle(r))

# These mappings come from the approved source-to-target schema inventory. No custody
# payload or credential column is selected or returned to a client.
from pathlib import Path
from datetime import datetime,timezone,date
MAPPING=json.loads((Path(__file__).parent/'operational-mapping.json').read_text())
STAGES={
 'NEW':['Gather Requirements','Create Estimate','Get Confirmation'],
 'IN_PROGRESS':['Material Requested','Material Issued','Washing Needed','Work Started','Follow-up Needed','Photos Shared','QC Pending'],
 'COMPLETED':['Customer Verification','Invoice Ready','Remind Customer for Sharing Google Review/Feedback','Payment Received'],
 'CLOSED':['Receipt Generated','Gate Pass Generated','Delivered']}
TRANSITIONS={'NEW':['IN_PROGRESS','CANCELLED'],'IN_PROGRESS':['COMPLETED','HOLD','CANCELLED'],'HOLD':['IN_PROGRESS','CANCELLED'],'COMPLETED':['IN_PROGRESS'],'CLOSED':[],'CANCELLED':[]}

def project(c,source):
    spec=MAPPING[source]
    media_ids=set(c.scalars(text('SELECT media_id FROM slice_media_content'))) if source=='photos' else set()
    actors={str(r['platform_user_id']):r['id'] for r in c.execute(text('SELECT id,platform_user_id FROM workshop_user_profiles')).mappings() if r['platform_user_id']}
    result=[]
    for raw in c.execute(text('SELECT * FROM '+spec['table']+(' WHERE archived_at IS NULL' if source in ('purchase_order_lines','inward_purchase_lines') else ''))).mappings():
        history=raw.get('historical_values') or {}; value={}
        for field,target in spec['columns'].items():
            v=raw.get(target)
            if field in spec['actors']:
                v=actors.get(str(v)) if v else raw.get('historical_'+target,history.get(field))
                if not isinstance(v,int):v=None
                if field in ('advisor_id','received_by','technician_id'):v=v or 0
            elif v is None:
                h=history.get(field)
                if isinstance(h,(str,int,float)):v=h
            if isinstance(v,(datetime,date)):v=v.isoformat()
            if isinstance(v,bool):v=int(v)
            value[field]=v
        if source=='job_cards' and raw.get('promised_text'):value['promised_at']=raw['promised_text']
        if source=='estimates':value['status']={'DRAFT':'Draft','APPROVED':'Approved','DECLINED':'Rejected'}[raw['status']]
        if source=='material_movements':value['job_card_id']=value.get('job_card_id') or 0
        if source=='stock_ledger':
            value['job_card_id']=value.get('job_card_id') or 0;value['material_row_id']=value.get('material_row_id') or 0
        if source=='photos':
            available=raw['id'] in media_ids
            value['original_src']=value['src']
            value['availability']='READY' if available else 'UNAVAILABLE' if raw.get('history_source_sha') or value['src'] else 'EMPTY'
            # Never fetch an unverified historical URL or claim a fabricated file.
            value['src']=f"/api/v1/media/{raw['id']}/content" if available else ''
        if source in ('purchase_orders','purchase_order_lines'):
            for field in ('supplier_id','item_id'):
                if field in value and value[field] is None:value[field]=0
        value['version']=raw['version'];result.append(value)
    if source in ('stock_ledger','stock_inwards'):
        result += [dict(r['values'],version=1) for r in c.execute(text('SELECT values FROM slice_historical_stock WHERE source_table=:s'),{'s':source}).mappings()]
    return result

@router.get('/operations/projection')
def projection(request:Request):
    with business(request,snapshot=True) as (c,_):
        return {'customers':[customer(r) for r in c.execute(text('SELECT * FROM customers ORDER BY id')).mappings()], 'vehicles':[vehicle(r) for r in c.execute(text('SELECT * FROM vehicles ORDER BY id')).mappings()], 'document_snapshots':[r['values'] for r in c.execute(text("SELECT values FROM document_snapshots WHERE availability='READY' AND values ? 'jobNo' ORDER BY id")).mappings()], **{name:project(c,name) for name in MAPPING}}

@router.get('/jobs')
def jobs(request:Request):
    with business(request) as (c,_):return project(c,'job_cards')

class Intake(BaseModel):
    model_config=ConfigDict(extra='forbid')
    customerId:int|None=None
    vehicleId:int|None=None
    customerName:str
    mobile:str
    customerType:str='Individual'
    vehicleNo:str
    make:str
    model:str
    color:str=''
    km:int=Field(ge=0)
    odoReading:float|None=Field(default=None,ge=0)
    fuel:str
    fuelLevelValue:str=''
    fuelLevelUnit:str=''
    keys:str=''
    accessories:str=''
    requestedWork:str
    advisorId:int|None=None
    receptionId:int|None=None
    damageMarks:str='[]'
    address:str|None=None
    engineNo:str|None=None
    serviceType:str=''
    pickupDrop:str=''
    estimatedDelivery:str=''

def insert(c,table,values):
    values={'tenant_id':TENANT,'branch_id':BRANCH,**values}
    columns=','.join(values);binds=','.join(':'+k for k in values)
    return dict(c.execute(text(f'INSERT INTO {table}({columns}) VALUES({binds}) RETURNING *'),values).mappings().one())

def actor(c,id,role):
    r=c.execute(text('SELECT * FROM workshop_user_profiles WHERE id=:id AND role=:role AND archived_at IS NULL AND platform_user_id IS NOT NULL'),{'id':id,'role':role}).mappings().first()
    if not r:fail('The selected active '+role+' account is unavailable.',422)
    return r['platform_user_id']

def history(c,j,note):
    insert(c,'legacy_job_status_history',{'job_card_id':j['id'],'main_status':j['status'],'sub_status':j['sub_status'],'note':note,'created_at':datetime.now(timezone.utc).isoformat()})

def cycle(c,j):
    now=datetime.now(timezone.utc)
    n=c.scalar(text('SELECT coalesce(max(cycle_number),0)+1 FROM job_checklist_cycles WHERE job_card_id=:id AND stage=:s'),{'id':j['id'],'s':j['status']})
    r=insert(c,'job_checklist_cycles',{'job_card_id':j['id'],'stage':j['status'],'cycle_number':n,'started_at':now})
    for i,label in enumerate(STAGES[j['status']]):
        insert(c,'job_checklist_items',{'job_card_id':j['id'],'cycle_id':r['id'],'stage':j['status'],'cycle_number':n,'item_key':j['status'].lower()+'.'+str(i+1),'label':label,'sort_order':i+1,'required':label not in ('Washing Needed','Follow-up Needed'),'started_at':now if i==0 else None})

@router.post('/reception/intake')
def intake(value:Intake,request:Request):
    d=value.model_dump()
    with command(request,d) as (c,u,replay,save):
        if u['role'] not in ('admin','reception','service'):fail('Reception intake is not permitted for this role.',403)
        if replay:return replay
        for field in ('customerName','mobile','vehicleNo','make','model','fuel','requestedWork'):
            if not d[field].strip():fail(field+' is required.',422)
        if d['fuelLevelUnit'] and not d['fuelLevelValue'].strip():fail('Enter the fuel or battery level.',422)
        if d['fuelLevelUnit'] not in ('','bars','%','litres','Other'):fail('Invalid fuel level unit.',422)
        try:marks=json.loads(d['damageMarks'])
        except ValueError:fail('Invalid damage marks.',422)
        if not isinstance(marks,list):fail('Invalid damage marks.',422)
        advisor=actor(c,d['advisorId'],'service') if d['advisorId'] else None
        if u['role']=='service' and d['advisorId']!=u['profile_id']:fail('Advisors may create only their own jobs.',403)
        technician=actor(c,6,'tech') # Existing approved fixture technician, never fabricated.
        # Share the customer lock with the existing Customers API; all changes below commit together.
        c.execute(text('SELECT pg_advisory_xact_lock(hashtext(:t))'),{'t':TENANT+':customers'})
        cid=d['customerId'] or c.scalar(text('SELECT id FROM customers WHERE mobile=:m AND archived_at IS NULL'),{'m':d['mobile']})
        if cid:
            cust=row(c,'customers',cid)
            if cust['archived_at']:fail('Customer is archived.',422)
            if c.scalar(text('SELECT id FROM customers WHERE mobile=:m AND archived_at IS NULL AND id<>:id'),{'m':d['mobile'].strip(),'id':cid}):fail('A customer with this mobile already exists.',409)
            c.execute(text('UPDATE customers SET name=:n,mobile=:m,type=:type,address=coalesce(:address,address),updated_at=now(),updated_by=:a,version=version+1 WHERE id=:id'),{'id':cid,'n':d['customerName'].strip(),'m':d['mobile'].strip(),'type':d['customerType'].strip() or 'Individual','address':d['address'],'a':u['user_id']})
        else:
            cid=insert(c,'customers',{'name':d['customerName'].strip(),'mobile':d['mobile'].strip(),'type':d['customerType'].strip() or 'Individual','address':d['address'] or '', 'created_by':u['user_id'],'updated_by':u['user_id']})['id']
        vid=d['vehicleId'] or c.scalar(text('SELECT id FROM vehicles WHERE upper(number)=:n AND archived_at IS NULL'),{'n':d['vehicleNo'].strip().upper()})
        old=row(c,'vehicles',vid) if vid else None
        if old and old['customer_id']!=cid:fail('Selected vehicle does not belong to the customer.',422)
        odo=d['odoReading'] if d['odoReading'] is not None else d['km']
        v=write_vehicle(c,u,{'customer_id':cid,'number':d['vehicleNo'],'make':d['make'],'model':d['model'],'color':d['color'],'km':d['km'],'engine_no':d['engineNo'],'version':old['version'] if old else None},vid)
        visit=insert(c,'visits',{'customer_id':cid,'vehicle_id':v['id'],'advisor_id':advisor,'received_by':u['user_id'],'received_at':datetime.now(timezone.utc),'fuel':d['fuel'],'odo_reading':odo,'fuel_level_value':d['fuelLevelValue'],'fuel_level_unit':d['fuelLevelUnit'],'keys':d['keys'],'accessories':d['accessories'],'requested_work':d['requestedWork'],'photos_note':'Reception intake'})
        job=insert(c,'job_cards',{'job_no':f"JC-{datetime.now(timezone.utc).year}-{1247+visit['id']:06d}",'visit_id':visit['id'],'advisor_id':advisor,'technician_id':6,'status':'NEW','sub_status':'Gather Requirements','work_list':d['requestedWork'],'promised_text':'Tomorrow 6:00 PM','qc_status':'Pending','washing_needed':0,'closed_at':'','advisor_notes':'','customer_instructions':d['requestedWork'],'internal_instructions':'','service_type':d['serviceType'],'pickup_drop':d['pickupDrop'],'estimated_delivery':d['estimatedDelivery'] or None,'damage_marks':d['damageMarks'],'assignment_state':'ASSIGNED_TO_ADVISOR' if advisor else 'AWAITING_ADVISOR_ASSIGNMENT','created_by':u['user_id'],'updated_by':u['user_id']})
        cycle(c,job)
        insert(c,'technician_tasks',{'job_card_id':job['id'],'assigned_to':technician,'title':d['requestedWork'].split(',')[0] or 'Workshop inspection','status':'PENDING','ui_status':'Pending','notes':'Created at reception check-in.','created_by':u['user_id'],'updated_by':u['user_id']})
        for label in ('Edges checked','Surface cleaned','Customer items verified'):insert(c,'qc_checks',{'job_card_id':job['id'],'label':label,'passed':0,'created_by':u['user_id']})
        insert(c,'job_media',{'job_card_id':job['id'],'label':'Reception intake','category':'Reception','src':'','created_by':u['user_id'],'updated_by':u['user_id']})
        history(c,job,'Visit received and job card opened')
        return save({'id':job['id'],'job_no':job['job_no'],'visit_id':visit['id'],'customer_id':cid,'vehicle_id':v['id']})

class JobChange(BaseModel):
    model_config=ConfigDict(extra='forbid')
    operation:str
    version:int
    values:dict

def job_access(u,j):
    if j['archived_at'] or j['status'] in ('CLOSED','CANCELLED'):fail('This job card is read-only.',409)
    if u['role']!='admin' and not (u['role']=='service' and (j['advisor_id']==u['user_id'] or (j['advisor_id'] is None and j['historical_advisor_id']==u['profile_id']))):
        fail('Only the Owner or linked Service Advisor can change this job.',403)

def update_fields(c,table,id,fields):
    if not fields:return
    # Every caller supplies a static, server-owned field allowlist.
    return c.execute(text(f"UPDATE {table} SET "+','.join(k+'=:'+k for k in fields)+',version=version+1 WHERE id=:id RETURNING *'),{'id':id,**fields}).mappings().one()

def complete_cycle(c,j):
    active=c.execute(text('SELECT * FROM job_checklist_cycles WHERE job_card_id=:id ORDER BY id DESC LIMIT 1'),{'id':j['id']}).mappings().first()
    if not active or active['stage']!=j['status']:fail('Complete the current job checklist first.',409)
    items=list(c.execute(text('SELECT * FROM job_checklist_items WHERE cycle_id=:id ORDER BY sort_order'),{'id':active['id']}).mappings())
    if [i['label'] for i in items]!=STAGES[j['status']]:fail('Historical checklist is incomplete; preserved quarantine must be resolved before this transition.',409)
    if not active['completed_at'] or any(i['required'] and not i['checked_at'] for i in items):fail('Complete the current job checklist first.',409)

@router.post('/jobs/{job_id}/command')
def job_command(job_id:int,value:JobChange,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        j=row(c,'job_cards',job_id)
        if value.operation=='archive' and u['role'] in ('admin','reception'):pass
        elif replay:
            replay_job={**j,'archived_at':None,'status':'NEW'};job_access(u,replay_job)
        else:job_access(u,j)
        if replay:return replay
        mutable(j,value.version);d=value.values;op=value.operation;now=datetime.now(timezone.utc)
        if op in ('details','delivery','damage'):
            allowed={'advisor_id','technician_id','work_list','promised_at','advisor_notes','customer_instructions','internal_instructions','service_type','pickup_drop','estimated_delivery','fuel','accessories','engine_no','address'} if op=='details' else ({'estimated_delivery'} if op=='delivery' else {'marks'})
            if set(d)-allowed:fail('Unsupported job field.',422)
            fields={'updated_by':u['user_id'],'updated_at':now}
            for k,v in d.items():
                if k not in ('advisor_id','technician_id','marks') and not isinstance(v,str):fail('Invalid job field.',422)
                if k in ('work_list','advisor_notes','customer_instructions','internal_instructions','service_type','pickup_drop'):fields[k]=v
            if 'technician_id' in d:actor(c,d['technician_id'],'tech');fields['technician_id']=d['technician_id']
            if 'promised_at' in d:fields['promised_text']=d['promised_at']
            if 'estimated_delivery' in d:
                try:fields['estimated_delivery']=date.fromisoformat(d['estimated_delivery']) if d['estimated_delivery'] else None
                except ValueError:fail('Invalid estimated delivery date.',422)
            if op=='damage':
                if not isinstance(d.get('marks'),list):fail('Invalid damage marks.',422)
                fields.update(damage_marks=json.dumps(d['marks']),damage_marks_recorded_at=now.isoformat())
            if op=='details':
                visit=row(c,'visits',j['visit_id']);vf={k:d[k] for k in ('fuel','accessories') if k in d}
                if 'fuel' in vf and not vf['fuel'].strip():fail('Fuel level is required.',422)
                if vf:update_fields(c,'visits',visit['id'],{**vf,'updated_at':now})
                if 'engine_no' in d:update_fields(c,'vehicles',visit['vehicle_id'],{'engine_no':d['engine_no'].strip(),'updated_by':u['user_id'],'updated_at':now})
                if 'address' in d:
                    c.execute(text('SELECT pg_advisory_xact_lock(hashtext(:t))'),{'t':TENANT+':customers'})
                    update_fields(c,'customers',visit['customer_id'],{'address':d['address'].strip(),'updated_by':u['user_id'],'updated_at':now})
            j=dict(update_fields(c,'job_cards',job_id,fields))
        elif op=='status':
            target=d.get('target');note=d.get('note','').strip()
            if target not in ('CANCELLED','HOLD') and c.scalar(text("SELECT EXISTS(SELECT 1 FROM material_approvals WHERE job_card_id=:j AND status IN ('Pending','Rejected'))"),{'j':job_id}):fail('Resolve the material approval before resuming this job.',409)
            if not note:fail('A confirmation note is required.',422)
            if target not in TRANSITIONS[j['status']]:fail('This status transition is not permitted.',409)
            if target=='COMPLETED' and not c.scalar(text('SELECT EXISTS(SELECT 1 FROM invoices WHERE job_card_id=:id AND voided_at IS NULL)'),{'id':job_id}):fail('Create an Invoice before completing the job.',409)
            if target not in ('CANCELLED','HOLD') and j['status']!='HOLD':complete_cycle(c,j)
            keep=target in ('CANCELLED','HOLD') or j['status']=='HOLD'
            j=dict(update_fields(c,'job_cards',job_id,{'status':target,'sub_status':j['sub_status'] if keep else STAGES[target][0],'updated_by':u['user_id'],'updated_at':now}))
            if not keep:cycle(c,j)
            if target not in ('CANCELLED','HOLD'):reconcile_artifacts(c,u,j)
            history(c,j,note)
        elif op=='archive':
            reason=d.get('reason','').strip()
            if not reason:fail('Archive reason is required.',422)
            update_fields(c,'visits',j['visit_id'],{'archived_at':now,'archived_by':u['user_id'],'archive_reason':reason,'updated_at':now})
            j=dict(update_fields(c,'job_cards',job_id,{'archived_at':now,'archived_reason':reason,'updated_by':u['user_id'],'updated_at':now}));history(c,j,'Cancelled: '+reason)
        else:fail('This operation is not integrated.',409)
        return save({'id':job_id,'version':j['version']})

class Assignment(BaseModel):
    advisor_id:int
    version:int

@router.post('/reception/jobs/{job_id}/advisor')
def assign(job_id:int,value:Assignment,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        if u['role'] not in ('admin','reception'):fail('Advisor assignment is not permitted for this role.',403)
        if replay:return replay
        j=row(c,'job_cards',job_id);mutable(j,value.version)
        if j['status'] in ('CANCELLED','CLOSED'):fail('This job card is read-only.',409)
        a=actor(c,value.advisor_id,'service');now=datetime.now(timezone.utc)
        update_fields(c,'visits',j['visit_id'],{'advisor_id':a,'updated_at':now})
        j=dict(update_fields(c,'job_cards',job_id,{'advisor_id':a,'assignment_state':'ASSIGNED_TO_ADVISOR','updated_at':now,'updated_by':u['user_id']}))
        name=c.scalar(text('SELECT name FROM workshop_user_profiles WHERE id=:id'),{'id':value.advisor_id});history(c,j,'Assigned to '+name)
        return save({'id':job_id,'version':j['version']})

class Attendance(BaseModel):
    user_id:int
    date:date
    present:bool

@router.post('/reception/attendance')
def attendance(value:Attendance,request:Request):
    with command(request,value.model_dump(mode='json')) as (c,u,replay,save):
        if u['role'] not in ('admin','reception'):fail('Attendance changes are not permitted for this role.',403)
        if replay:return replay
        actor(c,value.user_id,'service')
        c.execute(text('INSERT INTO advisor_attendance(tenant_id,branch_id,user_id,date,present) VALUES(:t,:b,:id,:date,:p) ON CONFLICT(tenant_id,branch_id,user_id,date) DO UPDATE SET present=excluded.present,version=advisor_attendance.version+1'),{'t':TENANT,'b':BRANCH,'id':value.user_id,'date':value.date.isoformat(),'p':int(value.present)})
        return save({'status':'ok'})

class ChecklistChange(BaseModel):
    checked:bool
    notApplicable:bool=False
    version:int

@router.post('/jobs/checklist/{item_id}')
def checklist(item_id:int,value:ChecklistChange,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        item=row(c,'job_checklist_items',item_id);j=row(c,'job_cards',item['job_card_id'])
        if item['label']=='Payment Received' and not value.notApplicable:
            from financial_workflows import billing
            billing(u)
            if replay:return replay
            if value.checked:fail('Use the full financial payment command with document snapshots.',409)
            if j['archived_at'] or j['status']!='COMPLETED':fail('This job card is read-only.',409)
            if c.scalar(text('SELECT EXISTS(SELECT 1 FROM payments WHERE job_card_id=:j AND voided_at IS NULL)'),{'j':j['id']}):fail('Void the payment with a reason to untick Payment Received.',409)
        else:job_access(u,j)
        if replay:return replay
        mutable(item,value.version)
        latest=c.scalar(text('SELECT max(id) FROM job_checklist_cycles WHERE job_card_id=:id'),{'id':j['id']})
        if item['stage']!=j['status'] or item['cycle_id']!=latest:fail('This checklist is read-only in the current job status.',409)
        label=item['label'];checked=value.checked;na=value.notApplicable
        if na and checked and label=='Remind Customer for Sharing Google Review/Feedback':fail('The Google review reminder cannot be marked N/A.',422)
        if na and checked and label in ('Material Requested','Material Issued') and c.scalar(text('SELECT EXISTS(SELECT 1 FROM material_requests WHERE job_card_id=:id AND archived_at IS NULL)'),{'id':j['id']}):fail('N/A requires a job without material rows.',409)
        if na and checked and item['checked_at'] and not item['na_at']:fail('Untick the item before marking it N/A.',409)
        if na and not checked and not item['na_at']:fail('This item is not marked N/A.',409)
        gate={'Create Estimate':('estimates','archived_at'),'Invoice Ready':('invoices','voided_at')}.get(label)
        if checked and gate and not c.scalar(text(f'SELECT EXISTS(SELECT 1 FROM {gate[0]} WHERE job_card_id=:id AND {gate[1]} IS NULL)'),{'id':j['id']}):fail('Save the required document before completing this checklist item.',409)
        if checked and not na and c.scalar(text('SELECT EXISTS(SELECT 1 FROM job_checklist_items WHERE cycle_id=:c AND sort_order<:n AND required AND checked_at IS NULL)'),{'c':latest,'n':item['sort_order']}):fail('Checklist items must be completed in order.',409)
        if not checked and c.scalar(text('SELECT EXISTS(SELECT 1 FROM job_checklist_items WHERE cycle_id=:c AND sort_order>:n AND required AND checked_at IS NOT NULL)'),{'c':latest,'n':item['sort_order']}):fail('Later checklist items must be reopened first.',409)
        now=datetime.now(timezone.utc)
        r=resolve_checklist_state(c,u,j,item,checked,na,now)
        return save({'id':item_id,'version':r['version']})

def resolve_checklist_state(c,u,j,item,checked,na,now):
    item_id=item['id']; latest=item['cycle_id']
    r=update_fields(c,'job_checklist_items',item_id,{'checked_at':now if checked else None,'checked_by':u['user_id'] if checked and not na else None,'completed_at':now if checked else None,'started_at':item['started_at'] or now,'na_at':now if na and checked else None,'na_by':u['user_id'] if na and checked else None})
    remaining=c.scalar(text('SELECT count(*) FROM job_checklist_items WHERE cycle_id=:c AND required AND checked_at IS NULL'),{'c':latest})
    update_fields(c,'job_checklist_cycles',latest,{'completed_at':None if remaining else now})
    next_item=c.execute(text('SELECT * FROM job_checklist_items WHERE cycle_id=:c AND sort_order=:n'),{'c':latest,'n':item['sort_order']+1}).mappings().first()
    if checked and next_item and not next_item['started_at']:update_fields(c,'job_checklist_items',next_item['id'],{'started_at':now})
    sub=c.scalar(text('SELECT label FROM job_checklist_items WHERE cycle_id=:c ORDER BY (checked_at IS NOT NULL),sort_order LIMIT 1'),{'c':latest})
    if not c.scalar(text('SELECT EXISTS(SELECT 1 FROM job_checklist_items WHERE cycle_id=:c AND checked_at IS NULL)'),{'c':latest}):sub=c.scalar(text('SELECT label FROM job_checklist_items WHERE cycle_id=:c ORDER BY sort_order DESC LIMIT 1'),{'c':latest})
    update_fields(c,'job_cards',j['id'],{'sub_status':sub,'updated_by':u['user_id'],'updated_at':now})
    return r

def reconcile_artifacts(c,u,j):
    current=c.scalar(text('SELECT max(id) FROM job_checklist_cycles WHERE job_card_id=:id'),{'id':j['id']})
    items=list(c.execute(text('SELECT * FROM job_checklist_items WHERE cycle_id=:c ORDER BY sort_order'),{'c':current}).mappings())
    if [i['label'] for i in items]!=STAGES[j['status']]:return # Never synthesize quarantined historical steps.
    queries={
      'Gather Requirements':"SELECT EXISTS(SELECT 1 FROM visits WHERE id=:visit AND btrim(requested_work)<>'')",
      'Create Estimate':"SELECT EXISTS(SELECT 1 FROM estimates WHERE job_card_id=:id AND archived_at IS NULL)",
      'Get Confirmation':"SELECT EXISTS(SELECT 1 FROM estimates WHERE job_card_id=:id AND status='APPROVED' AND archived_at IS NULL)",
      'Material Requested':"SELECT EXISTS(SELECT 1 FROM material_requests WHERE job_card_id=:id AND archived_at IS NULL AND status<>'Draft')",
      'Material Issued':"SELECT EXISTS(SELECT 1 FROM material_requests WHERE job_card_id=:id AND archived_at IS NULL AND status='Issued') AND NOT EXISTS(SELECT 1 FROM material_requests WHERE job_card_id=:id AND archived_at IS NULL AND status NOT IN ('Issued','Cancelled'))",
      'Washing Needed':"SELECT washing_needed=1 FROM job_cards WHERE id=:id",
      'Work Started':"SELECT EXISTS(SELECT 1 FROM technician_tasks WHERE job_card_id=:id AND ui_status IN ('Started','Paused','Completed') AND archived_at IS NULL)",
      'Follow-up Needed':"SELECT EXISTS(SELECT 1 FROM followups WHERE job_card_id=:id AND archived_at IS NULL)",
      'Photos Shared':"SELECT EXISTS(SELECT 1 FROM job_media WHERE job_card_id=:id AND archived_at IS NULL AND btrim(coalesce(src,''))<>'')",
      'QC Pending':"SELECT NOT EXISTS(SELECT 1 FROM technician_tasks WHERE job_card_id=:id AND ui_status<>'Completed' AND archived_at IS NULL)",
      'Customer Verification':"SELECT qc_status='Pass' FROM job_cards WHERE id=:id",
      'Invoice Ready':"SELECT EXISTS(SELECT 1 FROM invoices WHERE job_card_id=:id AND voided_at IS NULL)",
    }
    for item in items:
        if item['checked_at']:continue
        query=queries.get(item['label'])
        exists=query and c.scalar(text(query),{'id':j['id'],'visit':j['visit_id']})
        if not exists:
            if not item['required']:continue
            break
        resolve_checklist_state(c,u,j,item,True,False,datetime.now(timezone.utc))
