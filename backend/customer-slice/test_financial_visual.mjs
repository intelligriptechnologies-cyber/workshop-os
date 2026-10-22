import {chromium} from 'playwright';import fs from 'node:fs/promises';
const b=await chromium.launch();const dir='backend/customer-slice/artifacts';const wasm=await fs.readFile('node_modules/sql.js/dist/sql-wasm.wasm');
for(const [label,url] of [['baseline','http://127.0.0.1:18445'],['slice','https://localhost:18443']]){
 const c=await b.newContext({ignoreHTTPSErrors:true,serviceWorkers:'block',viewport:{width:1440,height:900}});const p=await c.newPage();
 if(label==='baseline'){await c.route('**/api/v1/auth/config',r=>r.fulfill({json:{mode:'local',allowDemo:true}}));await c.route('**/sql-wasm.wasm',r=>r.fulfill({body:wasm,contentType:'application/wasm'}));}
 await c.route(url+'/__document_capture',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html></html>'}));
 await p.goto(url);await p.getByLabel('Emulate User:').selectOption('admin@example.com');await p.getByRole('button',{name:'Login',exact:true}).click();await p.locator('.role-nav').waitFor();
 const shot=async name=>{await p.mouse.move(0,0);await p.waitForTimeout(700);await p.screenshot({animations:'disabled',path:dir+'/'+label+'-financial-'+name+'.png'});};
 await p.getByRole('button',{name:'Manage',exact:true}).click();await p.getByRole('tab',{name:'Invoices',exact:true}).click();await shot('invoice-list');
 await p.getByLabel('Search invoices').fill('JC-2026-002011');await shot('invoice-search');await p.getByRole('button',{name:'View',exact:true}).click();await shot('invoice-view');await p.keyboard.press('Escape');
 await p.getByRole('row').filter({hasText:'INV-2026-00011'}).click();await shot('invoice-detail');await p.getByRole('button',{name:'Edit Invoice',exact:true}).click();await shot('invoice-editor');await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Quick Mark Paid',exact:true}).click();await shot('payment-dialog');await p.getByLabel('Payment mode',{exact:true}).selectOption('Other');await shot('payment-other');await p.keyboard.press('Escape');
 await p.getByRole('tab',{name:'Payments',exact:true}).click();await shot('payments-list');await p.getByRole('tab',{name:'Delivery',exact:true}).click();await shot('delivery-list');
 await p.getByRole('tab',{name:'Job Cards',exact:true}).click();await p.getByLabel('Search job cards').fill('JC-2026-002014');await p.getByRole('button',{name:'Edit',exact:true}).click();await p.getByRole('dialog').getByRole('tab',{name:'Documents',exact:true}).click();
 for(const kind of ['Invoice','Payment Receipt','Gate Pass']){
  const popup=p.waitForEvent('popup');await p.getByRole('group',{name:kind+' actions',exact:true}).getByRole('button',{name:'Print',exact:true}).click();const page=await popup;await page.waitForLoadState();const html=await page.content();await page.close();
  await fs.writeFile(dir+'/'+label+'-financial-'+kind.replaceAll(' ','-')+'.html',html);const rendered=await c.newPage();await rendered.setViewportSize({width:900,height:720});await rendered.goto(url+'/__document_capture');await rendered.setContent(html);await rendered.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});await rendered.screenshot({fullPage:true,path:dir+'/'+label+'-financial-print-'+kind.replaceAll(' ','-')+'.png'});await rendered.close();
 }
 await c.close();console.log(label+' financial states captured');
 const ac=await b.newContext({ignoreHTTPSErrors:true,serviceWorkers:'block',viewport:{width:1440,height:900}});const ap=await ac.newPage();
 if(label==='baseline'){await ac.route('**/api/v1/auth/config',r=>r.fulfill({json:{mode:'local',allowDemo:true}}));await ac.route('**/sql-wasm.wasm',r=>r.fulfill({body:wasm,contentType:'application/wasm'}));}
 await ap.goto(url);await ap.getByLabel('Emulate User:').selectOption('accounts@example.com');await ap.getByRole('button',{name:'Login',exact:true}).click();await ap.locator('.role-nav').waitFor();
 for(const name of ['Invoice','Payment','Delivery']){await ap.getByRole('button',{name,exact:true}).click();await ap.mouse.move(0,0);await ap.waitForTimeout(700);await ap.screenshot({animations:'disabled',path:dir+'/'+label+'-financial-accounts-'+name+'.png'});}
 await ac.close();
}
await b.close();
