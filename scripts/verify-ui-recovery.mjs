import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const required = [
  "UI_RECOVERY_SPEC_v1.0.0.md", "UI_RECOVERY_CHECKLIST_v1.0.0.md",
  "harness/ui-recovery/00-intake.md", "harness/ui-recovery/01-decisions.md",
  "harness/ui-recovery/02-requirements.md", "harness/ui-recovery/04-dialog-inventory.md",
  "harness/ui-recovery/05-route-inventory.md", "harness/ui-recovery/06-traceability.md",
  "harness/ui-recovery/07-deferred-crud.md",
  "harness/ui-recovery/HANDOFF.md",
  ...Array.from({ length: 11 }, (_, i) => `harness/ui-recovery/03-slices/UIR-${String(i).padStart(2, "0")}.md`),
];
for (const file of required) if (!fs.existsSync(path.join(root, file))) failures.push(`Missing ${file}`);
const reviewedImages = ["home", "standard-list", "jobs", "media", "settings", "roles", "billing", "platform"]
  .map((name) => `tests/ui-recovery/reviewed/${name}-1280.png`);
for (const file of reviewedImages) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) failures.push(`Missing reviewed image ${file}`);
  else if (fs.statSync(absolute).size < 10_000) failures.push(`Reviewed image is unexpectedly small: ${file}`);
}
const spec = fs.readFileSync(path.join(root, required[0]), "utf8");
const trace = fs.readFileSync(path.join(root, "harness/ui-recovery/06-traceability.md"), "utf8");
const main = fs.readFileSync(path.join(root, "src/main.tsx"), "utf8");
const demo = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8");
const workspaceCss = fs.readFileSync(path.join(root, "src/production-workspace.css"), "utf8");
if (fs.existsSync(path.join(root, "src/ProductionNavigation.tsx"))) failures.push("Obsolete page-level ProductionNavigation shim remains");
if (!main.includes('lazy(() => import("./App"))')) failures.push("Legacy demo is not lazy-isolated");
if (!demo.includes('import "./styles.css"')) failures.push("Legacy demo no longer owns its stylesheet");
if (main.includes('import "./styles.css"')) failures.push("Legacy demo stylesheet leaks through the production entry point");
if (!workspaceCss.includes('html[data-workspace="tenant"]')) failures.push("Production visual system is not tenant-scoped");
for (let i = 1; i <= 18; i += 1) if (!spec.includes(`UIR-R${String(i).padStart(3, "0")}`)) failures.push(`Spec omits UIR-R${String(i).padStart(3, "0")}`);
for (let i = 0; i <= 10; i += 1) if (!trace.includes(`UIR-${String(i).padStart(2, "0")}`)) failures.push(`Traceability omits UIR-${String(i).padStart(2, "0")}`);
if (!trace.includes("TRACEABILITY: CLEAN")) failures.push("Traceability is not clean");
if (process.argv.includes("--release")) {
  const checklist = fs.readFileSync(path.join(root, required[1]), "utf8");
  const handoff = fs.readFileSync(path.join(root, "harness/ui-recovery/HANDOFF.md"), "utf8");
  if (!checklist.includes("Current progress: **100%**")) failures.push("Checklist is not at 100%");
  if (!handoff.includes("Next slice: NONE")) failures.push("Handoff still has a next slice");
  for (let i = 0; i <= 10; i += 1) if (!checklist.includes(`- [x] UIR-${String(i).padStart(2, "0")}`)) failures.push(`UIR-${String(i).padStart(2, "0")} incomplete`);
  const evidencePath = path.join(root, "UI_RECOVERY_RELEASE_EVIDENCE_v1.0.0.md");
  if (!fs.existsSync(evidencePath)) failures.push("UI recovery release evidence is missing");
  else {
    const evidence = fs.readFileSync(evidencePath, "utf8");
    if (!evidence.includes("Status: VERIFIED LOCAL UI RECOVERY CANDIDATE")) failures.push("UI recovery release evidence is not verified");
    for (const command of ["npm run build", "npm run test:unit", "npm run test:production", "npm run test:production:typecheck", "npm run local:test", "npm run test:e2e", "npm run test:harness", "npm run test:production-authority", "npm run test:release-assurance", "npm run test:release-evidence", "npm run audit:production", "verify-ui-enhancement-v1.2.mjs --release", "git diff --check"]) {
      if (!evidence.includes(command)) failures.push(`Release evidence omits ${command}`);
    }
    if (!/manual assistive-technology/i.test(evidence) || !/Deferred CRUD/.test(evidence)) failures.push("Release evidence omits manual or deferred limitations");
  }
}
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`UI recovery verification passed (${process.argv.includes("--release") ? "release" : "programme"} mode).`);
