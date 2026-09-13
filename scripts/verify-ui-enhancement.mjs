import { readFileSync } from "node:fs";

const checklist = readFileSync(new URL("../UI_ENHANCEMENT_CHECKLIST_v1.0.0.md", import.meta.url), "utf8");
const tasks = [...checklist.matchAll(/^- \[([ x])\] (UI-\d{2})/gm)];

if (tasks.length !== 8) {
  throw new Error(`Expected 8 UI programme tasks, found ${tasks.length}.`);
}

const incomplete = tasks.filter(([, mark]) => mark !== "x").map(([, , id]) => id);
if (incomplete.length) {
  console.error(`UI enhancement programme incomplete: ${incomplete.join(", ")}`);
  process.exit(1);
}

console.log("UI enhancement programme complete: UI-00 through UI-07 are checked.");
