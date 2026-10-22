"""Disposable import only. Complete typed custody precedes constrained promotion."""
import base64
from collections import Counter
import hashlib
import json
import os
from pathlib import Path
import sqlite3
from uuid import UUID

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import IntegrityError
from planner import SOURCE_SHA, STATUS_PROJECTIONS, canonical, convert, exact_paise
from history_policy import TABLES, NULLABLE, ACTORS, RAW_TIMES

SOURCE = Path('/source/demo.sqlite')
EVIDENCE = Path('/evidence')
TENANT = 'eb01f21c-09d1-5cb1-aadb-d15649568fd7'
BRANCH = '12809bd1-d793-52d2-878d-7f0f8f1d6e09'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def guarded_engine():
    url = make_url(os.environ['WORKSHOPOS_DATABASE_URL'])
    expected = ('postgresql+psycopg', 'rehearsal-db', 5432,
                'stage4c_rehearsal', 'stage4c_rehearsal_owner')
    if os.environ.get('WORKSHOPOS_ENVIRONMENT') != 'stage4c-rehearsal' or (
        url.drivername, url.host, url.port, url.database, url.username
    ) != expected or url.query or not url.password:
        raise RuntimeError('Refusing non-rehearsal target')
    manifest = json.loads(Path('/workspace/source-manifest.json').read_text())
    if manifest['revision'] != '50c8aab1766b61c914e2829b460bfd1697723ec2':
        raise RuntimeError('Wrong backend candidate')
    for item in manifest['files']:
        if sha((Path('/workspace') / item['path']).read_bytes()) != item['sha256']:
            raise RuntimeError('Backend source drift')
    engine = create_engine(url, connect_args={'connect_timeout': 3}, hide_parameters=True)
    with engine.connect() as c:
        if tuple(c.execute(text('SELECT current_database(), current_user')).one()) != expected[3:]:
            raise RuntimeError('Database identity mismatch')
    return engine


def encode(row):
    """SQLite storage types, including REAL IEEE-754 values, round-trip exactly."""
    result = {}
    for key, value in row.items():
        if value is None: result[key] = ['null', None]
        elif isinstance(value, int): result[key] = ['integer', str(value)]
        elif isinstance(value, float): result[key] = ['real', value.hex()]
        elif isinstance(value, bytes): result[key] = ['blob', base64.b64encode(value).decode()]
        elif isinstance(value, str): result[key] = ['text', value]
        else: raise TypeError('Unsupported SQLite storage type')
    return result


def decode(payload):
    converters = {'null': lambda v: None, 'integer': int, 'real': float.fromhex,
                  'blob': base64.b64decode, 'text': lambda v: v}
    return {k: converters[t](v) for k, (t, v) in payload.items()}


