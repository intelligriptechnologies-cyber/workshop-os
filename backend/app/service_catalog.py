"""Shared service catalogue and job task selections."""
from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.tenancy import require_mutation_allowed

router = APIRouter(prefix="/api/v1/service-catalog", tags=["service catalogue"])


class CatalogueInput(BaseModel):
    branchId: UUID | None = None
    name: Annotated[str, Field(min_length=1, max_length=300)]
    baseRate: Annotated[float, Field(ge=0)]
    gstRate: Annotated[float, Field(ge=0, le=100)] = 18
    departmentId: UUID | None = None


class JobTaskInput(BaseModel):
    jobId: int = Field(gt=0)
    catalogueItemId: int | None = None
    name: Annotated[str, Field(min_length=1, max_length=300)]
    baseRate: Annotated[float, Field(ge=0)]
    gstRate: Annotated[float, Field(ge=0, le=100)] = 18


class DoneInput(BaseModel):
    done: bool


def _permission(scope: ScopedTenant, *, write: bool = False, job: bool = False) -> None:
    current = scope[1]
    if write:
        try:
            require_mutation_allowed(current)
        except PermissionError as error:
            raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error
    if current.actor_type == "support_emulation" and not write:
        return
    pages = ("job-card", "jobs", "my-queue", "my-tasks", "work-update") if job else (
        ("manage", "admin-console") if write else ("manage", "admin-console", "job-card", "jobs", "my-queue"))
    suffix = "write" if write else "read"
    if not any(f"page.{page}.{suffix}" in current.permissions for page in pages):
        raise auth_error("PERMISSION_DENIED", status.HTTP_403_FORBIDDEN)


def _catalogue(row) -> dict[str, object]:
    return {"id": row["id"], "branchId": str(row["branch_id"]), "name": row["name"],
            "baseRate": float(row["rate"]), "gstRate": float(row["gst_rate"]),
            "departmentId": str(row["department_id"]) if row["department_id"] else None,
            "archivedAt": row["archived_at"]}


