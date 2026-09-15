import assert from "node:assert/strict";
import test from "node:test";

import { projectJobLifecycle } from "../src/job-lifecycle.js";

test("projection keeps acceptance facts distinct and exposes actionable release blockers", () => {
  const projected = projectJobLifecycle({
    stage: "BILLING",
    version: 7,
    held: false,
    archived: false,
    facts: {
      estimateApproved: true,
      workAccepted: false,
      paymentCleared: false,
      invoiceFinalized: true,
      gatePassIssued: false,
      vehicleReleased: false,
    },
  });

  assert.deepEqual(projected.facts, {
    estimateApproved: true,
    workAccepted: false,
    paymentCleared: false,
  });
  assert.deepEqual(
    projected.validActions
      .find((action) => action.command === "ADVANCE")
      ?.blockers.map((blocker) => blocker.code),
    [
      "WORK_NOT_COMPLETE",
      "QC_NOT_PASSED",
      "MATERIAL_NOT_RECONCILED",
      "SUPPLEMENTARY_SCOPE_UNRESOLVED",
      "WORK_ACCEPTANCE_REQUIRED",
      "PAYMENT_CLEARANCE_REQUIRED",
      "GATE_PASS_REQUIRED",
      "INCIDENT_UNRESOLVED",
      "DELIVERY_EVIDENCE_MISSING",
    ],
  );
  assert.equal(
    projected.validActions.find(
      (action) => action.command === "RECORD_WORK_ACCEPTED",
    )?.reasonRequired,
    true,
  );
});

test("Hold is an overlay and resume retains the underlying canonical stage", () => {
  const projected = projectJobLifecycle({
    stage: "ACTIVE",
    version: 3,
    held: true,
    archived: false,
    facts: {},
  });

  assert.equal(projected.canonicalStage, "ACTIVE");
  assert.equal(projected.displayStage, "On Hold — In Progress");
  assert.deepEqual(
    projected.validActions.map((action) => action.command),
    ["RESUME", "CANCEL"],
  );
  assert.ok(projected.validActions.every((action) => action.reasonRequired));
});

test("cancelled Jobs can only reopen to their recorded stage or archive, never delete", () => {
  const projected = projectJobLifecycle({
    stage: "CANCELLED",
    version: 5,
    held: false,
    archived: false,
    resumeStage: "INSPECTION",
    facts: {},
  });

  assert.deepEqual(
    projected.validActions.map((action) => action.command),
    ["REOPEN", "ARCHIVE"],
  );
  assert.equal(projected.validActions[0].targetStage, "INSPECTION");
  assert.equal(
    projected.validActions.some(
      (action) => action.command === ("DELETE" as never),
    ),
    false,
  );
});
