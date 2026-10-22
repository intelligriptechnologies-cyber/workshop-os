"""Existing task/QC/follow-up actions, with server actor and transaction scope."""
from datetime import datetime,timezone,date
from fastapi import APIRouter,Request
from pydantic import BaseModel,ConfigDict,Field
from sqlalchemy import text
from api import fail
from operations import command,row,mutable,insert,update_fields,actor,job_access,history,reconcile_artifacts

router=APIRouter(prefix='/api/v1/execution')
STATUSES={'Pending':'PENDING','Started':'IN_PROGRESS','Paused':'PAUSED','Completed':'COMPLETED'}

class Change(BaseModel):
    model_config=ConfigDict(extra='forbid')
    operation:str
    jobId:int
    id:int|None=None
    version:int
    values:dict=Field(default_factory=dict)

def require(condition,message,status=422):
    if not condition:fail(message,status)

def active(u,j,followup=False):
    require(not j['archived_at'] and j['status'] not in ('CLOSED','CANCELLED'),'This job card is read-only.',409)
    if followup:job_access(u,j)
    else:require(u['role']=='admin' or (u['role']=='tech' and (j['technician_id']==u['profile_id'])),'Task/QC changes are not permitted for this role.',403)

def new_task(c,u,j,d):
    require(isinstance(d.get('title'),str) and bool(d['title'].strip()),'A task title is required.')
    require(d.get('status','Pending') in STATUSES,'Invalid task status.')
    assigned=actor(c,d.get('technician_id',j['technician_id']),'tech')
    require(u['role']=='admin' or assigned==u['user_id'],'Cannot assign work to another technician.',403)
    return insert(c,'technician_tasks',dict(job_card_id=j['id'],assigned_to=assigned,title=d['title'],notes=d.get('notes',''),status=STATUSES[d.get('status','Pending')],ui_status=d.get('status','Pending'),created_by=u['user_id'],updated_by=u['user_id']))

@router.post('/command')
def execute(value:Change,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        if replay:return replay
        op=value.operation;d=value.values;now=datetime.now(timezone.utc)
        j=row(c,'job_cards',value.jobId);active(u,j,op.startswith('followup-'))
        table='technician_tasks' if op.startswith('task-') else 'followups' if op.startswith('followup-') else 'qc_checks'
        existing=row(c,table,value.id) if value.id else None
        if existing:
            require(existing['job_card_id']==j['id'],'Record belongs to another job.',403);mutable(existing,value.version)
            if table=='technician_tasks' and u['role']=='tech':require(existing['assigned_to']==u['user_id'] or existing.get('historical_assigned_to')==u['profile_id'],'Task is assigned to another technician.',403)
        else:mutable(j,value.version)
        result={}
        if op=='task-create':
            require(not value.id,'Create cannot reuse a task identity.')
            result=new_task(c,u,j,d)
        elif op=='task-update':
            require(existing is not None,'Task is required.')
            status=d.get('status');require(status in STATUSES,'Invalid task status.')
            fields=dict(status=STATUSES[status],ui_status=status,notes=d.get('notes',''),updated_by=u['user_id'],updated_at=now)
            stamp={'Started':'started_at','Paused':'paused_at','Completed':'completed_at'}.get(status)
            if stamp and not existing[stamp]:fields[stamp]=now if stamp=='completed_at' else now.isoformat()
            result=update_fields(c,table,value.id,fields)
            if status=='Paused':history(c,j,'Task paused')
        elif op in ('task-archive','followup-archive'):
            require(existing is not None,'Record is required.');reason=d.get('reason','').strip();require(bool(reason),'Archive reason is required.')
            fields=dict(archived_at=now.isoformat(),updated_by=u['user_id'],updated_at=now)
            fields['archived_reason' if table=='technician_tasks' else 'archive_reason']=reason
            if table=='followups':fields['archived_by']=u['user_id']
            result=update_fields(c,table,value.id,fields)
        elif op in ('qc-pass','qc-rework','qc-fail'):
            require(existing is not None,'QC check is required.')
            passed=op=='qc-pass';reason='' if passed else d.get('reason','')
            result=update_fields(c,'qc_checks',value.id,dict(passed=int(passed),status='PASSED' if passed else 'FAILED',fail_reason=reason))
            update_fields(c,'job_cards',j['id'],dict(qc_status='Pass' if passed else 'Fail',updated_by=u['user_id'],updated_at=now))
            history(c,j,'QC passed: '+existing['label'] if passed else 'QC failed: '+(reason or existing['label']))
            if op=='qc-rework':new_task(c,u,j,dict(title='Rework: '+existing['label'],notes=reason,technician_id=d.get('technician_id',j['technician_id'])))
        elif op=='qc-all':
            require(not value.id,'Invalid QC identity.')
            for check in c.execute(text('SELECT * FROM qc_checks WHERE job_card_id=:j AND archived_at IS NULL'),{'j':j['id']}).mappings():update_fields(c,'qc_checks',check['id'],dict(passed=1,status='PASSED'))
            result=update_fields(c,'job_cards',j['id'],dict(qc_status='Pass',updated_by=u['user_id'],updated_at=now))
        elif op=='washing':
            require(not value.id,'Invalid job identity.')
            result=update_fields(c,'job_cards',j['id'],dict(washing_needed=1,updated_by=u['user_id'],updated_at=now))
        elif op in ('followup-create','followup-update','followup-done'):
            if op!='followup-create':require(existing is not None,'Follow-up is required.')
            else:require(not value.id,'Create cannot reuse a follow-up identity.')
            note=existing['note'] if op=='followup-done' else d.get('note','');require(isinstance(note,str) and bool(note.strip()),'A follow-up note is required.')
            done=1 if op=='followup-done' else d.get('done',0);require(type(done) is int and done in (0,1),'Invalid completion state.')
            due=existing['due_at'] if op=='followup-done' else d.get('due_at') or None
            if isinstance(due,str):
                try:due=date.fromisoformat(due)
                except ValueError:fail('Enter a valid follow-up date.',422)
            fields=dict(note=note,due_at=due,done=done,status='COMPLETED' if done else 'OPEN',outcome=d.get('outcome',''),updated_by=u['user_id'],updated_at=now,completed_at=now if done else None,completed_by=u['user_id'] if done else None)
            if op=='followup-create':
                result=insert(c,'followups',dict(job_card_id=j['id'],created_by=u['user_id'],**fields))
                if done and d.get('resolvePrevious'):
                    for old in c.execute(text('SELECT id FROM followups WHERE job_card_id=:j AND archived_at IS NULL AND done=0'),{'j':j['id']}).mappings():update_fields(c,'followups',old['id'],dict(done=1,status='COMPLETED',completed_at=now,completed_by=u['user_id'],updated_by=u['user_id'],updated_at=now))
            else:result=update_fields(c,'followups',value.id,fields)
        else:fail('Unknown execution operation.',422)
        reconcile_artifacts(c,u,j)
        return save({'id':result.get('id',j['id'])})
