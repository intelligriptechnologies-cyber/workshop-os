"""Existing estimate/document/media contracts; no financial or historical repair."""
import base64
import binascii
import hashlib
import json
import math
import re
from datetime import datetime, timezone
from html.parser import HTMLParser
from typing import Literal

from fastapi import APIRouter, Request, Response
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text

from api import business, fail
from operations import command, row, mutable, job_access, insert, update_fields, history, reconcile_artifacts

router = APIRouter(prefix='/api/v1')


class Input(BaseModel):
    model_config = ConfigDict(extra='forbid', allow_inf_nan=False)


class Line(Input):
    kind: Literal['Service', 'Material']
    description: str = Field(min_length=1, max_length=10000)
    qty: float = Field(gt=0)
    rate: float = Field(ge=0)
    gst_type: Literal['CGST+SGST', 'IGST', 'No GST'] | None = None
    gst_rate: float | None = None


class Draft(Input):
    version: int | None = None
    discount: float = Field(ge=0)
    gst_rate: float = Field(ge=0, le=100)
    notes: str = Field(max_length=10000)
    items: list[Line] = Field(min_length=1, max_length=500)


def round2(value):
    # Intentionally mirrors JS Math.round((value + Number.EPSILON) * 100).
    return math.floor((value + 2.220446049250313e-16) * 100 + .5) / 100


def totals(lines, discount):
    amounts = [round2(l['qty'] * l['rate']) for l in lines]
    subtotal = round2(sum(amounts))
    discount = round2(min(max(discount, 0), subtotal))
    spread = 0
    rows = []
    for i, line in enumerate(lines):
        share = round2(discount-spread) if i == len(lines)-1 else round2(discount*amounts[i]/subtotal) if subtotal > 0 else 0
        spread = round2(spread+share)
        taxable = round2(amounts[i]-share)
        gst = round2(taxable*line['gst_rate']/100)
        rows.append(dict(amount=amounts[i], discount=share, taxable=taxable, gst=gst, total=round2(taxable+gst)))
    taxable = round2(sum(r['taxable'] for r in rows))
    gst = round2(sum(r['gst'] for r in rows))
    return dict(lines=rows, subtotal=subtotal, discount=discount, taxable=taxable, gst=gst, total=round2(taxable+gst))


def current(c, job_id):
    r = c.execute(text('SELECT * FROM estimates WHERE job_card_id=:j AND archived_at IS NULL AND superseded_at IS NULL ORDER BY id DESC LIMIT 1 FOR UPDATE'), {'j': job_id}).mappings().first()
    return dict(r) if r else None


def normalize(draft):
    lines = []
    for item in draft.items:
        line = item.model_dump()
        line['description'] = line['description'].strip()
        if not line['description']: fail('Every estimate item needs a description.', 422)
        line['gst_type'] = line['gst_type'] or ('No GST' if line['gst_rate'] == 0 else 'CGST+SGST')
        line['gst_rate'] = 0 if line['gst_type'] == 'No GST' else line['gst_rate'] if line['gst_rate'] is not None else draft.gst_rate
        if line['gst_type'] != 'No GST' and line['gst_rate'] not in (5, 9, 12, 18, 28): fail('GST rate must be 5%, 9%, 12%, 18%, or 28%.', 422)
        lines.append(line)
    result = totals(lines, draft.discount)
    if not all(math.isfinite(v) for k,v in result.items() if k != 'lines'): fail('Estimate amounts are too large.', 422)
    return lines, result


def save_lines(c, estimate_id, lines):
    position = c.scalar(text('SELECT coalesce(max(line_no),0) FROM estimate_lines WHERE estimate_id=:id'), {'id': estimate_id})
    now = datetime.now(timezone.utc).isoformat()
    for i, line in enumerate(lines):
        insert(c, 'estimate_lines', dict(estimate_id=estimate_id, line_no=position+i+1, kind=line['kind'], description=line['description'], quantity=line['qty'], rate=line['rate'], gst_type=line['gst_type'], gst_rate=line['gst_rate'], created_at=now, updated_at=now, **({'task_list_item_id':line['task_list_item_id']} if 'task_list_item_id' in line else {})))


