// Reproducible read-only UI capture. Requires the in-memory source server on 4176.
import fs from 'node:fs';
import {chromium} from 'playwright';
import initSqlJs from 'sql.js';
const SQL=await initSqlJs();const db=new SQL.Database(fs.readFileSync('public/workshopos-demo.sqlite'));
const users=db.exec('select role,email,password from users where archived_at is null')[0];
const seen=new Set();const actors=users.values.filter(r=>!seen.has(r[0])&&seen.add(r[0]));
const browser=await chromium.launch({headless:true});
let records=fs.existsSync('docs/backend-migration/evidence-browser.json.md')?JSON.parse(fs.readFileSync('docs/backend-migration/evidence-browser.json.md','utf8')):[];const root='docs/backend-migration/';
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
for(const [role,email,password] of actors){ if(records.some(r=>r.role===role && r.state==='mobile-390')) continue;
 const context=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block'});
 await context.addInitScript(()=>{window.__auditStorageWrites=0;Storage.prototype.setItem=function(){window.__auditStorageWrites++};Storage.prototype.removeItem=function(){window.__auditStorageWrites++};Storage.prototype.clear=function(){window.__auditStorageWrites++};});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/api/**',r=>r.fulfill({status:404,body:''}));
 await page.goto('http://127.0.0.1:4176');await page.getByRole('button',{name:'Login',exact:true}).waitFor();
 await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill(password);await page.getByRole('button',{name:'Login',exact:true}).click();await page.locator('nav.role-nav').waitFor();
 const capture=async(label,state='default')=>{
  const id='SHOT-'+role+'-'+slug(label)+'-'+slug(state),file=id+'.png';await page.screenshot({path:root+file,fullPage:true});
  const body=await page.locator('body').innerText();const controls=await page.locator('button,input,select,textarea,a,[role=tab]').evaluateAll(els=>els.filter(e=>e.getClientRects().length).map(e=>({tag:e.tagName,label:e.getAttribute('aria-label')||e.closest('label')?.textContent?.trim()||e.textContent?.trim(),type:e.getAttribute('type'),required:e.required,disabled:e.disabled,value:e.type==='password'?'[REDACTED]':e.value,options:e.tagName==='SELECT'?[...e.options].map(o=>({label:o.label,value:o.value})):undefined})));
  records.push({id,role,route:'/',screen:label,state,file,viewport:page.viewportSize(),controls,body,errors:[...errors],storageWritesPrevented:await page.evaluate(()=>window.__auditStorageWrites)});
  fs.writeFileSync(root+'evidence-browser.json.md',JSON.stringify(records,null,2));
 };
 const sales=page.locator('nav.role-nav summary').filter({hasText:'Sales CRM'});if(await sales.count())await sales.click();
 const labels=await page.locator('nav.role-nav button').allTextContents();
 for(const raw of labels){const label=raw.trim();if(!label||label==='Sales CRM')continue;
  try{const btn=page.locator('nav.role-nav').getByRole('button',{name:label,exact:true});if(!await btn.isVisible()){if(await sales.count())await sales.click();}await btn.click();await page.waitForTimeout(180);await capture(label);
   const tabs=await page.getByRole('tab').allTextContents();for(const t of [...new Set(tabs)].slice(0,20)){const tab=page.getByRole('tab',{name:t.trim(),exact:true}).first();if(await tab.isVisible()){await tab.click();await page.waitForTimeout(100);await capture(label,'tab-'+t.trim());}}
  }catch(e){records.push({role,screen:label,status:'UNVERIFIED',reason:e.message});}
 }
 if(role==='admin'){await page.locator('nav.role-nav').getByRole('button',{name:'Dashboard',exact:true}).click();await page.setViewportSize({width:390,height:844});await capture('Dashboard','mobile-390');}
 console.log(role+' captured');await context.close();
}
await browser.close();db.close();
fs.writeFileSync(root+'evidence-browser.json.md',JSON.stringify(records,null,2));
fs.writeFileSync(root+'evidence-screenshots.md',['# Screen capture inventory','','Current source compiled in memory; API unavailable/local demo mode. Storage mutations blocked and service workers disabled. Navigation and tab clicks only; no business submission. Source associations are in 01 and component ledger. Route remains /. Each capture has full rendered control/value/options evidence in evidence-browser.json.md.','','| ID | Role | Screen | State | Image |','|---|---|---|---|---|',...records.map(r=>'| '+(r.id||'UNVERIFIED')+' | '+r.role+' | '+r.screen+' | '+(r.state||r.reason)+' | '+(r.file?'['+r.file+']('+r.file+')':'none')+' |')].join('\n'));
console.log('CAPTURES',records.filter(r=>r.file).length,'FAILURES',records.filter(r=>!r.file).length);
