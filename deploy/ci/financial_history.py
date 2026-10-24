"""Read-only full-row fingerprints and custody reconciliation for imported finance."""
TABLES = ('invoices', 'invoice_lines', 'payments', 'legacy_receipts',
          'legacy_gate_passes', 'legacy_invoice_events', 'quotations', 'quotation_lines')
QUERY = '\nUNION ALL\n'.join(
    f"""SELECT '{table}', count(*), count(t.id),
    count(*) FILTER (WHERE t.id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM jsonb_each(r.target_snapshot) e
        WHERE to_jsonb(t)->e.key IS DISTINCT FROM e.value)),
    md5(coalesce(string_agg(to_jsonb(t)::text,'' ORDER BY t.id),''))
    FROM import_custody.records r LEFT JOIN {table} t
      ON t.id=(r.target_key->>'id')::bigint
    WHERE r.target_table='{table}' AND r.disposition='BUSINESS'"""
    for table in TABLES
) + ';'


def validate(output):
    rows = [line.split('|') for line in output.strip().splitlines()]
    assert len(rows) == len(TABLES), 'Missing historical financial table'
    assert {row[0] for row in rows} == set(TABLES)
    assert sum(int(row[1]) for row in rows) == 242, 'Historical custody count changed'
    assert all(row[1] == row[2] == row[3] for row in rows), 'Historical financial data missing or changed'
    return output.strip()


if __name__ == '__main__':
    print('BEGIN READ ONLY;\n' + QUERY + '\nCOMMIT;')
