"""Authoritative technician work, evidence attachment, and QC command API.

Files are stored as bounded ``bytea`` records instead of browser-only URLs.
Every row is tenant/branch scoped by both the request's trusted RLS context and
the table policies created in revision 0010.
"""

from __future__ import annotations

import base64
import binascii
import hashlib
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


router = APIRouter(prefix="/api/v1", tags=["technician execution"])

AttachmentCategory = Literal["before_work", "after_work", "work_evidence", "qc_evidence"]
WorkUpdateKind = Literal["progress", "blocker", "completion", "rework"]
QcOutcome = Literal["pass", "fail"]
TaskCommand = Literal["start", "pause", "resume", "complete", "cancel"]
MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = frozenset({"image/jpeg", "image/png", "image/webp", "application/pdf"})


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class TaskCreate(ApiModel):
    technician_id: UUID = Field(alias="technicianId")
    title: Annotated[str, Field(min_length=1, max_length=500)]
    instructions: Annotated[str, Field(max_length=8000)] = ""


class TaskCommandInput(ApiModel):
    reason: Annotated[str, Field(max_length=4000)] = ""


class WorkUpdateCreate(ApiModel):
    task_id: Annotated[int, Field(gt=0)] = Field(alias="taskId")
    body: Annotated[str, Field(min_length=1, max_length=8000)]
    kind: WorkUpdateKind = "progress"


class AttachmentCreate(ApiModel):
    category: AttachmentCategory
    filename: Annotated[str, Field(min_length=1, max_length=500)]
    content_type: Annotated[str, Field(min_length=1, max_length=120)] = Field(alias="contentType")
    data_base64: Annotated[str, Field(min_length=1, max_length=14_000_000)] = Field(alias="dataBase64")
    caption: Annotated[str, Field(max_length=4000)] = ""


class QcCheckCreate(ApiModel):
    label: Annotated[str, Field(min_length=1, max_length=1000)]
    required: bool = True


class QcResultCreate(ApiModel):
    outcome: QcOutcome
    note: Annotated[str, Field(max_length=4000)] = ""
    rework_technician_id: UUID | None = Field(default=None, alias="reworkTechnicianId")


def _is_owner(current: TenantScope) -> bool:
    return any(name == "Owner/Admin" for _, name, _ in current.roles)


def _permission(scope: ScopedTenant, *, pages: tuple[str, ...], mutation: bool) -> TenantScope:
    """Grant only page permissions, with the configured Owner/Admin override."""
    _, current = scope
    if _is_owner(current):
        if mutation:
            try:
                require_mutation_allowed(current)
            except PermissionError as error:
                raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error
        return current
    verb = "write" if mutation else "read"
    return _require_any(scope, tuple(f"page.{page}.{verb}" for page in pages), mutation=mutation)


def _task_assignment_permission(scope: ScopedTenant) -> TenantScope:
    """Only a job-card manager (or Owner/Admin) may assign work to a technician."""
    _, current = scope
    if _is_owner(current):
        try:
            require_mutation_allowed(current)
        except PermissionError as error:
            raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error
        return current
    return _require_any(scope, ("page.job-card.write",), mutation=True)


def _task(row: dict[str, object]) -> dict[str, object]:
    return {
        "id": row["id"], "jobId": row["job_card_id"], "branchId": str(row["branch_id"]),
        "technicianId": str(row["assigned_technician_id"]), "sourceQcCheckId": row["source_qc_check_id"],
        "title": row["title"], "instructions": row["instructions"], "status": row["status"],
        "startedAt": row["started_at"], "completedAt": row["completed_at"],
        "createdAt": row["created_at"], "updatedAt": row["updated_at"],
    }


def _update(row: dict[str, object]) -> dict[str, object]:
    return {"id": row["id"], "jobId": row["job_card_id"], "taskId": row["technician_task_id"], "body": row["body"], "kind": row["kind"], "actorId": str(row["actor_id"]), "createdAt": row["created_at"]}


def _attachment(row: dict[str, object]) -> dict[str, object]:
    return {"id": row["id"], "jobId": row["job_card_id"], "category": row["category"].lower(), "filename": row["filename"], "contentType": row["content_type"], "byteSize": row["byte_size"], "caption": row["caption"], "createdBy": str(row["created_by"]), "createdAt": row["created_at"], "contentPath": f"/api/v1/job-attachments/{row['id']}/content"}


