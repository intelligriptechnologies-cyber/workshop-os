import {chromium} from 'playwright';import fs from 'node:fs/promises';
const b=await chromium.launch();const wasm=await fs.readFile('node_modules/sql.js/dist/sql-wasm.wasm');const dir='backend/customer-slice/artifacts';
for(const [label,url] of [['baseline','http://127.0.0.1:18445'],['slice','https://localhost:18443']]){
 const c=await b.newContext({ignoreHTTPSErrors:true,serviceWorkers:'block',viewport:{width:1440,height:900}});
 if(label==='baseline'){await c.route('**/api/v1/auth/config',r=>r.fulfill({json:{mode:'local',allowDemo:true}}));await c.route('**/sql-wasm.wasm',r=>r.fulfill({body:wasm,contentType:'application/wasm'}));}
 const p=await c.newPage();await p.goto(url);await p.getByLabel('Emulate User:').selectOption('admin@example.com');await p.getByRole('button',{name:'Login',exact:true}).click();await p.locator('.role-nav').waitFor();
 const shot=async name=>{await p.mouse.move(0,0);await p.waitForTimeout(600);await p.screenshot({animations:'disabled',path:dir+'/'+label+'-stock-'+name+'.png'});};
 await p.getByRole('button',{name:'Manage',exact:true}).click();await p.getByRole('tab',{name:'Suppliers',exact:true}).click();await shot('suppliers');await p.getByRole('button',{name:'Add new supplier',exact:true}).click();await shot('supplier-add');await p.keyboard.press('Escape');await p.getByRole('row').filter({hasText:'Supplier 1'}).getByRole('button',{name:'Edit',exact:true}).click();await shot('supplier-edit');await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Purchase Orders',exact:true}).click();await shot('purchase-list');await p.getByRole('button',{name:'New Purchase Request',exact:true}).click();await shot('request-add');await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Search',exact:true}).click();await p.getByLabel('Search category',{exact:true}).selectOption({label:'Stock'});await shot('inventory');await c.close();console.log(label+' admin stock visuals captured');
 const sc=await b.newContext({ignoreHTTPSErrors:true,serviceWorkers:'block',viewport:{width:1440,height:900}});
 if(label==='baseline'){await sc.route('**/api/v1/auth/config',r=>r.fulfill({json:{mode:'local',allowDemo:true}}));await sc.route('**/sql-wasm.wasm',r=>r.fulfill({body:wasm,contentType:'application/wasm'}));}
 const sp=await sc.newPage();await sp.goto(url);await sp.getByLabel('Emulate User:').selectOption('store@example.com');await sp.getByRole('button',{name:'Login',exact:true}).click();await sp.locator('.role-nav').waitFor();await sp.getByRole('button',{name:'Stock',exact:true}).click();
 const stockShot=async name=>{await sp.mouse.move(0,0);await sp.waitForTimeout(600);await sp.screenshot({animations:'disabled',path:dir+'/'+label+'-stock-'+name+'.png'});};
 await stockShot('store-inventory');await sp.getByRole('row').filter({hasText:'CERAMIC-1L'}).getByRole('button',{name:'Edit',exact:true}).click();await stockShot('sku-edit');await sp.keyboard.press('Escape');await sp.getByRole('tab',{name:'Low Stock',exact:true}).click();await stockShot('low-stock');await sp.getByRole('tab',{name:'Stock Movements',exact:true}).click();await stockShot('movement-history');await sc.close();console.log(label+' stock visuals captured');
}
await b.close();
