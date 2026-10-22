import concurrent.futures
import json
import os
import re
from pathlib import Path
from uuid import uuid4

from alembic import command
from alembic.script import ScriptDirectory
import pytest
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError, ProgrammingError

from run import configuration, guarded_engine

CONTRACT = json.loads(Path('/schema/schema-contract.json').read_text())
HEAD = '20261021_0035'


def catalog(connection):
    return {
        'columns': [dict(r) for r in connection.execute(text("SELECT table_name,column_name,data_type,is_nullable,column_default,numeric_precision,numeric_scale,is_identity,identity_generation FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name,ordinal_position")).mappings()],
        'constraints': [dict(r) for r in connection.execute(text("SELECT c.relname AS table_name,k.conname,k.contype,pg_get_constraintdef(k.oid) AS definition,k.convalidated FROM pg_constraint k JOIN pg_class c ON c.oid=k.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' ORDER BY c.relname,k.conname")).mappings()],
        'indexes': [dict(r) for r in connection.execute(text("SELECT tablename,indexname,indexdef FROM pg_indexes WHERE schemaname='public' ORDER BY tablename,indexname")).mappings()],
    }


@pytest.fixture(scope='session')
def engine():
    assert os.environ['STAGE4B_SCOPE'] == 'test'
    value = guarded_engine()
    # This suite owns the disposable test schema only. Never reset a populated DB.
    with value.begin() as c:
        tables = inspect(c).get_table_names()
        assert set(tables) <= set(CONTRACT['baseline_tables'] + CONTRACT['new_tables'])
        for table in tables:
            if table != 'alembic_version':
                assert c.scalar(text(f'SELECT count(*) FROM "{table}"')) == 0, 'Refusing non-empty test database'
        c.execute(text('DROP SCHEMA public CASCADE'))
        c.execute(text('CREATE SCHEMA public'))
    cfg = configuration()
    command.upgrade(cfg, '20261018_0033')
    with value.connect() as c:
        assert len(inspect(c).get_table_names()) == 74
        baseline = catalog(c)
        Path('/artifacts/baseline-catalog.json').write_text(json.dumps(baseline, indent=2, default=str))
    command.upgrade(cfg, HEAD)
    with value.connect() as c:
        first = catalog(c)
    command.upgrade(cfg, 'head')  # repeat must be a no-op
    with value.connect() as c:
        assert catalog(c) == first
    command.downgrade(cfg, '20261018_0033')
    with value.connect() as c:
        Path('/artifacts/rollback-catalog.json').write_text(json.dumps(catalog(c), indent=2, default=str))
        assert catalog(c) == baseline, 'New-revision rollback changed candidate schema'
    command.upgrade(cfg, HEAD)
    with value.connect() as c:
        assert catalog(c) == first
        Path('/artifacts/test-catalog.json').write_text(json.dumps(first, indent=2, default=str))
    yield value
    with value.connect() as c:
        for table in inspect(c).get_table_names():
            if table != 'alembic_version':
                assert c.scalar(text(f'SELECT count(*) FROM "{table}"')) == 0, 'Synthetic records leaked'
    value.dispose()


@pytest.fixture
def tx(engine):
    with engine.connect() as c:
        transaction = c.begin()
        yield c
        transaction.rollback()


def scope(c):
    tenant, branch = uuid4(), uuid4()
    c.execute(text("INSERT INTO tenants(id,name,lifecycle_state,code) VALUES (:id,'synthetic','active',:code)"), {'id':tenant,'code':str(tenant)})
    c.execute(text("INSERT INTO branches(id,tenant_id,name) VALUES (:id,:t,'synthetic')"), {'id':branch,'t':tenant})
    return tenant, branch


def brand(c, t, b, name='synthetic'):
    return c.scalar(text("INSERT INTO service_brands(tenant_id,branch_id,name,created_at,updated_at) VALUES (:t,:b,:n,'synthetic-time','synthetic-time') RETURNING id"), {'t':t,'b':b,'n':name})


def test_lineage_and_table_set(engine):
    scripts = ScriptDirectory.from_config(configuration())
    assert scripts.get_heads() == [HEAD]
    assert len(list(scripts.walk_revisions())) == 36
    with engine.connect() as c:
        assert c.scalar(text('SELECT version_num FROM alembic_version')) == HEAD
        assert set(inspect(c).get_table_names()) == set(CONTRACT['baseline_tables'] + CONTRACT['new_tables'])
        assert len(inspect(c).get_table_names()) == 106


