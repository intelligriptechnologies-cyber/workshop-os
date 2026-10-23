import assert from 'node:assert/strict';
import test from 'node:test';
import schema from '../src/postgres-projection-defaults.json';
import {openWorkshopDb,readState,persist} from '../src/db';
import {readPostgresState} from '../src/postgres-state';
import {loadAdminDemoState,saveAdminDemoState} from '../src/admin-demo-state';
import {loadDocumentSnapshots,saveDocumentSnapshots} from '../src/document-snapshots';
const projection=()=>Object.fromEntries(Object.keys(schema).filter(k=>k!=='approvals').map(k=>[k,[]])) as Record<string,Array<Record<string,unknown>>>;

test('normal startup requires a complete API projection and rejects SQL methods',async()=>{
 await assert.rejects(openWorkshopDb(),/PostgreSQL required/);
 const handle=await openWorkshopDb([],projection());
 assert.deepEqual(readState(handle).customers,[]);
 for(const action of [()=>handle.exec('SELECT * FROM customers'),()=>handle.run('DELETE FROM customers'),()=>handle.export(),()=>persist(handle)])assert.throws(action,/PostgreSQL required/);
 handle.close();
});
test('direct reader refuses missing business tables rather than fabricating fallback records',()=>{
 const data=projection();delete data.invoices;
 assert.throws(()=>readPostgresState(data),/PostgreSQL projection missing invoices/);
});
test('direct reader preserves archive filtering, deterministic order and signed stock balances',()=>{
 const data=projection();data.customers=[{id:3,name:'Archived',archived_at:'2026-01-01'},{id:2,name:'Second'},{id:1,name:'First'}];
 data.inventory=[{id:1,name:'Test part',category:'Parts',stock_qty:100}];
 data.stock_ledger=[{id:1,item_id:1,qty:5},{id:2,item_id:1,qty:-2}];
 const state=readPostgresState(data);
 assert.deepEqual(state.customers.map(c=>c.id),[1,2]);assert.deepEqual(state.archived_customers.map(c=>c.id),[3]);assert.equal(state.inventory[0].stock_qty,97);
});
test('default configuration and document access never implicitly touches browser business storage',()=>{
 let calls=0;Object.defineProperty(globalThis,'sessionStorage',{configurable:true,get(){calls++;throw Error('Browser storage is forbidden')}});
 try{const config=loadAdminDemoState();assert.equal(config.reportTemplates.length,8);assert.deepEqual(loadDocumentSnapshots(),[]);assert.throws(()=>saveAdminDemoState(config),/PostgreSQL API/);assert.throws(()=>saveDocumentSnapshots([]),/PostgreSQL API/);assert.equal(calls,0)}finally{Reflect.deleteProperty(globalThis,'sessionStorage')}
});
