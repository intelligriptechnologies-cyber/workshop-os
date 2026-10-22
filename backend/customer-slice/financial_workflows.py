"""Approved invoice editing and full-payment handover on the existing slice."""
from datetime import datetime, timezone
from typing import Literal
import math, json
from fastapi import APIRouter, Request
from pydantic import Field
from sqlalchemy import text
from api import fail, business
from operations import (command, row, mutable, insert, update_fields, history,
                        cycle, complete_cycle, reconcile_artifacts, resolve_checklist_state, STAGES)
from estimate_documents import Input, Line, current, totals, round2, Snapshot, SafeDocument

router = APIRouter(prefix='/api/v1/financial')


class InvoiceLine(Line):
    id: int | None = None
    material_row_id: int | None = None


class InvoiceDraft(Input):
    version: int | None = None
    tallyInvoiceNo: str = Field(default='', max_length=1000)
    discount: float = Field(default=0, ge=0)
    notes: str = Field(default='', max_length=10000)
    note: str = Field(default='', max_length=10000)
    items: list[InvoiceLine] = Field(min_length=1, max_length=500)


class FinancialSnapshot(Snapshot):
    kind: Literal['invoice','payment-receipt','gate-pass']
    number: str


class PaymentInput(Input):
    version: int
    mode: Literal['UPI','Cash','Card','Bank transfer','Other']
    otherDetail: str = Field(default='', max_length=1000)
    reference: str = Field(default='', max_length=1000)
    notes: str = Field(default='', max_length=10000)
    snapshots: list[FinancialSnapshot] = Field(default_factory=list, max_length=3)
    receiptNumber: str | None = None
    gatePassNumber: str | None = None


class VoidInput(Input):
    version: int
    reason: str = Field(min_length=1, max_length=10000)
    snapshot: FinancialSnapshot | None = None


def now():
    return datetime.now(timezone.utc)


def require(value, message, status=422):
    if not value: fail(message, status)


def rows(c, table, condition, **params):
    return [dict(r) for r in c.execute(text(f'SELECT * FROM {table} WHERE {condition} ORDER BY id'), params).mappings()]


def native(invoice):
    require(invoice.get('slice_finance') and not invoice.get('history_source_sha'),
            'Historical financial records are preserved. A correction requires explicit approval.', 409)


def billing(u, admin=False):
    require(u['role'] in (('admin',) if admin else ('admin','accounts')), 'This role cannot change these financial records.', 403)


def invoice_access(u, j, create=False):
    linked = u['role']=='service' and (j['advisor_id']==u['user_id'] or (j['advisor_id'] is None and j['historical_advisor_id']==u['profile_id']))
    allowed = u['role']=='admin' or linked or (create and u['role']=='accounts' and j['status']=='COMPLETED')
    require(allowed, 'This user cannot change the invoice for this job card.',403)
    require(not j['archived_at'] and j['status'] in (('IN_PROGRESS','COMPLETED') if create else ('IN_PROGRESS','COMPLETED','HOLD')), 'This job card is read-only for invoicing.',409)


def number(c, table, column, prefix, preferred):
    candidate=prefix+str(preferred).zfill(5)
    if not c.scalar(text(f'SELECT EXISTS(SELECT 1 FROM {table} WHERE {column}=:n)'),{'n':candidate}): return candidate
    highest=preferred
    for r in rows(c,table,f'{column} LIKE :p',p=prefix+'%'):
        suffix=r[column][len(prefix):]
        if suffix.isdigit(): highest=max(highest,int(suffix))
    return prefix+str(highest+1).zfill(5)


def priced(draft):
    lines=[]
    for item in draft.items:
        line=item.model_dump(); line['description']=line['description'].strip()
        require(line['description'],'Invoice item description is required.')
        line['gst_type']=line['gst_type'] or ('No GST' if line['gst_rate']==0 else 'CGST+SGST')
        line['gst_rate']=0 if line['gst_type']=='No GST' else line['gst_rate'] if line['gst_rate'] is not None else 18
        require(line['gst_type']=='No GST' or line['gst_rate'] in (5,9,12,18,28),'GST rate must be 5%, 9%, 12%, 18%, or 28%.')
        require(math.isfinite(line['qty']*line['rate']) and line['qty']*line['rate']<9e12,'Invoice amount is too large.')
        lines.append(line)
    return lines, totals(lines,draft.discount)


