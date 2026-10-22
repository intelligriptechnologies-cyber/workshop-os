import {chromium} from 'playwright';import fs from 'node:fs/promises';
const browser=await chromium.launch();const dir='backend/customer-slice/artifacts';const checks=[];
const check=(name,ok)=>{if(!ok)throw Error(name);checks.push(name)};
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:900}});const p=await ctx.newPage();
async function login(page,email){await page.goto('https://localhost:18444/login');await page.getByLabel('Emulate User:').selectOption(email);await page.getByRole('button',{name:'Login',exact:true}).click();await page.locator('.role-nav').waitFor()}
async function post(page,path,body){return page.evaluate(async({path,body})=>{const csrf=document.cookie.split('; ').find(s=>s.startsWith('workshopos_csrf='))?.split('=')[1];const r=await fetch('/api/v1'+path,{method:'POST',headers:{'Content-Type':'application/json','x-workshopos-csrf':csrf,'Idempotency-Key':crypto.randomUUID()},body:JSON.stringify(body)});return {status:r.status,body:await r.json()}},{path,body})}
try{
 await login(p,'store@example.com');const proj=await p.evaluate(async()=>await(await fetch('/api/v1/operations/projection')).json());
 const request=proj.material_requests.find(r=>!r.archived_at&&!r.invoiced_in&&r.status==='Requested'&&proj.job_cards.some(j=>j.id===r.job_card_id&&j.main_status==='IN_PROGRESS'&&!j.archived_at)&&!proj.material_approvals.some(a=>a.job_card_id===r.job_card_id));
 const job=proj.job_cards.find(j=>j.id===request.job_card_id);
 const result=await post(p,'/jobs/'+job.id+'/material-approval',{operation:'submit',row_id:request.id});check('Store submission via authenticated adapter contract',result.status===200);
 const admin=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:900}});const a=await admin.newPage();await login(a,'admin@example.com');await a.getByRole('button',{name:/^Approvals/}).click();
 const tr=a.getByRole('table',{name:'Pending material approvals'}).getByRole('row').filter({hasText:job.job_no});await tr.getByRole('button',{name:'Review',exact:true}).click();let review=a.getByRole('dialog',{name:'Review material approval',exact:true});
 await review.getByRole('button',{name:'Reject',exact:true}).click();await review.getByRole('alert').waitFor();check('existing reason validation',await review.getByRole('alert').innerText()==='A rejection reason is required.');
 await review.locator('textarea').fill('Browser specification review');let response=a.waitForResponse(r=>r.url().endsWith('/material-approval'));await review.getByRole('button',{name:'Reject',exact:true}).click();check('rejection in existing modal',(await response).status()===200);await review.waitFor({state:'hidden'});
 const accounts=JSON.parse(await fs.readFile('backend/customer-slice/.generated/accounts.json','utf8'));const advisor=accounts.find(u=>u.id===job.advisor_id);
 const advisorContext=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:900}});const s=await advisorContext.newPage();await login(s,advisor.email);
 const projection=await s.evaluate(async()=>await(await fetch('/api/v1/operations/projection')).json());const approval=projection.material_approvals.find(x=>x.job_card_id===job.id);
 check('rejected reason visible to independent advisor',approval.rejection_reason==='Browser specification review'&&projection.job_cards.find(x=>x.id===job.id).main_status==='HOLD');
 const resumed=await post(s,'/jobs/'+job.id+'/material-approval',{operation:'resubmit',version:approval.version});check('linked advisor resubmission',resumed.status===200);
 await a.reload();await a.locator('.role-nav').waitFor();await a.getByRole('button',{name:/^Approvals/}).click();await a.getByRole('table',{name:'Pending material approvals'}).getByRole('row').filter({hasText:job.job_no}).getByRole('button',{name:'Review',exact:true}).click();review=a.getByRole('dialog',{name:'Review material approval',exact:true});
 response=a.waitForResponse(r=>r.url().endsWith('/material-approval'));await review.getByRole('button',{name:'Approve',exact:true}).click();check('approval in existing modal',(await response).status()===200);await review.waitFor({state:'hidden'});
 const final=await s.evaluate(async()=>await(await fetch('/api/v1/operations/projection')).json());check('atomic job status visible across sessions',final.job_cards.find(x=>x.id===job.id).main_status==='IN_PROGRESS'&&final.material_approvals.find(x=>x.job_card_id===job.id).status==='Approved');
 await fs.writeFile(dir+'/approval-browser-tests.json',JSON.stringify({passed:checks.length,checks},null,2));console.log(checks.length+' approval browser assertions passed');
}catch(e){console.log((await p.locator('body').innerText()).slice(-3000));throw e}finally{await browser.close()}
