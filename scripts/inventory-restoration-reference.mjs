import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.scratch/restoration-inventory-a315448');
await mkdir(root, { recursive: true });
const browser = await chromium.launch({ headless: true });
const wasm = await readFile('node_modules/sql.js/dist/sql-wasm.wasm');
const emails = [
  'admin@example.com', 'service@example.com', 'advisor.aa@example.com',
  'advisor.bb1@example.com', 'reception@example.com', 'accounts@example.com',
  'store@example.com', 'tech@example.com', 'general.service.manager@example.com', 'ppf.paint.manager@example.com',
];
const matrix = {};
const controls = {};
for (const email of emails) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.clock.install({ time: new Date('2026-10-20T06:30:00Z') });
  await page.route('**/sql-wasm.wasm', route => route.fulfill({ body: wasm, contentType: 'application/wasm' }));
  await page.route('**/api/v1/auth/config', route => route.fulfill({ json: { mode: 'local', allowDemo: true } }));
  await page.goto('http://127.0.0.1:5176/');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.locator('.role-nav').waitFor();
  const role = email.split('@')[0].replaceAll('.', '-');
  const labels = await page.locator('.role-nav button').allTextContents();
  matrix[role] = [];
  controls[role] = {};
  const crm = page.locator('details.sales-crm-nav');
  if (await crm.count()) await crm.evaluate(el => { el.open = true; });
  const buttons = page.locator('.role-nav button');
  for (let index = 0; index < await buttons.count(); index++) {
    const button = buttons.nth(index);
    const label = (await button.getAttribute('title')) || (await button.innerText()).trim();
    if (!(await button.isVisible())) continue;
    await button.click();
    await page.waitForTimeout(120);
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    controls[role][label] = await page.locator('main button, main select, main input').evaluateAll(nodes => nodes
      .filter(node => node.getClientRects().length && !node.closest('.role-nav'))
      .map(node => ({ kind: node.tagName.toLowerCase(), label: node.getAttribute('aria-label') || node.getAttribute('title') || node.textContent?.trim() || node.closest('label')?.textContent?.trim() || '' })));
    matrix[role].push(label);
    for (const width of [1440,390]) {
      await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
      await page.screenshot({path:path.join(root,`${role}-${slug}-${width}.png`),animations:'disabled'});
    }
    await page.setViewportSize({width:1440,height:900});
    if(label === 'Admin Console') {
      const tabs=page.getByRole('tablist',{name:'Admin Console tabs'}).getByRole('tab');
      for(let t=0;t<await tabs.count();t++) {
        const tabName=await tabs.nth(t).innerText();
        await tabs.nth(t).click();
        controls[role][`${label} / ${tabName}`]=await page.locator('main button, main select, main input').evaluateAll(nodes => nodes.filter(node=>node.getClientRects().length).map(node=>({kind:node.tagName.toLowerCase(),label:node.getAttribute('aria-label') || node.getAttribute('title') || node.closest('label')?.textContent?.trim() || node.textContent?.trim() || ''})));
        for (const width of [1440,390]) {
          await page.setViewportSize({width,height:width===1440?900:844});
          await page.screenshot({path:path.join(root,`${role}-${slug}-${tabName.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${width}.png`),animations:'disabled'});
        }
        await page.setViewportSize({width:1440,height:900});
      }
    }
  }
  console.log(role, matrix[role].join(', '));
  await context.close();
}
await writeFile(path.join(root, 'pages.json'), JSON.stringify(matrix, null, 2));
await writeFile(path.join(root, 'controls.json'), JSON.stringify(controls, null, 2));
await browser.close();
