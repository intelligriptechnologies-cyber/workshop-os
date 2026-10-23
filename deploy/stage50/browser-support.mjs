import fs from 'node:fs/promises';
export const stage50Access=JSON.parse(await fs.readFile('.scratch/stage49-local/secrets/local-access.json','utf8'));
const accounts=JSON.parse(await fs.readFile('.scratch/stage49-local/secrets/accounts.json','utf8'));
export async function stage50Credentials(page,email){
 if(new URL(page.url()).origin!=='https://localhost:18550')throw Error('Local Stage50 target required');
 if(!accounts[email])throw Error('No isolated account for role');
 await page.getByLabel('Email',{exact:true}).fill(email);
 await page.getByLabel('Password',{exact:true}).fill(accounts[email]);
}
