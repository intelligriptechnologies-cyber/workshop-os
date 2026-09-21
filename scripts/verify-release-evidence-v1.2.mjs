import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const read = name => readFile(path.join(root, name), "utf8");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const evidence = await read("RELEASE_CANDIDATE_EVIDENCE_v1.2.0.md");
assert(/LOCAL RELEASE CANDIDATE — NOT PRODUCTION-CERTIFIED/.test(evidence), "release evidence must state the local-only certification boundary");
assert(/BLOCKED FOR PRODUCTION CERTIFICATION/.test(evidence), "release evidence must retain the external certification block");
for (const phrase of ["Deployment and infrastructure", "Identity and external providers", "Security and privacy", "Finance and tax", "Accessibility and devices", "Backup, DR, logs, and recovery", "Migration and live data", "Performance and SLO", "Pilot, cutover, and hypercare"]) {
  assert(evidence.includes(phrase), `release evidence is missing external blocker: ${phrase}`);
}
for (const command of ["npm run build", "npm run test:unit", "npm run test:production", "npm run test:production:typecheck", "npm run local:test", "npm run test:e2e", "npm run test:harness", "npm run test:production-authority", "npm run audit:production", "verify-ui-enhancement-v1.2.mjs --release", "git diff --check"]) {
  assert(evidence.includes(command), `release evidence omits gate: ${command}`);
}

const manifest = JSON.parse(await read("package.json"));
assert(!manifest.dependencies?.xlsx, "advisory-affected xlsx must not be a production dependency");
assert(manifest.devDependencies?.xlsx, "protected historical workbook-reader dependency must be explicitly development-only");
assert(manifest.dependencies?.fflate, "safe runtime OOXML writer dependency is missing");
for (const file of ["customer-vehicle-export.ts", "inventory-export.ts", "job-export.ts", "remaining-screens.ts", "user-export.ts", "work-item-export.ts"]) {
  const source = await read(path.join("production", "src", file));
  assert(!/from\s+["']xlsx["']/.test(source), `${file} still imports the advisory-affected runtime writer`);
  assert(/writeObjectXlsx/.test(source), `${file} does not use the narrow OOXML writer`);
}
assert(!/from\s+["']xlsx["']/.test(await read(path.join("src", "export-utils.ts"))), "browser export writer still imports xlsx");

const css = await read(path.join("src", "release-assurance.css"));
for (const contract of ["focus-visible", "prefers-reduced-motion", "min-block-size: 44px", "max-width: 320px"]) assert(css.includes(contract), `release CSS omits ${contract}`);
const browser = await read(path.join("tests", "v12-release-assurance.spec.ts"));
for (const contract of ["AxeBuilder", "toHaveAccessibleName", "target-size", "reducedMotion", "desktopActions"]) assert(browser.includes(contract), `browser assurance omits ${contract}`);
for (const width of [320, 768, 1280]) assert(browser.includes(String(width)), `browser assurance omits ${width}px coverage`);

console.log("WorkshopOS v1.2 release evidence verified: local-only claim boundary, nine external blocker classes, production dependency safety, and automated WCAG/responsive contracts are present.");
