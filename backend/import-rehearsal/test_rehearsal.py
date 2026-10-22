"""Tests use only the guarded disposable PostgreSQL resource; no public HTTP listener."""
import json
from pathlib import Path
from unittest.mock import patch
from decimal import Decimal
import pytest
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError
from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient
from importer import (guarded_engine, source_rows, encode, decode, verify_custody,
                      run_import, SOURCE_SHA, TENANT, BRANCH)
from planner import financial


@pytest.fixture(scope='module')
def engine():
    return guarded_engine()


def test_schema_columns_required_without_defaults(engine):
    columns=json.loads(Path('/evidence/stage4c1-dry-run/compatibility.json.md').read_text())
    assert len(columns)==26
    with engine.connect() as c:
        for col in columns:
            actual=next(x for x in inspect(c).get_columns(col['table']) if x['name']==col['column'])
            assert actual['nullable'] is False and actual['default'] is None
            assert str(actual['type']).lower()==col['type']


def test_migration_head_and_tables(engine):
    with engine.connect() as c:
        assert c.scalar(text('SELECT version_num FROM alembic_version'))=='20261021_0037'
        assert len(inspect(c).get_table_names(schema='public'))==106
        assert len(inspect(c).get_table_names(schema='import_custody'))==2


def test_complete_lossless_custody(engine):
    mapping,rows=source_rows()
    with engine.connect() as c: verify_custody(c,mapping,rows)


def test_idempotency(engine):
    a=run_import(engine); b=run_import(engine)
    assert a==b and b['idempotent_replay']


def test_source_hash_rejection():
    with patch('importer.sha',return_value='wrong'):
        with pytest.raises(RuntimeError,match='Source hash mismatch'): source_rows()


def test_environment_guard():
    with patch.dict('os.environ',{'WORKSHOPOS_DATABASE_URL':'postgresql+psycopg://bad:bad@production:5432/real'}):
        with pytest.raises(RuntimeError,match='non-rehearsal'): guarded_engine()


def test_financial_history_lossless(engine):
    _,source=source_rows(); restored={}
    with engine.connect() as c:
        for table in ('invoices','invoice_items','payments'):
            restored[table]=[decode(p) for p in c.scalars(text('SELECT payload FROM import_custody.records WHERE source_table=:t ORDER BY source_key'),{'t':table})]
            assert sorted(map(lambda r:json.dumps(encode(r),sort_keys=True),restored[table]))==sorted(map(lambda r:json.dumps(encode(r),sort_keys=True),source[table]))
    a=sorted(financial(source),key=lambda x:x['id']);b=sorted(financial(restored),key=lambda x:x['id'])
    assert a==b and sum(Decimal(x['difference_stored_minus_lines'])!=0 for x in b)==51


def test_source_relationships_preserved(engine):
    mapping,rows=source_rows()
    with engine.connect() as c:
        for r in c.execute(text('SELECT source_table,payload,relationships FROM import_custody.records')).mappings():
            row=decode(r['payload'])
            expected=[{'field':x['field'],'parent':x['parent'],'source_value':row[x['field']]}
                      for x in mapping['relationships'] if x['table']==r['source_table']]
            assert r['relationships']==expected


def test_foreign_key_enforced(engine):
    with engine.connect() as c:
        tx=c.begin()
        try:
            with pytest.raises(IntegrityError):
                c.execute(text('DELETE FROM workshop_user_profiles WHERE id IN (SELECT user_id FROM advisor_attendance)'))
        finally: tx.rollback()


def test_unique_enforced(engine):
    with engine.connect() as c:
        tx=c.begin()
        try:
            with pytest.raises(IntegrityError):
                c.execute(text('INSERT INTO workshop_user_profiles SELECT * FROM workshop_user_profiles LIMIT 1'))
        finally: tx.rollback()


def test_transaction_rollback(engine):
    with engine.connect() as c:
        tx=c.begin();before=c.scalar(text('SELECT count(*) FROM advisor_attendance'))
        c.execute(text('DELETE FROM advisor_attendance'));tx.rollback()
        assert c.scalar(text('SELECT count(*) FROM advisor_attendance'))==before


def test_custody_denied_to_public(engine):
    with engine.connect() as c:
        assert not c.scalar(text("SELECT EXISTS(SELECT 1 FROM pg_namespace n,LATERAL aclexplode(n.nspacl) a WHERE n.nspname='import_custody' AND a.grantee=0)"))


