from pathlib import Path
root=Path(__file__).resolve().parents[2]
out=root/'.scratch/stage51/runners';out.mkdir(exist_ok=True)
(root/'.scratch/stage51/artifacts').mkdir(exist_ok=True)
for f in (root/'.scratch/stage50/runners').glob('*.mjs'):
 if 'fixed-clock' in f.name:continue
 s=f.read_text(encoding='utf8').replace('stage50','stage51').replace('18550','18551')
 s=s.replace('stage51Credentials}', 'stage51Credentials,stage51Pin,stage51FillPassword}')
 s=s.replace('ignoreHTTPSErrors:true','ignoreHTTPSErrors:false')
 s=s.replace('chromium.launch()',"chromium.launch({args:['--ignore-certificate-errors-spki-list='+stage51Pin]})")
 if f.name=='auth.mjs':
  s="import {stage51Accounts,stage51Access,stage51Pin,stage51FillPassword} from '../../../deploy/stage51/browser-support.mjs';\n"+s
  s=s.replace("JSON.parse(await fs.readFile('.scratch/stage49-local/secrets/accounts.json','utf8'))",'stage51Accounts')
  s=s.replace("JSON.parse(await fs.readFile('.scratch/stage49-local/secrets/local-access.json','utf8'))",'stage51Access')
  s=s.replace("await page.getByLabel('Password',{exact:true}).fill(credentials[user.email]);",'await stage51FillPassword(page,credentials[user.email]);')
 # Wait for asynchronous UI initialization/image decoding across the SSH link.
 # Preserve original business assertions and selectors.
 if f.name=='stock_browser.mjs':
  s=s.replace("await d.getByLabel('Contact name',{exact:true}).fill('Buyer');", "await p.waitForFunction(expected=>document.querySelector('#supplier-form input')?.value===expected,name);await d.getByLabel('Name',{exact:true}).focus();await p.waitForTimeout(300);await d.getByLabel('Contact name',{exact:true}).fill('Buyer');check('contact value entered',await d.getByLabel('Contact name',{exact:true}).inputValue()==='Buyer');check('name preserved before save',await d.getByLabel('Name',{exact:true}).inputValue()===name);")
 if f.name=='estimate_browser.mjs':
  s=s.replace('evaluate(i=>i.complete&&i.naturalWidth>0)', 'evaluate(async i=>{await i.decode();return i.complete&&i.naturalWidth>0})')
 assert 'ignoreHTTPSErrors:true' not in s
 (out/f.name).write_text(s,encoding='utf8')
print('Prepared private SSH-tunnel runners with exact certificate pin and strict request TLS.')
