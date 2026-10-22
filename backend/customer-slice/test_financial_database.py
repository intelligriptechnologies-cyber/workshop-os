"""Independent PostgreSQL boundary checks, isolated test DB only."""
import os,json
assert os.environ.get('SLICE_STAGE')=='test'
from api import app,engine,context
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError
from pathlib import Path
checks=[]
def scoped(c):
    context(c)
    actor=c.scalar(text("SELECT platform_user_id FROM workshop_user_profiles WHERE role='admin' AND platform_user_id IS NOT NULL LIMIT 1"))
    c.execute(text("SELECT set_config('workshopos.actor_id',:a,true)"),{'a':str(actor)})
    c.execute(text('SET LOCAL ROLE workshopos_runtime'))
    return actor
def denied(name,sql):
    try:
        with engine.begin() as c:
            scoped(c)
            with c.begin_nested() as rollback:
                c.execute(text(sql))
                rollback.rollback()
        raise AssertionError(name)
    except DBAPIError:checks.append(name)
for table,field,value in [('invoices','total','1'),('invoice_lines','rate','1'),('payments','amount','1'),('legacy_receipts','receipt_no',"'BAD'"),('legacy_gate_passes','gate_pass_no',"'BAD'")]:
    denied('database protects imported '+table,f'UPDATE {table} SET {field}={value} WHERE id=1')
denied('financial deletes prohibited','DELETE FROM invoices WHERE slice_finance')
denied('invoice provenance immutable',"UPDATE invoices SET invoice_no='BAD' WHERE slice_finance")
denied('invoice events immutable',"UPDATE legacy_invoice_events SET note='BAD' WHERE id=(SELECT max(id) FROM legacy_invoice_events)")
denied('database rejects partial posting',"""INSERT INTO payments(tenant_id,branch_id,invoice_id,job_card_id,slice_finance,amount,amount_paise,method,mode,received_by,received_at)
 SELECT tenant_id,branch_id,id,job_card_id,true,1,100,'CASH','Cash',created_by,now() FROM invoices
 WHERE slice_finance AND voided_at IS NULL AND status='Pending' AND total>1 LIMIT 1""")
denied('database rejects duplicate settled posting',"""INSERT INTO payments(tenant_id,branch_id,invoice_id,job_card_id,slice_finance,amount,amount_paise,method,mode,received_by,received_at)
 SELECT tenant_id,branch_id,id,job_card_id,true,total,total_paise,'CASH','Cash',created_by,now() FROM invoices
 WHERE slice_finance AND status='Cleared' LIMIT 1""")
with engine.begin() as c:
    scoped(c)
    c.execute(text("SELECT set_config('workshopos.branch_ids','{}',true)"))
    assert c.scalar(text('SELECT count(*) FROM invoices'))==0
    assert c.scalar(text('SELECT count(*) FROM payments'))==0
    assert c.scalar(text('SELECT count(*) FROM document_snapshots'))==0
    checks.append('branch RLS hides invoices payments and snapshots')
Path('/slice/artifacts/financial-database-tests.json').write_text(json.dumps(dict(passed=len(checks),checks=checks),indent=2));print(len(checks),'financial database checks passed')
