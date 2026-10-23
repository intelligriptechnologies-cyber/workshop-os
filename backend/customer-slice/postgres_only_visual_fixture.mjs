// Visual-only fixture forwarding: preserved local PostgreSQL GET responses, never writes.
import {chromium} from 'playwright';
const original=chromium.launch.bind(chromium);
chromium.launch=async(...args)=>{
 const b=await original(...args),create=b.newContext.bind(b),close=b.close.bind(b);
 const source=await create({ignoreHTTPSErrors:true,serviceWorkers:'block'}),page=await source.newPage();
 await page.goto('https://localhost:18443/login');await page.getByLabel('Emulate User:').selectOption('admin@example.com');await page.getByRole('button',{name:'Login',exact:true}).click();await page.locator('.role-nav').waitFor();
 b.newContext=async(...a)=>{const c=await create(...a);await c.route('https://localhost:18444/api/v1/**',async r=>{
  const u=new URL(r.request().url());if(u.pathname.includes('/auth/')||u.pathname.endsWith('/session'))return r.continue();
  if(r.request().method()!=='GET')throw Error('Visual capture attempted a business write');
  const response=await source.request.get('https://localhost:18443'+u.pathname+u.search);return r.fulfill({response});
 });await c.route(/https:\/\/localhost:18444\/.*(?:sql-wasm|\.sqlite)/,()=>{throw Error('SQLite requested by strict visual capture')});const finish=c.close.bind(c);c.close=async(...args)=>{await c.unrouteAll({behavior:'wait'});return finish(...args)};return c};
 b.close=async(...a)=>{for(const c of b.contexts())if(c!==source)await c.unrouteAll({behavior:'wait'});return close(...a)};return b;
};
