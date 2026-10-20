"""Reconcile only verified demo import identities; dry run unless --apply.

The source must be the immutable a315448 bundled SQLite file. This does not
modify demo_import_runs or bypass the whole-demo importer's checksum guard.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
import sys
from pathlib import Path

from sqlalchemy import create_engine, text

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.config import get_settings
from app.database_auth import hash_password, verify_password


def reconcile(source: Path, expected_sha256: str, apply: bool = False):
    settings = get_settings()
    if settings.environment != "local":
        raise ValueError("This repair is restricted to the local demo tenant")
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    if digest != expected_sha256:
        raise ValueError("Reference source checksum mismatch")
    with sqlite3.connect(f"file:{source.resolve().as_posix()}?mode=ro", uri=True) as local:
        local.row_factory = sqlite3.Row
        users = [dict(row) for row in local.execute("SELECT * FROM users ORDER BY id")]
        managers = [dict(row) for row in local.execute("SELECT * FROM service_department_managers")]
        advisors = [dict(row) for row in local.execute("SELECT * FROM service_advisor_teams")]
    if len(users) != 10 or len({row["email"] for row in users}) != 10 or any(row["archived_at"] for row in users):
        raise ValueError("Expected exactly ten active, distinct reference users")
    report = {"sourceSha256": digest, "applied": apply, "accounts": [], "changed": 0}
    with create_engine(str(settings.database_url)).begin() as db:
        tenant = db.execute(text("SELECT id FROM tenants WHERE code='demo' FOR UPDATE")).scalar_one()
        imported_checksum = db.execute(text("SELECT source_sha256 FROM demo_import_runs WHERE tenant_id=:tenant"), {"tenant": tenant}).scalar_one()
        if imported_checksum != digest:
            raise ValueError("Import provenance does not establish reference identity mappings")
        imported = db.execute(text("""
            SELECT r.source_id,u.id,u.email,u.display_name,u.password_hash,u.status,
                   m.id AS membership_id,m.status AS membership_status,
                   array_agg(role.system_key ORDER BY role.system_key) AS roles
            FROM demo_import_rows r JOIN platform_users u ON u.id::text=r.target_id
            JOIN tenant_memberships m ON m.user_id=u.id AND m.tenant_id=r.tenant_id
            JOIN membership_roles mr ON mr.membership_id=m.id AND mr.tenant_id=m.tenant_id
            JOIN tenant_roles role ON role.id=mr.role_id AND role.tenant_id=m.tenant_id
            WHERE r.tenant_id=:tenant AND r.source_table='users'
            GROUP BY r.source_id,u.id,m.id
        """), {"tenant": tenant}).mappings().all()
        mapping = {row["source_id"]: row for row in imported}
        if len(mapping) != 10 or len(imported) != 10 or set(mapping) != {str(row["id"]) for row in users}:
            raise ValueError("Ambiguous or incomplete user import mapping")
        departments = dict(db.execute(text("SELECT source_id,target_id FROM demo_import_rows WHERE tenant_id=:tenant AND source_table='service_departments'"), {"tenant": tenant}).all())
        expected_managers = {(departments[str(item["department_id"])], str(mapping[str(item["manager_id"])]["membership_id"])) for item in managers}
        actual_managers = {(str(row[0]), str(row[1])) for row in db.execute(text("SELECT department_id,manager_membership_id FROM service_department_managers WHERE tenant_id=:tenant"), {"tenant": tenant})}
        expected_advisors = {(departments[str(item["department_id"])], str(mapping[str(item["manager_id"])]["membership_id"]), str(mapping[str(item["advisor_id"])]["membership_id"])) for item in advisors}
        actual_advisors = {(str(row[0]), str(row[1]), str(row[2])) for row in db.execute(text("SELECT department_id,manager_membership_id,advisor_membership_id FROM service_advisor_teams WHERE tenant_id=:tenant"), {"tenant": tenant})}
        if expected_managers != actual_managers or expected_advisors != actual_advisors:
            raise ValueError("Department relationships differ from reference; aborting rather than guessing")
        active = db.execute(text("SELECT count(*) FROM tenant_memberships WHERE tenant_id=:tenant AND status='ACTIVE'"), {"tenant": tenant}).scalar_one()
        if active != 10:
            raise ValueError("Unexpected demo memberships require explicit relationship review")
        for reference in users:
            row = mapping[str(reference["id"])]
            if row["email"] not in (reference["email"], f"demo.user{reference['id']}@example.test"):
                raise ValueError(f"Unverified identity correspondence for source {reference['id']}")
            if list(row["roles"]) != [reference["role"]]:
                raise ValueError(f"Role mismatch for source {reference['id']}")
            if row["status"] != "ACTIVE" or row["membership_status"] != "ACTIVE":
                raise ValueError("Archived accounts require explicit review")
            shared = db.execute(text("SELECT count(*) FROM tenant_memberships WHERE user_id=:user AND tenant_id<>:tenant"), {"user": row["id"], "tenant": tenant}).scalar_one()
            duplicate = db.execute(text("SELECT count(*) FROM platform_users WHERE lower(email)=:email AND id<>:user"), {"email": reference["email"].lower(), "user": row["id"]}).scalar_one()
            if shared or duplicate:
                raise ValueError(f"Shared or ambiguous account for source {reference['id']}")
            changed = row["email"] != reference["email"] or row["display_name"] != reference["name"] or not verify_password(reference["password"], row["password_hash"])
            report["accounts"].append({
                "sourceId": reference["id"], "userId": str(row["id"]), "membershipId": str(row["membership_id"]),
                "oldEmail": row["email"], "email": reference["email"], "role": reference["role"], "changed": changed,
            })
            if changed:
                report["changed"] += 1
                if apply:
                    db.execute(text("""UPDATE platform_users SET email=:email,display_name=:name,password_hash=:password
                        WHERE id=:user"""), {"email": reference["email"], "name": reference["name"],
                                           "password": hash_password(reference["password"]), "user": row["id"]})
                    db.execute(text("DELETE FROM database_sessions WHERE tenant_id=:tenant AND user_id=:user"), {"tenant": tenant, "user": row["id"]})
        # IDs are retained, so all existing operational and department references remain intact.
        report["relationships"] = [dict(row) for row in db.execute(text("""
            SELECT d.name,dm.manager_membership_id::text AS manager,
                   team.advisor_membership_id::text AS advisor
            FROM service_departments d
            LEFT JOIN service_department_managers dm ON dm.department_id=d.id AND dm.tenant_id=d.tenant_id
            LEFT JOIN service_advisor_teams team ON team.department_id=d.id AND team.manager_membership_id=dm.manager_membership_id AND team.tenant_id=d.tenant_id
            WHERE d.tenant_id=:tenant ORDER BY d.name,manager,advisor
        """), {"tenant": tenant}).mappings()]
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--reference-sha256", required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    print(json.dumps(reconcile(args.source, args.reference_sha256, args.apply), indent=2))
