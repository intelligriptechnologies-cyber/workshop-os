# Existing backend API and schema declarations

Static source only. No backend migrations or network mutations executed. Live table existence, record counts and enforcement are UNVERIFIED.

## API functions

### backend/app/execution.py:60 ? list_my_tasks

```python
def list_my_tasks(scope: ScopedTenant) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, False)
    rows = session.execute(text("SELECT * FROM technician_tasks WHERE assigned_to=:actor ORDER BY updated_at DESC,id DESC"), {"actor": str(current.actor_id)}).mappings().all()
    return [_task(dict(row)) for row in rows]
```

### backend/app/execution.py:67 ? assign_task

```python
def assign_task(input: TaskCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, True)
    if "tenant.users.manage" not in current.permissions:
        raise auth_error("TASK_ASSIGNMENT_FORBIDDEN", status.HTTP_403_FORBIDDEN)
    job = _row_or_404(session, "job_cards", input.job_id, "JOB_NOT_FOUND")
    if job["branch_id"] not in current.branch_ids: raise auth_error("BRANCH_ACCESS_DENIED", status.HTTP_403_FORBIDDEN)
    valid_assignee = session.execute(text("""SELECT 1 FROM tenant_memberships membership
        JOIN membership_roles assignment ON assignment.membership_id=membership.id
        JOIN role_permissions permission ON permission.role_id=assignment.role_id
        JOIN membership_branches branch_assignment ON branch_assignment.membership_id=membership.id
        WHERE membership.tenant_id=:tenant AND membership.user_id=:user AND membership.status='ACTIVE'
          AND branch_assignment.branch_id=:branch
          AND permission.permission IN ('page.my-tasks.write','page.work-update.write') LIMIT 1"""), {"tenant": str(current.tenant_id), "user": str(input.assigned_to), "branch": str(job["branch_id"])}).scalar()
    if not valid_assignee: raise auth_error("TECHNICIAN_NOT_IN_TENANT", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""INSERT INTO technician_tasks (tenant_id,branch_id,job_card_id,assigned_to,title,notes,created_by,updated_by)
        VALUES (:tenant,:branch,:job,:assignee,:title,:notes,:actor,:actor) RETURNING *"""), {"tenant":str(current.tenant_id),"branch":str(job["branch_id"]),"job":input.job_id,"assignee":str(input.assigned_to),"title":input.title.strip(),"notes":input.notes.strip(),"actor":str(current.actor_id)}).mappings().one()
    payload = _task(dict(row)); _audit(session,current,"TECHNICIAN_TASK_ASSIGNED",input.title.strip(),{},payload); return payload
```

### backend/app/execution.py:87 ? update_task

```python
def update_task(task_id: int, input: TaskUpdate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, True); before = _row_or_404(session,"technician_tasks",task_id,"TASK_NOT_FOUND")
    if before["assigned_to"] != current.actor_id: raise auth_error("TASK_NOT_ASSIGNED_TO_ACTOR", status.HTTP_403_FORBIDDEN)
    if before["status"] in {"COMPLETED","CANCELLED"}: raise auth_error("TASK_NOT_EDITABLE",status.HTTP_422_UNPROCESSABLE_ENTITY)
    if input.status == "BLOCKED" and not input.note.strip(): raise auth_error("BLOCKER_NOTE_REQUIRED",status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("UPDATE technician_tasks SET status=:status,notes=:notes,updated_by=:actor,updated_at=now(),completed_at=CASE WHEN :status='COMPLETED' THEN now() ELSE NULL END WHERE id=:id RETURNING *"), {"status":input.status,"notes":input.note.strip() or before["notes"],"actor":str(current.actor_id),"id":task_id}).mappings().one()
    update = session.execute(text("INSERT INTO work_updates (tenant_id,branch_id,job_card_id,task_id,body,status,actor_id) VALUES (:tenant,:branch,:job,:task,:body,:status,:actor) RETURNING id,created_at"), {"tenant":str(current.tenant_id),"branch":str(before["branch_id"]),"job":before["job_card_id"],"task":task_id,"body":input.note.strip() or f"Task marked {input.status}","status":input.status,"actor":str(current.actor_id)}).mappings().one()
    payload = {"task": _task(dict(row)), "workUpdate": {"id": update["id"], "createdAt": update["created_at"]}}
    _audit(session, current, "TECHNICIAN_TASK_UPDATED", input.note.strip() or input.status, _task(before), payload)
    return payload
```

### backend/app/execution.py:100 ? upload_attachment

```python
async def upload_attachment(update_id: int, scope: ScopedTenant, file: UploadFile = File(...), label: Annotated[str, Form(max_length=1000)] = "") -> dict[str, object]:
    session, current = scope; _permission(scope, True); update = _row_or_404(session,"work_updates",update_id,"WORK_UPDATE_NOT_FOUND")
    if update["actor_id"] != current.actor_id: raise auth_error("WORK_UPDATE_NOT_OWNED",status.HTTP_403_FORBIDDEN)
    content = await file.read(10_485_761)
    if not content or len(content)>10_485_760: raise auth_error("ATTACHMENT_SIZE_INVALID",status.HTTP_422_UNPROCESSABLE_ENTITY)
    if not file.filename or not file.content_type: raise auth_error("ATTACHMENT_METADATA_REQUIRED",status.HTTP_422_UNPROCESSABLE_ENTITY)
    digest=hashlib.sha256(content).hexdigest()
    row=session.execute(text("""INSERT INTO evidence_attachments (tenant_id,branch_id,job_card_id,work_update_id,filename,content_type,size_bytes,sha256,content,uploaded_by)
      VALUES (:tenant,:branch,:job,:update,:name,:type,:size,:hash,:content,:actor) RETURNING id,filename,content_type,size_bytes,sha256,created_at"""),{"tenant":str(current.tenant_id),"branch":str(update["branch_id"]),"job":update["job_card_id"],"update":update_id,"name":label.strip() or file.filename,"type":file.content_type,"size":len(content),"hash":digest,"content":content,"actor":str(current.actor_id)}).mappings().one()
    payload = {"id":row["id"],"filename":row["filename"],"contentType":row["content_type"],"sizeBytes":row["size_bytes"],"sha256":row["sha256"],"createdAt":row["created_at"]}
    _audit(session, current, "WORK_EVIDENCE_ATTACHED", payload["filename"], {}, payload)
    return payload
```

### backend/app/execution.py:115 ? read_attachment

```python
def read_attachment(attachment_id: int, scope: ScopedTenant) -> Response:
    """Return attachment bytes only after the request's RLS scope has found it."""
    session, _ = scope; _permission(scope, False)
    row = _row_or_404(session, "evidence_attachments", attachment_id, "ATTACHMENT_NOT_FOUND")
    return Response(
        content=bytes(row["content"]),
        media_type=str(row["content_type"]),
        headers={"Content-Disposition": f'attachment; filename="{str(row["filename"]).replace(chr(34), "")}"'},
    )
```

### backend/app/execution.py:127 ? create_qc_check

```python
def create_qc_check(input: QcCheckCreate, scope: ScopedTenant) -> dict[str, object]:
    session,current=scope; _permission(scope,True); job=_row_or_404(session,"job_cards",input.job_id,"JOB_NOT_FOUND")
    if job["status"] not in {"IN_PROGRESS", "HOLD"}: raise auth_error("QC_NOT_AVAILABLE_FOR_JOB_STATUS", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row=session.execute(text("INSERT INTO qc_checks (tenant_id,branch_id,job_card_id,label,required,created_by) VALUES (:tenant,:branch,:job,:label,:required,:actor) RETURNING *"),{"tenant":str(current.tenant_id),"branch":str(job["branch_id"]),"job":input.job_id,"label":input.label.strip(),"required":input.required,"actor":str(current.actor_id)}).mappings().one()
    payload = {"id":row["id"],"jobId":row["job_card_id"],"label":row["label"],"required":row["required"],"status":row["status"]}
    _audit(session, current, "QC_CHECK_CREATED", input.label.strip(), {}, payload)
    return payload
```

### backend/app/execution.py:137 ? record_qc_result

```python
def record_qc_result(check_id:int,input:QcResult,scope:ScopedTenant)->dict[str,object]:
    session,current=scope; _permission(scope,True); check=_row_or_404(session,"qc_checks",check_id,"QC_CHECK_NOT_FOUND")
    job = _row_or_404(session, "job_cards", int(check["job_card_id"]), "JOB_NOT_FOUND")
    if job["status"] not in {"IN_PROGRESS", "HOLD"}: raise auth_error("QC_NOT_AVAILABLE_FOR_JOB_STATUS", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if input.outcome=="PASSED":
        rework=session.execute(text("SELECT 1 FROM technician_tasks WHERE job_card_id=:job AND title LIKE 'Rework:%' AND status<>'COMPLETED'"),{"job":check["job_card_id"]}).scalar()
        if rework: raise auth_error("QC_REWORK_REQUIRED",status.HTTP_422_UNPROCESSABLE_ENTITY)
    session.execute(text("INSERT INTO qc_results (tenant_id,branch_id,qc_check_id,outcome,note,actor_id) VALUES (:tenant,:branch,:check,:outcome,:note,:actor)"),{"tenant":str(current.tenant_id),"branch":str(check["branch_id"]),"check":check_id,"outcome":input.outcome,"note":input.note.strip(),"actor":str(current.actor_id)})
    if input.outcome=="FAILED":
        session.execute(text("INSERT INTO technician_tasks (tenant_id,branch_id,job_card_id,assigned_to,title,notes,status,created_by,updated_by) VALUES (:tenant,:branch,:job,:actor,:title,:note,'PENDING',:actor,:actor)"),{"tenant":str(current.tenant_id),"branch":str(check["branch_id"]),"job":check["job_card_id"],"actor":str(current.actor_id),"title":f"Rework: {check['label']}","note":input.note.strip()})
    session.execute(text("UPDATE qc_checks SET status=:status WHERE id=:id"),{"status":input.outcome,"id":check_id})
    _audit(session,current,"QC_RESULT_RECORDED",input.note.strip() or input.outcome,{}, {"checkId":check_id,"outcome":input.outcome})
    return {"id":check_id,"status":input.outcome}
```

### backend/app/finance.py:270 ? list_job_invoices

```python
def list_job_invoices(job_id: int, scope: ScopedTenant) -> list[dict[str, object]]:
    session, _ = scope
    _permission(scope, mutation=False)
    _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    rows = session.execute(text("SELECT id FROM invoices WHERE job_card_id=:job_id ORDER BY created_at"), {"job_id": job_id}).mappings().all()
    return [_invoice(session, int(row["id"])) for row in rows]
```

### backend/app/finance.py:279 ? issue_invoice

```python
def issue_invoice(job_id: int, input: InvoiceIssue, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    if job["status"] in ("CANCELLED", "CLOSED"):
        raise auth_error("JOB_TERMINAL", status.HTTP_422_UNPROCESSABLE_ENTITY)
    # Serialise competing issue commands for this job before checking either
    # idempotency or the active-invoice claim. The claim table then preserves
    # the invariant even if a second transaction began before this lock.
    session.execute(text("SELECT id FROM job_cards WHERE id=:job_id FOR UPDATE"), {"job_id": job_id})
    if request_key:
        replay = session.execute(text("SELECT id FROM invoices WHERE job_card_id=:job_id AND request_key=:request_key"), {"job_id": job_id, "request_key": request_key.strip()}).scalar()
        if replay:
            return _invoice(session, int(replay))
    approved = _approved_estimate_snapshot(session, job_id)
    existing = _active_invoice(session, job_id, lock=True)
    if existing:
        raise auth_error("ACTIVE_INVOICE_EXISTS", status.HTTP_409_CONFLICT)
    has_prior_invoice = bool(session.execute(text("SELECT 1 FROM invoices WHERE job_card_id=:job_id"), {"job_id": job_id}).scalar())
    if has_prior_invoice and input.replaces_invoice_id is None:
        raise auth_error("INVOICE_REPLACEMENT_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    predecessor_document_id = None
    if input.replaces_invoice_id is not None:
        replacement = _row_or_404(session, "invoices", input.replaces_invoice_id, "INVOICE_NOT_FOUND")
        fully_credited = int(session.execute(text("SELECT COALESCE(SUM(amount_paise),0) FROM credit_notes WHERE invoice_id=:invoice_id"), {"invoice_id": input.replaces_invoice_id}).scalar_one()) >= int(replacement["total_paise"])
        if int(replacement["job_card_id"]) != job_id or not (_voided(session, int(replacement["issued_document_id"])) or fully_credited):
            raise auth_error("INVOICE_REPLACEMENT_NOT_ALLOWED", status.HTTP_422_UNPROCESSABLE_ENTITY)
        predecessor_document_id = int(replacement["issued_document_id"])
    profile = _branch_profile(session, job["branch_id"])
    branch_state = str(profile.get("state", "")).strip().casefold()
    customer_state = input.customer_state.strip().casefold()
    gst_kind = "CGST_SGST" if branch_state and customer_state and branch_state == customer_state else "IGST"
    estimate_discount = Decimal(str(approved.get("discount", 0)))
    discount_paise = int((estimate_discount * 100).to_integral_value(rounding=ROUND_HALF_UP))
    calculations = _estimate_calculations(approved, discount_paise, gst_kind)
    subtotal = sum(int(line["taxablePaise"]) + int(line["discountPaise"]) for line in calculations)
    tax_total = sum(int(line["taxPaise"]) for line in calculations)
    total = subtotal - discount_paise + tax_total
    snapshot = {"jobId": job_id, "currency": str(profile.get("currency", "INR")), "gstKind": gst_kind,
                "customerState": input.customer_state.strip(), "lines": calculations, "subtotalPaise": subtotal,
                "discountPaise": discount_paise, "taxPaise": tax_total, "totalPaise": total,
                "approvedEstimate": approved}
    document = _issue_document(session, current, job=job, document_type="INVOICE", snapshot=snapshot, predecessor_document_id=predecessor_document_id)
    invoice = session.execute(text("""
        INSERT INTO invoices (tenant_id,branch_id,job_card_id,issued_document_id,replaces_invoice_id,subtotal_paise,discount_paise,tax_paise,total_paise,request_key,created_by)
        VALUES (:tenant_id,:branch_id,:job_id,:document_id,:replaces_invoice_id,:subtotal,:discount,:tax,:total,:request_key,:actor_id) RETURNING id
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job_id, "document_id": document["id"],
             "replaces_invoice_id": input.replaces_invoice_id, "subtotal": subtotal, "discount": discount_paise, "tax": tax_total,
             "total": total, "request_key": request_key.strip() if request_key else None, "actor_id": str(current.actor_id)}).mappings().one()
    for index, line in enumerate(calculations, start=1):
        session.execute(text("""INSERT INTO invoice_lines (tenant_id,branch_id,invoice_id,line_no,description,quantity,unit_amount_paise,gst_rate_bps,taxable_paise,tax_paise,total_paise)
            VALUES (:tenant_id,:branch_id,:invoice_id,:line_no,:description,:quantity,:unit_amount_paise,:gst_rate_bps,:taxable_paise,:tax_paise,:total_paise)"""),
            {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "invoice_id": invoice["id"], "line_no": index,
             "description": line["description"], "quantity": line["quantity"], "unit_amount_paise": line["unitAmountPaise"], "gst_rate_bps": line["gstRateBps"], "taxable_paise": line["taxablePaise"], "tax_paise": line["taxPaise"], "total_paise": line["totalPaise"]})
    try:
        session.execute(text("INSERT INTO active_invoice_claims (tenant_id,branch_id,job_card_id,invoice_id) VALUES (:tenant_id,:branch_id,:job_id,:invoice_id)"),
            {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job_id, "invoice_id": invoice["id"]})
    except Exception as error:
        raise auth_error("ACTIVE_INVOICE_EXISTS", status.HTTP_409_CONFLICT) from error
    if predecessor_document_id:
        session.execute(text("""INSERT INTO financial_document_events (tenant_id,branch_id,document_id,event_type,reason,related_document_id,actor_id)
            VALUES (:tenant_id,:branch_id,:document_id,'REPLACED','Replacement invoice issued',:related_document_id,:actor_id)"""),
            {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "document_id": predecessor_document_id, "related_document_id": document["id"], "actor_id": str(current.actor_id)})
    payload = _invoice(session, int(invoice["id"]))
    _audit(session, current, "INVOICE_ISSUED", f"Issued {document['document_no']}", {}, payload)
    return payload
```

### backend/app/finance.py:348 ? void_invoice

```python
def void_invoice(invoice_id: int, input: VoidInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    invoice = _row_or_404(session, "invoices", invoice_id, "INVOICE_NOT_FOUND")
    session.execute(text("SELECT id FROM invoices WHERE id=:invoice_id FOR UPDATE"), {"invoice_id": invoice_id})
    if _voided(session, int(invoice["issued_document_id"])):
        return _invoice(session, invoice_id)
    if session.execute(text("SELECT 1 FROM payments WHERE invoice_id=:invoice_id"), {"invoice_id": invoice_id}).scalar():
        raise auth_error("POST_PAYMENT_VOID_REQUIRES_CREDIT_NOTE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    session.execute(text("""INSERT INTO financial_document_events (tenant_id,branch_id,document_id,event_type,reason,request_key,actor_id)
        VALUES (:tenant_id,:branch_id,:document_id,'VOID',:reason,:request_key,:actor_id)"""),
        {"tenant_id": str(current.tenant_id), "branch_id": str(invoice["branch_id"]), "document_id": invoice["issued_document_id"], "reason": input.reason.strip(),
         "request_key": request_key.strip() if request_key else None, "actor_id": str(current.actor_id)})
    session.execute(text("DELETE FROM active_invoice_claims WHERE invoice_id=:invoice_id"), {"invoice_id": invoice_id})
    payload = _invoice(session, invoice_id)
    _audit(session, current, "INVOICE_VOIDED", input.reason.strip(), {}, payload)
    return payload
```

### backend/app/finance.py:380 ? issue_credit_note

```python
def issue_credit_note(invoice_id: int, input: CreditNoteIssue, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    invoice = _row_or_404(session, "invoices", invoice_id, "INVOICE_NOT_FOUND")
    session.execute(text("SELECT id FROM invoices WHERE id=:invoice_id FOR UPDATE"), {"invoice_id": invoice_id})
    if request_key:
        replay = session.execute(text("SELECT id FROM credit_notes WHERE invoice_id=:invoice_id AND request_key=:request_key"), {"invoice_id": invoice_id, "request_key": request_key.strip()}).scalar()
        if replay:
            return _credit_note(session, int(replay))
    paid = int(session.execute(text("SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id"), {"invoice_id": invoice_id}).scalar_one())
    credited = int(session.execute(text("SELECT COALESCE(SUM(amount_paise),0) FROM credit_notes WHERE invoice_id=:invoice_id"), {"invoice_id": invoice_id}).scalar_one())
    if not paid:
        raise auth_error("CREDIT_NOTE_REQUIRES_PAYMENT", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if input.amount_paise > paid - credited:
        raise auth_error("CREDIT_EXCEEDS_PAID_AMOUNT", status.HTTP_422_UNPROCESSABLE_ENTITY)
    job = _row_or_404(session, "job_cards", int(invoice["job_card_id"]), "JOB_NOT_FOUND")
    document = _issue_document(session, current, job=job, document_type="CREDIT_NOTE", snapshot={"invoiceId": invoice_id, "invoiceDocumentId": invoice["issued_document_id"], "amountPaise": input.amount_paise, "reason": input.reason.strip() }, predecessor_document_id=int(invoice["issued_document_id"]))
    row = session.execute(text("""INSERT INTO credit_notes (tenant_id,branch_id,invoice_id,issued_document_id,amount_paise,reason,request_key,created_by)
        VALUES (:tenant_id,:branch_id,:invoice_id,:document_id,:amount,:reason,:request_key,:actor_id) RETURNING id"""),
        {"tenant_id": str(current.tenant_id), "branch_id": str(invoice["branch_id"]), "invoice_id": invoice_id, "document_id": document["id"], "amount": input.amount_paise, "reason": input.reason.strip(), "request_key": request_key.strip() if request_key else None, "actor_id": str(current.actor_id)}).mappings().one()
    session.execute(text("""INSERT INTO financial_document_events
        (tenant_id,branch_id,document_id,event_type,reason,related_document_id,request_key,actor_id)
        VALUES (:tenant_id,:branch_id,:document_id,'CREDITED',:reason,:related_document_id,:request_key,:actor_id)"""),
        {"tenant_id": str(current.tenant_id), "branch_id": str(invoice["branch_id"]), "document_id": invoice["issued_document_id"], "reason": input.reason.strip(), "related_document_id": document["id"], "request_key": request_key.strip() if request_key else None, "actor_id": str(current.actor_id)})
    if credited + input.amount_paise >= int(invoice["total_paise"]):
        session.execute(text("DELETE FROM active_invoice_claims WHERE invoice_id=:invoice_id"), {"invoice_id": invoice_id})
    payload = _credit_note(session, int(row["id"]))
    _audit(session, current, "CREDIT_NOTE_ISSUED", input.reason.strip(), {}, payload)
    return payload
```

### backend/app/finance.py:412 ? record_refund

```python
def record_refund(credit_note_id: int, input: RefundRecord, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    note = _row_or_404(session, "credit_notes", credit_note_id, "CREDIT_NOTE_NOT_FOUND")
    session.execute(text("SELECT id FROM credit_notes WHERE id=:id FOR UPDATE"), {"id": credit_note_id})
    if request_key:
        replay = session.execute(text("SELECT id FROM refunds WHERE credit_note_id=:id AND request_key=:request_key"), {"id": credit_note_id, "request_key": request_key.strip()}).scalar()
        if replay:
            return {"id": replay, "creditNoteId": credit_note_id, "replayed": True}
    refunded = int(session.execute(text("SELECT COALESCE(SUM(amount_paise),0) FROM refunds WHERE credit_note_id=:id"), {"id": credit_note_id}).scalar_one())
    if refunded + input.amount_paise > int(note["amount_paise"]):
        raise auth_error("REFUND_EXCEEDS_CREDIT_NOTE", status.HTTP_409_CONFLICT)
    row = session.execute(text("""INSERT INTO refunds (tenant_id,branch_id,credit_note_id,amount_paise,method,reference,request_key,created_by)
        VALUES (:tenant_id,:branch_id,:credit_note_id,:amount,:method,:reference,:request_key,:actor_id) RETURNING id"""),
        {"tenant_id": str(current.tenant_id), "branch_id": str(note["branch_id"]), "credit_note_id": credit_note_id, "amount": input.amount_paise, "method": input.method.upper(), "reference": input.reference.strip(), "request_key": request_key.strip() if request_key else None, "actor_id": str(current.actor_id)}).mappings().one()
    payload = {"id": row["id"], "creditNoteId": credit_note_id, "amountPaise": input.amount_paise, "method": input.method.upper(), "reference": input.reference.strip()}
    _audit(session, current, "REFUND_RECORDED", f"Credit note #{credit_note_id}", {}, payload)
    return payload
```

### backend/app/finance.py:433 ? record_payment

```python
def record_payment(invoice_id: int, input: PaymentRecord, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    if request_key:
        existing = session.execute(text("SELECT id FROM payments WHERE invoice_id=:invoice_id AND request_key=:request_key"), {"invoice_id": invoice_id, "request_key": request_key.strip()}).scalar()
        if existing:
            return _payment(session, int(existing))
    invoice = _row_or_404(session, "invoices", invoice_id, "INVOICE_NOT_FOUND")
    session.execute(text("SELECT id FROM invoices WHERE id=:invoice_id FOR UPDATE"), {"invoice_id": invoice_id})
    if _voided(session, int(invoice["issued_document_id"])):
        raise auth_error("PAYMENT_ON_VOID_INVOICE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    paid = int(session.execute(text("SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id"), {"invoice_id": invoice_id}).scalar_one())
    if paid + input.amount_paise > int(invoice["total_paise"]):
        raise auth_error("PAYMENT_EXCEEDS_BALANCE", status.HTTP_409_CONFLICT)
    job = _row_or_404(session, "job_cards", int(invoice["job_card_id"]), "JOB_NOT_FOUND")
    receipt_snapshot = {"invoiceId": invoice_id, "invoiceDocumentId": invoice["issued_document_id"], "amountPaise": input.amount_paise,
                        "method": input.method.upper(), "reference": input.reference.strip(), "payer": input.payer.strip(), "receivedAt": input.received_at.isoformat()}
    receipt = _issue_document(session, current, job=job, document_type="RECEIPT", snapshot=receipt_snapshot, predecessor_document_id=int(invoice["issued_document_id"]))
    filename, content_type, artifact, checksum = _decode_attachment(input.supporting_attachment)
    payment = session.execute(text("""INSERT INTO payments
        (tenant_id,branch_id,invoice_id,receipt_document_id,amount_paise,method,reference,payer,supporting_filename,supporting_content_type,supporting_artifact,supporting_sha256,received_at,request_key,received_by)
        VALUES (:tenant_id,:branch_id,:invoice_id,:receipt_document_id,:amount_paise,:method,:reference,:payer,:filename,:content_type,:artifact,:checksum,:received_at,:request_key,:actor_id) RETURNING id"""),
        {"tenant_id": str(current.tenant_id), "branch_id": str(invoice["branch_id"]), "invoice_id": invoice_id, "receipt_document_id": receipt["id"],
         "amount_paise": input.amount_paise, "method": input.method.upper(), "reference": input.reference.strip(), "payer": input.payer.strip(),
         "filename": filename, "content_type": content_type, "artifact": artifact, "checksum": checksum, "received_at": input.received_at,
         "request_key": request_key.strip() if request_key else None, "actor_id": str(current.actor_id)}).mappings().one()
    payload = _payment(session, int(payment["id"]))
    _audit(session, current, "PAYMENT_RECORDED", f"Payment receipt {receipt['document_no']}", {}, payload)
    return payload
```

