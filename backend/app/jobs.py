"""Tenant- and branch-scoped Job Card and Estimate command API.

The browser keeps its SQLite demo workflow for local/offline use.  This router
is the authoritative online boundary: every mutable operation is a named
command, rather than an unrestricted update of a job or estimate row.
"""

from __future__ import annotations

import json
from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Header, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.intake import _branch, _clean, _require_any
from app.tenant_admin import _audit
from app.tenancy import TenantScope


router = APIRouter(prefix="/api/v1", tags=["jobs"])

JobStatus = Literal["NEW", "IN_PROGRESS", "HOLD", "COMPLETED", "CANCELLED", "CLOSED"]
DecisionOutcome = Literal["approved", "declined"]
DecisionChannel = Literal["in_person", "phone", "whatsapp", "email", "other"]


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class JobCreate(ApiModel):
    visit_id: Annotated[int, Field(gt=0)] = Field(alias="visitId")
    advisor_id: UUID | None = Field(default=None, alias="advisorId")
    branch_id: UUID | None = Field(default=None, alias="branchId")
    work_list: Annotated[str, Field(max_length=8000)] = Field(default="", alias="workList")
    promised_at: datetime | None = Field(default=None, alias="promisedAt")


class EstimateLine(ApiModel):
    kind: Annotated[str, Field(min_length=1, max_length=40)] = "labour"
    description: Annotated[str, Field(min_length=1, max_length=1000)]
    quantity: Annotated[float, Field(gt=0, le=100000)]
    rate: Annotated[float, Field(ge=0, le=100000000)]
    gst_rate: Annotated[float, Field(ge=0, le=100)] = Field(default=18, alias="gstRate")


class EstimateCreate(ApiModel):
    discount: Annotated[float, Field(ge=0, le=100000000)] = 0
    gst_rate: Annotated[float, Field(ge=0, le=100)] = Field(default=18, alias="gstRate")
    note: Annotated[str, Field(max_length=4000)] = ""
    lines: Annotated[list[EstimateLine], Field(min_length=1, max_length=250)]


class EstimateDecision(ApiModel):
    outcome: DecisionOutcome
    channel: DecisionChannel
    decided_at: datetime = Field(alias="decidedAt")
    note: Annotated[str, Field(max_length=4000)] = ""


class JobCommand(ApiModel):
    reason: Annotated[str, Field(max_length=4000)] = ""


def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:
    return _require_any(
        scope,
        ("page.job-card.write" if mutation else "page.job-card.read", "page.estimate.write" if mutation else "page.estimate.read", "page.my-queue.write" if mutation else "page.my-queue.read", "page.jobs.write" if mutation else "page.jobs.read"),
        mutation=mutation,
    )


def _row_or_404(session, table: str, record_id: int, code: str) -> dict[str, object]:
    row = session.execute(text(f"SELECT * FROM {table} WHERE id = :id"), {"id": record_id}).mappings().one_or_none()
    if row is None:
        raise auth_error(code, status.HTTP_404_NOT_FOUND)
    return dict(row)


def _job(row: dict[str, object]) -> dict[str, object]:
    return {
        "id": row["id"], "jobNo": row["job_no"], "visitId": row["visit_id"],
        "branchId": str(row["branch_id"]), "advisorId": str(row["advisor_id"]) if row["advisor_id"] else None,
        "status": row["status"], "workList": row["work_list"], "promisedAt": row["promised_at"],
        "createdAt": row["created_at"], "updatedAt": row["updated_at"],
    }


def _estimate(row: dict[str, object], lines: list[dict[str, object]] | None = None) -> dict[str, object]:
    return {
        "id": row["id"], "jobId": row["job_card_id"], "revision": row["revision"], "status": row["status"],
        "discount": float(row["discount"]), "gstRate": float(row["gst_rate"]), "note": row["note"],
        "supersededAt": row["superseded_at"], "approvedSnapshot": row["approved_snapshot"],
        "createdAt": row["created_at"], "updatedAt": row["updated_at"],
        **({"lines": lines} if lines is not None else {}),
    }


def _line(row: dict[str, object]) -> dict[str, object]:
    return {"id": row["id"], "kind": row["kind"], "description": row["description"], "quantity": float(row["quantity"]), "rate": float(row["rate"]), "gstRate": float(row["gst_rate"])}


