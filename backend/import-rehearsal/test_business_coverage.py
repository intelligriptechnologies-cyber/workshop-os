"""Regression signal: real business tables, never custody counts."""
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError, IntegrityError
from sqlalchemy import inspect
import pytest
from decimal import Decimal
from importer import guarded_engine, source_rows, project, canonical, TENANT, BRANCH

def test_operational_business_coverage():
    with guarded_engine().connect() as c:
        for table, expected in [('customers',121), ('vehicles',132), ('visits',145),
                                ('job_cards',145), ('estimates',144), ('invoices',52),
                                ('invoice_lines',105), ('payments',27)]:
            assert c.scalar(text(f'SELECT count(*) FROM {table}')) == expected, table

def test_financial_business_values_not_only_custody():
    _, rows = source_rows()
    with guarded_engine().connect() as c:
        for source, target, fields in [
            ('invoices','invoices',['subtotal','discount','gst_amount','total','status','job_card_id']),
            ('invoice_items','invoice_lines',['rate','gst_rate','kind','description','invoice_id']),
            ('payments','payments',['amount','invoice_id','job_card_id','mode'])]:
            for original in rows[source]:
                stored=c.execute(text(f'SELECT * FROM {target} WHERE id=:id'),{'id':original['id']}).mappings().one()
                for field in fields:
                    value=original[field]
                    assert stored[field] == (Decimal(str(value)) if isinstance(value,float) else value)
        assert c.scalar(text('SELECT count(*) FROM invoice_lines WHERE taxable_paise IS NOT NULL OR tax_paise IS NOT NULL OR total_paise IS NOT NULL')) == 0
        assert c.scalar(text('SELECT count(*) FROM financial_documents')) == 0
        assert c.scalar(text('SELECT count(*) FROM platform_users')) == 0

def test_historical_assignment_and_promise_preserved():
    _,rows=source_rows()
    with guarded_engine().connect() as c:
        for original in rows['job_cards']:
            stored=c.execute(text('SELECT * FROM job_cards WHERE id=:id'),{'id':original['id']}).mappings().one()
            assert stored['historical_advisor_id']==original['advisor_id']
            assert stored['advisor_id'] is None
            assert stored['historical_values']['promised_at']==original['promised_at']
            assert stored['promised_at'] is None
        assert c.scalar(text('SELECT count(*) FROM visits WHERE odo_reading IS NULL')) == 144
        assert c.scalar(text('SELECT count(*) FROM vehicles WHERE engine_no IS NULL')) == 132

def test_native_requirements_and_essential_fks():
    with guarded_engine().connect() as c:
        tx=c.begin()
        with pytest.raises(IntegrityError), c.begin_nested():
            c.execute(text('''INSERT INTO customers(tenant_id,branch_id,name,mobile,type,address)
                VALUES(:t,:b,'Native missing actor','native-test','Individual','')'''),{'t':TENANT,'b':BRANCH})
        actor='a0000000-0000-4000-8000-000000000001'
        c.execute(text("INSERT INTO platform_users(id,display_name,email) VALUES(:a,'Rollback-only test actor','rollback-only@example.invalid')"),{'a':actor})
        with pytest.raises(IntegrityError) as caught, c.begin_nested():
            c.execute(text('''INSERT INTO vehicles(tenant_id,branch_id,customer_id,number,make,model,created_by,updated_by)
                VALUES(:t,:b,999999,'BAD-FK','a','b',:a,:a)'''),{'t':TENANT,'b':BRANCH,'a':actor})
        assert caught.value.orig.sqlstate=='23503'
        tx.rollback()

def test_custody_bound_history_is_immutable():
    with guarded_engine().connect() as c:
        tx=c.begin()
        with pytest.raises(DBAPIError,match='immutable'), c.begin_nested():
            c.execute(text("UPDATE invoices SET total=0 WHERE id=1"))
        with pytest.raises(DBAPIError,match='run is closed'), c.begin_nested():
            c.execute(text('''INSERT INTO customers(id,tenant_id,branch_id,name,mobile,type,
                history_source_sha,history_source_table,history_source_key)
                OVERRIDING SYSTEM VALUE
                SELECT 99999,tenant_id,branch_id,name,mobile,type,history_source_sha,
                history_source_table,history_source_key FROM customers WHERE id=1'''))
        tx.rollback()

def test_runtime_role_cannot_claim_historical_exception():
    with guarded_engine().connect() as c:
        tx=c.begin()
        c.execute(text('CREATE ROLE history_exception_probe NOLOGIN'))
        c.execute(text('GRANT INSERT ON customers TO history_exception_probe'))
        with pytest.raises(DBAPIError,match='owner-only'), c.begin_nested():
            c.execute(text('SET LOCAL ROLE history_exception_probe'))
            c.execute(text('''INSERT INTO customers(id,tenant_id,branch_id,name,mobile,type,
                history_source_sha,history_source_table,history_source_key)
                OVERRIDING SYSTEM VALUE VALUES(99999,:t,:b,'No actor','no-actor','Individual',
                'fake','customers',:key)'''),{'t':TENANT,'b':BRANCH,'key':canonical({'id':99999})})
        tx.rollback()

