import {chromium} from 'playwright';import fs from 'node:fs/promises';
const browser=await chromium.launch();const wasm=await fs.readFile('node_modules/sql.js/dist/sql-wasm.wasm');
for(const [label,url] of [['baseline','http://127.0.0.1:18445'],['slice','https://localhost:18443']]){
 for(const role of ['admin','reception']){
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:900}});const p=await ctx.newPage();
  if(label==='baseline'){await p.route('**/api/v1/auth/config',r=>r.fulfill({json:{mode:'local',allowDemo:true}}));await p.route('**/sql-wasm.wasm',r=>r.fulfill({body:wasm,contentType:'application/wasm'}))}
  await p.goto(url);await p.getByLabel('Emulate User:').selectOption(role+'@example.com');await p.getByRole('button',{name:'Login',exact:true}).click();await p.locator('.role-nav').waitFor();
  const shot=async name=>{await p.mouse.move(0,0);await p.waitForTimeout(1000);await p.screenshot({animations:'disabled',path:`backend/customer-slice/artifacts/${label}-ops-${name}.png`})};
  if(role==='reception'){
   await shot('reception-queue');await p.getByRole('button',{name:'Create New Visit',exact:true}).click();await shot('reception-intake');await p.getByRole('tab',{name:'Body Mark',exact:true}).click();await shot('reception-body-mark');
  }else{
   await p.getByRole('button',{name:'Manage',exact:true}).click();await p.getByRole('tab',{name:'Job Cards',exact:true}).click();await shot('jobs-list');await p.getByLabel('Search job cards').fill('JC-2026-002001');await shot('jobs-search');await p.getByRole('button',{name:'View',exact:true}).click();await shot('job-view');await p.keyboard.press('Escape');await p.getByRole('button',{name:'Edit',exact:true}).click();await shot('job-edit');await p.getByRole('tab',{name:'Body Mark',exact:true}).click();await shot('job-body-mark');await p.keyboard.press('Escape');await p.getByRole('button',{name:'Add Job Card',exact:true}).click();await shot('job-add');
  }
  await ctx.close();
 }
 console.log(label+' operational states captured');
}
await browser.close();
