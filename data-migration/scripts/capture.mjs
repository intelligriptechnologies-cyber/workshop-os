// Isolated local-app evidence collection; never attaches to a personal browser.
import { chromium } from 'playwright';
import fs from 'node:fs';
const root = 'data-migration';
const url = process.env.CLONE_AUDIT_URL || 'http://127.0.0.1:5187';
if (!/^http:\/\/127\.0\.0\.1:\d+$/.test(url)) throw Error('Local isolated audit only');
const browser = await chromium.launch({headless:true});
const results = {url, browser:browser.version(), at:new Date().toISOString(), pages:[], errors:[], dialogs:[]};
const safe = x => x.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
const write = (name,data) => fs.writeFileSync(`${root}/${name}`,JSON.stringify(data,null,2));
async function capture(page, role, title) {
  const name = `${safe(role)}-${safe(title)}`;
  await page.screenshot({path:`${root}/screenshots/${name}.png`,fullPage:true});
  const dom = await page.locator('body').evaluate(body => ({text:body.innerText, controls:[...body.querySelectorAll('input,select,textarea,button,a,[role="tab"],summary')].map(e=>({tag:e.tagName,text:e.innerText,label:e.getAttribute('aria-label') || e.labels?.[0]?.innerText,title:e.title,type:e.type,value:e.type==='password'?'[redacted]':e.value,disabled:e.disabled,required:e.required,options:e.options?[...e.options].map(o=>({text:o.text,value:o.value,selected:o.selected})):undefined}))}));
  write(`evidence/runtime-${name}.json`,dom);
  results.pages.push({role,title,screenshot:`screenshots/${name}.png`,evidence:`evidence/runtime-${name}.json`});
}
try {
  const context = await browser.newContext({viewport:{width:1440,height:1000}});
  const page = await context.newPage();
  page.on('pageerror',e=>results.errors.push(String(e)));
  await page.goto(url);
  await page.getByRole('button',{name:'Login',exact:true}).waitFor();
  await capture(page,'public','login');
  const defaults = await page.evaluate(async()=>{
    const admin = await import('/src/admin-demo-state.ts');
    const dev = await import('/src/developer-control-plane.ts');
    const dbmod = await import('/src/db.ts');
    const db = await dbmod.openWorkshopDb();
    const users = db.exec('select id,name,email,role from users where archived_at is null')[0];
    const binary = db.export();
    let encoded=''; for(const b of binary) encoded+=String.fromCharCode(b);
    db.close();
    return {admin:admin.createDefaultAdminDemoState(),developer:dev.createDefaultDeveloperControlPlane(),groups:admin.ADMIN_PAGE_GROUPS,roles:admin.BUILT_IN_ROLE_LABELS,menus:admin.ROLE_MENU_PAGE_KEYS,access:admin.DEFAULT_ROLE_PAGE_ACCESS,users,runtimeDb:btoa(encoded),localStorage:{...localStorage},sessionStorage:{...sessionStorage}};
  });
  fs.writeFileSync(`${root}/demo-data/runtime-initial.sqlite`,Buffer.from(defaults.runtimeDb,'base64'));
  delete defaults.runtimeDb;
  write('demo-data/runtime-defaults.json',defaults);
  await context.close();
  for (const [role,labels] of Object.entries(defaults.menus)) {
    const ctx=await browser.newContext({viewport:{width:1440,height:1000}});
    const p=await ctx.newPage();
    p.setDefaultTimeout(5000);
    p.on('pageerror',e=>results.errors.push({role,error:String(e)}));
    await p.goto(url);
    await p.getByRole('button',{name:'Login',exact:true}).waitFor();
    const user=defaults.users.values.find(u=>u[3]===role);
    if (!user) {results.errors.push({role,error:'No active demo user'});await ctx.close();continue;}
    await p.getByLabel('Email',{exact:true}).fill(user[2]);
    await p.getByRole('button',{name:'Login',exact:true}).click();
    await p.locator('.role-nav').waitFor();
    if (role==='admin') await p.locator('.sales-crm-nav summary').click();
    const nav=await p.locator('.role-nav button').allTextContents();
    results[role]={user:user[2],nav};
    for(const title of nav){
      try {
        await p.locator('.role-nav').getByRole('button',{name:title,exact:true}).click();
        await capture(p,role,title);
        if(title==='Search') {
          const categories=await p.getByLabel('Search category',{exact:true}).locator('option').evaluateAll(es=>es.map(e=>({value:e.value,label:e.textContent})).filter(e=>e.value));
          for(const category of categories){
            await p.getByLabel('Search category',{exact:true}).selectOption(category.value);
            await capture(p,role,`${title}-category-${category.label}`);
          }
        }
        // Every tab in the current rendered workspace, with fresh state after each action.
        const tabs=await p.getByRole('tab').allTextContents();
        for(const tab of tabs){
          const target=p.getByRole('tab',{name:tab,exact:true});
          if(await target.count()===1 && await target.isEnabled()){
            await target.click();await capture(p,role,`${title}-tab-${tab}`);
          }
        }
      } catch(e){results.errors.push({role,title,error:String(e)});}
    }
    await ctx.close();
    write('evidence/runtime-capture.json',results);
    console.log(`Captured ${role}: ${nav.length} sidebar entries`);
  }
  const devctx=await browser.newContext({viewport:{width:1440,height:1000}});
  const dp=await devctx.newPage();
  dp.setDefaultTimeout(5000);
  await dp.goto(url);
  await dp.getByRole('button',{name:'Login',exact:true}).waitFor();
  const creds=await dp.evaluate(async()=>{const d=await import('/src/developer-control-plane.ts');return {email:d.DEVELOPER_EMAIL,password:d.DEVELOPER_PASSWORD};});
  await dp.getByLabel('Email',{exact:true}).fill(creds.email);
  await dp.getByLabel('Password',{exact:true}).fill(creds.password);
  await dp.getByRole('button',{name:'Login',exact:true}).click();
  for(const title of ['Tenants','Communications','Billing']){
    await dp.getByRole('tab',{name:title,exact:true}).click();
    await capture(dp,'developer',title);
  }
  await devctx.close();
} finally {write('evidence/runtime-capture.json',results);await browser.close();}
console.log(JSON.stringify({screens:results.pages.length,errors:results.errors}));
