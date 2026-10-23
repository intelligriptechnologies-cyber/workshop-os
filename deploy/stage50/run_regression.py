"""Only generated local Stage50 runners; sequential to preserve fixture ordering."""
import subprocess,json,time
from pathlib import Path
root=Path(__file__).resolve().parents[2];out=root/'.scratch/stage50'
expected=json.loads((root/'.scratch/stage49-package.json').read_text())['images']
endpoint=json.loads(subprocess.check_output(['docker','context','inspect','--format','{{json .Endpoints.docker.Host}}'],text=True))
assert endpoint.startswith('npipe:'),'Local Windows Docker Desktop required'
for service,tag in [('api','workshopos-stage49-api:local'),('frontend','workshopos-stage49-frontend:local')]:
 info=json.loads(subprocess.check_output(['docker','inspect','workshopos-stage50-local-'+service+'-1'],text=True))[0]
 assert info['Image']==expected[tag] and info['State']['Health']['Status']=='healthy'
# Gateway must be started by the separately reviewed local-only Compose invocation.
assert subprocess.check_output(['docker','inspect','--format','{{.State.Running}}','workshopos-stage50-local-local-https-1'],text=True).strip()=='true'
results=[]
names=['configuration_visual','booking_visual','stock_visual','auth','stock_browser','financial_browser','estimate_browser','booking_browser','intake_browser','vehicle_browser','ownership_browser','approval_browser','financial_edges_browser','catalog_browser','tasklist_browser','sales_browser','administration_browser','configuration_browser','dashboard_reports']
for name in names:
 start=time.monotonic()
 with (out/(name+'.log')).open('w',encoding='utf8') as log:
  try: code=subprocess.run(['node',str(out/'runners'/f'{name}.mjs')],cwd=root,stdout=log,stderr=subprocess.STDOUT,timeout=180).returncode
  except subprocess.TimeoutExpired: code=124
 results.append({'suite':name,'exit_code':code,'seconds':round(time.monotonic()-start,1)})
 (out/'regression.json').write_text(json.dumps(results,indent=2))
 print(name,code,flush=True)
 time.sleep(12)
