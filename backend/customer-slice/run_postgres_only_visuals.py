from pathlib import Path
import subprocess,json
base=Path('backend/customer-slice');out=base/'artifacts';results=[]
for name in ['test_configuration_visual.mjs','test_financial_visual.mjs','test_booking_visual.mjs','test_execution_visual.mjs','test_users_visual.mjs','test_visual.mjs','test_catalog_visual.mjs','test_sales_visual.mjs']:
 if not (base/name).exists():
  results.append({'suite':name,'exit':'missing'});continue
 s=(base/name).read_text().replace('https://localhost:18443','https://localhost:18444').replace("backend/customer-slice/artifacts","backend/customer-slice/artifacts/pgonly-visual")
 folder=out/'pgonly-visual';folder.mkdir(exist_ok=True)
 path=out/('pgonly-run-'+name);path.write_text(s)
 try:
  p=subprocess.run(['node','--import','./backend/customer-slice/postgres_only_visual_fixture.mjs',str(path)],capture_output=True,text=True,timeout=180)
  (out/('pgonly-'+name+'.txt')).write_text(p.stdout+p.stderr);results.append({'suite':name,'exit':p.returncode})
 except subprocess.TimeoutExpired:results.append({'suite':name,'exit':124})
 print(results[-1],flush=True);(out/'pgonly-visual-runs.json').write_text(json.dumps(results,indent=2))