def money_fields(calculated):
    return dict(subtotal=calculated['subtotal'],gst_amount=calculated['gst'],total=calculated['total'],
                subtotal_paise=round(calculated['subtotal']*100),discount_paise=round(calculated['discount']*100),
                tax_paise=round(calculated['gst']*100),total_paise=round(calculated['total']*100))


def claim(c,j,material_id,invoice_id):
    material=row(c,'material_requests',material_id)
    require(material['job_card_id']==j['id'] and not material['archived_at'],'Material row does not belong to this job card.')
    require(material['status']=='Issued','Only Issued material rows can be invoiced.')
    require(material['invoiced_in'] in (None,invoice_id),'This material row is already on another invoice.',409)
    update_fields(c,'material_requests',material_id,dict(invoiced_in=invoice_id,updated_at=now().isoformat()))


def save_lines(c,j,invoice,lines,calculated,existing):
    old={r['id']:r for r in existing}; kept=set(); material_ids=set()
    position=c.scalar(text('SELECT coalesce(max(line_no),0) FROM invoice_lines WHERE invoice_id=:id'),{'id':invoice['id']})
    for line,amounts in zip(lines,calculated['lines']):
        previous=old.get(line['id']); material_id=previous['material_row_id'] if previous else line['material_row_id']
        if previous: require(line['material_row_id']==previous['material_row_id'],'An existing material association cannot be changed.')
        if material_id:
            require(material_id not in material_ids,'A material row can only be billed once.');material_ids.add(material_id)
            claim(c,j,material_id,invoice['id'])
        fields=dict(description=line['description'],kind=line['kind'],quantity=line['qty'],rate=line['rate'],
                    unit_amount_paise=round(round2(line['rate'])*100),gst_type=line['gst_type'],gst_rate=line['gst_rate'],
                    gst_rate_bps=round(line['gst_rate']*100),taxable_paise=round(amounts['taxable']*100),
                    tax_paise=round(amounts['gst']*100),total_paise=round(amounts['total']*100),updated_at=now().isoformat())
        if previous:
            kept.add(previous['id']);update_fields(c,'invoice_lines',previous['id'],fields)
        else:
            position+=1
            insert(c,'invoice_lines',dict(**fields,invoice_id=invoice['id'],line_no=position,material_row_id=material_id,created_at=now().isoformat()))
    for previous in existing:
        if previous['id'] not in kept:
            update_fields(c,'invoice_lines',previous['id'],dict(archived_at=now().isoformat(),archived_reason='Removed in invoice editor',updated_at=now().isoformat()))
            if previous['material_row_id'] and previous['material_row_id'] not in material_ids:
                update_fields(c,'material_requests',previous['material_row_id'],dict(invoiced_in=None,updated_at=now().isoformat()))


def event(c,u,invoice,kind,note,old_total,new_total,detail):
    insert(c,'legacy_invoice_events',dict(job_card_id=invoice['job_card_id'],invoice_id=invoice['id'],kind=kind,
        by_user=u['profile_id'],at=now().isoformat(),note=note,old_total=old_total,new_total=new_total,detail=detail))


def freeze(c,j,snapshot,source_id,state='frozen'):
    SafeDocument().feed(snapshot.html)
    timestamp=now().isoformat()
    value={**snapshot.model_dump(), 'id':f"{j['id']}:{snapshot.kind}:{snapshot.number}:{timestamp}",
        'jobId':j['id'],'jobNo':j['job_no'],'state':state,'frozenAt':timestamp}
    if state=='void':value['voidedAt']=timestamp
    c.execute(text("INSERT INTO document_snapshots(tenant_id,branch_id,job_card_id,source_kind,source_id,snapshot_version,values,html,availability) VALUES(:t,:b,:j,:kind,:id,1,CAST(:v AS jsonb),:html,'READY')"),dict(t=j['tenant_id'],b=j['branch_id'],j=j['id'],kind=snapshot.kind,id=source_id,v=json.dumps(value),html=snapshot.html))


