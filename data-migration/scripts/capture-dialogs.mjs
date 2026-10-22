import {chromium} from 'playwright';
import fs from 'node:fs';
const base='data-migration';
const defaults=JSON.parse(fs.readFileSync(`${base}/demo-data/runtime-defaults.json`));
const evidence={at:new Date().toISOString(),visited:[],skipped:[],errors:[]};
const browser=await chromium.launch();
const safe=x=>x.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
async function snapshot(p,name){
  await p.screenshot({path:`${base}/screenshots/dialog-${name}.png`,fullPage:true});
  fs.writeFileSync(`${base}/evidence/dialog-${name}.json`,JSON.stringify(await p.locator('body').evaluate(b=>({text:b.innerText,controls:[...b.querySelectorAll('input,textarea,select,button')].map(e=>({tag:e.tagName,type:e.type,label:e.getAttribute('aria-label')||e.labels?.[0]?.innerText,text:e.innerText,value:e.type==='password'?'[redacted]':e.value,required:e.required,disabled:e.disabled,min:e.min,max:e.max,options:e.options?[...e.options].map(o=>o.text):undefined}))})),null,2));
}
try{
for(const role of ['reception','service','store','accounts','admin']){
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}});
 const p=await ctx.newPage();p.setDefaultTimeout(3000);
 await p.goto('http://127.0.0.1:5187');
 await p.getByLabel('Email',{exact:true}).fill(defaults.users.values.find(u=>u[3]===role)[2]);
 await p.getByRole('button',{name:'Login',exact:true}).click();
 await p.locator('.role-nav').waitFor();
 if(role==='admin')await p.locator('.sales-crm-nav summary').click();
 const nav=await p.locator('.role-nav button').allTextContents();
 for(const pageName of nav){
  await p.locator('.role-nav').getByRole('button',{name:pageName,exact:true}).click();
  const tabs=await p.getByRole('tab').allTextContents();
  for(const tabName of [null,...tabs]){
   if(tabName){const t=p.getByRole('tab',{name:tabName,exact:true});if(await t.count()!==1)continue;await t.click();}
   const names=[...new Set(await p.locator('main button').allTextContents())].filter(t=>/^(Add\b|New\b|Create\b|Receive Vehicle$|View$|Edit$)/.test(t.trim()));
   for(const name of names){
    const key=safe(`${role}-${pageName}-${tabName||'default'}-${name}`);
    const btn=p.locator('main').getByRole('button',{name:name.trim(),exact:true}).first();
    if(!await btn.count()||!await btn.isVisible()||!await btn.isEnabled()){evidence.skipped.push({key,reason:'not visible/enabled'});continue;}
    try{
      await btn.click();
      const dialogs=p.getByRole('dialog');
      if(await dialogs.count()){
       await snapshot(p,key);
       evidence.visited.push({key,role,page:pageName,tab:tabName,action:name,screenshot:`screenshots/dialog-${key}.png`,evidence:`evidence/dialog-${key}.json`});
       const modal=dialogs.last();
       const closes=modal.getByRole('button',{name:/^(Cancel|Close|Close dialog|Go Back|Back)$/i});
       if(await closes.count())await closes.first().click();else await p.keyboard.press('Escape');
       if(await dialogs.count()){
        const x=modal.locator('button[aria-label*="Close"],button[title*="Close"]');
        if(await x.count())await x.first().click();
       }
       if(await dialogs.count()){evidence.errors.push({key,error:'Dialog remains open; remaining page actions skipped'});break;}
      }else evidence.skipped.push({key,reason:'Action did not open an ARIA dialog; inline or native outcome not asserted'});
    }catch(e){evidence.errors.push({key,error:String(e)});}
   }
  }
 }
 await ctx.close();console.log(`Dialogs inspected: ${role}`);
}
// A new browser context restores only the captured demo stores before startup.
const ctx=await browser.newContext();
await ctx.addInitScript(({local,session})=>{for(const [k,v]of Object.entries(local))localStorage.setItem(k,v);for(const [k,v]of Object.entries(session))sessionStorage.setItem(k,v);},{local:defaults.localStorage,session:defaults.sessionStorage});
const p=await ctx.newPage();await p.goto('http://127.0.0.1:5187');await p.getByRole('button',{name:'Login',exact:true}).waitFor();
const restored=await p.evaluate(async()=>{const d=await import('/src/db.ts');const db=await d.openWorkshopDb();const out={};for(const row of db.exec("select name from sqlite_master where type='table' order by name")[0].values){const t=row[0];const result=db.exec('select * from "'+t+'"')[0];out[t]=result?result.values.map(r=>Object.fromEntries(result.columns.map((c,i)=>[c,r[i]]))):[];}db.close();return out;});
const expected=JSON.parse(fs.readFileSync(`${base}/demo-data/runtime-initial-records.json`));
const equal=Object.fromEntries(Object.keys(expected).map(t=>[t,JSON.stringify(expected[t])===JSON.stringify(restored[t])]));
const differences=[];
for(const t of Object.keys(expected))for(let i=0;i<Math.max(expected[t].length,restored[t]?.length||0);i++){
 const before=expected[t][i],after=restored[t]?.[i];
 if(JSON.stringify(before)!==JSON.stringify(after))differences.push({table:t,row:i,id:before?.id,fields:Object.fromEntries([...new Set([...Object.keys(before||{}),...Object.keys(after||{})])].filter(k=>JSON.stringify(before?.[k])!==JSON.stringify(after?.[k])).map(k=>[k,{before:before?.[k],after:after?.[k]}]))});
}
fs.writeFileSync(`${base}/evidence/browser-restore-verification.json`,JSON.stringify({at:new Date().toISOString(),newContext:true,allTablesEqual:Object.values(equal).every(Boolean),tables:equal,onlyInvoiceUpdatedAtDiffers:differences.every(d=>d.table==='invoices'&&Object.keys(d.fields).every(k=>k==='updated_at')),differences},null,2));
await ctx.close();
}finally{fs.writeFileSync(`${base}/evidence/dialog-capture.json`,JSON.stringify(evidence,null,2));await browser.close();}
