import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const b=await chromium.launch({args:["--ignore-certificate-errors"]}),c=await b.newContext({ignoreHTTPSErrors:true}),p=await c.newPage(),checks=[],requests=[];
const check=(name,ok)=>{if(!ok)throw Error(name);checks.push(name)};
c.setDefaultTimeout(20000);
await c.addInitScript(()=>{
 const read=Storage.prototype.getItem,write=Storage.prototype.setItem;
 window.__rawBusinessStorage=()=>({local:read.call(localStorage,'workshopos.sqlite.v2'),session:read.call(sessionStorage,'workshopos.adminDemo.v2')});
 if(!read.call(localStorage,'pgonly-decoy-seeded')){write.call(localStorage,'workshopos.sqlite.v2','DECOY ORIGINAL DO NOT CHANGE');write.call(sessionStorage,'workshopos.adminDemo.v2','DECOY ORIGINAL DO NOT CHANGE');write.call(localStorage,'pgonly-decoy-seeded','1')}
});
p.on('request',r=>{if(/sql-wasm|\.sqlite/.test(r.url()))requests.push(r.url())});
try{
 await p.goto('https://localhost:18444/login');await p.getByLabel('Emulate User:').selectOption('admin@example.com');await p.getByRole('button',{name:'Login',exact:true}).click();await p.locator('.role-nav').waitFor();
 check('no SQLite or wasm network initialization',requests.length===0);
 check('normal startup does not attempt business storage',await p.evaluate(()=>window.__workshopPostgresVerification.blocked.length===0));
 const result=await p.evaluate(async()=>{
  const db=await import('/src/db.ts'),api=await import('/src/operations-api.ts');const projection=await api.operationsApi.read(),handle=await db.openWorkshopDb(projection.customers,projection);const denied=[];
  for(const [name,fn] of Object.entries({read:()=>handle.exec('SELECT * FROM customers'),write:()=>handle.run('DELETE FROM customers'),export:()=>handle.export(),persist:()=>db.persist(handle),fallback:()=>db.openWorkshopDb(),localRead:()=>localStorage.getItem('workshopos.sqlite.v2'),localWrite:()=>localStorage.setItem('workshopos.sqlite.v2','REPLACED'),sessionRead:()=>sessionStorage.getItem('workshopos.adminDemo.v2'),sessionWrite:()=>sessionStorage.setItem('workshopos.adminDemo.v2','REPLACED'),source:()=>fetch('/workshopos-demo.sqlite')})){
   try{await fn()}catch(e){if(e.message.startsWith('PostgreSQL-only verification:'))denied.push(name);else throw e}
  }
  localStorage.setItem('pgonly-ui-tab','jobs');const temporary=localStorage.getItem('pgonly-ui-tab');localStorage.removeItem('pgonly-ui-tab');return {denied,temporary,original:window.__rawBusinessStorage()};
 });
 check('all ten fallback/read/write attempts rejected',result.denied.length===10);check('temporary UI preference remains usable',result.temporary==='jobs');check('original browser records unchanged',Object.values(result.original).every(v=>v==='DECOY ORIGINAL DO NOT CHANGE'));
 await p.getByRole('button',{name:'Manage',exact:true}).click();const dialogs=[];p.on('dialog',async d=>{dialogs.push(d.message());await d.accept()});await p.getByRole('button',{name:'Load Large Demo Dataset',exact:true}).click();await p.waitForTimeout(200);
 check('unsupported demo reset fails visibly',dialogs.some(s=>s.includes('PostgreSQL-only verification:')));
 const cached=await p.evaluate(async()=>{await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error("Service worker unavailable")),15000))]);const keys=await caches.keys();return (await Promise.all(keys.map(async key=>(await(await caches.open(key)).keys()).map(r=>new URL(r.url).pathname)))).flat()});
 check('service worker never caches API business responses',!cached.some(path=>path.startsWith('/api/')));
 await c.setOffline(true);check('offline API cannot return cached business data',await p.evaluate(async()=>{try{await fetch('/api/v1/operations/projection');return false}catch{return true}}));await c.setOffline(false);
 await c.route('**/api/v1/operations/projection',r=>r.fulfill({status:503,json:{detail:'Isolated verification backend unavailable'}}));await p.reload();await p.waitForTimeout(2000);
 check('failed API cannot use decoy SQLite',await p.locator('.role-nav').count()===0);check('failed API displays error',/failed|unable|unavailable|load|error/i.test(await p.locator('body').innerText()));check('no source fetch on failure',requests.length===0);
 await fs.writeFile('backend/customer-slice/artifacts/pgonly-adversarial.json',JSON.stringify({checks,result,dialogs,requests},null,2));console.log(checks.length+' adversarial checks passed');
}finally{await b.close()}