def _estimate_with_lines(session, estimate_id: int) -> dict[str, object]:
    estimate = _row_or_404(session, "estimates", estimate_id, "ESTIMATE_NOT_FOUND")
    lines = [
        _line(dict(row))
        for row in session.execute(text("SELECT * FROM estimate_lines WHERE estimate_id=:estimate_id ORDER BY line_no, id"), {"estimate_id": estimate_id}).mappings().all()
    ]
    return _estimate(estimate, lines)


def _job_with_estimates(session, job_id: int) -> dict[str, object]:
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    estimates = [_estimate_with_lines(session, int(row["id"])) for row in session.execute(text("SELECT id FROM estimates WHERE job_card_id=:job_id ORDER BY revision"), {"job_id": job_id}).mappings().all()]
    events = [
        {"id": row["id"], "command": row["command"], "fromStatus": row["from_status"], "toStatus": row["to_status"], "reason": row["reason"], "requestKey": row["request_key"], "at": row["created_at"]}
        for row in session.execute(text("SELECT * FROM job_events WHERE job_card_id=:job_id ORDER BY id"), {"job_id": job_id}).mappings().all()
    ]
    return {**_job(job), "estimates": estimates, "events": events}


def _assert_job_actor(current: TenantScope, job: dict[str, object]) -> None:
    """Tenant Admin has all granted page authority; advisors own assigned jobs."""
    if any(name == "Owner/Admin" for _, name, _ in current.roles):
        return
    if job["advisor_id"] is not None and str(job["advisor_id"]) == str(current.actor_id):
        return
    raise auth_error("JOB_ASSIGNMENT_REQUIRED", status.HTTP_403_FORBIDDEN)


