import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const harness = path.join(root, "harness", "v1.2");
const releaseMode = process.argv.includes("--release");
const requiredArtifacts = [
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

function idSet(text, pattern) {
  return new Set([...text.matchAll(pattern)].map((match) => match[1]));
}

function expectedId(prefix, number) {
  return `${prefix}${String(number).padStart(prefix === "V12-R" ? 3 : 2, "0")}`;
}

function expandRequirementReferences(text) {
  const expanded = new Set(idSet(text, /(V12-R\d{3})/g));
  const rangePattern = /V12-R(\d{3})\s*[–-]\s*V12-R(\d{3})/g;
  for (const match of text.matchAll(rangePattern)) {
    const first = Number(match[1]);
    const last = Number(match[2]);
    assert(first <= last, `reversed requirement range ${match[0]}`);
    for (let number = first; number <= last; number += 1) {
      expanded.add(expectedId("V12-R", number));
    }
  }
  return expanded;
}

function checklistState(text) {
  const rows = [...text.matchAll(/^- \[([ x])\] (V12-\d{2})\b.*$/gm)];
  assert(rows.length === 17, `expected 17 checklist rows, found ${rows.length}`);
  const states = new Map();
  for (const [, mark, id] of rows) {
    assert(!states.has(id), `duplicate checklist row ${id}`);
    states.set(id, mark === "x");
  }
  return states;
}

async function main() {
  const artifacts = Object.fromEntries(
    await Promise.all(requiredArtifacts.map(async (name) => [name, await readFile(path.join(harness, name), "utf8")])),
  );
  const spec = await readFile(path.join(root, "UI_ENHANCEMENT_SPEC_v1.2.0.md"), "utf8");
  const checklist = await readFile(path.join(root, "UI_ENHANCEMENT_CHECKLIST_v1.2.0.md"), "utf8");
  assert(/^Status: Approved for local implementation\s*$/m.test(spec), "v1.2 specification is not approved");
  assert(/harness\/v1\.2\/03-prd\.md/.test(spec), "specification does not identify the canonical v1.2 PRD");

  const prdRequirements = idSet(artifacts["03-prd.md"], /^### (V12-R\d{3})\b/gm);
  assert(prdRequirements.size === 36, `expected 36 PRD requirements, found ${prdRequirements.size}`);
  for (let number = 1; number <= 36; number += 1) {
    assert(prdRequirements.has(expectedId("V12-R", number)), `missing contiguous requirement ${expectedId("V12-R", number)}`);
  }

  const issueDirectory = path.join(harness, "05-issues");
  const issueFiles = (await readdir(issueDirectory)).filter((name) => /^V12-\d{2}-.*\.md$/.test(name)).sort();
  assert(issueFiles.length === 17, `expected 17 slice files, found ${issueFiles.length}`);
  const sliceIds = issueFiles.map((name) => name.slice(0, 6));
  assert(new Set(sliceIds).size === 17, "slice IDs must be unique");
  for (let number = 0; number <= 16; number += 1) {
    assert(sliceIds[number] === expectedId("V12-", number), `missing or out-of-order slice ${expectedId("V12-", number)}`);
  }

  const productMappings = new Map([...prdRequirements].map((id) => [id, new Set()]));
  const statuses = new Map();
  for (const file of issueFiles) {
    const sliceId = file.slice(0, 6);
    const issue = await readFile(path.join(issueDirectory, file), "utf8");
    const status = issue.match(/^Status:\s*(Complete|Planned)\s*$/m)?.[1];
    assert(status, `${file} has invalid or missing Status`);
    statuses.set(sliceId, status);
    assert(/^Blocked by:\s*.+$/m.test(issue), `${file} is missing Blocked by`);
    const implementsLine = issue.match(/^Implements:\s*(.+)$/m);
    assert(implementsLine, `${file} is missing Implements`);
    const mappings = expandRequirementReferences(implementsLine[1]);
    assert(mappings.size > 0, `${file} has no requirement mappings`);
    for (const requirement of mappings) {
      assert(prdRequirements.has(requirement), `${file} references unknown ${requirement}`);
      if (sliceId !== "V12-00") productMappings.get(requirement).add(sliceId);
    }
    assert(/^## Acceptance criteria$/m.test(issue), `${file} is missing acceptance criteria`);
    const criteria = [...issue.matchAll(/^- \[([ x])\] .+$/gm)];
    assert(criteria.length > 0, `${file} has no testable acceptance criteria`);
    if (status === "Complete") {
      assert(criteria.every((criterion) => criterion[1] === "x"), `${file} is complete with unchecked acceptance criteria`);
      const evidence = issue.split(/^## Evidence\s*$/m)[1]?.split(/^## /m)[0]?.trim() ?? "";
      assert(evidence && !/^Pending\.?$/i.test(evidence), `${file} is complete without acceptance evidence`);
    } else {
      assert(criteria.every((criterion) => criterion[1] === " "), `${file} has checked tasks while still Planned`);
    }
  }

  for (const [requirement, slices] of productMappings) {
    assert(slices.size > 0, `orphan requirement ${requirement}: V12-00 governance mapping does not count as delivery`);
  }
  for (const sliceId of sliceIds.slice(1)) {
    assert([...productMappings.values()].some((slices) => slices.has(sliceId)), `orphan product slice ${sliceId}`);
  }

  let firstPlanned = 17;
  for (let number = 0; number <= 16; number += 1) {
    const id = expectedId("V12-", number);
    if (statuses.get(id) === "Planned") firstPlanned = Math.min(firstPlanned, number);
    if (number > firstPlanned) assert(statuses.get(id) !== "Complete", `skipped slice: ${id} is complete before V12-${String(firstPlanned).padStart(2, "0")}`);
  }
  const completedCount = firstPlanned;
  assert(statuses.get("V12-00") === "Complete", "V12-00 must be the first completed slice");

  const checks = checklistState(checklist);
  for (let number = 0; number <= 16; number += 1) {
    const id = expectedId("V12-", number);
    assert(checks.has(id), `checklist is missing ${id}`);
    assert(checks.get(id) === (statuses.get(id) === "Complete"), `${id} checklist state does not match its slice status`);
  }

  const traceability = artifacts["06-traceability.md"];
  assert(/^Status: CLEAN\s*$/m.test(traceability), "traceability status is not CLEAN");
  assert(/TRACEABILITY: CLEAN\s*$/.test(traceability), "traceability clean marker is missing");
  const traceReferences = expandRequirementReferences(traceability);
  for (const requirement of prdRequirements) {
    assert(traceReferences.has(requirement), `traceability matrix omits ${requirement}`);
  }

  const handoff = artifacts["HANDOFF.md"];
  const expectedCompleted = expectedId("V12-", Math.max(0, completedCount - 1));
  const expectedNext = completedCount === 17 ? "NONE" : expectedId("V12-", completedCount);
  const recordedCompleted = handoff.match(/^Completed slice:[ \t]*(\S+)[ \t]*$/m)?.[1];
  const recordedNext = handoff.match(/^Next slice:[ \t]*(\S+)[ \t]*$/m)?.[1];
  assert(recordedCompleted === expectedCompleted, `stale handoff: Completed slice must be ${expectedCompleted}`);
  assert(recordedNext === expectedNext, `stale handoff: Next slice must be ${expectedNext}`);
  assert(/^Updated:[ \t]*\d{4}-\d{2}-\d{2}[ \t]*\r?$/m.test(handoff), "handoff is missing an ISO Updated date");
  for (const heading of ["Requirement IDs implemented", "Changed paths", "Focused and regression evidence", "Preserved pre-existing changes", "Risks and blockers"]) {
    assert(new RegExp(`^## ${heading}$`, "m").test(handoff), `handoff is missing ${heading}`);
  }

  if (releaseMode) {
    assert(completedCount === 17, `release verification requires all 17 slices complete; found ${completedCount}`);
    assert(!/^- \[ \] V12-/m.test(checklist), "release verification rejects unchecked slice tasks");
    assert(/remaining external|external.*remain/i.test(handoff), "release handoff must explicitly record remaining external/manual evidence");
  }

  console.log(`WorkshopOS v1.2 verified: ${prdRequirements.size} requirements, ${issueFiles.length} slices, ${completedCount} contiguous complete, no orphans; next ${expectedNext}.`);
}

main().catch((error) => {
  console.error(`WorkshopOS v1.2 verification failed: ${error.message}`);
  process.exitCode = 1;
});