### backend/app/finance.py:476 ? list_payments

```python
def list_payments(invoice_id: int, scope: ScopedTenant) -> list[dict[str, object]]:
    session, _ = scope
    _permission(scope, mutation=False)
    _row_or_404(session, "invoices", invoice_id, "INVOICE_NOT_FOUND")
    return [_payment(session, int(row["id"])) for row in session.execute(text("SELECT id FROM payments WHERE invoice_id=:invoice_id ORDER BY created_at,id"), {"invoice_id": invoice_id}).mappings().all()]
```

### backend/app/finance.py:484 ? complete_handover

```python
def complete_handover(job_id: int, input: HandoverInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    existing = session.execute(text("SELECT * FROM delivery_acknowledgements WHERE job_card_id=:job_id"), {"job_id": job_id}).mappings().one_or_none()
    if existing:
        return _handover(session, dict(existing))
    if job["status"] != "COMPLETED":
        raise auth_error("HANDOVER_REQUIRES_COMPLETED_JOB", status.HTTP_422_UNPROCESSABLE_ENTITY)
    invoice = _active_invoice(session, job_id, lock=True)
    if invoice is None:
        raise auth_error("HANDOVER_REQUIRES_INVOICE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    paid = int(session.execute(text("SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id"), {"invoice_id": invoice["id"]}).scalar_one())
    if paid != int(invoice["total_paise"]):
        raise auth_error("HANDOVER_REQUIRES_SETTLED_INVOICE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    snapshot = {"jobId": job_id, "invoiceId": invoice["id"], "invoiceDocumentId": invoice["issued_document_id"], "deliveredBy": input.delivered_by.strip(),
                "finalOdometer": input.final_odometer, "acknowledgement": input.acknowledgement.strip(), "handoverAt": datetime.now(timezone.utc).isoformat()}
    gate_pass = _issue_document(session, current, job=job, document_type="GATE_PASS", snapshot=snapshot, predecessor_document_id=int(invoice["issued_document_id"]))
    row = session.execute(text("""INSERT INTO delivery_acknowledgements
        (tenant_id,branch_id,job_card_id,invoice_id,gate_pass_document_id,delivered_by,final_odometer,acknowledgement,request_key,actor_id)
        VALUES (:tenant_id,:branch_id,:job_id,:invoice_id,:gate_pass_id,:delivered_by,:final_odometer,:acknowledgement,:request_key,:actor_id) RETURNING *"""),
        {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job_id, "invoice_id": invoice["id"], "gate_pass_id": gate_pass["id"],
         "delivered_by": input.delivered_by.strip(), "final_odometer": input.final_odometer, "acknowledgement": input.acknowledgement.strip(),
         "request_key": request_key.strip() if request_key else None, "actor_id": str(current.actor_id)}).mappings().one()
    session.execute(text("UPDATE job_cards SET status='CLOSED',updated_by=:actor_id,updated_at=now() WHERE id=:job_id"), {"actor_id": str(current.actor_id), "job_id": job_id})
    session.execute(text("""INSERT INTO job_events (tenant_id,branch_id,job_card_id,command,from_status,to_status,reason,request_key,actor_id)
        VALUES (:tenant_id,:branch_id,:job_id,'complete-handover','COMPLETED','CLOSED','Settled invoice handover',:request_key,:actor_id)"""),
        {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job_id, "request_key": request_key.strip() if request_key else None, "actor_id": str(current.actor_id)})
    payload = _handover(session, dict(row))
    _audit(session, current, "JOB_HANDOVER_COMPLETED", f"Gate pass {gate_pass['document_no']}", _job(job), payload)
    return payload
```

### backend/app/finance.py:525 ? get_delivery

```python
def get_delivery(job_id: int, scope: ScopedTenant) -> dict[str, object] | None:
    session, _ = scope
    _permission(scope, mutation=False)
    _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    row = session.execute(text("SELECT * FROM delivery_acknowledgements WHERE job_card_id=:job_id"), {"job_id": job_id}).mappings().one_or_none()
    return _handover(session, dict(row)) if row else None
```

### backend/app/finance.py:534 ? get_document_content

```python
def get_document_content(document_id: int, scope: ScopedTenant) -> Response:
    session, _ = scope
    _permission(scope, mutation=False)
    row = session.execute(text("SELECT document_no,content_type,artifact FROM financial_documents WHERE id=:document_id"), {"document_id": document_id}).mappings().one_or_none()
    if row is None:
        raise auth_error("FINANCIAL_DOCUMENT_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return Response(content=bytes(row["artifact"]), media_type=row["content_type"], headers={
        "Content-Disposition": f'attachment; filename="{_download_filename(row["document_no"], ".html")}"',
        "Content-Security-Policy": "sandbox; default-src 'none'; style-src 'unsafe-inline'",
        "X-Content-Type-Options": "nosniff",
    })
```

### backend/app/finance.py:548 ? get_supporting_attachment

```python
def get_supporting_attachment(payment_id: int, scope: ScopedTenant) -> Response:
    session, _ = scope
    _permission(scope, mutation=False)
    row = session.execute(text("SELECT supporting_filename,supporting_content_type,supporting_artifact FROM payments WHERE id=:payment_id"), {"payment_id": payment_id}).mappings().one_or_none()
    if row is None or row["supporting_artifact"] is None:
        raise auth_error("SUPPORTING_ATTACHMENT_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return Response(content=bytes(row["supporting_artifact"]), media_type=row["supporting_content_type"], headers={
        "Content-Disposition": f'attachment; filename="{_download_filename(row["supporting_filename"])}"',
        "X-Content-Type-Options": "nosniff",
    })
```

### backend/app/followups.py:90 ? list_followups

```python
def list_followups(
    scope: ScopedTenant,
    job_id: int | None = Query(default=None, alias="jobId", gt=0),
    branch_id: UUID | None = Query(default=None, alias="branchId"),
    archived: bool = False,
) -> list[dict[str, object]]:
    session, current = scope
    _permission(scope, mutation=False)
    if branch_id is not None:
        _branch(current, branch_id)
    rows = session.execute(text("""
        SELECT f.*, j.job_no, c.name AS customer_name, v.number AS vehicle_no
        FROM followups f
        JOIN job_cards j ON j.id=f.job_card_id
        JOIN visits visit ON visit.id=j.visit_id
        JOIN customers c ON c.id=visit.customer_id
        JOIN vehicles v ON v.id=visit.vehicle_id
        WHERE (:job_id IS NULL OR f.job_card_id=:job_id)
          AND (:branch_id IS NULL OR f.branch_id=:branch_id)
          AND (:archived = (f.archived_at IS NOT NULL))
        ORDER BY (f.status='OPEN') DESC, f.due_at NULLS LAST, f.updated_at DESC, f.id DESC
    """), {"job_id": job_id, "branch_id": str(branch_id) if branch_id else None, "archived": archived}).mappings().all()
    return [_payload(dict(row)) for row in rows]
```

### backend/app/followups.py:116 ? followup_jobs

```python
def followup_jobs(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    """Minimal job context for Follow-up creation without granting the full job page."""
    session, current = scope
    _permission(scope, mutation=False)
    if branch_id is not None:
        _branch(current, branch_id)
    rows = session.execute(text("""
        SELECT j.id, j.branch_id, j.job_no, j.status, c.name AS customer_name, v.number AS vehicle_no
        FROM job_cards j JOIN visits visit ON visit.id=j.visit_id
        JOIN customers c ON c.id=visit.customer_id JOIN vehicles v ON v.id=visit.vehicle_id
        WHERE (:branch_id IS NULL OR j.branch_id=:branch_id) AND j.status NOT IN ('CANCELLED','CLOSED')
        ORDER BY j.created_at DESC, j.id DESC
    """), {"branch_id": str(branch_id) if branch_id else None}).mappings().all()
    return [{"id": row["id"], "branchId": str(row["branch_id"]), "jobNo": row["job_no"], "status": row["status"], "customerName": row["customer_name"], "vehicleNo": row["vehicle_no"]} for row in rows]
```

### backend/app/followups.py:133 ? create_followup

```python
def create_followup(input: FollowupCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    job = _row_or_404(session, "job_cards", input.job_id, "JOB_NOT_FOUND")
    if job["status"] in ("CANCELLED", "CLOSED"):
        raise auth_error("JOB_TERMINAL", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""
        INSERT INTO followups (tenant_id,branch_id,job_card_id,note,due_at,created_by,updated_by)
        VALUES (:tenant_id,:branch_id,:job_id,:note,:due_at,:actor_id,:actor_id) RETURNING id
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": input.job_id,
             "note": _clean(input.note), "due_at": input.due_at, "actor_id": str(current.actor_id)}).mappings().one()
    payload = _payload(_followup_row(session, int(row["id"])))
    _audit(session, current, "FOLLOWUP_CREATED", f"Created follow-up #{payload['id']}", {}, payload)
    return payload
```

### backend/app/followups.py:150 ? update_followup

```python
def update_followup(followup_id: int, input: FollowupUpdate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    before = _payload(_followup_row(session, followup_id))
    if before["archivedAt"] is not None:
        raise auth_error("FOLLOWUP_ARCHIVED", status.HTTP_409_CONFLICT)
    session.execute(text("""
        UPDATE followups SET note=:note,due_at=:due_at,outcome=:outcome,updated_by=:actor_id,
          updated_at=now(),version=version+1 WHERE id=:id
    """), {"id": followup_id, "note": _clean(input.note), "due_at": input.due_at,
             "outcome": input.outcome.strip(), "actor_id": str(current.actor_id)})
    payload = _payload(_followup_row(session, followup_id))
    _audit(session, current, "FOLLOWUP_UPDATED", f"Updated follow-up #{followup_id}", before, payload)
    return payload
```

### backend/app/followups.py:167 ? complete_followup

```python
def complete_followup(followup_id: int, input: FollowupComplete, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    before = _payload(_followup_row(session, followup_id))
    if before["archivedAt"] is not None:
        raise auth_error("FOLLOWUP_ARCHIVED", status.HTTP_409_CONFLICT)
    session.execute(text("""
        UPDATE followups SET status='COMPLETED',outcome=:outcome,completed_at=COALESCE(completed_at,now()),
          completed_by=COALESCE(completed_by,:actor_id),updated_by=:actor_id,updated_at=now(),version=version+1 WHERE id=:id
    """), {"id": followup_id, "outcome": input.outcome.strip(), "actor_id": str(current.actor_id)})
    payload = _payload(_followup_row(session, followup_id))
    _audit(session, current, "FOLLOWUP_COMPLETED", f"Completed follow-up #{followup_id}", before, payload)
    return payload
```

### backend/app/followups.py:183 ? archive_followup

```python
def archive_followup(followup_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    before = _payload(_followup_row(session, followup_id))
    if before["archivedAt"] is not None:
        raise auth_error("FOLLOWUP_ARCHIVED", status.HTTP_409_CONFLICT)
    session.execute(text("""
        UPDATE followups SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,
          updated_by=:actor_id,updated_at=now(),version=version+1 WHERE id=:id
    """), {"id": followup_id, "reason": _clean(input.reason), "actor_id": str(current.actor_id)})
    payload = _payload(_followup_row(session, followup_id))
    _audit(session, current, "FOLLOWUP_ARCHIVED", f"Archived follow-up #{followup_id}", before, payload)
    return payload
```

### backend/app/followups.py:199 ? search

```python
def search(
    scope: ScopedTenant,
    q: Annotated[str, Query(min_length=2, max_length=200)],
    branch_id: UUID | None = Query(default=None, alias="branchId"),
    limit: Annotated[int, Query(ge=1, le=100)] = 30,
    entities: list[SearchEntity] | None = Query(default=None),
) -> dict[str, object]:
    session, current = scope
    _search_permission(scope)
    if branch_id is not None:
        _branch(current, branch_id)
    requested = tuple(dict.fromkeys(entities or ("customer", "vehicle", "job", "invoice")))
    needle = f"%{q.strip()}%"
    prefix = f"{q.strip()}%"
    exact = q.strip()
    rows = session.execute(text("""
        SELECT * FROM (
          SELECT 'customer' AS entity, c.id, c.branch_id, c.name AS title, c.mobile AS subtitle,
            CASE WHEN lower(c.name)=lower(:exact) OR lower(c.mobile)=lower(:exact) THEN 0 WHEN c.name ILIKE :prefix OR c.mobile ILIKE :prefix THEN 1 ELSE 2 END AS rank
          FROM customers c WHERE c.archived_at IS NULL AND (:branch_id IS NULL OR c.branch_id=:branch_id) AND (c.name ILIKE :needle OR c.mobile ILIKE :needle)
          UNION ALL
          SELECT 'vehicle', v.id, v.branch_id, v.number, concat_ws(' Â· ',v.make,v.model,c.name),
            CASE WHEN upper(v.number)=upper(:exact) THEN 0 WHEN v.number ILIKE :prefix THEN 1 ELSE 2 END
          FROM vehicles v JOIN customers c ON c.id=v.customer_id WHERE v.archived_at IS NULL AND c.archived_at IS NULL AND (:branch_id IS NULL OR v.branch_id=:branch_id) AND (v.number ILIKE :needle OR v.make ILIKE :needle OR v.model ILIKE :needle OR c.name ILIKE :needle)
          UNION ALL
          SELECT 'job', j.id, j.branch_id, j.job_no, concat_ws(' Â· ',v.number,c.name,j.status),
            CASE WHEN lower(j.job_no)=lower(:exact) THEN 0 WHEN j.job_no ILIKE :prefix THEN 1 ELSE 2 END
          FROM job_cards j JOIN visits visit ON visit.id=j.visit_id JOIN customers c ON c.id=visit.customer_id JOIN vehicles v ON v.id=visit.vehicle_id
          WHERE (:branch_id IS NULL OR j.branch_id=:branch_id) AND (j.job_no ILIKE :needle OR v.number ILIKE :needle OR c.name ILIKE :needle)
          UNION ALL
          SELECT 'invoice', i.id, i.branch_id, d.document_no, concat_ws(' Â· ',j.job_no,v.number,c.name),
            CASE WHEN lower(d.document_no)=lower(:exact) THEN 0 WHEN d.document_no ILIKE :prefix THEN 1 ELSE 2 END
          FROM invoices i JOIN financial_documents d ON d.id=i.issued_document_id JOIN job_cards j ON j.id=i.job_card_id
            JOIN visits visit ON visit.id=j.visit_id JOIN customers c ON c.id=visit.customer_id JOIN vehicles v ON v.id=visit.vehicle_id
          WHERE NOT EXISTS (SELECT 1 FROM financial_document_events event WHERE event.document_id=d.id AND event.event_type='VOID')
            AND (:branch_id IS NULL OR i.branch_id=:branch_id) AND (d.document_no ILIKE :needle OR j.job_no ILIKE :needle OR v.number ILIKE :needle OR c.name ILIKE :needle)
        ) AS searchable WHERE entity = ANY(:entities) ORDER BY rank, entity, title, id LIMIT :limit
    """), {"needle": needle, "prefix": prefix, "exact": exact, "branch_id": str(branch_id) if branch_id else None, "entities": list(requested), "limit": limit}).mappings().all()
    return {"query": q.strip(), "results": [{"entity": row["entity"], "id": row["id"], "branchId": str(row["branch_id"]), "title": row["title"], "subtitle": row["subtitle"], "rank": row["rank"]} for row in rows]}
```

### backend/app/intake.py:169 ? list_customers

```python
def list_customers(scope: ScopedTenant, q: str = "", archived: bool = False, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope
    _require_any(scope, ("page.customers.read", "page.my-queue.read"))
    if branch_id is not None:
        _branch(current, branch_id)
    rows = session.execute(text("""
        SELECT * FROM customers
        WHERE (:archived = (archived_at IS NOT NULL))
          AND (:branch_id IS NULL OR branch_id = :branch_id)
          AND (:q = '' OR name ILIKE :needle OR mobile ILIKE :needle)
        ORDER BY name, id
    """), {"archived": archived, "branch_id": str(branch_id) if branch_id else None, "q": q.strip(), "needle": f"%{q.strip()}%"}).mappings().all()
    return [_customer(dict(row)) for row in rows]
```

### backend/app/intake.py:185 ? create_customer

```python
def create_customer(input: CustomerInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    branch_id = _branch(_require_any(scope, ("page.customers.write", "page.my-queue.write"), mutation=True), input.branch_id)
    row = session.execute(text("""
        INSERT INTO customers (tenant_id, branch_id, name, mobile, type, address, created_by, updated_by)
        VALUES (:tenant_id, :branch_id, :name, :mobile, :type, :address, :actor_id, :actor_id) RETURNING *
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "name": _clean(input.name), "mobile": _clean(input.mobile), "type": _clean(input.type), "address": input.address.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _customer(dict(row)); _audit(session, current, "CUSTOMER_CREATED", "Customer created", {}, payload)
    return payload
```

### backend/app/intake.py:197 ? get_customer

```python
def get_customer(customer_id: int, scope: ScopedTenant) -> dict[str, object]:
    session, _ = scope; _require_any(scope, ("page.customers.read", "page.my-queue.read"))
    return _customer(_row_or_404(session, "customers", customer_id))
```

### backend/app/intake.py:203 ? update_customer

```python
def update_customer(customer_id: int, input: CustomerInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.customers.write", "page.my-queue.write"), mutation=True)
    before = _row_or_404(session, "customers", customer_id)
    if before["archived_at"] is not None or before["branch_id"] != _branch(current, input.branch_id or before["branch_id"]):
        raise auth_error("CUSTOMER_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE customers SET name=:name, mobile=:mobile, type=:type, address=:address, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *"""), {"id": customer_id, "name": _clean(input.name), "mobile": _clean(input.mobile), "type": _clean(input.type), "address": input.address.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _customer(dict(row)); _audit(session, current, "CUSTOMER_UPDATED", "Customer updated", _customer(before), payload)
    return payload
```

### backend/app/intake.py:214 ? archive_customer

```python
def archive_customer(customer_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.customers.write", "page.my-queue.write"), mutation=True)
    before = _row_or_404(session, "customers", customer_id)
    if before["archived_at"] is not None:
        raise auth_error("INTAKE_RECORD_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE customers SET archived_at=now(), archived_by=:actor_id, archive_reason=:reason, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *"""), {"id": customer_id, "reason": _clean(input.reason), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _customer(dict(row)); _audit(session, current, "CUSTOMER_ARCHIVED", input.reason.strip(), _customer(before), payload)
    return payload
```

### backend/app/intake.py:225 ? list_vehicles

```python
def list_vehicles(scope: ScopedTenant, q: str = "", archived: bool = False, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _require_any(scope, ("page.vehicles.read", "page.my-queue.read"))
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("""SELECT * FROM vehicles WHERE (:archived = (archived_at IS NOT NULL)) AND (:branch_id IS NULL OR branch_id=:branch_id) AND (:q='' OR number ILIKE :needle OR make ILIKE :needle OR model ILIKE :needle) ORDER BY number, id"""), {"archived": archived, "branch_id": str(branch_id) if branch_id else None, "q": q.strip(), "needle": f"%{q.strip()}%"}).mappings().all()
    return [_vehicle(dict(row)) for row in rows]
```

### backend/app/intake.py:233 ? create_vehicle

```python
def create_vehicle(input: VehicleInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_require_any(scope, ("page.vehicles.write", "page.my-queue.write"), mutation=True), input.branch_id)
    _assert_active_customer(session, input.customer_id, branch_id)
    row = session.execute(text("""INSERT INTO vehicles (tenant_id, branch_id, customer_id, number, make, model, color, km, engine_no, created_by, updated_by) VALUES (:tenant_id,:branch_id,:customer_id,:number,:make,:model,:color,:km,:engine_no,:actor_id,:actor_id) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "customer_id": input.customer_id, "number": _clean(input.number).upper(), "make": _clean(input.make), "model": _clean(input.model), "color": input.color.strip(), "km": input.km, "engine_no": input.engine_no.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _vehicle(dict(row)); _audit(session, current, "VEHICLE_CREATED", "Vehicle created", {}, payload)
    return payload
```

### backend/app/intake.py:242 ? get_vehicle

```python
def get_vehicle(vehicle_id: int, scope: ScopedTenant) -> dict[str, object]:
    session, _ = scope; _require_any(scope, ("page.vehicles.read", "page.my-queue.read"))
    return _vehicle(_row_or_404(session, "vehicles", vehicle_id))
```

### backend/app/intake.py:248 ? update_vehicle

```python
def update_vehicle(vehicle_id: int, input: VehicleInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.vehicles.write", "page.my-queue.write"), mutation=True)
    before = _row_or_404(session, "vehicles", vehicle_id); branch_id = _branch(current, input.branch_id or before["branch_id"])
    if before["archived_at"] is not None or before["branch_id"] != branch_id: raise auth_error("VEHICLE_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    _assert_active_customer(session, input.customer_id, branch_id)
    row = session.execute(text("""UPDATE vehicles SET customer_id=:customer_id, number=:number, make=:make, model=:model, color=:color, km=:km, engine_no=:engine_no, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *"""), {"id": vehicle_id, "customer_id": input.customer_id, "number": _clean(input.number).upper(), "make": _clean(input.make), "model": _clean(input.model), "color": input.color.strip(), "km": input.km, "engine_no": input.engine_no.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _vehicle(dict(row)); _audit(session, current, "VEHICLE_UPDATED", "Vehicle updated", _vehicle(before), payload)
    return payload
```

### backend/app/intake.py:259 ? archive_vehicle

```python
def archive_vehicle(vehicle_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.vehicles.write", "page.my-queue.write"), mutation=True); before = _row_or_404(session, "vehicles", vehicle_id)
    if before["archived_at"] is not None: raise auth_error("INTAKE_RECORD_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE vehicles SET archived_at=now(), archived_by=:actor_id, archive_reason=:reason, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *"""), {"id": vehicle_id, "reason": _clean(input.reason), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _vehicle(dict(row)); _audit(session, current, "VEHICLE_ARCHIVED", input.reason.strip(), _vehicle(before), payload)
    return payload
```

### backend/app/intake.py:268 ? list_visits

```python
def list_visits(scope: ScopedTenant, q: str = "", archived: bool = False, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _require_any(scope, ("page.receive-vehicle.read", "page.customers.read", "page.my-queue.read"))
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("""SELECT v.* FROM visits v JOIN customers c ON c.id=v.customer_id JOIN vehicles h ON h.id=v.vehicle_id WHERE (:archived = (v.archived_at IS NOT NULL)) AND (:branch_id IS NULL OR v.branch_id=:branch_id) AND (:q='' OR c.name ILIKE :needle OR c.mobile ILIKE :needle OR h.number ILIKE :needle OR v.requested_work ILIKE :needle) ORDER BY v.received_at DESC, v.id DESC"""), {"archived": archived, "branch_id": str(branch_id) if branch_id else None, "q": q.strip(), "needle": f"%{q.strip()}%"}).mappings().all()
    return [_visit(dict(row)) for row in rows]
```

### backend/app/intake.py:276 ? create_visit

```python
def create_visit(input: VisitCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_require_any(scope, ("page.receive-vehicle.write", "page.customers.write", "page.my-queue.write"), mutation=True), input.branch_id)
    _assert_active_customer(session, input.customer_id, branch_id); _assert_active_vehicle(session, input.vehicle_id, branch_id, input.customer_id)
    row = session.execute(text("""INSERT INTO visits (tenant_id,branch_id,customer_id,vehicle_id,advisor_id,received_by,fuel,odo_reading,fuel_level_value,fuel_level_unit,keys,accessories,requested_work,photos_note) VALUES (:tenant_id,:branch_id,:customer_id,:vehicle_id,:advisor_id,:actor_id,:fuel,:odo_reading,:fuel_level_value,:fuel_level_unit,:keys,:accessories,:requested_work,:photos_note) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "customer_id": input.customer_id, "vehicle_id": input.vehicle_id, "advisor_id": str(input.advisor_id) if input.advisor_id else None, "actor_id": str(current.actor_id), "fuel": _clean(input.fuel), "odo_reading": input.odo_reading, "fuel_level_value": input.fuel_level_value.strip(), "fuel_level_unit": input.fuel_level_unit.strip(), "keys": input.keys.strip(), "accessories": input.accessories.strip(), "requested_work": _clean(input.requested_work), "photos_note": input.photos_note.strip()}).mappings().one()
    payload = _visit(dict(row)); _audit(session, current, "VISIT_CREATED", "Vehicle received", {}, payload)
    return payload
```

### backend/app/intake.py:285 ? get_visit

```python
def get_visit(visit_id: int, scope: ScopedTenant) -> dict[str, object]:
    session, _ = scope; _require_any(scope, ("page.receive-vehicle.read", "page.customers.read", "page.my-queue.read"))
    return _visit(_row_or_404(session, "visits", visit_id))
```

### backend/app/intake.py:291 ? update_visit

