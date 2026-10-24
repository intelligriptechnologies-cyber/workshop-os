"""Additional negative tenant/branch checks against the disposable CI clone."""
from sqlalchemy import text
from api import engine, context

with engine.begin() as connection:
    role = connection.execute(text('SELECT current_user,rolsuper,rolbypassrls FROM pg_roles WHERE rolname=current_user')).one()
    assert tuple(role) == ('slice_auth', False, False)
    context(connection)
    connection.execute(text('SET LOCAL ROLE workshopos_runtime'))
    assert connection.scalar(text('SELECT count(*) FROM customers')) >= 121
    connection.execute(text("SELECT set_config('workshopos.tenant_id','00000000-0000-4000-8000-000000000001',true)"))
    for table in ('customers', 'vehicles', 'job_cards', 'invoices', 'payments', 'document_snapshots'):
        assert connection.scalar(text('SELECT count(*) FROM ' + table)) == 0, table
print('Restricted runtime identity and cross-tenant RLS checks passed')