@router.get("")
def list_catalogue(scope: ScopedTenant) -> list[dict[str, object]]:
    _permission(scope)
    rows = scope[0].execute(text("SELECT * FROM service_task_catalog ORDER BY name,id")).mappings().all()
    return [_catalogue(row) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_catalogue(input: CatalogueInput, scope: ScopedTenant) -> dict[str, object]:
    _permission(scope, write=True)
    session, current = scope
    branch = str(input.branchId or current.branch_ids[0])
    if UUID(branch) not in current.branch_ids:
        raise auth_error("BRANCH_ACCESS_DENIED", status.HTTP_403_FORBIDDEN)
    if input.departmentId:
        department = session.execute(text("SELECT branch_id FROM service_departments WHERE id=:id AND status='ACTIVE'"),
                                     {"id": str(input.departmentId)}).scalar_one_or_none()
        if department is None:
            raise auth_error("DEPARTMENT_NOT_FOUND", status.HTTP_404_NOT_FOUND)
        branch = str(department)
    row = session.execute(text("""INSERT INTO service_task_catalog(tenant_id,branch_id,name,description,rate,gst_rate,
        department_id,created_by,updated_by) VALUES (:tenant,:branch,:name,'',:rate,:gst,:department,:actor,:actor)
        RETURNING *"""), {"tenant": str(current.tenant_id), "branch": branch, "name": input.name.strip(),
                            "rate": input.baseRate, "gst": input.gstRate,
                            "department": str(input.departmentId) if input.departmentId else None,
                            "actor": str(current.actor_id)}).mappings().one()
    return _catalogue(row)


@router.put("/{item_id}")
def update_catalogue(item_id: int, input: CatalogueInput, scope: ScopedTenant) -> dict[str, object]:
    _permission(scope, write=True)
    session, current = scope
    existing_branch = session.execute(text("SELECT branch_id FROM service_task_catalog WHERE id=:id AND status='ACTIVE'"),
                                      {"id": item_id}).scalar_one_or_none()
    if existing_branch is None:
        raise auth_error("CATALOGUE_ITEM_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    if input.departmentId:
        department_branch = session.execute(text("SELECT branch_id FROM service_departments WHERE id=:id AND status='ACTIVE'"),
                                            {"id": str(input.departmentId)}).scalar_one_or_none()
        if department_branch != existing_branch:
            raise auth_error("DEPARTMENT_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    row = session.execute(text("""UPDATE service_task_catalog SET name=:name,rate=:rate,gst_rate=:gst,
        department_id=:department,updated_by=:actor,updated_at=now() WHERE id=:id AND status='ACTIVE'
        RETURNING *"""), {"id": item_id, "name": input.name.strip(), "rate": input.baseRate,
                            "gst": input.gstRate, "department": str(input.departmentId) if input.departmentId else None,
                            "actor": str(current.actor_id)}).mappings().one_or_none()
    if row is None:
        raise auth_error("CATALOGUE_ITEM_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return _catalogue(row)


def _task(row) -> dict[str, object]:
    return {"id": row["id"], "jobId": row["job_card_id"], "catalogueItemId": row["catalogue_item_id"],
            "name": row["name"], "baseRate": float(row["base_rate"]), "gstRate": float(row["gst_rate"]),
            "done": row["done"], "archivedAt": row["archived_at"]}


@router.get("/job-tasks")
def list_job_tasks(scope: ScopedTenant, job_id: int = Query(alias="jobId")) -> list[dict[str, object]]:
    _permission(scope, job=True)
    rows = scope[0].execute(text("SELECT * FROM job_service_tasks WHERE job_card_id=:job ORDER BY id"),
                            {"job": job_id}).mappings().all()
    return [_task(row) for row in rows]


@router.post("/job-tasks", status_code=status.HTTP_201_CREATED)
def create_job_task(input: JobTaskInput, scope: ScopedTenant) -> dict[str, object]:
    _permission(scope, write=True, job=True)
    session, current = scope
    job = session.execute(text("SELECT branch_id,status FROM job_cards WHERE id=:id"), {"id": input.jobId}).mappings().one_or_none()
    if job is None:
        raise auth_error("JOB_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    if job["status"] in ("CLOSED", "CANCELLED"):
        raise auth_error("JOB_TASK_LOCKED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if input.catalogueItemId:
        item_branch = session.execute(text("SELECT branch_id FROM service_task_catalog WHERE id=:id AND status='ACTIVE'"),
                                      {"id": input.catalogueItemId}).scalar_one_or_none()
        if item_branch != job["branch_id"]:
            raise auth_error("CATALOGUE_ITEM_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    row = session.execute(text("""INSERT INTO job_service_tasks(tenant_id,branch_id,job_card_id,catalogue_item_id,
        name,base_rate,gst_rate,created_by,updated_by) VALUES (:tenant,:branch,:job,:catalogue,:name,:rate,:gst,:actor,:actor)
        RETURNING *"""), {"tenant": str(current.tenant_id), "branch": str(job["branch_id"]), "job": input.jobId,
                            "catalogue": input.catalogueItemId, "name": input.name.strip(),
                            "rate": input.baseRate, "gst": input.gstRate, "actor": str(current.actor_id)}).mappings().one()
    return _task(row)


@router.put("/job-tasks/{task_id}/done")
def set_job_task_done(task_id: int, input: DoneInput, scope: ScopedTenant) -> dict[str, object]:
    _permission(scope, write=True, job=True)
    job_status = scope[0].execute(text("""SELECT job.status FROM job_service_tasks task
        JOIN job_cards job ON job.id=task.job_card_id WHERE task.id=:id"""), {"id": task_id}).scalar_one_or_none()
    if job_status in ("CLOSED", "CANCELLED"):
        raise auth_error("JOB_TASK_LOCKED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = scope[0].execute(text("""UPDATE job_service_tasks SET done=:done,updated_by=:actor,updated_at=now()
        WHERE id=:id AND archived_at IS NULL RETURNING *"""),
        {"id": task_id, "done": input.done, "actor": str(scope[1].actor_id)}).mappings().one_or_none()
    if row is None:
        raise auth_error("JOB_TASK_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return _task(row)