```python
def update_visit(visit_id: int, input: VisitUpdate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.receive-vehicle.write", "page.customers.write", "page.my-queue.write"), mutation=True); before = _row_or_404(session, "visits", visit_id)
    if before["archived_at"] is not None: raise auth_error("INTAKE_RECORD_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE visits SET advisor_id=:advisor_id,fuel=:fuel,odo_reading=:odo_reading,fuel_level_value=:fuel_level_value,fuel_level_unit=:fuel_level_unit,keys=:keys,accessories=:accessories,requested_work=:requested_work,photos_note=:photos_note,updated_at=now() WHERE id=:id RETURNING *"""), {"id": visit_id, "advisor_id": str(input.advisor_id) if input.advisor_id else None, "fuel": _clean(input.fuel), "odo_reading": input.odo_reading, "fuel_level_value": input.fuel_level_value.strip(), "fuel_level_unit": input.fuel_level_unit.strip(), "keys": input.keys.strip(), "accessories": input.accessories.strip(), "requested_work": _clean(input.requested_work), "photos_note": input.photos_note.strip()}).mappings().one()
    payload = _visit(dict(row)); _audit(session, current, "VISIT_UPDATED", "Visit updated", _visit(before), payload)
    return payload
```

### backend/app/intake.py:300 ? archive_visit

```python
def archive_visit(visit_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.receive-vehicle.write", "page.customers.write", "page.my-queue.write"), mutation=True); before = _row_or_404(session, "visits", visit_id)
    if before["archived_at"] is not None: raise auth_error("INTAKE_RECORD_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE visits SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_at=now() WHERE id=:id RETURNING *"""), {"id": visit_id, "reason": _clean(input.reason), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _visit(dict(row)); _audit(session, current, "VISIT_ARCHIVED", input.reason.strip(), _visit(before), payload)
    return payload
```

### backend/app/inventory.py:177 ? list_catalogue

```python
def list_catalogue(scope: ScopedTenant, q: str = "", archived: bool = False, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, mutation=False)
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("""SELECT item.*, COALESCE(SUM(ledger.quantity),0) on_hand FROM catalogue_items item
        LEFT JOIN stock_ledger ledger ON ledger.item_id=item.id WHERE (:archived=(item.archived_at IS NOT NULL))
        AND (:branch_id IS NULL OR item.branch_id=:branch_id) AND (:q='' OR item.sku ILIKE :needle OR item.name ILIKE :needle OR item.category ILIKE :needle)
        GROUP BY item.id ORDER BY item.name,item.id"""), {"archived": archived, "branch_id": str(branch_id) if branch_id else None, "q": q.strip(), "needle": f"%{q.strip()}%"}).mappings().all()
    return [_catalogue(dict(row)) for row in rows]
```

### backend/app/inventory.py:188 ? create_catalogue

```python
def create_catalogue(input: CatalogueItemInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id)
    row = session.execute(text("""INSERT INTO catalogue_items (tenant_id,branch_id,sku,category,name,unit,low_stock_qty,selling_price,created_by,updated_by)
        VALUES (:tenant_id,:branch_id,:sku,:category,:name,:unit,:low_stock_qty,:selling_price,:actor_id,:actor_id) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "sku": _clean(input.sku).upper(), "category": input.category.strip(), "name": _clean(input.name), "unit": _clean(input.unit), "low_stock_qty": input.low_stock_qty, "selling_price": input.selling_price, "actor_id": str(current.actor_id)}).mappings().one()
    payload = _catalogue(dict(row)); _audit(session, current, "CATALOGUE_ITEM_CREATED", "Catalogue item created", {}, payload); return payload
```

### backend/app/inventory.py:196 ? update_catalogue

```python
def update_catalogue(item_id: int, input: CatalogueItemInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, "catalogue_items", item_id, "CATALOGUE_ITEM_NOT_FOUND"); branch_id = _branch(current, input.branch_id or before["branch_id"])
    if before["archived_at"] is not None or before["branch_id"] != branch_id: raise auth_error("CATALOGUE_ITEM_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE catalogue_items SET sku=:sku,category=:category,name=:name,unit=:unit,low_stock_qty=:low_stock_qty,selling_price=:selling_price,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *"""), {"id": item_id, "sku": _clean(input.sku).upper(), "category": input.category.strip(), "name": _clean(input.name), "unit": _clean(input.unit), "low_stock_qty": input.low_stock_qty, "selling_price": input.selling_price, "actor_id": str(current.actor_id)}).mappings().one()
    payload = _catalogue(dict(row)); _audit(session, current, "CATALOGUE_ITEM_UPDATED", "Catalogue item updated", _catalogue(before), payload); return payload
```

### backend/app/inventory.py:204 ? archive_catalogue

```python
def archive_catalogue(item_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, "catalogue_items", item_id, "CATALOGUE_ITEM_NOT_FOUND")
    if before["archived_at"] is not None: raise auth_error("CATALOGUE_ITEM_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    linked = session.execute(text("SELECT 1 FROM purchase_order_lines WHERE item_id=:id LIMIT 1"), {"id": item_id}).scalar()
    if linked: raise auth_error("CATALOGUE_ITEM_HAS_PURCHASE_HISTORY", status.HTTP_409_CONFLICT)
    row = session.execute(text("UPDATE catalogue_items SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *"), {"id": item_id, "actor_id": str(current.actor_id), "reason": _clean(input.reason)}).mappings().one()
    payload = _catalogue(dict(row)); _audit(session, current, "CATALOGUE_ITEM_ARCHIVED", input.reason.strip(), _catalogue(before), payload); return payload
```

### backend/app/inventory.py:214 ? list_suppliers

```python
def list_suppliers(scope: ScopedTenant, q: str = "", archived: bool = False, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, mutation=False)
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("SELECT * FROM suppliers WHERE (:archived=(archived_at IS NOT NULL)) AND (:branch_id IS NULL OR branch_id=:branch_id) AND (:q='' OR name ILIKE :needle OR mobile ILIKE :needle) ORDER BY name,id"), {"archived": archived, "branch_id": str(branch_id) if branch_id else None, "q": q.strip(), "needle": f"%{q.strip()}%"}).mappings().all()
    return [_supplier(dict(row)) for row in rows]
```

### backend/app/inventory.py:222 ? create_supplier

```python
def create_supplier(input: SupplierInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id)
    row = session.execute(text("INSERT INTO suppliers (tenant_id,branch_id,name,mobile,email,address,created_by,updated_by) VALUES (:tenant_id,:branch_id,:name,:mobile,:email,:address,:actor_id,:actor_id) RETURNING *"), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "name": _clean(input.name), "mobile": input.mobile.strip(), "email": input.email.strip().lower(), "address": input.address.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _supplier(dict(row)); _audit(session, current, "SUPPLIER_CREATED", "Supplier created", {}, payload); return payload
```

### backend/app/inventory.py:229 ? update_supplier

```python
def update_supplier(supplier_id: int, input: SupplierInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, "suppliers", supplier_id, "SUPPLIER_NOT_FOUND"); branch_id = _branch(current, input.branch_id or before["branch_id"])
    if before["archived_at"] is not None or before["branch_id"] != branch_id: raise auth_error("SUPPLIER_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("UPDATE suppliers SET name=:name,mobile=:mobile,email=:email,address=:address,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *"), {"id": supplier_id, "name": _clean(input.name), "mobile": input.mobile.strip(), "email": input.email.strip().lower(), "address": input.address.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _supplier(dict(row)); _audit(session, current, "SUPPLIER_UPDATED", "Supplier updated", _supplier(before), payload); return payload
```

### backend/app/inventory.py:237 ? archive_supplier

```python
def archive_supplier(supplier_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, "suppliers", supplier_id, "SUPPLIER_NOT_FOUND")
    if before["archived_at"] is not None: raise auth_error("SUPPLIER_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    linked = session.execute(text("SELECT 1 FROM purchase_orders WHERE supplier_id=:id LIMIT 1"), {"id": supplier_id}).scalar()
    if linked: raise auth_error("SUPPLIER_HAS_PURCHASE_HISTORY", status.HTTP_409_CONFLICT)
    row = session.execute(text("UPDATE suppliers SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_by=:actor_id,updated_at=now() WHERE id=:id RETURNING *"), {"id": supplier_id, "actor_id": str(current.actor_id), "reason": _clean(input.reason)}).mappings().one()
    payload = _supplier(dict(row)); _audit(session, current, "SUPPLIER_ARCHIVED", input.reason.strip(), _supplier(before), payload); return payload
```

### backend/app/inventory.py:247 ? list_purchase_orders

```python
def list_purchase_orders(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, mutation=False)
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("SELECT * FROM purchase_orders WHERE (:branch_id IS NULL OR branch_id=:branch_id) ORDER BY order_date DESC,id DESC"), {"branch_id": str(branch_id) if branch_id else None}).mappings().all()
    return [_purchase_with_lines(session, int(row["id"])) for row in rows]
```

### backend/app/inventory.py:255 ? create_purchase_order

```python
def create_purchase_order(input: PurchaseOrderInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _supplier_available(session, input.supplier_id, branch_id)
    row = session.execute(text("""INSERT INTO purchase_orders (tenant_id,branch_id,supplier_id,po_number,order_date,status,notes,created_by,updated_by)
        VALUES (:tenant_id,:branch_id,:supplier_id,:po_number,:order_date,'DRAFT',:notes,:actor_id,:actor_id) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "supplier_id": input.supplier_id, "po_number": _clean(input.po_number), "order_date": input.order_date, "notes": input.notes.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    _replace_lines(session, current, int(row["id"]), branch_id, input.lines); payload = _purchase_with_lines(session, int(row["id"])); _audit(session, current, "PURCHASE_ORDER_CREATED", "Purchase order drafted", {}, payload); return payload
```

### backend/app/inventory.py:263 ? update_purchase_order

```python
def update_purchase_order(purchase_id: int, input: PurchaseOrderInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, "purchase_orders", purchase_id, "PURCHASE_ORDER_NOT_FOUND"); branch_id = _branch(current, input.branch_id or before["branch_id"])
    if before["status"] != "DRAFT" or before["branch_id"] != branch_id: raise auth_error("PURCHASE_ORDER_NOT_EDITABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    _supplier_available(session, input.supplier_id, branch_id)
    session.execute(text("UPDATE purchase_orders SET supplier_id=:supplier_id,po_number=:po_number,order_date=:order_date,notes=:notes,updated_by=:actor_id,updated_at=now() WHERE id=:id"), {"id": purchase_id, "supplier_id": input.supplier_id, "po_number": _clean(input.po_number), "order_date": input.order_date, "notes": input.notes.strip(), "actor_id": str(current.actor_id)})
    _replace_lines(session, current, purchase_id, branch_id, input.lines); payload = _purchase_with_lines(session, purchase_id); _audit(session, current, "PURCHASE_ORDER_UPDATED", "Purchase order draft updated", _purchase(before), payload); return payload
```

### backend/app/inventory.py:272 ? purchase_order_command

```python
def purchase_order_command(purchase_id: int, command: Literal["send", "cancel", "close"], input: PurchaseOrderCommand, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _permission(scope, mutation=True); before = _row_or_404(session, "purchase_orders", purchase_id, "PURCHASE_ORDER_NOT_FOUND"); transitions = {"send": {"DRAFT": "SENT"}, "cancel": {"DRAFT": "CANCELLED", "SENT": "CANCELLED", "PARTIALLY_RECEIVED": "CANCELLED", "READY_TO_CLOSE": "CANCELLED"}, "close": {"SENT": "CLOSED", "PARTIALLY_RECEIVED": "CLOSED", "READY_TO_CLOSE": "CLOSED"}}
    next_status = transitions[command].get(str(before["status"]))
    if not next_status: raise auth_error("INVALID_PURCHASE_ORDER_TRANSITION", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if command in {"cancel", "close"} and not input.reason.strip(): raise auth_error("PURCHASE_ORDER_REASON_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    session.execute(text("UPDATE purchase_orders SET status=:status,updated_by=:actor_id,updated_at=now() WHERE id=:id"), {"id": purchase_id, "status": next_status, "actor_id": str(current.actor_id)})
    payload = _purchase_with_lines(session, purchase_id); _audit(session, current, f"PURCHASE_ORDER_{command.upper()}", input.reason.strip() or "Purchase order sent", _purchase(before), payload); return payload
```

### backend/app/inventory.py:282 ? list_stock_inwards

```python
def list_stock_inwards(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, mutation=False)
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("SELECT * FROM stock_inwards WHERE (:branch_id IS NULL OR branch_id=:branch_id) ORDER BY received_at DESC,id DESC"), {"branch_id": str(branch_id) if branch_id else None}).mappings().all()
    return [_inward(dict(row)) for row in rows]
```

### backend/app/inventory.py:290 ? record_stock_inward

```python
def record_stock_inward(input: StockInwardInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _item_available(session, input.item_id, branch_id)
    order_id = None
    if input.purchase_order_line_id is not None:
        line = _row_or_404(session, "purchase_order_lines", input.purchase_order_line_id, "PURCHASE_ORDER_LINE_NOT_FOUND")
        if line["branch_id"] != branch_id or line["item_id"] != input.item_id: raise auth_error("PURCHASE_ORDER_LINE_MISMATCH", status.HTTP_422_UNPROCESSABLE_ENTITY)
        order = _row_or_404(session, "purchase_orders", int(line["purchase_order_id"]), "PURCHASE_ORDER_NOT_FOUND")
        if order["status"] not in {"SENT", "PARTIALLY_RECEIVED", "READY_TO_CLOSE"}: raise auth_error("PURCHASE_ORDER_NOT_RECEIVABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
        order_id = int(order["id"])
    note = input.note.strip() or "Stock inward"
    inward = session.execute(text("""INSERT INTO stock_inwards (tenant_id,branch_id,item_id,purchase_order_id,purchase_order_line_id,qty,unit_cost,note,received_by)
        VALUES (:tenant_id,:branch_id,:item_id,:purchase_order_id,:line_id,:qty,:unit_cost,:note,:actor_id) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "item_id": input.item_id, "purchase_order_id": order_id, "line_id": input.purchase_order_line_id, "qty": input.qty, "unit_cost": input.unit_cost, "note": note, "actor_id": str(current.actor_id)}).mappings().one()
    ledger = session.execute(text("""INSERT INTO stock_ledger (tenant_id,branch_id,item_id,inward_id,entry_type,quantity,unit_cost,reason,actor_id)
        VALUES (:tenant_id,:branch_id,:item_id,:inward_id,'INWARD',:qty,:unit_cost,:reason,:actor_id) RETURNING id"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "item_id": input.item_id, "inward_id": inward["id"], "qty": input.qty, "unit_cost": input.unit_cost, "reason": note, "actor_id": str(current.actor_id)}).scalar_one()
    if order_id is not None: _reconcile_purchase(session, order_id)
    payload = {**_inward(dict(inward)), "ledgerId": ledger}; _audit(session, current, "STOCK_INWARD_RECORDED", note, {}, payload); return payload
```

### backend/app/inventory.py:309 ? adjust_stock

```python
def adjust_stock(input: StockAdjustmentInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_permission(scope, mutation=True), input.branch_id); _item_available(session, input.item_id, branch_id); reason = _clean(input.reason)
    quantity = _adjustment_quantity(input.quantity)
    row = session.execute(text("""INSERT INTO stock_ledger (tenant_id,branch_id,item_id,entry_type,quantity,unit_cost,reason,actor_id)
        VALUES (:tenant_id,:branch_id,:item_id,'ADJUSTMENT',:quantity,0,:reason,:actor_id) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "item_id": input.item_id, "quantity": quantity, "reason": reason, "actor_id": str(current.actor_id)}).mappings().one()
    payload = {"id": row["id"], "itemId": row["item_id"], "quantity": float(row["quantity"]), "reason": row["reason"], "entryType": row["entry_type"], "createdAt": row["created_at"]}; _audit(session, current, "STOCK_ADJUSTED", reason, {}, payload); return payload
```

### backend/app/inventory.py:318 ? list_stock_ledger

```python
def list_stock_ledger(scope: ScopedTenant, item_id: int | None = Query(default=None, alias="itemId"), branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, mutation=False)
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("SELECT * FROM stock_ledger WHERE (:branch_id IS NULL OR branch_id=:branch_id) AND (:item_id IS NULL OR item_id=:item_id) ORDER BY created_at DESC,id DESC"), {"branch_id": str(branch_id) if branch_id else None, "item_id": item_id}).mappings().all()
    return [{"id": row["id"], "branchId": str(row["branch_id"]), "itemId": row["item_id"], "inwardId": row["inward_id"], "entryType": row["entry_type"], "quantity": float(row["quantity"]), "unitCost": float(row["unit_cost"]), "reason": row["reason"], "actorId": str(row["actor_id"]), "createdAt": row["created_at"]} for row in rows]
```

### backend/app/jobs.py:214 ? list_jobs

```python
def list_jobs(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope
    _permission(scope, mutation=False)
    if branch_id is not None:
        _branch(current, branch_id)
    is_owner = any(name == "Owner/Admin" for _, name, _ in current.roles)
    rows = session.execute(text("""
        SELECT * FROM job_cards WHERE (:branch_id IS NULL OR branch_id=:branch_id)
          AND (:is_owner OR responsible_manager_id=:actor_id OR advisor_id=:actor_id)
        ORDER BY created_at DESC, id DESC
    """), {"branch_id": str(branch_id) if branch_id else None, "is_owner": is_owner, "actor_id": str(current.actor_id)}).mappings().all()
    return [_job_with_estimates(session, int(row["id"])) for row in rows]
```

### backend/app/jobs.py:229 ? get_job

```python
def get_job(job_id: int, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=False)
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    _assert_job_actor(current, job)
    return _job_with_estimates(session, job_id)
```

### backend/app/jobs.py:238 ? create_job

```python
def create_job(input: JobCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    branch_id = _branch(_permission(scope, mutation=True), input.branch_id)
    visit = _row_or_404(session, "visits", input.visit_id, "VISIT_NOT_FOUND")
    if visit["branch_id"] != branch_id or visit["archived_at"] is not None:
        raise auth_error("VISIT_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    existing = session.execute(text("SELECT id FROM job_cards WHERE visit_id=:visit_id"), {"visit_id": input.visit_id}).mappings().one_or_none()
    if existing:
        raise auth_error("VISIT_ALREADY_HAS_JOB", status.HTTP_409_CONFLICT)
    _routing(session, current, branch_id, input.department_id, input.responsible_manager_id)
    row = session.execute(text("""
        INSERT INTO job_cards (tenant_id, branch_id, job_no, visit_id, department_id, responsible_manager_id, assignment_state, status, work_list, promised_at, created_by, updated_by)
        VALUES (:tenant_id,:branch_id,'PENDING',:visit_id,:department_id,:manager_id,'AWAITING_ADVISOR_ASSIGNMENT','NEW',:work_list,:promised_at,:actor_id,:actor_id)
        RETURNING *
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "visit_id": input.visit_id,
             "department_id": str(input.department_id), "manager_id": str(input.responsible_manager_id), "work_list": input.work_list.strip(),
             "promised_at": input.promised_at, "actor_id": str(current.actor_id)}).mappings().one()
    row = session.execute(text("UPDATE job_cards SET job_no=:job_no, updated_at=now() WHERE id=:id RETURNING *"), {"id": row["id"], "job_no": f"JC-{int(row['id']):06d}"}).mappings().one()
    _record_assignment(session, current, int(row["id"]), branch_id, input.department_id, input.responsible_manager_id, None, "ROUTED_TO_MANAGER", "Awaiting advisor assignment")
    payload = _job_with_estimates(session, int(row["id"]))
    _audit(session, current, "JOB_CREATED", "Job created from visit", {}, payload)
    return payload
```

### backend/app/jobs.py:263 ? assign_job_advisor

```python
def assign_job_advisor(job_id: int, input: AdvisorAssignment, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    _assert_job_actor(current, job)
    if job["status"] in ("CANCELLED", "CLOSED"):
        raise auth_error("JOB_TERMINAL", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if job.get("responsible_manager_id") is None or job.get("department_id") is None:
        raise auth_error("JOB_ROUTING_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    # Only the responsible manager may delegate. Owners have transfer power,
    # but cannot bypass a manager's branch-local advisor team.
    if str(job["responsible_manager_id"]) != str(current.actor_id):
        raise auth_error("MANAGER_ASSIGNMENT_REQUIRED", status.HTTP_403_FORBIDDEN)
    advisor = session.execute(text("""
        SELECT advisor.user_id FROM service_advisor_teams team
        JOIN tenant_memberships advisor ON advisor.id=team.advisor_membership_id AND advisor.status='ACTIVE'
        JOIN membership_branches mb ON mb.membership_id=advisor.id AND mb.branch_id=team.branch_id
        JOIN membership_roles mr ON mr.membership_id=advisor.id AND mr.tenant_id=advisor.tenant_id
        JOIN tenant_roles role ON role.id=mr.role_id AND role.system_key='service' AND role.status='ACTIVE'
        WHERE team.tenant_id=:tenant_id AND team.branch_id=:branch_id AND team.department_id=:department_id
          AND team.manager_membership_id=(SELECT id FROM tenant_memberships WHERE tenant_id=:tenant_id AND user_id=:manager_id)
          AND advisor.user_id=:advisor_id
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "department_id": str(job["department_id"]), "manager_id": str(current.actor_id), "advisor_id": str(input.advisor_id)}).scalar()
    if not advisor:
        raise auth_error("ADVISOR_NOT_IN_MANAGER_TEAM", status.HTTP_422_UNPROCESSABLE_ENTITY)
    before = _job(job)
    row = session.execute(text("""
        UPDATE job_cards SET advisor_id=:advisor_id, assignment_state='ASSIGNED_TO_ADVISOR', updated_by=:actor_id, updated_at=now()
        WHERE id=:job_id RETURNING *
    """), {"advisor_id": str(input.advisor_id), "actor_id": str(current.actor_id), "job_id": job_id}).mappings().one()
    _record_assignment(session, current, job_id, job["branch_id"], job["department_id"], job["responsible_manager_id"], input.advisor_id, "ADVISOR_ASSIGNED", input.reason.strip() or "Advisor delegated by manager")
    payload = _job_with_estimates(session, job_id)
    _audit(session, current, "JOB_ADVISOR_ASSIGNED", input.reason.strip() or "Advisor delegated by manager", before, payload)
    return payload
```

### backend/app/jobs.py:300 ? transfer_job_manager

```python
def transfer_job_manager(job_id: int, input: ManagerTransfer, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    if not any(name == "Owner/Admin" for _, name, _ in current.roles):
        raise auth_error("MANAGER_TRANSFER_FORBIDDEN", status.HTTP_403_FORBIDDEN)
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    if job["status"] in ("CANCELLED", "CLOSED"):
        raise auth_error("JOB_TERMINAL", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if str(input.department_id) == str(job.get("department_id")) and str(input.responsible_manager_id) == str(job.get("responsible_manager_id")):
        raise auth_error("MANAGER_TRANSFER_UNCHANGED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    _routing(session, current, UUID(str(job["branch_id"])), input.department_id, input.responsible_manager_id)
    before = _job(job)
    session.execute(text("""
        UPDATE job_cards SET department_id=:department_id, responsible_manager_id=:manager_id, advisor_id=NULL,
          assignment_state='AWAITING_ADVISOR_ASSIGNMENT', updated_by=:actor_id, updated_at=now() WHERE id=:job_id
    """), {"department_id": str(input.department_id), "manager_id": str(input.responsible_manager_id), "actor_id": str(current.actor_id), "job_id": job_id})
    _record_assignment(session, current, job_id, job["branch_id"], input.department_id, input.responsible_manager_id, None, "MANAGER_TRANSFERRED", input.reason.strip() or "Transferred by administrator")
    payload = _job_with_estimates(session, job_id)
    _audit(session, current, "JOB_MANAGER_TRANSFERRED", input.reason.strip() or "Transferred by administrator", before, payload)
    return payload
```

### backend/app/jobs.py:323 ? create_estimate

```python
def create_estimate(job_id: int, input: EstimateCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    _assert_job_actor(current, job)
    if job["status"] in ("CANCELLED", "CLOSED"):
        raise auth_error("JOB_TERMINAL", status.HTTP_422_UNPROCESSABLE_ENTITY)
    previous = session.execute(text("SELECT * FROM estimates WHERE job_card_id=:job_id AND superseded_at IS NULL ORDER BY revision DESC LIMIT 1"), {"job_id": job_id}).mappings().one_or_none()
    revision = int(previous["revision"]) + 1 if previous else 1
    if previous and previous["status"] == "DRAFT":
        raise auth_error("ESTIMATE_DRAFT_EXISTS", status.HTTP_409_CONFLICT)
    if previous:
        session.execute(text("UPDATE estimates SET superseded_at=now(), superseded_by=:actor_id, updated_at=now() WHERE id=:id"), {"id": previous["id"], "actor_id": str(current.actor_id)})
    estimate = session.execute(text("""
        INSERT INTO estimates (tenant_id,branch_id,job_card_id,revision,status,discount,gst_rate,note,created_by,updated_by)
        VALUES (:tenant_id,:branch_id,:job_id,:revision,'DRAFT',:discount,:gst_rate,:note,:actor_id,:actor_id) RETURNING *
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job_id, "revision": revision,
             "discount": input.discount, "gst_rate": input.gst_rate, "note": input.note.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    for index, line in enumerate(input.lines, start=1):
        session.execute(text("""
            INSERT INTO estimate_lines (tenant_id,branch_id,estimate_id,line_no,kind,description,quantity,rate,gst_rate)
            VALUES (:tenant_id,:branch_id,:estimate_id,:line_no,:kind,:description,:quantity,:rate,:gst_rate)
        """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "estimate_id": estimate["id"], "line_no": index,
                 "kind": _clean(line.kind), "description": _clean(line.description), "quantity": line.quantity, "rate": line.rate, "gst_rate": line.gst_rate})
    payload = _estimate_with_lines(session, int(estimate["id"]))
    _audit(session, current, "ESTIMATE_CREATED", f"Estimate revision {revision} drafted", {}, payload)
    return payload
```

