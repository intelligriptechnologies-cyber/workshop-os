"""Authoritative GST-aware invoice, payment, document, and vehicle-handover API.

The local SQLite demo may render similar screens, but it never creates a legal
document.  This module owns the server-side records: amounts are integer paise,
document numbers are allocated in the transaction, and all issued artifacts are
immutable PostgreSQL ``bytea`` snapshots.
"""

from __future__ import annotations

import base64
import binascii
import hashlib
import html
import json
import re
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Header, Response, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.intake import _require_any
from app.jobs import _job, _row_or_404
from app.tenancy import TenantScope, require_mutation_allowed
from app.tenant_admin import _audit


router = APIRouter(prefix="/api/v1", tags=["finance and delivery"])
PaymentMethod = Literal["cash", "card", "upi", "bank_transfer", "other"]
MAX_ARTIFACT_BYTES = 10 * 1024 * 1024


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class InvoiceIssue(ApiModel):
    customer_state: Annotated[str, Field(max_length=100)] = Field(default="", alias="customerState")
    replaces_invoice_id: Annotated[int | None, Field(gt=0)] = Field(default=None, alias="replacesInvoiceId")


class AttachmentInput(ApiModel):
    filename: Annotated[str, Field(min_length=1, max_length=500)]
    content_type: Literal["image/jpeg", "image/png", "application/pdf"] = Field(alias="contentType")
    data_base64: Annotated[str, Field(min_length=1, max_length=14_000_000)] = Field(alias="dataBase64")


class PaymentRecord(ApiModel):
    amount_paise: Annotated[int, Field(gt=0, le=10_000_000_000)] = Field(alias="amountPaise")
    method: PaymentMethod
    reference: Annotated[str, Field(max_length=500)] = ""
    payer: Annotated[str, Field(max_length=500)] = ""
    received_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), alias="receivedAt")
    supporting_attachment: AttachmentInput | None = Field(default=None, alias="supportingAttachment")


class VoidInput(ApiModel):
    reason: Annotated[str, Field(min_length=1, max_length=4000)]


class CreditNoteIssue(ApiModel):
    amount_paise: Annotated[int, Field(gt=0, le=10_000_000_000)] = Field(alias="amountPaise")
    reason: Annotated[str, Field(min_length=1, max_length=4000)]


class RefundRecord(ApiModel):
    amount_paise: Annotated[int, Field(gt=0, le=10_000_000_000)] = Field(alias="amountPaise")
    method: PaymentMethod
    reference: Annotated[str, Field(max_length=500)] = ""


class HandoverInput(ApiModel):
    delivered_by: Annotated[str, Field(min_length=1, max_length=250)] = Field(alias="deliveredBy")
    final_odometer: Annotated[int, Field(ge=0, le=10_000_000)] = Field(alias="finalOdometer")
    acknowledgement: Annotated[str, Field(min_length=1, max_length=4000)]


def _is_owner(current: TenantScope) -> bool:
    return any(name == "Owner/Admin" for _, name, _ in current.roles)


def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:
    """Accounts has the explicit finance pages; Owner/Admin remains an override."""
    _, current = scope
    if _is_owner(current):
        if mutation:
            try:
                require_mutation_allowed(current)
            except PermissionError as error:
                raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error
        return current
    verb = "write" if mutation else "read"
    return _require_any(scope, tuple(f"page.{page}.{verb}" for page in ("ready-to-invoice", "invoice", "payment", "delivery")), mutation=mutation)