@router.post('/jobs/{job_id}/estimate')
def save_estimate(job_id: int, value: Draft, request: Request):
    lines, calculated = normalize(value)
    with command(request, value.model_dump()) as (c,u,replay,save):
        j = row(c, 'job_cards', job_id); job_access(u,j)
        if replay: return replay
        old = current(c, job_id)
        now = datetime.now(timezone.utc)
        if old:
            mutable(old, value.version)
            if old['status'] not in ('DRAFT','APPROVED'): fail('This estimate cannot be edited.',409)
            estimate = update_fields(c, 'estimates', old['id'], dict(discount=value.discount, gst_rate=value.gst_rate, approval_note=value.notes.strip(), updated_by=u['user_id'], updated_at=now))
            for item in c.execute(text('SELECT id FROM estimate_lines WHERE estimate_id=:id AND archived_at IS NULL'), {'id':old['id']}).mappings():
                update_fields(c,'estimate_lines',item['id'],dict(archived_at=now.isoformat(), archived_reason='Replaced by estimate edit', updated_at=now.isoformat()))
        else:
            if value.version is not None: fail('Record changed. Reload before saving.',409)
            revision = c.scalar(text('SELECT coalesce(max(revision),0)+1 FROM estimates WHERE job_card_id=:j'), {'j':job_id})
            estimate = insert(c,'estimates',dict(job_card_id=job_id, revision=revision, status='DRAFT', discount=value.discount, gst_rate=value.gst_rate, approval_note=value.notes.strip(), created_by=u['user_id'], updated_by=u['user_id']))
        save_lines(c, estimate['id'], lines)
        reconcile_artifacts(c,u,j)
        return save(dict(id=estimate['id'], version=estimate['version'], number='EST-'+j['job_no'], totals=calculated))


class Snapshot(Input):
    templateId: str = Field(max_length=500)
    html: str = Field(min_length=1, max_length=2000000)
    values: dict[str,str]
    lines: list[dict]


