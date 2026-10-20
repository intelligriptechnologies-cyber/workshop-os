"""Import Leads from one browser SQLite database into the shared PostgreSQL tenant.

Run inside the API container (where WORKSHOPOS_DATABASE_URL is configured):
    python scripts/import_browser_leads.py /tmp/browser.sqlite --tenant-code demo
    python scripts/import_browser_leads.py /tmp/browser.sqlite --tenant-code demo --apply

The first command is a dry run. A source ID is recorded in demo_import_rows in
the same transaction as each Lead, so retrying the import cannot duplicate it.
"""
from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import create_engine, text

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.config import get_settings
from app.database_auth import hash_password

SOURCE_TABLE = "browser_sales_leads"
FIELDS = (
    "id", "display_name", "phone", "company", "company_not_entered", "email",
    "email_not_entered", "address", "service_interest", "notes", "stage",
    "temperature", "follow_up_due", "site_visit_completed", "site_visit_date",
    "created_at", "updated_at",
)


def read_leads(path: Path) -> list[dict]:
    if not path.is_file():
        raise ValueError(f"SQLite source does not exist: {path}")
    with sqlite3.connect(f"file:{path.resolve().as_posix()}?mode=ro", uri=True) as source:
        source.row_factory = sqlite3.Row
        columns = {row[1] for row in source.execute("PRAGMA table_info(sales_leads)")}
        missing = set(FIELDS) - columns
        if missing:
            raise ValueError(f"Source sales_leads is missing columns: {', '.join(sorted(missing))}")
        rows = [dict(row) for row in source.execute("SELECT * FROM sales_leads ORDER BY id")]
    for row in rows:
        if not str(row["display_name"] or "").strip() or not str(row["phone"] or "").strip():
            raise ValueError(f"Lead #{row['id']} has no name or phone")
        if row["stage"] not in {"NEW", "QUALIFIED", "QUOTATION_SENT", "WON", "LOST"}:
            raise ValueError(f"Lead #{row['id']} has an unknown stage")
        if row["temperature"] not in {"HOT", "WARM", "COLD"}:
            raise ValueError(f"Lead #{row['id']} has an unknown temperature")
    return rows


