"""Owner-only initialization of an EMPTY, dedicated Workshop OS staging database.

Never run by API startup. Source is mounted read-only; no reset/downgrade path.
"""
import hashlib
import json
import os
from pathlib import Path
from uuid import UUID, uuid5
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.engine import URL
from app.database_auth import hash_password
from importer import run_import, source_rows, snapshot

TENANT='eb01f21c-09d1-5cb1-aadb-d15649568fd7'


def main():
    if os.environ.get('WORKSHOPOS_INITIALIZE') != 'EMPTY_DEDICATED_STAGE49':
        raise RuntimeError('Explicit empty staging initialization required')
    owner=Path('/run/secrets/owner_password').read_text().strip()
    runtime=Path('/run/secrets/runtime_password').read_text().strip()
    accounts=json.loads(Path('/run/secrets/accounts.json').read_text())
    mapping, rows=source_rows()
    users=rows['users']
    if set(accounts) != {u['email'] for u in users}:
        raise RuntimeError('Supply unique staging credentials for every source user')
    if len(set(accounts.values()))!=len(accounts) or any(len(p)<24 for p in accounts.values()) or any(accounts[u['email']]==u['password'] for u in users):
        raise RuntimeError('New unique staging passwords required; demo passwords forbidden')
    url=URL.create('postgresql+psycopg',username='stage4c_rehearsal_owner',password=owner,host='workshopos-db',port=5432,database='workshopos_staging')
    os.environ['WORKSHOPOS_DATABASE_URL']=url.render_as_string(hide_password=False)
    engine=create_engine(url,hide_parameters=True)
    with engine.begin() as c:
        assert c.execute(text('SELECT current_database(),current_user')).one()==('workshopos_staging','stage4c_rehearsal_owner')
        if inspect(c).get_table_names(schema='public'):
            raise RuntimeError('Refusing nonempty target; use a new isolated database, never reset')
        c.exec_driver_sql(c.scalar(text("SELECT format('CREATE ROLE slice_auth LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS CONNECTION LIMIT 8 PASSWORD %L',CAST(:p AS text))"),{'p':runtime}))
    cfg=Config('/workspace/alembic.ini')
    cfg.set_main_option('script_location','/workspace/alembic')
    cfg.set_main_option('version_locations','/workspace/alembic/versions /schema/versions /rehearsal/versions /slice/versions')
    cfg.set_main_option('version_path_separator','space')
    command.upgrade(cfg,'20261021_0037')
    imported=run_import(engine)
    assert run_import(engine)['idempotent_replay']
    assert imported['source_records']==3241 and imported['quarantined_records']==67
    command.upgrade(cfg,'head')
    with engine.begin() as c:
        c.execute(text('GRANT workshopos_runtime TO slice_auth'))
        c.execute(text('GRANT USAGE ON SCHEMA public TO slice_auth,workshopos_runtime'))
        c.execute(text('GRANT SELECT ON platform_users,tenant_memberships,tenants,workshop_user_profiles,alembic_version TO slice_auth'))
        c.execute(text('GRANT SELECT,INSERT,DELETE ON database_sessions TO slice_auth'))
        c.execute(text('GRANT INSERT ON slice_auth_events TO slice_auth'))
        c.execute(text('GRANT USAGE ON SEQUENCE slice_auth_events_id_seq TO slice_auth'))
        c.execute(text('GRANT SELECT ON customers,vehicles,visits,job_cards,workshop_user_profiles TO workshopos_runtime'))
        c.execute(text('GRANT INSERT,UPDATE ON customers TO workshopos_runtime'))
        c.execute(text('GRANT SELECT,INSERT ON customer_changes,customer_commands TO workshopos_runtime'))
        c.execute(text('GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO workshopos_runtime'))
        c.execute(text('REVOKE CONNECT,TEMPORARY ON DATABASE workshopos_staging FROM PUBLIC'))
        c.execute(text('GRANT CONNECT ON DATABASE workshopos_staging TO slice_auth'))
        c.execute(text('REVOKE CREATE ON SCHEMA public FROM PUBLIC'))
        for u in users:
            actor=str(uuid5(UUID(TENANT),'account:'+str(u['id'])))
            membership=str(uuid5(UUID(TENANT),'membership:'+str(u['id'])))
            c.execute(text('INSERT INTO platform_users(id,display_name,email,password_hash) VALUES(:id,:n,:e,:p)'),{'id':actor,'n':u['name'],'e':u['email'],'p':hash_password(accounts[u['email']])})
            c.execute(text("INSERT INTO tenant_memberships(id,tenant_id,user_id,status) VALUES(:m,:t,:u,'ACTIVE')"),{'m':membership,'t':TENANT,'u':actor})
        provisioning_admin=next(u for u in users if u['role']=='admin')
        c.execute(text("SELECT set_config('workshopos.actor_id',:a,true)"),{'a':str(uuid5(UUID(TENANT),'account:'+str(provisioning_admin['id'])))})
        for u in users:
            actor=str(uuid5(UUID(TENANT),'account:'+str(u['id'])))
            c.execute(text('UPDATE workshop_user_profiles SET platform_user_id=:a WHERE id=:id AND tenant_id=:t'),{'a':actor,'id':u['id'],'t':TENANT})
        assert c.scalar(text('SELECT count(*) FROM database_sessions'))==0
        assert c.scalar(text('SELECT version_num FROM alembic_version'))=='20261022_0053'
        checked=0
        financial={'invoices','invoice_lines','payments','legacy_receipts','legacy_gate_passes','legacy_invoice_events','quotations','quotation_lines'}
        for r in c.execute(text("SELECT target_table,target_key,target_snapshot FROM import_custody.records WHERE disposition='BUSINESS'")).mappings():
            if r['target_table'] not in financial: continue
            actual=snapshot(c,r['target_table'],r['target_key'])
            assert all(actual.get(k)==v for k,v in r['target_snapshot'].items()),r['target_table']
            checked+=1
        assert c.scalar(text('SELECT count(*) FROM slice_historical_stock'))==7
        # Imported values are untouched; source discrepancies are reconciled, never corrected.
        from decimal import Decimal
        discrepancies=sum(Decimal(str(i['subtotal']))!=sum((Decimal(str(l['qty']))*Decimal(str(l['rate'])) for l in rows['invoice_items'] if l['invoice_id']==i['id'] and not l['archived_at']),Decimal(0)) for i in rows['invoices'])
        assert discrepancies==51
    result={'head':'20261022_0053','source_records':3241,'quarantined_records':67,'historical_stock_rows':7,'financial_rows_exact':checked,'invoice_discrepancies_preserved':51,'import_replay':True,'accounts_provisioned':len(users),'source_sha256':hashlib.sha256(Path('/source/demo.sqlite').read_bytes()).hexdigest()}
    print(json.dumps(result,indent=2))

if __name__=='__main__': main()
