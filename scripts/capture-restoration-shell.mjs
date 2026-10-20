import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";

const browser = await chromium.launch();
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 } });
    await page.clock.install({ time: new Date("2026-10-20T06:30:00Z") });
    await page.route("**/api/v1/auth/config", route => route.fulfill({ json: { mode: "local", allowDemo: true } }));
    await page.route("**/sql-wasm.wasm", async route => route.fulfill({ body: await readFile("node_modules/sql.js/dist/sql-wasm.wasm"), contentType: "application/wasm" }));
    await page.goto("http://127.0.0.1:5176/");
    await page.getByLabel("Email", { exact: true }).fill("service@example.com");
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await page.locator(".role-nav").waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const area of ["rail", "topbar"]) {
      await writeFile(`tests/reference-a315448/service-${area}-${width}.png`,
        await page.locator(`.${area}`).screenshot({ animations: "disabled" }), { flag: "wx" });
    }
    await page.close();
  }
} finally {
  await browser.close();
}
