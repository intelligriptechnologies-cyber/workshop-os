import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { createHash } from "node:crypto";

const root = path.resolve(".scratch/reference-a315448");
for (const file of ["src/App.tsx", "src/styles.css"]) {
  const expected = execFileSync("git", ["show", `a315448:${file}`], { maxBuffer: 4 * 1024 * 1024 }).toString().replaceAll("\r\n", "\n");
  const actual = (await readFile(path.join(root, file), "utf8")).replaceAll("\r\n", "\n");
  if (actual !== expected) throw new Error(`Reference ${file} is not a315448`);
}
const destination = "tests/reference-a315448";
await mkdir(destination, { recursive: true });
const browser = await chromium.launch();
const manifest = { commit: "a315448", clock: "2026-10-20T06:30:00Z", browser: browser.version(), images: {} };
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 900 : 844 } });
    const page = await context.newPage();
    await page.clock.install({ time: new Date(manifest.clock) });
    await page.route("**/api/v1/auth/config", route => route.fulfill({ json: { mode: "local", allowDemo: true } }));
    await page.route("**/sql-wasm.wasm", async route => route.fulfill({ body: await readFile("node_modules/sql.js/dist/sql-wasm.wasm"), contentType: "application/wasm" }));
    await page.goto("http://127.0.0.1:5176/");
    await page.getByLabel("Email", { exact: true }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    const data = await page.screenshot({ animations: "disabled" });
    const name = `login-${width}.png`;
    await writeFile(`${destination}/${name}`, data, { flag: "wx" });
    manifest.images[name] = createHash("sha256").update(data).digest("hex");
    await context.close();
  }
  await writeFile(`${destination}/manifest.json`, JSON.stringify(manifest, null, 2), { flag: "wx" });
} finally {
  await browser.close();
}

