import {chromium} from 'playwright';import {execFileSync} from 'node:child_process';import fs from 'node:fs/promises';import {createHash} from 'node:crypto';
const b=await chromium.launch();const c=await b.newContext({ignoreHTTPSErrors:true});const p=await c.newPage();
const checks=[];const check=(name,ok)=>{if(!ok)throw Error(name);checks.push(name)};
try{
 await p.goto('https://localhost:18444/login');await p.getByLabel('Emulate User:').selectOption('admin@example.com');await p.getByRole('button',{name:'Login',exact:true}).click();await p.locator('.role-nav').waitFor();
 const projection=await(await c.request.get('https://localhost:18444/api/v1/operations/projection')).json();const photo=projection.photos.find(x=>x.availability==='READY'&&!x.archived_at);if(!photo)throw Error('Requires an existing disposable uploaded test image');
 const before=await(await c.request.get('https://localhost:18444'+photo.src)).body();const snaps=await(await c.request.get('https://localhost:18444/api/v1/documents/snapshots')).json();
 execFileSync('docker',['restart','workshopos-customer-slice-api-test-1']);
 let ready=false;
 for(let i=0;i<15;i++){try{const r=await c.request.get('https://localhost:18444/api/v1/session');if(r.status()===200){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,500))}
 check('persistent session survives API process restart',ready);
 const after=await(await c.request.get('https://localhost:18444'+photo.src)).body();check('durable uploaded bytes survive restart',before.equals(after));
 check('frozen snapshots survive restart',JSON.stringify(await(await c.request.get('https://localhost:18444/api/v1/documents/snapshots')).json())===JSON.stringify(snaps));
 await p.reload();await p.locator('.role-nav').waitFor();check('existing session returns to authorized UI after restart',true);
 await fs.writeFile('backend/customer-slice/artifacts/document-restart-tests.json',JSON.stringify({passed:checks.length,checks,media_id:photo.id,sha256:createHash('sha256').update(after).digest('hex')},null,2));console.log(checks.length+' document/media restart assertions passed');
}finally{await b.close()}