@pytest.mark.parametrize('table',['customers','vehicles','job_cards','invoices','workshop_user_profiles','advisor_attendance'])
def test_isolated_api_reads(engine,table):
    # Test-only ASGI fixture. Not mounted into the application or a production auth bypass.
    app=FastAPI()
    allowed={'customers','vehicles','job_cards','invoices','workshop_user_profiles','advisor_attendance'}
    @app.get('/rehearsal/{entity}')
    def read(entity:str):
        if entity not in allowed: raise HTTPException(404)
        with engine.connect() as c:
            key='user_id' if entity=='advisor_attendance' else 'id'
            ids=list(c.scalars(text(f'SELECT {key} FROM "{entity}" WHERE tenant_id=:t AND branch_id=:b ORDER BY {key}'),{'t':TENANT,'b':BRANCH}))
            return {'ids':ids,'database':c.scalar(text('SELECT current_database()')),'storage':'PostgreSQL business tables'}
    with engine.connect() as c:
        key='user_id' if table=='advisor_attendance' else 'id'
        expected=list(c.scalars(text(f'SELECT {key} FROM "{table}" ORDER BY {key}')))
    with TestClient(app) as client:
        response=client.get('/rehearsal/'+table)
        assert response.status_code==200
        assert response.json()['ids']==expected
        assert response.json()['database']=='stage4c_rehearsal'
        assert client.get('/rehearsal/import_custody').status_code==404
    # Empty business reads must be reported as empty, never replaced by staged records.
    path=Path('/artifacts/api-reads.json')
    evidence=json.loads(path.read_text()) if path.exists() else {}
    evidence[table]={'http_status':200,'business_records_returned':len(expected),
                     'database':'stage4c_rehearsal','test_only_asgi_fixture':True}
    path.write_text(json.dumps(evidence,indent=2))


def test_promoted_relationships(engine):
    with engine.connect() as c:
        assert c.scalar(text('''SELECT count(*) FROM advisor_attendance a
            LEFT JOIN workshop_user_profiles u ON u.id=a.user_id AND u.tenant_id=a.tenant_id AND u.branch_id=a.branch_id
            WHERE u.id IS NULL'''))==0
        assert c.scalar(text('SELECT count(*) FROM advisor_attendance'))>0


def test_all_foreign_keys_validated(engine):
    with engine.connect() as c:
        assert c.scalar(text("SELECT count(*) FROM pg_constraint WHERE contype='f' AND NOT convalidated"))==0
        assert c.scalar(text("SHOW session_replication_role"))=='origin'


def test_original_constraints_preserved(engine):
    baseline=json.loads(Path('/evidence/stage4c1-target-readonly.json.md').read_text())['catalog']['constraints']
    with engine.connect() as c:
        actual={(r.table_name,r.conname):r.definition for r in c.execute(text('''
            SELECT t.relname AS table_name,k.conname,pg_get_constraintdef(k.oid) AS definition
            FROM pg_constraint k JOIN pg_class t ON t.oid=k.conrelid
            JOIN pg_namespace n ON n.oid=t.relnamespace WHERE n.nspname='public' ''')).all()}
        for row in baseline: assert actual[(row['table_name'],row['conname'])]==row['definition']


def test_business_drift_is_detected(engine):
    mapping,rows=source_rows()
    with engine.connect() as c:
        tx=c.begin()
        try:
            c.execute(text("UPDATE workshop_user_profiles SET name='drift test' WHERE id=(SELECT min(id) FROM workshop_user_profiles)"))
            with pytest.raises(AssertionError,match='Business row drift'): verify_custody(c,mapping,rows)
        finally: tx.rollback()


def test_all_zero_sentinels_preserved(engine):
    sentinels=json.loads(Path('/evidence/stage4a-zero-sentinels.json.md').read_text())
    assert len(sentinels)==61
    with engine.connect() as c:
        for item in sentinels:
            payload=c.scalar(text('SELECT payload FROM import_custody.records WHERE source_table=:t AND source_key=:k'),
                {'t':item['table'],'k':json.dumps({'id':item['record_id']},separators=(',',':'))})
            assert decode(payload)[item['column']]==0


def test_identity_sequence_synchronized(engine):
    with engine.connect() as c:
        seq=c.scalar(text("SELECT pg_get_serial_sequence('workshop_user_profiles','id')"))
        assert seq
        # Read sequence state; do not consume an identifier.
        last=c.scalar(text('SELECT last_value FROM '+seq))
        assert last>=c.scalar(text('SELECT max(id) FROM workshop_user_profiles'))
