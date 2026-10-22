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
 const made=await command(p,'/reception/intake',{customerName:'Estimate UI '+randomUUID().slice(0,8),mobile:randomUUID().slice(0,16),vehicleNo:'EU'+randomUUID().slice(0,8),make:'Test',model:'Model',color:'Blue',km:10,fuel:'4 bars',fuelLevelValue:'4',fuelLevelUnit:'bars',requestedWork:'Estimate browser acceptance',advisorId:2});
 check('test intake setup',made.status===200);const j=made.body;
 await p.reload();await p.locator('.role-nav').waitFor();await openJob(p,j.job_no);
 console.log('JOB TABS',await p.getByRole('dialog').getByRole('tab').allTextContents());
 await p.getByRole('dialog').getByRole('tab',{name:'Documents',exact:true}).click();
 await p.getByRole('button',{name:'Create Estimate',exact:true}).click();
 let editor=p.getByRole('dialog',{name:'Create Estimate',exact:true});
 await editor.getByRole('button',{name:'+ Add Item',exact:true}).click();
 await editor.getByLabel('Item 1 description',{exact:true}).fill('UI labour');await editor.getByLabel('Item 1 quantity',{exact:true}).fill('2');await editor.getByLabel('Item 1 rate',{exact:true}).fill('500');
 await editor.getByRole('button',{name:'+ Add Item',exact:true}).click();
 await editor.getByLabel('Item 2 kind',{exact:true}).selectOption('Material');await editor.getByLabel('Item 2 description',{exact:true}).fill('UI part');await editor.getByLabel('Item 2 rate',{exact:true}).fill('500');
 await editor.getByLabel('Item 2 GST type',{exact:true}).selectOption('No GST');await editor.getByLabel('Discount',{exact:true}).fill('100');await editor.getByLabel('Notes',{exact:true}).fill('Browser parity');
 const preview=await editor.locator('.estimate-total').innerText();
 check('approved live calculation preview',preview.includes('1,568'));
 let response=p.waitForResponse(r=>r.url().endsWith('/estimate')&&r.request().method()==='POST');await editor.getByRole('button',{name:'Save Estimate',exact:true}).click();let saved=await response;check('estimate create through existing dialog '+await saved.text(),saved.status()===200);await editor.waitFor({state:'hidden'});
 await p.getByRole('group',{name:'Estimate actions',exact:true}).getByRole('button',{name:'Edit',exact:true}).click();editor=p.getByRole('dialog',{name:'Edit Estimate',exact:true});
 await editor.getByRole('button',{name:'+ Add Item',exact:true}).click();await editor.getByLabel('Item 3 description',{exact:true}).fill('Removed test line');await editor.getByRole('button',{name:'Remove item 3',exact:true}).click();check('existing line removal control',await editor.getByLabel('Item 3 description',{exact:true}).count()===0);await editor.getByLabel('Item 1 description',{exact:true}).fill('UI labour edited');response=p.waitForResponse(r=>r.url().endsWith('/estimate')&&r.request().method()==='POST');await editor.getByRole('button',{name:'Save Estimate',exact:true}).click();check('estimate edit',(await response).status()===200);await editor.waitFor({state:'hidden'});
 await p.getByRole('group',{name:'Estimate actions',exact:true}).getByRole('button',{name:'Approve Estimate',exact:true}).click();const approval=p.locator('#approve-estimate-form');await p.locator('#approve-estimate-form textarea').fill('Browser customer approval');response=p.waitForResponse(r=>r.url().endsWith('/estimate/approve'));await p.locator('button[form=approve-estimate-form]').click();saved=await response;check('approval with generated snapshot '+await saved.text(),saved.status()===200);await approval.waitFor({state:'hidden'});
 await p.waitForFunction(async id=>(await(await fetch('/api/v1/documents/snapshots')).json()).some(s=>s.jobId===id),j.id);
 const snap=await p.evaluate(async id=>(await(await fetch('/api/v1/documents/snapshots')).json()).find(s=>s.jobId===id),j.id);
 check('original template contains actual lines',snap.html.includes('UI labour edited')&&snap.html.includes('UI part')&&snap.number==='EST-'+j.job_no);
 await fs.writeFile(dir+'/estimate-generated.html',snap.html);
 const downloaded=p.waitForEvent('download');await p.getByRole('group',{name:'Estimate actions',exact:true}).getByRole('button',{name:'Download PDF',exact:true}).click();const download=await downloaded;await download.saveAs(dir+'/estimate-generated.pdf');const pdf=await fs.readFile(dir+'/estimate-generated.pdf');check('existing PDF download produces PDF',pdf.subarray(0,4).toString()==='%PDF');
 const popup=p.waitForEvent('popup');await p.getByRole('group',{name:'Estimate actions',exact:true}).getByRole('button',{name:'Print',exact:true}).click();const print=await popup;await print.waitForLoadState();check('existing print renders estimate',(await print.content()).includes('UI labour edited'));await print.close();
 await p.getByRole('dialog').getByRole('tab',{name:'Photos / Media',exact:true}).click();
 const media=p.getByRole('region',{name:'Job card photos and media',exact:true});
 await media.getByLabel('Photo label',{exact:true}).fill('Browser photo');
 const image=Buffer.from(await p.evaluate(()=>{const c=document.createElement('canvas');c.width=32;c.height=24;const x=c.getContext('2d');x.fillStyle='#346789';x.fillRect(0,0,32,24);return c.toDataURL('image/png').split(',')[1]}),'base64');
 await media.getByLabel('Image file',{exact:true}).setInputFiles({name:'proof.png',mimeType:'image/png',buffer:image});await media.getByText(/Ready:/).waitFor();response=p.waitForResponse(r=>r.url().endsWith('/media')&&r.request().method()==='POST');await media.getByRole('button',{name:'Upload to Before Work',exact:true}).click();saved=await response;check('upload via original control '+await saved.text(),saved.status()===200);const mid=(await saved.json()).id;
 await media.locator('img').last().waitFor();check('uploaded image renders',await media.locator('img').last().evaluate(i=>i.complete&&i.naturalWidth>0));
 const ctx2=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:900}});const second=await ctx2.newPage();await login(second);
 const remote=await second.evaluate(async id=>({snap:(await(await fetch('/api/v1/documents/snapshots')).json()).find(s=>s.jobId===id),projection:await(await fetch('/api/v1/operations/projection')).json()}),j.id);
 check('frozen HTML identical cross-session',remote.snap.html===snap.html);
 const imageResponse=await ctx2.request.get('https://localhost:18444/api/v1/media/'+mid+'/content');check('media survives independent session',imageResponse.status()===200&&(await imageResponse.body()).length>0);
 await openJob(second,j.job_no);await second.getByRole('dialog').getByRole('tab',{name:'Documents',exact:true}).click();check('PostgreSQL estimate visible in second UI',await second.getByRole('group',{name:'Estimate actions',exact:true}).getByRole('button',{name:'Download PDF',exact:true}).count()===1);
 check('no browser business snapshot persistence',await second.evaluate(()=>!sessionStorage.getItem('workshopos.documentSnapshots.v1')));
 await media.locator('.job-media-card').filter({hasText:'Browser photo'}).getByRole('button',{name:'Edit',exact:true}).click();
 const metadata=p.getByRole('dialog',{name:'Edit photo metadata',exact:true});await metadata.getByLabel('Photo label',{exact:true}).fill('Browser photo edited');response=p.waitForResponse(r=>r.url().endsWith('/metadata'));await metadata.getByRole('button',{name:'Save metadata',exact:true}).click();check('media metadata edit through existing dialog',(await response).status()===200);await metadata.waitFor({state:'hidden'});
 await media.locator('.job-media-card').filter({hasText:'Browser photo edited'}).getByRole('button',{name:'Archive',exact:true}).click();await p.locator('#archive-photo-form textarea').fill('Browser verification complete');response=p.waitForResponse(r=>r.url().endsWith('/archive'));await p.locator('button[form=archive-photo-form]').click();check('media archive through existing dialog',(await response).status()===200);await p.locator('#archive-photo-form').waitFor({state:'hidden'});
 check('archived media denied across sessions',(await ctx2.request.get('https://localhost:18444/api/v1/media/'+mid+'/content')).status()===404);
 check('no page errors',errors.length===0);
 await fs.writeFile(dir+'/estimate-browser-tests.json',JSON.stringify({passed:checks.length,checks,job:j,media_id:mid,html_sha256:createHash('sha256').update(snap.html).digest('hex')},null,2));console.log(checks.length+' estimate browser assertions passed');
}catch(e){await p.screenshot({path:dir+'/estimate-browser-failure.png'});console.log((await p.locator('body').innerText()).slice(-7000));await fs.writeFile(dir+'/estimate-browser-failure.html',await p.content());throw e}
finally{await browser.close()}