def test_every_added_column_type_nullability_default_identity(engine):
    aliases = {'timestamptz':'timestamp with time zone'}
    with engine.connect() as c:
        rows = {(r['table_name'],r['column_name']):r for r in catalog(c)['columns']}
    for expected in CONTRACT['columns']:
        actual = rows[expected['table'],expected['column']]
        assert actual['data_type'] == aliases.get(expected['type'],expected['type']), expected
        assert actual['is_nullable'] == expected['nullable'], expected
        if expected['type'] == 'numeric':
            assert actual['numeric_precision'] is None and actual['numeric_scale'] is None
        if expected.get('widened'):
            continue
        default = expected['default']
        if default in {'identity','GENERATED BY DEFAULT AS IDENTITY'}:
            assert actual['is_identity'] == 'YES' and actual['identity_generation'] == 'BY DEFAULT'
        elif default == 'none':
            assert actual['column_default'] is None, expected
        else:
            assert actual['column_default'] is not None and default in actual['column_default'], expected


def test_all_expected_constraints_and_indexes(engine):
    with engine.connect() as c:
        data = catalog(c)
        keys = {(r['table_name'],r['conname']):r for r in data['constraints']}
        indexes = {(r['tablename'],r['indexname']):r for r in data['indexes']}
        for expected in CONTRACT['constraints']:
            actual = keys[expected['table'],expected['name']]
            assert actual['convalidated']
            if expected['definition'].startswith('FOREIGN KEY'):
                assert actual['contype'] == 'f' and 'ON DELETE RESTRICT' in actual['definition']
                parts = re.match(r'FOREIGN KEY \((.*?)\) REFERENCES "(.*?)" \((.*?)\)', expected['definition'])
                observed = next(f for f in inspect(c).get_foreign_keys(expected['table']) if f['name']==expected['name'])
                assert observed['constrained_columns']==re.findall(r'"([^"]+)"',parts[1])
                assert observed['referred_table']==parts[2]
                assert observed['referred_columns']==re.findall(r'"([^"]+)"',parts[3])
        for expected in CONTRACT['indexes']:
            actual = indexes[expected['table'],expected['name']]
            assert ('CREATE UNIQUE INDEX' in actual['indexdef']) == expected['unique']
            for col in expected['columns']:
                assert col in actual['indexdef']
        for table in CONTRACT['new_tables']:
            assert any(r['table_name']==table and r['contype']=='p' for r in data['constraints'])


def test_all_new_tables_force_rls(engine):
    with engine.connect() as c:
        rows = {r.relname:(r.relrowsecurity,r.relforcerowsecurity) for r in c.execute(text("SELECT relname,relrowsecurity,relforcerowsecurity FROM pg_class JOIN pg_namespace n ON n.oid=relnamespace WHERE n.nspname='public'"))}
        policies = {r.tablename for r in c.execute(text("SELECT tablename FROM pg_policies WHERE schemaname='public' AND policyname='s4b_scope'"))}
        for table in CONTRACT['new_tables']:
            assert rows[table]==(True,True) and table in policies


def test_fk_rejects_cross_tenant_branch(tx):
    ta, ba = scope(tx)
    tb, bb = scope(tx)
    with pytest.raises(IntegrityError):
        brand(tx, ta, bb)


def test_fk_rejects_nonexistent_actor(tx):
    t,b=scope(tx)
    with pytest.raises(IntegrityError):
        tx.execute(text("INSERT INTO advisor_attendance(tenant_id,branch_id,user_id,date) VALUES (:t,:b,999,'test')"), {'t':t,'b':b})


def test_same_branch_cross_job_reference_rejected(tx):
    t,b=scope(tx)
    u=uuid4()
    tx.execute(text("INSERT INTO platform_users(id,cognito_subject,display_name,email) VALUES (:u,:sub,'synthetic','test@example.invalid')"), {'u':u,'sub':str(u)})
    params={'t':t,'b':b,'u':u}
    customer=tx.scalar(text("INSERT INTO customers(tenant_id,branch_id,name,mobile,created_by,updated_by) VALUES (:t,:b,'test','123',:u,:u) RETURNING id"),params)
    jobs=[]
    for n in range(2):
        p={**params,'c':customer,'number':f'test-{n}'}
        vehicle=tx.scalar(text("INSERT INTO vehicles(tenant_id,branch_id,customer_id,number,make,model,created_by,updated_by) VALUES (:t,:b,:c,:number,'test','test',:u,:u) RETURNING id"),p)
        visit=tx.scalar(text("INSERT INTO visits(tenant_id,branch_id,customer_id,vehicle_id,received_by,fuel,odo_reading,requested_work) VALUES (:t,:b,:c,:v,:u,'test',0,'test') RETURNING id"),{**p,'v':vehicle})
        jobs.append(tx.scalar(text("INSERT INTO job_cards(tenant_id,branch_id,job_no,visit_id,status,created_by,updated_by) VALUES (:t,:b,:number,:v,'NEW',:u,:u) RETURNING id"),{**p,'v':visit}))
    material=tx.scalar(text('INSERT INTO material_requests(tenant_id,branch_id,job_card_id) VALUES (:t,:b,:j) RETURNING id'),{**params,'j':jobs[0]})
    query=text('INSERT INTO material_events(tenant_id,branch_id,job_card_id,material_row_id) VALUES (:t,:b,:j,:m)')
    tx.execute(query,{**params,'j':jobs[0],'m':material})
    with pytest.raises(IntegrityError):
        tx.execute(query,{**params,'j':jobs[1],'m':material})