def _qc_check(session, row: dict[str, object]) -> dict[str, object]:
    results = [
        {"id": result["id"], "outcome": result["outcome"].lower(), "note": result["note"], "actorId": str(result["actor_id"]), "createdAt": result["created_at"]}
        for result in session.execute(text("SELECT * FROM qc_results WHERE qc_check_id=:check_id ORDER BY id"), {"check_id": row["id"]}).mappings().all()
    ]
    return {"id": row["id"], "jobId": row["job_card_id"], "label": row["label"], "required": row["required"], "status": row["status"].lower(), "createdAt": row["created_at"], "updatedAt": row["updated_at"], "results": results}


def _active_job(job: dict[str, object]) -> None:
    if job["status"] not in ("IN_PROGRESS", "HOLD"):
        raise auth_error("EXECUTION_JOB_NOT_ACTIVE", status.HTTP_422_UNPROCESSABLE_ENTITY)


def _assert_task_actor(current: TenantScope, task: dict[str, object]) -> None:
    if _is_owner(current) or str(task["assigned_technician_id"]) == str(current.actor_id):
        return
    raise auth_error("TASK_ASSIGNMENT_REQUIRED", status.HTTP_403_FORBIDDEN)


def _assert_job_execution_actor(session, current: TenantScope, job_id: int) -> None:
    if _is_owner(current):
        return
    assigned = session.execute(text("SELECT 1 FROM technician_tasks WHERE job_card_id=:job_id AND assigned_technician_id=:actor_id"), {"job_id": job_id, "actor_id": str(current.actor_id)}).scalar()
    if not assigned:
        raise auth_error("TASK_ASSIGNMENT_REQUIRED", status.HTTP_403_FORBIDDEN)


