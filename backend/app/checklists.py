"""Shared job checklist cycles and item decisions."""
from __future__ import annotations

from typing import Annotated, Literal

from fastapi import APIRouter, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.tenancy import require_mutation_allowed

router = APIRouter(prefix="/api/v1/checklists", tags=["checklists"])
READ_PAGES = ("job-card", "my-queue", "jobs", "my-tasks", "work-update", "qc-prep")


class ItemInput(BaseModel):
    key: Annotated[str, Field(min_length=1, max_length=100)]
    label: Annotated[str, Field(min_length=1, max_length=300)]
    required: bool = True


class CycleInput(BaseModel):
    jobId: int = Field(gt=0)
    stage: Annotated[str, Field(min_length=1, max_length=50)]
    items: Annotated[list[ItemInput], Field(min_length=1, max_length=100)]


class DecisionInput(BaseModel):
    state: Literal["open", "checked", "na"]


def _permission(scope: ScopedTenant, *, write: bool = False) -> None:
    current = scope[1]
    if write:
        try:
            require_mutation_allowed(current)
        except PermissionError as error:
            raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error
    if current.actor_type == "support_emulation" and not write:
        return
    suffix = "write" if write else "read"
    if not any(f"page.{page}.{suffix}" in current.permissions for page in READ_PAGES):
        raise auth_error("PERMISSION_DENIED", status.HTTP_403_FORBIDDEN)


def _cycles(scope: ScopedTenant, job_id: int) -> list[dict[str, object]]:
    session, _ = scope
    job = session.execute(text("SELECT id FROM job_cards WHERE id=:id"), {"id": job_id}).scalar_one_or_none()
    if job is None:
        raise auth_error("JOB_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    cycles = session.execute(text("""SELECT * FROM job_checklist_cycles WHERE job_card_id=:job
        ORDER BY started_at, id"""), {"job": job_id}).mappings().all()
    result = []
    for cycle in cycles:
        items = session.execute(text("""SELECT * FROM job_checklist_items WHERE cycle_id=:cycle
            ORDER BY sort_order,id"""), {"cycle": cycle["id"]}).mappings().all()
        result.append({"id": cycle["id"], "jobId": job_id, "stage": cycle["stage"],
                       "cycleNumber": cycle["cycle_number"], "startedAt": cycle["started_at"],
                       "completedAt": cycle["completed_at"],
                       "items": [{"id": item["id"], "key": item["item_key"], "label": item["label"],
                                  "sortOrder": item["sort_order"], "required": item["required"],
                                  "checkedAt": item["checked_at"], "checkedBy": str(item["checked_by"]) if item["checked_by"] else None,
                                  "naAt": item["na_at"], "naBy": str(item["na_by"]) if item["na_by"] else None}
                                 for item in items]})
    return result


@router.get("")
def list_checklists(scope: ScopedTenant, job_id: int = Query(alias="jobId")) -> list[dict[str, object]]:
    _permission(scope)
    return _cycles(scope, job_id)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_cycle(input: CycleInput, scope: ScopedTenant) -> list[dict[str, object]]:
    _permission(scope, write=True)
    session, current = scope
    job = session.execute(text("SELECT id,branch_id,status FROM job_cards WHERE id=:id"), {"id": input.jobId}).mappings().one_or_none()
    if job is None:
        raise auth_error("JOB_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    if job["status"] in ("CLOSED", "CANCELLED") or job["status"] != input.stage.strip():
        raise auth_error("CHECKLIST_STAGE_NOT_CURRENT", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if len({item.key for item in input.items}) != len(input.items):
        raise auth_error("DUPLICATE_CHECKLIST_ITEM", status.HTTP_422_UNPROCESSABLE_ENTITY)
    number = session.execute(text("""SELECT COALESCE(max(cycle_number),0)+1 FROM job_checklist_cycles
        WHERE job_card_id=:job AND stage=:stage"""), {"job": input.jobId, "stage": input.stage}).scalar_one()
    cycle_id = session.execute(text("""INSERT INTO job_checklist_cycles(tenant_id,branch_id,job_card_id,stage,cycle_number,started_at)
        VALUES (:tenant,:branch,:job,:stage,:number,now()) RETURNING id"""),
        {"tenant": str(current.tenant_id), "branch": str(job["branch_id"]), "job": input.jobId,
         "stage": input.stage.strip(), "number": number}).scalar_one()
    for index, item in enumerate(input.items, 1):
        session.execute(text("""INSERT INTO job_checklist_items(tenant_id,branch_id,cycle_id,job_card_id,item_key,
            label,sort_order,required,started_at) VALUES (:tenant,:branch,:cycle,:job,:key,:label,:sort,:required,now())"""),
            {"tenant": str(current.tenant_id), "branch": str(job["branch_id"]), "cycle": cycle_id,
             "job": input.jobId, "key": item.key.strip(), "label": item.label.strip(),
             "sort": index, "required": item.required})
    return _cycles(scope, input.jobId)


@router.put("/items/{item_id}")
def decide_item(item_id: int, input: DecisionInput, scope: ScopedTenant) -> list[dict[str, object]]:
    _permission(scope, write=True)
    session, current = scope
    row = session.execute(text("""SELECT item.cycle_id,item.job_card_id,item.required,cycle.stage,job.status
        FROM job_checklist_items item JOIN job_checklist_cycles cycle ON cycle.id=item.cycle_id
        JOIN job_cards job ON job.id=item.job_card_id WHERE item.id=:id"""),
                          {"id": item_id}).mappings().one_or_none()
    if row is None:
        raise auth_error("CHECKLIST_ITEM_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    if row["status"] in ("CLOSED", "CANCELLED") or row["stage"] != row["status"]:
        raise auth_error("CHECKLIST_STAGE_NOT_CURRENT", status.HTTP_422_UNPROCESSABLE_ENTITY)
    if input.state == "na" and row["required"]:
        raise auth_error("REQUIRED_CHECKLIST_ITEM", status.HTTP_422_UNPROCESSABLE_ENTITY)
    session.execute(text("""UPDATE job_checklist_items SET
        checked_by=CASE WHEN :state='checked' THEN CAST(:actor AS uuid) ELSE NULL END,
        checked_at=CASE WHEN :state='checked' THEN now() ELSE NULL END,
        na_by=CASE WHEN :state='na' THEN CAST(:actor AS uuid) ELSE NULL END,
        na_at=CASE WHEN :state='na' THEN now() ELSE NULL END
        WHERE id=:id"""), {"state": input.state, "actor": str(current.actor_id), "id": item_id})
    session.execute(text("""UPDATE job_checklist_cycles SET completed_at=CASE WHEN NOT EXISTS (
        SELECT 1 FROM job_checklist_items WHERE cycle_id=:cycle AND checked_at IS NULL AND na_at IS NULL
    ) THEN COALESCE(completed_at,now()) ELSE NULL END WHERE id=:cycle"""), {"cycle": row["cycle_id"]})
    return _cycles(scope, row["job_card_id"])
