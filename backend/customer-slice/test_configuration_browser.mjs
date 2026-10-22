import {chromium} from 'playwright';import fs from 'node:fs/promises';
const browser=await chromium.launch(),ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:900}});ctx.setDefaultTimeout(15000);const p=await ctx.newPage(),checks=[];const check=(name,ok)=>{if(!ok)throw Error(name);checks.push(name);};let original;
const login=async page=>{await page.goto('https://localhost:18444/login');await page.getByLabel('Emulate User:').selectOption('admin@example.com');await page.getByRole('button',{name:'Login',exact:true}).click();await page.locator('.role-nav').waitFor();};
try {
 await login(p);original=await p.evaluate(async()=> (await(await fetch('/api/v1/configuration')).json()).state);
 await p.getByRole('button',{name:'Admin Console',exact:true}).click();await p.getByRole('tab',{name:'Business Settings',exact:true}).click();const name='Configuration browser '+Date.now();await p.getByLabel('Business name',{exact:true}).fill(name);await p.getByRole('button',{name:'Save Settings',exact:true}).click();await p.getByText('Settings saved for this session.',{exact:true}).waitFor();check('business settings approved save flow',true);
 const second=await browser.newContext({ignoreHTTPSErrors:true});second.setDefaultTimeout(15000);const q=await second.newPage();await login(q);await q.getByRole('button',{name:'Admin Console',exact:true}).click();await q.getByRole('tab',{name:'Business Settings',exact:true}).click();check('independent session settings',await q.getByLabel('Business name',{exact:true}).inputValue()===name);
 await p.getByRole('tab',{name:'Roles & Page Access',exact:true}).click();await p.getByRole('button',{name:'Add Role',exact:true}).click();let d=p.getByRole('dialog');await d.getByLabel('Role name',{exact:true}).fill('Browser custom '+Date.now());await d.getByRole('button',{name:'Save Role',exact:true}).click();await d.waitFor({state:'hidden'});check('custom role saved through approved editor',true);
 await p.getByRole('tab',{name:'Report Templates',exact:true}).click();check('templates loaded from PostgreSQL',await p.evaluate(async()=> (await(await fetch('/api/v1/configuration')).json()).state.reportTemplates.length)>=8);
 await q.reload();await q.locator('.role-nav').waitFor();check('configuration survives reload',await q.evaluate(async()=> (await(await fetch('/api/v1/configuration')).json()).state.businessSettings.profile.businessName)===name);await second.close();
 await fs.writeFile('backend/customer-slice/artifacts/configuration-browser-tests.json',JSON.stringify({passed:checks.length,checks},null,2));console.log(checks.length,'configuration browser checks passed');
}catch(e){await p.screenshot({path:'backend/customer-slice/artifacts/configuration-browser-failure.png'});throw e;}finally{
 if(original)await p.evaluate(async state=>{const api=await import('/src/configuration-api.ts');await api.configurationApi.read();await api.configurationApi.save(state);},original);
 await browser.close();
}
