import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const harness = path.join(root, "harness");
const requiredFiles = [
  "00-intake.md",
  "01-branch-map.md",
  "02-ledger.md",
  "03-prd.md",
  "04-absences.md",
  "06-traceability.md",
  "HANDOFF.md",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function ids(text, pattern) {
  return new Set([...text.matchAll(pattern)].map((match) => match[1]));
}

async function main() {
  const artifacts = Object.fromEntries(
    await Promise.all(requiredFiles.map(async (name) => [name, await readFile(path.join(harness, name), "utf8")])),
  );
  const prdRequirements = ids(artifacts["03-prd.md"], /^### (R-\d{3})\b/gm);
  assert(prdRequirements.size === 119, `expected 119 PRD requirements, found ${prdRequirements.size}`);

  const issueDirectory = path.join(harness, "05-issues");
  const issueFiles = (await readdir(issueDirectory)).filter((name) => /^S\d{2}-.*\.md$/.test(name)).sort();
  assert(issueFiles.length === 29, `expected 29 slice files, found ${issueFiles.length}`);
  assert(new Set(issueFiles.map((name) => name.slice(0, 3))).size === 29, "slice IDs must be unique");

  const mappedRequirements = new Set();
  const completedSlices = [];
  for (const file of issueFiles) {
    const text = await readFile(path.join(issueDirectory, file), "utf8");
    if (/^Status: Complete\s*$/m.test(text)) completedSlices.push(Number(file.slice(1, 3)));
    const implementsLine = text.match(/^Implements:\s*(.+)$/m);
    assert(implementsLine, `${file} is missing Implements:`);
    const mappings = ids(implementsLine[1], /(R-\d{3})/g);
    assert(mappings.size > 0, `${file} has no requirement mappings`);
    for (const requirement of mappings) {
      assert(prdRequirements.has(requirement), `${file} references unknown ${requirement}`);
      mappedRequirements.add(requirement);
    }
    assert(/^## Acceptance criteria$/m.test(text), `${file} is missing acceptance criteria`);
    assert(/^- \[[ x]\] /m.test(text), `${file} has no testable acceptance criterion`);
  }

  const orphanRequirements = [...prdRequirements].filter((id) => !mappedRequirements.has(id));
  assert(orphanRequirements.length === 0, `orphan requirements: ${orphanRequirements.join(", ")}`);
  assert(/^Status: CLEAN$/m.test(artifacts["06-traceability.md"]), "traceability status is not CLEAN");
  assert(/TRACEABILITY: CLEAN\s*$/m.test(artifacts["06-traceability.md"]), "traceability clean marker is missing");

  const rootBrd = await readFile(path.join(root, "BRD.md"), "utf8");
  assert(/harness\/03-prd\.md/.test(rootBrd), "BRD.md does not point to the canonical PRD");
  const checklist = await readFile(path.join(root, "IMPLEMENTATION_CHECKLIST.md"), "utf8");
  assert(/Demo baseline \(completed before production programme\)/.test(checklist), "demo baseline appendix is missing");
  assert(completedSlices[0] === 0, "S00 issue is not complete");
  completedSlices.forEach((slice, index) => assert(slice === index, `completed slices are not contiguous at S${String(index).padStart(2, "0")}`));
  for (const slice of completedSlices) {
    const id = `S${String(slice).padStart(2, "0")}`;
    assert(new RegExp(`^- \\[x\\] ${id}[^\\n]*Complete`, "m").test(checklist), `${id} is not complete in the implementation checklist`);
  }
  const nextSlice = completedSlices.length;
  if (nextSlice <= 28) {
    const id = `S${String(nextSlice).padStart(2, "0")}`;
    assert(new RegExp(`^Next slice:\\s*${id}\\b`, "m").test(artifacts["HANDOFF.md"]), `handoff does not identify ${id} as next`);
  }

  console.log(`Harness verified: ${prdRequirements.size} requirements, ${issueFiles.length} slices, ${completedSlices.length} contiguous complete, no orphans.`);
}

main().catch((error) => {
  console.error(`Harness verification failed: ${error.message}`);
  process.exitCode = 1;
});
