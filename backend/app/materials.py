"""Authoritative job-material reservation and issue commands.

Reservations hold branch availability without moving physical stock.  Every
physical outcome is an immutable material event; PostgreSQL writes its linked
stock-ledger entry, so the inventory balance and job history cannot diverge.
"""

from __future__ import annotations

from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Header, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.intake import _branch, _clean, _require_any
from app.jobs import _row_or_404
from app.tenant_admin import _audit
from app.tenancy import TenantScope


router = APIRouter(prefix="/api/v1", tags=["materials"])


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class MaterialReservationInput(ApiModel):
    job_id: Annotated[int, Field(gt=0)] = Field(alias="jobId")
    item_id: Annotated[int, Field(gt=0)] = Field(alias="itemId")
    quantity: Annotated[float, Field(gt=0, le=100000)]
    note: Annotated[str, Field(max_length=2000)] = ""
    branch_id: UUID | None = Field(default=None, alias="branchId")


class MaterialCommand(ApiModel):
    quantity: Annotated[float, Field(gt=0, le=100000)]
    reason: Annotated[str, Field(max_length=2000)] = ""


MaterialCommandName = Literal["issue", "return", "waste", "release", "reverse-issue"]


def _request_permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:
    return _require_any(scope, (
        "page.material-requests.write" if mutation else "page.material-requests.read",
        "page.job-card.write" if mutation else "page.job-card.read",
        "page.my-queue.write" if mutation else "page.my-queue.read",
    ), mutation=mutation)


def _store_permission(scope: ScopedTenant, *, mutation: bool) -> TenantScope:
    return _require_any(scope, (
        "page.issue-material.write" if mutation else "page.issue-material.read",
        "page.reconcile.write" if mutation else "page.reconcile.read",
        "page.stock.write" if mutation else "page.stock.read",
    ), mutation=mutation)


def _reservation(row: dict[str, object], totals: dict[str, float], available_to_reserve: float) -> dict[str, object]:
    reserved = float(row["reserved_qty"])
    issued = totals["issued"]
    released = totals["released"]
    return {
        "id": row["id"], "jobId": row["job_card_id"], "itemId": row["item_id"], "branchId": str(row["branch_id"]),
        "reservedQty": reserved, "status": row["status"], "note": row["note"],
        "issuedQty": issued, "returnedQty": totals["returned"], "wastedQty": totals["wasted"],
        "releasedQty": released, "reversedQty": totals["reversed"],
        "availableToIssue": max(0.0, reserved - issued - released),
        "availableToReserve": max(0.0, available_to_reserve),
        "onJobQty": max(0.0, issued - totals["returned"] - totals["wasted"] - totals["reversed"]),
        "createdAt": row["created_at"], "updatedAt": row["updated_at"],
    }


def _totals(session, reservation_id: int) -> dict[str, float]:
    row = session.execute(text("""
        SELECT COALESCE(SUM(quantity) FILTER (WHERE entry_type='ISSUE'),0) issued,
               COALESCE(SUM(quantity) FILTER (WHERE entry_type='RETURN'),0) returned,
               COALESCE(SUM(quantity) FILTER (WHERE entry_type='WASTE'),0) wasted,
               COALESCE(SUM(quantity) FILTER (WHERE entry_type='RELEASE'),0) released,
               COALESCE(SUM(quantity) FILTER (WHERE entry_type='ISSUE_REVERSAL'),0) reversed
        FROM material_ledger WHERE reservation_id=:reservation_id
    """), {"reservation_id": reservation_id}).mappings().one()
    return {name: float(row[name]) for name in ("issued", "returned", "wasted", "released", "reversed")}


def _reservation_with_totals(session, reservation_id: int) -> dict[str, object]:
    row = _row_or_404(session, "material_reservations", reservation_id, "MATERIAL_RESERVATION_NOT_FOUND")
    return _reservation(row, _totals(session, reservation_id), _available_to_reserve(session, int(row["item_id"]), row["branch_id"]))