def test_unique_case_sensitive_scope(tx):
    t,b=scope(tx)
    brand(tx,t,b,'Test')
    brand(tx,t,b,'test')
    with pytest.raises(IntegrityError):
        brand(tx,t,b,'Test')


def test_parent_delete_restricted(tx):
    t,b=scope(tx)
    brand(tx,t,b)
    with pytest.raises(IntegrityError):
        tx.execute(text('DELETE FROM branches WHERE id=:id'), {'id':b})


def test_check_constraint(tx):
    t,b=scope(tx)
    with pytest.raises(IntegrityError):
        tx.execute(text("INSERT INTO outbox_events(id,tenant_id,branch_id,event_key,kind,payload,attempts) VALUES (:id,:t,:b,'test','test','{}',-1)"), {'id':uuid4(),'t':t,'b':b})


def test_exact_decimal_storage(tx):
    t,b=scope(tx)
    # Exact synthetic decimal values; this is not a demo invoice import.
    tx.execute(text("INSERT INTO local_purchases(tenant_id,branch_id,quantity,unit_cost) VALUES (:t,:b,1.1234567890123456789,2.9876543210987654321)"), {'t':t,'b':b})
    assert str(tx.scalar(text('SELECT quantity FROM local_purchases'))) == '1.1234567890123456789'


def test_zero_not_globally_nullified(tx):
    t,b=scope(tx)
    tx.execute(text("INSERT INTO legacy_material_movements(tenant_id,branch_id,legacy_job_card_id,job_card_id,qty) VALUES (:t,:b,0,NULL,0)"), {'t':t,'b':b})
    row=tx.execute(text('SELECT legacy_job_card_id,job_card_id,qty FROM legacy_material_movements')).one()
    assert tuple(row)==(0,None,0)
    with pytest.raises(IntegrityError):
        tx.execute(text("INSERT INTO legacy_material_movements(tenant_id,branch_id,job_card_id) VALUES (:t,:b,0)"), {'t':t,'b':b})


def test_blocked_provenance_requires_review(tx):
    t,b=scope(tx)
    with pytest.raises(IntegrityError):
        tx.execute(text("INSERT INTO import_source_records(tenant_id,source_sha256,source_table,source_key,row_sha256,payload,disposition) VALUES (:t,:h,'synthetic','1',:h,'{}','BLOCKED')"), {'t':t,'h':'a'*64})


@pytest.mark.parametrize('mutation', ["UPDATE import_source_records SET payload='{}'", 'DELETE FROM import_source_records'])
def test_provenance_immutable_and_reviewable(tx,mutation):
    t,b=scope(tx)
    tx.execute(text("INSERT INTO import_source_records(tenant_id,source_sha256,source_table,source_key,row_sha256,payload,disposition,exception) VALUES (:t,:h,'synthetic','1',:h,CAST(:payload AS jsonb),'BLOCKED','{\"review\":\"required\"}')"), {'t':t,'h':'a'*64,'payload':json.dumps({'raw_actor':0})})
    tx.execute(text("UPDATE import_source_records SET exception='{\"review\":\"pending-owner\"}'"))
    assert tx.scalar(text("SELECT payload->>'raw_actor' FROM import_source_records"))=='0'
    with pytest.raises(IntegrityError):
        tx.execute(text(mutation))


def asset_fixture(tx,state='STAGED'):
    t,b=scope(tx)
    u,a=uuid4(),uuid4()
    tx.execute(text("INSERT INTO platform_users(id,cognito_subject,display_name,email) VALUES (:u,:sub,'synthetic','synthetic@example.invalid')"), {'u':u,'sub':str(u)})
    tx.execute(text("INSERT INTO object_assets(id,tenant_id,branch_id,storage_key,sha256,mime_type,byte_size,state,created_by) VALUES (:a,:t,:b,'synthetic',:h,'text/html',1,:state,:u)"), {'a':a,'t':t,'b':b,'h':'a'*64,'state':state,'u':u})
    return t,b,a


