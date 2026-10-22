import {chromium} from 'playwright';
import fs from 'node:fs';
const base='data-migration';
const defaults=JSON.parse(fs.readFileSync(base+'/demo-data/runtime-defaults.json'));
const browser=await chromium.launch();
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

await browser.close();
