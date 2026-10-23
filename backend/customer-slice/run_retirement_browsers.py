import subprocess,json,re,os
from pathlib import Path
base=Path('backend/customer-slice');out=base/'artifacts';results=json.loads((out/'retirement-browser-results.json').read_text()) if os.environ.get('PGONLY_SUITES') and (out/'retirement-browser-results.json').exists() else []
suites=['test_customer_regression.mjs','test_vehicle_browser.mjs','test_booking_browser.mjs','test_intake_browser.mjs','test_tasklist_browser.mjs','test_estimate_browser.mjs','test_approval_browser.mjs','test_stock_browser.mjs','test_stock_job_browser.mjs','test_financial_browser.mjs','test_financial_edges_browser.mjs','test_administration_browser.mjs','test_configuration_browser.mjs','test_catalog_browser.mjs','test_sales_browser.mjs','test_ownership_browser.mjs','test_roles.mjs','test_postgres_only_checklist.mjs']
suites=[s for s in suites if not os.environ.get('PGONLY_SUITES') or s in os.environ['PGONLY_SUITES'].split(',')]
for name in suites:
 s=(base/name).read_text(encoding='utf-8-sig')
 if name=='test_customer_regression.mjs':
  a=s.index('const stored=');b=s.index('db.close();',a)+len('db.close();');s=s[:a]+"check('no SQLite business snapshot',await page.evaluate(()=>!Object.keys(localStorage).some(k=>k.includes('sqlite'))));"+s[b:]
 if name=='test_vehicle_browser.mjs':
  a=s.index('const saved=');b=s.index('db.close();',a)+len('db.close();');s=s[:a]+"check('no SQLite business snapshot',await p.evaluate(()=>!Object.keys(localStorage).some(k=>k.includes('sqlite'))));"+s[b:]
 if name=='test_booking_browser.mjs':
  a=s.index(' const storage=');b=s.index("check('no browser errors'",a);s=s[:a]+" check('no SQLite booking snapshot',await r.evaluate(()=>!Object.keys(localStorage).some(k=>k.includes('sqlite'))));"+s[b:]
 if name=='test_estimate_browser.mjs':
  s=s.replace("!sessionStorage.getItem('workshopos.documentSnapshots.v1')","!Object.keys(sessionStorage).includes('workshopos.documentSnapshots.v1')")
 if name=='test_approval_browser.mjs':
  subprocess.run(['docker','compose','--env-file','backend/customer-slice/.local.env','-f','backend/customer-slice/compose.yaml','exec','-T','api-test','python','/slice/financial_test_support.py'],check=True,capture_output=True)
 path=out/('retirement-run-'+name);path.write_text(s,encoding='utf8');env={**os.environ,'PGONLY_SUITE':name.removesuffix('.mjs')}
 try:
  p=subprocess.run(['node','--import','./backend/customer-slice/retirement_browser_guard.mjs',str(path)],capture_output=True,text=True,env=env,timeout=360)
 except subprocess.TimeoutExpired as e:
  p=subprocess.CompletedProcess(e.cmd,124,(e.stdout or b'').decode() if isinstance(e.stdout,bytes) else (e.stdout or ''),'Browser suite timed out')
 (out/('retirement-'+name+'.txt')).write_text(p.stdout+p.stderr,encoding='utf8');old=next((r for r in results if r['suite']==name),None);results=[r for r in results if r['suite']!=name];results.append(dict(suite=name,exit=p.returncode,previous_exit=old['exit'] if old else None));(out/'retirement-browser-results.json').write_text(json.dumps(results,indent=2));print(name,p.returncode,flush=True)
