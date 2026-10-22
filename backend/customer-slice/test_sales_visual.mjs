import {chromium} from 'playwright';import fs from 'node:fs/promises';
const browser=await chromium.launch(),dir='backend/customer-slice/artifacts';const wasm=await fs.readFile('node_modules/sql.js/dist/sql-wasm.wasm');
try {for(const [label,url] of [['baseline','http://127.0.0.1:18445'],['slice','https://localhost:18443']]) {
 const ctx=await browser.newContext({ignoreHTTPSErrors:true,serviceWorkers:'block',viewport:{width:1440,height:900}});ctx.setDefaultTimeout(15000);const p=await ctx.newPage();
 if(label==='baseline'){await ctx.route('**/api/v1/auth/config',r=>r.fulfill({json:{mode:'local',allowDemo:true}}));await ctx.route('**/sql-wasm.wasm',r=>r.fulfill({body:wasm,contentType:'application/wasm'}));}
 await p.goto(url);await p.getByLabel('Emulate User:').selectOption('admin@example.com');await p.getByRole('button',{name:'Login',exact:true}).click();await p.locator('.role-nav').waitFor();await p.locator('.sales-crm-nav summary').click();
 const shot=async name=>{await p.mouse.move(0,0);await p.waitForTimeout(500);await p.screenshot({animations:'disabled',path:`${dir}/${label}-sales-${name}.png`});};
 for(const [name,tab] of [['leads','Leads'],['quotations','Quotations']]) {await p.getByRole('button',{name:tab,exact:true}).click();await shot(name);}await ctx.close();
}} finally {await browser.close();}