def _assert_technician(session, current: TenantScope, branch_id: object, technician_id: UUID) -> None:
    active = session.execute(text("""
        SELECT 1 FROM tenant_memberships AS membership
        JOIN membership_branches AS assignment ON assignment.membership_id=membership.id
        JOIN membership_roles AS member_role ON member_role.membership_id=membership.id
        JOIN tenant_roles AS role ON role.id=member_role.role_id
        WHERE membership.tenant_id=:tenant_id AND membership.user_id=:technician_id
          AND membership.status='ACTIVE' AND assignment.branch_id=:branch_id
          AND role.status='ACTIVE' AND role.name='Technician'
    """), {"tenant_id": str(current.tenant_id), "technician_id": str(technician_id), "branch_id": str(branch_id)}).scalar()
    if not active:
        raise auth_error("TECHNICIAN_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)


def _decode_attachment(data_base64: str, content_type: str) -> bytes:
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise auth_error("ATTACHMENT_CONTENT_TYPE_INVALID", status.HTTP_422_UNPROCESSABLE_ENTITY)
    try:
        encoded = data_base64.split(",", 1)[1] if data_base64.startswith("data:") else data_base64
        data = base64.b64decode(encoded, validate=True)
    except (ValueError, binascii.Error) as error:
        raise auth_error("ATTACHMENT_DATA_INVALID", status.HTTP_422_UNPROCESSABLE_ENTITY) from error
    if not data or len(data) > MAX_ATTACHMENT_BYTES:
        raise auth_error("ATTACHMENT_SIZE_INVALID", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return data


def _job_execution(session, job_id: int) -> dict[str, object]:
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    tasks = [_task(dict(row)) for row in session.execute(text("SELECT * FROM technician_tasks WHERE job_card_id=:job_id ORDER BY id"), {"job_id": job_id}).mappings().all()]
    updates = [_update(dict(row)) for row in session.execute(text("SELECT * FROM work_updates WHERE job_card_id=:job_id ORDER BY id"), {"job_id": job_id}).mappings().all()]
    attachments = [_attachment(dict(row)) for row in session.execute(text("SELECT id,job_card_id,category,filename,content_type,byte_size,caption,created_by,created_at FROM job_attachments WHERE job_card_id=:job_id ORDER BY id"), {"job_id": job_id}).mappings().all()]
    checks = [_qc_check(session, dict(row)) for row in session.execute(text("SELECT * FROM qc_checks WHERE job_card_id=:job_id ORDER BY id"), {"job_id": job_id}).mappings().all()]
    return {"job": _job(job), "tasks": tasks, "updates": updates, "attachments": attachments, "qcChecks": checks}


@router.get("/technician-tasks/mine")
def list_my_tasks(scope: ScopedTenant) -> list[dict[str, object]]:
    session, current = scope
    _permission(scope, pages=("my-tasks",), mutation=False)
    statement = "SELECT * FROM technician_tasks"
    parameters: dict[str, object] = {}
    if not _is_owner(current):
        statement += " WHERE assigned_technician_id=:actor_id"
        parameters["actor_id"] = str(current.actor_id)
    rows = session.execute(text(statement + " ORDER BY CASE status WHEN 'IN_PROGRESS' THEN 0 WHEN 'PENDING' THEN 1 WHEN 'PAUSED' THEN 2 ELSE 3 END, created_at DESC, id DESC"), parameters).mappings().all()
    return [_task(dict(row)) for row in rows]


@router.get("/jobs/{job_id}/execution")
def get_job_execution(job_id: int, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, pages=("my-tasks", "work-update", "qc-prep"), mutation=False)
    _assert_job_execution_actor(session, current, job_id)
    return _job_execution(session, job_id)


@router.post("/jobs/{job_id}/technician-tasks", status_code=status.HTTP_201_CREATED)
def create_task(job_id: int, input: TaskCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _task_assignment_permission(scope)
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    _active_job(job)
    _assert_technician(session, current, job["branch_id"], input.technician_id)
    row = session.execute(text("""
        INSERT INTO technician_tasks (tenant_id,branch_id,job_card_id,assigned_technician_id,title,instructions,status,created_by,updated_by)
        VALUES (:tenant_id,:branch_id,:job_id,:technician_id,:title,:instructions,'PENDING',:actor_id,:actor_id) RETURNING *
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job_id, "technician_id": str(input.technician_id), "title": input.title.strip(), "instructions": input.instructions.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _task(dict(row))
    _audit(session, current, "TECHNICIAN_TASK_CREATED", f"Task assigned: {payload['title']}", {}, payload)
    return payload


@router.post("/technician-tasks/{task_id}/commands/{command}")
def command_task(task_id: int, command: TaskCommand, input: TaskCommandInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None) -> dict[str, object]:
    session, current = scope
    _permission(scope, pages=("my-tasks", "work-update"), mutation=True)
    task = _row_or_404(session, "technician_tasks", task_id, "TASK_NOT_FOUND")
    _assert_task_actor(current, task)
    job = _row_or_404(session, "job_cards", int(task["job_card_id"]), "JOB_NOT_FOUND")
    _active_job(job)
    if request_key and session.execute(text("SELECT 1 FROM work_updates WHERE technician_task_id=:task_id AND kind='COMPLETION' AND body=:marker"), {"task_id": task_id, "marker": f"idempotency:{request_key.strip()}"}).scalar():
        return _task(task)
    transitions = {
        "start": ("PENDING", "IN_PROGRESS"), "pause": ("IN_PROGRESS", "PAUSED"),
        "resume": ("PAUSED", "IN_PROGRESS"), "complete": ("IN_PROGRESS", "COMPLETED"),
        "cancel": ("PENDING", "CANCELLED"),
    }
    expected, target = transitions[command]
    reason = input.reason.strip()
    if command in ("pause", "cancel") and not reason:
        raise auth_error("TASK_COMMAND_REASON_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if task["status"] != expected:
        raise auth_error("INVALID_TASK_TRANSITION", status.HTTP_422_UNPROCESSABLE_ENTITY)
    before = _task(task)
    row = session.execute(text("""
        UPDATE technician_tasks SET status=:status, started_at=CASE WHEN :command='start' THEN now() ELSE started_at END,
            completed_at=CASE WHEN :command='complete' THEN now() ELSE completed_at END, updated_by=:actor_id, updated_at=now()
        WHERE id=:task_id RETURNING *
    """), {"status": target, "command": command, "actor_id": str(current.actor_id), "task_id": task_id}).mappings().one()
    if command == "complete":
        body = f"idempotency:{request_key.strip()}" if request_key else (reason or f"Task completed: {task['title']}")
        session.execute(text("""
            INSERT INTO work_updates (tenant_id,branch_id,job_card_id,technician_task_id,body,kind,actor_id)
            VALUES (:tenant_id,:branch_id,:job_id,:task_id,:body,'COMPLETION',:actor_id)
        """), {"tenant_id": str(current.tenant_id), "branch_id": str(task["branch_id"]), "job_id": task["job_card_id"], "task_id": task_id, "body": body, "actor_id": str(current.actor_id)})
    payload = _task(dict(row))
    _audit(session, current, "TECHNICIAN_TASK_COMMAND", f"{command}: {reason or 'No reason required'}", before, payload)
    return payload


@router.post("/jobs/{job_id}/work-updates", status_code=status.HTTP_201_CREATED)
def create_work_update(job_id: int, input: WorkUpdateCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, pages=("work-update",), mutation=True)
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    _active_job(job)
    task = _row_or_404(session, "technician_tasks", input.task_id, "TASK_NOT_FOUND")
    if int(task["job_card_id"]) != job_id:
        raise auth_error("TASK_JOB_MISMATCH", status.HTTP_422_UNPROCESSABLE_ENTITY)
    _assert_task_actor(current, task)
    if task["status"] not in ("IN_PROGRESS", "PAUSED"):
        raise auth_error("TASK_NOT_ACTIVE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""
        INSERT INTO work_updates (tenant_id,branch_id,job_card_id,technician_task_id,body,kind,actor_id)
        VALUES (:tenant_id,:branch_id,:job_id,:task_id,:body,:kind,:actor_id) RETURNING *
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job_id, "task_id": input.task_id, "body": input.body.strip(), "kind": input.kind.upper(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _update(dict(row))
    _audit(session, current, "WORK_UPDATE_RECORDED", input.kind, {}, payload)
    return payload


@router.post("/jobs/{job_id}/attachments", status_code=status.HTTP_201_CREATED)
def create_attachment(job_id: int, input: AttachmentCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, pages=("work-update", "qc-prep"), mutation=True)
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    _active_job(job)
    _assert_job_execution_actor(session, current, job_id)
    content = _decode_attachment(input.data_base64, input.content_type)
    digest = hashlib.sha256(content).hexdigest()
    existing = session.execute(text("SELECT id FROM job_attachments WHERE job_card_id=:job_id AND sha256=:sha256"), {"job_id": job_id, "sha256": digest}).scalar()
    if existing:
        raise auth_error("ATTACHMENT_DUPLICATE", status.HTTP_409_CONFLICT)
    row = session.execute(text("""
        INSERT INTO job_attachments (tenant_id,branch_id,job_card_id,category,filename,content_type,byte_size,sha256,caption,content,created_by)
        VALUES (:tenant_id,:branch_id,:job_id,:category,:filename,:content_type,:byte_size,:sha256,:caption,:content,:actor_id) RETURNING id,job_card_id,category,filename,content_type,byte_size,caption,created_by,created_at
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job_id, "category": input.category.upper(), "filename": input.filename.strip(), "content_type": input.content_type, "byte_size": len(content), "sha256": digest, "caption": input.caption.strip(), "content": content, "actor_id": str(current.actor_id)}).mappings().one()
    payload = _attachment(dict(row))
    _audit(session, current, "JOB_ATTACHMENT_CREATED", f"{input.category}: {input.filename.strip()}", {}, {key: value for key, value in payload.items() if key != "contentPath"})
    return payload


@router.get("/job-attachments/{attachment_id}/content")
def get_attachment_content(attachment_id: int, scope: ScopedTenant) -> Response:
    session, current = scope
    _permission(scope, pages=("my-tasks", "work-update", "qc-prep"), mutation=False)
    row = _row_or_404(session, "job_attachments", attachment_id, "ATTACHMENT_NOT_FOUND")
    _assert_job_execution_actor(session, current, int(row["job_card_id"]))
    return Response(content=bytes(row["content"]), media_type=str(row["content_type"]), headers={"Content-Disposition": f'inline; filename="{str(row["filename"]).replace(chr(34), "")}"', "X-Content-Type-Options": "nosniff"})


@router.post("/jobs/{job_id}/qc-checks", status_code=status.HTTP_201_CREATED)
def create_qc_check(job_id: int, input: QcCheckCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, pages=("qc-prep", "job-card"), mutation=True)
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    _active_job(job)
    _assert_job_execution_actor(session, current, job_id)
    row = session.execute(text("""
        INSERT INTO qc_checks (tenant_id,branch_id,job_card_id,label,required,status,created_by)
        VALUES (:tenant_id,:branch_id,:job_id,:label,:required,'PENDING',:actor_id) RETURNING *
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job_id, "label": input.label.strip(), "required": input.required, "actor_id": str(current.actor_id)}).mappings().one()
    payload = _qc_check(session, dict(row))
    _audit(session, current, "QC_CHECK_CREATED", payload["label"], {}, payload)
    return payload


@router.post("/qc-checks/{check_id}/result")
def record_qc_result(check_id: int, input: QcResultCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    _permission(scope, pages=("qc-prep",), mutation=True)
    check = _row_or_404(session, "qc_checks", check_id, "QC_CHECK_NOT_FOUND")
    job = _row_or_404(session, "job_cards", int(check["job_card_id"]), "JOB_NOT_FOUND")
    _active_job(job)
    _assert_job_execution_actor(session, current, int(check["job_card_id"]))
    if input.outcome == "pass" and check["status"] == "FAILED":
        unresolved_rework = session.execute(text("SELECT 1 FROM technician_tasks WHERE source_qc_check_id=:check_id AND status<>'COMPLETED'"), {"check_id": check_id}).scalar()
        if unresolved_rework:
            raise auth_error("QC_REWORK_NOT_COMPLETED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if input.outcome == "fail" and not input.note.strip():
        raise auth_error("QC_FAIL_REASON_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    before = _qc_check(session, check)
    result = session.execute(text("""
        INSERT INTO qc_results (tenant_id,branch_id,job_card_id,qc_check_id,outcome,note,actor_id)
        VALUES (:tenant_id,:branch_id,:job_id,:check_id,:outcome,:note,:actor_id) RETURNING *
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job["id"], "check_id": check_id, "outcome": input.outcome.upper(), "note": input.note.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    session.execute(text("UPDATE qc_checks SET status=:status,updated_at=now() WHERE id=:check_id"), {"status": "PASSED" if input.outcome == "pass" else "FAILED", "check_id": check_id})
    rework = None
    if input.outcome == "fail":
        technician_id = input.rework_technician_id or (current.actor_id if not _is_owner(current) else None)
        if technician_id is None:
            raise auth_error("REWORK_TECHNICIAN_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
        _assert_technician(session, current, job["branch_id"], technician_id)
        rework_row = session.execute(text("""
            INSERT INTO technician_tasks (tenant_id,branch_id,job_card_id,assigned_technician_id,source_qc_check_id,title,instructions,status,created_by,updated_by)
            VALUES (:tenant_id,:branch_id,:job_id,:technician_id,:check_id,:title,:instructions,'PENDING',:actor_id,:actor_id) RETURNING *
        """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job["id"], "technician_id": str(technician_id), "check_id": check_id, "title": f"Rework: {check['label']}", "instructions": input.note.strip(), "actor_id": str(current.actor_id)}).mappings().one()
        rework = _task(dict(rework_row))
        session.execute(text("""
            INSERT INTO job_events (tenant_id,branch_id,job_card_id,command,from_status,to_status,reason,actor_id)
            VALUES (:tenant_id,:branch_id,:job_id,'qc-failed-rework',:status,:status,:reason,:actor_id)
        """), {"tenant_id": str(current.tenant_id), "branch_id": str(job["branch_id"]), "job_id": job["id"], "status": job["status"], "reason": input.note.strip(), "actor_id": str(current.actor_id)})
    payload = _qc_check(session, _row_or_404(session, "qc_checks", check_id, "QC_CHECK_NOT_FOUND"))
    _audit(session, current, "QC_RESULT_RECORDED", input.outcome, before, {"check": payload, "reworkTask": rework, "resultId": result["id"]})
    return {"check": payload, "reworkTask": rework}
