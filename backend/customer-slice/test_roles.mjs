import {chromium} from 'playwright';import fs from 'node:fs/promises';import {execFileSync} from 'node:child_process';
const users=JSON.parse(await fs.readFile('backend/customer-slice/.generated/accounts.json','utf8'));const browser=await chromium.launch();const results=[];
for(const role of ['admin','reception','service','service_manager','accounts','store','tech']){
 const ctx=await browser.newContext({ignoreHTTPSErrors:true});const p=await ctx.newPage();await p.goto('https://localhost:18444/login');const u=users.find(u=>u.role===role);await p.getByLabel('Email',{exact:true}).fill(u.email);await p.getByLabel('Password',{exact:true}).fill(u.password);await p.getByRole('button',{name:'Login',exact:true}).click();await p.locator('.role-nav').waitFor();const nav=await p.locator('.role-nav').innerText();if(role!=='admin' && nav.split('\n').includes('Dashboard'))throw Error('Unauthorized Dashboard '+role);
 await p.goto('https://localhost:18444/login');await p.locator('.role-nav').waitFor();if(new URL(p.url()).pathname!=='/')throw Error('Redirect '+role);
 if(role==='admin'){
  const sql=`UPDATE tenant_memberships SET version=version+1 WHERE user_id=(SELECT platform_user_id FROM workshop_user_profiles WHERE id=${u.id})`;
  execFileSync('docker',['exec','workshopos-customer-slice-slice-test-1','psql','-U','slice_owner','-d','slice_test','-c',sql]);await p.reload();await p.getByRole('button',{name:'Login',exact:true}).waitFor();results.push('membership version invalidates session');
 }
 results.push(role+' manual login, authorized navigation, login-route redirect');await ctx.close();
}
await browser.close();await fs.writeFile('backend/customer-slice/artifacts/roles-tests.json',JSON.stringify({passed:results.length,results},null,2));console.log(results.length+' role/session assertions passed');
