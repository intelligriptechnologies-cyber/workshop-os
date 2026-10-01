"""API-backed Follow-ups and global, tenant-scoped operational search."""

from __future__ import annotations

from datetime import date
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.intake import _branch, _require_any
from app.jobs import _row_or_404
from app.tenant_admin import _audit
from app.tenancy import TenantScope


router = APIRouter(prefix="/api/v1", tags=["follow-ups and search"])
SearchEntity = Literal["customer", "vehicle", "job", "invoice"]


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class FollowupCreate(ApiModel):
    job_id: Annotated[int, Field(gt=0)] = Field(alias="jobId")
    note: Annotated[str, Field(min_length=1, max_length=4000)]
    due_at: date | None = Field(default=None, alias="dueAt")


class FollowupUpdate(ApiModel):
    note: Annotated[str, Field(min_length=1, max_length=4000)]
    due_at: date | None = Field(default=None, alias="dueAt")
    outcome: Annotated[str, Field(max_length=4000)] = ""


class FollowupComplete(ApiModel):
    outcome: Annotated[str, Field(max_length=4000)] = ""


class ArchiveInput(ApiModel):
    reason: Annotated[str, Field(min_length=1, max_length=4000)]


def _permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:
    return _require_any(scope, (f"page.follow-ups.{'write' if mutation else 'read'}",), mutation=mutation)


def _search_permission(scope: ScopedTenant) -> TenantScope:
    return _require_any(scope, ("page.search.read",), mutation=False)


def _clean(value: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise auth_error("BLANK_VALUE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return cleaned


def _followup_row(session, followup_id: int) -> dict[str, object]:
    row = session.execute(text("""
        SELECT f.*, j.job_no, c.name AS customer_name, v.number AS vehicle_no
        FROM followups f
        JOIN job_cards j ON j.id=f.job_card_id
        JOIN visits visit ON visit.id=j.visit_id
        JOIN customers c ON c.id=visit.customer_id
        JOIN vehicles v ON v.id=visit.vehicle_id
        WHERE f.id=:id
    """), {"id": followup_id}).mappings().one_or_none()
    if row is None:
        raise auth_error("FOLLOWUP_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return dict(row)


def _payload(row: dict[str, object]) -> dict[str, object]:
    return {
        "id": row["id"], "jobId": row["job_card_id"], "branchId": str(row["branch_id"]),
        "jobNo": row["job_no"], "customerName": row["customer_name"], "vehicleNo": row["vehicle_no"],
        "note": row["note"], "dueAt": row["due_at"], "status": row["status"], "outcome": row["outcome"],
        "completedAt": row["completed_at"], "archivedAt": row["archived_at"],
        "archiveReason": row["archive_reason"], "version": row["version"],
        "createdAt": row["created_at"], "updatedAt": row["updated_at"],
    }


@router.get("/follow-ups")
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


@router.get("/follow-ups/jobs")
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


@router.post("/follow-ups", status_code=status.HTTP_201_CREATED)
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


@router.put("/follow-ups/{followup_id}")
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


@router.post("/follow-ups/{followup_id}/commands/complete")
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


@router.post("/follow-ups/{followup_id}/archive")
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


@router.get("/search")
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
          SELECT 'vehicle', v.id, v.branch_id, v.number, concat_ws(' · ',v.make,v.model,c.name),
            CASE WHEN upper(v.number)=upper(:exact) THEN 0 WHEN v.number ILIKE :prefix THEN 1 ELSE 2 END
          FROM vehicles v JOIN customers c ON c.id=v.customer_id WHERE v.archived_at IS NULL AND c.archived_at IS NULL AND (:branch_id IS NULL OR v.branch_id=:branch_id) AND (v.number ILIKE :needle OR v.make ILIKE :needle OR v.model ILIKE :needle OR c.name ILIKE :needle)
          UNION ALL
          SELECT 'job', j.id, j.branch_id, j.job_no, concat_ws(' · ',v.number,c.name,j.status),
            CASE WHEN lower(j.job_no)=lower(:exact) THEN 0 WHEN j.job_no ILIKE :prefix THEN 1 ELSE 2 END
          FROM job_cards j JOIN visits visit ON visit.id=j.visit_id JOIN customers c ON c.id=visit.customer_id JOIN vehicles v ON v.id=visit.vehicle_id
          WHERE (:branch_id IS NULL OR j.branch_id=:branch_id) AND (j.job_no ILIKE :needle OR v.number ILIKE :needle OR c.name ILIKE :needle)
          UNION ALL
          SELECT 'invoice', i.id, i.branch_id, d.document_no, concat_ws(' · ',j.job_no,v.number,c.name),
            CASE WHEN lower(d.document_no)=lower(:exact) THEN 0 WHEN d.document_no ILIKE :prefix THEN 1 ELSE 2 END
          FROM invoices i JOIN financial_documents d ON d.id=i.issued_document_id JOIN job_cards j ON j.id=i.job_card_id
            JOIN visits visit ON visit.id=j.visit_id JOIN customers c ON c.id=visit.customer_id JOIN vehicles v ON v.id=visit.vehicle_id
          WHERE NOT EXISTS (SELECT 1 FROM financial_document_events event WHERE event.document_id=d.id AND event.event_type='VOID')
            AND (:branch_id IS NULL OR i.branch_id=:branch_id) AND (d.document_no ILIKE :needle OR j.job_no ILIKE :needle OR v.number ILIKE :needle OR c.name ILIKE :needle)
        ) AS searchable WHERE entity = ANY(:entities) ORDER BY rank, entity, title, id LIMIT :limit
    """), {"needle": needle, "prefix": prefix, "exact": exact, "branch_id": str(branch_id) if branch_id else None, "entities": list(requested), "limit": limit}).mappings().all()
    return {"query": q.strip(), "results": [{"entity": row["entity"], "id": row["id"], "branchId": str(row["branch_id"]), "title": row["title"], "subtitle": row["subtitle"], "rank": row["rank"]} for row in rows]}
