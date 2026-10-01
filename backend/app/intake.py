"""Tenant- and branch-scoped customer, vehicle, and visit intake API.

This is intentionally a narrow operational boundary: all IDs identifying a
tenant or branch are derived from the authenticated membership, while every
record operation is additionally guarded in Python for a clear client error
and in PostgreSQL by RLS for a fail-closed database boundary.
"""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text

from app.auth import ScopedTenant, auth_error
from app.tenancy import TenantScope, require_branch, require_mutation_allowed
from app.tenant_admin import _audit


router = APIRouter(prefix="/api/v1", tags=["intake"])


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class CustomerInput(ApiModel):
    branch_id: UUID | None = Field(default=None, alias="branchId")
    name: Annotated[str, Field(min_length=1, max_length=300)]
    mobile: Annotated[str, Field(min_length=1, max_length=80)]
    type: Annotated[str, Field(min_length=1, max_length=80)] = "Individual"
    address: Annotated[str, Field(max_length=2000)] = ""


class VehicleInput(ApiModel):
    branch_id: UUID | None = Field(default=None, alias="branchId")
    customer_id: Annotated[int, Field(gt=0)] = Field(alias="customerId")
    number: Annotated[str, Field(min_length=1, max_length=100)]
    make: Annotated[str, Field(min_length=1, max_length=120)]
    model: Annotated[str, Field(min_length=1, max_length=120)]
    color: Annotated[str, Field(max_length=100)] = ""
    km: Annotated[int, Field(ge=0)] = 0
    engine_no: Annotated[str, Field(max_length=160)] = Field(default="", alias="engineNo")


class VisitCreate(ApiModel):
    branch_id: UUID | None = Field(default=None, alias="branchId")
    customer_id: Annotated[int, Field(gt=0)] = Field(alias="customerId")
    vehicle_id: Annotated[int, Field(gt=0)] = Field(alias="vehicleId")
    advisor_id: UUID | None = Field(default=None, alias="advisorId")
    fuel: Annotated[str, Field(min_length=1, max_length=200)]
    odo_reading: Annotated[int, Field(ge=0)] = Field(alias="odoReading")
    fuel_level_value: Annotated[str, Field(max_length=100)] = Field(default="", alias="fuelLevelValue")
    fuel_level_unit: Annotated[str, Field(max_length=50)] = Field(default="", alias="fuelLevelUnit")
    keys: Annotated[str, Field(max_length=1000)] = ""
    accessories: Annotated[str, Field(max_length=4000)] = ""
    requested_work: Annotated[str, Field(min_length=1, max_length=8000)] = Field(alias="requestedWork")
    photos_note: Annotated[str, Field(max_length=4000)] = Field(default="", alias="photosNote")


class VisitUpdate(ApiModel):
    advisor_id: UUID | None = Field(default=None, alias="advisorId")
    fuel: Annotated[str, Field(min_length=1, max_length=200)]
    odo_reading: Annotated[int, Field(ge=0)] = Field(alias="odoReading")
    fuel_level_value: Annotated[str, Field(max_length=100)] = Field(default="", alias="fuelLevelValue")
    fuel_level_unit: Annotated[str, Field(max_length=50)] = Field(default="", alias="fuelLevelUnit")
    keys: Annotated[str, Field(max_length=1000)] = ""
    accessories: Annotated[str, Field(max_length=4000)] = ""
    requested_work: Annotated[str, Field(min_length=1, max_length=8000)] = Field(alias="requestedWork")
    photos_note: Annotated[str, Field(max_length=4000)] = Field(default="", alias="photosNote")


class ArchiveInput(ApiModel):
    reason: Annotated[str, Field(min_length=1, max_length=1000)]


