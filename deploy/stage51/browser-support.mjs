import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
const raw=execFileSync('ssh',['-T','-i','C:/Users/PREMDEEP/.ssh/id_ed25519','-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','prem@89.167.40.86','cat /home/prem/.workshopos-stage51/secrets/test-access.json'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
const privateAccess=JSON.parse(raw);
export const stage51Access=privateAccess.access;
export const stage51Accounts=privateAccess.accounts;
export const stage51Pin=(await fs.readFile('.scratch/stage51/tls-spki.txt','utf8')).trim();
export async function stage51FillPassword(page,value){try{await page.getByLabel('Password',{exact:true}).fill(value);}catch{throw Error('Private credential entry failed (detail suppressed)');}}
export async function stage51Credentials(page,email){
 if(new URL(page.url()).origin!=='https://localhost:18551')throw Error('Stage51 SSH tunnel origin required');
 if(!stage51Accounts[email])throw Error('Approved private account missing');
 await page.getByLabel('Email',{exact:true}).fill(email);
 await stage51FillPassword(page,stage51Accounts[email]);
}