### backend/app/jobs.py:353 ? record_estimate_decision

```python
def record_estimate_decision(estimate_id: int, input: EstimateDecision, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    estimate = _row_or_404(session, "estimates", estimate_id, "ESTIMATE_NOT_FOUND")
    job = _row_or_404(session, "job_cards", int(estimate["job_card_id"]), "JOB_NOT_FOUND")
    _assert_job_actor(current, job)
    if job["status"] in ("CANCELLED", "CLOSED"):
        raise auth_error("JOB_TERMINAL", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if estimate["status"] != "DRAFT" or estimate["superseded_at"] is not None:
        raise auth_error("ESTIMATE_DECISION_NOT_ALLOWED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    payload_before = _estimate_with_lines(session, estimate_id)
    snapshot = json.dumps(payload_before, default=str)
    outcome_status = "APPROVED" if input.outcome == "approved" else "DECLINED"
    row = session.execute(text("""
        UPDATE estimates SET status=:status, approved_snapshot=CASE WHEN :status='APPROVED' THEN CAST(:snapshot AS jsonb) ELSE NULL END,
          updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *
    """), {"id": estimate_id, "status": outcome_status, "snapshot": snapshot, "actor_id": str(current.actor_id)}).mappings().one()
    decision = session.execute(text("""
        INSERT INTO estimate_decisions (tenant_id,branch_id,estimate_id,job_card_id,outcome,channel,decided_at,actor_id,note)
        VALUES (:tenant_id,:branch_id,:estimate_id,:job_id,:outcome,:channel,:decided_at,:actor_id,:note) RETURNING *
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "estimate_id": estimate_id, "job_id": job["id"],
             "outcome": input.outcome, "channel": input.channel, "decided_at": input.decided_at, "actor_id": str(current.actor_id), "note": input.note.strip()}).mappings().one()
    payload = _estimate_with_lines(session, int(row["id"]))
    _audit(session, current, "ESTIMATE_DECISION_RECORDED", f"{input.outcome} via {input.channel}", payload_before, {"estimate": payload, "decision": dict(decision)})
    return {"estimate": payload, "decision": {"id": decision["id"], "outcome": decision["outcome"], "channel": decision["channel"], "decidedAt": decision["decided_at"], "actorId": str(decision["actor_id"]), "note": decision["note"]}}
```

### backend/app/jobs.py:445 ? command_job

```python
def command_job(
    job_id: int,
    command: Literal["start-work", "hold-job", "resume-work", "cancel-job", "start-rework", "complete-work"],
    input: JobCommand,
    scope: ScopedTenant,
    request_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None,
) -> dict[str, object]:
    session, current = scope
    _permission(scope, mutation=True)
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    _assert_job_actor(current, job)
    if request_key and session.execute(text("SELECT 1 FROM job_events WHERE job_card_id=:job_id AND request_key=:request_key"), {"job_id": job_id, "request_key": request_key.strip()}).scalar():
        return _job(_row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND"))
    allowed, target, reason_required = _COMMANDS[command]
    reason = input.reason.strip()
    if reason_required and not reason:
        raise auth_error("COMMAND_REASON_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if job["status"] not in allowed:
        raise auth_error("INVALID_JOB_TRANSITION", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if command == "start-work" and _branch_requires_approval(session, job["branch_id"]):
        approved = session.execute(text("SELECT 1 FROM estimates WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL"), {"job_id": job_id}).scalar()
        if not approved:
            raise auth_error("ESTIMATE_APPROVAL_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if command == "complete-work" and _completion_prerequisites(session, job_id):
        raise auth_error("COMPLETION_PREREQUISITES_UNMET", status.HTTP_422_UNPROCESSABLE_ENTITY)
    before = _job(job)
    row = session.execute(text("UPDATE job_cards SET status=:status, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *"), {"id": job_id, "status": target, "actor_id": str(current.actor_id)}).mappings().one()
    session.execute(text("""
        INSERT INTO job_events (tenant_id,branch_id,job_card_id,command,from_status,to_status,reason,request_key,actor_id)
        VALUES (:tenant_id,:branch_id,:job_id,:command,:from_status,:to_status,:reason,:request_key,:actor_id)
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job_id, "command": command,
             "from_status": job["status"], "to_status": target, "reason": reason, "request_key": request_key.strip() if request_key else None, "actor_id": str(current.actor_id)})
    payload = _job(dict(row))
    _audit(session, current, "JOB_COMMAND", f"{command}: {reason or 'No reason required'}", before, payload)
    return payload
```

### backend/app/main.py:69 ? health

```python
def health(session: Session = Depends(get_session)) -> dict[str, str]:
    """Report readiness only after PostgreSQL accepts a query."""
    try:
        session.execute(text("SELECT 1"))
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="database_unavailable",
        ) from error
    return {"status": "ok", "database": "postgresql", "environment": get_settings().environment}
```

### backend/app/main.py:82 ? api_health

```python
def api_health(session: Session = Depends(get_session)) -> dict[str, str]:
    """Versioned API health endpoint used by integration clients."""
    return health(session)
```

### backend/app/main.py:88 ? auth_config

```python
def auth_config() -> dict[str, object]:
    """Expose only browser-safe sign-in configuration, never authorization scope."""
    settings = get_settings()
    if settings.auth_mode == "local":
        if not settings.demo_auth_enabled:
            raise auth_error("AUTH_CONFIGURATION_INVALID", status.HTTP_503_SERVICE_UNAVAILABLE)
        return {"mode": "local", "allowDemo": True}
    required = (
        settings.cognito_client_id,
        settings.cognito_authorization_endpoint,
        settings.cognito_token_endpoint,
        settings.cognito_logout_endpoint,
        settings.cognito_callback_uri,
        settings.cognito_logout_uri,
    )
    if not all(required):
        raise auth_error("AUTH_CONFIGURATION_INVALID", status.HTTP_503_SERVICE_UNAVAILABLE)
    return {
        "mode": "cognito",
        "clientId": settings.cognito_client_id,
        "authorizationEndpoint": str(settings.cognito_authorization_endpoint),
        "tokenEndpoint": str(settings.cognito_token_endpoint),
        "logoutEndpoint": str(settings.cognito_logout_endpoint),
        "callbackUri": str(settings.cognito_callback_uri),
        "logoutUri": str(settings.cognito_logout_uri),
        "scopes": ["openid", "email"],
    }
```

### backend/app/main.py:118 ? session

```python
def session(scope: ScopedTenant) -> dict[str, object]:
    """Return the server-resolved Tenant session used by the existing Cognito UI."""
    _, current = scope
    return session_payload(current)
```

### backend/app/main.py:125 ? read_tenant_settings

```python
def read_tenant_settings(scope: ScopedTenant) -> dict[str, object]:
    """A first Tenant-owned read proves that RLS is part of the API boundary."""
    session, current = scope
    require_permission(scope, "tenant.settings.read")
    row = session.execute(
        text("SELECT settings, updated_at FROM tenant_settings WHERE tenant_id = :tenant_id"),
        {"tenant_id": str(current.tenant_id)},
    ).mappings().one_or_none()
    return {"settings": dict(row["settings"]) if row else {}, "updatedAt": row["updated_at"].isoformat() if row else None}
```

### backend/app/main.py:137 ? write_tenant_settings

```python
def write_tenant_settings(input: SettingsUpdate, scope: ScopedTenant) -> dict[str, object]:
    """Write through the trusted Tenant context; caller-supplied tenant ids do not exist here."""
    session, current = scope
    require_permission(scope, "tenant.settings.write")
    require_tenant_mutation(scope)
    row = session.execute(
        text(
            """
            INSERT INTO tenant_settings (tenant_id, settings, updated_by)
            VALUES (:tenant_id, CAST(:settings AS jsonb), :actor_id)
            ON CONFLICT (tenant_id) DO UPDATE
            SET settings = EXCLUDED.settings, updated_by = EXCLUDED.updated_by, updated_at = now()
            RETURNING settings, updated_at
            """
        ),
        {"tenant_id": str(current.tenant_id), "settings": __import__("json").dumps(input.settings), "actor_id": str(current.actor_id)},
    ).mappings().one()
    return {"settings": dict(row["settings"]), "updatedAt": row["updated_at"].isoformat()}
```

### backend/app/main.py:158 ? read_branch_settings

```python
def read_branch_settings(branch_id: UUID, scope: ScopedTenant) -> dict[str, object]:
    """Branch paths are narrowed against the server membership before querying RLS data."""
    session, current = scope
    require_permission(scope, "branch.settings.read")
    try:
        require_branch(current, branch_id)
    except PermissionError as error:
        raise auth_error("BRANCH_ACCESS_DENIED", status.HTTP_403_FORBIDDEN) from error
    row = session.execute(
        text("SELECT settings, updated_at FROM branch_settings WHERE tenant_id = :tenant_id AND branch_id = :branch_id"),
        {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id)},
    ).mappings().one_or_none()
    return {"settings": dict(row["settings"]) if row else {}, "updatedAt": row["updated_at"].isoformat() if row else None}
```

### backend/app/materials.py:154 ? list_reservations

```python
def list_reservations(scope: ScopedTenant, job_id: int | None = Query(default=None, alias="jobId"), branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope
    _request_permission(scope, mutation=False)
    if branch_id is not None:
        _branch(current, branch_id)
    rows = session.execute(text("""SELECT id FROM material_reservations
        WHERE (:job_id IS NULL OR job_card_id=:job_id) AND (:branch_id IS NULL OR branch_id=:branch_id)
        ORDER BY created_at DESC,id DESC"""), {"job_id": job_id, "branch_id": str(branch_id) if branch_id else None}).mappings().all()
    return [_reservation_with_totals(session, int(row["id"])) for row in rows]
```

### backend/app/materials.py:166 ? list_job_reservations

```python
def list_job_reservations(job_id: int, scope: ScopedTenant) -> list[dict[str, object]]:
    return list_reservations(scope, job_id=job_id)
```

### backend/app/materials.py:171 ? list_material_ledger

```python
def list_material_ledger(scope: ScopedTenant, reservation_id: int | None = Query(default=None, alias="reservationId"), job_id: int | None = Query(default=None, alias="jobId"), branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope
    _store_permission(scope, mutation=False)
    if branch_id is not None:
        _branch(current, branch_id)
    rows = session.execute(text("""SELECT * FROM material_ledger WHERE (:reservation_id IS NULL OR reservation_id=:reservation_id)
        AND (:job_id IS NULL OR job_card_id=:job_id) AND (:branch_id IS NULL OR branch_id=:branch_id)
        ORDER BY created_at DESC,id DESC"""), {"reservation_id": reservation_id, "job_id": job_id, "branch_id": str(branch_id) if branch_id else None}).mappings().all()
    return [_event(dict(row)) for row in rows]
```

### backend/app/materials.py:183 ? create_reservation

```python
def create_reservation(input: MaterialReservationInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    branch_id = _branch(_request_permission(scope, mutation=True), input.branch_id)
    job = _approved_job(session, input.job_id)
    if job["branch_id"] != branch_id:
        raise auth_error("JOB_BRANCH_MISMATCH", status.HTTP_422_UNPROCESSABLE_ENTITY)
    _item_for_update(session, input.item_id, branch_id)
    available = _available_to_reserve(session, input.item_id, branch_id)
    if input.quantity > available:
        raise auth_error("INSUFFICIENT_AVAILABLE_STOCK_TO_RESERVE", status.HTTP_409_CONFLICT)
    reservation = session.execute(text("""INSERT INTO material_reservations
        (tenant_id,branch_id,job_card_id,item_id,reserved_qty,status,note,created_by,updated_by)
        VALUES (:tenant_id,:branch_id,:job_id,:item_id,:quantity,'RESERVED',:note,:actor_id,:actor_id) RETURNING *"""),
        {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "job_id": input.job_id, "item_id": input.item_id,
         "quantity": input.quantity, "note": input.note.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    session.execute(text("""INSERT INTO material_ledger (tenant_id,branch_id,reservation_id,job_card_id,item_id,entry_type,quantity,reason,actor_id)
        VALUES (:tenant_id,:branch_id,:reservation_id,:job_id,:item_id,'RESERVE',:quantity,:reason,:actor_id)"""),
        {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "reservation_id": reservation["id"], "job_id": input.job_id,
         "item_id": input.item_id, "quantity": input.quantity, "reason": input.note.strip() or "Reserved for approved job", "actor_id": str(current.actor_id)})
    payload = _reservation_with_totals(session, int(reservation["id"]))
    _audit(session, current, "MATERIAL_RESERVED", input.note.strip() or "Material reserved", {}, payload)
    return payload
```

### backend/app/materials.py:208 ? material_command

```python
def material_command(reservation_id: int, command: MaterialCommandName, input: MaterialCommand, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _store_permission(scope, mutation=True)
    reservation = _row_or_404(session, "material_reservations", reservation_id, "MATERIAL_RESERVATION_NOT_FOUND")
    job = _row_or_404(session, "job_cards", int(reservation["job_card_id"]), "JOB_NOT_FOUND")
    if job["status"] in ("CANCELLED", "CLOSED"):
        raise auth_error("JOB_TERMINAL", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if command == "issue" and job["status"] != "IN_PROGRESS":
        raise auth_error("MATERIAL_ISSUE_REQUIRES_ACTIVE_JOB", status.HTTP_422_UNPROCESSABLE_ENTITY)
    _item_for_update(session, int(reservation["item_id"]), reservation["branch_id"])
    event_type = {"issue": "ISSUE", "return": "RETURN", "waste": "WASTE", "release": "RELEASE", "reverse-issue": "ISSUE_REVERSAL"}[command]
    if command in ("waste", "release", "reverse-issue") and not input.reason.strip():
        raise auth_error("MATERIAL_COMMAND_REASON_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    before = _reservation_with_totals(session, reservation_id)
    try:
        event = session.execute(text("""INSERT INTO material_ledger
            (tenant_id,branch_id,reservation_id,job_card_id,item_id,entry_type,quantity,reason,actor_id)
            VALUES (:tenant_id,:branch_id,:reservation_id,:job_id,:item_id,:entry_type,:quantity,:reason,:actor_id) RETURNING *"""),
            {"tenant_id": str(current.tenant_id), "branch_id": str(reservation["branch_id"]), "reservation_id": reservation_id,
             "job_id": reservation["job_card_id"], "item_id": reservation["item_id"], "entry_type": event_type,
             "quantity": input.quantity, "reason": input.reason.strip() or event_type.replace("_", " ").title(), "actor_id": str(current.actor_id)}).mappings().one()
    except Exception as error:
        message = str(error.orig) if getattr(error, "orig", None) else str(error)
        code = "NEGATIVE_STOCK_NOT_ALLOWED" if "negative_stock_not_allowed" in message else "MATERIAL_QUANTITY_INVARIANT_VIOLATION"
        raise auth_error(code, status.HTTP_409_CONFLICT) from error
    _reconcile(session, reservation_id, current.actor_id)
    payload = {"reservation": _reservation_with_totals(session, reservation_id), "event": _event(dict(event))}
    _audit(session, current, f"MATERIAL_{event_type}", input.reason.strip() or event_type.replace("_", " ").title(), before, payload)
    return payload
```

### backend/app/sales_crm.py:83 ? list_leads

```python
def list_leads(scope: ScopedTenant, q: str = "", stage: LeadStage | None = None, temperature: Temperature | None = None, exact_date: date | None = Query(None, alias="exactDate"), month: str | None = None, branch_id: UUID | None = Query(None, alias="branchId")):
    current = _admin(scope); branch = _branch(current, branch_id) if branch_id else None
    rows = scope[0].execute(text("""SELECT * FROM sales_leads WHERE (:branch IS NULL OR branch_id=:branch) AND (:stage IS NULL OR stage=:stage) AND (:temperature IS NULL OR temperature=:temperature) AND (:exact IS NULL OR follow_up_due=:exact) AND (:exact IS NOT NULL OR :month IS NULL OR to_char(follow_up_due,'YYYY-MM')=:month) AND (:q='' OR display_name ILIKE :like OR company ILIKE :like OR phone ILIKE :like) ORDER BY created_at DESC"""), {"branch":str(branch) if branch else None,"stage":stage,"temperature":temperature,"exact":exact_date,"month":month,"q":q.strip(),"like":f"%{q.strip()}%"}).mappings()
    return [_lead(row) for row in rows]
```

### backend/app/sales_crm.py:88 ? create_lead

```python
def create_lead(input: LeadInput, scope: ScopedTenant):
    session,current=scope; branch=_branch(_admin(scope, True), input.branch_id)
    row=session.execute(text("""INSERT INTO sales_leads(tenant_id,branch_id,display_name,phone,company,company_not_entered,email,email_not_entered,address,service_interest,notes,stage,temperature,follow_up_due,site_visit_completed,site_visit_date,created_by,updated_by) VALUES (:tenant,:branch,:name,:phone,:company,:company_not_entered,:email,:email_not_entered,:address,:interest,:notes,:stage,:temperature,:due,:visited,:visit_date,:actor,:actor) RETURNING *"""), {"tenant":str(current.tenant_id),"branch":str(branch),"name":input.display_name.strip(),"phone":input.phone.strip(),"company":input.company.strip(),"company_not_entered":input.company_not_entered,"email":input.email.strip(),"email_not_entered":input.email_not_entered,"address":input.address.strip(),"interest":input.service_interest.strip(),"notes":input.notes.strip(),"stage":input.stage,"temperature":input.temperature,"due":input.follow_up_due,"visited":input.site_visit_completed,"visit_date":input.site_visit_date,"actor":str(current.actor_id)}).mappings().one()
    payload=_lead(row); _audit(session,current,"SALES_LEAD_CREATED","Sales lead created",{},payload); return payload
```

### backend/app/sales_crm.py:93 ? update_lead

```python
def update_lead(lead_id:int,input:LeadInput,scope:ScopedTenant):
    session,current=scope; branch=_branch(_admin(scope, True),input.branch_id); before=session.execute(text("SELECT * FROM sales_leads WHERE id=:id"),{"id":lead_id}).mappings().one_or_none()
    if not before: raise auth_error("LEAD_NOT_FOUND",404)
    row=session.execute(text("""UPDATE sales_leads SET branch_id=:branch,display_name=:name,phone=:phone,company=:company,company_not_entered=:company_not_entered,email=:email,email_not_entered=:email_not_entered,address=:address,service_interest=:interest,notes=:notes,stage=:stage,temperature=:temperature,follow_up_due=:due,site_visit_completed=:visited,site_visit_date=:visit_date,updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *"""), {"id":lead_id,"branch":str(branch),"name":input.display_name.strip(),"phone":input.phone.strip(),"company":input.company.strip(),"company_not_entered":input.company_not_entered,"email":input.email.strip(),"email_not_entered":input.email_not_entered,"address":input.address.strip(),"interest":input.service_interest.strip(),"notes":input.notes.strip(),"stage":input.stage,"temperature":input.temperature,"due":input.follow_up_due,"visited":input.site_visit_completed,"visit_date":input.site_visit_date,"actor":str(current.actor_id)}).mappings().one(); payload=_lead(row); _audit(session,current,"SALES_LEAD_UPDATED","Sales lead updated",_lead(before),payload); return payload
```

### backend/app/sales_crm.py:99 ? list_quotations

```python
def list_quotations(scope:ScopedTenant,q:str="",quotation_status:QuotationStatus|None=Query(None,alias="status"),exact_date:date|None=Query(None,alias="exactDate"),month:str|None=None,branch_id:UUID|None=Query(None,alias="branchId")):
    current=_admin(scope); branch=_branch(current,branch_id) if branch_id else None
    rows=scope[0].execute(text("""SELECT q.* FROM quotations q JOIN sales_leads l ON l.id=q.lead_id WHERE (:branch IS NULL OR q.branch_id=:branch) AND (:status IS NULL OR q.status=:status) AND (:exact IS NULL OR q.created_at::date=:exact) AND (:exact IS NOT NULL OR :month IS NULL OR to_char(q.created_at,'YYYY-MM')=:month) AND (:q='' OR q.quotation_no ILIKE :like OR l.display_name ILIKE :like OR l.company ILIKE :like) ORDER BY q.created_at DESC"""),{"branch":str(branch) if branch else None,"status":quotation_status,"exact":exact_date,"month":month,"q":q.strip(),"like":f"%{q.strip()}%"}).mappings(); return [_quotation(scope[0],row) for row in rows]
```

### backend/app/sales_crm.py:104 ? list_service_tasks

```python
def list_service_tasks(scope: ScopedTenant, q: str = "", branch_id: UUID | None = Query(None, alias="branchId")):
    """The quotation picker only exposes active tasks in the selected branch."""
    session, current = scope
    branch = _branch(_admin(scope), branch_id)
    rows = session.execute(text("""
        SELECT id, name, description, rate, gst_rate FROM service_task_catalog
        WHERE branch_id=:branch AND status='ACTIVE'
          AND (:q='' OR name ILIKE :like OR description ILIKE :like)
        ORDER BY name, id
    """), {"branch": str(branch), "q": q.strip(), "like": f"%{q.strip()}%"}).mappings()
    return [{"id": row["id"], "name": row["name"], "description": row["description"], "rate": float(row["rate"]), "gstRate": float(row["gst_rate"])} for row in rows]
```

### backend/app/sales_crm.py:116 ? create_quotation

```python
def create_quotation(input:QuotationInput,scope:ScopedTenant):
    session,current=scope; branch=_branch(_admin(scope,True),input.branch_id); lead=session.execute(text("SELECT * FROM sales_leads WHERE id=:id"),{"id":input.lead_id}).mappings().one_or_none()
    if not lead or str(lead["branch_id"])!=str(branch): raise auth_error("LEAD_NOT_AVAILABLE",422)
    subtotal,gst,total=_totals(input.lines,input.discount)
    row=session.execute(text("""INSERT INTO quotations(tenant_id,branch_id,lead_id,quotation_no,valid_until,customer_notes,discount,subtotal,gst_amount,total,template_id,template_html,document_snapshot,created_by,updated_by) VALUES (:tenant,:branch,:lead,'PENDING',:valid,:notes,:discount,:subtotal,:gst,:total,:template_id,:template_html,CAST(:snapshot AS jsonb),:actor,:actor) RETURNING *"""),{"tenant":str(current.tenant_id),"branch":str(branch),"lead":input.lead_id,"valid":input.valid_until,"notes":input.customer_notes.strip(),"discount":input.discount,"subtotal":subtotal,"gst":gst,"total":total,"template_id":input.template_id,"template_html":input.template_html,"snapshot":_snapshot(input,lead,subtotal,gst,total),"actor":str(current.actor_id)}).mappings().one()
    row=session.execute(text("UPDATE quotations SET quotation_no=:number WHERE id=:id RETURNING *"),{"id":row["id"],"number":f"QT-{int(row['id']):06d}"}).mappings().one()
    for no,line in enumerate(input.lines,1): session.execute(text("INSERT INTO quotation_lines(tenant_id,branch_id,quotation_id,line_no,kind,description,quantity,rate,gst_rate) VALUES (:tenant,:branch,:quotation,:no,:kind,:description,:quantity,:rate,:gst)"),{"tenant":str(current.tenant_id),"branch":str(branch),"quotation":row["id"],"no":no,"kind":line.kind.strip(),"description":line.description.strip(),"quantity":line.quantity,"rate":line.rate,"gst":line.gst_rate})
    session.execute(text("UPDATE sales_leads SET stage='QUOTATION_SENT',updated_by=:actor,updated_at=now() WHERE id=:id"),{"id":input.lead_id,"actor":str(current.actor_id)})
    payload=_quotation(session,row); _audit(session,current,"QUOTATION_CREATED",f"Quotation {row['quotation_no']} created",{},payload); return payload
```

### backend/app/sales_crm.py:126 ? update_quotation

```python
def update_quotation(quotation_id:int,input:QuotationInput,scope:ScopedTenant):
    """Only a draft may be amended; regenerated values remain a fresh frozen snapshot."""
    session,current=scope; branch=_branch(_admin(scope,True),input.branch_id); before=session.execute(text("SELECT * FROM quotations WHERE id=:id"),{"id":quotation_id}).mappings().one_or_none()
    if not before: raise auth_error("QUOTATION_NOT_FOUND",404)
    if before["status"] != "DRAFT": raise auth_error("QUOTATION_NOT_EDITABLE",422)
    before_payload = _quotation(session, before)
    lead=session.execute(text("SELECT * FROM sales_leads WHERE id=:id"),{"id":input.lead_id}).mappings().one_or_none()
    if not lead or str(lead["branch_id"]) != str(branch): raise auth_error("LEAD_NOT_AVAILABLE",422)
    subtotal,gst,total=_totals(input.lines,input.discount)
    row=session.execute(text("""UPDATE quotations SET branch_id=:branch,lead_id=:lead,valid_until=:valid,customer_notes=:notes,discount=:discount,subtotal=:subtotal,gst_amount=:gst,total=:total,template_id=:template_id,template_html=:template_html,document_snapshot=CAST(:snapshot AS jsonb),updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *"""),{"id":quotation_id,"branch":str(branch),"lead":input.lead_id,"valid":input.valid_until,"notes":input.customer_notes.strip(),"discount":input.discount,"subtotal":subtotal,"gst":gst,"total":total,"template_id":input.template_id,"template_html":input.template_html,"snapshot":_snapshot(input,lead,subtotal,gst,total),"actor":str(current.actor_id)}).mappings().one()
    session.execute(text("DELETE FROM quotation_lines WHERE quotation_id=:id"),{"id":quotation_id})
    for no,line in enumerate(input.lines,1): session.execute(text("INSERT INTO quotation_lines(tenant_id,branch_id,quotation_id,line_no,kind,description,quantity,rate,gst_rate) VALUES (:tenant,:branch,:quotation,:no,:kind,:description,:quantity,:rate,:gst)"),{"tenant":str(current.tenant_id),"branch":str(branch),"quotation":quotation_id,"no":no,"kind":line.kind.strip(),"description":line.description.strip(),"quantity":line.quantity,"rate":line.rate,"gst":line.gst_rate})
    payload=_quotation(session,row); _audit(session,current,"QUOTATION_UPDATED",f"Quotation {row['quotation_no']} updated",before_payload,payload); return payload
```

