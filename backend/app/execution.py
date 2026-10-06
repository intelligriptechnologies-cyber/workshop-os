"""Authoritative technician task, evidence, and QC commands."""

from __future__ import annotations

import hashlib
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, File, Form, UploadFile, status
from fastapi.responses import Response
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.intake import _require_any
from app.jobs import _row_or_404
from app.tenant_admin import _audit

router = APIRouter(prefix="/api/v1", tags=["execution"])
TaskStatus = Literal["PENDING", "IN_PROGRESS", "BLOCKED", "COMPLETED", "CANCELLED"]
QcOutcome = Literal["FAILED", "PASSED"]


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class TaskCreate(ApiModel):
    job_id: int = Field(alias="jobId", gt=0)
    assigned_to: UUID = Field(alias="assignedTo")
    title: str = Field(min_length=1, max_length=1000)
    notes: str = Field(default="", max_length=4000)


class TaskUpdate(ApiModel):
    status: TaskStatus
    note: str = Field(default="", max_length=4000)


class QcCheckCreate(ApiModel):
    job_id: int = Field(alias="jobId", gt=0)
    label: str = Field(min_length=1, max_length=1000)
    required: bool = True


class QcResult(ApiModel):
    outcome: QcOutcome
    note: str = Field(default="", max_length=4000)


def _permission(scope: ScopedTenant, mutation: bool) -> None:
    _require_any(scope, (("page.my-tasks.write" if mutation else "page.my-tasks.read"), ("page.work-update.write" if mutation else "page.work-update.read"), ("page.qc-prep.write" if mutation else "page.qc-prep.read")), mutation=mutation)


def _task(row: dict[str, object]) -> dict[str, object]:
    return {"id": row["id"], "jobId": row["job_card_id"], "assignedTo": str(row["assigned_to"]), "title": row["title"], "notes": row["notes"], "status": row["status"], "completedAt": row["completed_at"], "updatedAt": row["updated_at"]}


@router.get("/technician-tasks")
def list_my_tasks(scope: ScopedTenant) -> list[dict[str, object]]:
    session, current = scope; _permission(scope, False)
    rows = session.execute(text("SELECT * FROM technician_tasks WHERE assigned_to=:actor ORDER BY updated_at DESC,id DESC"), {"actor": str(current.actor_id)}).mappings().all()
    return [_task(dict(row)) for row in rows]


@router.post("/technician-tasks", status_code=status.HTTP_201_CREATED)
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


@router.post("/technician-tasks/{task_id}/update")
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


@router.post("/work-updates/{update_id}/attachments", status_code=status.HTTP_201_CREATED)
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


@router.get("/attachments/{attachment_id}/content")
def read_attachment(attachment_id: int, scope: ScopedTenant) -> Response:
    """Return attachment bytes only after the request's RLS scope has found it."""
    session, _ = scope; _permission(scope, False)
    row = _row_or_404(session, "evidence_attachments", attachment_id, "ATTACHMENT_NOT_FOUND")
    return Response(
        content=bytes(row["content"]),
        media_type=str(row["content_type"]),
        headers={"Content-Disposition": f'attachment; filename="{str(row["filename"]).replace(chr(34), "")}"'},
    )


@router.post("/qc-checks", status_code=status.HTTP_201_CREATED)
def create_qc_check(input: QcCheckCreate, scope: ScopedTenant) -> dict[str, object]:
    session,current=scope; _permission(scope,True); job=_row_or_404(session,"job_cards",input.job_id,"JOB_NOT_FOUND")
    if job["status"] not in {"IN_PROGRESS", "HOLD"}: raise auth_error("QC_NOT_AVAILABLE_FOR_JOB_STATUS", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row=session.execute(text("INSERT INTO qc_checks (tenant_id,branch_id,job_card_id,label,required,created_by) VALUES (:tenant,:branch,:job,:label,:required,:actor) RETURNING *"),{"tenant":str(current.tenant_id),"branch":str(job["branch_id"]),"job":input.job_id,"label":input.label.strip(),"required":input.required,"actor":str(current.actor_id)}).mappings().one()
    payload = {"id":row["id"],"jobId":row["job_card_id"],"label":row["label"],"required":row["required"],"status":row["status"]}
    _audit(session, current, "QC_CHECK_CREATED", input.label.strip(), {}, payload)
    return payload


@router.post("/qc-checks/{check_id}/result")
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