def utc_timestamp(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed.replace(tzinfo=timezone.utc) if parsed.tzinfo is None else parsed


def read_owner(path: Path) -> dict:
    with sqlite3.connect(f"file:{path.resolve().as_posix()}?mode=ro", uri=True) as source:
        source.row_factory = sqlite3.Row
        row = source.execute("SELECT id,name,email,role,password FROM users WHERE role='admin' ORDER BY id LIMIT 1").fetchone()
    if row is None or not row["password"] or not row["email"]:
        raise ValueError("Source SQLite has no usable Owner/Admin login")
    return dict(row)


def import_leads(path: Path, tenant_code: str, source_key: str, apply: bool, verify_source: bool = False) -> None:
    rows = read_leads(path)
    owner = read_owner(path)
    engine = create_engine(str(get_settings().database_url), pool_pre_ping=True)
    try:
        with engine.begin() as db:
            tenant = db.execute(text("SELECT id FROM tenants WHERE code=:code"), {"code": tenant_code}).scalar_one_or_none()
            if tenant is None:
                raise ValueError(f"Tenant code not found: {tenant_code}")
            branch = db.execute(text("SELECT id FROM branches WHERE tenant_id=:tenant AND is_primary"), {"tenant": tenant}).scalar_one()
            owner_target = db.execute(text("""SELECT target_id FROM demo_import_rows
                WHERE tenant_id=:tenant AND source_table='users' AND source_id=:source_id"""),
                {"tenant": tenant, "source_id": str(owner["id"])}).scalar_one_or_none()
            if owner_target is None:
                raise ValueError("The source Owner/Admin has no matching user in the tenant import map")
            admin = db.execute(text("""SELECT u.id, u.display_name, u.email, u.password_hash FROM platform_users u
                JOIN tenant_memberships m ON m.user_id=u.id
                JOIN membership_roles mr ON mr.membership_id=m.id
                JOIN tenant_roles r ON r.id=mr.role_id
                WHERE m.tenant_id=:tenant AND m.status='ACTIVE' AND r.name='Owner/Admin' AND u.id=:owner_target"""),
                {"tenant": tenant, "owner_target": owner_target}).mappings().one()
            actor = admin["id"]
            # Restore the original login only while the bundled demo still has
            # its scrubbed account. Later password/name edits remain authoritative.
            sync_owner = admin["email"] != owner["email"] and admin["email"].startswith("demo.user")
            if admin["email"] != owner["email"] and not sync_owner:
                raise ValueError("Mapped Owner/Admin has an unexpected email; refusing to overwrite it")
            other_account = db.execute(text("SELECT id FROM platform_users WHERE lower(email)=lower(:email) AND id<>:actor"),
                                       {"email": owner["email"], "actor": actor}).scalar_one_or_none()
            if other_account is not None:
                raise ValueError("Source Owner/Admin email belongs to a different PostgreSQL account")
            # Serialize concurrent retries for this tenant/source combination.
            db.execute(text("SELECT pg_advisory_xact_lock(hashtextextended(:key, 0))"),
                       {"key": f"{tenant}:{SOURCE_TABLE}:{source_key}"})
            existing = dict(db.execute(text("""SELECT source_id, target_id FROM demo_import_rows
                WHERE tenant_id=:tenant AND source_table=:table AND source_id LIKE :prefix"""),
                {"tenant": tenant, "table": SOURCE_TABLE, "prefix": f"{source_key}:%"}).all())
            pending = [row for row in rows if f"{source_key}:{row['id']}" not in existing]
            print(json.dumps({"tenantCode": tenant_code, "source": str(path), "sourceLeads": len(rows),
                              "alreadyImported": len(rows) - len(pending), "toImport": len(pending),
                              "syncOwnerLogin": sync_owner, "apply": apply}, sort_keys=True))
            if not apply:
                return
            if sync_owner:
                db.execute(text("""UPDATE platform_users SET display_name=:name,email=:email,password_hash=:password
                    WHERE id=:actor"""), {"actor": actor, "name": owner["name"], "email": owner["email"],
                                          "password": hash_password(owner["password"])})
            for row in pending:
                created = utc_timestamp(row["created_at"])
                updated = utc_timestamp(row["updated_at"])
                target = db.execute(text("""INSERT INTO sales_leads(
                    tenant_id,branch_id,display_name,phone,company,company_not_entered,
                    email,email_not_entered,address,service_interest,notes,stage,temperature,
                    follow_up_due,site_visit_completed,site_visit_date,created_by,updated_by,
                    created_at,updated_at) VALUES (
                    :tenant,:branch,:name,:phone,:company,:company_missing,
                    :email,:email_missing,:address,:interest,:notes,:stage,:temperature,
                    :due,:visited,:visit_date,:actor,:actor,:created,:updated) RETURNING id"""), {
                    "tenant": tenant, "branch": branch, "name": row["display_name"], "phone": row["phone"],
                    "company": row["company"] or "", "company_missing": bool(row["company_not_entered"]),
                    "email": row["email"] or "", "email_missing": bool(row["email_not_entered"]),
                    "address": row["address"] or "", "interest": row["service_interest"] or "",
                    "notes": row["notes"] or "", "stage": row["stage"], "temperature": row["temperature"],
                    "due": row["follow_up_due"], "visited": bool(row["site_visit_completed"]),
                    "visit_date": row["site_visit_date"], "actor": actor, "created": created, "updated": updated,
                }).scalar_one()
                db.execute(text("""INSERT INTO demo_import_rows(
                    tenant_id,branch_id,source_table,source_id,target_id,payload)
                    VALUES (:tenant,:branch,:table,:source_id,:target,CAST(:payload AS jsonb))"""), {
                    "tenant": tenant, "branch": branch, "table": SOURCE_TABLE,
                    "source_id": f"{source_key}:{row['id']}", "target": str(target),
                    "payload": json.dumps({"imported": True}),
                })
            for row in rows:
                mapping = db.execute(text("""SELECT target_id FROM demo_import_rows
                    WHERE tenant_id=:tenant AND source_table=:table AND source_id=:source_id"""), {
                    "tenant": tenant, "table": SOURCE_TABLE, "source_id": f"{source_key}:{row['id']}",
                }).scalar_one()
                found = db.execute(text("SELECT * FROM sales_leads WHERE tenant_id=:tenant AND id=:id"),
                                   {"tenant": tenant, "id": int(mapping)}).mappings().one_or_none()
                if found is None:
                    raise RuntimeError(f"Imported lead #{row['id']} is missing from PostgreSQL")
                # A later server edit is valid, so compare full source fields only
                # on the first import unless explicitly requested by an operator.
                if row in pending or verify_source:
                    fields = ("display_name", "phone", "company", "email", "address", "service_interest",
                              "notes", "stage", "temperature")
                    for field in fields:
                        if found[field] != (row[field] or ""):
                            raise RuntimeError(f"Imported lead #{row['id']} differs at {field}")
                    for field in ("company_not_entered", "email_not_entered", "site_visit_completed"):
                        if found[field] != bool(row[field]):
                            raise RuntimeError(f"Imported lead #{row['id']} differs at {field}")
                    for field in ("follow_up_due", "site_visit_date"):
                        actual = str(found[field]) if found[field] is not None else None
                        if actual != row[field]:
                            raise RuntimeError(f"Imported lead #{row['id']} differs at {field}")
                    for field in ("created_at", "updated_at"):
                        if found[field] != utc_timestamp(row[field]):
                            raise RuntimeError(f"Imported lead #{row['id']} differs at {field}")
            print(f"Verified {len(rows)} mapped Leads in PostgreSQL; imported {len(pending)} new Leads.")
    finally:
        engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sqlite", type=Path)
    parser.add_argument("--tenant-code", required=True)
    parser.add_argument("--source-key", default="localhost-5173")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--verify-source", action="store_true")
    args = parser.parse_args()
    import_leads(args.sqlite, args.tenant_code, args.source_key, args.apply, args.verify_source)
