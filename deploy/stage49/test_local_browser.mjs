// Only the disposable local packaged deployment; never a remote acceptance runner.
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin='https://localhost:18549';
const credentials=JSON.parse(await fs.readFile('.scratch/stage49-local/secrets/accounts.json','utf8'));
const access=JSON.parse(await fs.readFile('.scratch/stage49-local/secrets/local-access.json','utf8'));
const profiles=JSON.parse(await fs.readFile('backend/customer-slice/.generated/accounts.json','utf8'));
const browser=await chromium.launch();
const results=[],forbidden=[];
let created,mediaId;
try {
  const anonymous=await browser.newContext({ignoreHTTPSErrors:true});
  assert.equal((await anonymous.request.get(origin+'/')).status(),401);
  await anonymous.close();
  for(const role of ['admin','reception','service','service_manager','accounts','store','tech']) {
    const context=await browser.newContext({ignoreHTTPSErrors:true,httpCredentials:access,serviceWorkers:'block'});
    const page=await context.newPage();
    page.on('request',r=>{if(/\.sqlite|sql-wasm/.test(r.url()))forbidden.push(r.url());});
    await page.goto(origin+'/login');
    const config=await page.evaluate(async()=>await (await fetch('/api/v1/auth/config')).json());
    assert.equal(config.mode,'database');assert.equal(config.allowDemo,false);
    const user=profiles.find(u=>u.role===role);
    await page.getByLabel('Email',{exact:true}).fill(user.email);
    await page.getByLabel('Password',{exact:true}).fill(credentials[user.email]);
    await page.getByRole('button',{name:'Login',exact:true}).click();
    await page.locator('.role-nav').waitFor();
    const cookie=(await context.cookies()).find(c=>c.name==='workshopos_session');
    assert(cookie?.secure && cookie.httpOnly && cookie.sameSite==='Lax');
    const rejectedOrigin=await context.request.post(origin+'/api/v1/customers',{headers:{Origin:'https://untrusted.invalid','Idempotency-Key':crypto.randomUUID()},data:{name:'Rejected origin',mobile:'0000000000',type:'Individual',address:''}});
    assert.equal(rejectedOrigin.status(),403);assert.equal((await rejectedOrigin.json()).code,'ORIGIN_INVALID');
    const missingRoute=await context.request.get(origin+'/api/v1/stage49-missing-route');
    assert.equal(missingRoute.status(),404);assert(missingRoute.headers()['content-type'].includes('application/json'));
    assert.equal((await context.request.get(origin+'/workshopos-demo.sqlite')).status(),404);
    await page.reload();await page.locator('.role-nav').waitFor();
    const state=await page.evaluate(()=>({runtime:window.__workshopPersistence,storage:window.__workshopPostgresVerification}));
    assert.equal(state.runtime.testMode,false);assert.deepEqual(state.storage.blocked,[]);
    assert(state.storage.api.some(a=>a.path.endsWith('/operations/projection')&&a.status===200));
    const probe=await page.evaluate(async({role,created,mediaId})=>{
      const csrf=decodeURIComponent(document.cookie.split('; ').find(x=>x.startsWith('workshopos_csrf='))?.split('=').slice(1).join('=')??'');
      const payload={name:'Stage49 packaged deployment',mobile:'49'+Date.now(),type:'Individual',address:'Disposable local verification'};
      const key=crypto.randomUUID();
      const command=async(token)=>fetch('/api/v1/customers',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':key,...token?{'X-WorkshopOS-CSRF':token}:{}},body:JSON.stringify(payload)});
      const missing=(await command('')).status;
      let saved=null,read=null,denied=null,media=null;
      if(role==='admin'){
        const a=await command(csrf);if(a.status!==200)throw Error('Create status '+a.status);
        saved=await a.json();const b=await command(csrf);if((await b.json()).id!==saved.id)throw Error('Idempotency failed');
        const upload=await fetch('/api/v1/jobs/1/media',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID(),'X-WorkshopOS-CSRF':csrf},body:JSON.stringify({label:'Stage49 restore proof',category:'Before Work',originalName:'stage49.png',width:1,height:1,src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a9sAAAAASUVORK5CYII='})});
        if(upload.status!==200)throw Error('Media upload status '+upload.status);media=await upload.json();
      }else if(role==='reception'){
        const r=await fetch('/api/v1/customers/'+created.id);read={status:r.status,data:await r.json()};
        const bytes=await fetch('/api/v1/media/'+mediaId+'/content');media={status:bytes.status,bytes:(await bytes.arrayBuffer()).byteLength};
      }else{denied=(await command(csrf)).status;}
      const loggedOut=(await fetch('/api/v1/auth/logout',{method:'POST',headers:{'X-WorkshopOS-CSRF':csrf}})).status;
      const afterLogout=(await fetch('/api/v1/session')).status;
      return {missing,saved,read,denied,loggedOut,afterLogout,media};
    },{role,created,mediaId});
    assert.equal(probe.missing,403);assert.equal(probe.loggedOut,200);assert.equal(probe.afterLogout,401);
    if(role==='admin'){created=probe.saved;mediaId=probe.media.id;}
    if(role==='reception'){assert.equal(probe.read.status,200);assert.equal(probe.read.data.customer.name,created.name);assert.equal(probe.media.status,200);assert(probe.media.bytes>0);}
    if(!['admin','reception'].includes(role))assert.equal(probe.denied,403);
    results.push({role,manualLogin:true,reloadSession:true,secureCookie:true,csrfDenied:true,logout:true,customerMutationDenied:probe.denied===403});
    await context.close();
  }
  assert.deepEqual(forbidden,[]);
  await fs.writeFile('.scratch/stage49-browser.json',JSON.stringify({results,forbidden,customerId:created.id,mediaId,crossSession:true,accessGate:true},null,2));
  console.log('Packaged HTTPS seven-role/session/CSRF/RBAC/idempotency/cross-session smoke passed.');
} finally {await browser.close();}