def _clean(value: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise auth_error("INVALID_INTAKE_INPUT", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return cleaned


def _require(scope: ScopedTenant, permission: str, *, mutation: bool = False) -> TenantScope:
    _, current = scope
    if current.actor_type == "support_emulation":
        if mutation:
            raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN)
        return current
    if permission not in current.permissions:
        raise auth_error("PERMISSION_DENIED", status.HTTP_403_FORBIDDEN)
    if mutation:
        try:
            require_mutation_allowed(current)
        except PermissionError as error:
            raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error
    return current


def _require_any(scope: ScopedTenant, permissions: tuple[str, ...], *, mutation: bool = False) -> TenantScope:
    """Allow intake from the existing Reception and Service workspaces.

    Reception has Customer/Vehicle screens while Service works from My Queue.
    The operation remains deny-by-default: at least one explicit page write or
    read permission is required, and support emulation never mutates.
    """
    _, current = scope
    if current.actor_type == "support_emulation":
        if mutation:
            raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN)
        return current
    if not any(permission in current.permissions for permission in permissions):
        raise auth_error("PERMISSION_DENIED", status.HTTP_403_FORBIDDEN)
    if mutation:
        try:
            require_mutation_allowed(current)
        except PermissionError as error:
            raise auth_error("TENANT_READ_ONLY", status.HTTP_403_FORBIDDEN) from error
    return current


def _branch(current: TenantScope, branch_id: UUID | None) -> UUID:
    if branch_id is None:
        if len(current.branch_ids) != 1:
            raise auth_error("BRANCH_REQUIRED", status.HTTP_422_UNPROCESSABLE_ENTITY)
        return current.branch_ids[0]
    try:
        require_branch(current, branch_id)
    except PermissionError as error:
        raise auth_error("BRANCH_ACCESS_DENIED", status.HTTP_403_FORBIDDEN) from error
    return branch_id


def _row_or_404(session, table: str, record_id: int) -> dict[str, object]:
    row = session.execute(text(f"SELECT * FROM {table} WHERE id = :id"), {"id": record_id}).mappings().one_or_none()
    if row is None:
        raise auth_error("INTAKE_RECORD_NOT_FOUND", status.HTTP_404_NOT_FOUND)
    return dict(row)


def _customer(row: dict[str, object]) -> dict[str, object]:
    return {"id": row["id"], "branchId": str(row["branch_id"]), "name": row["name"], "mobile": row["mobile"], "type": row["type"], "address": row["address"], "archivedAt": row["archived_at"], "createdAt": row["created_at"], "updatedAt": row["updated_at"]}


def _vehicle(row: dict[str, object]) -> dict[str, object]:
    return {"id": row["id"], "branchId": str(row["branch_id"]), "customer_id": row["customer_id"], "customerId": row["customer_id"], "number": row["number"], "make": row["make"], "model": row["model"], "color": row["color"], "km": row["km"], "engine_no": row["engine_no"], "engineNo": row["engine_no"], "archivedAt": row["archived_at"], "createdAt": row["created_at"], "updatedAt": row["updated_at"]}


def _visit(row: dict[str, object]) -> dict[str, object]:
    return {"id": row["id"], "branchId": str(row["branch_id"]), "customerId": row["customer_id"], "vehicleId": row["vehicle_id"], "advisorId": str(row["advisor_id"]) if row["advisor_id"] else None, "receivedBy": str(row["received_by"]), "receivedAt": row["received_at"], "fuel": row["fuel"], "odoReading": row["odo_reading"], "fuelLevelValue": row["fuel_level_value"], "fuelLevelUnit": row["fuel_level_unit"], "keys": row["keys"], "accessories": row["accessories"], "requestedWork": row["requested_work"], "photosNote": row["photos_note"], "archivedAt": row["archived_at"], "createdAt": row["created_at"], "updatedAt": row["updated_at"]}


