import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const evidence={contexts:0,pages:0,verifiedAppPages:0,api:[],forbiddenRequests:[],localAttempts:[],missingMode:[]};
const attached=new WeakSet();
async function context(ctx){
 if(attached.has(ctx))return ctx;attached.add(ctx);evidence.contexts++;
 ctx.setDefaultTimeout(30000);
 await ctx.route(/(?:sql-wasm|\.sqlite(?:\?|$))/,r=>{evidence.forbiddenRequests.push(r.request().url());return r.abort('blockedbyclient')});
 const page=p=>{evidence.pages++;p.on('response',r=>{if(new URL(r.url()).pathname.startsWith('/api/'))evidence.api.push({path:new URL(r.url()).pathname,method:r.request().method(),status:r.status()})});};
 ctx.on('page',page);for(const p of ctx.pages())page(p);
 const close=ctx.close.bind(ctx);
 ctx.close=async(...args)=>{
  for(const p of ctx.pages()){
   if(!p.url().startsWith('https://localhost:18444'))continue;
   const snapshot=await p.evaluate(()=>({app:!!document.getElementById('root'),state:window.__workshopPostgresVerification})).catch(()=>null);
   if(snapshot?.state){evidence.verifiedAppPages++;evidence.localAttempts.push(...snapshot.state.blocked)}
   else if(snapshot?.app)evidence.missingMode.push(p.url());
  }
  await close(...args);
  await fs.writeFile('backend/customer-slice/artifacts/pgonly-'+process.env.PGONLY_SUITE+'-traffic.json',JSON.stringify(evidence,null,2));
 };
 return ctx;
}
const launch=chromium.launch.bind(chromium);
chromium.launch=async(...args)=>{
 const b=await launch(...args),create=b.newContext.bind(b),close=b.close.bind(b);
 b.newContext=async(...a)=>context(await create(...a));
 b.close=async(...a)=>{
  try{for(const c of b.contexts())await c.close()}finally{await close(...a)}
  if(evidence.forbiddenRequests.length||evidence.missingMode.length||evidence.localAttempts.length||!evidence.verifiedAppPages)throw Error('Strict-mode evidence failed: '+JSON.stringify({forbidden:evidence.forbiddenRequests,missing:evidence.missingMode,local:evidence.localAttempts,verified:evidence.verifiedAppPages}));
 };
 return b;
};
const persistent=chromium.launchPersistentContext.bind(chromium);
chromium.launchPersistentContext=async(...args)=>context(await persistent(...args));
