import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});const wasm=await fs.readFile('node_modules/sql.js/dist/sql-wasm.wasm');
for(const [label,url] of [['baseline','http://127.0.0.1:18445'],['slice','https://localhost:18443']]){
 const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:900}});const p=await ctx.newPage();
 if(label==='baseline'){await p.route('**/api/v1/auth/config',r=>r.fulfill({json:{mode:'local',allowDemo:true}}));await p.route('**/sql-wasm.wasm',r=>r.fulfill({body:wasm,contentType:'application/wasm'}))}
 await p.goto(url);await p.getByLabel('Emulate User:').waitFor();await p.screenshot({path:`backend/customer-slice/artifacts/${label}-login.png`});
 await p.getByRole('button',{name:'Login',exact:true}).click();await p.locator('.role-nav').waitFor();await p.getByRole('button',{name:'Manage',exact:true}).click();await p.getByText('Customers',{exact:true}).click();await p.getByText('Demo Customer 001',{exact:true}).waitFor();await p.screenshot({path:`backend/customer-slice/artifacts/${label}-list.png`});
 await p.getByRole('button',{name:'Add Customer',exact:true}).click();await p.getByLabel('Customer name',{exact:true}).waitFor();await p.screenshot({path:`backend/customer-slice/artifacts/${label}-add.png`});await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Edit',exact:true}).first().click();await p.getByLabel('Customer name',{exact:true}).waitFor();await p.screenshot({path:`backend/customer-slice/artifacts/${label}-edit.png`});await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'View',exact:true}).first().click();await p.waitForTimeout(700);await p.screenshot({path:`backend/customer-slice/artifacts/${label}-view.png`});await p.keyboard.press('Escape');
 await p.getByLabel('Search customers',{exact:true}).fill('Demo Customer 055');await p.screenshot({path:`backend/customer-slice/artifacts/${label}-search.png`});
 console.log(label+' captured');await ctx.close();
}
await browser.close();