class SafeDocument(HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag.lower() in ('script','iframe','object','embed','base','form','meta'):
            # Template charset/viewport meta tags are inert.
            if tag.lower() != 'meta' or any(k.lower() == 'http-equiv' for k,v in attrs): fail('Unsafe document content.',422)
        for key, value in attrs:
            if key.lower().startswith('on') or key.lower() == 'srcdoc': fail('Unsafe document content.',422)
            if key.lower() in ('src','href','xlink:href') and value and re.match(r'\s*(javascript|vbscript):',value,re.I): fail('Unsafe document content.',422)


class Approval(Input):
    version: int
    note: str = Field(min_length=1, max_length=10000)
    snapshot: Snapshot


@router.post('/jobs/{job_id}/estimate/approve')
def approve_estimate(job_id: int, value: Approval, request: Request):
    if not value.note.strip(): fail('An approval note is required.',422)
    SafeDocument().feed(value.snapshot.html)
    with command(request,value.model_dump()) as (c,u,replay,save):
        j=row(c,'job_cards',job_id);job_access(u,j)
        if replay:return replay
        e=current(c,job_id)
        if not e:fail('Generate the Estimate before approving it.',422)
        mutable(e,value.version)
        if e['status']=='APPROVED':fail('The Estimate is already approved.',409)
        lines=[dict(r) for r in c.execute(text('SELECT id,kind,description,quantity,rate,gst_type,gst_rate FROM estimate_lines WHERE estimate_id=:e AND archived_at IS NULL ORDER BY line_no'),{'e':e['id']}).mappings()]
        now=datetime.now(timezone.utc)
        native={'id':e['id'],'jobId':job_id,'revision':e['revision'],'status':e['status'],
                'lines':[dict(id=line['id'],kind=line['kind'],description=line['description'],quantity=float(line['quantity']),rate=float(line['rate']),gstRate=float(line['gst_rate']),gstType=line['gst_type']) for line in lines],
                'discount':float(e['discount']),'gstRate':float(e['gst_rate']),'note':e['approval_note'],'approvalNote':value.note.strip()}
        updated=update_fields(c,'estimates',e['id'],dict(status='APPROVED', approval_note=value.note.strip(), approved_snapshot=json.dumps(native), updated_by=u['user_id'],updated_at=now))
        insert(c,'estimate_decisions',dict(estimate_id=e['id'],job_card_id=job_id,outcome='approved',channel='in_person',decided_at=now,actor_id=u['user_id'],note=value.note.strip()))
        snapshot={**value.snapshot.model_dump(), 'id':f"{job_id}:estimate:EST-{j['job_no']}:{now.isoformat()}", 'jobId':job_id,'jobNo':j['job_no'],'kind':'estimate','number':'EST-'+j['job_no'],'state':'frozen','frozenAt':now.isoformat()}
        c.execute(text('INSERT INTO document_snapshots(tenant_id,branch_id,job_card_id,source_kind,source_id,snapshot_version,values,html,availability) VALUES(:t,:b,:j,\'estimate\',:e,1,CAST(:v AS jsonb),:h,\'READY\')'),dict(t=j['tenant_id'],b=j['branch_id'],j=job_id,e=e['id'],v=json.dumps(snapshot),h=value.snapshot.html))
        reconcile_artifacts(c,u,j)
        history(c,row(c,'job_cards',job_id),'Estimate approved: '+value.note.strip())
        return save(dict(id=e['id'],version=updated['version']))


@router.get('/documents/snapshots')
def snapshots(request: Request):
    with business(request) as (c,_):
        return [r['values'] for r in c.execute(text("SELECT values FROM document_snapshots WHERE availability='READY' AND values ? 'jobNo' ORDER BY id")).mappings()]


class MediaInput(Input):
    label: str = Field(min_length=1,max_length=1000)
    category: Literal['Before Work','After Work']
    src: str = Field(max_length=1400000)
    originalName: str = Field(max_length=1000)
    width: int = Field(ge=1,le=1600)
    height: int = Field(ge=1,le=1600)


class MediaEdit(Input):
    version: int
    label: str = Field(min_length=1,max_length=1000)
    category: Literal['Before Work','After Work']


class Archive(Input):
    version: int
    reason: str = Field(min_length=1,max_length=10000)


def media_access(u,j,category):
    job_access(u,j)
    if category == 'Before Work' and j['status'] != 'NEW':fail('Before photos can only be changed while the job is NEW.',409)
    if category != 'Before Work' and j['status'] not in ('IN_PROGRESS','COMPLETED'):fail('After photos can only be changed while the job is IN_PROGRESS or COMPLETED.',409)


def image_bytes(src):
    match=re.fullmatch(r'data:(image/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]*={0,2})',src)
    if not match:fail('Only JPEG, PNG, or WebP images are accepted.',422)
    mime,data=match.groups()
    try:content=base64.b64decode(data,validate=True)
    except (ValueError,binascii.Error):fail('The compressed image data is invalid.',422)
    if not 0<len(content)<=1000000:fail('The compressed image is too large.',422)
    valid=content.startswith(b'\xff\xd8\xff') if mime=='image/jpeg' else content.startswith(b'\x89PNG\r\n\x1a\n') if mime=='image/png' else content[:4]==b'RIFF' and content[8:12]==b'WEBP'
    if not valid:fail('The image content does not match its MIME type.',422)
    return mime,content


@router.post('/jobs/{job_id}/media')
def upload_media(job_id:int,value:MediaInput,request:Request):
    if not value.label.strip():fail('Photo label is required.',422)
    mime,content=image_bytes(value.src)
    with command(request,value.model_dump()) as (c,u,replay,save):
        j=row(c,'job_cards',job_id);media_access(u,j,value.category)
        if replay:return replay
        # src is a stable authenticated API reference, never a data URL in a row.
        media_id=c.scalar(text("SELECT nextval(pg_get_serial_sequence('job_media','id'))"))
        c.execute(text('''INSERT INTO job_media(id,tenant_id,branch_id,job_card_id,label,category,src,mime_type,byte_size,original_name,width,height,created_by,updated_by)
          OVERRIDING SYSTEM VALUE VALUES(:id,:t,:b,:j,:l,:cat,:src,:mime,:size,:name,:w,:h,:a,:a)'''),dict(id=media_id,t=j['tenant_id'],b=j['branch_id'],j=job_id,l=value.label.strip(),cat=value.category,src=f'/api/v1/media/{media_id}/content',mime=mime,size=len(content),name=value.originalName.strip(),w=value.width,h=value.height,a=u['user_id']))
        insert(c,'slice_media_content',dict(job_card_id=job_id,media_id=media_id,content=content,sha256=hashlib.sha256(content).hexdigest(),created_by=u['user_id']))
        reconcile_artifacts(c,u,j)
        return save(dict(id=media_id))


@router.get('/media/{media_id}/content')
def media_content(media_id:int,request:Request):
    with business(request) as (c,_):
        media=c.execute(text('SELECT m.mime_type,b.content FROM job_media m JOIN slice_media_content b ON b.media_id=m.id WHERE m.id=:id AND m.archived_at IS NULL'),{'id':media_id}).mappings().first()
        if not media:fail('Original media unavailable.',404)
        return Response(bytes(media['content']),media_type=media['mime_type'],headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'Content-Disposition':'inline'})


