"""Make a privacy-safe import copy of an exported WorkshopOS browser SQLite file.

The source is opened read-only and is never modified. The output keeps core
relationships, workflow states, stock quantities, and synthetic estimates.
Tables outside that scope are emptied before VACUUM removes deleted bytes.

Run: python scripts/prepare_browser_demo.py SOURCE.sqlite OUTPUT.sqlite
"""

from __future__ import annotations

import argparse
from collections import Counter
import hashlib
import json
import secrets
import sqlite3
from pathlib import Path


KEEP = frozenset({
    "users", "customers", "vehicles", "bookings", "visits", "job_cards",
    "tasks", "qc_checks", "status_history", "inventory", "estimates", "estimate_items",
})


def _hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def prepare(source: Path, output: Path) -> dict[str, object]:
    source, output = source.resolve(), output.resolve()
    if source == output:
        raise ValueError("Source and output paths must differ")
    if output.exists():
        raise FileExistsError(f"Refusing to replace existing output: {output}")
    if not source.is_file():
        raise FileNotFoundError(source)

    original = sqlite3.connect(f"file:{source}?mode=ro", uri=True)
    original.row_factory = sqlite3.Row
    if original.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
        raise ValueError("Source SQLite integrity check failed")
    tables = [row[0] for row in original.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    )]
    missing = KEEP.difference(tables)
    if missing:
        raise ValueError(f"Source is missing required tables: {sorted(missing)}")
    source_counts = {table: original.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0] for table in tables}
    sensitive: dict[str, set[str]] = {}
    for table, columns in {
        "users": ("email",),
        "customers": ("name", "mobile", "address"),
        "vehicles": ("number", "engine_no"),
        "bookings": ("customer_name", "mobile", "vehicle_no"),
        "suppliers": ("email", "phone", "gstin"),
        "sales_leads": ("email", "phone"),
    }.items():
        for column in columns:
            for row in original.execute(
                f'SELECT DISTINCT "{column}" FROM "{table}" WHERE "{column}" IS NOT NULL'
            ):
                if row[0] and len(str(row[0])) >= 6:
                    sensitive.setdefault(str(row[0]), set()).add(f"{table}.{column}")

    output.parent.mkdir(parents=True, exist_ok=True)
    sanitized = sqlite3.connect(output)
    normalized_booking_links: dict[str, dict[str, int]] = {}
    try:
        original.backup(sanitized)
        original.close()
        sanitized.execute("PRAGMA foreign_keys=OFF")
        with sanitized:
            for table in tables:
                if table not in KEEP:
                    sanitized.execute(f'DELETE FROM "{table}"')

            for row in sanitized.execute("SELECT id FROM users").fetchall():
                user_id = row[0]
                sanitized.execute(
                    "UPDATE users SET email=?, name=?, password=?, archived_reason=CASE WHEN archived_reason IS NULL THEN NULL ELSE 'Imported demo archive' END WHERE id=?",
                    (f"demo.user{user_id}@example.test", f"Demo User {user_id}", secrets.token_urlsafe(24), user_id),
                )
            for row in sanitized.execute("SELECT id FROM customers").fetchall():
                customer_id = row[0]
                sanitized.execute(
                    "UPDATE customers SET name=?, mobile=?, address='', archived_reason=CASE WHEN archived_reason IS NULL THEN NULL ELSE 'Imported demo archive' END WHERE id=?",
                    (f"Sample Contact {customer_id:04d}", str(7000000000 + customer_id), customer_id),
                )
            for row in sanitized.execute("SELECT id FROM vehicles").fetchall():
                vehicle_id = row[0]
                sanitized.execute(
                    "UPDATE vehicles SET number=?, engine_no=?, archived_reason=CASE WHEN archived_reason IS NULL THEN NULL ELSE 'Imported demo archive' END WHERE id=?",
                    (f"KA00DM{vehicle_id:04d}", f"DEMOENGINE{vehicle_id:04d}", vehicle_id),
                )
            unlinked = sanitized.execute("""SELECT id, customer_id, vehicle_id, customer_type,
                make, model, color, created_at, updated_at FROM bookings
                WHERE customer_id IS NULL OR vehicle_id IS NULL ORDER BY id""").fetchall()
            for booking_id, customer_id, vehicle_id, customer_type, make, model, color, created_at, updated_at in unlinked:
                if customer_id is None:
                    customer_id = sanitized.execute("""INSERT INTO customers(name,mobile,type,address,created_at,updated_at)
                        VALUES ('Pending demo customer','',?,'',?,?) RETURNING id""",
                        (customer_type or "Individual", created_at, updated_at)).fetchone()[0]
                    sanitized.execute("UPDATE customers SET name=?, mobile=? WHERE id=?",
                                      (f"Sample Contact {customer_id:04d}", str(7000000000 + customer_id), customer_id))
                if vehicle_id is None:
                    vehicle_id = sanitized.execute("""INSERT INTO vehicles(customer_id,number,make,model,color,km,engine_no,created_at,updated_at)
                        VALUES (?,'',?,?,?,0,'',?,?) RETURNING id""",
                        (customer_id, make or "Demo", model or "Vehicle", color or "", created_at, updated_at)).fetchone()[0]
                    sanitized.execute("UPDATE vehicles SET number=?, engine_no=? WHERE id=?",
                                      (f"KA00DM{vehicle_id:04d}", f"DEMOENGINE{vehicle_id:04d}", vehicle_id))
                sanitized.execute("UPDATE bookings SET customer_id=?, vehicle_id=? WHERE id=?",
                                  (customer_id, vehicle_id, booking_id))
                normalized_booking_links[str(booking_id)] = {"customerId": customer_id, "vehicleId": vehicle_id}
            sanitized.execute("""UPDATE bookings SET
                customer_name=(SELECT name FROM customers WHERE id=bookings.customer_id),
                mobile=(SELECT mobile FROM customers WHERE id=bookings.customer_id),
                vehicle_no=(SELECT number FROM vehicles WHERE id=bookings.vehicle_id),
                requested_work='Demo service request',
                reschedule_reason=CASE WHEN reschedule_reason IS NULL THEN NULL ELSE 'Demo reschedule' END,
                cancellation_reason=CASE WHEN cancellation_reason IS NULL THEN NULL ELSE 'Demo cancellation' END,
                no_show_reason=CASE WHEN no_show_reason IS NULL THEN NULL ELSE 'Demo no-show' END""")
            sanitized.execute("""UPDATE visits SET requested_work='Demo service visit', photos_note='',
                keys='Demo keys', accessories='', archived_reason=CASE WHEN archived_reason IS NULL THEN NULL ELSE 'Imported demo archive' END""")
            sanitized.execute("""UPDATE job_cards SET work_list='Demo service work', advisor_notes='',
                customer_instructions='', internal_instructions='', acknowledgement='', damage_marks='[]',
                delivery_by=CASE WHEN trim(coalesce(delivery_by, ''))='' THEN delivery_by ELSE 'Demo Staff' END,
                archived_reason=CASE WHEN archived_reason IS NULL THEN NULL ELSE 'Imported demo archive' END""")
            sanitized.execute("""UPDATE tasks SET title='Demo task ' || id, notes='',
                archived_reason=CASE WHEN archived_reason IS NULL THEN NULL ELSE 'Imported demo archive' END""")
            sanitized.execute("""UPDATE qc_checks SET label='QC check ' || id,
                fail_reason=CASE WHEN fail_reason IS NULL THEN NULL ELSE 'Demo QC finding' END""")
            sanitized.execute("UPDATE status_history SET note='Imported demo status event'")
            sanitized.execute("""UPDATE inventory SET sku=printf('DEMO-%04d', id), name='Demo Part ' || id,
                category='Demo parts', selling_price=100 + id,
                archived_reason=CASE WHEN archived_reason IS NULL THEN NULL ELSE 'Imported demo archive' END""")
            sanitized.execute("""UPDATE estimates SET discount=0, gst_rate=18,
                approval_note='Synthetic demo estimate',
                archived_reason=CASE WHEN archived_reason IS NULL THEN NULL ELSE 'Imported demo archive' END""")
            sanitized.execute("""UPDATE estimate_items SET description='Synthetic service line ' || id,
                qty=1, rate=100 + id, gst_rate=18, task_list_item_id=NULL,
                archived_reason=CASE WHEN archived_reason IS NULL THEN NULL ELSE 'Imported demo archive' END""")

        sanitized.execute("VACUUM")
        if sanitized.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
            raise ValueError("Anonymized SQLite integrity check failed")
        target_counts = {table: sanitized.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0] for table in tables}
        added_customers = sum(1 for booking in normalized_booking_links.values() if booking["customerId"])
        added_vehicles = sum(1 for booking in normalized_booking_links.values() if booking["vehicleId"])
        expected_additions = {"customers": added_customers, "vehicles": added_vehicles}
        for table in KEEP:
            if target_counts[table] != source_counts[table] + expected_additions.get(table, 0):
                raise ValueError(f"Count changed unexpectedly: {table}")
        for table in tables:
            if table not in KEEP and target_counts[table]:
                raise ValueError(f"Excluded table still has rows: {table}")
    except BaseException:
        sanitized.close()
        output.unlink(missing_ok=True)
        raise
    finally:
        sanitized.close()
        original.close()

    output_bytes = output.read_bytes()
    remaining = [value for value in sensitive if value.encode("utf-8") in output_bytes]
    if remaining:
        output.unlink(missing_ok=True)
        origins = Counter(origin for value in remaining for origin in sensitive[value])
        raise ValueError(f"{len(remaining)} source identifiers remain in anonymized file: {dict(origins)}")
    report = {
        "sourceSha256": _hash(source), "anonymizedSha256": _hash(output),
        "sourceCounts": source_counts, "anonymizedCounts": target_counts,
        "normalizedBookingLinks": normalized_booking_links,
        "excludedTables": sorted(set(tables).difference(KEEP)),
    }
    output.with_suffix(".reconciliation.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()
    result = prepare(arguments.source, arguments.output)
    print(json.dumps({key: value for key, value in result.items() if key not in ("sourceCounts", "anonymizedCounts")}, indent=2))
    print("Core counts:", json.dumps({table: result["anonymizedCounts"][table] for table in sorted(KEEP)}))
