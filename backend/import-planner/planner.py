"""Offline, read-only SQLite import planning. No PostgreSQL driver or write path."""
import argparse
from collections import Counter, defaultdict
from datetime import date, datetime
from decimal import Decimal
import hashlib
import json
from pathlib import Path
import re
import sqlite3

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/backend-migration'
SOURCE_SHA = '04c64fc97e977c83d083e1f2c8b195ab5f8a7e8a167ba5b18dbf86a42db945ae'
STATUS_PROJECTIONS = {
    'bookings': {'Booked':'BOOKED'},
    'estimates': {'Draft':'DRAFT','Approved':'APPROVED'},
    'tasks': {'Pending':'PENDING','Started':'IN_PROGRESS','Completed':'COMPLETED'},
    'purchase_orders': {'Closed':'CLOSED'},
}


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(name):
    return json.loads((DOCS / name).read_text(encoding='utf-8-sig'))


def date_kind(value):
    if value is None: return 'NULL'
    if value == '': return 'EMPTY'
    if not isinstance(value, str): return 'INVALID'
    try:
        if re.fullmatch(r'\d{4}-\d{2}-\d{2}', value):
            date.fromisoformat(value)
            return 'DATE_ONLY'
        dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return 'OFFSET_INSTANT' if dt.tzinfo else 'NAIVE_TIMESTAMP'
    except ValueError:
        return 'INVALID'


def convert(value, typ):
    if value is None: return None, None
    if typ in {'bigint', 'integer', 'smallint'}:
        if isinstance(value, int) and not isinstance(value, bool):
            return value, None if abs(value) <= 9007199254740991 else 'UNSAFE_UI_INTEGER'
        return value, 'INTEGER_TYPE'
    if typ == 'numeric':
        try:
            v = Decimal(str(value))
            return str(v), None if v.is_finite() else 'NONFINITE_NUMERIC'
        except Exception: return value, 'NUMERIC_TYPE'
    if typ == 'boolean':
        return (bool(value), None) if value in (0, 1) else (value, 'BOOLEAN_MAPPING')
    if typ == 'uuid':
        return None, 'UUID_IDENTITY_MAPPING_REQUIRED'
    if typ in {'timestamp with time zone','timestamptz'}:
        return (value, None) if date_kind(value)=='OFFSET_INSTANT' else (value,'TIMESTAMP_INTERPRETATION_REQUIRED')
    if typ == 'date':
        return (value,None) if date_kind(value)=='DATE_ONLY' else (value,'DATE_MAPPING_REQUIRED')
    if typ in {'text','character varying'}:
        return (value,None) if isinstance(value,str) else (value,'TEXT_TYPE')
    return value, 'TYPE_VALIDATION_UNVERIFIED'


def exact_paise(value):
    """Unit conversion from stored value only; never allocate/recalculate/round."""
    converted=Decimal(str(value))*100
    return int(converted) if converted.is_finite() and converted==converted.to_integral_value() else None


def financial(rows):
    reports=[]
    for inv in rows['invoices']:
        lines=[r for r in rows['invoice_items'] if r['invoice_id']==inv['id'] and not r['archived_at']]
        calculated=sum((Decimal(str(r['qty']))*Decimal(str(r['rate'])) for r in lines), Decimal(0))
        stored=Decimal(str(inv['subtotal']))
        payments=[r for r in rows['payments'] if r['invoice_id']==inv['id'] and not r['voided_at']]
        paid=sum((Decimal(str(r['amount'])) for r in payments),Decimal(0))
        reports.append({'id':inv['id'],'invoice_no':inv['invoice_no'],'stored_subtotal':str(stored),
                        'line_subtotal':str(calculated),'difference_stored_minus_lines':str(stored-calculated),
                        'stored_discount':inv['discount'],'stored_tax':inv['gst_amount'],'stored_total':inv['total'],
                        'stored_status':inv['status'],'payment_ids':[r['id'] for r in payments],
                        'stored_payments_sum':str(paid),'stored_total_minus_payments':str(Decimal(str(inv['total']))-paid),
                        'action':'PRESERVE; no financial correction or status change'})
    return reports


