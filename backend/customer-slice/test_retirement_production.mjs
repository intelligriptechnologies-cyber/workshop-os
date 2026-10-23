import {chromium} from 'playwright';import fs from 'node:fs/promises';import path from 'node:path';
const root=path.resolve('dist'),users=JSON.parse(await fs.readFile('backend/customer-slice/.generated/accounts.json','utf8'));const b=await chromium.launch(),results=[],forbidden=[];
try{for(const role of (process.env.RETIREMENT_ROLES?.split(',')??['admin','reception','service','service_manager','accounts','store','tech'])){
 const c=await b.newContext({ignoreHTTPSErrors:true,serviceWorkers:'block'});await c.route('https://localhost:18444/**',async r=>{
  const url=new URL(r.request().url());if(url.pathname.startsWith('/api/'))return r.continue();
  if(/sql-wasm|\.sqlite/.test(url.pathname)){forbidden.push(url.pathname);return r.abort()}
  let file=path.resolve(root,'.'+url.pathname);if(!file.startsWith(root+path.sep))file=path.join(root,'index.html');
  let data;try{data=await fs.readFile(file)}catch{file=path.join(root,'index.html');data=await fs.readFile(file)}
  const ext=path.extname(file);await r.fulfill({body:data,contentType:({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.json':'application/json'})[ext]??'application/octet-stream'});
 });
 const p=await c.newPage();p.on('pageerror',e=>console.log('PAGE ERROR',e.message));await p.goto('https://localhost:18444/login');const u=users.find(u=>u.role===role);await p.getByLabel('Email',{exact:true}).fill(u.email);await p.getByLabel('Password',{exact:true}).fill(u.password);await p.getByRole('button',{name:'Login',exact:true}).click();try{await p.locator('.role-nav').waitFor()}catch(e){console.log(role,(await p.locator('body').innerText()).slice(0,1400),await p.evaluate(()=>window.__workshopPostgresVerification));throw e}
 const state=await p.evaluate(()=>({runtime:window.__workshopPersistence,evidence:window.__workshopPostgresVerification,storage:Object.keys(localStorage)}));if(state.runtime?.testMode!==false||state.evidence.blocked.length||state.storage.some(k=>k.includes('workshopos.sqlite')))throw Error('Production bundle used local business persistence');
 await p.reload();await p.locator('.role-nav').waitFor();results.push({role,manualLogin:true,reloadSession:true,apiReads:state.evidence.api.filter(a=>a.path.endsWith('/operations/projection')&&a.status===200).length});await c.close();
}if(forbidden.length)throw Error('Production bundle requested SQLite');await fs.writeFile('backend/customer-slice/artifacts/retirement-production-smoke.json',JSON.stringify({results,forbidden},null,2));console.log('Seven-role production bundle smoke passed against disposable PostgreSQL API')
}finally{await b.close()}
