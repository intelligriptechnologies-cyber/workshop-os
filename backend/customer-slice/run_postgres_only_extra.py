from pathlib import Path
import subprocess,os,json
base=Path('backend/customer-slice');out=base/'artifacts';results=[]
for name in ['test_execution_browser.mjs','test_dashboard_reports.mjs']:
 s=(base/name).read_text().replace('execution-browser-fixture.json','pgonly-execution-fixture.json').replace('https://localhost:18443','https://localhost:18444')
 for key in ['workshopos.adminDemo.v2','workshopos.documentSnapshots.v1']:
  s=s.replace("!sessionStorage.getItem('"+key+"')","!Object.keys(sessionStorage).includes('"+key+"')")
 pth=out/('pgonly-run-'+name);pth.write_text(s)
 p=subprocess.run(['node','--import','./backend/customer-slice/postgres_only_browser_guard.mjs',str(pth)],env={**os.environ,'PGONLY_SUITE':name.removesuffix('.mjs')},capture_output=True,text=True,timeout=180)
 (out/('pgonly-'+name+'.txt')).write_text(p.stdout+p.stderr);results.append(dict(suite=name,exit=p.returncode));print(name,p.returncode,flush=True)
 (out/'pgonly-extra-browser-results.json').write_text(json.dumps(results,indent=2))