def _assert_active_customer(session, customer_id: int, branch_id: UUID) -> dict[str, object]:
    row = _row_or_404(session, "customers", customer_id)
    if row["branch_id"] != branch_id or row["archived_at"] is not None:
        raise auth_error("CUSTOMER_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return row


def _assert_active_vehicle(session, vehicle_id: int, branch_id: UUID, customer_id: int) -> dict[str, object]:
    row = _row_or_404(session, "vehicles", vehicle_id)
    if row["branch_id"] != branch_id or row["customer_id"] != customer_id or row["archived_at"] is not None:
        raise auth_error("VEHICLE_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    return row


@router.get("/customers")
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


@router.post("/customers", status_code=status.HTTP_201_CREATED)
def create_customer(input: CustomerInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope
    branch_id = _branch(_require_any(scope, ("page.customers.write", "page.my-queue.write"), mutation=True), input.branch_id)
    row = session.execute(text("""
        INSERT INTO customers (tenant_id, branch_id, name, mobile, type, address, created_by, updated_by)
        VALUES (:tenant_id, :branch_id, :name, :mobile, :type, :address, :actor_id, :actor_id) RETURNING *
    """), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "name": _clean(input.name), "mobile": _clean(input.mobile), "type": _clean(input.type), "address": input.address.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _customer(dict(row)); _audit(session, current, "CUSTOMER_CREATED", "Customer created", {}, payload)
    return payload


@router.get("/customers/{customer_id}")
def get_customer(customer_id: int, scope: ScopedTenant) -> dict[str, object]:
    session, _ = scope; _require_any(scope, ("page.customers.read", "page.my-queue.read"))
    return _customer(_row_or_404(session, "customers", customer_id))


@router.put("/customers/{customer_id}")
def update_customer(customer_id: int, input: CustomerInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.customers.write", "page.my-queue.write"), mutation=True)
    before = _row_or_404(session, "customers", customer_id)
    if before["archived_at"] is not None or before["branch_id"] != _branch(current, input.branch_id or before["branch_id"]):
        raise auth_error("CUSTOMER_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE customers SET name=:name, mobile=:mobile, type=:type, address=:address, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *"""), {"id": customer_id, "name": _clean(input.name), "mobile": _clean(input.mobile), "type": _clean(input.type), "address": input.address.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _customer(dict(row)); _audit(session, current, "CUSTOMER_UPDATED", "Customer updated", _customer(before), payload)
    return payload


@router.post("/customers/{customer_id}/archive")
def archive_customer(customer_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.customers.write", "page.my-queue.write"), mutation=True)
    before = _row_or_404(session, "customers", customer_id)
    if before["archived_at"] is not None:
        raise auth_error("INTAKE_RECORD_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE customers SET archived_at=now(), archived_by=:actor_id, archive_reason=:reason, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *"""), {"id": customer_id, "reason": _clean(input.reason), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _customer(dict(row)); _audit(session, current, "CUSTOMER_ARCHIVED", input.reason.strip(), _customer(before), payload)
    return payload


@router.get("/vehicles")
def list_vehicles(scope: ScopedTenant, q: str = "", archived: bool = False, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _require_any(scope, ("page.vehicles.read", "page.my-queue.read"))
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("""SELECT * FROM vehicles WHERE (:archived = (archived_at IS NOT NULL)) AND (:branch_id IS NULL OR branch_id=:branch_id) AND (:q='' OR number ILIKE :needle OR make ILIKE :needle OR model ILIKE :needle) ORDER BY number, id"""), {"archived": archived, "branch_id": str(branch_id) if branch_id else None, "q": q.strip(), "needle": f"%{q.strip()}%"}).mappings().all()
    return [_vehicle(dict(row)) for row in rows]


@router.post("/vehicles", status_code=status.HTTP_201_CREATED)
def create_vehicle(input: VehicleInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_require_any(scope, ("page.vehicles.write", "page.my-queue.write"), mutation=True), input.branch_id)
    _assert_active_customer(session, input.customer_id, branch_id)
    row = session.execute(text("""INSERT INTO vehicles (tenant_id, branch_id, customer_id, number, make, model, color, km, engine_no, created_by, updated_by) VALUES (:tenant_id,:branch_id,:customer_id,:number,:make,:model,:color,:km,:engine_no,:actor_id,:actor_id) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "customer_id": input.customer_id, "number": _clean(input.number).upper(), "make": _clean(input.make), "model": _clean(input.model), "color": input.color.strip(), "km": input.km, "engine_no": input.engine_no.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _vehicle(dict(row)); _audit(session, current, "VEHICLE_CREATED", "Vehicle created", {}, payload)
    return payload


@router.get("/vehicles/{vehicle_id}")
def get_vehicle(vehicle_id: int, scope: ScopedTenant) -> dict[str, object]:
    session, _ = scope; _require_any(scope, ("page.vehicles.read", "page.my-queue.read"))
    return _vehicle(_row_or_404(session, "vehicles", vehicle_id))


@router.put("/vehicles/{vehicle_id}")
def update_vehicle(vehicle_id: int, input: VehicleInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.vehicles.write", "page.my-queue.write"), mutation=True)
    before = _row_or_404(session, "vehicles", vehicle_id); branch_id = _branch(current, input.branch_id or before["branch_id"])
    if before["archived_at"] is not None or before["branch_id"] != branch_id: raise auth_error("VEHICLE_NOT_AVAILABLE", status.HTTP_422_UNPROCESSABLE_ENTITY)
    _assert_active_customer(session, input.customer_id, branch_id)
    row = session.execute(text("""UPDATE vehicles SET customer_id=:customer_id, number=:number, make=:make, model=:model, color=:color, km=:km, engine_no=:engine_no, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *"""), {"id": vehicle_id, "customer_id": input.customer_id, "number": _clean(input.number).upper(), "make": _clean(input.make), "model": _clean(input.model), "color": input.color.strip(), "km": input.km, "engine_no": input.engine_no.strip(), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _vehicle(dict(row)); _audit(session, current, "VEHICLE_UPDATED", "Vehicle updated", _vehicle(before), payload)
    return payload


@router.post("/vehicles/{vehicle_id}/archive")
def archive_vehicle(vehicle_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.vehicles.write", "page.my-queue.write"), mutation=True); before = _row_or_404(session, "vehicles", vehicle_id)
    if before["archived_at"] is not None: raise auth_error("INTAKE_RECORD_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE vehicles SET archived_at=now(), archived_by=:actor_id, archive_reason=:reason, updated_by=:actor_id, updated_at=now() WHERE id=:id RETURNING *"""), {"id": vehicle_id, "reason": _clean(input.reason), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _vehicle(dict(row)); _audit(session, current, "VEHICLE_ARCHIVED", input.reason.strip(), _vehicle(before), payload)
    return payload


@router.get("/visits")
def list_visits(scope: ScopedTenant, q: str = "", archived: bool = False, branch_id: UUID | None = Query(default=None, alias="branchId")) -> list[dict[str, object]]:
    session, current = scope; _require_any(scope, ("page.receive-vehicle.read", "page.customers.read", "page.my-queue.read"))
    if branch_id is not None: _branch(current, branch_id)
    rows = session.execute(text("""SELECT v.* FROM visits v JOIN customers c ON c.id=v.customer_id JOIN vehicles h ON h.id=v.vehicle_id WHERE (:archived = (v.archived_at IS NOT NULL)) AND (:branch_id IS NULL OR v.branch_id=:branch_id) AND (:q='' OR c.name ILIKE :needle OR c.mobile ILIKE :needle OR h.number ILIKE :needle OR v.requested_work ILIKE :needle) ORDER BY v.received_at DESC, v.id DESC"""), {"archived": archived, "branch_id": str(branch_id) if branch_id else None, "q": q.strip(), "needle": f"%{q.strip()}%"}).mappings().all()
    return [_visit(dict(row)) for row in rows]


@router.post("/visits", status_code=status.HTTP_201_CREATED)
def create_visit(input: VisitCreate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; branch_id = _branch(_require_any(scope, ("page.receive-vehicle.write", "page.customers.write", "page.my-queue.write"), mutation=True), input.branch_id)
    _assert_active_customer(session, input.customer_id, branch_id); _assert_active_vehicle(session, input.vehicle_id, branch_id, input.customer_id)
    row = session.execute(text("""INSERT INTO visits (tenant_id,branch_id,customer_id,vehicle_id,advisor_id,received_by,fuel,odo_reading,fuel_level_value,fuel_level_unit,keys,accessories,requested_work,photos_note) VALUES (:tenant_id,:branch_id,:customer_id,:vehicle_id,:advisor_id,:actor_id,:fuel,:odo_reading,:fuel_level_value,:fuel_level_unit,:keys,:accessories,:requested_work,:photos_note) RETURNING *"""), {"tenant_id": str(current.tenant_id), "branch_id": str(branch_id), "customer_id": input.customer_id, "vehicle_id": input.vehicle_id, "advisor_id": str(input.advisor_id) if input.advisor_id else None, "actor_id": str(current.actor_id), "fuel": _clean(input.fuel), "odo_reading": input.odo_reading, "fuel_level_value": input.fuel_level_value.strip(), "fuel_level_unit": input.fuel_level_unit.strip(), "keys": input.keys.strip(), "accessories": input.accessories.strip(), "requested_work": _clean(input.requested_work), "photos_note": input.photos_note.strip()}).mappings().one()
    payload = _visit(dict(row)); _audit(session, current, "VISIT_CREATED", "Vehicle received", {}, payload)
    return payload


@router.get("/visits/{visit_id}")
def get_visit(visit_id: int, scope: ScopedTenant) -> dict[str, object]:
    session, _ = scope; _require_any(scope, ("page.receive-vehicle.read", "page.customers.read", "page.my-queue.read"))
    return _visit(_row_or_404(session, "visits", visit_id))


@router.put("/visits/{visit_id}")
def update_visit(visit_id: int, input: VisitUpdate, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.receive-vehicle.write", "page.customers.write", "page.my-queue.write"), mutation=True); before = _row_or_404(session, "visits", visit_id)
    if before["archived_at"] is not None: raise auth_error("INTAKE_RECORD_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE visits SET advisor_id=:advisor_id,fuel=:fuel,odo_reading=:odo_reading,fuel_level_value=:fuel_level_value,fuel_level_unit=:fuel_level_unit,keys=:keys,accessories=:accessories,requested_work=:requested_work,photos_note=:photos_note,updated_at=now() WHERE id=:id RETURNING *"""), {"id": visit_id, "advisor_id": str(input.advisor_id) if input.advisor_id else None, "fuel": _clean(input.fuel), "odo_reading": input.odo_reading, "fuel_level_value": input.fuel_level_value.strip(), "fuel_level_unit": input.fuel_level_unit.strip(), "keys": input.keys.strip(), "accessories": input.accessories.strip(), "requested_work": _clean(input.requested_work), "photos_note": input.photos_note.strip()}).mappings().one()
    payload = _visit(dict(row)); _audit(session, current, "VISIT_UPDATED", "Visit updated", _visit(before), payload)
    return payload


@router.post("/visits/{visit_id}/archive")
def archive_visit(visit_id: int, input: ArchiveInput, scope: ScopedTenant) -> dict[str, object]:
    session, current = scope; _require_any(scope, ("page.receive-vehicle.write", "page.customers.write", "page.my-queue.write"), mutation=True); before = _row_or_404(session, "visits", visit_id)
    if before["archived_at"] is not None: raise auth_error("INTAKE_RECORD_ARCHIVED", status.HTTP_422_UNPROCESSABLE_ENTITY)
    row = session.execute(text("""UPDATE visits SET archived_at=now(),archived_by=:actor_id,archive_reason=:reason,updated_at=now() WHERE id=:id RETURNING *"""), {"id": visit_id, "reason": _clean(input.reason), "actor_id": str(current.actor_id)}).mappings().one()
    payload = _visit(dict(row)); _audit(session, current, "VISIT_ARCHIVED", input.reason.strip(), _visit(before), payload)
    return payload