### backend/app/sales_crm.py:140 ? change_status

```python
def change_status(quotation_id:int,input:StatusInput,scope:ScopedTenant):
    session,current=scope; _admin(scope,True); row=session.execute(text("SELECT * FROM quotations WHERE id=:id"),{"id":quotation_id}).mappings().one_or_none()
    if not row: raise auth_error("QUOTATION_NOT_FOUND",404)
    if row["status"] in ("ACCEPTED","REJECTED","EXPIRED") and row["status"] != input.status: raise auth_error("QUOTATION_FINAL",422)
    changed=session.execute(text("UPDATE quotations SET status=:status,updated_by=:actor,updated_at=now() WHERE id=:id RETURNING *"),{"id":quotation_id,"status":input.status,"actor":str(current.actor_id)}).mappings().one()
    if input.status=="ACCEPTED": session.execute(text("UPDATE sales_leads SET stage='WON',updated_by=:actor,updated_at=now() WHERE id=:id"),{"id":row["lead_id"],"actor":str(current.actor_id)})
    return _quotation(session,changed)
```

### backend/app/sales_crm.py:148 ? quotation_document

```python
def quotation_document(quotation_id:int,scope:ScopedTenant):
    session, _ = scope; _admin(scope); row=session.execute(text("SELECT document_snapshot,quotation_no,template_html,created_at FROM quotations WHERE id=:id"),{"id":quotation_id}).mappings().one_or_none()
    if not row: raise auth_error("QUOTATION_NOT_FOUND",404)
    # The template is the saved copy, never the mutable template definition.
    return {"quotationNo":row["quotation_no"],"createdAt":row["created_at"],"templateHtml":row["template_html"],"snapshot":dict(row["document_snapshot"])}
```

### backend/app/superadmin.py:237 ? list_tenants

```python
def list_tenants(scope: ScopedSuperadmin) -> dict[str, object]:
    session, _ = scope
    rows = _rows(
        session,
        """
        SELECT t.id, t.name, t.lifecycle_state, t.created_at, b.id AS primary_branch_id, b.name AS primary_branch_name,
               pb.plan, pb.agreed_price, pb.currency, pb.billing_cycle, pb.renewal_date, pb.due_date,
               pb.payment_status, pb.internal_notes, pb.updated_at AS billing_updated_at
        FROM tenants AS t JOIN branches AS b ON b.tenant_id = t.id AND b.is_primary
        LEFT JOIN platform_billing AS pb ON pb.tenant_id = t.id
        ORDER BY t.created_at DESC, t.id DESC
        """,
        {},
    )
    return {"tenants": [_tenant_payload(row) for row in rows]}
```

### backend/app/superadmin.py:255 ? provision_tenant

```python
def provision_tenant(input: ProvisionTenant, scope: ScopedSuperadmin) -> dict[str, object]:
    session, actor = scope
    tenant_id, branch_id, admin_id, membership_id, invitation_id = (uuid4() for _ in range(5))
    role_ids = {name: uuid4() for name in DEFAULT_ROLE_PERMISSIONS}
    tenant_name, branch_name = _clean(input.tenant_name), _clean(input.primary_branch_name)
    admin_name, admin_email = _clean(input.tenant_admin_name), _clean(input.tenant_admin_email).lower()
    session.execute(text("INSERT INTO tenants (id, name, lifecycle_state) VALUES (:id, :name, :state)"), {"id": str(tenant_id), "name": tenant_name, "state": input.lifecycle_state})
    session.execute(text("INSERT INTO branches (id, tenant_id, name, is_primary) VALUES (:id, :tenant_id, :name, true)"), {"id": str(branch_id), "tenant_id": str(tenant_id), "name": branch_name})
    session.execute(text("INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, NULL, :name, :email)"), {"id": str(admin_id), "name": admin_name, "email": admin_email})
    session.execute(text("INSERT INTO tenant_memberships (id, tenant_id, user_id, status) VALUES (:id, :tenant_id, :user_id, 'INVITED')"), {"id": str(membership_id), "tenant_id": str(tenant_id), "user_id": str(admin_id)})
    session.execute(text("INSERT INTO membership_branches (membership_id, branch_id, tenant_id) VALUES (:membership_id, :branch_id, :tenant_id)"), {"membership_id": str(membership_id), "branch_id": str(branch_id), "tenant_id": str(tenant_id)})
    for role_name, permissions in DEFAULT_ROLE_PERMISSIONS.items():
        role_id = role_ids[role_name]
        session.execute(
            text("INSERT INTO tenant_roles (id, tenant_id, name, description, system_key) VALUES (:id, :tenant_id, :name, :description, :system_key)"),
            {"id": str(role_id), "tenant_id": str(tenant_id), "name": role_name, "description": f"{role_name} workspace access", "system_key": SYSTEM_ROLE_KEYS[role_name]},
        )
        for permission in permissions:
            session.execute(text("INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)"), {"role_id": str(role_id), "permission": permission})
    session.execute(text("INSERT INTO membership_roles (membership_id, role_id, tenant_id) VALUES (:membership_id, :role_id, :tenant_id)"), {"membership_id": str(membership_id), "role_id": str(role_ids['Owner/Admin']), "tenant_id": str(tenant_id)})
    session.execute(text("INSERT INTO tenant_admin_invitations (id, tenant_id, membership_id, email, status, last_sent_at) VALUES (:id, :tenant_id, :membership_id, :email, 'PENDING', now())"), {"id": str(invitation_id), "tenant_id": str(tenant_id), "membership_id": str(membership_id), "email": admin_email})
    _create_scoped_defaults(session, tenant_id, branch_id, actor.actor_id)
    session.execute(text("INSERT INTO platform_billing (tenant_id, plan, agreed_price, currency, billing_cycle, renewal_date, due_date, payment_status, internal_notes, updated_by) VALUES (:tenant_id, :plan, :agreed_price, :currency, :billing_cycle, :renewal_date, :due_date, :payment_status, :internal_notes, :actor_id)"), {"tenant_id": str(tenant_id), **input.model_dump(include={"plan", "agreed_price", "currency", "billing_cycle", "renewal_date", "due_date", "payment_status", "internal_notes"}), "actor_id": str(actor.actor_id)})
    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action="TENANT_PROVISIONED", reason="Tenant provisioned", before={}, after={"primaryBranchId": str(branch_id), "tenantAdminInvitationId": str(invitation_id), "defaultsVersion": 1, "operationalDataCopied": False})
    payload = _tenant_payload(_tenant_or_404(session, tenant_id))
    payload["tenantAdminInvitation"] = {"id": str(invitation_id), "email": admin_email, "status": "PENDING"}
    return payload
```

### backend/app/superadmin.py:285 ? get_tenant

```python
def get_tenant(tenant_id: UUID, scope: ScopedSuperadmin) -> dict[str, object]:
    session, _ = scope
    return _tenant_payload(_tenant_or_404(session, tenant_id))
```

### backend/app/superadmin.py:291 ? update_billing

```python
def update_billing(tenant_id: UUID, input: UpdateBilling, scope: ScopedSuperadmin) -> dict[str, object]:
    session, actor = scope
    before = _tenant_or_404(session, tenant_id)
    session.execute(text("UPDATE platform_billing SET plan=:plan, agreed_price=:agreed_price, currency=:currency, billing_cycle=:billing_cycle, renewal_date=:renewal_date, due_date=:due_date, payment_status=:payment_status, internal_notes=:internal_notes, updated_by=:actor_id, updated_at=now() WHERE tenant_id=:tenant_id"), {"tenant_id": str(tenant_id), "actor_id": str(actor.actor_id), **input.model_dump(exclude={"reason"})})
    after = _tenant_or_404(session, tenant_id)
    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action="PLATFORM_BILLING_UPDATED", reason=_clean(input.reason), before=_tenant_payload(before)["platformBilling"], after=_tenant_payload(after)["platformBilling"])
    return _tenant_payload(after)
```

### backend/app/superadmin.py:301 ? update_lifecycle

```python
def update_lifecycle(tenant_id: UUID, input: UpdateLifecycle, scope: ScopedSuperadmin) -> dict[str, object]:
    session, actor = scope
    before = _tenant_or_404(session, tenant_id)
    current = str(before["lifecycle_state"])
    if not can_transition_lifecycle(current, input.lifecycle_state):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "INVALID_LIFECYCLE_TRANSITION"})
    session.execute(text("UPDATE tenants SET lifecycle_state = :state WHERE id = :tenant_id"), {"state": input.lifecycle_state, "tenant_id": str(tenant_id)})
    after = _tenant_or_404(session, tenant_id)
    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action="TENANT_LIFECYCLE_CHANGED", reason=_clean(input.reason), before={"lifecycleState": current}, after={"lifecycleState": input.lifecycle_state})
    return _tenant_payload(after)
```

### backend/app/superadmin.py:314 ? start_emulation

```python
def start_emulation(tenant_id: UUID, input: StartEmulation, scope: ScopedSuperadmin) -> dict[str, object]:
    session, actor = scope
    tenant = _tenant_or_404(session, tenant_id)
    if tenant["lifecycle_state"] == "closed":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "EMULATION_CLOSED_TENANT"})
    existing = _rows(session, "SELECT id FROM support_emulations WHERE superadmin_id=:actor_id AND tenant_id=:tenant_id AND status='ACTIVE'", {"actor_id": str(actor.actor_id), "tenant_id": str(tenant_id)})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "EMULATION_ALREADY_ACTIVE"})
    emulation_id = uuid4()
    reason = _clean(input.reason)
    session.execute(text("INSERT INTO support_emulations (id, superadmin_id, tenant_id, status, reason) VALUES (:id, :actor_id, :tenant_id, 'ACTIVE', :reason)"), {"id": str(emulation_id), "actor_id": str(actor.actor_id), "tenant_id": str(tenant_id), "reason": reason})
    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action="SUPPORT_EMULATION_STARTED", reason=reason, before={}, after={"emulationId": str(emulation_id), "readOnly": True})
    return {"id": str(emulation_id), "tenantId": str(tenant_id), "status": "ACTIVE", "readOnly": True}
```

### backend/app/superadmin.py:330 ? end_emulation

```python
def end_emulation(emulation_id: UUID, input: EndEmulation, scope: ScopedSuperadmin) -> dict[str, object]:
    session, actor = scope
    rows = _rows(session, "SELECT tenant_id FROM support_emulations WHERE id=:id AND superadmin_id=:actor_id AND status='ACTIVE'", {"id": str(emulation_id), "actor_id": str(actor.actor_id)})
    if len(rows) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "ACTIVE_EMULATION_NOT_FOUND"})
    tenant_id = UUID(str(rows[0]["tenant_id"]))
    reason = _clean(input.reason)
    session.execute(text("UPDATE support_emulations SET status='ENDED', ended_at=now(), ended_reason=:reason WHERE id=:id"), {"id": str(emulation_id), "reason": reason})
    _audit(session, tenant_id=tenant_id, actor_id=actor.actor_id, action="SUPPORT_EMULATION_ENDED", reason=reason, before={"emulationId": str(emulation_id), "status": "ACTIVE"}, after={"emulationId": str(emulation_id), "status": "ENDED"})
    return {"id": str(emulation_id), "status": "ENDED"}
```

### backend/app/superadmin.py:343 ? list_audit_events

```python
def list_audit_events(tenant_id: UUID, scope: ScopedSuperadmin) -> dict[str, object]:
    session, _ = scope
    _tenant_or_404(session, tenant_id)
    rows = _rows(session, "SELECT id, action, reason, before_value, after_value, created_at FROM tenant_audit_events WHERE tenant_id=:tenant_id ORDER BY created_at DESC, id DESC", {"tenant_id": str(tenant_id)})
    return {"events": [{"id": str(row["id"]), "action": row["action"], "reason": row["reason"], "before": row["before_value"], "after": row["after_value"], "createdAt": row["created_at"]} for row in rows]}
```

### backend/app/tenant_admin.py:359 ? list_users

```python
def list_users(scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.read")
    return _directory(session, current.tenant_id)
```

### backend/app/tenant_admin.py:366 ? list_service_departments

```python
def list_service_departments(scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.read")
    return {"serviceDepartments": _service_departments(session, current.tenant_id)}
```

### backend/app/tenant_admin.py:373 ? create_service_department

```python
def create_service_department(input: ServiceDepartmentCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    if not _rows(session, "SELECT id FROM branches WHERE id=:branch_id AND tenant_id=:tenant_id", {"branch_id": str(input.branch_id), "tenant_id": str(current.tenant_id)}):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": "BRANCH_NOT_IN_TENANT"})
    try:
        name = _clean(input.name)
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    exists = session.execute(text("SELECT 1 FROM service_departments WHERE tenant_id=:tenant_id AND branch_id=:branch_id AND lower(name)=lower(:name)"), {"tenant_id": str(current.tenant_id), "branch_id": str(input.branch_id), "name": name}).scalar()
    if exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "DEPARTMENT_NAME_CONFLICT"})
    department_id = uuid4()
    session.execute(text("INSERT INTO service_departments (id,tenant_id,branch_id,name,created_by,updated_by) VALUES (:id,:tenant_id,:branch_id,:name,:actor_id,:actor_id)"), {"id": str(department_id), "tenant_id": str(current.tenant_id), "branch_id": str(input.branch_id), "name": name, "actor_id": str(current.actor_id)})
    payload = next(item for item in _service_departments(session, current.tenant_id) if item["id"] == str(department_id))
    _audit(session, current, "SERVICE_DEPARTMENT_CREATED", name, {}, payload)
    return {"serviceDepartment": payload}
```

### backend/app/tenant_admin.py:393 ? update_service_department

```python
def update_service_department(department_id: UUID, input: ServiceDepartmentUpdate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    rows = _rows(session, "SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id", {"id": str(department_id), "tenant_id": str(current.tenant_id)})
    if len(rows) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "SERVICE_DEPARTMENT_NOT_FOUND"})
    try:
        name = _clean(input.name)
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    duplicate = session.execute(text("""
        SELECT 1 FROM service_departments WHERE tenant_id=:tenant_id AND branch_id=:branch_id
          AND lower(name)=lower(:name) AND id<>:id
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(rows[0]["branch_id"]), "name": name, "id": str(department_id)}).scalar()
    if duplicate:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "DEPARTMENT_NAME_CONFLICT"})
    session.execute(text("""
        UPDATE service_departments SET name=:name, status=:status, updated_by=:actor_id, updated_at=now() WHERE id=:id
    """), {"name": name, "status": input.status, "actor_id": str(current.actor_id), "id": str(department_id)})
    payload = next(item for item in _service_departments(session, current.tenant_id) if item["id"] == str(department_id))
    _audit(session, current, "SERVICE_DEPARTMENT_UPDATED", "Service department updated", {"name": rows[0]["name"], "status": rows[0]["status"]}, payload)
    return {"serviceDepartment": payload}
```

### backend/app/tenant_admin.py:418 ? appoint_service_department_manager

```python
def appoint_service_department_manager(department_id: UUID, membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    department = _rows(session, "SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id AND status='ACTIVE'", {"id": str(department_id), "tenant_id": str(current.tenant_id)})
    if len(department) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "SERVICE_DEPARTMENT_NOT_FOUND"})
    _active_branch_member(session, current.tenant_id, membership_id, UUID(str(department[0]["branch_id"])), "service_manager")
    session.execute(text("""
        INSERT INTO service_department_managers (tenant_id,branch_id,department_id,manager_membership_id,appointed_by)
        VALUES (:tenant_id,:branch_id,:department_id,:membership_id,:actor_id) ON CONFLICT DO NOTHING
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(department[0]["branch_id"]), "department_id": str(department_id), "membership_id": str(membership_id), "actor_id": str(current.actor_id)})
    payload = next(item for item in _service_departments(session, current.tenant_id) if item["id"] == str(department_id))
    _audit(session, current, "SERVICE_MANAGER_APPOINTED", "Service department manager appointed", {}, {"departmentId": str(department_id), "membershipId": str(membership_id)})
    return {"serviceDepartment": payload}
```

### backend/app/tenant_admin.py:435 ? remove_service_department_manager

```python
def remove_service_department_manager(department_id: UUID, membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    department = _rows(session, "SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id", {"id": str(department_id), "tenant_id": str(current.tenant_id)})
    if len(department) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "SERVICE_DEPARTMENT_NOT_FOUND"})
    removed = session.execute(text("DELETE FROM service_department_managers WHERE tenant_id=:tenant_id AND department_id=:department_id AND manager_membership_id=:membership_id"), {"tenant_id": str(current.tenant_id), "department_id": str(department_id), "membership_id": str(membership_id)}).rowcount
    if not removed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "MANAGER_NOT_APPOINTED"})
    session.execute(text("DELETE FROM service_advisor_teams WHERE tenant_id=:tenant_id AND department_id=:department_id AND manager_membership_id=:membership_id"), {"tenant_id": str(current.tenant_id), "department_id": str(department_id), "membership_id": str(membership_id)})
    payload = next(item for item in _service_departments(session, current.tenant_id) if item["id"] == str(department_id))
    _audit(session, current, "SERVICE_MANAGER_REMOVED", "Service department manager removed", {}, {"departmentId": str(department_id), "membershipId": str(membership_id)})
    return {"serviceDepartment": payload}
```

### backend/app/tenant_admin.py:451 ? assign_service_advisor_team

```python
def assign_service_advisor_team(department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    department = _rows(session, "SELECT * FROM service_departments WHERE id=:id AND tenant_id=:tenant_id AND status='ACTIVE'", {"id": str(department_id), "tenant_id": str(current.tenant_id)})
    if len(department) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "SERVICE_DEPARTMENT_NOT_FOUND"})
    branch_id = UUID(str(department[0]["branch_id"]))
    appointed = session.execute(text("SELECT 1 FROM service_department_managers WHERE department_id=:department_id AND manager_membership_id=:membership_id"), {"department_id": str(department_id), "membership_id": str(manager_membership_id)}).scalar()
    if not appointed:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": "MANAGER_NOT_APPOINTED"})
    _active_branch_member(session, current.tenant_id, advisor_membership_id, branch_id, "service")
    session.execute(text("""
        INSERT INTO service_advisor_teams (tenant_id,branch_id,department_id,manager_membership_id,advisor_membership_id,assigned_by)
        VALUES (:tenant_id,:branch_id,:department_id,:manager_membership_id,:advisor_membership_id,:actor_id)
        ON CONFLICT (tenant_id,branch_id,advisor_membership_id) DO UPDATE
        SET department_id=EXCLUDED.department_id, manager_membership_id=EXCLUDED.manager_membership_id,
            assigned_by=EXCLUDED.assigned_by, assigned_at=now()
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "department_id": str(department_id), "manager_membership_id": str(manager_membership_id), "advisor_membership_id": str(advisor_membership_id), "actor_id": str(current.actor_id)})
    payload = next(item for item in _service_departments(session, current.tenant_id) if item["id"] == str(department_id))
    _audit(session, current, "SERVICE_ADVISOR_TEAM_ASSIGNED", "Advisor assigned to manager team", {}, {"departmentId": str(department_id), "managerMembershipId": str(manager_membership_id), "advisorMembershipId": str(advisor_membership_id)})
    return {"serviceDepartment": payload}
```

### backend/app/tenant_admin.py:475 ? remove_service_advisor_team

```python
def remove_service_advisor_team(department_id: UUID, manager_membership_id: UUID, advisor_membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    department = _rows(session, "SELECT id FROM service_departments WHERE id=:id AND tenant_id=:tenant_id", {"id": str(department_id), "tenant_id": str(current.tenant_id)})
    if len(department) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "SERVICE_DEPARTMENT_NOT_FOUND"})
    removed = session.execute(text("DELETE FROM service_advisor_teams WHERE tenant_id=:tenant_id AND department_id=:department_id AND manager_membership_id=:manager_membership_id AND advisor_membership_id=:advisor_membership_id"), {"tenant_id": str(current.tenant_id), "department_id": str(department_id), "manager_membership_id": str(manager_membership_id), "advisor_membership_id": str(advisor_membership_id)}).rowcount
    if not removed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "ADVISOR_TEAM_NOT_FOUND"})
    payload = next(item for item in _service_departments(session, current.tenant_id) if item["id"] == str(department_id))
    _audit(session, current, "SERVICE_ADVISOR_TEAM_REMOVED", "Advisor removed from manager team", {}, {"departmentId": str(department_id), "managerMembershipId": str(manager_membership_id), "advisorMembershipId": str(advisor_membership_id)})
    return {"serviceDepartment": payload}
```

### backend/app/tenant_admin.py:490 ? create_user

```python
def create_user(input: UserCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    try:
        role_ids, branch_ids = validate_assignment(input.role_ids, input.branch_ids)
        name, email = _clean(input.name), _clean(input.email).lower()
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    _assert_assignments_belong_to_tenant(session, current.tenant_id, role_ids, branch_ids)
    existing = _rows(session, "SELECT id FROM platform_users WHERE lower(email) = :email", {"email": email})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "EMAIL_ALREADY_REGISTERED"})
    user_id, membership_id, invitation_id = uuid4(), uuid4(), uuid4()
    session.execute(text("INSERT INTO platform_users (id, cognito_subject, display_name, email) VALUES (:id, NULL, :name, :email)"), {"id": str(user_id), "name": name, "email": email})
    session.execute(text("INSERT INTO tenant_memberships (id, tenant_id, user_id, status) VALUES (:id, :tenant_id, :user_id, 'INVITED')"), {"id": str(membership_id), "tenant_id": str(current.tenant_id), "user_id": str(user_id)})
    _replace_assignments(session, current.tenant_id, membership_id, role_ids, branch_ids)
    session.execute(text("INSERT INTO tenant_admin_invitations (id, tenant_id, membership_id, email, status, last_sent_at) VALUES (:id, :tenant_id, :membership_id, :email, 'PENDING', now())"), {"id": str(invitation_id), "tenant_id": str(current.tenant_id), "membership_id": str(membership_id), "email": email})
    row = _membership_or_404(session, current.tenant_id, membership_id)
    payload = _user_payload(session, current.tenant_id, row)
    _audit(session, current, "TENANT_USER_INVITED", "Tenant user invited", {}, {"membershipId": payload["id"], "roleIds": payload["roleIds"], "branchIds": payload["branchIds"]})
    return {"user": payload}
```

### backend/app/tenant_admin.py:514 ? update_user

```python
def update_user(membership_id: UUID, input: UserUpdate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    try:
        role_ids, branch_ids = validate_assignment(input.role_ids, input.branch_ids)
        name = _clean(input.name)
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    _assert_assignments_belong_to_tenant(session, current.tenant_id, role_ids, branch_ids)
    before = _membership_or_404(session, current.tenant_id, membership_id)
    updated = session.execute(text("""
        UPDATE tenant_memberships SET version = version + 1, updated_at = now()
        WHERE id = :membership_id AND tenant_id = :tenant_id AND version = :version
    """), {"membership_id": str(membership_id), "tenant_id": str(current.tenant_id), "version": input.version})
    if updated.rowcount != 1:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "VERSION_CONFLICT"})
    session.execute(text("UPDATE platform_users SET display_name = :name, updated_at = now() WHERE id = :user_id"), {"name": name, "user_id": str(before["user_id"])})
    _replace_assignments(session, current.tenant_id, membership_id, role_ids, branch_ids)
    _assert_manager_remains(session, current.tenant_id)
    row = _membership_or_404(session, current.tenant_id, membership_id)
    payload = _user_payload(session, current.tenant_id, row)
    _audit(session, current, "TENANT_USER_UPDATED", "Tenant user assignments updated", {"membershipId": str(membership_id), "version": before["version"]}, {"roleIds": payload["roleIds"], "branchIds": payload["branchIds"], "version": payload["version"]})
    return {"user": payload}
```

### backend/app/tenant_admin.py:540 ? archive_user

```python
def archive_user(membership_id: UUID, input: ArchiveUser, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    before = _membership_or_404(session, current.tenant_id, membership_id)
    try:
        require_distinct_membership(current.actor_id, UUID(str(before["user_id"])))
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    if before["status"] == "ARCHIVED":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "USER_ALREADY_ARCHIVED"})
    session.execute(text("UPDATE tenant_memberships SET status = 'ARCHIVED', version = version + 1, updated_at = now() WHERE id = :membership_id AND tenant_id = :tenant_id"), {"membership_id": str(membership_id), "tenant_id": str(current.tenant_id)})
    session.execute(text("UPDATE platform_users SET active_membership_id = NULL, updated_at = now() WHERE id = :user_id AND active_membership_id = :membership_id"), {"user_id": str(before["user_id"]), "membership_id": str(membership_id)})
    _assert_manager_remains(session, current.tenant_id)
    row = _membership_or_404(session, current.tenant_id, membership_id)
    payload = _user_payload(session, current.tenant_id, row)
    _audit(session, current, "TENANT_USER_ARCHIVED", input.reason.strip(), {"membershipId": str(membership_id), "status": before["status"]}, {"status": "ARCHIVED"})
    return {"user": payload}
```

