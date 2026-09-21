import assert from "node:assert/strict";
import test from "node:test";
import { createRemainingScreensApi } from "../src/production-remaining-screens-api.js";

test("remaining screen API preserves list query, authorization, versioned command, and export filters", async () => {
  const seen:Array<{url:string;init?:RequestInit}>=[];
  const fetcher=async(input:RequestInfo|URL,init?:RequestInit)=>{const url=String(input);seen.push({url,init});const path=new URL(url,"http://test").pathname;if(path.endsWith("/complete"))return new Response(JSON.stringify({row:{id:"follow-1",status:"COMPLETED"}}),{status:201,headers:{"content-type":"application/json"}});if(path==="/api/v1/operation-exports")return new Response(JSON.stringify({export:{id:"export-1",status:"PENDING"}}),{status:202,headers:{"content-type":"application/json"}});return new Response(JSON.stringify({rows:[],page:{page:2,pageSize:50,totalCount:0,pageCount:1},query:{}}),{headers:{"content-type":"application/json"}});};
  const api=createRemainingScreensApi({mode:"local",identity:"north-admin"},fetcher);
  const query={search:"brake",branchId:"branch-1",sort:"summary.asc" as const,page:2,pageSize:50 as const};
  await api.list("follow-ups",query);
  assert.match(seen[0].url,/search=brake/);assert.match(seen[0].url,/pageSize=50/);assert.equal((seen[0].init?.headers as Record<string,string>)["x-workshopos-identity"],"north-admin");
  await api.complete("follow-ups",{id:"follow-1",branchId:"branch-1",title:"Call",subtitle:"Due",status:"OPEN",updatedAt:"2026-01-01T00:00:00.000Z",version:4},"Customer reached");
  assert.deepEqual(JSON.parse(String(seen[1].init?.body)),{version:4,reason:"Customer reached"});assert.ok(new Headers(seen[1].init?.headers).get("idempotency-key"));
  await api.requestExport("follow-ups","XLSX",query);
  assert.deepEqual(JSON.parse(String(seen[2].init?.body)).query,query);
});
