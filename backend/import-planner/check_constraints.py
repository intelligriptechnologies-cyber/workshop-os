"""Evaluate CHECK expressions with SELECT only on the guarded disposable server.

No candidate row is inserted, even inside a rollback transaction.
"""
from collections import Counter
import json
import hashlib
from pathlib import Path
import re
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError
from run import guarded_engine
from tests.test_schema import catalog

manifest=json.loads(Path('/plan/manifest.json.md').read_text())
checks=json.loads(Path('/plan/target_checks.json.md').read_text())
target=json.loads(Path('/target.json').read_text())
columns={(r['table_name'],r['column_name']):r for r in target['catalog']['columns']}
results=[]
engine=guarded_engine()
with engine.connect() as c:
    c.exec_driver_sql('SET TRANSACTION READ ONLY')
    assert c.scalar(text('SHOW transaction_read_only'))=='on'
    assert c.scalar(text('SELECT version_num FROM alembic_version'))==target['head']
    assert catalog(c)==target['catalog'], 'Target catalog drift; recapture and replan'
    before=sum(c.scalar(text('SELECT count(*) FROM "'+t+'"')) for t in target['counts'] if t!='alembic_version')
    for record in manifest:
        table=record['target_table'];values=record['proposed_values']
        invalid={i.get('column') for i in record['issues'] if i['code'] not in {'UNRESOLVED_SOURCE_PARENT'}}
        names={col for t,col in columns if t==table}
        for check in checks:
            if check['table_name']!=table: continue
            needed=set(re.findall(r'\b[a-z_][a-z_0-9]*\b',check['definition'])) & names
            result={'table':record['source_table'],'key':record['source_key'],'constraint':check['conname']}
            if not needed<=values.keys() or needed & invalid:
                result['result']='UNVERIFIED_INCOMPLETE_INPUT'
            else:
                fields=[];params={}
                for n,col in enumerate(sorted(needed)):
                    typ=columns[table,col]['data_type']
                    if typ not in {'text','character varying','bigint','integer','smallint','numeric','boolean','uuid','date','timestamp with time zone'}: break
                    fields.append('CAST(:p'+str(n)+' AS '+typ+') AS "'+col+'"');params['p'+str(n)]=values[col]
                else:
                    expression=check['definition'][6:]  # strip CHECK, retain parentheses
                    sql='SELECT '+expression+' FROM (SELECT '+(', '.join(fields) or '1 AS unused')+') AS candidate'
                    try:
                        with c.begin_nested():
                            observed=c.scalar(text(sql),params)
                        result['result']='VIOLATED' if observed is False else 'PASS_SQL_CHECK' if observed is True else 'PASS_SQL_UNKNOWN_NULL'
                    except DBAPIError as error:
                        result['result']='UNVERIFIED_EXPRESSION';result['sqlstate']=getattr(error.orig,'sqlstate',None)
                    results.append(result);continue
                result['result']='UNVERIFIED_TYPE'
            results.append(result)
    after=sum(c.scalar(text('SELECT count(*) FROM "'+t+'"')) for t in target['counts'] if t!='alembic_version')
    assert before==after==0
    c.rollback()
print(json.dumps({'manifest_sha256':hashlib.sha256(Path('/plan/manifest.json.md').read_bytes()).hexdigest(),
                  'transaction_read_only':True,'business_rows_before':before,'business_rows_after':after,
                  'counts':dict(Counter(r['result'] for r in results)),'results':results},indent=2))
