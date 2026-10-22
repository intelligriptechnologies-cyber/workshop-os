"""Read-only baseline dependency analysis; emits no source payloads or credentials."""
import json
import sqlite3
from collections import defaultdict, Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOC = ROOT / 'docs/backend-migration'

def analyze():
    mapping=json.loads((DOC/'stage3-schema-mapping.json.md').read_text())
    ledger=json.loads((DOC/'stage4c-rehearsal-record-ledger.json.md').read_text())
    records={(r['source_table'],r['source_key']):r for r in ledger}
    parents=defaultdict(set); children=defaultdict(set); edges=[]
    key=lambda v: json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False)
    with sqlite3.connect((ROOT/'public/workshopos-demo.sqlite').as_uri()+'?mode=ro&immutable=1',uri=True) as db:
        db.row_factory=sqlite3.Row
        tables={t['source']:t for t in mapping['tables']}
        for rel in mapping['relationships']:
            table=tables[rel['table']]
            for row in db.execute('SELECT * FROM "'+rel['table']+'"'):
                value=row[rel['field']]
                if value is None: continue
                child=(rel['table'],key({k:row[k] for k in table['source_pk']}))
                parent=(rel['parent'],key({'id':value}))
                category='A'
                if rel['parent']=='users': category='B' if value!=0 else 'C'
                if value==0 and rel['table'] in ('stock_ledger','material_movements'): category='B'
                if rel['table']=='service_department_managers': category='C'
                edges.append({'child':child,'parent':parent,'field':rel['field'],'class':category,
                              'source_parent_exists':parent in records})
                if parent in records:
                    parents[child].add(parent); children[parent].add(child)
    roots=defaultdict(set)
    for node,row in records.items():
        for reason in row['reasons']:
            if not reason.startswith('POSTGRES_23503:'): roots[reason].add(node)
    groups=[]
    for reason,direct in roots.items():
        affected=set(direct); todo=list(direct)
        while todo:
            for child in children[todo.pop()]:
                if child not in affected: affected.add(child); todo.append(child)
        affected={n for n in affected if records[n]['disposition']=='QUARANTINE'}
        groups.append({'reason':reason,'direct_records':len(direct),'downstream_including_direct':len(affected),
                       'affected_tables':dict(Counter(n[0] for n in affected))})
    return {'baseline_quarantined':sum(r['disposition']=='QUARANTINE' for r in ledger),
            'classification':{'A':'essential business parent; retain enforced FK',
                              'B':'historical actor or documented non-job sentinel; preserve separately',
                              'C':'ambiguous actor-zero or authentication membership; retain quarantine'},
            'root_groups':sorted(groups,key=lambda x:-x['downstream_including_direct']),
            'edges':edges,'note':'Overlapping transitive impacts must not be summed; edges use actual source IDs.'}

if __name__=='__main__':
    result=analyze()
    (DOC/'stage4c2-dependencies.json.md').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result['root_groups'][:8],indent=2))
