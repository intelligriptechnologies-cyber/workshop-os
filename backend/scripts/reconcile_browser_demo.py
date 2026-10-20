"""Verify a browser-demo import against its anonymized SQLite source.

Run from backend/: python scripts/reconcile_browser_demo.py ANONYMIZED.sqlite REPORT.json
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
from scripts.import_bundled_demo import _jsonable


TARGET_TABLES = {
    "customers": "customers", "vehicles": "vehicles", "bookings": "bookings",
    "visits": "visits", "job_cards": "job_cards", "tasks": "technician_tasks",
    "qc_checks": "qc_checks", "status_history": "job_events",
    "inventory": "catalogue_items", "estimates": "estimates",
    "estimate_items": "estimate_lines",
}


def reconcile(source: Path) -> dict[str, object]:
    source = source.resolve()
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    local = sqlite3.connect(f"file:{source}?mode=ro", uri=True)
    local.row_factory = sqlite3.Row
    source_tables = [row[0] for row in local.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")]
    source_counts = {table: local.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0]
                     for table in source_tables}
    errors: list[str] = []
    results: dict[str, int] = {}
    archive_only: dict[str, int] = {}
    with create_engine(str(get_settings().database_url)).begin() as connection:
        tenant_id = connection.execute(text("SELECT id FROM tenants WHERE lower(code)='demo'")).scalar_one()
        run = connection.execute(text("""SELECT source_sha256,import_version,source_counts,mapped_counts
            FROM demo_import_runs WHERE tenant_id=:tenant"""), {"tenant": tenant_id}).mappings().one()
        if run["source_sha256"] != source_hash:
            errors.append("The committed import checksum differs from the anonymized SQLite file")
        if dict(run["source_counts"]) != source_counts:
            errors.append("The committed source table counts differ from the SQLite file")
        for source_table in source_tables:
            mappings = connection.execute(text("""SELECT source_id,target_id,payload FROM demo_import_rows
                WHERE tenant_id=:tenant AND source_table=:table"""),
                {"tenant": tenant_id, "table": source_table}).mappings().all()
            indexed = {row["source_id"]: row for row in mappings}
            if len(mappings) != source_counts[source_table] or len(indexed) != len(mappings):
                errors.append(f"Source row count or IDs differ for {source_table}")
            archive_only[source_table] = 0
            for index, raw in enumerate(local.execute(f'SELECT * FROM "{source_table}"')):
                source_row = dict(raw)
                source_id = str(source_row.get("id", index))
                mapped = indexed.get(source_id)
                if mapped is None:
                    errors.append(f"Missing source row {source_table} #{source_id}")
                elif mapped["target_id"] is None:
                    archive_only[source_table] += 1
                    expected = {key: _jsonable(value) for key, value in source_row.items()}
                    if mapped["payload"] != expected:
                        errors.append(f"Archived values differ for {source_table} #{source_id}")
            results[source_table] = len(mappings) - archive_only[source_table]
        for source_table, target_table in TARGET_TABLES.items():
            count = connection.execute(text("""SELECT COUNT(*) FROM demo_import_rows
                WHERE tenant_id=:tenant AND source_table=:table AND target_id IS NOT NULL"""),
                {"tenant": tenant_id, "table": source_table}).scalar_one()
            results[source_table] = count
            if count != source_counts[source_table]:
                errors.append(f"Mapped count differs for {source_table}: {count} != {source_counts[source_table]}")
            present = connection.execute(text(f"""SELECT COUNT(*) FROM demo_import_rows AS m
                JOIN {target_table} AS target ON target.id::text=m.target_id AND target.tenant_id=:tenant
                WHERE m.tenant_id=:tenant AND m.source_table=:table"""),
                {"tenant": tenant_id, "table": source_table}).scalar_one()
            if present != count:
                errors.append(f"Target references are missing or outside the demo tenant: {source_table}")

        users = connection.execute(text("""SELECT COUNT(*) FROM demo_import_rows AS m
            JOIN platform_users AS u ON u.id::text=m.target_id
            JOIN tenant_memberships AS membership ON membership.user_id=u.id AND membership.tenant_id=:tenant
            WHERE m.tenant_id=:tenant AND m.source_table='users'"""), {"tenant": tenant_id}).scalar_one()
        results["users"] = users
        if users != source_counts["users"]:
            errors.append("User membership mapping count differs")

        relationships = {
            "vehicles.customer": "SELECT COUNT(*) FROM vehicles v LEFT JOIN customers c ON c.id=v.customer_id AND c.tenant_id=v.tenant_id WHERE v.tenant_id=:tenant AND c.id IS NULL",
            "visits.customer": "SELECT COUNT(*) FROM visits v LEFT JOIN customers c ON c.id=v.customer_id AND c.tenant_id=v.tenant_id WHERE v.tenant_id=:tenant AND c.id IS NULL",
            "visits.vehicle": "SELECT COUNT(*) FROM visits v LEFT JOIN vehicles vehicle ON vehicle.id=v.vehicle_id AND vehicle.tenant_id=v.tenant_id WHERE v.tenant_id=:tenant AND vehicle.id IS NULL",
            "jobs.visit": "SELECT COUNT(*) FROM job_cards j LEFT JOIN visits v ON v.id=j.visit_id AND v.tenant_id=j.tenant_id WHERE j.tenant_id=:tenant AND v.id IS NULL",
            "bookings.customer": "SELECT COUNT(*) FROM bookings b LEFT JOIN customers c ON c.id=b.customer_id AND c.tenant_id=b.tenant_id WHERE b.tenant_id=:tenant AND c.id IS NULL",
            "bookings.vehicle": "SELECT COUNT(*) FROM bookings b LEFT JOIN vehicles v ON v.id=b.vehicle_id AND v.tenant_id=b.tenant_id WHERE b.tenant_id=:tenant AND v.id IS NULL",
            "tasks.job": "SELECT COUNT(*) FROM technician_tasks t LEFT JOIN job_cards j ON j.id=t.job_card_id AND j.tenant_id=t.tenant_id WHERE t.tenant_id=:tenant AND j.id IS NULL",
            "events.job": "SELECT COUNT(*) FROM job_events e LEFT JOIN job_cards j ON j.id=e.job_card_id AND j.tenant_id=e.tenant_id WHERE e.tenant_id=:tenant AND j.id IS NULL",
        }
        orphan_counts = {name: connection.execute(text(query), {"tenant": tenant_id}).scalar_one()
                         for name, query in relationships.items()}
        errors.extend(f"Orphaned {name}: {count}" for name, count in orphan_counts.items() if count)

        stock: dict[str, dict[str, float]] = {}
        for row in local.execute("SELECT id,stock_qty FROM inventory"):
            target_id = connection.execute(text("""SELECT target_id FROM demo_import_rows
                WHERE tenant_id=:tenant AND source_table='inventory' AND source_id=:source"""),
                {"tenant": tenant_id, "source": str(row["id"])}).scalar_one()
            balance = connection.execute(text("""SELECT COALESCE(SUM(quantity),0) FROM stock_ledger
                WHERE tenant_id=:tenant AND item_id=:item"""), {"tenant": tenant_id, "item": int(target_id)}).scalar_one()
            stock[str(row["id"])] = {"source": float(row["stock_qty"]), "target": float(balance)}
            if abs(float(row["stock_qty"]) - float(balance)) > 0.0001:
                errors.append(f"Stock balance differs for source inventory #{row['id']}")

        representative = {}
        for source_table, target_table, field in (
            ("customers", "customers", "name"),
            ("vehicles", "vehicles", "number"),
            ("bookings", "bookings", "status"),
            ("job_cards", "job_cards", "job_no"),
        ):
            row = local.execute(f'SELECT id,{"main_status" if source_table == "job_cards" and field == "status" else field} FROM "{source_table}" ORDER BY id LIMIT 1').fetchone()
            if row is None:
                continue
            target_id = connection.execute(text("""SELECT target_id FROM demo_import_rows
                WHERE tenant_id=:tenant AND source_table=:table AND source_id=:source"""),
                {"tenant": tenant_id, "table": source_table, "source": str(row["id"])}).scalar_one()
            target_value = connection.execute(text(f"SELECT {field} FROM {target_table} WHERE id=:id AND tenant_id=:tenant"),
                                              {"id": int(target_id), "tenant": tenant_id}).scalar_one()
            expected = row[field]
            if source_table == "bookings":
                expected = str(expected).upper().replace("-", "_")
            if target_value != expected:
                errors.append(f"Representative {source_table} #{row['id']} differs")
            representative[source_table] = {"sourceId": row["id"], "targetId": target_id, "matched": target_value == expected}

    local.close()
    return {
        "sourceSha256": source_hash, "tenantId": str(tenant_id),
        "importVersion": run["import_version"], "sourceCounts": source_counts,
        "mappedCounts": results, "archiveOnlyCounts": archive_only, "orphanCounts": orphan_counts,
        "stockBalances": stock, "representativeRecords": representative,
        "errors": errors, "passed": not errors,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("report", type=Path)
    arguments = parser.parse_args()
    result = reconcile(arguments.source)
    arguments.report.parent.mkdir(parents=True, exist_ok=True)
    arguments.report.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print("Reconciliation passed:", result["passed"])
    print("Mapped counts:", json.dumps(result["mappedCounts"], sort_keys=True))
    print("Errors:", json.dumps(result["errors"]))
    if result["errors"]:
        raise SystemExit(1)