@router.post('/media/{media_id}/metadata')
def edit_media(media_id:int,value:MediaEdit,request:Request):
    if not value.label.strip():fail('Photo label is required.',422)
    with command(request,value.model_dump()) as (c,u,replay,save):
        media=row(c,'job_media',media_id);j=row(c,'job_cards',media['job_card_id'])
        media_access(u,j,'After Work' if media['category']=='After Work' else 'Before Work');media_access(u,j,value.category)
        if replay:return replay
        mutable(media,value.version)
        r=update_fields(c,'job_media',media_id,dict(label=value.label.strip(),category=value.category,updated_by=u['user_id'],updated_at=datetime.now(timezone.utc)))
        return save(dict(id=media_id,version=r['version']))


@router.post('/media/{media_id}/archive')
def archive_media(media_id:int,value:Archive,request:Request):
    if not value.reason.strip():fail('An archive reason is required.',422)
    with command(request,value.model_dump()) as (c,u,replay,save):
        media=row(c,'job_media',media_id);j=row(c,'job_cards',media['job_card_id']);media_access(u,j,'After Work' if media['category']=='After Work' else 'Before Work')
        if replay:return replay
        mutable(media,value.version)
        now=datetime.now(timezone.utc)
        update_fields(c,'job_media',media_id,dict(archived_at=now,archive_reason=value.reason.strip(),updated_by=u['user_id'],updated_at=now))
        if j['status']=='IN_PROGRESS' and not c.scalar(text("SELECT EXISTS(SELECT 1 FROM job_media WHERE job_card_id=:j AND archived_at IS NULL AND btrim(src)<>'')"),{'j':j['id']}):
            items=list(c.execute(text("SELECT * FROM job_checklist_items WHERE cycle_id=(SELECT max(id) FROM job_checklist_cycles WHERE job_card_id=:j AND stage='IN_PROGRESS') ORDER BY sort_order"),{'j':j['id']}).mappings())
            start=next((i['sort_order'] for i in items if i['label']=='Photos Shared' and i['checked_at']),None)
            if start is not None:
                for item in items:
                    if item['sort_order']>=start:
                        # Match resetMissingPhotoEvidence: retain N/A and timing history.
                        update_fields(c,'job_checklist_items',item['id'],dict(checked_by=None,checked_at=None,completed_at=None))
                sub=next(i['label'] for i in items if not i['checked_at'] or i['sort_order']>=start)
                update_fields(c,'job_cards',j['id'],dict(sub_status=sub,updated_by=u['user_id'],updated_at=now))
        return save(dict(id=media_id))


class MaterialCommand(Input):
    operation: Literal['submit','Approved','Rejected','resubmit']
    version: int | None = None
    row_id: int | None = None
    reason: str = Field(default='', max_length=10000)


