import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_TEMPLATE_VERSION, rupeesInWords, seedReportTemplates } from "../src/report-templates";
import { ADMIN_DEMO_STORAGE_KEY, createDefaultAdminDemoState, loadAdminDemoState, type SessionStorageLike } from "../src/admin-demo-state";

test("every default template uses the modern accent band (prototype layout B) with company header, stamp and signature", () => {
  for (const template of seedReportTemplates("2026-09-26T00:00:00Z")) {
    assert.match(template.html, /<header style="box-sizing:border-box;background:#1f5f99;color:#fff/, `${template.category} header band`);
    for (const key of ["blocks.company_logo", "company.name", "company.address", "company.phone", "company.email", "company.gstin", "blocks.company_stamp", "blocks.authorized_signature"]) {
      assert.ok(template.html.includes(`{{${key}}}`), `${template.category} has ${key}`);
    }
    assert.equal(template.seedVersion, DEFAULT_TEMPLATE_VERSION);
    assert.doesNotMatch(template.html, /border-bottom:3px solid/);
  }
});

test("amount in words uses Indian grouping", () => {
  assert.equal(rupeesInWords(3540), "Rupees Three Thousand Five Hundred Forty Only");
  assert.equal(rupeesInWords(125000.5), "Rupees One Lakh Twenty Five Thousand and Fifty Paise Only");
  assert.equal(rupeesInWords(0), "Rupees Zero Only");
});

test("stale unedited seeded defaults upgrade; edited templates are kept", () => {
  const base = createDefaultAdminDemoState();
  const stale = base.reportTemplates.map((template) => {
    const { seedVersion: _drop, ...rest } = template;
    return template.category === "invoice" ? { ...rest, html: "<p>old</p>" } : template.category === "estimate" ? { ...rest, html: "<p>mine</p>", updatedAt: "2030-01-01T00:00:00.000Z" } : rest;
  });
  const values = new Map<string, string>();
  const storage: SessionStorageLike = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: (key) => { values.delete(key); } };
  storage.setItem(ADMIN_DEMO_STORAGE_KEY, JSON.stringify({ ...base, reportTemplates: stale }));
  const hydrated = loadAdminDemoState(storage, "2026-09-26T00:00:00Z");
  const html = (category: string) => hydrated.reportTemplates.find((template) => template.category === category)!.html;
  assert.match(html("invoice"), /background:#1f5f99/);
  assert.equal(html("estimate"), "<p>mine</p>");
});