### backend/app/tenant_admin.py:560 ? resend_invite

```python
def resend_invite(membership_id: UUID, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    before = _membership_or_404(session, current.tenant_id, membership_id)
    if before["status"] != "INVITED":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "INVITATION_NOT_PENDING"})
    result = session.execute(text("UPDATE tenant_admin_invitations SET last_sent_at = now() WHERE membership_id = :membership_id AND tenant_id = :tenant_id AND status = 'PENDING'"), {"membership_id": str(membership_id), "tenant_id": str(current.tenant_id)})
    if result.rowcount != 1:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "INVITATION_NOT_PENDING"})
    row = _membership_or_404(session, current.tenant_id, membership_id)
    payload = _user_payload(session, current.tenant_id, row)
    _audit(session, current, "TENANT_USER_INVITATION_RESENT", "Tenant user invitation resent", {"membershipId": str(membership_id)}, {"lastInvitedAt": payload["lastInvitedAt"]})
    return {"user": payload}
```

### backend/app/tenant_admin.py:576 ? list_roles

```python
def list_roles(scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.read")
    return {"roles": _roles(session, current.tenant_id)}
```

### backend/app/tenant_admin.py:583 ? create_role

```python
def create_role(input: RoleCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    try:
        name, description, permissions = _clean(input.name), input.description.strip(), validate_permissions(input.permissions)
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    if _rows(session, "SELECT id FROM tenant_roles WHERE tenant_id = :tenant_id AND name = :name", {"tenant_id": str(current.tenant_id), "name": name}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "ROLE_NAME_CONFLICT"})
    role_id = uuid4()
    session.execute(text("INSERT INTO tenant_roles (id, tenant_id, name, description) VALUES (:id, :tenant_id, :name, :description)"), {"id": str(role_id), "tenant_id": str(current.tenant_id), "name": name, "description": description})
    for permission in permissions:
        session.execute(text("INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)"), {"role_id": str(role_id), "permission": permission})
    role = next(role for role in _roles(session, current.tenant_id) if role["id"] == str(role_id))
    _audit(session, current, "TENANT_ROLE_CREATED", "Tenant role created", {}, {"roleId": role["id"], "permissions": role["permissions"]})
    return {"role": role}
```

### backend/app/tenant_admin.py:602 ? update_role

```python
def update_role(role_id: UUID, input: RoleUpdate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    try:
        name, description, permissions = _clean(input.name), input.description.strip(), validate_permissions(input.permissions)
    except AssignmentError as error:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    rows = _rows(session, "SELECT id, system_key, version FROM tenant_roles WHERE id = :role_id AND tenant_id = :tenant_id", {"role_id": str(role_id), "tenant_id": str(current.tenant_id)})
    if len(rows) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "ROLE_NOT_FOUND"})
    if rows[0]["system_key"] == "admin":
        try:
            require_owner_permissions(permissions)
        except AssignmentError as error:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    if rows[0]["system_key"] == "service_manager":
        try:
            require_service_manager_permissions(permissions)
        except AssignmentError as error:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": str(error)}) from error
    changed = session.execute(text("""
        UPDATE tenant_roles SET name = :name, description = :description, version = version + 1, updated_at = now()
        WHERE id = :role_id AND tenant_id = :tenant_id AND version = :version
    """), {"name": name, "description": description, "role_id": str(role_id), "tenant_id": str(current.tenant_id), "version": input.version})
    if changed.rowcount != 1:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "VERSION_CONFLICT"})
    session.execute(text("DELETE FROM role_permissions WHERE role_id = :role_id"), {"role_id": str(role_id)})
    for permission in permissions:
        session.execute(text("INSERT INTO role_permissions (role_id, permission) VALUES (:role_id, :permission)"), {"role_id": str(role_id), "permission": permission})
    _assert_manager_remains(session, current.tenant_id)
    role = next(role for role in _roles(session, current.tenant_id) if role["id"] == str(role_id))
    _audit(session, current, "TENANT_ROLE_UPDATED", "Tenant role permissions updated", {"roleId": str(role_id)}, {"permissions": role["permissions"], "version": role["version"]})
    return {"role": role}
```

### backend/app/tenant_admin.py:638 ? archive_role

```python
def archive_role(role_id: UUID, input: ArchiveUser, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _require(scope, "tenant.users.manage", mutation=True)
    rows = _rows(session, "SELECT id, name, system_key, status FROM tenant_roles WHERE id = :role_id AND tenant_id = :tenant_id", {"role_id": str(role_id), "tenant_id": str(current.tenant_id)})
    if len(rows) != 1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "ROLE_NOT_FOUND"})
    role = rows[0]
    if role["system_key"] in ("admin", "service_manager"):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "SYSTEM_ROLE_PROTECTED"})
    if role["status"] == "ARCHIVED":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "ROLE_ALREADY_ARCHIVED"})
    assigned = session.execute(text("SELECT count(*) FROM membership_roles WHERE role_id = :role_id AND tenant_id = :tenant_id"), {"role_id": str(role_id), "tenant_id": str(current.tenant_id)}).scalar_one()
    if assigned:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "ROLE_IN_USE"})
    session.execute(text("UPDATE tenant_roles SET status = 'ARCHIVED', version = version + 1, updated_at = now() WHERE id = :role_id AND tenant_id = :tenant_id"), {"role_id": str(role_id), "tenant_id": str(current.tenant_id)})
    archived = next(item for item in _roles(session, current.tenant_id) if item["id"] == str(role_id))
    _audit(session, current, "TENANT_ROLE_ARCHIVED", input.reason.strip(), {"roleId": str(role_id), "name": role["name"]}, {"status": "ARCHIVED"})
    return {"role": archived}
```

## Migration SQL and declared tables

### 20260929_0002_tenant_session.py

Declared CREATE TABLE names: tenants, branches, platform_users, tenant_memberships, membership_branches, tenant_roles, membership_roles, role_permissions, tenant_settings, branch_settings

```python
"""Create the authenticated Tenant and Branch security boundary.

Revision ID: 20260929_0002
Revises: 20260929_0001
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0002"
down_revision = "20260929_0001"
branch_labels = None
depends_on = None


TENANT_RLS = """
    tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid
"""

BRANCH_RLS = f"""
    ({TENANT_RLS})
    AND branch_id = ANY(
        COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
    )
"""


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'workshopos_runtime') THEN
                CREATE ROLE workshopos_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
            END IF;
        END $$;
        ALTER ROLE workshopos_runtime NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
        GRANT workshopos_runtime TO CURRENT_USER;
        """
    )
    op.execute(
        """
        CREATE TABLE tenants (
            id uuid PRIMARY KEY,
            name text NOT NULL,
            lifecycle_state text NOT NULL CHECK (lifecycle_state IN ('trial', 'active', 'payment_due', 'suspended', 'closed')),
            created_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE branches (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            name text NOT NULL,
            is_primary boolean NOT NULL DEFAULT false,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, id),
            UNIQUE NULLS NOT DISTINCT (tenant_id, name)
        );
        CREATE UNIQUE INDEX branches_one_primary_per_tenant ON branches (tenant_id) WHERE is_primary;

        CREATE TABLE platform_users (
            id uuid PRIMARY KEY,
            cognito_subject text NOT NULL UNIQUE,
            display_name text NOT NULL,
            email text NOT NULL,
            status text NOT NULL CHECK (status IN ('ACTIVE', 'ARCHIVED')) DEFAULT 'ACTIVE',
            active_membership_id uuid,
            created_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE tenant_memberships (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            user_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            status text NOT NULL CHECK (status IN ('INVITED', 'ACTIVE', 'ARCHIVED')) DEFAULT 'INVITED',
            version integer NOT NULL DEFAULT 1 CHECK (version > 0),
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, user_id),
            UNIQUE (tenant_id, id)
        );
        ALTER TABLE platform_users
            ADD CONSTRAINT platform_users_active_membership_fk
            FOREIGN KEY (active_membership_id) REFERENCES tenant_memberships(id) ON DELETE SET NULL;
        CREATE TABLE membership_branches (
            membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE CASCADE,
            branch_id uuid NOT NULL,
            tenant_id uuid NOT NULL,
            PRIMARY KEY (membership_id, branch_id),
            FOREIGN KEY (tenant_id, membership_id) REFERENCES tenant_memberships(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE tenant_roles (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            name text NOT NULL,
            status text NOT NULL CHECK (status IN ('ACTIVE', 'ARCHIVED')) DEFAULT 'ACTIVE',
            version integer NOT NULL DEFAULT 1 CHECK (version > 0),
            UNIQUE (tenant_id, name),
            UNIQUE (tenant_id, id)
        );
        CREATE TABLE membership_roles (
            membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE CASCADE,
            role_id uuid NOT NULL REFERENCES tenant_roles(id) ON DELETE RESTRICT,
            tenant_id uuid NOT NULL,
            PRIMARY KEY (membership_id, role_id),
            FOREIGN KEY (tenant_id, membership_id) REFERENCES tenant_memberships(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, role_id) REFERENCES tenant_roles(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE role_permissions (
            role_id uuid NOT NULL REFERENCES tenant_roles(id) ON DELETE CASCADE,
            permission text NOT NULL,
            PRIMARY KEY (role_id, permission)
        );
        """
    )
    # These are the first tenant-owned settings records.  Their policies are
    # templates for every later operational table: explicit tenant ownership,
    # branch composite integrity, and fail-closed transaction-local scope.
    op.execute(
        """
        CREATE TABLE tenant_settings (
            tenant_id uuid PRIMARY KEY REFERENCES tenants(id) ON DELETE RESTRICT,
            settings jsonb NOT NULL DEFAULT '{}'::jsonb,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE branch_settings (
            tenant_id uuid NOT NULL,
            branch_id uuid NOT NULL,
            settings jsonb NOT NULL DEFAULT '{}'::jsonb,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_at timestamptz NOT NULL DEFAULT now(),
            PRIMARY KEY (tenant_id, branch_id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        """
    )
    for table, predicate in (("tenant_settings", TENANT_RLS), ("branch_settings", BRANCH_RLS)):
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
        op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
        op.execute(f"CREATE POLICY {table}_tenant_scope ON {table} USING ({predicate}) WITH CHECK ({predicate})")
    op.execute("CREATE INDEX branch_settings_scope_idx ON branch_settings (tenant_id, branch_id)")
    op.execute(
        """
        GRANT USAGE ON SCHEMA public TO workshopos_runtime;
        GRANT SELECT, INSERT, UPDATE ON tenant_settings, branch_settings TO workshopos_runtime;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS branch_settings;
        DROP TABLE IF EXISTS tenant_settings;
        DROP TABLE IF EXISTS role_permissions;
        DROP TABLE IF EXISTS membership_roles;
        DROP TABLE IF EXISTS tenant_roles;
        DROP TABLE IF EXISTS membership_branches;
        ALTER TABLE IF EXISTS platform_users DROP CONSTRAINT IF EXISTS platform_users_active_membership_fk;
        DROP TABLE IF EXISTS tenant_memberships;
        DROP TABLE IF EXISTS platform_users;
        DROP TABLE IF EXISTS branches;
        DROP TABLE IF EXISTS tenants;
        """
    )
    op.execute("REVOKE workshopos_runtime FROM CURRENT_USER")
    op.execute("DROP ROLE IF EXISTS workshopos_runtime")

```
### 20260929_0003_superadmin.py

Declared CREATE TABLE names: superadmins, platform_billing, tenant_admin_invitations, support_emulations, tenant_audit_events

```python
"""Add the Superadmin control plane and read-only support emulation.

Revision ID: 20260929_0003
Revises: 20260929_0002
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0003"
down_revision = "20260929_0002"
branch_labels = None
depends_on = None


TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
WRITABLE_TENANT_RLS = f"({TENANT_RLS}) AND COALESCE(NULLIF(current_setting('workshopos.read_only', true), ''), 'false') <> 'true'"
BRANCH_RLS = f"({TENANT_RLS}) AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[])"
WRITABLE_BRANCH_RLS = f"({BRANCH_RLS}) AND COALESCE(NULLIF(current_setting('workshopos.read_only', true), ''), 'false') <> 'true'"


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE platform_users ALTER COLUMN cognito_subject DROP NOT NULL;
        CREATE TABLE superadmins (
            user_id uuid PRIMARY KEY REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE platform_billing (
            tenant_id uuid PRIMARY KEY REFERENCES tenants(id) ON DELETE RESTRICT,
            plan text NOT NULL,
            agreed_price numeric(12,2) NOT NULL CHECK (agreed_price >= 0),
            currency char(3) NOT NULL,
            billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'quarterly', 'annual')),
            renewal_date date NOT NULL,
            due_date date NOT NULL,
            payment_status text NOT NULL CHECK (payment_status IN ('pending', 'paid', 'overdue', 'waived')),
            internal_notes text NOT NULL DEFAULT '',
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE tenant_admin_invitations (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE RESTRICT,
            email text NOT NULL,
            status text NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'CANCELLED')) DEFAULT 'PENDING',
            created_at timestamptz NOT NULL DEFAULT now(),
            accepted_at timestamptz,
            UNIQUE (membership_id)
        );
        CREATE UNIQUE INDEX tenant_admin_invitations_pending_email
            ON tenant_admin_invitations (tenant_id, email) WHERE status = 'PENDING';
        CREATE TABLE support_emulations (
            id uuid PRIMARY KEY,
            superadmin_id uuid NOT NULL REFERENCES superadmins(user_id) ON DELETE RESTRICT,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            status text NOT NULL CHECK (status IN ('ACTIVE', 'ENDED')) DEFAULT 'ACTIVE',
            reason text NOT NULL,
            started_at timestamptz NOT NULL DEFAULT now(),
            ended_at timestamptz,
            ended_reason text
        );
        CREATE UNIQUE INDEX support_emulations_one_active_per_actor_tenant
            ON support_emulations (superadmin_id, tenant_id) WHERE status = 'ACTIVE';
        CREATE TABLE tenant_audit_events (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            action text NOT NULL,
            reason text NOT NULL,
            before_value jsonb NOT NULL DEFAULT '{}'::jsonb,
            after_value jsonb NOT NULL DEFAULT '{}'::jsonb,
            created_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE INDEX tenant_audit_events_tenant_created_idx ON tenant_audit_events (tenant_id, created_at DESC);
        """
    )
    for table, readable, writable in (("tenant_settings", TENANT_RLS, WRITABLE_TENANT_RLS), ("branch_settings", BRANCH_RLS, WRITABLE_BRANCH_RLS)):
        op.execute(f"DROP POLICY {table}_tenant_scope ON {table}")
        op.execute(f"CREATE POLICY {table}_tenant_scope ON {table} USING ({readable}) WITH CHECK ({writable})")


def downgrade() -> None:
    for table, predicate in (("tenant_settings", TENANT_RLS), ("branch_settings", BRANCH_RLS)):
        op.execute(f"DROP POLICY IF EXISTS {table}_tenant_scope ON {table}")
        op.execute(f"CREATE POLICY {table}_tenant_scope ON {table} USING ({predicate}) WITH CHECK ({predicate})")
    op.execute(
        """
        DROP TABLE IF EXISTS tenant_audit_events;
        DROP TABLE IF EXISTS support_emulations;
        DROP TABLE IF EXISTS tenant_admin_invitations;
        DROP TABLE IF EXISTS platform_billing;
        DROP TABLE IF EXISTS superadmins;
        ALTER TABLE platform_users ALTER COLUMN cognito_subject SET NOT NULL;
        """
    )

```
### 20260929_0004_tenant_administration.py

Declared CREATE TABLE names: 

```python
"""Add tenant-admin directory metadata and RLS policies.

Revision ID: 20260929_0004
Revises: 20260929_0003
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0004"
down_revision = "20260929_0003"
branch_labels = None
depends_on = None


TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
ROLE_RLS = "EXISTS (SELECT 1 FROM tenant_roles AS r WHERE r.id = role_id AND r.tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid)"


def _rls(table: str, predicate: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_tenant_scope ON {table} USING ({predicate}) WITH CHECK ({predicate})")


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE platform_users ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
        ALTER TABLE tenant_memberships ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
        ALTER TABLE tenant_roles ADD COLUMN description text NOT NULL DEFAULT '';
        ALTER TABLE tenant_roles ADD COLUMN system_key text;
        ALTER TABLE tenant_roles ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
        ALTER TABLE tenant_roles ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
        CREATE UNIQUE INDEX tenant_roles_system_key_unique ON tenant_roles (tenant_id, system_key) WHERE system_key IS NOT NULL;
        ALTER TABLE tenant_admin_invitations ADD COLUMN last_sent_at timestamptz;
        """
    )
    for table, predicate in (
        ("tenant_memberships", TENANT_RLS),
        ("membership_branches", TENANT_RLS),
        ("branches", TENANT_RLS),
        ("tenant_roles", TENANT_RLS),
        ("membership_roles", TENANT_RLS),
        ("role_permissions", ROLE_RLS),
        ("tenant_audit_events", TENANT_RLS),
    ):
        _rls(table, predicate)
    op.execute(
        """
        ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;
        CREATE POLICY platform_users_tenant_read ON platform_users FOR SELECT
            USING (EXISTS (SELECT 1 FROM tenant_memberships AS m WHERE m.user_id = id AND m.tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid));
        CREATE POLICY platform_users_tenant_insert ON platform_users FOR INSERT WITH CHECK (true);
        CREATE POLICY platform_users_tenant_update ON platform_users FOR UPDATE
            USING (EXISTS (SELECT 1 FROM tenant_memberships AS m WHERE m.user_id = id AND m.tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid)) WITH CHECK (true);
        """
    )
    op.execute(
        """
        GRANT SELECT ON branches TO workshopos_runtime;
        GRANT SELECT, INSERT, UPDATE ON platform_users TO workshopos_runtime;
        GRANT SELECT, INSERT, UPDATE, DELETE ON tenant_memberships, membership_branches,
            tenant_roles, membership_roles, role_permissions, tenant_audit_events TO workshopos_runtime;
        """
    )


def downgrade() -> None:
    op.execute("DROP POLICY IF EXISTS platform_users_tenant_update ON platform_users")
    op.execute("DROP POLICY IF EXISTS platform_users_tenant_insert ON platform_users")
    op.execute("DROP POLICY IF EXISTS platform_users_tenant_read ON platform_users")
    op.execute("ALTER TABLE platform_users DISABLE ROW LEVEL SECURITY")
    for table in ("tenant_audit_events", "role_permissions", "membership_roles", "tenant_roles", "branches", "membership_branches", "tenant_memberships"):
        op.execute(f"DROP POLICY IF EXISTS {table}_tenant_scope ON {table}")
        op.execute(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY")
    op.execute(
        """
        REVOKE SELECT ON branches FROM workshopos_runtime;
        REVOKE SELECT, INSERT, UPDATE ON platform_users FROM workshopos_runtime;
        REVOKE SELECT, INSERT, UPDATE, DELETE ON tenant_memberships, membership_branches,
            tenant_roles, membership_roles, role_permissions, tenant_audit_events FROM workshopos_runtime;
        ALTER TABLE tenant_admin_invitations DROP COLUMN last_sent_at;
        DROP INDEX tenant_roles_system_key_unique;
        ALTER TABLE tenant_roles DROP COLUMN updated_at;
        ALTER TABLE tenant_roles DROP COLUMN created_at;
        ALTER TABLE tenant_roles DROP COLUMN system_key;
        ALTER TABLE tenant_roles DROP COLUMN description;
        ALTER TABLE tenant_memberships DROP COLUMN updated_at;
        ALTER TABLE platform_users DROP COLUMN updated_at;
        """
    )

```
### 20260929_0005_intake.py

Declared CREATE TABLE names: customers, vehicles, visits

```python
"""Create tenant and branch scoped customer, vehicle, and visit intake records.

Revision ID: 20260929_0005
Revises: 20260929_0004
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0005"
down_revision = "20260929_0004"
branch_labels = None
depends_on = None


TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped_table(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE customers (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            name text NOT NULL CHECK (btrim(name) <> ''),
            mobile text NOT NULL CHECK (btrim(mobile) <> ''),
            type text NOT NULL DEFAULT 'Individual' CHECK (btrim(type) <> ''),
            address text NOT NULL DEFAULT '',
            archived_at timestamptz,
            archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX customers_active_mobile_per_branch
            ON customers (tenant_id, branch_id, lower(mobile)) WHERE archived_at IS NULL;
        CREATE INDEX customers_scope_search_idx
            ON customers (tenant_id, branch_id, archived_at, lower(name), lower(mobile));

        CREATE TABLE vehicles (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            customer_id bigint NOT NULL,
            number text NOT NULL CHECK (btrim(number) <> ''),
            make text NOT NULL CHECK (btrim(make) <> ''),
            model text NOT NULL CHECK (btrim(model) <> ''),
            color text NOT NULL DEFAULT '',
            km integer NOT NULL DEFAULT 0 CHECK (km >= 0),
            engine_no text NOT NULL DEFAULT '',
            archived_at timestamptz,
            archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES customers(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX vehicles_active_number_per_branch
            ON vehicles (tenant_id, branch_id, upper(number)) WHERE archived_at IS NULL;
        CREATE INDEX vehicles_scope_search_idx
            ON vehicles (tenant_id, branch_id, archived_at, upper(number), lower(make), lower(model));

        CREATE TABLE visits (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            customer_id bigint NOT NULL,
            vehicle_id bigint NOT NULL,
            advisor_id uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            received_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            received_at timestamptz NOT NULL DEFAULT now(),
            fuel text NOT NULL CHECK (btrim(fuel) <> ''),
            odo_reading integer NOT NULL CHECK (odo_reading >= 0),
            fuel_level_value text NOT NULL DEFAULT '',
            fuel_level_unit text NOT NULL DEFAULT '',
            keys text NOT NULL DEFAULT '',
            accessories text NOT NULL DEFAULT '',
            requested_work text NOT NULL CHECK (btrim(requested_work) <> ''),
            photos_note text NOT NULL DEFAULT '',
            archived_at timestamptz,
            archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, customer_id) REFERENCES customers(tenant_id, branch_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, vehicle_id) REFERENCES vehicles(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX visits_scope_search_idx ON visits (tenant_id, branch_id, archived_at, received_at DESC);
        """
    )
    for table in ("customers", "vehicles", "visits"):
        _scoped_table(table)
    op.execute("GRANT SELECT, INSERT, UPDATE ON customers, vehicles, visits TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON customers, vehicles, visits FROM workshopos_runtime")
    op.execute("DROP TABLE IF EXISTS visits")
    op.execute("DROP TABLE IF EXISTS vehicles")
    op.execute("DROP TABLE IF EXISTS customers")

```
### 20260929_0006_jobs_estimates.py

Declared CREATE TABLE names: job_cards, estimates, estimate_lines, estimate_decisions, job_events

