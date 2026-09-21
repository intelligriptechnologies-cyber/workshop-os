import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseURL = process.env.PRODUCTION_E2E_BASE_URL ?? process.argv[2] ?? "http://127.0.0.1:4173";
const output = path.join(process.cwd(), "tests", "ui-recovery", "reviewed");
const pages = [
  ["home", "/"], ["standard-list", "/production/work-items"], ["jobs", "/production/jobs"],
  ["media", "/production/media"], ["settings", "/production/settings"], ["roles", "/production/roles"],
  ["billing", "/production/billing"], ["platform", "/platform"],
];

fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [name, route] of pages) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    await page.goto(new URL(route, baseURL).toString());
    await page.locator("h1").first().waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      window.scrollTo(0, 0);
    });
    await page.screenshot({ path: path.join(output, `${name}-1280.png`), fullPage: true });
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`Captured ${pages.length} reviewed UI recovery images from ${baseURL}.`);