@router.post('/jobs/{job_id}/material-approval')
def material_approval(job_id:int,value:MaterialCommand,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        j=row(c,'job_cards',job_id)
        if j['archived_at'] or j['status'] in ('CLOSED','CANCELLED'):fail('This job card is read-only.',409)
        op=value.operation
        if op=='submit' and u['role']!='store':fail('Only Store can submit a material approval.',403)
        if op in ('Approved','Rejected') and u['role']!='admin':fail('Only Admin can decide material approvals.',403)
        if op=='resubmit':
            if u['role']!='service':fail('Only the linked Service Advisor can resubmit a rejected material approval.',403)
            job_access(u,j)
        if replay:return replay
        approval=c.execute(text('SELECT * FROM material_approvals WHERE job_card_id=:j FOR UPDATE'),{'j':job_id}).mappings().first()
        now=datetime.now(timezone.utc).isoformat()
        if op=='submit':
            request_row=c.execute(text('SELECT * FROM material_requests WHERE id=:id'),{'id':value.row_id}).mappings().first()
            if not request_row:fail('Material request not found.',404)
            if request_row['job_card_id']!=job_id or request_row['archived_at'] or request_row['invoiced_in'] or request_row['status'] not in ('Requested','Re-requested'):fail('Only non-invoiced Requested or Re-requested material can be submitted for approval.',422)
            if approval and approval['status']=='Pending':return save(dict(id=approval['id']))
            if j['status']!='IN_PROGRESS':fail('Material approval can only be submitted for an IN_PROGRESS job.',409)
            if approval:fail('The rejected approval must be corrected and resubmitted by the linked Service Advisor.',409)
            approval=insert(c,'material_approvals',dict(job_card_id=job_id,status='Pending',submitted_by=u['profile_id'],submitted_at=now,revision=1))
            j=dict(update_fields(c,'job_cards',job_id,dict(status='HOLD',updated_by=u['user_id'],updated_at=datetime.now(timezone.utc))))
            action='Submitted';note='Store requested material approval'
            history(c,j,'Material approval pending: Store submitted consolidated request')
        else:
            if not approval:fail('There is no material approval for this job.',409)
            if approval['version']!=value.version:fail('Record changed. Reload before saving.',409)
            if j['status']!='HOLD':fail('A pending material approval must keep the job on HOLD.',409)
            if op=='resubmit':
                if approval['status']!='Rejected':fail('Only a rejected held job can be resubmitted for approval.',409)
                if not c.scalar(text("SELECT EXISTS(SELECT 1 FROM material_requests WHERE job_card_id=:j AND archived_at IS NULL AND invoiced_in IS NULL AND status IN ('Requested','Re-requested'))"),{'j':job_id}):fail('Add or correct a Requested material row before resubmitting.',422)
                fields=dict(status='Pending',submitted_by=u['profile_id'],submitted_at=now,reviewed_by=None,reviewed_at=None,rejection_reason=None,revision=approval['revision']+1)
                action='Resubmitted';note='Service Advisor corrected and resubmitted material approval'
                history(c,j,'Material approval resubmitted and pending')
            else:
                if approval['status']!='Pending':fail('There is no pending material approval for this job.',409)
                if op=='Rejected' and not value.reason.strip():fail('A rejection reason is required.',422)
                fields=dict(status=op,reviewed_by=u['profile_id'],reviewed_at=now,rejection_reason=value.reason.strip() if op=='Rejected' else None)
                action=op;note='Admin approved material issue' if op=='Approved' else value.reason.strip()
                if op=='Approved':
                    j=dict(update_fields(c,'job_cards',job_id,dict(status='IN_PROGRESS',updated_by=u['user_id'],updated_at=datetime.now(timezone.utc))))
                    reconcile_artifacts(c,u,j)
                history(c,j,'Material approval approved: Store may issue retained requests' if op=='Approved' else 'Material approval rejected: '+note)
            approval=update_fields(c,'material_approvals',approval['id'],fields)
        insert(c,'material_approval_events',dict(approval_id=approval['id'],job_card_id=job_id,action=action,actor_id=u['profile_id'],at=now,note=note,revision=approval['revision']))
        return save(dict(id=approval['id'],version=approval['version']))


class Prefill(Input):
    version: int | None = None


@router.post('/jobs/{job_id}/estimate/prefill')
def prefill(job_id:int,value:Prefill,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        j=row(c,'job_cards',job_id);job_access(u,j)
        if j['status'] not in ('NEW','IN_PROGRESS'):fail('Task list changes require a NEW or IN_PROGRESS job.',409)
        if replay:return replay
        e=current(c,job_id)
        if e:
            mutable(e,value.version)
            if e['status']=='APPROVED':fail('An approved estimate cannot be prefilled.',409)
        else:
            if value.version is not None:fail('Record changed. Reload before saving.',409)
            e=insert(c,'estimates',dict(job_card_id=job_id,revision=1,status='DRAFT',discount=0,gst_rate=18,approval_note='Awaiting customer confirmation',created_by=u['user_id'],updated_by=u['user_id']))
        tasks=c.execute(text('SELECT * FROM job_service_tasks t WHERE job_card_id=:j AND archived_at IS NULL AND NOT EXISTS(SELECT 1 FROM estimate_lines l WHERE l.estimate_id=:e AND l.task_list_item_id=t.id AND l.archived_at IS NULL) ORDER BY id'),{'j':job_id,'e':e['id']}).mappings()
        save_lines(c,e['id'],[dict(kind='Service',description=t['name'],qty=1,rate=t['base_rate'],gst_type='No GST' if t['gst_rate']==0 else 'CGST+SGST',gst_rate=t['gst_rate'],task_list_item_id=t['id']) for t in tasks])
        update_fields(c,'estimates',e['id'],dict(updated_by=u['user_id'],updated_at=datetime.now(timezone.utc)))
        reconcile_artifacts(c,u,j)
        return save(dict(id=e['id']))