def plan(source):
    source=source.resolve()
    if digest(source)!=SOURCE_SHA: raise ValueError('Source hash differs from the pinned candidate; no planning performed')
    for suffix in ('-wal','-journal'):
        if Path(str(source)+suffix).exists(): raise ValueError('Source sidecar present; immutable snapshot not established')
    mapping=load('stage3-schema-mapping.json.md')
    target=load('stage4c1-target-readonly.json.md')
    if target['head']!='20261021_0035' or not target['transaction_read_only']:
        raise ValueError('Unsupported target evidence')
    cat=target['catalog']
    target_columns=defaultdict(dict)
    for c in cat['columns']: target_columns[c['table_name']][c['column_name']]=c
    db=sqlite3.connect(source.as_uri()+'?mode=ro&immutable=1',uri=True)
    db.row_factory=sqlite3.Row
    db.execute('PRAGMA query_only=ON')
    try:
        tables=[r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")]
        if set(tables)!={t['source'] for t in mapping['tables']}: raise ValueError('Source table inventory changed')
        rows={}; schema={}
        for table in tables:
            schema[table]=[dict(r) for r in db.execute(f'PRAGMA table_info("{table}")')]
            pk=[c['name'] for c in sorted(schema[table],key=lambda c:c['pk']) if c['pk']]
            order=','.join('"'+c+'"' for c in pk) or 'rowid'
            rows[table]=[dict(r) for r in db.execute(f'SELECT * FROM "{table}" ORDER BY {order}')]
        assert sum(map(len,rows.values()))==3241 and len(rows)==60
        assert db.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
    finally: db.close()
    manifest=[]; refs=[]; states=[]; dates=[]; duplicates=[]
    keys={t:{r.get('id') for r in rs} for t,rs in rows.items()}
    relationships=defaultdict(list)
    for rel in mapping['relationships']: relationships[rel['table']].append(rel)
    sentinel_index={(x['table'],x['record_id'],x['column']):x for x in load('stage4a-zero-sentinels.json.md')}
    sentinel_report=[]; compat=[]
    by_target={t['target']:t for t in mapping['tables']}
    for pending in load('stage4b-schema-contract.json.md')['deferred']:
        table=by_target[pending['table']]
        col=next(c for c in table['columns'] if c['target']==pending['column'])
        values=[r[col['source']] for r in rows[table['source']]]
        compat.append({**pending,'source_table':table['source'],'source_column':col['source'],'type':col['type'],
                       'required':col['nullable']=='NO','design_default':col['default'],
                       'source_rows':len(values),'nulls':values.count(None),
                       'mapping':'EXACT_SOURCE_COPY' if col['target']!='ui_status' else 'PRESERVE_SOURCE_STATUS_SEPARATELY',
                       'deterministic':'OBSERVED' if values else 'CONTRACT_ONLY_EMPTY_TABLE',
                       'schema_change':'ADD explicit compatibility column; imported values supplied from source; native writer accommodation required',
                       'approval':'No value invention needed; approve native nullable/conditional-required policy before migration'})
    for table in mapping['tables']:
        s,t=table['source'],table['target']; seen_keys=set(); seen_content={}
        for col in schema[s]:
            name=col['name']
            if name in {'status','stage','main_status','sub_status','qc_status','direction','mode'} or name.endswith('_status'):
                counts=Counter(canonical(r[name]) for r in rows[s])
                target_col=next((c['target'] for c in table['columns'] if c['source']==name),None)
                states.append({'table':s,'column':name,'target_table':t,'target_column':target_col,'values':dict(counts),
                               'native_projection':STATUS_PROJECTIONS.get(s,{}) if name=='status' else {},
                               'rule':'Exact named representation mapping only; original status remains in source payload. Invoice statuses are never translated or recalculated.'})
            if s=='job_cards' and name=='promised_at':
                dates.append({'table':s,'column':name,'classification':{'RELATIVE_PROMISE_TEXT':len(rows[s])},'rule':'Preserve free text; never resolve Tomorrow relative to import time. A separate text projection is required.'})
            elif name=='date' or name.endswith(('_at','_date','_until')) or name=='follow_up_due':
                dates.append({'table':s,'column':name,'classification':dict(Counter(date_kind(r[name]) for r in rows[s]))})
        for row in rows[s]:
            key={k:row[k] for k in table['source_pk']}; key_text=canonical(key)
            if key_text in seen_keys: duplicates.append({'kind':'DUPLICATE_SOURCE_KEY','table':s,'key':key})
            seen_keys.add(key_text)
            raw={k:v for k,v in row.items() if k!='password'}
            if 'password' in row: raw['password']='[CREDENTIAL EXCLUDED; original sealed source retained]'
            content=canonical({k:v for k,v in raw.items() if k not in key})
            if content in seen_content: duplicates.append({'kind':'REPEATED_NON_KEY_PAYLOAD_REVIEW_ONLY','table':s,'keys':[seen_content[content],key]})
            seen_content[content]=key
            projected={}; issues=[]
            for c in table['columns']:
                if c['action']=='CREDENTIAL EXCEPTION': continue
                value=row[c['source']]; tc=c['target']; spec=target_columns[t].get(tc)
                if spec is None:
                    issues.append({'code':'TARGET_COLUMN_MISSING','column':tc,'source_column':c['source']})
                    continue
                result,error=convert(value,spec['data_type'])
                projected[tc]=result
                if error: issues.append({'code':error,'column':tc,'source_value':value})
                if result is None and spec['is_nullable']=='NO': issues.append({'code':'REQUIRED_NULL','column':tc})
            if s in STATUS_PROJECTIONS:
                value=STATUS_PROJECTIONS[s].get(row['status'])
                if value is None: issues.append({'code':'STATUS_PROJECTION_UNRESOLVED','column':'status'})
                else: projected['status']=value
            money_fields={'invoices':{'subtotal':'subtotal_paise','discount':'discount_paise','gst_amount':'tax_paise','total':'total_paise'},
                          'payments':{'amount':'amount_paise'}}.get(s,{})
            for original,destination in money_fields.items():
                value=exact_paise(row[original]) if row[original] is not None else None
                if value is None: issues.append({'code':'NONINTEGRAL_PAISE_PRESERVE_ORIGINAL','column':destination})
                else: projected[destination]=value
            if s=='payments' and row['mode']=='UPI': projected['method']='UPI'
            for rel in relationships[s]:
                value=row[rel['field']]
                if value is None: continue
                status='RESOLVED_SOURCE_PARENT' if value in keys[rel['parent']] else 'UNRESOLVED_SOURCE_PARENT'
                refs.append({'table':s,'key':key,'column':rel['field'],'value':value,'parent':rel['parent'],'status':status})
                if status.startswith('UNRESOLVED'):
                    issues.append({'code':status,'column':rel['field'],'value':value})
                    evidence=sentinel_index.get((s,row.get('id'),rel['field']))
                    if evidence:
                        sentinel_report.append({k:v for k,v in evidence.items() if k!='source_record'} | {'source_confirmed':value==0,'disposition':'OPTIONAL_NON_JOB_LINK_PENDING_APPROVAL' if s!='checklist_items' else 'UNATTRIBUTED_ACTOR_REVIEW_REQUIRED'})
            for name,c in target_columns[t].items():
                if name in {'tenant_id','branch_id'}: continue  # Global scope gate, not a per-record invented UUID.
                if name not in projected and c['is_nullable']=='NO' and c['column_default'] is None and c['is_identity']=='NO':
                    issues.append({'code':'NATIVE_REQUIRED_VALUE_MISSING','column':name})
            record={'source_table':s,'source_key':key,'source_payload':raw,
                    'redacted_payload_sha256':hashlib.sha256(canonical(raw).encode()).hexdigest(),
                    'sqlite_real_hex':{k:v.hex() for k,v in row.items() if isinstance(v,float)},
                    'target_table':t,'proposed_values':projected,'issues':issues,
                    'disposition':'REVIEW_REQUIRED' if issues else 'DETERMINISTIC_CONTENT_CANDIDATE'}
            manifest.append(record)
    # CHECKs, FK tuples and unique predicates are retained in full for final engine rehearsal.
    # Never label arbitrary PostgreSQL expressions evaluated by this offline planner.
    check_inventory=[r for r in cat['constraints'] if r['contype']=='c']
    for record in manifest:
        for check in check_inventory:
            if check['table_name']!=record['target_table']: continue
            expression=check['definition']
            # A complete native finite-status enum can be statically checked without SQL execution.
            match=re.fullmatch(r"CHECK \(\((\w+) = ANY \(ARRAY\[(.*?)\]\)\)\)",expression)
            if match and match[1] in record['proposed_values']:
                value=record['proposed_values'][match[1]]
                allowed=re.findall(r"'((?:[^']|'')*)'::text",match[2])
                if value is not None and allowed and value not in allowed:
                    record['issues'].append({'code':'NATIVE_STATUS_CHECK_CONFLICT','column':match[1],'value':value,'allowed':allowed})
        if record['issues']: record['disposition']='REVIEW_REQUIRED'
    fin=financial(rows)
    target_unique=[]
    for constraint in cat['constraints']:
        if constraint['contype'] not in {'u','p'}: continue
        match=re.search(r'\(([^()]*)\)',constraint['definition'])
        if not match: continue
        cols=[v.strip().strip('"') for v in match[1].split(',') if v.strip() not in {'tenant_id','branch_id'}]
        seen={};checked=0;skipped=0
        for record in manifest:
            if record['target_table']!=constraint['table_name']:continue
            values=record['proposed_values']
            if not cols or any(k not in values for k in cols):skipped+=1;continue
            vals=[values[k] for k in cols]
            if any(v is None for v in vals) and 'NULLS NOT DISTINCT' not in constraint['definition']:skipped+=1;continue
            checked+=1;key=canonical(vals)
            if key in seen:
                duplicates.append({'kind':'TARGET_UNIQUE_CONFLICT_SINGLE_SCOPE','table':constraint['table_name'],'constraint':constraint['conname'],'keys':[seen[key],record['source_key']]})
                record['issues'].append({'code':'TARGET_UNIQUE_CONFLICT_SINGLE_SCOPE','constraint':constraint['conname']})
                record['disposition']='REVIEW_REQUIRED'
            seen[key]=record['source_key']
        target_unique.append({'table':constraint['table_name'],'constraint':constraint['conname'],'checked':checked,'skipped_incomplete_or_null':skipped,'scope_assumption':'All source records share one not-yet-approved tenant/branch; partial/expression unique indexes remain UNVERIFIED'})
    assert len(sentinel_report)==61 and sum(r['difference_stored_minus_lines']!='0.00' and Decimal(r['difference_stored_minus_lines'])!=0 for r in fin)==51
    counts=Counter(r['disposition'] for r in manifest)
    summary={'planner_version':'4c1-1','policy_sha256':digest(Path(__file__)),
             'input_evidence_hashes':{n:digest(DOCS/n) for n in ['stage3-schema-mapping.json.md','stage4b-schema-contract.json.md','stage4a-zero-sentinels.json.md','stage4c1-target-readonly.json.md']},
             'source_sha256':SOURCE_SHA,'source_tables':60,'source_records':len(manifest),'row_dispositions':dict(counts),
             'ready_to_import_records':0,'unresolved_reference_occurrences':sum(r['status'].startswith('UNRESOLVED') for r in refs),
             'sentinel_distinct_records':len({(r['table'],r['record_id']) for r in sentinel_report}),
             'invoice_discrepancies':sum(Decimal(r['difference_stored_minus_lines'])!=0 for r in fin),
             'source_counts':{k:len(v) for k,v in sorted(rows.items())},
             'expected_direct_target_counts':{t['target']:len(rows[t['source']]) for t in mapping['tables']},
             'additional_expected_provenance_rows':len(manifest),
             'duplicate_source_keys':sum(r['kind']=='DUPLICATE_SOURCE_KEY' for r in duplicates),
             'target_unique_conflicts_single_scope':sum(r['kind']=='TARGET_UNIQUE_CONFLICT_SINGLE_SCOPE' for r in duplicates),
             'repeated_non_key_payloads':sum(r['kind']=='REPEATED_NON_KEY_PAYLOAD_REVIEW_ONLY' for r in duplicates),
             'target_business_rows_at_probe':sum(n for t,n in target['counts'].items() if t!='alembic_version'),
             'target_schema_head':target['head'],'readiness':'BLOCKED',
             'global_gates':['Source adoption and tenant/branch identity approval','UUID identity/membership provisioning','26 compatibility columns absent','Native required actor/artifact/financial mappings','All remaining PostgreSQL CHECK/unique/FK semantics require complete projected rows and engine validation','Timestamp and status decisions','Financial preservation projection','Browser-only custody remains unknown'],
             'issue_counts':dict(Counter(i['code'] for r in manifest for i in r['issues'])),
             'validation_limit':'Static source/reference/type/nullable/status checks against read-only target catalog; no INSERT, no disabled constraints, and no full engine row validation. Companion checker evaluates complete CHECK inputs with SELECT only.'}
    if digest(source)!=SOURCE_SHA: raise RuntimeError('Source changed during planning')
    return {'summary':summary,'manifest':manifest,'compatibility':compat,'references':refs,'sentinels':sentinel_report,
            'financial':fin,'statuses':states,'dates':dates,'duplicates':duplicates,'target_checks':check_inventory,'target_unique_checks':target_unique}


def main():
    parser=argparse.ArgumentParser(description='Dry-run only; no apply/import option exists')
    parser.add_argument('--source',type=Path,default=ROOT/'public/workshopos-demo.sqlite')
    parser.add_argument('--output',type=Path,default=DOCS/'stage4c1-dry-run')
    args=parser.parse_args()
    output=args.output.resolve()
    if not output.is_relative_to(DOCS.resolve()): raise ValueError('Reports must remain under docs/backend-migration')
    result=plan(args.source)
    output.mkdir(parents=True,exist_ok=True)
    for name,value in result.items():
        (output/(name+'.json.md')).write_text(json.dumps(value,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps(result['summary'],indent=2))


if __name__=='__main__': main()