@router.get('/invoices/{invoice_id}/payment-preview')
def payment_preview(invoice_id:int,request:Request):
    with business(request,snapshot=True) as (c,u):
        billing(u)
        found=c.execute(text('SELECT * FROM invoices WHERE id=:i'),{'i':invoice_id}).mappings().first()
        require(found is not None,'Record not found.',404)
        invoice=dict(found)
        native(invoice)
        j=dict(c.execute(text('SELECT * FROM job_cards WHERE id=:j'),{'j':invoice['job_card_id']}).mappings().one())
        return dict(version=invoice['version'],receiptNumber=number(c,'legacy_receipts','receipt_no','RCT-',4500+invoice_id),
            gatePassNumber=number(c,'legacy_gate_passes','gate_pass_no','GP-',3100+invoice_id),timestamp=now().isoformat(),
            deliveryBy=c.scalar(text('SELECT name FROM workshop_user_profiles WHERE id=:id'),{'id':u['profile_id']}))


@router.post('/jobs/{job_id}/invoice')
def create_invoice(job_id:int,value:InvoiceDraft,request:Request):
    lines,calculated=priced(value)
    with command(request,value.model_dump()) as (c,u,replay,save):
        if replay:return replay
        j=row(c,'job_cards',job_id);invoice_access(u,j,True)
        estimate=current(c,job_id)
        require(estimate and estimate['status']=='APPROVED','Approve the Estimate before creating an invoice.')
        require(not rows(c,'invoices','job_card_id=:j AND voided_at IS NULL',j=job_id),'This job already has a current invoice.',409)
        require(value.version==j['version'],'Record changed. Reload before saving.',409)
        require(all(line['id'] is None for line in lines),'New invoices cannot reuse invoice line identities.')
        invoice=insert(c,'invoices',dict(job_card_id=job_id,slice_finance=True,created_by=u['user_id'],
            invoice_no=number(c,'invoices','invoice_no','INV-',8900+job_id),tally_invoice_no=value.tallyInvoiceNo.strip(),
            discount=calculated['discount'],gst_rate=0,status='Pending',notes=value.notes.strip(),document_available=1,
            document_generated_at=now().isoformat(),updated_at=now().isoformat(),**money_fields(calculated)))
        save_lines(c,j,invoice,lines,calculated,[])
        event(c,u,invoice,'create','',None,calculated['total'],f"{len(lines)} lines, {sum(bool(l['material_row_id']) for l in lines)} material row(s) picked up")
        reconcile_artifacts(c,u,j)
        return save(dict(id=invoice['id'],version=invoice['version'],totals=calculated))


@router.put('/invoices/{invoice_id}')
def edit_invoice(invoice_id:int,value:InvoiceDraft,request:Request):
    lines,calculated=priced(value)
    with command(request,value.model_dump()) as (c,u,replay,save):
        if replay:return replay
        invoice=row(c,'invoices',invoice_id);native(invoice);mutable(invoice,value.version)
        j=row(c,'job_cards',invoice['job_card_id']);invoice_access(u,j)
        require(not invoice['voided_at'] and invoice['status']=='Pending','Only a Pending invoice can be edited.',409)
        existing=rows(c,'invoice_lines','invoice_id=:i AND archived_at IS NULL',i=invoice_id)
        ids=[l['id'] for l in lines if l['id'] is not None]
        require(len(ids)==len(set(ids)) and set(ids)<=set(l['id'] for l in existing),'Invoice item does not belong to this invoice or is duplicated.')
        before=[dict(id=l['id'],kind=l['kind'],description=l['description'],qty=float(l['quantity']),rate=float(l['rate']),gst_type=l['gst_type'],gst_rate=float(l['gst_rate']),material_row_id=l['material_row_id']) for l in existing]
        changed=lines!=before or value.discount!=float(invoice['discount'])
        require(not changed or not rows(c,'payments','invoice_id=:i AND voided_at IS NULL',i=invoice_id),'Invoice financial fields are locked after the first active payment.',409)
        require(not changed or value.note.strip(),'A note is required to edit invoice lines or discount.')
        fields=dict(tally_invoice_no=value.tallyInvoiceNo.strip(),notes=value.notes.strip(),updated_at=now().isoformat())
        if changed:
            fields.update(discount=value.discount,**money_fields(calculated))
            save_lines(c,j,invoice,lines,calculated,existing)
        updated=update_fields(c,'invoices',invoice_id,fields)
        if changed:event(c,u,invoice,'edit',value.note.strip(),invoice['total'],calculated['total'],'Invoice lines or discount changed; full before/after values retained in audit')
        reconcile_artifacts(c,u,j)
        return save(dict(id=invoice_id,version=updated['version']))


