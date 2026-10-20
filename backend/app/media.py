"""Shared media attached to tenant and branch job cards."""
from __future__ import annotations

import re
from typing import Annotated

from fastapi import APIRouter, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.tenancy import require_mutation_allowed

router = APIRouter(prefix="/api/v1/media", tags=["media"])
SAFE_SOURCE = re.compile(r"^data:image/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$")


class MediaInput(BaseModel):
    jobId: int = Field(gt=0)
    label: Annotated[str, Field(max_length=300)] = ""
    category: Annotated[str, Field(max_length=100)] = ""
    src: Annotated[str, Field(max_length=14_000_000)]


class MediaUpdate(BaseModel):
    label: Annotated[str, Field(max_length=300)]
    category: Annotated[str, Field(max_length=100)]


class ArchiveInput(BaseModel):
    reason: Annotated[str, Field(min_length=1, max_length=1000)]


def _require(scope: ScopedTenant, write: bool = False) -> None:
    current = scope[1]
    if write:
        try:
            require_mutation_allowed(current)
        except PermissionError as error:
            raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error
    if current.actor_type == "support_emulation" and not write:
        return
    if f"page.media.{'write' if write else 'read'}" not in current.permissions:
        raise auth_error("PERMISSION_DENIED", status.HTTP_403_FORBIDDEN)


def _row(session, media_id: int):
    return session.execute(text("""
        SELECT m.*, j.job_no, v.number AS vehicle_no
        FROM job_media m JOIN job_cards j ON j.id=m.job_card_id
        JOIN visits i ON i.id=j.visit_id JOIN vehicles v ON v.id=i.vehicle_id
        WHERE m.id=:id
    """), {"id": media_id}).mappings().one_or_none()


def _payload(row):
    return {"id": row["id"], "jobId": row["job_card_id"], "jobNo": row["job_no"],
            "vehicleNo": row["vehicle_no"], "branchId": str(row["branch_id"]), "label": row["label"],
            "category": row["category"], "src": row["src"], "archivedAt": row["archived_at"],
            "createdAt": row["created_at"], "updatedAt": row["updated_at"]}


@router.get("")
def list_media(scope: ScopedTenant, job_id: int | None = Query(None, alias="jobId")):
    _require(scope)
    rows = scope[0].execute(text("""
        SELECT m.id FROM job_media m WHERE m.archived_at IS NULL
          AND (CAST(:job AS bigint) IS NULL OR m.job_card_id=:job)
        ORDER BY m.created_at DESC, m.id DESC
    """), {"job": job_id}).mappings()
    return [_payload(_row(scope[0], int(row["id"]))) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_media(input: MediaInput, scope: ScopedTenant):
    _require(scope, True)
    session, current = scope
    if not SAFE_SOURCE.fullmatch(input.src) and input.src != "/media-placeholder.svg":
        raise auth_error("INVALID_MEDIA_SOURCE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    job = session.execute(text("SELECT id,branch_id FROM job_cards WHERE id=:id AND archived_at IS NULL"),
                          {"id": input.jobId}).mappings().one_or_none()
    if not job:
        raise auth_error("JOB_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    media_id = session.execute(text("""INSERT INTO job_media(tenant_id,branch_id,job_card_id,label,category,src,created_by,updated_by)
        VALUES (:tenant,:branch,:job,:label,:category,:src,:actor,:actor) RETURNING id"""),
        {"tenant": str(current.tenant_id), "branch": str(job["branch_id"]), "job": input.jobId,
         "label": input.label.strip(), "category": input.category.strip(), "src": input.src,
         "actor": str(current.actor_id)}).scalar_one()
    return _payload(_row(session, media_id))


@router.put("/{media_id}")
def update_media(media_id: int, input: MediaUpdate, scope: ScopedTenant):
    _require(scope, True)
    row = scope[0].execute(text("""UPDATE job_media SET label=:label, category=:category, updated_by=:actor, updated_at=now()
        WHERE id=:id AND archived_at IS NULL RETURNING id"""),
        {"id": media_id, "label": input.label.strip(), "category": input.category.strip(),
         "actor": str(scope[1].actor_id)}).scalar_one_or_none()
    if row is None:
        raise auth_error("MEDIA_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return _payload(_row(scope[0], media_id))


@router.post("/{media_id}/archive")
def archive_media(media_id: int, input: ArchiveInput, scope: ScopedTenant):
    _require(scope, True)
    row = scope[0].execute(text("""UPDATE job_media SET archived_at=now(), archive_reason=:reason, updated_by=:actor, updated_at=now()
        WHERE id=:id AND archived_at IS NULL RETURNING id"""),
        {"id": media_id, "reason": input.reason.strip(), "actor": str(scope[1].actor_id)}).scalar_one_or_none()
    if row is None:
        raise auth_error("MEDIA_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return _payload(_row(scope[0], media_id))