```python
"""Create RLS-backed job cards, estimates, decisions, and command evidence.

Revision ID: 20260929_0006
Revises: 20260929_0005
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0006"
down_revision = "20260929_0005"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped_table(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE job_cards (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_no text NOT NULL,
            visit_id bigint NOT NULL REFERENCES visits(id) ON DELETE RESTRICT,
            advisor_id uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            status text NOT NULL CHECK (status IN ('NEW','IN_PROGRESS','HOLD','COMPLETED','CANCELLED','CLOSED')),
            work_list text NOT NULL DEFAULT '',
            promised_at timestamptz,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, job_no), UNIQUE (visit_id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX job_cards_scope_idx ON job_cards (tenant_id, branch_id, status, created_at DESC);

        CREATE TABLE estimates (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            revision integer NOT NULL CHECK (revision > 0),
            status text NOT NULL CHECK (status IN ('DRAFT','APPROVED','DECLINED')),
            discount numeric(14,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
            gst_rate numeric(5,2) NOT NULL DEFAULT 18 CHECK (gst_rate >= 0 AND gst_rate <= 100),
            note text NOT NULL DEFAULT '',
            approved_snapshot jsonb,
            superseded_at timestamptz,
            superseded_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (job_card_id, revision),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX estimates_one_current_per_job ON estimates (job_card_id) WHERE superseded_at IS NULL;

        CREATE TABLE estimate_lines (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            estimate_id bigint NOT NULL REFERENCES estimates(id) ON DELETE RESTRICT,
            line_no integer NOT NULL CHECK (line_no > 0),
            kind text NOT NULL CHECK (btrim(kind) <> ''),
            description text NOT NULL CHECK (btrim(description) <> ''),
            quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
            rate numeric(14,2) NOT NULL CHECK (rate >= 0),
            gst_rate numeric(5,2) NOT NULL CHECK (gst_rate >= 0 AND gst_rate <= 100),
            UNIQUE (estimate_id, line_no),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );

        CREATE TABLE estimate_decisions (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            estimate_id bigint NOT NULL REFERENCES estimates(id) ON DELETE RESTRICT,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            outcome text NOT NULL CHECK (outcome IN ('approved','declined')),
            channel text NOT NULL CHECK (channel IN ('in_person','phone','whatsapp','email','other')),
            decided_at timestamptz NOT NULL,
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            note text NOT NULL DEFAULT '',
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (estimate_id)
        );

        CREATE TABLE job_events (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            command text NOT NULL,
            from_status text NOT NULL,
            to_status text NOT NULL,
            reason text NOT NULL DEFAULT '',
            request_key text,
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX job_events_idempotency_key ON job_events (tenant_id, job_card_id, request_key) WHERE request_key IS NOT NULL;

        CREATE FUNCTION protect_approved_estimate_lines() RETURNS trigger LANGUAGE plpgsql AS $$
        DECLARE protected_estimate_id bigint;
        BEGIN
            protected_estimate_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.estimate_id ELSE NEW.estimate_id END;
            IF EXISTS (SELECT 1 FROM estimates WHERE id = protected_estimate_id AND status <> 'DRAFT') THEN
                RAISE EXCEPTION 'approved_or_decided_estimate_is_immutable';
            END IF;
            IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
            RETURN NEW;
        END $$;
        CREATE TRIGGER estimate_lines_immutable BEFORE INSERT OR UPDATE OR DELETE ON estimate_lines
            FOR EACH ROW EXECUTE FUNCTION protect_approved_estimate_lines();
        CREATE FUNCTION protect_approved_estimate() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
            IF OLD.status = 'APPROVED' AND (
                NEW.status IS DISTINCT FROM OLD.status OR NEW.discount IS DISTINCT FROM OLD.discount
                OR NEW.gst_rate IS DISTINCT FROM OLD.gst_rate OR NEW.note IS DISTINCT FROM OLD.note
                OR NEW.approved_snapshot IS DISTINCT FROM OLD.approved_snapshot
            ) THEN
                RAISE EXCEPTION 'approved_estimate_is_immutable';
            END IF;
            RETURN NEW;
        END $$;
        CREATE TRIGGER estimates_approved_immutable BEFORE UPDATE ON estimates
            FOR EACH ROW EXECUTE FUNCTION protect_approved_estimate();
    """)
    for table in ("job_cards", "estimates", "estimate_lines", "estimate_decisions", "job_events"):
        _scoped_table(table)
    op.execute("""
        GRANT SELECT, INSERT, UPDATE ON job_cards, estimates, estimate_lines, estimate_decisions, job_events TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON job_cards, estimates, estimate_lines, estimate_decisions, job_events FROM workshopos_runtime")
    op.execute("DROP TRIGGER IF EXISTS estimate_lines_immutable ON estimate_lines")
    op.execute("DROP TRIGGER IF EXISTS estimates_approved_immutable ON estimates")
    op.execute("DROP FUNCTION IF EXISTS protect_approved_estimate_lines")
    op.execute("DROP FUNCTION IF EXISTS protect_approved_estimate")
    op.execute("DROP TABLE IF EXISTS job_events")
    op.execute("DROP TABLE IF EXISTS estimate_decisions")
    op.execute("DROP TABLE IF EXISTS estimate_lines")
    op.execute("DROP TABLE IF EXISTS estimates")
    op.execute("DROP TABLE IF EXISTS job_cards")

```
### 20260929_0007_catalogue_stock.py

Declared CREATE TABLE names: catalogue_items, suppliers, purchase_orders, purchase_order_lines, stock_inwards, stock_ledger

```python
"""Create branch catalogue, purchasing, inward, and immutable stock ledger.

Revision ID: 20260929_0007
Revises: 20260929_0006
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0007"
down_revision = "20260929_0006"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped_table(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE catalogue_items (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            sku text NOT NULL CHECK (btrim(sku) <> ''),
            category text NOT NULL DEFAULT '', name text NOT NULL CHECK (btrim(name) <> ''),
            unit text NOT NULL CHECK (btrim(unit) <> ''),
            low_stock_qty numeric(14,3) NOT NULL DEFAULT 0 CHECK (low_stock_qty >= 0),
            selling_price numeric(14,2) NOT NULL DEFAULT 0 CHECK (selling_price >= 0),
            archived_at timestamptz, archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text, created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX catalogue_items_active_sku ON catalogue_items(tenant_id, branch_id, upper(sku)) WHERE archived_at IS NULL;
        CREATE INDEX catalogue_items_scope_search ON catalogue_items(tenant_id, branch_id, archived_at, lower(name));

        CREATE TABLE suppliers (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL, name text NOT NULL CHECK (btrim(name) <> ''),
            mobile text NOT NULL DEFAULT '', email text NOT NULL DEFAULT '', address text NOT NULL DEFAULT '',
            archived_at timestamptz, archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text, created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE UNIQUE INDEX suppliers_active_name ON suppliers(tenant_id, branch_id, lower(name)) WHERE archived_at IS NULL;

        CREATE TABLE purchase_orders (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL, supplier_id bigint NOT NULL,
            po_number text NOT NULL CHECK (btrim(po_number) <> ''), order_date date NOT NULL,
            status text NOT NULL CHECK (status IN ('DRAFT','SENT','PARTIALLY_RECEIVED','READY_TO_CLOSE','CLOSED','CANCELLED')),
            notes text NOT NULL DEFAULT '', created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id), UNIQUE (tenant_id, branch_id, po_number),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, supplier_id) REFERENCES suppliers(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE purchase_order_lines (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL, purchase_order_id bigint NOT NULL, item_id bigint NOT NULL,
            line_no integer NOT NULL CHECK (line_no > 0), ordered_qty numeric(14,3) NOT NULL CHECK (ordered_qty > 0),
            unit_cost numeric(14,2) NOT NULL CHECK (unit_cost >= 0), discount numeric(14,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
            gst_rate numeric(5,2) NOT NULL DEFAULT 0 CHECK (gst_rate >= 0 AND gst_rate <= 100),
            UNIQUE (purchase_order_id, line_no), UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE stock_inwards (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT, branch_id uuid NOT NULL,
            item_id bigint NOT NULL, purchase_order_id bigint, purchase_order_line_id bigint,
            qty numeric(14,3) NOT NULL CHECK (qty > 0), unit_cost numeric(14,2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
            note text NOT NULL DEFAULT '', received_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            received_at timestamptz NOT NULL DEFAULT now(), UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, purchase_order_id) REFERENCES purchase_orders(tenant_id, branch_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, purchase_order_line_id) REFERENCES purchase_order_lines(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE stock_ledger (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT, branch_id uuid NOT NULL,
            item_id bigint NOT NULL, inward_id bigint REFERENCES stock_inwards(id) ON DELETE RESTRICT,
            entry_type text NOT NULL CHECK (entry_type IN ('INWARD','ADJUSTMENT')),
            quantity numeric(14,3) NOT NULL CHECK (quantity <> 0), unit_cost numeric(14,2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
            reason text NOT NULL CHECK (btrim(reason) <> ''), actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX stock_ledger_item_history ON stock_ledger(tenant_id, branch_id, item_id, created_at DESC);
        CREATE FUNCTION stock_ledger_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'stock_ledger_is_immutable'; END $$;
        CREATE TRIGGER stock_ledger_no_mutation BEFORE UPDATE OR DELETE ON stock_ledger FOR EACH ROW EXECUTE FUNCTION stock_ledger_immutable();
    """)
    for table in ("catalogue_items", "suppliers", "purchase_orders", "purchase_order_lines", "stock_inwards", "stock_ledger"):
        _scoped_table(table)
    op.execute("GRANT SELECT, INSERT, UPDATE ON catalogue_items, suppliers, purchase_orders, purchase_order_lines, stock_inwards, stock_ledger TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON catalogue_items, suppliers, purchase_orders, purchase_order_lines, stock_inwards, stock_ledger FROM workshopos_runtime")
    op.execute("DROP TRIGGER IF EXISTS stock_ledger_no_mutation ON stock_ledger")
    op.execute("DROP FUNCTION IF EXISTS stock_ledger_immutable")
    for table in ("stock_ledger", "stock_inwards", "purchase_order_lines", "purchase_orders", "suppliers", "catalogue_items"):
        op.execute(f"DROP TABLE IF EXISTS {table}")

```
### 20260929_0008_job_material_ledger.py

Declared CREATE TABLE names: material_reservations, material_ledger

```python
"""Create RLS-backed job material reservations and immutable issue ledger.

Revision ID: 20260929_0008
Revises: 20260929_0007
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0008"
down_revision = "20260929_0007"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped_table(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE material_reservations (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            item_id bigint NOT NULL,
            reserved_qty numeric(14,3) NOT NULL CHECK (reserved_qty > 0),
            status text NOT NULL CHECK (status IN ('RESERVED','PARTIALLY_ISSUED','ISSUED','RELEASED')),
            note text NOT NULL DEFAULT '',
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX material_reservations_job_idx ON material_reservations(tenant_id, branch_id, job_card_id, created_at DESC);
        CREATE INDEX material_reservations_item_open_idx ON material_reservations(tenant_id, branch_id, item_id) WHERE status <> 'RELEASED';

        CREATE TABLE material_ledger (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            reservation_id bigint NOT NULL REFERENCES material_reservations(id) ON DELETE RESTRICT,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            item_id bigint NOT NULL,
            entry_type text NOT NULL CHECK (entry_type IN ('RESERVE','ISSUE','RETURN','WASTE','RELEASE','ISSUE_REVERSAL')),
            quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
            reason text NOT NULL DEFAULT '',
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, item_id) REFERENCES catalogue_items(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX material_ledger_reservation_idx ON material_ledger(tenant_id, branch_id, reservation_id, id);
        CREATE INDEX material_ledger_job_idx ON material_ledger(tenant_id, branch_id, job_card_id, created_at DESC);
        CREATE UNIQUE INDEX material_ledger_one_reserve ON material_ledger(reservation_id) WHERE entry_type='RESERVE';

        ALTER TABLE stock_ledger ADD COLUMN material_ledger_id bigint UNIQUE REFERENCES material_ledger(id) ON DELETE RESTRICT;
        ALTER TABLE stock_ledger DROP CONSTRAINT stock_ledger_entry_type_check;
        ALTER TABLE stock_ledger ADD CONSTRAINT stock_ledger_entry_type_check
            CHECK (entry_type IN ('INWARD','ADJUSTMENT','ISSUE','RETURN','WASTE','ISSUE_REVERSAL'));

        CREATE FUNCTION material_ledger_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'material_ledger_is_immutable'; END $$;
        CREATE TRIGGER material_ledger_no_mutation BEFORE UPDATE OR DELETE ON material_ledger FOR EACH ROW EXECUTE FUNCTION material_ledger_immutable();

        -- Material events must agree with their reservation and cannot issue,
        -- settle, or release more quantity than the reservation permits.  Lock
        -- the reservation row so parallel commands have one serial history.
        CREATE FUNCTION material_ledger_validate() RETURNS trigger LANGUAGE plpgsql AS $$
        DECLARE reservation record;
        DECLARE issued numeric(14,3); released numeric(14,3); settled numeric(14,3);
        BEGIN
            SELECT * INTO reservation FROM material_reservations WHERE id=NEW.reservation_id FOR UPDATE;
            IF NOT FOUND OR reservation.tenant_id<>NEW.tenant_id OR reservation.branch_id<>NEW.branch_id
               OR reservation.job_card_id<>NEW.job_card_id OR reservation.item_id<>NEW.item_id THEN
                RAISE EXCEPTION 'material_reservation_scope_mismatch';
            END IF;
            SELECT COALESCE(SUM(quantity) FILTER (WHERE entry_type='ISSUE'),0),
                   COALESCE(SUM(quantity) FILTER (WHERE entry_type='RELEASE'),0),
                   COALESCE(SUM(quantity) FILTER (WHERE entry_type IN ('RETURN','WASTE','ISSUE_REVERSAL')),0)
              INTO issued,released,settled FROM material_ledger WHERE reservation_id=NEW.reservation_id;
            IF NEW.entry_type='RESERVE' AND NEW.quantity<>reservation.reserved_qty THEN RAISE EXCEPTION 'material_reserve_quantity_mismatch'; END IF;
            IF NEW.entry_type='ISSUE' AND issued+NEW.quantity > reservation.reserved_qty-released THEN RAISE EXCEPTION 'material_issue_exceeds_reservation'; END IF;
            IF NEW.entry_type IN ('RETURN','WASTE','ISSUE_REVERSAL') AND settled+NEW.quantity > issued THEN RAISE EXCEPTION 'material_settlement_exceeds_issued'; END IF;
            IF NEW.entry_type='RELEASE' AND released+NEW.quantity > reservation.reserved_qty-issued THEN RAISE EXCEPTION 'material_release_exceeds_open_reservation'; END IF;
            RETURN NEW;
        END $$;
        CREATE TRIGGER material_ledger_validate_before_insert BEFORE INSERT ON material_ledger FOR EACH ROW EXECUTE FUNCTION material_ledger_validate();

        -- Physical stock moves only when stock leaves or returns to the Store.
        -- WASTE settles material that has already left stock through ISSUE, so
        -- it remains an immutable job-material outcome without double-debiting
        -- the catalogue balance.
        CREATE FUNCTION material_ledger_stock_outcome() RETURNS trigger LANGUAGE plpgsql AS $$
        DECLARE stock_type text; stock_quantity numeric(14,3);
        BEGIN
            stock_type := CASE NEW.entry_type WHEN 'ISSUE' THEN 'ISSUE' WHEN 'RETURN' THEN 'RETURN'
                WHEN 'ISSUE_REVERSAL' THEN 'ISSUE_REVERSAL' ELSE NULL END;
            IF stock_type IS NULL THEN RETURN NEW; END IF;
            stock_quantity := CASE WHEN NEW.entry_type='ISSUE' THEN -NEW.quantity ELSE NEW.quantity END;
            INSERT INTO stock_ledger (tenant_id,branch_id,item_id,material_ledger_id,entry_type,quantity,unit_cost,reason,actor_id)
            VALUES (NEW.tenant_id,NEW.branch_id,NEW.item_id,NEW.id,stock_type,stock_quantity,0,
                COALESCE(NULLIF(NEW.reason,''), lower(replace(NEW.entry_type,'_',' '))),NEW.actor_id);
            RETURN NEW;
        END $$;
        CREATE TRIGGER material_ledger_stock_outcome_after_insert AFTER INSERT ON material_ledger FOR EACH ROW EXECUTE FUNCTION material_ledger_stock_outcome();

        -- This guard deliberately lives at the ledger boundary, rather than in
        -- the browser.  The catalogue row serialises two Store users issuing the
        -- same item concurrently and rejects an overdraft regardless of caller.
        CREATE FUNCTION stock_ledger_prevent_negative() RETURNS trigger LANGUAGE plpgsql AS $$
        DECLARE running numeric(14,3);
        BEGIN
            PERFORM 1 FROM catalogue_items WHERE id=NEW.item_id FOR UPDATE;
            SELECT COALESCE(SUM(quantity), 0) INTO running
            FROM stock_ledger WHERE tenant_id=NEW.tenant_id AND branch_id=NEW.branch_id AND item_id=NEW.item_id;
            IF running + NEW.quantity < 0 THEN
                RAISE EXCEPTION 'negative_stock_not_allowed';
            END IF;
            RETURN NEW;
        END $$;
        CREATE TRIGGER stock_ledger_no_negative BEFORE INSERT ON stock_ledger FOR EACH ROW EXECUTE FUNCTION stock_ledger_prevent_negative();
    """)
    for table in ("material_reservations", "material_ledger"):
        _scoped_table(table)
    op.execute("GRANT SELECT, INSERT, UPDATE ON material_reservations, material_ledger TO workshopos_runtime")
    op.execute("GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON material_reservations, material_ledger FROM workshopos_runtime")
    op.execute("DROP TRIGGER IF EXISTS stock_ledger_no_negative ON stock_ledger")
    op.execute("DROP FUNCTION IF EXISTS stock_ledger_prevent_negative")
    op.execute("DROP TRIGGER IF EXISTS material_ledger_no_mutation ON material_ledger")
    op.execute("DROP FUNCTION IF EXISTS material_ledger_immutable")
    op.execute("DROP TRIGGER IF EXISTS material_ledger_stock_outcome_after_insert ON material_ledger")
    op.execute("DROP FUNCTION IF EXISTS material_ledger_stock_outcome")
    op.execute("DROP TRIGGER IF EXISTS material_ledger_validate_before_insert ON material_ledger")
    op.execute("DROP FUNCTION IF EXISTS material_ledger_validate")
    op.execute("ALTER TABLE stock_ledger DROP CONSTRAINT stock_ledger_entry_type_check")
    op.execute("ALTER TABLE stock_ledger ADD CONSTRAINT stock_ledger_entry_type_check CHECK (entry_type IN ('INWARD','ADJUSTMENT'))")
    op.execute("ALTER TABLE stock_ledger DROP COLUMN IF EXISTS material_ledger_id")
    for table in ("material_ledger", "material_reservations"):
        op.execute(f"DROP TABLE IF EXISTS {table}")

```
### 20260929_0009_purchase_order_line_delete.py

Declared CREATE TABLE names: 

```python
"""Grant the one runtime deletion needed to replace editable draft PO lines.

Revision ID: 20260929_0009
Revises: 20260929_0008
Create Date: 2026-09-29
"""

from alembic import op


revision = "20260929_0009"
down_revision = "20260929_0008"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # `_replace_lines` deletes only RLS-visible lines while editing a DRAFT PO.
    # Do not broaden DELETE to catalogue, inwards, or the immutable ledger.
    op.execute("GRANT DELETE ON purchase_order_lines TO workshopos_runtime")


def downgrade() -> None:
    op.execute("REVOKE DELETE ON purchase_order_lines FROM workshopos_runtime")

```
### 20261001_0001_foundation.py

Declared CREATE TABLE names: 

```python
"""Create the WorkshopOS migration baseline.

Revision ID: 20260929_0001
Revises:
Create Date: 2026-10-01
"""

from typing import Sequence, Union


revision: str = "20260929_0001"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

```
### 20261001_0002_execution_qc.py

Declared CREATE TABLE names: technician_tasks, work_updates, evidence_attachments, qc_checks, qc_results

```python
"""Persist technician tasks, work evidence, attachments, and QC history."""

from alembic import op


revision = "20261001_0002"
down_revision = "20260929_0008"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE technician_tasks (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id), assigned_to uuid NOT NULL REFERENCES platform_users(id),
            title text NOT NULL CHECK (btrim(title) <> ''), notes text NOT NULL DEFAULT '',
            status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','IN_PROGRESS','BLOCKED','COMPLETED','CANCELLED')),
            created_by uuid NOT NULL REFERENCES platform_users(id), updated_by uuid NOT NULL REFERENCES platform_users(id),
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
        );
        CREATE INDEX technician_tasks_assignee ON technician_tasks(tenant_id, assigned_to, status, updated_at DESC);
        CREATE TABLE work_updates (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id), task_id bigint REFERENCES technician_tasks(id),
            body text NOT NULL CHECK (btrim(body) <> ''), status text NOT NULL CHECK (status IN ('IN_PROGRESS','BLOCKED','COMPLETED')),
            actor_id uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
        );
        CREATE TABLE evidence_attachments (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id), work_update_id bigint REFERENCES work_updates(id),
            filename text NOT NULL, content_type text NOT NULL, size_bytes integer NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 10485760),
            sha256 text NOT NULL CHECK (length(sha256)=64), content bytea NOT NULL,
            uploaded_by uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
        );
        CREATE INDEX evidence_attachments_job ON evidence_attachments(tenant_id, branch_id, job_card_id, id);
        CREATE TABLE qc_checks (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id), label text NOT NULL CHECK (btrim(label) <> ''),
            required boolean NOT NULL DEFAULT true, status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','FAILED','PASSED')),
            created_by uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
        );
        CREATE TABLE qc_results (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id), branch_id uuid NOT NULL,
            qc_check_id bigint NOT NULL REFERENCES qc_checks(id), outcome text NOT NULL CHECK (outcome IN ('FAILED','PASSED')),
            note text NOT NULL DEFAULT '', actor_id uuid NOT NULL REFERENCES platform_users(id), created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id)
        );
        CREATE FUNCTION immutable_execution_record() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'execution_record_is_immutable'; END $$;
        CREATE TRIGGER work_updates_immutable BEFORE UPDATE OR DELETE ON work_updates FOR EACH ROW EXECUTE FUNCTION immutable_execution_record();
        CREATE TRIGGER evidence_attachments_immutable BEFORE UPDATE OR DELETE ON evidence_attachments FOR EACH ROW EXECUTE FUNCTION immutable_execution_record();
        CREATE TRIGGER qc_results_immutable BEFORE UPDATE OR DELETE ON qc_results FOR EACH ROW EXECUTE FUNCTION immutable_execution_record();
    """)
    for table in ("technician_tasks", "work_updates", "evidence_attachments", "qc_checks", "qc_results"):
        _scoped(table)
    op.execute("""
        GRANT SELECT, INSERT, UPDATE ON technician_tasks, qc_checks TO workshopos_runtime;
        GRANT SELECT, INSERT ON work_updates, evidence_attachments, qc_results TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS qc_results, qc_checks, evidence_attachments, work_updates, technician_tasks CASCADE")
    op.execute("DROP FUNCTION IF EXISTS immutable_execution_record")

```
### 20261001_0003_merge_purchase_order_execution_heads.py

Declared CREATE TABLE names: 

```python
"""Merge the purchase-order and execution/QC migration heads.

Revision ID: 20261001_0003
Revises: 20260929_0009, 20261001_0002
Create Date: 2026-10-01
"""


revision = "20261001_0003"
down_revision = ("20260929_0009", "20261001_0002")
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

```
### 20261001_0004_finance_delivery.py

Declared CREATE TABLE names: document_sequences, financial_documents, invoices, invoice_lines, payments, delivery_acknowledgements, financial_document_events

```python
"""Create RLS-backed immutable issued documents, payments, and handovers.

Revision ID: 20261001_0004
Revises: 20261001_0003
Create Date: 2026-10-01
"""

from alembic import op


revision = "20261001_0004"
down_revision = "20261001_0003"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped_table(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE document_sequences (
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            document_type text NOT NULL CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS')),
            fiscal_year text NOT NULL CHECK (fiscal_year ~ '^FY[0-9]{4}-[0-9]{2}$'),
            next_value integer NOT NULL CHECK (next_value > 0),
            PRIMARY KEY (tenant_id, branch_id, document_type, fiscal_year),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );

        CREATE TABLE financial_documents (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            document_type text NOT NULL CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS')),
            fiscal_year text NOT NULL,
            sequence_value integer NOT NULL CHECK (sequence_value > 0),
            document_no text NOT NULL,
            template_version text NOT NULL,
            snapshot jsonb NOT NULL,
            rendered_html text NOT NULL,
            artifact bytea NOT NULL CHECK (octet_length(artifact) > 0 AND octet_length(artifact) <= 10485760),
            content_type text NOT NULL DEFAULT 'text/html' CHECK (content_type IN ('text/html','application/pdf')),
            sha256 text NOT NULL CHECK (length(sha256) = 64),
            predecessor_document_id bigint REFERENCES financial_documents(id) ON DELETE RESTRICT,
            issued_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            issued_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, document_type, fiscal_year, sequence_value),
            UNIQUE (tenant_id, branch_id, document_no),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX financial_documents_job_idx ON financial_documents(tenant_id, branch_id, job_card_id, issued_at DESC);

        CREATE TABLE invoices (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            issued_document_id bigint NOT NULL UNIQUE REFERENCES financial_documents(id) ON DELETE RESTRICT,
            replaces_invoice_id bigint REFERENCES invoices(id) ON DELETE RESTRICT,
            subtotal_paise bigint NOT NULL CHECK (subtotal_paise >= 0),
            discount_paise bigint NOT NULL CHECK (discount_paise >= 0),
            tax_paise bigint NOT NULL CHECK (tax_paise >= 0),
            total_paise bigint NOT NULL CHECK (total_paise >= 0),
            request_key text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, id),
            UNIQUE (job_card_id, request_key),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX invoices_job_idx ON invoices(tenant_id, branch_id, job_card_id, created_at DESC);

        CREATE TABLE invoice_lines (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            invoice_id bigint NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
            line_no integer NOT NULL CHECK (line_no > 0),
            description text NOT NULL CHECK (length(btrim(description)) > 0),
            quantity integer NOT NULL CHECK (quantity > 0),
            unit_amount_paise bigint NOT NULL CHECK (unit_amount_paise >= 0),
            gst_rate_bps integer NOT NULL CHECK (gst_rate_bps >= 0 AND gst_rate_bps <= 10000),
            taxable_paise bigint NOT NULL CHECK (taxable_paise >= 0),
            tax_paise bigint NOT NULL CHECK (tax_paise >= 0),
            total_paise bigint NOT NULL CHECK (total_paise >= 0),
            UNIQUE (invoice_id, line_no),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );

        CREATE TABLE payments (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            invoice_id bigint NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
            receipt_document_id bigint NOT NULL UNIQUE REFERENCES financial_documents(id) ON DELETE RESTRICT,
            amount_paise bigint NOT NULL CHECK (amount_paise > 0),
            method text NOT NULL CHECK (method IN ('CASH','CARD','UPI','BANK_TRANSFER','OTHER')),
            reference text NOT NULL DEFAULT '',
            payer text NOT NULL DEFAULT '',
            supporting_filename text,
            supporting_content_type text CHECK (supporting_content_type IS NULL OR supporting_content_type IN ('image/jpeg','image/png','application/pdf')),
            supporting_artifact bytea CHECK (supporting_artifact IS NULL OR octet_length(supporting_artifact) <= 10485760),
            supporting_sha256 text CHECK (supporting_sha256 IS NULL OR length(supporting_sha256) = 64),
            received_at timestamptz NOT NULL,
            request_key text,
            received_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (invoice_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX payments_invoice_idx ON payments(tenant_id, branch_id, invoice_id, created_at);

        CREATE TABLE delivery_acknowledgements (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL UNIQUE REFERENCES job_cards(id) ON DELETE RESTRICT,
            invoice_id bigint NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
            gate_pass_document_id bigint NOT NULL UNIQUE REFERENCES financial_documents(id) ON DELETE RESTRICT,
            delivered_by text NOT NULL CHECK (length(btrim(delivered_by)) > 0),
            final_odometer integer NOT NULL CHECK (final_odometer >= 0),
            acknowledgement text NOT NULL CHECK (length(btrim(acknowledgement)) > 0),
            handover_at timestamptz NOT NULL DEFAULT now(),
            request_key text,
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            UNIQUE (job_card_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );

        CREATE TABLE financial_document_events (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            document_id bigint NOT NULL REFERENCES financial_documents(id) ON DELETE RESTRICT,
            event_type text NOT NULL CHECK (event_type IN ('VOID','REPLACED')),
            reason text NOT NULL CHECK (length(btrim(reason)) > 0),
            related_document_id bigint REFERENCES financial_documents(id) ON DELETE RESTRICT,
            request_key text,
            actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (document_id, event_type),
            UNIQUE (document_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX financial_document_events_document_idx ON financial_document_events(tenant_id, branch_id, document_id, created_at);

        CREATE FUNCTION immutable_financial_record() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN RAISE EXCEPTION 'financial_record_is_immutable'; END $$;
        CREATE TRIGGER financial_documents_no_mutation BEFORE UPDATE OR DELETE ON financial_documents FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
        CREATE TRIGGER invoices_no_mutation BEFORE UPDATE OR DELETE ON invoices FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
        CREATE TRIGGER invoice_lines_no_mutation BEFORE UPDATE OR DELETE ON invoice_lines FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
        CREATE TRIGGER payments_no_mutation BEFORE UPDATE OR DELETE ON payments FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
        CREATE TRIGGER delivery_acknowledgements_no_mutation BEFORE UPDATE OR DELETE ON delivery_acknowledgements FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
        CREATE TRIGGER financial_document_events_no_mutation BEFORE UPDATE OR DELETE ON financial_document_events FOR EACH ROW EXECUTE FUNCTION immutable_financial_record();
    """)
    for table in ("document_sequences", "financial_documents", "invoices", "invoice_lines", "payments", "delivery_acknowledgements", "financial_document_events"):
        _scoped_table(table)
    op.execute("""
        GRANT SELECT, INSERT, UPDATE ON document_sequences TO workshopos_runtime;
        GRANT SELECT, INSERT ON financial_documents, invoices, invoice_lines, payments,
            delivery_acknowledgements, financial_document_events TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON document_sequences FROM workshopos_runtime")
    op.execute("REVOKE SELECT, INSERT ON financial_documents, invoices, invoice_lines, payments, delivery_acknowledgements, financial_document_events FROM workshopos_runtime")
    for trigger, table in (
        ("financial_documents_no_mutation", "financial_documents"), ("invoices_no_mutation", "invoices"),
        ("invoice_lines_no_mutation", "invoice_lines"), ("payments_no_mutation", "payments"),
        ("delivery_acknowledgements_no_mutation", "delivery_acknowledgements"),
        ("financial_document_events_no_mutation", "financial_document_events"),
    ):
        op.execute(f"DROP TRIGGER IF EXISTS {trigger} ON {table}")
    op.execute("DROP FUNCTION IF EXISTS immutable_financial_record")
    for table in ("financial_document_events", "delivery_acknowledgements", "payments", "invoice_lines", "invoices", "financial_documents", "document_sequences"):
        op.execute(f"DROP TABLE IF EXISTS {table}")

```
### 20261001_0005_followups_search.py