def snapshot(tx,t,b,a):
    tx.execute(text("INSERT INTO document_snapshots(tenant_id,branch_id,source_kind,source_id,snapshot_version,values,asset_id,availability) VALUES (:t,:b,'synthetic',1,1,'{}',:a,'READY')"), {'t':t,'b':b,'a':a})


def test_ready_snapshot_rejects_staged_asset(tx):
    t,b,a=asset_fixture(tx)
    with pytest.raises(IntegrityError):
        snapshot(tx,t,b,a)


def test_ready_asset_cannot_retire_under_snapshot(tx):
    t,b,a=asset_fixture(tx,'READY')
    snapshot(tx,t,b,a)
    with pytest.raises(IntegrityError):
        tx.execute(text("UPDATE object_assets SET state='RETIRED' WHERE id=:a"), {'a':a})


def test_snapshot_cannot_be_rewritten(tx):
    t,b,a=asset_fixture(tx,'READY')
    snapshot(tx,t,b,a)
    with pytest.raises(IntegrityError):
        tx.execute(text("UPDATE document_snapshots SET html='replacement'"))


def test_transaction_rollback(engine):
    with engine.connect() as c:
        transaction=c.begin()
        t,b=scope(c)
        ident=brand(c,t,b)
        transaction.rollback()
        assert c.scalar(text('SELECT count(*) FROM service_brands WHERE id=:id'), {'id':ident})==0
        assert c.scalar(text('SELECT count(*) FROM tenants WHERE id=:id'), {'id':t})==0


def test_concurrent_unique_and_sequences(engine):
    with engine.begin() as c:
        t,b=scope(c)
    def create(n):
        try:
            with engine.begin() as c:
                return brand(c,t,b,'race' if n<2 else f'row-{n}')
        except IntegrityError:
            return None
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            ids=list(pool.map(create,range(12)))
        assert ids.count(None)==1
        assert len(set(i for i in ids if i is not None))==11
        with engine.connect() as c:
            assert c.scalar(text('SELECT count(*) FROM service_brands WHERE tenant_id=:t'), {'t':t})==11
    finally:
        with engine.begin() as c:
            c.execute(text('DELETE FROM service_brands WHERE tenant_id=:t'), {'t':t})
            c.execute(text('DELETE FROM branches WHERE tenant_id=:t'), {'t':t})
            c.execute(text('DELETE FROM tenants WHERE id=:t'), {'t':t})


def test_rls_blocks_missing_and_cross_tenant_context(tx):
    t,b=scope(tx)
    t2,b2=scope(tx)
    brand(tx,t,b)
    tx.execute(text('SET LOCAL ROLE workshopos_runtime'))
    assert tx.scalar(text('SELECT count(*) FROM service_brands'))==0
    tx.execute(text("SELECT set_config('workshopos.tenant_id',:t,true),set_config('workshopos.branch_ids',:b,true)"), {'t':str(t),'b':'{'+str(b)+'}'})
    assert tx.scalar(text('SELECT count(*) FROM service_brands'))==1
    with pytest.raises(ProgrammingError):
        brand(tx,t2,b2)


@pytest.mark.parametrize('variable,value', [
    ('STAGE4B_SCOPE','production'),
    ('WORKSHOPOS_ENVIRONMENT','staging'),
    ('WORKSHOPOS_DATABASE_URL','postgresql+psycopg://a:b@workshopos-db-1:5432/workshopos'),
    ('WORKSHOPOS_DATABASE_URL','postgresql+psycopg://a:b@schema-dev:5432/stage4b_dev'),
    ('WORKSHOPOS_DATABASE_URL','postgresql+psycopg://a:b@schema-test:5432/stage4b_test?host=external'),
])
def test_isolation_guard(variable,value,monkeypatch):
    monkeypatch.setenv(variable,value)
    with pytest.raises(RuntimeError):
        guarded_engine()


def test_rollback_refuses_populated_tables(engine):
    with engine.begin() as c:
        t,b=scope(c)
        ident=brand(c,t,b)
    try:
        with pytest.raises(RuntimeError,match='Rollback refused'):
            command.downgrade(configuration(),'20261018_0033')
        with engine.connect() as c:
            assert c.scalar(text('SELECT version_num FROM alembic_version'))==HEAD
            assert c.scalar(text('SELECT count(*) FROM service_brands WHERE id=:id'),{'id':ident})==1
    finally:
        with engine.begin() as c:
            c.execute(text('DELETE FROM service_brands WHERE id=:id'),{'id':ident})
            c.execute(text('DELETE FROM branches WHERE id=:id'),{'id':b})
            c.execute(text('DELETE FROM tenants WHERE id=:id'),{'id':t})
