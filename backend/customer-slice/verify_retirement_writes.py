import json,subprocess
from pathlib import Path
from datetime import datetime,timezone
out=Path('backend/customer-slice/artifacts')
def q(sql):return subprocess.run(['docker','exec','-i','workshopos-customer-slice-slice-test-1','psql','-U','slice_owner','-d','slice_test','-At'],input=sql,capture_output=True,text=True,check=True).stdout.strip()
f=json.loads((out/'financial-browser-tests.json').read_text());e=json.loads((out/'estimate-browser-tests.json').read_text());fid=int(f['invoiceId']);jid=int(f['job']['id']);mid=int(e['media_id'])
assert q(f'SELECT job_card_id FROM invoices WHERE id={fid};')==str(jid)
assert int(q(f'SELECT count(*) FROM payments WHERE invoice_id={fid};'))>0
assert q(f'SELECT job_card_id FROM job_media WHERE id={mid};')==str(e['job']['id'])
assert q(f'SELECT (archived_at IS NOT NULL)::text FROM job_media WHERE id={mid};')=='true'
start=datetime.fromtimestamp(Path('.scratch/stage48-checkpoint/test.dump').stat().st_mtime,timezone.utc).isoformat()
audit=q("SELECT entity,count(*) FROM operational_changes WHERE at>='"+start+"' GROUP BY entity ORDER BY entity;")
customers=q("SELECT count(*) FROM customer_changes WHERE at>='"+start+"';")
assert int(customers)>0 and audit
result={'since_utc':start,'customer_audit_writes':int(customers),'operational_audit_counts':dict((s.split('|')[0],int(s.split('|')[1])) for s in audit.splitlines()),'strict_browser_invoice_job_link':{'invoice':fid,'job':jid},'strict_browser_payment_rows_persisted':True,'strict_browser_media_job_link_and_archive':{'media':mid,'job':e['job']['id']},'migration_head':q('SELECT version_num FROM alembic_version;')}
(out/'retirement-database-evidence.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