Declared CREATE TABLE names: followups

```python
"""Add tenant/branch-scoped follow-ups and search support.

Revision ID: 20261001_0005
Revises: 20261001_0004
Create Date: 2026-10-01
"""

from alembic import op


revision = "20261001_0005"
down_revision = "20261001_0004"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped_table(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE followups (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            note text NOT NULL CHECK (btrim(note) <> ''),
            due_at date,
            status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'COMPLETED')),
            outcome text NOT NULL DEFAULT '',
            completed_at timestamptz,
            completed_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archived_at timestamptz,
            archived_by uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            archive_reason text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            version integer NOT NULL DEFAULT 1 CHECK (version > 0),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id, job_card_id) REFERENCES job_cards(tenant_id, branch_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX followups_scope_due_idx ON followups (tenant_id, branch_id, archived_at, status, due_at, id);
        CREATE INDEX followups_job_idx ON followups (tenant_id, branch_id, job_card_id, archived_at, id DESC);
    """)
    _scoped_table("followups")
    op.execute("""
        GRANT SELECT, INSERT, UPDATE ON followups TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("REVOKE SELECT, INSERT, UPDATE ON followups FROM workshopos_runtime")
    op.execute("DROP TABLE IF EXISTS followups")

```
### 20261001_0006_finance_corrections_and_invoice_claims.py

Declared CREATE TABLE names: active_invoice_claims, credit_notes, refunds

```python
"""Harden issued finance artifacts and add auditable post-payment corrections.

Revision ID: 20261001_0006
Revises: 20261001_0005
Create Date: 2026-10-01
"""

from alembic import op


revision = "20261001_0006"
down_revision = "20261001_0005"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("ALTER TABLE document_sequences DROP CONSTRAINT document_sequences_document_type_check")
    op.execute("ALTER TABLE document_sequences ADD CONSTRAINT document_sequences_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS','CREDIT_NOTE'))")
    op.execute("ALTER TABLE financial_documents DROP CONSTRAINT financial_documents_document_type_check")
    op.execute("ALTER TABLE financial_documents ADD CONSTRAINT financial_documents_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS','CREDIT_NOTE'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_event_type_check")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_event_type_check CHECK (event_type IN ('VOID','REPLACED','CREDITED'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_document_id_event_type_key")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_correction_link_key UNIQUE (document_id,event_type,related_document_id)")
    op.execute("ALTER TABLE invoice_lines ALTER COLUMN quantity TYPE numeric(14,3) USING quantity::numeric")
    op.execute("""
        CREATE TABLE active_invoice_claims (
            job_card_id bigint PRIMARY KEY REFERENCES job_cards(id) ON DELETE RESTRICT,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            invoice_id bigint NOT NULL UNIQUE REFERENCES invoices(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        INSERT INTO active_invoice_claims (job_card_id,tenant_id,branch_id,invoice_id)
        SELECT DISTINCT ON (invoice.job_card_id) invoice.job_card_id,invoice.tenant_id,invoice.branch_id,invoice.id FROM invoices invoice
        WHERE NOT EXISTS (SELECT 1 FROM financial_document_events event WHERE event.document_id=invoice.issued_document_id AND event.event_type='VOID')
        ORDER BY invoice.job_card_id,invoice.created_at DESC,invoice.id DESC;

        CREATE TABLE credit_notes (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            invoice_id bigint NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
            issued_document_id bigint NOT NULL UNIQUE REFERENCES financial_documents(id) ON DELETE RESTRICT,
            amount_paise bigint NOT NULL CHECK (amount_paise > 0),
            reason text NOT NULL CHECK (btrim(reason) <> ''),
            request_key text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (invoice_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX credit_notes_invoice_idx ON credit_notes (tenant_id, branch_id, invoice_id, created_at);
        CREATE TABLE refunds (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            credit_note_id bigint NOT NULL REFERENCES credit_notes(id) ON DELETE RESTRICT,
            amount_paise bigint NOT NULL CHECK (amount_paise > 0),
            method text NOT NULL CHECK (method IN ('CASH','CARD','UPI','BANK_TRANSFER','OTHER')),
            reference text NOT NULL DEFAULT '',
            request_key text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (credit_note_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX refunds_credit_note_idx ON refunds (tenant_id, branch_id, credit_note_id, created_at);
        CREATE FUNCTION immutable_finance_correction() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'finance_correction_is_immutable'; END $$;
        CREATE TRIGGER credit_notes_no_mutation BEFORE UPDATE OR DELETE ON credit_notes FOR EACH ROW EXECUTE FUNCTION immutable_finance_correction();
        CREATE TRIGGER refunds_no_mutation BEFORE UPDATE OR DELETE ON refunds FOR EACH ROW EXECUTE FUNCTION immutable_finance_correction();
    """)
    for table in ("active_invoice_claims", "credit_notes", "refunds"):
        _scoped(table)
    op.execute("""
        GRANT SELECT, INSERT, DELETE ON active_invoice_claims TO workshopos_runtime;
        GRANT SELECT, INSERT ON credit_notes, refunds TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (SELECT 1 FROM financial_documents WHERE document_type = 'CREDIT_NOTE')
               OR EXISTS (SELECT 1 FROM financial_document_events WHERE event_type = 'CREDITED') THEN
                RAISE EXCEPTION 'cannot downgrade finance corrections after issued credit records exist';
            END IF;
        END $$;
    """)
    op.execute("DROP TABLE IF EXISTS refunds, credit_notes, active_invoice_claims CASCADE")
    op.execute("DROP FUNCTION IF EXISTS immutable_finance_correction")
    op.execute("ALTER TABLE invoice_lines ALTER COLUMN quantity TYPE integer USING quantity::integer")
    op.execute("ALTER TABLE financial_documents DROP CONSTRAINT financial_documents_document_type_check")
    op.execute("ALTER TABLE financial_documents ADD CONSTRAINT financial_documents_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_event_type_check")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_event_type_check CHECK (event_type IN ('VOID','REPLACED'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_correction_link_key")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_document_id_event_type_key UNIQUE (document_id,event_type)")
    op.execute("ALTER TABLE document_sequences DROP CONSTRAINT document_sequences_document_type_check")
    op.execute("ALTER TABLE document_sequences ADD CONSTRAINT document_sequences_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS'))")

```
### 20261002_0013_finance_corrections.py

Declared CREATE TABLE names: active_invoice_claims, credit_notes, refunds

```python
"""Add immutable post-payment credit notes, refunds, and invoice claims.

Revision ID: 20261002_0013
Revises: 20260929_0012
"""

from alembic import op


revision = "20261002_0013"
down_revision = "20261001_0006"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("ALTER TABLE document_sequences DROP CONSTRAINT document_sequences_document_type_check")
    op.execute("ALTER TABLE document_sequences ADD CONSTRAINT document_sequences_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS','CREDIT_NOTE'))")
    op.execute("ALTER TABLE financial_documents DROP CONSTRAINT financial_documents_document_type_check")
    op.execute("ALTER TABLE financial_documents ADD CONSTRAINT financial_documents_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS','CREDIT_NOTE'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_event_type_check")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_event_type_check CHECK (event_type IN ('VOID','REPLACED','CREDITED'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_document_id_event_type_key")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_correction_link_key UNIQUE (document_id,event_type,related_document_id)")
    op.execute("""
        CREATE TABLE active_invoice_claims (
            job_card_id bigint PRIMARY KEY REFERENCES job_cards(id) ON DELETE RESTRICT,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            invoice_id bigint NOT NULL UNIQUE REFERENCES invoices(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        INSERT INTO active_invoice_claims (job_card_id,tenant_id,branch_id,invoice_id)
        SELECT DISTINCT ON (invoice.job_card_id) invoice.job_card_id,invoice.tenant_id,invoice.branch_id,invoice.id FROM invoices invoice
        WHERE NOT EXISTS (SELECT 1 FROM financial_document_events event WHERE event.document_id=invoice.issued_document_id AND event.event_type='VOID')
        ORDER BY invoice.job_card_id,invoice.created_at DESC,invoice.id DESC;

        CREATE TABLE credit_notes (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            invoice_id bigint NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
            issued_document_id bigint NOT NULL UNIQUE REFERENCES financial_documents(id) ON DELETE RESTRICT,
            amount_paise bigint NOT NULL CHECK (amount_paise > 0),
            reason text NOT NULL CHECK (btrim(reason) <> ''), request_key text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (invoice_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX credit_notes_invoice_idx ON credit_notes (tenant_id, branch_id, invoice_id, created_at);
        CREATE TABLE refunds (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            credit_note_id bigint NOT NULL REFERENCES credit_notes(id) ON DELETE RESTRICT,
            amount_paise bigint NOT NULL CHECK (amount_paise > 0),
            method text NOT NULL CHECK (method IN ('CASH','CARD','UPI','BANK_TRANSFER','OTHER')),
            reference text NOT NULL DEFAULT '', request_key text,
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (credit_note_id, request_key),
            UNIQUE (tenant_id, branch_id, id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX refunds_credit_note_idx ON refunds (tenant_id, branch_id, credit_note_id, created_at);
        CREATE FUNCTION immutable_finance_correction() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'finance_correction_is_immutable'; END $$;
        CREATE TRIGGER credit_notes_no_mutation BEFORE UPDATE OR DELETE ON credit_notes FOR EACH ROW EXECUTE FUNCTION immutable_finance_correction();
        CREATE TRIGGER refunds_no_mutation BEFORE UPDATE OR DELETE ON refunds FOR EACH ROW EXECUTE FUNCTION immutable_finance_correction();
    """)
    for table in ("active_invoice_claims", "credit_notes", "refunds"):
        _scoped(table)
    op.execute("""
        GRANT SELECT, INSERT, DELETE ON active_invoice_claims TO workshopos_runtime;
        GRANT SELECT, INSERT ON credit_notes, refunds TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("""DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM financial_documents WHERE document_type = 'CREDIT_NOTE')
           OR EXISTS (SELECT 1 FROM financial_document_events WHERE event_type = 'CREDITED') THEN
            RAISE EXCEPTION 'cannot downgrade finance corrections after issued credit records exist';
        END IF;
    END $$;""")
    op.execute("DROP TABLE IF EXISTS refunds, credit_notes, active_invoice_claims CASCADE")
    op.execute("DROP FUNCTION IF EXISTS immutable_finance_correction")
    op.execute("ALTER TABLE financial_documents DROP CONSTRAINT financial_documents_document_type_check")
    op.execute("ALTER TABLE financial_documents ADD CONSTRAINT financial_documents_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_event_type_check")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_event_type_check CHECK (event_type IN ('VOID','REPLACED'))")
    op.execute("ALTER TABLE financial_document_events DROP CONSTRAINT financial_document_events_correction_link_key")
    op.execute("ALTER TABLE financial_document_events ADD CONSTRAINT financial_document_events_document_id_event_type_key UNIQUE (document_id,event_type)")
    op.execute("ALTER TABLE document_sequences DROP CONSTRAINT document_sequences_document_type_check")
    op.execute("ALTER TABLE document_sequences ADD CONSTRAINT document_sequences_document_type_check CHECK (document_type IN ('INVOICE','RECEIPT','GATE_PASS'))")

```
### 20261002_0014_service_department_routing.py

Declared CREATE TABLE names: service_departments, service_department_managers, service_advisor_teams, job_assignment_history

```python
"""Add branch-scoped service routing, team membership, and job assignment history.

Revision ID: 20261002_0014
Revises: 20261002_0013
"""

from alembic import op


revision = "20261002_0014"
down_revision = "20261002_0013"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE service_departments (
            id uuid PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            name text NOT NULL CHECK (btrim(name) <> ''),
            status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','ARCHIVED')),
            created_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            updated_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, branch_id, name),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE service_department_managers (
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            department_id uuid NOT NULL REFERENCES service_departments(id) ON DELETE RESTRICT,
            manager_membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE RESTRICT,
            appointed_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            appointed_at timestamptz NOT NULL DEFAULT now(),
            PRIMARY KEY (department_id, manager_membership_id),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE TABLE service_advisor_teams (
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            department_id uuid NOT NULL REFERENCES service_departments(id) ON DELETE RESTRICT,
            manager_membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE RESTRICT,
            advisor_membership_id uuid NOT NULL REFERENCES tenant_memberships(id) ON DELETE RESTRICT,
            assigned_by uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            assigned_at timestamptz NOT NULL DEFAULT now(),
            PRIMARY KEY (tenant_id, branch_id, advisor_membership_id),
            FOREIGN KEY (department_id, manager_membership_id) REFERENCES service_department_managers(department_id, manager_membership_id) ON DELETE RESTRICT,
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        ALTER TABLE job_cards ADD COLUMN department_id uuid REFERENCES service_departments(id) ON DELETE RESTRICT;
        ALTER TABLE job_cards ADD COLUMN responsible_manager_id uuid REFERENCES platform_users(id) ON DELETE RESTRICT;
        ALTER TABLE job_cards ADD COLUMN assignment_state text NOT NULL DEFAULT 'LEGACY'
            CHECK (assignment_state IN ('LEGACY','AWAITING_ADVISOR_ASSIGNMENT','ASSIGNED_TO_ADVISOR'));
        CREATE INDEX job_cards_manager_queue_idx ON job_cards (tenant_id, branch_id, responsible_manager_id, assignment_state, created_at DESC);
        CREATE TABLE job_assignment_history (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            job_card_id bigint NOT NULL REFERENCES job_cards(id) ON DELETE RESTRICT,
            department_id uuid REFERENCES service_departments(id) ON DELETE RESTRICT,
            department_name text, manager_id uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            manager_name text, advisor_id uuid REFERENCES platform_users(id) ON DELETE RESTRICT,
            advisor_name text, actor_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
            action text NOT NULL CHECK (action IN ('ROUTED_TO_MANAGER','ADVISOR_ASSIGNED','MANAGER_TRANSFERRED')),
            reason text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX job_assignment_history_job_idx ON job_assignment_history (job_card_id, id);

        INSERT INTO tenant_roles (id, tenant_id, name, description, system_key)
        SELECT gen_random_uuid(), t.id, 'Service Department Manager', 'Service Department Manager workspace access', 'service_manager'
        FROM tenants t WHERE NOT EXISTS (SELECT 1 FROM tenant_roles r WHERE r.tenant_id=t.id AND r.system_key='service_manager');
        INSERT INTO role_permissions (role_id, permission)
        SELECT manager.id, permission.permission FROM tenant_roles manager
        JOIN tenant_roles advisor ON advisor.tenant_id=manager.tenant_id AND advisor.system_key='service'
        JOIN role_permissions permission ON permission.role_id=advisor.id
        WHERE manager.system_key='service_manager' ON CONFLICT DO NOTHING;
    """)
    for table in ("service_departments", "service_department_managers", "service_advisor_teams", "job_assignment_history"):
        _scoped(table)
    op.execute("""
        GRANT SELECT, INSERT, UPDATE, DELETE ON service_departments, service_department_managers, service_advisor_teams TO workshopos_runtime;
        GRANT SELECT, INSERT ON job_assignment_history TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS job_assignment_history")
    op.execute("ALTER TABLE job_cards DROP COLUMN IF EXISTS assignment_state")
    op.execute("ALTER TABLE job_cards DROP COLUMN IF EXISTS responsible_manager_id")
    op.execute("ALTER TABLE job_cards DROP COLUMN IF EXISTS department_id")
    op.execute("DROP TABLE IF EXISTS service_advisor_teams")
    op.execute("DROP TABLE IF EXISTS service_department_managers")
    op.execute("DROP TABLE IF EXISTS service_departments")

```
### 20261002_0015_sales_crm.py

Declared CREATE TABLE names: sales_leads, quotations, quotation_lines

```python
"""Add tenant-scoped sales leads and immutable quotation documents.

Revision ID: 20261002_0015
Revises: 20261002_0014
"""

from alembic import op

revision = "20261002_0015"
down_revision = "20261002_0014"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"""({TENANT_RLS}) AND branch_id = ANY(
    COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[]
)"""


def _scoped(table: str) -> None:
    op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
    op.execute(f"ALTER TABLE {table} FORCE ROW LEVEL SECURITY")
    op.execute(f"CREATE POLICY {table}_branch_scope ON {table} USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS})")


def upgrade() -> None:
    op.execute("""
        CREATE TABLE sales_leads (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            display_name text NOT NULL CHECK (btrim(display_name) <> ''),
            phone text NOT NULL CHECK (btrim(phone) <> ''), company text NOT NULL DEFAULT '',
            email text NOT NULL DEFAULT '', address text NOT NULL DEFAULT '', service_interest text NOT NULL DEFAULT '', notes text NOT NULL DEFAULT '',
            stage text NOT NULL DEFAULT 'NEW' CHECK (stage IN ('NEW','QUALIFIED','QUOTATION_SENT','WON','LOST')),
            temperature text NOT NULL DEFAULT 'WARM' CHECK (temperature IN ('HOT','WARM','COLD')),
            follow_up_due date, site_visit_completed boolean NOT NULL DEFAULT false, site_visit_date date,
            created_by uuid NOT NULL REFERENCES platform_users(id), updated_by uuid NOT NULL REFERENCES platform_users(id),
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX sales_leads_scope_idx ON sales_leads (tenant_id, branch_id, stage, temperature, created_at DESC);
        CREATE TABLE quotations (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT, branch_id uuid NOT NULL,
            lead_id bigint NOT NULL REFERENCES sales_leads(id) ON DELETE RESTRICT,
            quotation_no text NOT NULL, status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','SENT','ACCEPTED','REJECTED','EXPIRED')),
            valid_until date, customer_notes text NOT NULL DEFAULT '', discount numeric(14,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
            subtotal numeric(14,2) NOT NULL DEFAULT 0, gst_amount numeric(14,2) NOT NULL DEFAULT 0, total numeric(14,2) NOT NULL DEFAULT 0,
            template_id text NOT NULL, template_html text NOT NULL, document_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
            created_by uuid NOT NULL REFERENCES platform_users(id), updated_by uuid NOT NULL REFERENCES platform_users(id),
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (tenant_id, quotation_no), FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX quotations_scope_idx ON quotations (tenant_id, branch_id, status, valid_until, created_at DESC);
        CREATE TABLE quotation_lines (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL, quotation_id bigint NOT NULL REFERENCES quotations(id) ON DELETE RESTRICT,
            line_no integer NOT NULL CHECK (line_no > 0), kind text NOT NULL DEFAULT 'Service', description text NOT NULL CHECK (btrim(description) <> ''),
            quantity numeric(14,3) NOT NULL CHECK (quantity > 0), rate numeric(14,2) NOT NULL CHECK (rate >= 0), gst_rate numeric(5,2) NOT NULL CHECK (gst_rate >= 0 AND gst_rate <= 100),
            UNIQUE (quotation_id, line_no), FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
    """)
    for table in ("sales_leads", "quotations", "quotation_lines"):
        _scoped(table)
    op.execute("GRANT SELECT, INSERT, UPDATE, DELETE ON sales_leads, quotations, quotation_lines TO workshopos_runtime; GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS quotation_lines")
    op.execute("DROP TABLE IF EXISTS quotations")
    op.execute("DROP TABLE IF EXISTS sales_leads")

```
### 20261002_0016_service_task_catalog.py

Declared CREATE TABLE names: service_task_catalog

```python
"""Add a branch-scoped service-task catalogue for sales quotations.

Revision ID: 20261002_0016
Revises: 20261002_0015
"""

from alembic import op

revision = "20261002_0016"
down_revision = "20261002_0015"
branch_labels = None
depends_on = None

TENANT_RLS = "tenant_id = NULLIF(current_setting('workshopos.tenant_id', true), '')::uuid"
BRANCH_RLS = f"({TENANT_RLS}) AND branch_id = ANY(COALESCE(NULLIF(current_setting('workshopos.branch_ids', true), ''), '{{}}')::uuid[])"


def upgrade() -> None:
    op.execute(f"""
        CREATE TABLE service_task_catalog (
            id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
            branch_id uuid NOT NULL,
            name text NOT NULL CHECK (btrim(name) <> ''),
            description text NOT NULL DEFAULT '',
            rate numeric(14,2) NOT NULL CHECK (rate >= 0),
            gst_rate numeric(5,2) NOT NULL DEFAULT 18 CHECK (gst_rate >= 0 AND gst_rate <= 100),
            status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','ARCHIVED')),
            created_by uuid NOT NULL REFERENCES platform_users(id), updated_by uuid NOT NULL REFERENCES platform_users(id),
            created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (tenant_id, branch_id) REFERENCES branches(tenant_id, id) ON DELETE RESTRICT
        );
        CREATE INDEX service_task_catalog_scope_idx ON service_task_catalog (tenant_id, branch_id, status, name);
        ALTER TABLE service_task_catalog ENABLE ROW LEVEL SECURITY;
        ALTER TABLE service_task_catalog FORCE ROW LEVEL SECURITY;
        CREATE POLICY service_task_catalog_branch_scope ON service_task_catalog USING ({BRANCH_RLS}) WITH CHECK ({BRANCH_RLS});
        GRANT SELECT, INSERT, UPDATE, DELETE ON service_task_catalog TO workshopos_runtime;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime;
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS service_task_catalog")

```
### 20261006_0017_lead_not_entered_flags.py

Declared CREATE TABLE names: 

```python
"""Persist explicit company and email not-entered lead states.

Revision ID: 20261006_0017
Revises: 20261002_0016
"""

from alembic import op


revision = "20261006_0017"
down_revision = "20261002_0016"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        ALTER TABLE sales_leads
            ADD COLUMN company_not_entered boolean NOT NULL DEFAULT false,
            ADD COLUMN email_not_entered boolean NOT NULL DEFAULT false;
    """)


def downgrade() -> None:
    op.execute("""
        ALTER TABLE sales_leads
            DROP COLUMN email_not_entered,
            DROP COLUMN company_not_entered;
    """)

```