def test_approved_estimate_stays_protected_after_import():
    with guarded_engine().connect() as c:
        tx=c.begin()
        with pytest.raises(DBAPIError,match='immutable'), c.begin_nested():
            c.execute(text("UPDATE estimate_lines SET rate=0 WHERE estimate_id=(SELECT id FROM estimates WHERE status='APPROVED' LIMIT 1)"))
        with pytest.raises(DBAPIError), c.begin_nested():
            c.execute(text('''INSERT INTO estimate_lines(tenant_id,branch_id,estimate_id,line_no,kind,description,quantity,rate,gst_rate)
                SELECT tenant_id,branch_id,id,999,'Service','Cannot append',1,1,18
                FROM estimates WHERE status='APPROVED' LIMIT 1'''))
        tx.rollback()

def test_every_promoted_mapping_matches_source_projection():
    mapping,rows=source_rows()
    with guarded_engine().connect() as c:
        promoted={(r[0],r[1]) for r in c.execute(text("SELECT source_table,source_key FROM import_custody.records WHERE disposition='BUSINESS'"))}
        for table in mapping['tables']:
            columns={x['name']:x for x in inspect(c).get_columns(table['target'])}
            for row in rows[table['source']]:
                key=canonical({k:row[k] for k in table['source_pk']})
                if (table['source'],key) not in promoted: continue
                values,reasons=project(table,row,columns,rows)
                assert not reasons
                # Compare SQL-typed values, including exact NUMERIC and timestamptz instants.
                condition=' AND '.join(f'"{k}" IS NOT DISTINCT FROM CAST(:v{i} AS {columns[k]["type"]})' for i,k in enumerate(values))
                params={f'v{i}':v for i,v in enumerate(values.values())}
                # JSON equality is defined by jsonb, not json.
                condition=condition.replace('"historical_values" IS NOT DISTINCT FROM CAST', '"historical_values"::jsonb IS NOT DISTINCT FROM CAST').replace(' AS JSON)', ' AS JSONB)')
                assert c.scalar(text(f'SELECT count(*) FROM "{table["target"]}" WHERE '+condition),params)==1, (table['source'],key)

def test_historical_exceptions_keep_native_not_null_contract():
    import json
    from pathlib import Path
    from history_policy import NULLABLE
    original=json.loads(Path('/evidence/stage4b-test-catalog.json.md').read_text())
    required={(x['table_name'],x['column_name']) for x in original['columns'] if x['is_nullable']=='NO'}
    with guarded_engine().connect() as c:
        for table,fields in NULLABLE.items():
            for field in fields:
                if (table,field) not in required: continue
                definitions=list(c.scalars(text('''SELECT pg_get_constraintdef(k.oid) FROM pg_constraint k
                    JOIN pg_class t ON t.oid=k.conrelid WHERE t.relname=:table AND k.contype='c'
                    AND k.conname LIKE 'hist_native_%' '''),{'table':table}))
                assert any('history_source_sha IS NOT NULL' in d and f'{field} IS NOT NULL' in d for d in definitions), (table,field)

def test_missing_essential_parent_is_not_treated_as_metadata():
    mapping, rows=source_rows()
    with guarded_engine().connect() as c:
        table=next(t for t in mapping['tables'] if t['source']=='vehicles')
        columns={x['name']:x for x in inspect(c).get_columns('vehicles')}
        original=dict(rows['vehicles'][0]); original['customer_id']=999999
        values,_=project(table,original,columns,rows)
        assert values['customer_id']==999999
        assert 'customer_id' not in values['historical_values']
        assert not columns['customer_id']['nullable']

def test_photo_metadata_does_not_fabricate_assets():
    with guarded_engine().connect() as c:
        assert c.scalar(text('SELECT count(*) FROM job_media'))==289
        assert c.scalar(text('SELECT count(*) FROM object_assets'))==0
        assert c.scalar(text("SELECT count(*) FROM job_media WHERE historical_values->>'artifact_availability'='UI_PLACEHOLDER_ONLY'"))==288
        assert c.scalar(text("SELECT count(*) FROM job_media WHERE historical_values->>'artifact_availability'='UNAVAILABLE'"))==1

def test_all_entity_counts_and_ids_reconcile():
    mapping,rows=source_rows()
    with guarded_engine().connect() as c:
        total=0
        for table in mapping['tables']:
            business=c.scalar(text("SELECT count(*) FROM import_custody.records WHERE source_table=:s AND disposition='BUSINESS'"),{'s':table['source']})
            quarantine=c.scalar(text("SELECT count(*) FROM import_custody.records WHERE source_table=:s AND disposition='QUARANTINE'"),{'s':table['source']})
            assert business+quarantine==len(rows[table['source']])
            assert c.scalar(text(f'SELECT count(*) FROM "{table["target"]}"'))==business
            if table['source_pk']==['id']:
                expected={row[0]['id'] for row in c.execute(text("SELECT target_key FROM import_custody.records WHERE source_table=:s AND disposition='BUSINESS'"),{'s':table['source']})}
                assert set(c.scalars(text(f'SELECT id FROM "{table["target"]}"')))==expected
            total+=business+quarantine
        assert total==3241