def source_rows():
    if sha(SOURCE.read_bytes()) != SOURCE_SHA:
        raise RuntimeError('Source hash mismatch')
    for suffix in ('-wal', '-journal', '-shm'):
        if Path(str(SOURCE) + suffix).exists(): raise RuntimeError('Source sidecar')
    mapping = json.loads((EVIDENCE / 'stage3-schema-mapping.json.md').read_text())
    with sqlite3.connect(SOURCE.as_uri() + '?mode=ro&immutable=1', uri=True) as db:
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA query_only=ON')
        assert db.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
        names = {r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")}
        assert names == {t['source'] for t in mapping['tables']}
        rows = {}
        for table in mapping['tables']:
            order = ','.join('"' + k + '"' for k in table['source_pk'])
            rows[table['source']] = [dict(r) for r in db.execute(
                f'SELECT * FROM "{table["source"]}" ORDER BY {order}')]
    assert sum(map(len, rows.values())) == 3241
    assert sha(SOURCE.read_bytes()) == SOURCE_SHA
    return mapping, rows


def policy_hash():
    paths = [Path(__file__), Path('/tools/import-planner/planner.py'),
             EVIDENCE / 'stage3-schema-mapping.json.md',
             Path('/rehearsal/versions/20261021_0036_import_compatibility.py'),
             Path('/rehearsal/versions/20261021_0037_historical_import.py'),
             Path('/rehearsal/history_policy.py')]
    return sha(b''.join(p.read_bytes() for p in paths))


def project(table, row, columns, rows=None):
    values = {k: v for k, v in [('tenant_id', TENANT), ('branch_id', BRANCH)] if k in columns}
    reasons = []
    target = table['target']
    historical = {}
    if target in TABLES:
        values.update(history_source_sha=SOURCE_SHA, history_source_table=table['source'],
                      history_source_key=canonical({k:row[k] for k in table['source_pk']}))
    for col in table['columns']:
        if col['action'] == 'CREDENTIAL EXCEPTION': continue
        name = col['target']
        if name not in columns:
            reasons.append('MISSING_COLUMN:' + name)
            continue
        typ = str(columns[name]['type']).lower()
        if typ == 'timestamp' and getattr(columns[name]['type'], 'timezone', False):
            typ = 'timestamp with time zone'
        typ = {'timestamp with time zone': 'timestamp with time zone',
               'boolean': 'boolean'}.get(typ, typ)
        value, error = convert(row[col['source']], typ)
        if name in ACTORS.get(target, []):
            original = row[col['source']]
            if original is None:
                value, error = None, None
            elif original != 0 and rows and any(u['id']==original for u in rows['users']):
                values['historical_'+name] = original
                historical[name] = original
                value, error = None, None
            # Zero actors remain ambiguous; never silently attribute them.
        if error == 'TIMESTAMP_INTERPRETATION_REQUIRED' and name in RAW_TIMES.get(target, []):
            historical[name] = row[col['source']]
            value, error = None, None
        if error: reasons.append(error + ':' + name)
        values[name] = value
    if target in TABLES:
        for name in NULLABLE.get(target, []):
            if name in columns and name not in values:
                values[name] = None
                historical[name] = {'availability':'NOT_RECORDED_IN_SOURCE'}
        if table['source'] in ('invoices', 'payments', 'photos'):
            historical['artifact_availability'] = 'UNAVAILABLE'
            if table['source']=='photos' and row['src']=='/media-placeholder.svg':
                historical['artifact_availability'] = 'UI_PLACEHOLDER_ONLY'
        values['historical_values'] = canonical(historical)
    # Native sequence positions are presentation indexes, derived from source ID order.
    line_parent = {'estimate_items':'estimate_id', 'invoice_items':'invoice_id',
                   'purchase_order_lines':'purchase_order_id'}.get(table['source'])
    if line_parent and rows:
        siblings = sorted(r['id'] for r in rows[table['source']] if r[line_parent]==row[line_parent])
        values['line_no'] = siblings.index(row['id']) + 1
    if table['source']=='invoice_items':
        values['unit_amount_paise'] = exact_paise(row['rate'])
        values['gst_rate_bps'] = exact_paise(row['gst_rate']) if row['gst_rate'] is not None else None
        if values['unit_amount_paise'] is None or values['gst_rate_bps'] is None:
            reasons.append('NONINTEGRAL_LINE_UNIT_OR_RATE')
    if table['source']=='followups': values['status'] = 'COMPLETED' if row['done'] else 'OPEN'
    if table['source']=='qc_checks':
        values['status'] = 'PASSED' if row['passed'] else ('FAILED' if row['fail_reason'] else 'PENDING')
    if table['source']=='suppliers': values['mobile'] = row['phone']
    if table['source']=='material_movements' and row['job_card_id']==0 and row['direction']=='STOCK_IN':
        values['legacy_job_card_id'] = 0
        values['job_card_id'] = None
    if table['source'] in STATUS_PROJECTIONS:
        status = STATUS_PROJECTIONS[table['source']].get(row['status'])
        if status is None: reasons.append('STATUS_MAPPING_UNRESOLVED')
        else: values['status'] = status
    for a,b in {'invoices': {'subtotal':'subtotal_paise','discount':'discount_paise',
                            'gst_amount':'tax_paise','total':'total_paise'},
                'payments': {'amount':'amount_paise'}}.get(table['source'], {}).items():
        values[b] = exact_paise(row[a]) if row[a] is not None else None
        if values[b] is None: reasons.append('NONINTEGRAL_PAISE:' + b)
    if table['source'] == 'payments' and row['mode'] == 'UPI': values['method'] = 'UPI'
    for name, col in columns.items():
        if name in values and values[name] is None and not col['nullable']:
            reasons.append('REQUIRED_NULL:' + name)
        elif name not in values and not col['nullable'] and col.get('default') is None and not col.get('identity'):
            reasons.append('MISSING_REQUIRED:' + name)
        # A server timestamp must not be substituted for an unknown historical instant.
        elif name not in values and name in {'created_at','updated_at'}:
            reasons.append('MISSING_HISTORICAL_TIMESTAMP:' + name)
    return values, sorted(set(reasons))


def snapshot(c, target, key):
    condition = ' AND '.join(f'"{k}"=:k{i}' for i,k in enumerate(key))
    return c.scalar(text(f'SELECT to_jsonb(t) FROM "{target}" t WHERE {condition}'),
                    {f'k{i}':v for i,v in enumerate(key.values())})


def run_import(engine):
    mapping, rows = source_rows()
    with engine.begin() as c:
        c.execute(text('SELECT pg_advisory_xact_lock(413241)'))
        assert c.scalar(text('SELECT version_num FROM alembic_version')) == '20261021_0037'
        old = c.execute(text('SELECT * FROM import_custody.runs WHERE source_sha=:s'), {'s':SOURCE_SHA}).mappings().first()
        if old:
            if old['policy_sha'] != policy_hash() or not old['completed']:
                raise RuntimeError('Import policy drift or incomplete previous run')
            verify_custody(c, mapping, rows)
            return report(c, replay=True)
        # A rehearsal must start with empty business tables, never append to another scope.
        for name in inspect(c).get_table_names(schema='public'):
            if name != 'alembic_version' and c.scalar(text(f'SELECT EXISTS(SELECT 1 FROM "{name}")')):
                raise RuntimeError('Nonempty business database; refusing import')
        c.execute(text('INSERT INTO import_custody.runs(source_sha,policy_sha,source_count) VALUES(:s,:p,3241)'),
                  {'s':SOURCE_SHA,'p':policy_hash()})
        # Explicit disposable scope metadata, not historical users or source business records.
        c.execute(text("INSERT INTO tenants(id,name,lifecycle_state) VALUES(:id,'Disposable SQLite rehearsal','active')"),{'id':TENANT})
        c.execute(text("INSERT INTO branches(id,tenant_id,name,is_primary) VALUES(:id,:t,'Disposable rehearsal branch',true)"),{'id':BRANCH,'t':TENANT})
        pending = []
        primary_keys = {}
        for table in mapping['tables']:
            columns = {x['name']:x for x in inspect(c).get_columns(table['target'])}
            primary_keys[table['target']] = inspect(c).get_pk_constraint(table['target'])['constrained_columns']
            seen = set()
            for row in rows[table['source']]:
                key = canonical({k:row[k] for k in table['source_pk']})
                if key in seen: raise RuntimeError('Duplicate source key')
                seen.add(key)
                payload = encode(row)
                refs = [{'field':r['field'],'parent':r['parent'],'source_value':row[r['field']]}
                        for r in mapping['relationships'] if r['table']==table['source']]
                values, reasons = project(table, row, columns, rows)
                for ref in refs:
                    value = ref['source_value']
                    optional_nonjob = table['source']=='material_movements' and ref['field']=='job_card_id' and value==0 and row['direction']=='STOCK_IN'
                    if value is not None and not optional_nonjob and not any(p.get('id')==value for p in rows[ref['parent']]):
                        reasons.append('UNRESOLVED_SOURCE_PARENT:' + ref['field'])
                params = {'s':SOURCE_SHA,'t':table['source'],'k':key,'p':canonical(payload),
                          'h':sha(canonical(payload).encode()),'r':canonical(refs),
                          'target':table['target'],'reasons':canonical(sorted(set(reasons)))}
                c.execute(text('''INSERT INTO import_custody.records
                    (source_sha,source_table,source_key,payload,payload_sha,relationships,target_table,disposition,reasons)
                    VALUES(:s,:t,:k,CAST(:p AS jsonb),:h,CAST(:r AS jsonb),:target,'QUARANTINE',CAST(:reasons AS jsonb))'''),params)
                if not reasons: pending.append((table,key,values))
        # Foreign keys supply the final ordering oracle; retries only after real progress.
        while pending:
            deferred = []; progress = 0
            for table,key,values in pending:
                try:
                    with c.begin_nested():
                        cols = ','.join(f'"{k}"' for k in values)
                        binds = ','.join('CAST(:'+k+' AS json)' if k=='historical_values' else ':'+k for k in values)
                        c.execute(text(f'INSERT INTO "{table["target"]}" ({cols}) OVERRIDING SYSTEM VALUE VALUES ({binds})'),values)
                        pks = primary_keys[table['target']]
                        target_key = {k:values[k] for k in pks}
                        state = snapshot(c,table['target'],target_key)
                        c.execute(text('''UPDATE import_custody.records SET disposition='BUSINESS',
                            target_key=CAST(:tk AS jsonb), target_snapshot=CAST(:sn AS jsonb), reasons='[]'::jsonb
                            WHERE source_sha=:s AND source_table=:t AND source_key=:k'''),
                            {'tk':canonical(target_key),'sn':canonical(state),'s':SOURCE_SHA,'t':table['source'],'k':key})
                    progress += 1
                except IntegrityError as exc:
                    # No SQL parameter/payload logging: custody may contain development credentials.
                    reason = 'POSTGRES_' + exc.orig.sqlstate + ':' + (exc.orig.diag.constraint_name or exc.orig.diag.column_name or 'constraint')
                    c.execute(text('''UPDATE import_custody.records SET reasons=CAST(:r AS jsonb)
                        WHERE source_sha=:s AND source_table=:t AND source_key=:k'''),
                        {'r':canonical([reason]),'s':SOURCE_SHA,'t':table['source'],'k':key})
                    if exc.orig.sqlstate == '23503': deferred.append((table,key,values))
            if not progress: break
            pending = deferred
        # Explicit imported integer IDs must not leave future identity allocation behind.
        for table in {t['target'] for t in mapping['tables']}:
            for col in inspect(c).get_columns(table):
                if col.get('identity'):
                    seq = c.scalar(text('SELECT pg_get_serial_sequence(:t,:c)'),{'t':table,'c':col['name']})
                    maximum = c.scalar(text(f'SELECT max("{col["name"]}") FROM "{table}"'))
                    if maximum is not None: c.execute(text('SELECT setval(CAST(:s AS regclass),:m,true)'),{'s':seq,'m':maximum})
        verify_custody(c,mapping,rows)
        c.execute(text('UPDATE import_custody.runs SET completed=true WHERE source_sha=:s'),{'s':SOURCE_SHA})
        result = report(c)
    assert sha(SOURCE.read_bytes()) == SOURCE_SHA
    return result


def verify_custody(c, mapping, rows):
    stored = c.execute(text('SELECT * FROM import_custody.records WHERE source_sha=:s'),{'s':SOURCE_SHA}).mappings().all()
    assert len(stored) == 3241
    expected = {(t['source'],canonical({k:r[k] for k in t['source_pk']})):encode(r)
                for t in mapping['tables'] for r in rows[t['source']]}
    for r in stored:
        assert r['payload'] == expected[(r['source_table'],r['source_key'])]
        assert r['payload_sha'] == sha(canonical(r['payload']).encode())
        if r['disposition']=='BUSINESS':
            assert snapshot(c,r['target_table'],r['target_key']) == r['target_snapshot'], 'Business row drift'


def report(c, replay=False):
    counts = dict(c.execute(text('SELECT disposition,count(*) FROM import_custody.records GROUP BY disposition')).all())
    groups = [dict(r) for r in c.execute(text('''SELECT source_table,target_table,disposition,count(*) AS records
        FROM import_custody.records GROUP BY 1,2,3 ORDER BY 1,3''')).mappings()]
    reasons = [dict(r) for r in c.execute(text('''SELECT reason,count(*) AS occurrences FROM import_custody.records,
        jsonb_array_elements_text(reasons) reason GROUP BY reason ORDER BY reason''')).mappings()]
    return {'source_records':3241,'business_records':counts.get('BUSINESS',0),
            'quarantined_records':counts.get('QUARANTINE',0),'failed_records':0,'duplicate_records':0,
            'idempotent_replay':replay,'source_sha':SOURCE_SHA,'policy_sha':policy_hash(),
            'by_table':groups,'reasons':reasons,'scope_metadata_rows':2}
