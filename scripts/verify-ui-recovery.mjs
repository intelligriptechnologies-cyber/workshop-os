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
for (let i = 1; i <= 18; i += 1) if (!spec.includes(`UIR-R${String(i).padStart(3, "0")}`)) failures.push(`Spec omits UIR-R${String(i).padStart(3, "0")}`);
for (let i = 0; i <= 10; i += 1) if (!trace.includes(`UIR-${String(i).padStart(2, "0")}`)) failures.push(`Traceability omits UIR-${String(i).padStart(2, "0")}`);
if (!trace.includes("TRACEABILITY: CLEAN")) failures.push("Traceability is not clean");
if (process.argv.includes("--release")) {
  const checklist = fs.readFileSync(path.join(root, required[1]), "utf8");
  const handoff = fs.readFileSync(path.join(root, "harness/ui-recovery/HANDOFF.md"), "utf8");
  if (!checklist.includes("Current progress: **100%**")) failures.push("Checklist is not at 100%");
  if (!handoff.includes("Next slice: NONE")) failures.push("Handoff still has a next slice");
  for (let i = 0; i <= 10; i += 1) if (!checklist.includes(`- [x] UIR-${String(i).padStart(2, "0")}`)) failures.push(`UIR-${String(i).padStart(2, "0")} incomplete`);
}
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`UI recovery verification passed (${process.argv.includes("--release") ? "release" : "programme"} mode).`);
