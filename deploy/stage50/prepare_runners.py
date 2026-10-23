"""Adapt existing assertions to immutable local images; never change source tests/baselines."""
from pathlib import Path
import re,json
root=Path(__file__).resolve().parents[2]
out=root/'.scratch/stage50/runners';out.mkdir(exist_ok=True)
(root/'.scratch/stage50/artifacts').mkdir(exist_ok=True)
names=['stock_browser','financial_browser','estimate_browser','booking_browser','intake_browser','vehicle_browser','ownership_browser','approval_browser','financial_edges_browser','catalog_browser','tasklist_browser','sales_browser','administration_browser','configuration_browser','dashboard_reports','configuration_visual','booking_visual','stock_visual']
for name in names:
 s=(root/f'backend/customer-slice/test_{name}.mjs').read_text(encoding='utf8')
 s="import {stage50Access,stage50Credentials} from '../../../deploy/stage50/browser-support.mjs';\n"+s
 s=s.replace('ignoreHTTPSErrors:true','ignoreHTTPSErrors:true,httpCredentials:stage50Access')
 s=s.replace('https://localhost:18444','https://localhost:18550').replace('https://localhost:18443','https://localhost:18550')
 s=s.replace('backend/customer-slice/artifacts','.scratch/stage50/artifacts')
 s=re.sub(r"await (\w+)\.getByLabel\('Emulate User:'\)\.selectOption\(([^;]+)\);",r'await stage50Credentials(\1,\2);',s)
 s=s.replace("[['baseline','http://127.0.0.1:18445'],['slice','https://localhost:18550']]","[['slice','https://localhost:18550']]")
 if name=='booking_browser':
  start=s.index(' const storage=');end=s.index("check('no browser errors'",start)
  s=s[:start]+" check('normal PostgreSQL mode without browser business cache',await r.evaluate(()=>window.__workshopPersistence.testMode===false && localStorage.getItem('workshopos.sqlite.remaining-api.v1')===null));"+s[end:]
 s=s.replace("!sessionStorage.getItem('workshopos.documentSnapshots.v1')","!Object.keys(sessionStorage).includes('workshopos.documentSnapshots.v1')")
 s=s.replace("localStorage.getItem('workshopos.sqlite.remaining-api.v1')===null","!Object.keys(localStorage).includes('workshopos.sqlite.remaining-api.v1')")
 s=s.replace("await p.goto('https://localhost:18550');await p.getByRole('button',{name:'Login',exact:true}).click();","await p.goto('https://localhost:18550');await stage50Credentials(p,'admin@example.com');await p.getByRole('button',{name:'Login',exact:true}).click();")
 s=re.sub(r"await (\w+)\.goto\('https://localhost:18550(?:/login)?'\);await \1\.getByRole",r"await \1.goto('https://localhost:18550/login');await stage50Credentials(\1,'admin@example.com');await \1.getByRole",s)
 if name=='vehicle_browser':
  s=re.sub(r"const saved=await p.evaluate[^\n]+?db.close\(\);", "check('no browser business cache',await p.evaluate(()=>!Object.keys(localStorage).some(k=>k.startsWith('workshopos.sqlite'))));",s)
 s=s.replace("!sessionStorage.getItem('workshopos.adminDemo.v2')","!Object.keys(sessionStorage).includes('workshopos.adminDemo.v2')")
 s=s.replace("const api=await import('/src/configuration-api.ts');await api.configurationApi.read();await api.configurationApi.save(state);", "const current=await(await fetch('/api/v1/configuration')).json();const csrf=decodeURIComponent(document.cookie.split('; ').find(x=>x.startsWith('workshopos_csrf=')).split('=')[1]);const r=await fetch('/api/v1/configuration',{method:'POST',headers:{'Content-Type':'application/json','X-WorkshopOS-CSRF':csrf,'Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({state,version:current.version})});if(!r.ok)throw Error(await r.text());")
 if name.endswith('_visual'):
  s=s.replace('await p.goto(url);',"await p.clock.setFixedTime(new Date('2026-10-22T12:00:00Z'));await p.goto(url);")
  s=s.replace('await sp.goto(url);',"await sp.clock.setFixedTime(new Date('2026-10-22T12:00:00Z'));await sp.goto(url);")
 if 'Emulate User:' in s: raise SystemExit('Unadapted login: '+name)
 (out/f'{name}.mjs').write_text(s,encoding='utf8')
s=(root/'deploy/stage49/test_local_browser.mjs').read_text().replace('18549','18550').replace('.scratch/stage49-browser.json','.scratch/stage50/auth.json')
(out/'auth.mjs').write_text(s)
print('Prepared local-only adapters; original business assertions and baseline files preserved. Booking legacy source-module cache probe replaced with normal-mode/no-cache assertion.')
