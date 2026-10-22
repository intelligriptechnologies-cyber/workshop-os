"""Read-only fixture inventory, full row preservation, and restore reconciliation."""
import sqlite3, pathlib, hashlib, json, base64
root = pathlib.Path('data-migration')
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def encode(x):
    return {'base64':base64.b64encode(x).decode()} if isinstance(x,bytes) else x
def inventory(path):
    db=sqlite3.connect(path.resolve().as_uri()+'?mode=ro&immutable=1',uri=True)
    db.row_factory=sqlite3.Row
    result={'file':path.name,'sha256':digest(path),'integrity':db.execute('pragma integrity_check').fetchall()[0][0], 'foreign_key_violations':[list(r) for r in db.execute('pragma foreign_key_check')], 'tables':{}}
    records={}
    for table,sql in db.execute("select name,sql from sqlite_master where type='table' order by name"):
        q='"'+table.replace('"','""')+'"'
        rows=[{k:encode(r[k]) for k in r.keys()} for r in db.execute('select * from '+q)]
        columns=[dict(r) for r in db.execute('pragma table_info('+q+')')]
        keys=[dict(r) for r in db.execute('pragma foreign_key_list('+q+')')]
        records[table]=rows
        result['tables'][table]={'count':len(rows),'columns':columns,'foreign_keys':keys,'sql':sql,'rows_sha256':hashlib.sha256(json.dumps(rows,sort_keys=True,ensure_ascii=False).encode()).hexdigest()}
    db.close()
    return result,records
all_data={}
for name in ['shipped','runtime-initial']:
    info,rows=inventory(root/'demo-data'/f'{name}.sqlite')
    all_data[name]=(info,rows)
    (root/'demo-data'/f'{name}-inventory.json').write_text(json.dumps(info,indent=2),encoding='utf8')
    (root/'demo-data'/f'{name}-records.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False),encoding='utf8')
a,ar=all_data['shipped'];b,br=all_data['runtime-initial']
diff={t:{'shipped':a['tables'].get(t,{}).get('count',0),'runtime':b['tables'].get(t,{}).get('count',0),'rows_equal':ar.get(t)==br.get(t)} for t in sorted(set(ar)|set(br))}
(root/'demo-data'/'shipped-runtime-diff.json').write_text(json.dumps(diff,indent=2),encoding='utf8')
# Backup/restore into an in-memory database; compare every row and declared FK, not merely counts.
restored=sqlite3.connect(':memory:')
source=sqlite3.connect((root/'demo-data'/'runtime-initial.sqlite').resolve().as_uri()+'?mode=ro&immutable=1',uri=True)
source.backup(restored)
checks={}
for t,rows in br.items():
    cur=restored.execute('select * from "'+t.replace('"','""')+'"')
    cols=[x[0] for x in cur.description]
    checks[t]=[{k:encode(v) for k,v in zip(cols,r)} for r in cur]==rows
verification={'restore':'SQLite backup to independent in-memory database','all_rows_equal':all(checks.values()),'tables':checks,'integrity':restored.execute('pragma integrity_check').fetchone()[0],'declared_fk_violations':restored.execute('pragma foreign_key_check').fetchall(),'original_shipped_hash_equal':digest(pathlib.Path('public/workshopos-demo.sqlite'))==a['sha256']}
(root/'evidence'/'restore-verification.json').write_text(json.dumps(verification,indent=2),encoding='utf8')
print(json.dumps({'tables':len(checks),'restored':verification['all_rows_equal'],'integrity':verification['integrity'],'fk_violations':len(verification['declared_fk_violations']),'changed_tables':[k for k,v in diff.items() if not v['rows_equal']]}))