def _event(row: dict[str, object]) -> dict[str, object]:
    return {
        "id": row["id"], "reservationId": row["reservation_id"], "jobId": row["job_card_id"], "itemId": row["item_id"],
        "branchId": str(row["branch_id"]), "entryType": row["entry_type"], "quantity": float(row["quantity"]),
        "reason": row["reason"], "actorId": str(row["actor_id"]), "createdAt": row["created_at"],
    }


def _approved_job(session, job_id: int) -> dict[str, object]:
    job = _row_or_404(session, "job_cards", job_id, "JOB_NOT_FOUND")
    if job["status"] in ("CANCELLED", "CLOSED"):
        raise auth_error("JOB_TERMINAL", status.HTTP_422_UNPROCESSABLE_ENTITY)
    approved = session.execute(text("""
        SELECT 1 FROM estimates WHERE job_card_id=:job_id AND status='APPROVED' AND superseded_at IS NULL
    """), {"job_id": job_id}).scalar()
    if not approved:
        raise auth_error("MATERIAL_RESERVATION_REQUIRES_APPROVED_ESTIMATE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return job


def _item_for_update(session, item_id: int, branch_id: UUID) -> dict[str, object]:
    row = session.execute(text("""
        SELECT * FROM catalogue_items WHERE id=:item_id AND branch_id=:branch_id AND archived_at IS NULL FOR UPDATE
    """), {"item_id": item_id, "branch_id": str(branch_id)}).mappings().one_or_none()
    if row is None:
        raise auth_error("CATALOGUE_ITEM_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return dict(row)


def _available_to_reserve(session, item_id: int, branch_id: UUID) -> float:
    row = session.execute(text("""
        WITH stock AS (
            SELECT COALESCE(SUM(quantity),0) AS on_hand FROM stock_ledger WHERE item_id=:item_id AND branch_id=:branch_id
        ), held AS (
            SELECT COALESCE(SUM(r.reserved_qty
              - COALESCE((SELECT SUM(entry.quantity) FROM material_ledger entry WHERE entry.reservation_id=r.id AND entry.entry_type='ISSUE'),0)
              - COALESCE((SELECT SUM(entry.quantity) FROM material_ledger entry WHERE entry.reservation_id=r.id AND entry.entry_type='RELEASE'),0)
            ),0) AS held FROM material_reservations r WHERE r.item_id=:item_id AND r.branch_id=:branch_id
        ) SELECT stock.on_hand-held.held AS available FROM stock, held
    """), {"item_id": item_id, "branch_id": str(branch_id)}).mappings().one()
    return float(row["available"])


def _reconcile(session, reservation_id: int, actor_id: UUID) -> None:
    row = _row_or_404(session, "material_reservations", reservation_id, "MATERIAL_RESERVATION_NOT_FOUND")
    totals = _totals(session, reservation_id)
    if totals["released"] >= float(row["reserved_qty"]):
        next_status = "RELEASED"
    elif totals["issued"] >= float(row["reserved_qty"]) - totals["released"]:
        next_status = "ISSUED"
    elif totals["issued"] > 0:
        next_status = "PARTIALLY_ISSUED"
    else:
        next_status = "RESERVED"
    session.execute(text("""UPDATE material_reservations SET status=:status,updated_by=:actor_id,updated_at=now()
        WHERE id=:id"""), {"id": reservation_id, "status": next_status, "actor_id": str(actor_id)})


@router.get("/material-reservations")
def list_reservations(scope: ScopedTenant, job_id: int | None = Query(default=None, alias="jobId"), branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope
    _request_permission(scope, mutation=False)
    if branch_id is not None:
        _branch(current, branch_id)
    filters, values = [], {}
    if job_id is not None:
        filters.append("job_card_id=:job_id"); values["job_id"] = job_id
    if branch_id is not None:
        filters.append("branch_id=:branch_id"); values["branch_id"] = str(branch_id)
    where = f" WHERE {' AND '.join(filters)}" if filters else ""
    rows = session.execute(text(f"SELECT id FROM material_reservations{where} ORDER BY created_at DESC,id DESC"), values).mappings().all()
    return [_reservation_with_totals(session, int(row["id"])) for row in rows]


@router.get("/jobs/{job_id}/material-reservations")
def list_job_reservations(job_id: int, scope: ScopedTenant) -> list[dict[str, object]]:
    return list_reservations(scope, job_id=job_id)


@router.get("/material-ledger")
def list_material_ledger(scope: ScopedTenant, reservation_id: int | None = Query(default=None, alias="reservationId"), job_id: int | None = Query(default=None, alias="jobId"), branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope
    _store_permission(scope, mutation=False)
    if branch_id is not None:
        _branch(current, branch_id)
    filters, values = [], {}
    for column, value in (("reservation_id", reservation_id), ("job_card_id", job_id), ("branch_id", str(branch_id) if branch_id else None)):
        if value is not None:
            filters.append(f"{column}=:{column}"); values[column] = value
    where = f" WHERE {' AND '.join(filters)}" if filters else ""
    rows = session.execute(text(f"SELECT * FROM material_ledger{where} ORDER BY created_at DESC,id DESC"), values).mappings().all()
    return [_event(dict(row)) for row in rows]


@router.post("/material-reservations", status_code=status.HTTP_201_CREATED)
def create_reservation(input: MaterialReservationInput, scope: ScopedTenant, request_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None) -> dict[str, object]:
    session, current = scope
    branch_id = _branch(_request_permission(scope, mutation=True), input.branch_id)
    job = _approved_job(session, input.job_id)
    if job["branch_id"] != branch_id:
        raise auth_error("JOB_BRANCH_MISMATCH", status.HTTP_422_UNPROCESSABLE_ENTITY)
    _item_for_update(session, input.item_id, branch_id)
    if request_key and (replay := session.execute(text("""SELECT id FROM material_reservations
        WHERE tenant_id=:tenant_id AND job_card_id=:job_id AND request_key=:request_key"""),
        {"tenant_id": str(current.tenant_id), "job_id": input.job_id, "request_key": request_key.strip()}).scalar()):
        return _reservation_with_totals(session, int(replay))
    available = _available_to_reserve(session, input.item_id, branch_id)
    if input.quantity > available:
        raise auth_error("INSUFFICIENT_AVAILABLE_STOCK_TO_RESERVE", status.HTTP_409_CONFLICT)
    reservation = session.execute(text("""INSERT INTO material_reservations
        (tenant_id,branch_id,job_card_id,item_id,reserved_qty,status,note,request_key,created_by,updated_by)
        VALUES (:tenant_id,:branch_id,:job_id,:item_id,:quantity,'RESERVED',:note,:request_key,:actor_id,:actor_id) RETURNING *"""),
        {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "job_id": input.job_id, "item_id": input.item_id,
         "quantity": input.quantity, "note": input.note.strip(), "request_key": request_key.strip() if request_key else None, "actor_id": str(current.actor_id)}).mappings().one()
    session.execute(text("""INSERT INTO material_ledger (tenant_id,branch_id,reservation_id,job_card_id,item_id,entry_type,quantity,reason,actor_id)
        VALUES (:tenant_id,:branch_id,:reservation_id,:job_id,:item_id,'RESERVE',:quantity,:reason,:actor_id)"""),
        {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "reservation_id": reservation["id"], "job_id": input.job_id,
         "item_id": input.item_id, "quantity": input.quantity, "reason": input.note.strip() or "Reserved for approved job", "actor_id": str(current.actor_id)})
    payload = _reservation_with_totals(session, int(reservation["id"]))
    _audit(session, current, "MATERIAL_RESERVED", input.note.strip() or "Material reserved", {}, payload)
    return payload


@router.post("/material-reservations/{reservation_id}/commands/{command}")
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