def _decode_attachment(input: AttachmentInput | None) -> tuple[str | None, str | None, bytes | None, str | None]:
    if input is None:
        return None, None, None, None
    try:
        payload = base64.b64decode(input.data_base64, validate=True)
    except (binascii.Error, ValueError) as error:
        raise auth_error("INVALID_SUPPORTING_ATTACHMENT", status.HTTP_422_UNPROCESSABLE_ENTITY) from error
    if not payload or len(payload) > MAX_ARTIFACT_BYTES:
        raise auth_error("SUPPORTING_ATTACHMENT_SIZE_INVALID", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return input.filename.strip(), input.content_type, payload, hashlib.sha256(payload).hexdigest()


def _fiscal_year(now: datetime) -> str:
    year = now.year if now.month >= 4 else now.year - 1
    return f"FY{year}-{str(year + 1)[-2:]}"


def _branch_profile(session, branch_id: object) -> dict[str, object]:
    row = session.execute(text("SELECT settings FROM branch_settings WHERE branch_id=:branch_id"), {"branch_id": str(branch_id)}).mappings().one_or_none()
    return dict(row["settings"]) if row and row["settings"] else {}


def _prefix(profile: dict[str, object], document_type: str) -> str:
    configured = profile.get("documentPrefixes")
    if isinstance(configured, dict) and isinstance(configured.get(document_type), str) and configured[document_type].strip():
        candidate = re.sub(r"[^A-Z0-9-]", "", configured[document_type].strip().upper())[:24]
        if candidate:
            return candidate
    return {"INVOICE": "INV", "RECEIPT": "RCP", "GATE_PASS": "GP", "CREDIT_NOTE": "CRN"}[document_type]


def _allocate_number(session, current: TenantScope, branch_id: object, document_type: str, profile: dict[str, object]) -> tuple[str, str, int]:
    fiscal_year = _fiscal_year(datetime.now(timezone.utc))
    # The upsert row lock makes duplicate concurrent allocations impossible.
    sequence = session.execute(text("""
        INSERT INTO document_sequences (tenant_id,branch_id,document_type,fiscal_year,next_value)
        VALUES (:tenant_id,:branch_id,:document_type,:fiscal_year,2)
        ON CONFLICT (tenant_id,branch_id,document_type,fiscal_year) DO UPDATE
            SET next_value=document_sequences.next_value + 1
        RETURNING next_value - 1 AS value
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "document_type": document_type, "fiscal_year": fiscal_year}).scalar_one()
    number = f"{_prefix(profile, document_type)}-{fiscal_year}-{int(sequence):05d}"
    return number, fiscal_year, int(sequence)


def _render_html(document_no: str, document_type: str, snapshot: dict[str, object]) -> str:
    # Both document metadata and every snapshot field may originate with a user.
    # This is a stored artifact, so escaping here is a security boundary, not UI
    # decoration. The JSON remains canonical and the HTML is a safe presentation.
    title = html.escape(document_no, quote=True)
    heading = html.escape(document_type.replace("_", " ").title(), quote=True)
    body = html.escape(json.dumps(snapshot, default=str, sort_keys=True, separators=(",", ":")), quote=False)
    return "".join((
        "<!doctype html><html><meta charset='utf-8'><title>", title, "</title><body>",
        f"<h1>{heading} {title}</h1><pre>", body,
        "</pre></body></html>",
    ))


def _issue_document(session, current: TenantScope, *, job: dict[str, object], document_type: str, snapshot: dict[str, object], predecessor_document_id: int | None = None) -> dict[str, object]:
    profile = _branch_profile(session, job["branch_id"])
    document_no, fiscal_year, sequence = _allocate_number(session, current, job["branch_id"], document_type, profile)
    full_snapshot = {**snapshot, "documentNo": document_no, "documentType": document_type, "fiscalYear": fiscal_year,
                     "branchProfile": profile, "templateVersion": str(profile.get("documentTemplateVersion", "1"))}
    rendered_html = _render_html(document_no, document_type, full_snapshot)
    artifact = rendered_html.encode("utf-8")
    row = session.execute(text("""
        INSERT INTO financial_documents
          (tenant_id,branch_id,job_card_id,document_type,fiscal_year,sequence_value,document_no,template_version,snapshot,rendered_html,artifact,sha256,predecessor_document_id,issued_by)
        VALUES
          (:tenant_id,:branch_id,:job_id,:document_type,:fiscal_year,:sequence_value,:document_no,:template_version,
           CAST(:snapshot AS jsonb),:rendered_html,:artifact,:sha256,:predecessor_document_id,:actor_id)
        RETURNING *
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job["id"],
             "document_type": document_type, "fiscal_year": fiscal_year, "sequence_value": sequence, "document_no": document_no,
             "template_version": full_snapshot["templateVersion"], "snapshot": json.dumps(full_snapshot, default=str),
             "rendered_html": rendered_html, "artifact": artifact, "sha256": hashlib.sha256(artifact).hexdigest(),
             "predecessor_document_id": predecessor_document_id, "actor_id": str(current.actor_id)}).mappings().one()
    return dict(row)


def _document(row: dict[str, object], *, voided: bool = False) -> dict[str, object]:
    return {"id": row["id"], "jobId": row["job_card_id"], "type": row["document_type"], "number": row["document_no"],
            "fiscalYear": row["fiscal_year"], "templateVersion": row["template_version"], "issuedAt": row["issued_at"],
            "voided": voided, "contentPath": f"/api/v1/financial-documents/{row['id']}/content"}


def _download_filename(value: object, extension: str = "") -> str:
    """Keep Content-Disposition a header, never an injection surface."""
    name = re.sub(r"[^A-Za-z0-9._-]", "_", str(value)).strip("._")[:180] or "download"
    return f"{name}{extension}" if extension and not name.endswith(extension) else name


def _voided(session, document_id: int) -> bool:
    return bool(session.execute(text("SELECT 1 FROM financial_document_events WHERE document_id=:document_id AND event_type='VOID'"), {"document_id": document_id}).scalar())


def _invoice(session, invoice_id: int) -> dict[str, object]:
    row = session.execute(text("""SELECT invoice.*, document.document_no, document.fiscal_year, document.template_version, document.issued_at
        FROM invoices invoice JOIN financial_documents document ON document.id=invoice.issued_document_id WHERE invoice.id=:invoice_id"""), {"invoice_id": invoice_id}).mappings().one_or_none()
    if row is None:
        raise auth_error("INVOICE_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    data = dict(row)
    paid = int(session.execute(text("SELECT COALESCE(SUM(amount_paise),0) FROM payments WHERE invoice_id=:invoice_id"), {"invoice_id": invoice_id}).scalar_one())
    credited = int(session.execute(text("SELECT COALESCE(SUM(amount_paise),0) FROM credit_notes WHERE invoice_id=:invoice_id"), {"invoice_id": invoice_id}).scalar_one())
    voided = _voided(session, int(data["issued_document_id"]))
    balance = int(data["total_paise"]) - paid
    lines = [dict(line) for line in session.execute(text("SELECT * FROM invoice_lines WHERE invoice_id=:invoice_id ORDER BY line_no"), {"invoice_id": invoice_id}).mappings().all()]
    return {"id": data["id"], "jobId": data["job_card_id"], "documentId": data["issued_document_id"], "number": data["document_no"],
            "fiscalYear": data["fiscal_year"], "subtotalPaise": data["subtotal_paise"], "discountPaise": data["discount_paise"],
            "taxPaise": data["tax_paise"], "totalPaise": data["total_paise"], "paidPaise": paid, "creditedPaise": credited, "balancePaise": balance,
            "status": "VOID" if voided else "CREDITED" if credited >= int(data["total_paise"]) else "SETTLED" if balance == 0 else "PARTIAL" if paid else "UNPAID", "voided": voided,
            "issuedAt": data["issued_at"], "contentPath": f"/api/v1/financial-documents/{data['issued_document_id']}/content",
            "lines": [{"lineNo": line["line_no"], "description": line["description"], "quantity": line["quantity"], "unitAmountPaise": line["unit_amount_paise"], "gstRateBps": line["gst_rate_bps"], "taxablePaise": line["taxable_paise"], "taxPaise": line["tax_paise"], "totalPaise": line["total_paise"]} for line in lines]}


def _active_invoice(session, job_id: int, *, lock: bool = False) -> dict[str, object] | None:
    statement = """SELECT invoice.* FROM active_invoice_claims claim
       JOIN invoices invoice ON invoice.id=claim.invoice_id
       WHERE claim.job_card_id=:job_id"""
    if lock:
        statement += " FOR UPDATE"
    row = session.execute(text(statement), {"job_id": job_id}).mappings().one_or_none()
    return dict(row) if row else None


def _approved_estimate_snapshot(session, job_id: int) -> dict[str, object]:
    row = session.execute(text("""SELECT approved_snapshot FROM estimates
        WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL
        ORDER BY revision DESC LIMIT 1"""), {"job_id": job_id}).mappings().one_or_none()
    if row is None or not row["approved_snapshot"]:
        raise auth_error("ESTIMATE_APPROVAL_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    snapshot = dict(row["approved_snapshot"])
    if not isinstance(snapshot.get("lines"), list) or not snapshot["lines"]:
        raise auth_error("APPROVED_ESTIMATE_LINES_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return snapshot


def _estimate_calculations(snapshot: dict[str, object], discount_paise: int, gst_kind: str) -> list[dict[str, object]]:
    calculations: list[dict[str, object]] = []
    remaining_discount = discount_paise
    for raw_line in snapshot["lines"]:
        if not isinstance(raw_line, dict):
            raise auth_error("APPROVED_ESTIMATE_INVALID", status.HTTP_422_UNPROCESSABLE_ENTITY)
        try:
            quantity = Decimal(str(raw_line["quantity"]))
            rate = Decimal(str(raw_line["rate"]))
            gst_rate = Decimal(str(raw_line["gstRate"]))
        except (KeyError, ArithmeticError) as error:
            raise auth_error("APPROVED_ESTIMATE_INVALID", status.HTTP_422_UNPROCESSABLE_ENTITY) from error
        description = str(raw_line.get("description", "")).strip()
        if not description or quantity <= 0 or rate < 0 or gst_rate < 0 or gst_rate > 100:
            raise auth_error("APPROVED_ESTIMATE_INVALID", status.HTTP_422_UNPROCESSABLE_ENTITY)
        unit_paise = int((rate * 100).to_integral_value(rounding=ROUND_HALF_UP))
        raw = int((quantity * Decimal(unit_paise)).to_integral_value(rounding=ROUND_HALF_UP))
        discount = min(raw, remaining_discount)
        remaining_discount -= discount
        taxable = raw - discount
        gst_rate_bps = int((gst_rate * 100).to_integral_value(rounding=ROUND_HALF_UP))
        tax = (taxable * gst_rate_bps + 5_000) // 10_000
        calculations.append({"description": description, "quantity": float(quantity), "unitAmountPaise": unit_paise,
                             "gstRateBps": gst_rate_bps, "discountPaise": discount, "taxablePaise": taxable, "taxPaise": tax,
                             "cgstPaise": tax // 2 if gst_kind == "CGST_SGST" else 0,
                             "sgstPaise": tax - tax // 2 if gst_kind == "CGST_SGST" else 0,
                             "igstPaise": tax if gst_kind == "IGST" else 0, "totalPaise": taxable + tax})
    return calculations


@router.get("/jobs/{job_id}/invoices")
def list_job_invoices(job_id: int, scope: ScopedTenant) -> list[dict[str, object]]:
    session, _ = scope
    _permission(scope, mutation=False)
    _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    rows = session.execute(text("SELECT id FROM invoices WHERE job_card_id=:job_id ORDER BY created_at"), {"job_id": job_id}).mappings().all()
    return [_invoice(session, int(row["id"])) for row in rows]


@router.post("/jobs/{job_id}/invoices", status_code=status.HTTP_201_CREATED)
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


@router.post("/invoices/{invoice_id}/void")
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


def _credit_note(session, credit_note_id: int) -> dict[str, object]:
    row = session.execute(text("""SELECT note.*, document.document_no, document.issued_at
        FROM credit_notes note JOIN financial_documents document ON document.id=note.issued_document_id
        WHERE note.id=:id"""), {"id": credit_note_id}).mappings().one_or_none()
    if row is None:
        raise auth_error("CREDIT_NOTE_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    refunded = int(session.execute(text("SELECT COALESCE(SUM(amount_paise),0) FROM refunds WHERE credit_note_id=:id"), {"id": credit_note_id}).scalar_one())
    return {"id": row["id"], "invoiceId": row["invoice_id"], "documentId": row["issued_document_id"], "number": row["document_no"],
            "amountPaise": row["amount_paise"], "reason": row["reason"], "refundedPaise": refunded, "issuedAt": row["issued_at"],
            "contentPath": f"/api/v1/financial-documents/{row['issued_document_id']}/content"}


@router.post("/invoices/{invoice_id}/credit-notes", status_code=status.HTTP_201_CREATED)
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


@router.post("/credit-notes/{credit_note_id}/refunds", status_code=status.HTTP_201_CREATED)
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


@router.post("/invoices/{invoice_id}/payments", status_code=status.HTTP_201_CREATED)
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


def _payment(session, payment_id: int) -> dict[str, object]:
    row = session.execute(text("""SELECT payment.*, document.document_no, document.issued_at FROM payments payment
        JOIN financial_documents document ON document.id=payment.receipt_document_id WHERE payment.id=:payment_id"""), {"payment_id": payment_id}).mappings().one_or_none()
    if row is None:
        raise auth_error("PAYMENT_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return {"id": row["id"], "invoiceId": row["invoice_id"], "receiptDocumentId": row["receipt_document_id"], "receiptNumber": row["document_no"],
            "amountPaise": row["amount_paise"], "method": row["method"], "reference": row["reference"], "payer": row["payer"],
            "receivedAt": row["received_at"], "contentPath": f"/api/v1/financial-documents/{row['receipt_document_id']}/content",
            "supportingAttachmentPath": f"/api/v1/payments/{row['id']}/supporting-attachment" if row["supporting_artifact"] else None}


@router.get("/invoices/{invoice_id}/payments")
def list_payments(invoice_id: int, scope: ScopedTenant) -> list[dict[str, object]]:
    session, _ = scope
    _permission(scope, mutation=False)
    _row_or_404(session, "invoices", invoice_id, "INVOICE_NOT_FOUND")
    return [_payment(session, int(row["id"])) for row in session.execute(text("SELECT id FROM payments WHERE invoice_id=:invoice_id ORDER BY created_at,id"), {"invoice_id": invoice_id}).mappings().all()]


@router.post("/jobs/{job_id}/complete-handover")
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


def _handover(session, row: dict[str, object]) -> dict[str, object]:
    document = _row_or_404(session, "financial_documents", int(row["gate_pass_document_id"]), "GATE_PASS_NOT_FOUND")
    return {"id": row["id"], "jobId": row["job_card_id"], "invoiceId": row["invoice_id"], "gatePassDocumentId": row["gate_pass_document_id"],
            "gatePassNumber": document["document_no"], "deliveredBy": row["delivered_by"], "finalOdometer": row["final_odometer"],
            "acknowledgement": row["acknowledgement"], "handoverAt": row["handover_at"], "contentPath": f"/api/v1/financial-documents/{document['id']}/content"}


@router.get("/jobs/{job_id}/delivery")
def get_delivery(job_id: int, scope: ScopedTenant) -> dict[str, object] | None:
    session, _ = scope
    _permission(scope, mutation=False)
    _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    row = session.execute(text("SELECT * FROM delivery_acknowledgements WHERE job_card_id=:job_id"), {"job_id": job_id}).mappings().one_or_none()
    return _handover(session, dict(row)) if row else None


@router.get("/financial-documents/{document_id}/content")
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


@router.get("/payments/{payment_id}/supporting-attachment")
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
