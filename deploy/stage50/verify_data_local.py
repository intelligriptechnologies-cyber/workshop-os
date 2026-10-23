"""Read-only reconciliation of the disposable package database and preserved sources."""
import hashlib
import json
import sqlite3
import subprocess
from pathlib import Path
from verify_restore_local import sql, SOURCE

ROOT=Path(__file__).resolve().parents[2]


def main():
    original=['docker','exec','-i','workshopos-import-unblock-03-rehearsal-db-1','psql','-X','-v','ON_ERROR_STOP=1','-U','stage4c_rehearsal_owner','-d','stage4c_rehearsal','-At']
    statement="SELECT count(*)||':'||md5(string_agg(to_jsonb(r)::text,'' ORDER BY source_table,source_key)) FROM import_custody.records r;"
    expected=subprocess.check_output(original,input=statement.encode()).decode().strip()
    assert sql(SOURCE,statement)==expected
    assert sql(SOURCE,"SELECT count(*) FROM import_custody.records WHERE disposition='QUARANTINE';")=='67'
    financial=['invoices','invoice_lines','payments','legacy_receipts','legacy_gate_passes','legacy_invoice_events','quotations','quotation_lines']
    verified=0
    for table in financial:
        query=f"SELECT count(*),count(*) FILTER(WHERE NOT EXISTS(SELECT 1 FROM jsonb_each(r.target_snapshot) e WHERE to_jsonb(t)->e.key IS DISTINCT FROM e.value)) FROM import_custody.records r JOIN {table} t ON t.id=(r.target_key->>'id')::bigint WHERE r.target_table='{table}' AND r.disposition='BUSINESS';"
        count,exact=map(int,sql(SOURCE,query).split('|'));assert count==exact;verified+=count
    source=ROOT/'public/workshopos-demo.sqlite'
    with sqlite3.connect(source.as_uri()+'?mode=ro&immutable=1',uri=True) as c:
        c.row_factory=sqlite3.Row
        stock={t:[dict(r) for r in c.execute('SELECT * FROM '+t+' ORDER BY id')] for t in ['stock_ledger','stock_inwards']}
        bridge=json.loads(sql(SOURCE,"SELECT json_agg(json_build_object('table',source_table,'values',values)) FROM slice_historical_stock;"))
        for table,rows in stock.items():assert sorted([r['values'] for r in bridge if r['table']==table],key=lambda r:r['id'])==rows
        expected_balances={r['id']:r['stock_qty']-sum(x['qty'] for x in stock['stock_ledger'] if x['item_id']==r['id']) for r in c.execute('SELECT * FROM inventory')}
        actual=json.loads(sql(SOURCE,"SELECT json_object_agg(id,stock_qty-coalesce((SELECT sum((values->>'qty')::numeric) FROM slice_historical_stock WHERE source_table='stock_ledger' AND (values->>'item_id')::bigint=i.id),0)) FROM catalogue_items i;"))
        assert {int(k):v for k,v in actual.items() if int(k) in expected_balances}==expected_balances
    baseline=json.loads((ROOT/'docs/backend-migration/stage4c-rehearsal-preflight.json.md').read_text(encoding='utf-8-sig'))
    protected=[p for p in baseline['files'] if p.endswith('.sqlite') or (p.endswith('.png') and p!='public/car-damage-diagram.png')]
    assert all(hashlib.sha256((ROOT/p).read_bytes()).hexdigest()==baseline['files'][p] for p in protected)
    result={'custody_rows_exact':3241,'quarantine_rows':67,'financial_rows_exact':verified,'historical_stock_rows_exact':7,'stock_balances':expected_balances,'source_sqlite_files_unchanged':sum(p.endswith('.sqlite') for p in protected),'baseline_screenshots_unchanged':sum(p.endswith('.png') for p in protected)}
    (ROOT/'.scratch/stage50/data.json').write_text(json.dumps(result,indent=2),encoding='utf8')
    print(json.dumps(result,indent=2))

if __name__=='__main__':main()
