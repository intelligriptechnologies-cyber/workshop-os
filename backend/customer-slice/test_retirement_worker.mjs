import {chromium} from 'playwright';import fs from 'node:fs/promises';
const b=await chromium.launch({args:['--ignore-certificate-errors']}),c=await b.newContext({ignoreHTTPSErrors:true}),p=await c.newPage();
try{
 await c.route('https://localhost:18444/__retirement_seed',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><title>Isolated cache fixture</title>'}));await p.goto('https://localhost:18444/__retirement_seed');
 await p.evaluate(async()=>{const old=await caches.open('workshopos-static-v3');await old.put('/',new Response('OBSOLETE SQLITE SHELL'));await old.put('/api/v1/operations/projection',new Response('{"customers":[{"name":"STALE BUSINESS RECORD"}]}'))});
 await p.goto('https://localhost:18444/login');await p.evaluate(async()=>{await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Worker not ready')),15000))])});
 await p.waitForFunction(async()=>!(await caches.keys()).includes('workshopos-static-v3'));
 const keys=await p.evaluate(()=>caches.keys());if(!keys.includes('workshopos-static-v4-postgresql'))throw Error('New cache missing');
 await c.setOffline(true);const rejected=await p.evaluate(async()=>{try{await fetch('/api/v1/operations/projection');return false}catch{return true}});if(!rejected)throw Error('Stale business response returned offline');
 await fs.writeFile('backend/customer-slice/artifacts/retirement-worker-upgrade.json',JSON.stringify({oldCacheRemoved:true,keys,offlineApiRejected:rejected},null,2));console.log('Old SQLite shell cache removed; offline API cannot read old business cache');
}finally{await b.close()}
