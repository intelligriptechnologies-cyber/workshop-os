import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
const checks=[];const check=(name,ok)=>{if(!ok)throw Error(name);checks.push(name)};
const dir='backend/customer-slice/artifacts';
const browser=await chromium.launch();
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:900},acceptDownloads:true});
const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
async function login(page,role='admin'){
 await page.goto('https://localhost:18444/login');await page.getByLabel('Emulate User:').selectOption(role+'@example.com');await page.getByRole('button',{name:'Login',exact:true}).click();await page.locator('.role-nav').waitFor();
}
async function command(page,path,body){return page.evaluate(async({path,body})=>{
 const csrf=document.cookie.split('; ').find(s=>s.startsWith('workshopos_csrf='))?.split('=')[1];
 const r=await fetch('/api/v1'+path,{method:'POST',headers:{'Content-Type':'application/json','x-workshopos-csrf':csrf,'Idempotency-Key':crypto.randomUUID()},body:JSON.stringify(body)});
 return {status:r.status,body:await r.json()};
},{path,body});}
async function openJob(page,number){
 await page.getByRole('button',{name:'Manage',exact:true}).click();await page.getByRole('tab',{name:'Job Cards',exact:true}).click();await page.getByLabel('Search job cards').fill(number);await page.getByRole('button',{name:'Edit',exact:true}).click();
}
try{
 await login(p);
 const made=await command(p,'/reception/intake',{customerName:'Task UI '+randomUUID().slice(0,8),mobile:randomUUID().slice(0,16),vehicleNo:'TL'+randomUUID().slice(0,8),make:'Test',model:'Model',color:'Blue',km:10,fuel:'4 bars',fuelLevelValue:'4',fuelLevelUnit:'bars',requestedWork:'Task acceptance',advisorId:2});check('fixture',made.status===200);const j=made.body;
 await p.reload();await p.locator('.role-nav').waitFor();await openJob(p,j.job_no);const dialog=p.getByRole('dialog');await dialog.getByRole('tab',{name:'Task List',exact:true}).click();await dialog.getByLabel('Manual task name',{exact:true}).fill('Browser task');await dialog.getByLabel('Manual task rate',{exact:true}).fill('123.45');await dialog.getByRole('button',{name:'Add manual task',exact:true}).click();const row=dialog.getByRole('table',{name:'Job task list'}).getByRole('row').filter({has: p.getByLabel('Browser task name',{exact:true})});await row.waitFor();check('manual task persisted',true);
 const response=p.waitForResponse(r=>r.url().endsWith('/catalog/command')&&r.request().postDataJSON().operation==='tasklist-update');await row.getByRole('checkbox').check();check('done persists',(await response).status()===200);await p.waitForTimeout(250);
 const prefill=p.waitForResponse(r=>r.url().includes('/estimate/prefill'));await dialog.getByRole('button',{name:'Prefill Estimate',exact:true}).click();check('nonempty prefill',(await prefill).status()===200);await p.waitForTimeout(250);const data=await p.evaluate(async()=> (await(await fetch('/api/v1/operations/projection')).json()));const estimate=data.estimates.find(e=>e.job_card_id===j.id);check('estimate includes source task and rate',data.estimate_items.some(i=>i.estimate_id===estimate.id&&i.description==='Browser task'&&i.rate===123.45));
 await p.reload();await p.locator('.role-nav').waitFor();await openJob(p,j.job_no);await p.getByRole('dialog').getByRole('tab',{name:'Task List',exact:true}).click();check('task survives reload',await p.getByLabel('Browser task done',{exact:true}).isChecked());
 await fs.writeFile(dir+'/tasklist-browser-tests.json',JSON.stringify({passed:checks.length,checks},null,2));console.log(checks.length,'task-list browser checks passed');
}catch(e){await fs.writeFile(dir+'/tasklist-browser-error.txt',await p.locator('body').innerText());throw e}finally{await browser.close()}