def _assert_active_advisor(session, current: TenantScope, branch_id: UUID, advisor_id: UUID) -> None:
    """An assignment is only valid for an active member of this Tenant/Branch."""
    advisor = session.execute(text("""
        SELECT 1 FROM tenant_memberships AS membership
        JOIN membership_branches AS assigned ON assigned.membership_id=membership.id
        WHERE membership.tenant_id=:tenant_id AND membership.user_id=:advisor_id
          AND membership.status='ACTIVE' AND assigned.branch_id=:branch_id
    """), {"tenant_id": str(current.tenant_id), "advisor_id": str(advisor_id), "branch_id": str(branch_id)}).scalar()
    if not advisor:
        raise auth_error("ADVISOR_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)


def _branch_requires_approval(session, branch_id: object) -> bool:
    row = session.execute(text("SELECT settings FROM branch_settings WHERE branch_id=:branch_id"), {"branch_id": str(branch_id)}).mappings().one_or_none()
    settings = dict(row["settings"]) if row and row["settings"] else {}
    return bool(settings.get("requireEstimateApproval", False))


@router.get("/jobs")
def list_jobs(scope: ScopedTenant, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope
    _permission(scope, mutation=False)
    if branch_id is not None:
        _branch(current, branch_id)
    rows = session.execute(text("""
        SELECT * FROM job_cards WHERE (:branch_id IS NULL OR branch_id=:branch_id)
        ORDER BY created_at DESC, id DESC
    """), {"branch_id": str(branch_id) if branch_id else None}).mappings().all()
    return [_job_with_estimates(session, int(row["id"])) for row in rows]


@router.get("/jobs/{job_id}")
def get_job(job_id: int, scope: ScopedTenant) -> dict[str, object]:
    session, _ = scope
    _permission(scope, mutation=False)
    return _job_with_estimates(session, job_id)


@router.post("/jobs", status_code=status.HTTP_201_CREATED)
def create_job(input: JobCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    branch_id = _branch(_permission(scope, mutation=True), input.branch_id)
    visit = _row_or_404(session, "visits", input.visit_id, "VISIT_NOT_FOUND")
    if visit["branch_id"] != branch_id or visit["archived_at"] is not None:
        raise auth_error("VISIT_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    existing = session.execute(text("SELECT id FROM job_cards WHERE visit_id=:visit_id"), {"visit_id": input.visit_id}).mappings().one_or_none()
    if existing:
        raise auth_error("VISIT_ALREADY_HAS_JOB", status.HTTP_409_CONFLICT)
    advisor_id = input.advisor_id or current.actor_id
    _assert_active_advisor(session, current, branch_id, advisor_id)
    row = session.execute(text("""
        INSERT INTO job_cards (tenant_id, branch_id, job_no, visit_id, advisor_id, status, work_list, promised_at, created_by, updated_by)
        VALUES (:tenant_id,:branch_id,'PENDING',:visit_id,:advisor_id,'NEW',:work_list,:promised_at,:actor_id,:actor_id)
        RETURNING *
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "visit_id": input.visit_id,
             "advisor_id": str(advisor_id), "work_list": input.work_list.strip(),
             "promised_at": input.promised_at, "actor_id": str(current.actor_id)}).mappings().one()
    row = session.execute(text("UPDATE job_cards SET job_no=:job_no, updated_at=now() WHERE id=:id RETURNING *"), {"id": row["id"], "job_no": f"JC-{int(row['id']):06d}"}).mappings().one()
    payload = _job(dict(row))
    _audit(session, current, "JOB_CREATED", "Job created from visit", {}, payload)
    return payload


@router.post("/jobs/{job_id}/estimates", status_code=status.HTTP_201_CREATED)
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


@router.post("/estimates/{estimate_id}/decision")
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


_COMMANDS: dict[str, tuple[set[str], str, bool]] = {
    "start-work": ({"NEW"}, "IN_PROGRESS", False),
    "hold-job": ({"IN_PROGRESS"}, "HOLD", True),
    "resume-work": ({"HOLD"}, "IN_PROGRESS", True),
    "cancel-job": ({"NEW", "IN_PROGRESS", "HOLD"}, "CANCELLED", True),
    "start-rework": ({"COMPLETED"}, "IN_PROGRESS", True),
    "complete-work": ({"IN_PROGRESS"}, "COMPLETED", False),
}


def _completion_prerequisites(session, job_id: int) -> tuple[str, ...]:
    """Return authoritative blockers for the final operational transition.

    The Estimate slice owns the first assertion now.  Material issuance, work
    evidence, QC and invoice records are deliberately not browser-provided
    flags: their command slices (#65--#68) must write those facts before this
    transition may be enabled.  Until then the command is safely fail-closed.
    """
    blockers: list[str] = []
    approved = session.execute(text("""
        SELECT 1 FROM estimates
        WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL
    """), {"job_id": job_id}).scalar()
    if not approved:
        blockers.append("ESTIMATE_APPROVAL_REQUIRED")
    # Work and QC are persisted by the technician execution slice.  Completion
    # deliberately queries those facts here instead of accepting client flags.
    work_evidence = session.execute(text("SELECT 1 FROM work_updates WHERE job_card_id=:job_id LIMIT 1"), {"job_id": job_id}).scalar()
    if not work_evidence:
        blockers.append("WORK_EVIDENCE_REQUIRED")
    unfinished_tasks = session.execute(text("""
        SELECT 1 FROM technician_tasks
        WHERE job_card_id=:job_id AND status NOT IN ('COMPLETED','CANCELLED') LIMIT 1
    """), {"job_id": job_id}).scalar()
    if unfinished_tasks:
        blockers.append("TECHNICIAN_TASKS_UNRESOLVED")
    required_qc = session.execute(text("SELECT 1 FROM qc_checks WHERE job_card_id=:job_id AND required LIMIT 1"), {"job_id": job_id}).scalar()
    failed_qc = session.execute(text("SELECT 1 FROM qc_checks WHERE job_card_id=:job_id AND required AND status='FAILED' LIMIT 1"), {"job_id": job_id}).scalar()
    pending_qc = session.execute(text("SELECT 1 FROM qc_checks WHERE job_card_id=:job_id AND required AND status<>'PASSED' LIMIT 1"), {"job_id": job_id}).scalar()
    if not required_qc or pending_qc:
        blockers.append("QC_REQUIRED" if not failed_qc else "QC_REWORK_REQUIRED")
    # Materials are resolved only when each reservation has reached its
    # database-derived final state. The invoice check intentionally queries
    # the immutable issued-document path rather than a browser status flag.
    unresolved_materials = session.execute(text("""
        SELECT 1 FROM material_reservations
        WHERE job_card_id=:job_id AND status NOT IN ('ISSUED','RELEASED') LIMIT 1
    """), {"job_id": job_id}).scalar()
    if unresolved_materials:
        blockers.append("MATERIALS_UNRESOLVED")
    issued_invoice = session.execute(text("""
        SELECT 1 FROM invoices invoice
        WHERE invoice.job_card_id=:job_id
          AND NOT EXISTS (
              SELECT 1 FROM financial_document_events event
              WHERE event.document_id=invoice.issued_document_id AND event.event_type='VOID'
          )
        LIMIT 1
    """), {"job_id": job_id}).scalar()
    if not issued_invoice:
        blockers.append("INVOICE_REQUIRED")
    return tuple(blockers)


@router.post("/jobs/{job_id}/commands/{command}")
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
