"""Inspect or import the repository's bundled SQLite demo into the `demo` tenant.

Run from backend/: python scripts/import_bundled_demo.py [--apply]
The default is a source-only dry run. --apply requires migrated PostgreSQL and
prints the same reconciliation before opening its one transaction.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import html
import json
import sqlite3
import sys
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from uuid import uuid4

from sqlalchemy import create_engine, text

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.config import get_settings
from app.database_auth import hash_password
from app.tenant_admin import DEFAULT_ROLE_PERMISSIONS, SYSTEM_ROLE_KEYS

SOURCE = next((path for path in (
    Path(__file__).resolve().parents[2] / "public" / "workshopos-demo.sqlite",
    Path(__file__).resolve().parents[1] / "public" / "workshopos-demo.sqlite",
) if path.is_file()), Path(__file__).resolve().parents[2] / "public" / "workshopos-demo.sqlite")
IMPORT_VERSION = 20
CANONICAL = {"users", "customers", "vehicles", "visits", "job_cards", "estimates", "estimate_items",
             "bookings",
             "inventory", "suppliers", "purchase_orders", "purchase_order_lines", "stock_inwards", "followups", "photos",
             "tasks", "qc_checks", "status_history",
             "sales_leads", "sales_quotations", "sales_quotation_lines",
             "invoices", "invoice_items", "payments", "receipts", "gate_passes", "material_requests",
             "checklist_cycles", "checklist_items", "service_departments", "service_department_managers",
             "purchase_order_receipts", "purchase_order_receipt_lines", "purchase_order_confirmations",
             "service_catalog_items", "job_task_list_items"}
LINKS = {
    "vehicles": {"customer_id": "customers"},
    "visits": {"customer_id": "customers", "vehicle_id": "vehicles", "advisor_id": "users", "received_by": "users"},
    "job_cards": {"visit_id": "visits", "advisor_id": "users", "technician_id": "users"},
    "status_history": {"job_card_id": "job_cards"},
    "checklist_cycles": {"job_card_id": "job_cards"},
    "checklist_items": {"checklist_cycle_id": "checklist_cycles", "job_card_id": "job_cards"},
    "estimates": {"job_card_id": "job_cards"},
    "estimate_items": {"estimate_id": "estimates", "task_list_item_id": "job_task_list_items"},
    "approvals": {"job_card_id": "job_cards"},
    "tasks": {"job_card_id": "job_cards", "technician_id": "users"},
    "qc_checks": {"job_card_id": "job_cards"},
    "invoices": {"job_card_id": "job_cards"},
    "invoice_items": {"invoice_id": "invoices", "material_row_id": "material_requests"},
    "payments": {"job_card_id": "job_cards", "invoice_id": "invoices"},
    "receipts": {"job_card_id": "job_cards", "invoice_id": "invoices"},
    "gate_passes": {"job_card_id": "job_cards", "invoice_id": "invoices"},
    "material_requests": {"job_card_id": "job_cards", "item_id": "inventory"},
    "local_purchases": {"job_card_id": "job_cards"},
    "material_purchase_requests": {"job_card_id": "job_cards", "mapped_inventory_item_id": "inventory",
                                   "material_request_id": "material_requests", "local_purchase_id": "local_purchases"},
    "material_movements": {"job_card_id": "job_cards", "item_id": "inventory"},
    "inward_purchases": {"supplier_id": "suppliers", "purchase_order_id": "purchase_orders"},
    "inward_purchase_lines": {"purchase_id": "inward_purchases", "item_id": "inventory", "purchase_order_line_id": "purchase_order_lines"},
    "inward_purchase_attachments": {"purchase_id": "inward_purchases"},
    "inward_purchase_revisions": {"purchase_id": "inward_purchases"},
    "inward_purchase_revision_lines": {"revision_id": "inward_purchase_revisions", "item_id": "inventory"},
    "inward_purchase_events": {"purchase_id": "inward_purchases", "actor_id": "users"},
    "photos": {"job_card_id": "job_cards"},
    "followups": {"job_card_id": "job_cards"},
    "advisor_attendance": {"user_id": "users"},
    "material_events": {"job_card_id": "job_cards", "material_row_id": "material_requests", "old_item_id": "inventory", "new_item_id": "inventory"},
    "stock_ledger": {"job_card_id": "job_cards", "material_row_id": "material_requests", "item_id": "inventory", "inward_purchase_line_id": "inward_purchase_lines"},
    "invoice_events": {"job_card_id": "job_cards", "invoice_id": "invoices"},
    "material_approvals": {"job_card_id": "job_cards"},
    "material_approval_events": {"approval_id": "material_approvals", "job_card_id": "job_cards", "actor_id": "users"},
    "purchase_orders": {"supplier_id": "suppliers", "source_purchase_order_id": "purchase_orders"},
    "purchase_order_lines": {"purchase_order_id": "purchase_orders", "item_id": "inventory", "source_purchase_order_line_id": "purchase_order_lines"},
    "stock_inwards": {"item_id": "inventory", "purchase_order_id": "purchase_orders", "purchase_order_line_id": "purchase_order_lines", "ledger_id": "stock_ledger"},
    "bookings": {"customer_id": "customers", "vehicle_id": "vehicles", "visit_id": "visits", "job_card_id": "job_cards"},
    "booking_call_logs": {"booking_id": "bookings"},
    "booking_events": {"booking_id": "bookings", "actor_id": "users"},
    "service_catalog_items": {"service_department_id": "service_departments", "brand_id": "service_brands", "car_segment_id": "car_segments"},
    "job_task_list_items": {"job_card_id": "job_cards", "service_catalog_item_id": "service_catalog_items"},
    "booking_capacity_overrides": {"booking_id": "bookings"},
    "purchase_order_quotations": {"purchase_order_id": "purchase_orders", "purchase_order_line_id": "purchase_order_lines"},
    "purchase_order_receipts": {"purchase_order_id": "purchase_orders"},
    "purchase_order_receipt_lines": {"purchase_order_receipt_id": "purchase_order_receipts", "purchase_order_line_id": "purchase_order_lines"},
    "purchase_order_confirmations": {"purchase_order_id": "purchase_orders", "purchase_order_line_id": "purchase_order_lines"},
    "service_department_managers": {"department_id": "service_departments", "manager_id": "users"},
    "service_advisor_teams": {"department_id": "service_departments", "manager_id": "users", "advisor_id": "users"},
    "sales_quotations": {"lead_id": "sales_leads"},
    "sales_quotation_lines": {"quotation_id": "sales_quotations"},
}
ROLE = {"admin": "Owner/Admin", "service": "Service Advisor", "service_manager": "Service Department Manager",
        "reception": "Reception", "accounts": "Accounts", "store": "Store", "tech": "Technician"}


def _jsonable(value):
    if isinstance(value, bytes):
        return {"base64": base64.b64encode(value).decode()}
    return value


def inspect_source() -> tuple[dict[str, list[dict]], list[str]]:
    source = sqlite3.connect(f"file:{SOURCE}?mode=ro", uri=True)
    source.row_factory = sqlite3.Row
    names = [row[0] for row in source.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")]
    rows = {name: [dict(row) for row in source.execute(f'SELECT * FROM "{name}"')] for name in names}
    errors = []
    ids = {name: {row["id"] for row in records if "id" in row} for name, records in rows.items()}
    for table, columns in LINKS.items():
        for row in rows.get(table, []):
            for column, parent in columns.items():
                value = row.get(column)
                # The bundled SQLite uses zero for absent optional links in a few ledgers.
                if value not in (None, 0) and value not in ids[parent]:
                    errors.append(f"{table} #{row['id']}: {column}={value} missing from {parent}")
    for row in rows["users"]:
        if row["role"] not in ROLE:
            errors.append(f"users #{row['id']}: unknown role {row['role']}")
    receipts = {row["invoice_id"] for row in rows["receipts"]}
    payments = {row["invoice_id"] for row in rows["payments"]}
    if len(receipts) != len(rows["receipts"]) or receipts != payments:
        errors.append("Each payment must have exactly one matching receipt")
    jobs = {row["id"]: row for row in rows["job_cards"]}
    for row in rows["gate_passes"]:
        job = jobs[row["job_card_id"]]
        if not str(job["delivery_by"] or "").strip() or not str(job["acknowledgement"] or "").strip():
            errors.append(f"gate_passes #{row['id']}: missing handover details")
    for row in rows["invoice_items"]:
        if row["qty"] <= 0 or int(row["qty"]) != row["qty"] or row["rate"] < 0 or not 0 <= row["gst_rate"] <= 100:
            errors.append(f"invoice_items #{row['id']}: cannot represent line in PostgreSQL")
    for row in rows["payments"]:
        if row["mode"] not in {"CASH", "CARD", "UPI", "BANK_TRANSFER", "OTHER"} or row["amount"] <= 0:
            errors.append(f"payments #{row['id']}: invalid payment mode or amount")
    for row in rows["material_requests"]:
        if (row["requested_qty"] <= 0 or row["issued_qty"] < 0 or row["issued_qty"] > row["requested_qty"]
                or row["returned_qty"] < 0 or row["wasted_qty"] < 0
                or row["returned_qty"] + row["wasted_qty"] > row["issued_qty"]):
            errors.append(f"material_requests #{row['id']}: invalid reservation quantities")
    user_roles = {row["id"]: row["role"] for row in rows["users"]}
    for row in rows["service_department_managers"]:
        if user_roles.get(row["manager_id"]) != "service_manager":
            errors.append(f"service_department_managers department #{row['department_id']}: manager role missing")
    source.close()
    return rows, errors


def _insert(connection, statement: str, **params):
    return connection.execute(text(statement), params).scalar_one()


def _paise(value: object) -> int:
    return int((Decimal(str(value or 0)) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def _financial_document(db, tenant: str, branch: str, job_id: str, actor: str,
                        kind: str, number: str, issued_at: str, payload: dict,
                        sequences: dict[tuple[str, str], int]) -> int:
    year = int(issued_at[:4])
    month = int(issued_at[5:7])
    start = year if month >= 4 else year - 1
    fiscal_year = f"FY{start}-{str(start + 1)[-2:]}"
    key = (kind, fiscal_year)
    sequences[key] = sequences.get(key, 0) + 1
    snapshot = {"source": "bundled-demo-sqlite", "documentNo": number,
                "documentType": kind, "fiscalYear": fiscal_year, "record": payload}
    rendered = f"<!doctype html><html><head><meta charset='utf-8'><title>{html.escape(number)}</title></head>" \
               f"<body><h1>{html.escape(number)}</h1><pre>{html.escape(json.dumps(payload, ensure_ascii=False, default=str, indent=2))}</pre></body></html>"
    artifact = rendered.encode("utf-8")
    return _insert(db, """INSERT INTO financial_documents(tenant_id,branch_id,job_card_id,document_type,fiscal_year,
        sequence_value,document_no,template_version,snapshot,rendered_html,artifact,sha256,issued_by,issued_at)
        VALUES (:tenant,:branch,:job,:kind,:year,:sequence,:number,'bundled-demo-v1',CAST(:snapshot AS jsonb),
        :rendered,:artifact,:sha,:actor,:issued) RETURNING id""",
        tenant=tenant, branch=branch, job=job_id, kind=kind, year=fiscal_year,
        sequence=sequences[key], number=number, snapshot=json.dumps(snapshot, ensure_ascii=False, default=str),
        rendered=rendered, artifact=artifact, sha=hashlib.sha256(artifact).hexdigest(), actor=actor, issued=issued_at)


def apply(rows: dict[str, list[dict]], digest: str, counts: dict[str, int]) -> None:
    engine = create_engine(str(get_settings().database_url))
    with engine.begin() as db:
        existing = db.execute(text("SELECT id FROM tenants WHERE lower(code)='demo'")).scalar_one_or_none()
        if existing:
            run = db.execute(text("SELECT source_sha256, import_version FROM demo_import_runs WHERE tenant_id=:id"), {"id": existing}).mappings().one_or_none()
            if run and run["source_sha256"] == digest and run["import_version"] == IMPORT_VERSION:
                print("Already imported this exact bundled file; no records changed.")
                return
            raise RuntimeError("The demo tenant already exists without this import checksum; refusing to merge or overwrite it")
        tenant, branch = str(uuid4()), str(uuid4())
        db.execute(text("INSERT INTO tenants(id,name,code,lifecycle_state) VALUES (:id,'Sambit Autocare','demo','active')"), {"id": tenant})
        db.execute(text("INSERT INTO branches(id,tenant_id,name,is_primary) VALUES (:id,:tenant,'Main',true)"), {"id": branch, "tenant": tenant})
        roles = {}
        for name, permissions in DEFAULT_ROLE_PERMISSIONS.items():
            role_id = str(uuid4()); roles[name] = role_id
            db.execute(text("INSERT INTO tenant_roles(id,tenant_id,name,description,system_key) VALUES (:id,:tenant,:name,:description,:key)"),
                       {"id": role_id, "tenant": tenant, "name": name, "description": f"{name} workspace access", "key": SYSTEM_ROLE_KEYS[name]})
            for permission in permissions:
                db.execute(text("INSERT INTO role_permissions(role_id,permission) VALUES (:role,:permission)"), {"role": role_id, "permission": permission})
        mapped: dict[str, dict[int, str]] = {name: {} for name in CANONICAL}
        memberships: dict[int, str] = {}
        for row in rows["users"]:
            user, membership = str(uuid4()), str(uuid4())
            mapped["users"][row["id"]] = user
            memberships[row["id"]] = membership
            db.execute(text("""INSERT INTO platform_users(id,cognito_subject,display_name,email,status,password_hash)
                VALUES (:id,NULL,:name,:email,:status,:password)"""),
                {"id": user, "name": row["name"], "email": row["email"],
                 "status": "ARCHIVED" if row["archived_at"] else "ACTIVE", "password": hash_password(row["password"])})
            db.execute(text("INSERT INTO tenant_memberships(id,tenant_id,user_id,status) VALUES (:id,:tenant,:user,:status)"),
                       {"id": membership, "tenant": tenant, "user": user, "status": "ARCHIVED" if row["archived_at"] else "ACTIVE"})
            db.execute(text("INSERT INTO membership_branches(membership_id,branch_id,tenant_id) VALUES (:membership,:branch,:tenant)"),
                       {"membership": membership, "branch": branch, "tenant": tenant})
            db.execute(text("INSERT INTO membership_roles(membership_id,role_id,tenant_id) VALUES (:membership,:role,:tenant)"),
                       {"membership": membership, "role": roles[ROLE[row["role"]]], "tenant": tenant})
            db.execute(text("UPDATE platform_users SET active_membership_id=:membership WHERE id=:user"),
                       {"membership": membership, "user": user})
        actor = mapped["users"][rows["users"][0]["id"]]
        for row in rows["service_departments"]:
            target = str(uuid4())
            db.execute(text("""INSERT INTO service_departments(id,tenant_id,branch_id,name,status,created_by,updated_by,
                created_at,updated_at) VALUES (:id,:tenant,:branch,:name,:status,:actor,:actor,:created,:updated)"""),
                {"id": target, "tenant": tenant, "branch": branch, "name": row["name"], "status": row["status"],
                 "actor": actor, "created": row["created_at"], "updated": row["updated_at"]})
            mapped["service_departments"][row["id"]] = target
        for row in rows["service_department_managers"]:
            db.execute(text("""INSERT INTO service_department_managers(tenant_id,branch_id,department_id,
                manager_membership_id,appointed_by) VALUES (:tenant,:branch,:department,:membership,:actor)"""),
                {"tenant": tenant, "branch": branch,
                 "department": mapped["service_departments"][row["department_id"]],
                 "membership": memberships[row["manager_id"]], "actor": actor})
            mapped["service_department_managers"][row["department_id"]] = memberships[row["manager_id"]]
        for row in rows["service_catalog_items"]:
            target = _insert(db, """INSERT INTO service_task_catalog(tenant_id,branch_id,name,description,rate,gst_rate,
                department_id,status,archived_at,archive_reason,created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:name,'',:rate,:gst,:department,:status,:archived,:reason,:actor,:actor,:created,:updated)
                RETURNING id""", tenant=tenant, branch=branch, name=row["name"], rate=row["base_rate"],
                gst=row["gst_rate"], department=mapped["service_departments"].get(row["service_department_id"]),
                status="ARCHIVED" if row["archived_at"] else "ACTIVE", archived=row["archived_at"],
                reason=row["archived_reason"], actor=actor,
                created=row["created_at"], updated=row["updated_at"])
            mapped["service_catalog_items"][row["id"]] = str(target)
        for row in rows["customers"]:
            target = _insert(db, """INSERT INTO customers(tenant_id,branch_id,name,mobile,type,address,created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:name,:mobile,:type,:address,:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, name=row["name"], mobile=row["mobile"], type=row["type"], address=row["address"] or "",
                actor=actor, created=row["created_at"], updated=row["updated_at"])
            mapped["customers"][row["id"]] = str(target)
        for row in rows["vehicles"]:
            target = _insert(db, """INSERT INTO vehicles(tenant_id,branch_id,customer_id,number,make,model,color,km,engine_no,created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:customer,:number,:make,:model,:color,:km,:engine,:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, customer=mapped["customers"][row["customer_id"]], number=row["number"],
                make=row["make"], model=row["model"], color=row["color"] or "", km=max(0, row["km"] or 0),
                engine=row["engine_no"] or "", actor=actor, created=row["created_at"], updated=row["updated_at"])
            mapped["vehicles"][row["id"]] = str(target)
        synthetic_booking_contacts = 0
        for row in rows["bookings"]:
            if row["customer_id"] is not None and row["vehicle_id"] is not None:
                continue
            customer = _insert(db, """INSERT INTO customers(tenant_id,branch_id,name,mobile,type,address,
                created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:name,:mobile,:type,'',:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, name=row["customer_name"], mobile=row["mobile"],
                type=row["customer_type"], actor=mapped["users"].get(row["created_by"], actor),
                created=row["created_at"], updated=row["updated_at"])
            vehicle = _insert(db, """INSERT INTO vehicles(tenant_id,branch_id,customer_id,number,make,model,color,km,
                engine_no,created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:customer,:number,:make,:model,:color,0,'',:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, customer=customer, number=row["vehicle_no"], make=row["make"],
                model=row["model"], color=row["color"] or "", actor=mapped["users"].get(row["created_by"], actor),
                created=row["created_at"], updated=row["updated_at"])
            row["_import_customer_id"], row["_import_vehicle_id"] = str(customer), str(vehicle)
            synthetic_booking_contacts += 1
        for row in rows["visits"]:
            target = _insert(db, """INSERT INTO visits(tenant_id,branch_id,customer_id,vehicle_id,advisor_id,received_by,received_at,fuel,odo_reading,
                fuel_level_value,fuel_level_unit,keys,accessories,requested_work,photos_note,created_at,updated_at)
                VALUES (:tenant,:branch,:customer,:vehicle,:advisor,:receiver,:received,:fuel,:odo,:fuel_value,:fuel_unit,:keys,:accessories,:work,:note,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, customer=mapped["customers"][row["customer_id"]], vehicle=mapped["vehicles"][row["vehicle_id"]],
                advisor=mapped["users"].get(row["advisor_id"]), receiver=mapped["users"][row["received_by"]], received=row["received_at"],
                fuel=row["fuel"] or "Unknown", odo=max(0, row["odo_reading"] or 0), fuel_value=row["fuel_level_value"] or "",
                fuel_unit=row["fuel_level_unit"] or "", keys=row["keys"] or "", accessories=row["accessories"] or "",
                work=row["requested_work"] or "Unspecified work", note=row["photos_note"] or "",
                created=row["created_at"], updated=row["updated_at"])
            mapped["visits"][row["id"]] = str(target)
        for row in rows["job_cards"]:
            target = _insert(db, """INSERT INTO job_cards(tenant_id,branch_id,job_no,visit_id,advisor_id,status,work_list,
                estimated_delivery,created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:number,:visit,:advisor,:status,:work,:delivery,:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, number=row["job_no"], visit=mapped["visits"][row["visit_id"]],
                advisor=mapped["users"].get(row["advisor_id"]), status=row["main_status"], work=row["work_list"] or "",
                delivery=row["estimated_delivery"], actor=actor, created=row["created_at"], updated=row["updated_at"])
            mapped["job_cards"][row["id"]] = str(target)
        for row in rows["bookings"]:
            status_value = {
                "Booked": "BOOKED", "Confirmed": "CONFIRMED", "Rescheduled": "RESCHEDULED",
                "Arrived": "ARRIVED", "Cancelled": "CANCELLED", "No-show": "NO_SHOW",
            }.get(row["status"], row["status"])
            if status_value not in {"BOOKED", "CONFIRMED", "RESCHEDULED", "ARRIVED", "CANCELLED", "NO_SHOW"}:
                raise RuntimeError(f"Unsupported booking status: {row['status']}")
            target = _insert(db, """INSERT INTO bookings(tenant_id,branch_id,customer_id,vehicle_id,booking_date,
                service_type,arrival_window,requested_work,status,visit_id,job_card_id,arrived_at,
                created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:customer,:vehicle,:date,:service,:window,:work,:status,:visit,:job,:arrived,
                :actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch,
                customer=row.get("_import_customer_id") or mapped["customers"][row["customer_id"]],
                vehicle=row.get("_import_vehicle_id") or mapped["vehicles"][row["vehicle_id"]], date=row["booking_date"],
                service=row["service_type"], window=row["arrival_window"] or "",
                work=row["requested_work"] or "Demo service request", status=status_value,
                visit=mapped["visits"].get(row["visit_id"]), job=mapped["job_cards"].get(row["job_card_id"]),
                arrived=row["arrived_at"], actor=mapped["users"].get(row["created_by"], actor),
                created=row["created_at"], updated=row["updated_at"])
            mapped["bookings"][row["id"]] = str(target)
        for row in rows["job_task_list_items"]:
            target = _insert(db, """INSERT INTO job_service_tasks(tenant_id,branch_id,job_card_id,catalogue_item_id,
                name,base_rate,gst_rate,done,archived_at,archive_reason,created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:job,:catalogue,:name,:rate,:gst,:done,:archived,:reason,:actor,:actor,:created,:updated)
                RETURNING id""", tenant=tenant, branch=branch, job=mapped["job_cards"][row["job_card_id"]],
                catalogue=mapped["service_catalog_items"].get(row["service_catalog_item_id"]), name=row["name"],
                rate=row["base_rate"], gst=row["gst_rate"], done=bool(row["done"]),
                archived=row["archived_at"], reason=row["archived_reason"], actor=actor,
                created=row["created_at"], updated=row["updated_at"])
            mapped["job_task_list_items"][row["id"]] = str(target)
        for row in rows["checklist_cycles"]:
            target = _insert(db, """INSERT INTO job_checklist_cycles(tenant_id,branch_id,job_card_id,stage,
                cycle_number,started_at,completed_at)
                VALUES (:tenant,:branch,:job,:stage,:number,:started,:completed) RETURNING id""",
                tenant=tenant, branch=branch, job=mapped["job_cards"][row["job_card_id"]],
                stage=row["stage"], number=row["cycle_number"], started=row["started_at"], completed=row["completed_at"])
            mapped["checklist_cycles"][row["id"]] = str(target)
        for row in rows["checklist_items"]:
            target = _insert(db, """INSERT INTO job_checklist_items(tenant_id,branch_id,cycle_id,job_card_id,
                item_key,label,sort_order,required,checked_by,checked_at,na_by,na_at,started_at,completed_at)
                VALUES (:tenant,:branch,:cycle,:job,:key,:label,:sort,:required,:checked_by,:checked_at,
                :na_by,:na_at,:started,:completed) RETURNING id""",
                tenant=tenant, branch=branch, cycle=mapped["checklist_cycles"][row["checklist_cycle_id"]],
                job=mapped["job_cards"][row["job_card_id"]], key=row["item_key"], label=row["label"],
                sort=row["sort_order"], required=bool(row["required"]), checked_by=mapped["users"].get(row["checked_by"]),
                checked_at=row["checked_at"], na_by=mapped["users"].get(row["na_by"]), na_at=row["na_at"],
                started=row["started_at"], completed=row["completed_at"])
            mapped["checklist_items"][row["id"]] = str(target)
        for row in rows["estimates"]:
            target = _insert(db, """INSERT INTO estimates(tenant_id,branch_id,job_card_id,revision,status,discount,gst_rate,note,
                created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:job,1,'DRAFT',:discount,:gst,:note,:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, job=mapped["job_cards"][row["job_card_id"]], discount=row["discount"],
                gst=row["gst_rate"], note=row["approval_note"] or "", actor=actor, created=row["created_at"], updated=row["updated_at"])
            mapped["estimates"][row["id"]] = str(target)
        line_numbers: dict[int, int] = {}
        for row in rows["estimate_items"]:
            line_numbers[row["estimate_id"]] = line_numbers.get(row["estimate_id"], 0) + 1
            target = _insert(db, """INSERT INTO estimate_lines(tenant_id,branch_id,estimate_id,line_no,kind,description,quantity,rate,gst_rate)
                VALUES (:tenant,:branch,:estimate,:line,:kind,:description,:quantity,:rate,:gst) RETURNING id""",
                tenant=tenant, branch=branch, estimate=mapped["estimates"][row["estimate_id"]], line=line_numbers[row["estimate_id"]],
                kind=row["kind"], description=row["description"], quantity=row["qty"], rate=row["rate"], gst=row["gst_rate"])
            mapped["estimate_items"][row["id"]] = str(target)
        for row in rows["estimates"]:
            if row["status"].lower() == "approved":
                db.execute(text("UPDATE estimates SET status='APPROVED' WHERE id=:id"), {"id": mapped["estimates"][row["id"]]})
        net_material_outflow: dict[int, Decimal] = {}
        for material in rows["material_requests"]:
            net_material_outflow[material["item_id"]] = net_material_outflow.get(material["item_id"], Decimal(0)) + (
                Decimal(str(material["issued_qty"])) - Decimal(str(material["returned_qty"])))
        for row in rows["inventory"]:
            target = _insert(db, """INSERT INTO catalogue_items(tenant_id,branch_id,sku,category,name,unit,low_stock_qty,selling_price,
                created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:sku,:category,:name,:unit,:low,:price,:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, sku=row["sku"], category=row["category"] or "", name=row["name"],
                unit=row["unit"], low=row["low_stock_qty"], price=row["selling_price"], actor=actor,
                created=row["created_at"], updated=row["updated_at"])
            mapped["inventory"][row["id"]] = str(target)
            opening_stock = Decimal(str(row["stock_qty"])) + net_material_outflow.get(row["id"], Decimal(0))
            if opening_stock:
                db.execute(text("""INSERT INTO stock_ledger(tenant_id,branch_id,item_id,entry_type,quantity,unit_cost,reason,actor_id,created_at)
                    VALUES (:tenant,:branch,:item,'ADJUSTMENT',:qty,0,'Bundled demo pre-issue stock',:actor,:created)"""),
                    {"tenant": tenant, "branch": branch, "item": target, "qty": opening_stock, "actor": actor, "created": row["created_at"]})
        for row in rows["material_requests"]:
            status_value = "ISSUED" if row["issued_qty"] >= row["requested_qty"] else (
                "PARTIALLY_ISSUED" if row["issued_qty"] else "RESERVED")
            target = _insert(db, """INSERT INTO material_reservations(tenant_id,branch_id,job_card_id,item_id,
                reserved_qty,status,note,created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:job,:item,:qty,:status,:note,:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, job=mapped["job_cards"][row["job_card_id"]],
                item=mapped["inventory"][row["item_id"]], qty=row["requested_qty"], status=status_value,
                note=row["note"] or "", actor=actor, created=row["created_at"], updated=row["updated_at"])
            mapped["material_requests"][row["id"]] = str(target)
            for kind, quantity in (("RESERVE", row["requested_qty"]), ("ISSUE", row["issued_qty"]),
                                   ("RETURN", row["returned_qty"]), ("WASTE", row["wasted_qty"])):
                if not quantity:
                    continue
                db.execute(text("""INSERT INTO material_ledger(tenant_id,branch_id,reservation_id,job_card_id,
                    item_id,entry_type,quantity,reason,actor_id,created_at)
                    VALUES (:tenant,:branch,:reservation,:job,:item,:kind,:qty,:reason,:actor,:created)"""),
                    {"tenant": tenant, "branch": branch, "reservation": target,
                     "job": mapped["job_cards"][row["job_card_id"]], "item": mapped["inventory"][row["item_id"]],
                     "kind": kind, "qty": quantity, "reason": "Bundled demo material history", "actor": actor,
                     "created": row["created_at"] if kind == "RESERVE" else row["updated_at"]})
        for row in rows["suppliers"]:
            target = _insert(db, """INSERT INTO suppliers(tenant_id,branch_id,name,mobile,email,created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:name,:mobile,:email,:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, name=row["name"], mobile=row["phone"] or "", email=row["email"] or "",
                actor=mapped["users"].get(row["created_by"], actor), created=row["created_at"], updated=row["updated_at"])
            mapped["suppliers"][row["id"]] = str(target)
        for row in rows["purchase_orders"]:
            status = {"Draft": "DRAFT", "Sent": "SENT", "Closed": "CLOSED", "Cancelled": "CANCELLED"}.get(row["status"])
            if status is None:
                raise RuntimeError(f"Unsupported purchase order status: {row['status']}")
            target = _insert(db, """INSERT INTO purchase_orders(tenant_id,branch_id,supplier_id,po_number,order_date,status,notes,
                created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:supplier,:number,:date,:status,:notes,:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, supplier=mapped["suppliers"][row["supplier_id"]], number=row["po_number"],
                date=row["order_date"], status=status, notes=row["notes"] or "", actor=mapped["users"].get(row["created_by"], actor),
                created=row["created_at"], updated=row["updated_at"])
            mapped["purchase_orders"][row["id"]] = str(target)
        po_line_numbers: dict[int, int] = {}
        for row in rows["purchase_order_lines"]:
            po_line_numbers[row["purchase_order_id"]] = po_line_numbers.get(row["purchase_order_id"], 0) + 1
            target = _insert(db, """INSERT INTO purchase_order_lines(tenant_id,branch_id,purchase_order_id,item_id,line_no,ordered_qty,
                unit_cost,discount,gst_rate)
                VALUES (:tenant,:branch,:order,:item,:line,:qty,:cost,:discount,:gst) RETURNING id""",
                tenant=tenant, branch=branch, order=mapped["purchase_orders"][row["purchase_order_id"]],
                item=mapped["inventory"][row["item_id"]], line=po_line_numbers[row["purchase_order_id"]],
                qty=row["ordered_qty"], cost=row["unit_cost"], discount=row["discount"], gst=row["gst_rate"])
            mapped["purchase_order_lines"][row["id"]] = str(target)
        for row in rows["purchase_order_receipts"]:
            target = _insert(db, """INSERT INTO purchase_order_delivery_receipts(tenant_id,branch_id,purchase_order_id,
                request_key,note,received_by,received_at)
                VALUES (:tenant,:branch,:order,:key,:note,:actor,:received) RETURNING id""",
                tenant=tenant, branch=branch, order=mapped["purchase_orders"][row["purchase_order_id"]],
                key=f"bundled-demo-receipt-{row['id']}", note=row["note"] or "",
                actor=mapped["users"].get(row["received_by"], actor), received=row["received_at"])
            mapped["purchase_order_receipts"][row["id"]] = str(target)
        for row in rows["purchase_order_receipt_lines"]:
            target = _insert(db, """INSERT INTO purchase_order_delivery_receipt_lines(tenant_id,branch_id,receipt_id,
                purchase_order_line_id,delivered_qty) VALUES (:tenant,:branch,:receipt,:line,:qty) RETURNING id""",
                tenant=tenant, branch=branch,
                receipt=mapped["purchase_order_receipts"][row["purchase_order_receipt_id"]],
                line=mapped["purchase_order_lines"][row["purchase_order_line_id"]], qty=row["delivered_qty"])
            mapped["purchase_order_receipt_lines"][row["id"]] = str(target)
        for row in rows["purchase_order_confirmations"]:
            rejected = row["returned_qty"] + row["damaged_qty"] + row["wasted_qty"]
            target = _insert(db, """INSERT INTO purchase_order_delivery_confirmations(tenant_id,branch_id,
                purchase_order_id,purchase_order_line_id,request_key,accepted_qty,rejected_qty,rejection_reason,
                confirmed_by,confirmed_at)
                VALUES (:tenant,:branch,:order,:line,:key,:accepted,:rejected,:reason,:actor,:confirmed) RETURNING id""",
                tenant=tenant, branch=branch, order=mapped["purchase_orders"][row["purchase_order_id"]],
                line=mapped["purchase_order_lines"][row["purchase_order_line_id"]],
                key=f"bundled-demo-confirmation-{row['id']}", accepted=row["accepted_qty"], rejected=rejected,
                reason="Bundled demo: returned/damaged/wasted details in source archive" if rejected else "",
                actor=mapped["users"].get(row["confirmed_by"], actor), confirmed=row["confirmed_at"])
            mapped["purchase_order_confirmations"][row["id"]] = str(target)
        confirmation_for_line = {row["purchase_order_line_id"]: mapped["purchase_order_confirmations"][row["id"]]
                                 for row in rows["purchase_order_confirmations"]}
        for row in rows["stock_inwards"]:
            target = _insert(db, """INSERT INTO stock_inwards(tenant_id,branch_id,item_id,purchase_order_id,purchase_order_line_id,
                delivery_confirmation_id,qty,unit_cost,note,received_by,received_at)
                VALUES (:tenant,:branch,:item,:order,:line,:confirmation,:qty,:cost,:note,:actor,:received) RETURNING id""",
                tenant=tenant, branch=branch, item=mapped["inventory"][row["item_id"]],
                order=mapped["purchase_orders"].get(row["purchase_order_id"]),
                line=mapped["purchase_order_lines"].get(row["purchase_order_line_id"]),
                confirmation=confirmation_for_line.get(row["purchase_order_line_id"]),
                qty=row["qty"], cost=0, note=row["note"] or "Bundled demo inward",
                actor=mapped["users"].get(row["received_by"], actor), received=row["received_at"])
            mapped["stock_inwards"][row["id"]] = str(target)
        for row in rows["followups"]:
            target = _insert(db, """INSERT INTO followups(tenant_id,branch_id,job_card_id,note,due_at,status,outcome,completed_at,
                completed_by,created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:job,:note,:due,:status,:outcome,:completed,:completed_by,:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, job=mapped["job_cards"][row["job_card_id"]], note=row["note"] or "Demo follow-up",
                due=row["due_at"] or None, status="COMPLETED" if row["done"] else "OPEN", outcome=row["outcome"] or "",
                completed=row["updated_at"] if row["done"] else None, completed_by=actor if row["done"] else None,
                actor=actor, created=row["created_at"], updated=row["updated_at"])
            mapped["followups"][row["id"]] = str(target)
        for row in rows["photos"]:
            target = _insert(db, """INSERT INTO job_media(tenant_id,branch_id,job_card_id,label,category,src,
                created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:job,:label,:category,:src,:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, job=mapped["job_cards"][row["job_card_id"]],
                label=row["label"] or "", category=row.get("category") or "", src=row["src"] or "",
                actor=actor, created=row.get("created_at") or rows["job_cards"][0]["created_at"],
                updated=row.get("updated_at") or rows["job_cards"][0]["updated_at"])
            mapped["photos"][row["id"]] = str(target)
        for row in rows["tasks"]:
            status = {"Pending": "PENDING", "Started": "IN_PROGRESS", "Completed": "COMPLETED"}.get(row["status"])
            if status is None:
                raise RuntimeError(f"Unsupported task status: {row['status']}")
            target = _insert(db, """INSERT INTO technician_tasks(tenant_id,branch_id,job_card_id,assigned_to,title,notes,status,
                created_by,updated_by,created_at,updated_at,completed_at)
                VALUES (:tenant,:branch,:job,:assignee,:title,:notes,:status,:actor,:actor,:created,:updated,:completed) RETURNING id""",
                tenant=tenant, branch=branch, job=mapped["job_cards"][row["job_card_id"]],
                assignee=mapped["users"][row["technician_id"]], title=row["title"], notes=row["notes"] or "",
                status=status, actor=actor, created=row["created_at"], updated=row["updated_at"], completed=row["completed_at"])
            mapped["tasks"][row["id"]] = str(target)
        for row in rows["qc_checks"]:
            target = _insert(db, """INSERT INTO qc_checks(tenant_id,branch_id,job_card_id,label,required,status,created_by)
                VALUES (:tenant,:branch,:job,:label,true,:status,:actor) RETURNING id""",
                tenant=tenant, branch=branch, job=mapped["job_cards"][row["job_card_id"]], label=row["label"],
                status="PASSED" if row["passed"] else ("FAILED" if row["fail_reason"] else "PENDING"), actor=actor)
            mapped["qc_checks"][row["id"]] = str(target)
        previous_status: dict[int, str] = {}
        for row in sorted(rows["status_history"], key=lambda item: (item["job_card_id"], item["created_at"], item["id"])):
            before = previous_status.get(row["job_card_id"], row["main_status"])
            target = _insert(db, """INSERT INTO job_events(tenant_id,branch_id,job_card_id,command,from_status,to_status,reason,actor_id,created_at)
                VALUES (:tenant,:branch,:job,'IMPORTED_STATUS',:before,:after,:reason,:actor,:created) RETURNING id""",
                tenant=tenant, branch=branch, job=mapped["job_cards"][row["job_card_id"]], before=before,
                after=row["main_status"], reason=f"{row['sub_status'] or ''} {row['note'] or ''}".strip(),
                actor=actor, created=row["created_at"])
            mapped["status_history"][row["id"]] = str(target)
            previous_status[row["job_card_id"]] = row["main_status"]
        for row in rows["sales_leads"]:
            target = _insert(db, """INSERT INTO sales_leads(tenant_id,branch_id,display_name,phone,company,company_not_entered,email,email_not_entered,
                address,service_interest,notes,stage,temperature,follow_up_due,site_visit_completed,site_visit_date,created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:name,:phone,:company,:company_missing,:email,:email_missing,:address,:interest,:notes,:stage,:temperature,
                :due,:visited,:visit_date,:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, name=row["display_name"], phone=row["phone"], company=row["company"] or "",
                company_missing=bool(row["company_not_entered"]), email=row["email"] or "", email_missing=bool(row["email_not_entered"]),
                address=row["address"] or "", interest=row["service_interest"] or "", notes=row["notes"] or "",
                stage=row["stage"], temperature=row["temperature"], due=row["follow_up_due"], visited=bool(row["site_visit_completed"]),
                visit_date=row["site_visit_date"], actor=actor, created=row["created_at"], updated=row["updated_at"])
            mapped["sales_leads"][row["id"]] = str(target)
        source_leads = {row["id"]: row for row in rows["sales_leads"]}
        quotation_lines = {}
        for line in rows["sales_quotation_lines"]:
            quotation_lines.setdefault(line["quotation_id"], []).append(line)
        for row in rows["sales_quotations"]:
            source_lead = source_leads[row["lead_id"]]
            snapshot = {"templateId": row["template_id"], "templateHtml": row["template_html"],
                        "leadName": source_lead["display_name"], "phone": source_lead["phone"],
                        "validUntil": row["valid_until"], "customerNotes": row["customer_notes"],
                        "discount": row["discount"], "subtotal": row["subtotal"],
                        "gstAmount": row["gst_amount"], "total": row["total"],
                        "lines": [{"kind": line["kind"], "description": line["description"],
                                   "quantity": line["quantity"], "rate": line["rate"], "gstRate": line["gst_rate"]}
                                  for line in quotation_lines.get(row["id"], [])]}
            target = _insert(db, """INSERT INTO quotations(tenant_id,branch_id,lead_id,quotation_no,status,valid_until,customer_notes,discount,subtotal,
                gst_amount,total,template_id,template_html,document_snapshot,created_by,updated_by,created_at,updated_at)
                VALUES (:tenant,:branch,:lead,:number,:status,:valid,:notes,:discount,:subtotal,:gst,:total,:template,:html,
                CAST(:snapshot AS jsonb),:actor,:actor,:created,:updated) RETURNING id""",
                tenant=tenant, branch=branch, lead=mapped["sales_leads"][row["lead_id"]], number=row["quotation_no"], status=row["status"],
                valid=row["valid_until"], notes=row["customer_notes"] or "", discount=row["discount"], subtotal=row["subtotal"],
                gst=row["gst_amount"], total=row["total"], template=row["template_id"], html=row["template_html"],
                snapshot=json.dumps(snapshot, ensure_ascii=False), actor=actor,
                created=row["created_at"], updated=row["updated_at"])
            mapped["sales_quotations"][row["id"]] = str(target)
        for row in rows["sales_quotation_lines"]:
            target = _insert(db, """INSERT INTO quotation_lines(tenant_id,branch_id,quotation_id,line_no,kind,description,quantity,rate,gst_rate)
                VALUES (:tenant,:branch,:quotation,:line_no,:kind,:description,:quantity,:rate,:gst) RETURNING id""",
                tenant=tenant, branch=branch, quotation=mapped["sales_quotations"][row["quotation_id"]], line_no=row["line_no"],
                kind=row["kind"], description=row["description"], quantity=row["quantity"], rate=row["rate"], gst=row["gst_rate"])
            mapped["sales_quotation_lines"][row["id"]] = str(target)
        sequences: dict[tuple[str, str], int] = {}
        invoice_lines_by_invoice: dict[int, list[dict]] = {}
        for line in rows["invoice_items"]:
            invoice_lines_by_invoice.setdefault(line["invoice_id"], []).append(line)
        for row in sorted(rows["invoices"], key=lambda item: (item["created_at"], item["id"])):
            job = mapped["job_cards"][row["job_card_id"]]
            document = _financial_document(db, tenant, branch, job, actor, "INVOICE", row["invoice_no"],
                                           row["document_generated_at"] or row["created_at"],
                                           {"invoice": row, "lines": invoice_lines_by_invoice.get(row["id"], [])}, sequences)
            target = _insert(db, """INSERT INTO invoices(tenant_id,branch_id,job_card_id,issued_document_id,subtotal_paise,
                discount_paise,tax_paise,total_paise,created_by,created_at)
                VALUES (:tenant,:branch,:job,:document,:subtotal,:discount,:tax,:total,:actor,:created) RETURNING id""",
                tenant=tenant, branch=branch, job=job, document=document, subtotal=_paise(row["subtotal"]),
                discount=_paise(row["discount"]), tax=_paise(row["gst_amount"]), total=_paise(row["total"]),
                actor=actor, created=row["created_at"])
            mapped["invoices"][row["id"]] = str(target)
        invoice_line_numbers: dict[int, int] = {}
        for row in rows["invoice_items"]:
            invoice_line_numbers[row["invoice_id"]] = invoice_line_numbers.get(row["invoice_id"], 0) + 1
            amount = _paise(row["rate"])
            taxable = _paise(Decimal(str(row["qty"])) * Decimal(str(row["rate"])))
            tax = int((Decimal(taxable) * Decimal(str(row["gst_rate"])) / Decimal(100))
                      .quantize(Decimal("1"), rounding=ROUND_HALF_UP))
            target = _insert(db, """INSERT INTO invoice_lines(tenant_id,branch_id,invoice_id,line_no,description,
                quantity,unit_amount_paise,gst_rate_bps,taxable_paise,tax_paise,total_paise)
                VALUES (:tenant,:branch,:invoice,:line,:description,:quantity,:amount,:gst,:taxable,:tax,:total) RETURNING id""",
                tenant=tenant, branch=branch, invoice=mapped["invoices"][row["invoice_id"]],
                line=invoice_line_numbers[row["invoice_id"]], description=row["description"], quantity=int(row["qty"]),
                amount=amount, gst=int(Decimal(str(row["gst_rate"])) * 100), taxable=taxable, tax=tax,
                total=taxable + tax)
            mapped["invoice_items"][row["id"]] = str(target)
        receipt_by_invoice = {row["invoice_id"]: row for row in rows["receipts"]}
        for row in sorted(rows["payments"], key=lambda item: (item["created_at"], item["id"])):
            receipt = receipt_by_invoice[row["invoice_id"]]
            document = _financial_document(db, tenant, branch, mapped["job_cards"][row["job_card_id"]], actor,
                                           "RECEIPT", receipt["receipt_no"], receipt["created_at"],
                                           {"payment": row, "receipt": receipt}, sequences)
            target = _insert(db, """INSERT INTO payments(tenant_id,branch_id,invoice_id,receipt_document_id,amount_paise,
                method,reference,payer,received_at,received_by,created_at)
                VALUES (:tenant,:branch,:invoice,:document,:amount,:method,:reference,'',:received,:actor,:created) RETURNING id""",
                tenant=tenant, branch=branch, invoice=mapped["invoices"][row["invoice_id"]], document=document,
                amount=_paise(row["amount"]), method=row["mode"], reference=row["reference"] or "",
                received=row["created_at"], actor=actor, created=row["created_at"])
            mapped["payments"][row["id"]] = str(target)
            mapped["receipts"][receipt["id"]] = str(document)
        source_jobs = {row["id"]: row for row in rows["job_cards"]}
        for row in sorted(rows["gate_passes"], key=lambda item: (item["created_at"], item["id"])):
            source_job = source_jobs[row["job_card_id"]]
            job = mapped["job_cards"][row["job_card_id"]]
            document = _financial_document(db, tenant, branch, job, actor, "GATE_PASS", row["gate_pass_no"],
                                           row["created_at"], {"gatePass": row, "job": source_job}, sequences)
            target = _insert(db, """INSERT INTO delivery_acknowledgements(tenant_id,branch_id,job_card_id,invoice_id,
                gate_pass_document_id,delivered_by,final_odometer,acknowledgement,handover_at,actor_id)
                VALUES (:tenant,:branch,:job,:invoice,:document,:delivered,:odometer,:ack,:handover,:actor) RETURNING id""",
                tenant=tenant, branch=branch, job=job, invoice=mapped["invoices"][row["invoice_id"]],
                document=document, delivered=source_job["delivery_by"], odometer=max(0, int(source_job["final_km"] or 0)),
                ack=source_job["acknowledgement"], handover=row["created_at"], actor=actor)
            mapped["gate_passes"][row["id"]] = str(target)
        for (kind, fiscal_year), last_value in sequences.items():
            db.execute(text("""INSERT INTO document_sequences(tenant_id,branch_id,document_type,fiscal_year,next_value)
                VALUES (:tenant,:branch,:kind,:year,:next)"""),
                {"tenant": tenant, "branch": branch, "kind": kind, "year": fiscal_year, "next": last_value + 1})
        for table, source_rows in rows.items():
            for index, row in enumerate(source_rows):
                source_id = str(row.get("id", index))
                target = mapped.get(table, {}).get(row.get("department_id") if table == "service_department_managers" else row.get("id"))
                # Unmapped rows have no operational equivalent. Preserve every
                # source column, including binary values, in the scoped archive.
                # Mapped user rows contain demo passwords and must not be copied.
                payload = ({key: _jsonable(value) for key, value in row.items() if not key.startswith("_import_")}
                           if target is None else {"imported": True})
                db.execute(text("""INSERT INTO demo_import_rows(tenant_id,branch_id,source_table,source_id,target_id,payload)
                    VALUES (:tenant,:branch,:table,:source_id,:target,CAST(:payload AS jsonb))"""),
                    {"tenant": tenant, "branch": branch, "table": table, "source_id": source_id,
                     "target": target,
                     "payload": json.dumps(payload, ensure_ascii=False)})
        mapped_counts = {table: len(values) for table, values in mapped.items()}
        mapped_counts["synthetic_booking_customers_and_vehicles"] = synthetic_booking_contacts
        db.execute(text("""INSERT INTO demo_import_runs(tenant_id,source_sha256,import_version,source_counts,mapped_counts)
            VALUES (:tenant,:digest,:version,CAST(:source AS jsonb),CAST(:mapped AS jsonb))"""),
            {"tenant": tenant, "digest": digest, "version": IMPORT_VERSION, "source": json.dumps(counts), "mapped": json.dumps(mapped_counts)})
        print("Committed canonical counts:", json.dumps(mapped_counts, sort_keys=True))
        print("Archive-only rows:", sum(count for table, count in counts.items() if table not in CANONICAL))


def main() -> None:
    global SOURCE
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=SOURCE, help="SQLite source file (use an anonymized copy for browser exports)")
    parser.add_argument("--apply", action="store_true", help="commit to the demo tenant after validation")
    args = parser.parse_args()
    SOURCE = args.source.resolve()
    if not SOURCE.is_file():
        parser.error(f"Source file does not exist: {SOURCE}")
    rows, errors = inspect_source()
    counts = {table: len(values) for table, values in rows.items()}
    digest = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    print("Bundled source SHA-256:", digest)
    print("Source counts:", json.dumps(counts, sort_keys=True))
    print("Canonical tables:", ", ".join(sorted(CANONICAL)))
    print("Archive-only populated tables:", json.dumps({table: count for table, count in counts.items() if table not in CANONICAL and count}, sort_keys=True))
    print("Relationship errors:", json.dumps(errors))
    line_sums: dict[int, Decimal] = {}
    for line in rows["invoice_items"]:
        line_sums[line["invoice_id"]] = line_sums.get(line["invoice_id"], Decimal(0)) + Decimal(str(line["qty"])) * Decimal(str(line["rate"]))
    discrepancies = [row["id"] for row in rows["invoices"]
                     if abs(Decimal(str(row["subtotal"])) - line_sums.get(row["id"], Decimal(0))) > Decimal("0.01")]
    print("Legacy invoice subtotal/line discrepancies:", len(discrepancies), "invoice IDs:", discrepancies)
    if errors:
        raise SystemExit("Import refused: source relationships are broken")
    if args.apply:
        apply(rows, digest, counts)


if __name__ == "__main__":
    main()
