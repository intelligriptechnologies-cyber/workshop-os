import assert from "node:assert/strict";
import test from "node:test";
import { seedReportTemplates } from "../src/report-templates";

test("every default template uses the modern filled header band (prototype layout B)", () => {
  for (const template of seedReportTemplates("2026-09-26T00:00:00Z")) {
    assert.match(template.html, /<header style="background:#0f766e;color:#fff;padding:22px 28px/, `${template.category} header band`);
    assert.doesNotMatch(template.html, /border-bottom:3px solid/, `${template.category} legacy underline header`);
    assert.match(template.html, /<\/header><div style="padding:24px 28px">/, `${template.category} padded body`);
  }
});
