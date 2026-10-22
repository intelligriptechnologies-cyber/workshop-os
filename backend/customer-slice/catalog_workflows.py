"""Existing departments, catalog masters and per-job service task list."""
from datetime import datetime,timezone
import math
from fastapi import APIRouter,Request
from pydantic import BaseModel,ConfigDict,Field
from sqlalchemy import text
from api import fail
from operations import command,row,mutable,insert,update_fields,actor,job_access
router=APIRouter(prefix='/api/v1/catalog')
class Change(BaseModel):
    model_config=ConfigDict(extra='forbid')
    operation:str
    id:int|None=None
    version:int|None=None
    values:dict=Field(default_factory=dict)

def require(ok,message,status=422):
    if not ok:fail(message,status)

def valid_rate(value,gst=False):
    require(type(value) in (int,float) and math.isfinite(value) and value>=0 and (not gst or value in (0,5,9,12,18,28)),'Invalid task rate or GST.')

def selected(c,table,id):
    value=row(c,table,id);require(value.get('status','ACTIVE')=='ACTIVE' and not value.get('archived_at'),'Choose an active master record.');return value

@router.post('/command')
def change(value:Change,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        if replay:return replay
        op=value.operation;d=value.values;now=datetime.now(timezone.utc);result={}
        if op.startswith('tasklist-'):
            old=row(c,'job_service_tasks',value.id) if value.id else None
            j=row(c,'job_cards',old['job_card_id'] if old else d.get('job_id'));job_access(u,j)
            require(j['status'] in ('NEW','IN_PROGRESS'),'Task List can only be changed while a job is NEW or IN_PROGRESS.',409)
            mutable(old or j,value.version)
            if op=='tasklist-add':
                require(old is None,'New task cannot reuse an identity.')
                catalog=selected(c,'service_task_catalog',d['service_catalog_item_id']) if d.get('service_catalog_item_id') else None
                name=(catalog['name'] if catalog else d.get('name','')).strip();rate=float(catalog['rate']) if catalog else d.get('base_rate');gst=float(catalog['gst_rate']) if catalog else d.get('gst_rate',18)
                require(bool(name),'Task name is required.');valid_rate(rate);valid_rate(gst,True)
                result=insert(c,'job_service_tasks',dict(job_card_id=j['id'],catalogue_item_id=catalog['id'] if catalog else None,name=name,base_rate=rate,gst_rate=gst,done=False,created_by=u['user_id'],updated_by=u['user_id']))
            elif op=='tasklist-update':
                require(old is not None,'Task required.');name=d.get('name','').strip();require(bool(name),'Task name is required.');valid_rate(d.get('base_rate'));require(d.get('done') in (0,1,False,True),'Invalid completion.')
                result=update_fields(c,'job_service_tasks',value.id,dict(name=name,base_rate=d['base_rate'],done=bool(d['done']),updated_by=u['user_id'],updated_at=now))
            elif op=='tasklist-archive':
                require(old is not None,'Task required.');result=update_fields(c,'job_service_tasks',value.id,dict(archived_at=now,archive_reason='Removed from Task List',updated_by=u['user_id'],updated_at=now))
            else:fail('Unknown task list action.',422)
            return save({'id':result['id'],'version':result['version']})
        require(u['role']=='admin','Only Owner/Admin may manage the service catalog and teams.',403)
        if op.startswith('department-'):
            old=row(c,'slice_departments',value.id) if value.id else None
            if old:mutable(old,value.version)
            if op in ('department-create','department-update'):
                name=d.get('name','').strip();require(bool(name),'Department name is required.');status=d.get('status','ACTIVE');require(status in ('ACTIVE','ARCHIVED'),'Invalid status.')
                if not old:
                    require(not c.scalar(text('SELECT EXISTS(SELECT 1 FROM slice_departments WHERE lower(name)=lower(:n))'),{'n':name}),'A department with this name already exists.')
                    result=insert(c,'slice_departments',dict(name=name,status='ACTIVE',created_by=u['user_id'],created_at=now.isoformat(),updated_at=now.isoformat()))
                else:result=update_fields(c,'slice_departments',old['id'],dict(name=name,status=status,updated_at=now.isoformat()))
            else:
                require(old is not None,'Department required.');manager=d.get('manager_id');advisor=d.get('advisor_id')
                if op=='department-appoint':
                    require(old['status']=='ACTIVE','Archived departments cannot receive managers.');actor(c,manager,'service_manager')
                    link=c.execute(text('SELECT * FROM slice_department_managers WHERE department_id=:d AND manager_id=:m'),{'d':old['id'],'m':manager}).mappings().first()
                    if link:update_fields(c,'slice_department_managers',link['id'],{'active':True})
                    else:insert(c,'slice_department_managers',dict(department_id=old['id'],manager_id=manager,created_by=u['user_id']))
                elif op=='department-remove-manager':
                    for link in c.execute(text('SELECT id FROM slice_advisor_teams WHERE department_id=:d AND manager_id=:m AND active'),{'d':old['id'],'m':manager}).mappings():update_fields(c,'slice_advisor_teams',link['id'],{'active':False})
                    for link in c.execute(text('SELECT id FROM slice_department_managers WHERE department_id=:d AND manager_id=:m AND active'),{'d':old['id'],'m':manager}).mappings():update_fields(c,'slice_department_managers',link['id'],{'active':False})
                elif op=='department-assign':
                    actor(c,advisor,'service');actor(c,manager,'service_manager')
                    require(c.scalar(text('SELECT EXISTS(SELECT 1 FROM slice_department_managers WHERE department_id=:d AND manager_id=:m AND active)'),{'d':old['id'],'m':manager}),'Appoint the department manager before assigning advisors.')
                    link=c.execute(text('SELECT * FROM slice_advisor_teams WHERE advisor_id=:a'),{'a':advisor}).mappings().first()
                    if link:update_fields(c,'slice_advisor_teams',link['id'],dict(department_id=old['id'],manager_id=manager,active=True))
                    else:insert(c,'slice_advisor_teams',dict(department_id=old['id'],manager_id=manager,advisor_id=advisor,created_by=u['user_id']))
                elif op=='department-remove-advisor':
                    for link in c.execute(text('SELECT id FROM slice_advisor_teams WHERE department_id=:d AND advisor_id=:a AND active'),{'d':old['id'],'a':advisor}).mappings():update_fields(c,'slice_advisor_teams',link['id'],{'active':False})
                else:fail('Unknown team action.',422)
                result=update_fields(c,'slice_departments',old['id'],{'updated_at':now.isoformat()})
        elif op in ('master-save','catalog-save','catalog-archive'):
            table=d.get('table') if op=='master-save' else 'service_task_catalog'
            require(table in ('service_brands','car_segments','service_task_catalog'),'Invalid master table.')
            old=row(c,table,value.id) if value.id else None
            if old:mutable(old,value.version)
            if op=='catalog-archive':
                require(old is not None,'Service required.');result=update_fields(c,table,value.id,dict(status='ARCHIVED',archived_at=now,archive_reason='Archived from Service Task Catalog',updated_at=now,updated_by=u['user_id']))
            else:
                name=d.get('name','').strip();require(bool(name),'Name is required.')
                if op=='master-save':
                    status=d.get('status','ACTIVE');require(status in ('ACTIVE','ARCHIVED'),'Invalid status.')
                    require(not c.scalar(text(f'SELECT EXISTS(SELECT 1 FROM {table} WHERE lower(name)=lower(:n) AND id<>:id)'),{'n':name,'id':value.id or 0}),'A master with this name already exists.')
                    fields=dict(name=name,status=status,updated_at=now.isoformat())
                    result=update_fields(c,table,value.id,fields) if old else insert(c,table,dict(created_at=now.isoformat(),**fields))
                else:
                    department=selected(c,'slice_departments',d.get('service_department_id'));valid_rate(d.get('base_rate'));valid_rate(d.get('gst_rate',18),True)
                    for key,master in [('brand_id','service_brands'),('car_segment_id','car_segments')]:
                        if d.get(key) is not None:selected(c,master,d[key])
                    fields=dict(name=name,rate=d['base_rate'],gst_rate=d.get('gst_rate',18),slice_department_id=department['id'],brand_id=d.get('brand_id'),car_segment_id=d.get('car_segment_id'),updated_by=u['user_id'],updated_at=now)
                    result=update_fields(c,table,value.id,fields) if old else insert(c,table,dict(created_by=u['user_id'],**fields))
        else:fail('Unknown catalog action.',422)
        return save({'id':result['id'],'version':result['version']})

def teams(c):
    return {
      'service_departments':[dict(r) for r in c.execute(text('SELECT id,name,status,created_at,updated_at,version FROM slice_departments ORDER BY id')).mappings()],
      'service_department_managers':[dict(r) for r in c.execute(text('SELECT department_id,manager_id FROM slice_department_managers WHERE active')).mappings()],
      'service_advisor_teams':[dict(r) for r in c.execute(text('SELECT department_id,manager_id,advisor_id FROM slice_advisor_teams WHERE active')).mappings()],
    }
