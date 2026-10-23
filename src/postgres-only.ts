/** PostgreSQL is mandatory in every application build. The old test flag is retired. */
export const postgresOnly = true;
export const postgresOnlyError = 'PostgreSQL required: this operation requires a FastAPI integration; SQLite and browser business persistence are disabled.';
type Evidence = { blocked: string[]; api: {path:string;method:string;status:number}[] };
export const verificationEvidence: Evidence = {blocked:[],api:[]};
export function denyLocal(operation:string):never {
  verificationEvidence.blocked.push(operation);
  throw new Error(postgresOnlyError+' ['+operation+']');
}
if (postgresOnly && typeof window !== 'undefined') {
  Object.assign(window,{__workshopPostgresVerification:verificationEvidence,__workshopPersistence:{backend:'postgresql',testMode:false}});
  const businessKey = (key:string) => /workshopos\.(sqlite|admin|developer|documentSnapshots|delivery-dates)/i.test(key);
  for (const method of ['getItem','setItem','removeItem'] as const) {
    const original=Storage.prototype[method];
    Object.defineProperty(Storage.prototype,method,{configurable:true,value:function(key:string,value?:string){
      if(businessKey(key))denyLocal('storage.'+method+':'+key);
      return method==='setItem' ? (original as Storage['setItem']).call(this,key,value!) : (original as Storage['getItem']).call(this,key);
    }});
  }
  const originalFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{
    const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url,location.href);
    if(/\.(sqlite|db)(?:$|\?)/i.test(url.pathname)||url.pathname.includes('sql-wasm'))denyLocal('fetch:'+url.pathname);
    const response=await originalFetch(input,init);
    if(url.origin===location.origin&&url.pathname.startsWith('/api/'))verificationEvidence.api.push({path:url.pathname,method:init?.method??(input instanceof Request?input.method:'GET'),status:response.status});
    return response;
  };
}
