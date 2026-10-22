import {chromium} from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch();
try{
 const context=await browser.newContext();const page=await context.newPage();
 await page.goto('http://127.0.0.1:5187');await page.getByRole('button',{name:'Login',exact:true}).waitFor();
 const settings=await page.evaluate(async()=>{
  const admin=await import('/src/admin-demo-state.ts');const developer=await import('/src/developer-control-plane.ts');
  return {at:new Date().toISOString(),admin:admin.loadAdminDemoState(),developer:developer.loadDeveloperControlPlane(),storageKeys:Object.keys(sessionStorage),note:'Fresh runtime loader defaults, not a personal session. Admin logs/template timestamps differ from the zero-argument fixed-date factory defaults.'};
 });
 fs.writeFileSync('data-migration/demo-data/runtime-loaded-settings.json',JSON.stringify(settings,null,2));
 await context.close();
}finally{await browser.close();}
