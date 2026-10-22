"""Explicit historical exceptions. Never infer a human, instant, or tax allocation."""
AUDIT_TABLES = '''customers vehicles visits job_cards estimates catalogue_items
followups job_service_tasks invoices payments job_media purchase_orders suppliers
qc_checks technician_tasks sales_leads quotations service_task_catalog'''.split()
NULLABLE = {t: ['created_by', 'updated_by', 'created_at', 'updated_at'] for t in AUDIT_TABLES}
EXTRA = {
    'customers': ['address'], 'vehicles': ['engine_no'],
    'visits': ['received_by', 'received_at', 'odo_reading', 'fuel_level_value', 'fuel_level_unit'],
    'estimates': ['revision'],
    'invoices': ['issued_document_id'],
    'invoice_lines': ['taxable_paise', 'tax_paise', 'total_paise'],
    'payments': ['receipt_document_id', 'received_by', 'received_at'],
    'technician_tasks': ['assigned_to'],
    'purchase_order_delivery_receipts': ['received_by', 'received_at', 'request_key'],
    'purchase_order_delivery_confirmations': ['confirmed_by', 'confirmed_at', 'request_key', 'rejected_qty'],
}
for table, fields in EXTRA.items():
    NULLABLE.setdefault(table, []).extend(fields)

# Source user IDs resolve to preserved profiles, not fabricated login accounts.
ACTORS = {
    'visits': ['advisor_id', 'received_by'], 'job_cards': ['advisor_id'],
    'technician_tasks': ['assigned_to'], 'job_checklist_items': ['checked_by', 'na_by'],
    'purchase_orders': ['created_by'], 'suppliers': ['created_by'],
    'purchase_order_delivery_receipts': ['received_by'],
    'purchase_order_delivery_confirmations': ['confirmed_by'],
}
RAW_TIMES = {
    'job_cards': ['promised_at'], 'customers': ['created_at', 'updated_at'],
    'vehicles': ['created_at', 'updated_at'], 'visits': ['created_at', 'updated_at'],
    'job_media': ['created_at', 'updated_at'],
    'purchase_orders': ['created_at', 'updated_at'],
    'suppliers': ['created_at', 'updated_at'],
    'purchase_order_delivery_receipts': ['received_at'],
    'purchase_order_delivery_confirmations': ['confirmed_at'],
    'catalogue_items': ['created_at', 'updated_at'],
    'sales_leads': ['created_at', 'updated_at'], 'quotations': ['created_at', 'updated_at'],
}
SPECIAL = ['estimate_lines', 'purchase_order_lines', 'legacy_material_movements']
for table in AUDIT_TABLES + ['estimate_lines', 'invoice_lines']:
    RAW_TIMES.setdefault(table, [])
    RAW_TIMES[table] = sorted(set(RAW_TIMES[table]) | {'created_at', 'updated_at'})
RAW_TIMES['visits'].append('received_at')
TABLES = sorted(set(NULLABLE) | set(ACTORS) | set(RAW_TIMES) | set(SPECIAL))
