// Presentation-only fixture transport. All business GETs come from preserved local PostgreSQL.
import {chromium} from 'playwright';
const launch=chromium.launch.bind(chromium);
chromium.launch=async(...args)=>{
 const b=await launch(...args),create=b.newContext.bind(b),close=b.close.bind(b);
 const source=await create({ignoreHTTPSErrors:true,serviceWorkers:'block'}),p=await source.newPage();
 await p.goto('https://localhost:18443/login');await p.getByLabel('Emulate User:').selectOption('admin@example.com');await p.getByRole('button',{name:'Login',exact:true}).click();await p.locator('.role-nav').waitFor();
 const fixtures=new Map();
 async function fixture(path){if(!fixtures.has(path))fixtures.set(path,(async()=>{const r=await source.request.get('https://localhost:18443'+path);if(!r.ok())throw Error('Visual fixture GET failed: '+path);return {status:r.status(),contentType:r.headers()['content-type'],body:await r.body()}})());return fixtures.get(path)}
 await fixture('/api/v1/operations/projection');await fixture('/api/v1/configuration');
 b.newContext=async(...args)=>{
  const c=await create(...args);let closing=false;
  await c.route('https://localhost:18444/api/v1/**',async r=>{
   try{const u=new URL(r.request().url());if(u.pathname.includes('/auth/')||u.pathname.endsWith('/session'))return await r.continue();
    if(r.request().method()!=='GET')throw Error('Visual capture attempted a business write');
    await r.fulfill(await fixture(u.pathname+u.search));
   }catch(e){if(closing&&/already handled|closed|disposed/i.test(e.message))return;throw e}
  });
  await c.route(/https:\/\/localhost:18444\/.*(?:sql-wasm|\.sqlite)/,()=>{throw Error('Retired SQLite requested by normal runtime')});
  const finish=c.close.bind(c);c.close=async(...args)=>{closing=true;await c.unrouteAll({behavior:'wait'});return finish(...args)};return c;
 };
 b.close=async(...args)=>{for(const c of b.contexts())if(c!==source)await c.close();return close(...args)};
 return b;
};