@router.post('/invoices/{invoice_id}/void')
def void_invoice(invoice_id:int,value:VoidInput,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        billing(u)
        if replay:return replay
        invoice=row(c,'invoices',invoice_id);native(invoice);mutable(invoice,value.version)
        j=row(c,'job_cards',invoice['job_card_id'])
        require(j['status'] not in ('CLOSED','CANCELLED') and not j['archived_at'] and (u['role']=='admin' or j['status']=='COMPLETED'),
                'This job does not permit invoice voiding.',409)
        require(value.reason.strip(),'An invoice void reason is required.')
        require(not invoice['voided_at'] and not rows(c,'payments','invoice_id=:i AND voided_at IS NULL',i=invoice_id),'An invoice with active payments or a previous void cannot be voided.',409)
        require(value.snapshot and value.snapshot.kind=='invoice' and value.snapshot.number==invoice['invoice_no'],'The current invoice document is required for void history.')
        freeze(c,j,value.snapshot,invoice_id,'void')
        update_fields(c,'invoices',invoice_id,dict(voided_at=now().isoformat(),void_reason=value.reason.strip(),updated_at=now().isoformat()))
        for material in rows(c,'material_requests','invoiced_in=:i',i=invoice_id):
            update_fields(c,'material_requests',material['id'],dict(invoiced_in=None,updated_at=now().isoformat()))
        event(c,u,invoice,'void',value.reason.strip(),invoice['total'],None,'Material rows unlocked')
        for item in rows(c,'job_checklist_items',"job_card_id=:j AND label='Invoice Ready' AND cycle_id=(SELECT max(id) FROM job_checklist_cycles WHERE job_card_id=:j)",j=j['id']):
            if item['checked_at']:resolve_checklist_state(c,u,j,item,False,False,now())
        return save(dict(id=invoice_id))


def post_payment(c,u,invoice,value):
    billing(u);native(invoice);mutable(invoice,value.version)
    j=row(c,'job_cards',invoice['job_card_id'])
    require(j['status']=='COMPLETED' and not j['archived_at'],'Only a completed job card can be paid and handed over.',409)
    require(not invoice['voided_at'] and invoice['status']=='Pending','Only a current Pending invoice can be paid.',409)
    require(not rows(c,'payments','invoice_id=:i AND voided_at IS NULL',i=invoice['id']),'This invoice already has a payment. Void it before recording another.',409)
    require(invoice['total']>0,'An invoice with no amount due cannot be paid.')
    require(value.mode!='Other' or value.otherDetail.strip(),'Other payment detail is required.')
    receipt_number=number(c,'legacy_receipts','receipt_no','RCT-',4500+invoice['id'])
    gate_number=number(c,'legacy_gate_passes','gate_pass_no','GP-',3100+invoice['id'])
    require(value.receiptNumber==receipt_number and value.gatePassNumber==gate_number,'Document numbering changed. Reload before recording payment.',409)
    expected={'invoice':invoice['invoice_no'],'payment-receipt':receipt_number,'gate-pass':gate_number}
    require(len(value.snapshots)==3 and {s.kind:s.number for s in value.snapshots}==expected,'Invoice, receipt and gate pass snapshots are required.')
    items=rows(c,'job_checklist_items','job_card_id=:j AND cycle_id=(SELECT max(id) FROM job_checklist_cycles WHERE job_card_id=:j)',j=j['id'])
    items.sort(key=lambda i:i['sort_order'])
    require([i['label'] for i in items]==STAGES['COMPLETED'],'Historical checklist is incomplete; preserved quarantine must be resolved before this transition.',409)
    require(all(i['checked_at'] for i in items if i['label']!='Payment Received' and i['required']),'Confirm the completed checklist and Google review/feedback reminder before recording payment.',409)
    timestamp=now()
    payment=insert(c,'payments',dict(invoice_id=invoice['id'],job_card_id=j['id'],slice_finance=True,amount=invoice['total'],
        amount_paise=invoice['total_paise'],method={'Cash':'CASH','Card':'CARD','UPI':'UPI','Bank transfer':'BANK_TRANSFER','Other':'OTHER'}[value.mode],
        mode=value.mode,other_detail=value.otherDetail.strip() if value.mode=='Other' else '',reference=value.reference.strip(),notes=value.notes.strip(),
        received_at=timestamp,received_by=u['user_id'],updated_at=timestamp.isoformat()))
    receipt=insert(c,'legacy_receipts',dict(job_card_id=j['id'],invoice_id=invoice['id'],receipt_no=receipt_number,created_at=timestamp.isoformat()))
    update_fields(c,'invoices',invoice['id'],dict(status='Cleared',updated_at=timestamp.isoformat()))
    payment_item=next(i for i in items if i['label']=='Payment Received')
    resolve_checklist_state(c,u,j,payment_item,True,False,timestamp)
    complete_cycle(c,j)
    visit=row(c,'visits',j['visit_id']);vehicle=row(c,'vehicles',visit['vehicle_id'])
    actor=c.scalar(text('SELECT name FROM workshop_user_profiles WHERE id=:id'),{'id':u['profile_id']})
    j=dict(update_fields(c,'job_cards',j['id'],dict(status='CLOSED',sub_status=STAGES['CLOSED'][0],closed_at=j['closed_at'] or timestamp,
        delivery_by=actor or j['delivery_by'] or 'Accounts',final_km=j['final_km'] if j['final_km'] is not None else vehicle['km'] or 0,
        acknowledgement=j['acknowledgement'] or 'Payment confirmed and vehicle handed over',updated_by=u['user_id'],updated_at=timestamp)))
    cycle(c,j);history(c,j,'Payment received and vehicle handed over')
    gate=insert(c,'legacy_gate_passes',dict(job_card_id=j['id'],invoice_id=invoice['id'],gate_pass_no=gate_number,created_at=timestamp.isoformat()))
    for snapshot in value.snapshots:
        freeze(c,j,snapshot,{'invoice':invoice['id'],'payment-receipt':receipt['id'],'gate-pass':gate['id']}[snapshot.kind])
    for item in rows(c,'job_checklist_items','cycle_id=(SELECT max(id) FROM job_checklist_cycles WHERE job_card_id=:j)',j=j['id']):
        resolve_checklist_state(c,u,j,item,True,False,timestamp)
    return dict(closed=True,id=payment['id'],invoice_id=invoice['id'],job_id=j['id'],receipt_id=receipt['id'],gate_pass_id=gate['id'])


@router.post('/invoices/{invoice_id}/payment')
def record_payment(invoice_id:int,value:PaymentInput,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        billing(u)
        if replay:return replay
        return save(post_payment(c,u,row(c,'invoices',invoice_id),value))


@router.post('/payments/{payment_id}/void')
def void_payment(payment_id:int,value:VoidInput,request:Request):
    with command(request,value.model_dump()) as (c,u,replay,save):
        billing(u,True)
        if replay:return replay
        payment=row(c,'payments',payment_id);native(payment);mutable(payment,value.version)
        j=row(c,'job_cards',payment['job_card_id'])
        require(j['status'] not in ('CLOSED','CANCELLED') and not j['archived_at'],'A terminal job card is read-only.',409)
        require(not payment['voided_at'] and value.reason.strip(),'An active payment and void reason are required.')
        invoice=row(c,'invoices',payment['invoice_id']);native(invoice)
        fields=dict(voided_at=now().isoformat(),void_reason=value.reason.strip())
        update_fields(c,'payments',payment_id,dict(**fields,updated_at=now().isoformat()))
        for receipt in rows(c,'legacy_receipts','invoice_id=:i AND voided_at IS NULL',i=invoice['id']): update_fields(c,'legacy_receipts',receipt['id'],fields)
        update_fields(c,'invoices',invoice['id'],dict(status='Pending',updated_at=now().isoformat()))
        for item in rows(c,'job_checklist_items',"job_card_id=:j AND label='Payment Received' AND cycle_id=(SELECT max(id) FROM job_checklist_cycles WHERE job_card_id=:j)",j=j['id']):
            if item['checked_at']:resolve_checklist_state(c,u,j,item,False,False,now())
        return save(dict(id=payment_id))
