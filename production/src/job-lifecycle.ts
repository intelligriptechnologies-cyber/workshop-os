export const JOB_LIFECYCLE_STAGES = [
  "APPOINTMENT",
  "CHECK_IN",
  "INSPECTION",
  "ESTIMATE",
  "APPROVED",
  "ACTIVE",
  "QC",
  "BILLING",
  "GATE_VERIFICATION",
  "DELIVERED",
  "CLOSED",
  "CANCELLED",
] as const;

export type JobLifecycleStage = (typeof JOB_LIFECYCLE_STAGES)[number];
export type JobLifecycleCommand =
  | "ADVANCE"
  | "RETURN_TO_WORK"
  | "HOLD"
  | "RESUME"
  | "CANCEL"
  | "REOPEN"
  | "ARCHIVE"
  | "RECORD_ESTIMATE_APPROVED"
  | "RECORD_WORK_ACCEPTED"
  | "RECORD_PAYMENT_CLEARED";

export type JobLifecycleFacts = {
  estimateApproved?: boolean;
  workAccepted?: boolean;
  paymentCleared?: boolean;
  invoiceFinalized?: boolean;
  gatePassIssued?: boolean;
  gateVerified?: boolean;
  vehicleReleased?: boolean;
  workComplete?: boolean;
  qcPassed?: boolean;
  materialsReconciled?: boolean;
  supplementaryScopeResolved?: boolean;
  incidentsResolved?: boolean;
  deliveryEvidenceCaptured?: boolean;
};

export type JobLifecycleBlocker = {
  code: string;
  message: string;
  resolution: string;
};
export type JobLifecycleAction = {
  command: JobLifecycleCommand;
  label: string;
  targetStage?: JobLifecycleStage;
  reasonRequired: boolean;
  blockers: JobLifecycleBlocker[];
};

const LABELS: Record<JobLifecycleStage, string> = {
  APPOINTMENT: "Appointment",
  CHECK_IN: "Checked In",
  INSPECTION: "Inspection",
  ESTIMATE: "Estimate",
  APPROVED: "Estimate Approved",
  ACTIVE: "In Progress",
  QC: "Quality Control",
  BILLING: "Billing",
  GATE_VERIFICATION: "Gate Verification",
  DELIVERED: "Delivered",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

const NEXT: Partial<Record<JobLifecycleStage, JobLifecycleStage>> = {
  APPOINTMENT: "CHECK_IN",
  CHECK_IN: "INSPECTION",
  INSPECTION: "ESTIMATE",
  ESTIMATE: "APPROVED",
  APPROVED: "ACTIVE",
  ACTIVE: "QC",
  QC: "BILLING",
  BILLING: "GATE_VERIFICATION",
  GATE_VERIFICATION: "DELIVERED",
  DELIVERED: "CLOSED",
};

const blocker = (
  code: string,
  message: string,
  resolution: string,
): JobLifecycleBlocker => ({ code, message, resolution });

function blockersFor(
  target: JobLifecycleStage,
  facts: JobLifecycleFacts,
): JobLifecycleBlocker[] {
  const blockers: JobLifecycleBlocker[] = [];
  if (
    (target === "APPROVED" || target === "ACTIVE") &&
    !facts.estimateApproved
  ) {
    blockers.push(
      blocker(
        "ESTIMATE_APPROVAL_REQUIRED",
        "Estimate Approved has not been recorded.",
        "Record Estimate Approved before advancing.",
      ),
    );
  }
  if (
    ["QC", "BILLING", "GATE_VERIFICATION"].includes(target) &&
    !facts.workComplete
  )
    blockers.push(
      blocker(
        "WORK_NOT_COMPLETE",
        "Required work is not complete.",
        "Complete every required work task before advancing.",
      ),
    );
  if (["BILLING", "GATE_VERIFICATION"].includes(target)) {
    if (!facts.qcPassed)
      blockers.push(
        blocker(
          "QC_NOT_PASSED",
          "Independent QC has not passed.",
          "Complete QC or its authorized override before advancing.",
        ),
      );
    if (!facts.materialsReconciled)
      blockers.push(
        blocker(
          "MATERIAL_NOT_RECONCILED",
          "Issued material is not fully reconciled.",
          "Reconcile consumption, returns, wastage, and approved variance.",
        ),
      );
    if (!facts.supplementaryScopeResolved)
      blockers.push(
        blocker(
          "SUPPLEMENTARY_SCOPE_UNRESOLVED",
          "Supplementary scope remains unresolved.",
          "Resolve every supplementary estimate before advancing.",
        ),
      );
  }
  if (target === "GATE_VERIFICATION" || target === "CLOSED") {
    if (!facts.workAccepted)
      blockers.push(
        blocker(
          "WORK_ACCEPTANCE_REQUIRED",
          "The customer has not accepted the completed work.",
          "Record Work Accepted.",
        ),
      );
    if (!facts.paymentCleared)
      blockers.push(
        blocker(
          "PAYMENT_CLEARANCE_REQUIRED",
          "Payment Cleared has not been recorded.",
          "Record Payment Cleared or complete the ordinary approved-credit process.",
        ),
      );
  }
  if (target === "GATE_VERIFICATION") {
    if (!facts.invoiceFinalized)
      blockers.push(
        blocker(
          "FINAL_INVOICE_REQUIRED",
          "A final invoice is not available.",
          "Finalize the invoice before release.",
        ),
      );
    if (!facts.gatePassIssued)
      blockers.push(
        blocker(
          "GATE_PASS_REQUIRED",
          "A valid gate pass has not been issued.",
          "Generate the gate pass before vehicle release.",
        ),
      );
    if (!facts.incidentsResolved)
      blockers.push(
        blocker(
          "INCIDENT_UNRESOLVED",
          "A custody incident remains open.",
          "Resolve every custody incident before release.",
        ),
      );
    if (!facts.deliveryEvidenceCaptured)
      blockers.push(
        blocker(
          "DELIVERY_EVIDENCE_MISSING",
          "Required delivery evidence has not been captured.",
          "Capture the configured delivery acknowledgement and evidence.",
        ),
      );
  }
  if (target === "DELIVERED" && !facts.gateVerified)
    blockers.push(
      blocker(
        "GATE_VERIFICATION_REQUIRED",
        "Gate/Security has not independently verified the release.",
        "Complete gate verification.",
      ),
    );
  if (target === "CLOSED" && !facts.vehicleReleased)
    blockers.push(
      blocker(
        "VEHICLE_RELEASE_REQUIRED",
        "Vehicle release has not been recorded.",
        "Record vehicle release before closure.",
      ),
    );
  return blockers;
}

export function projectJobLifecycle(input: {
  stage: JobLifecycleStage;
  version: number;
  held: boolean;
  archived: boolean;
  resumeStage?: JobLifecycleStage;
  facts: JobLifecycleFacts;
}) {
  const facts = {
    estimateApproved: input.facts.estimateApproved === true,
    workAccepted: input.facts.workAccepted === true,
    paymentCleared: input.facts.paymentCleared === true,
  };
  let validActions: JobLifecycleAction[] = [];
  if (!input.archived) {
    if (input.stage === "CANCELLED") {
      if (input.resumeStage)
        validActions.push({
          command: "REOPEN",
          label: `Reopen at ${LABELS[input.resumeStage]}`,
          targetStage: input.resumeStage,
          reasonRequired: true,
          blockers: [],
        });
      validActions.push({
        command: "ARCHIVE",
        label: "Archive Job",
        reasonRequired: true,
        blockers: [],
      });
    } else if (input.held) {
      validActions = [
        {
          command: "RESUME",
          label: `Resume ${LABELS[input.stage]}`,
          targetStage: input.stage,
          reasonRequired: true,
          blockers: [],
        },
        {
          command: "CANCEL",
          label: "Cancel Job",
          targetStage: "CANCELLED",
          reasonRequired: true,
          blockers: [],
        },
      ];
    } else {
      const next = NEXT[input.stage];
      if (next)
        validActions.push({
          command: "ADVANCE",
          label: `Advance to ${LABELS[next]}`,
          targetStage: next,
          reasonRequired: false,
          blockers: blockersFor(next, input.facts),
        });
      if (input.stage === "QC")
        validActions.push({
          command: "RETURN_TO_WORK",
          label: "Return to In Progress",
          targetStage: "ACTIVE",
          reasonRequired: true,
          blockers: [],
        });
      if (
        !facts.estimateApproved &&
        ["ESTIMATE", "APPROVED"].includes(input.stage)
      )
        validActions.push({
          command: "RECORD_ESTIMATE_APPROVED",
          label: "Record Estimate Approved",
          reasonRequired: true,
          blockers: [],
        });
      if (
        !facts.workAccepted &&
        ["QC", "BILLING", "GATE_VERIFICATION"].includes(input.stage)
      )
        validActions.push({
          command: "RECORD_WORK_ACCEPTED",
          label: "Record Work Accepted",
          reasonRequired: true,
          blockers: [],
        });
      if (
        !facts.paymentCleared &&
        ["BILLING", "GATE_VERIFICATION"].includes(input.stage)
      )
        validActions.push({
          command: "RECORD_PAYMENT_CLEARED",
          label: "Record Payment Cleared",
          reasonRequired: true,
          blockers: [],
        });
      if (input.stage !== "CLOSED") {
        validActions.push({
          command: "HOLD",
          label: "Place on Hold",
          targetStage: input.stage,
          reasonRequired: true,
          blockers: [],
        });
        validActions.push({
          command: "CANCEL",
          label: "Cancel Job",
          targetStage: "CANCELLED",
          reasonRequired: true,
          blockers: [],
        });
      }
    }
  }
  return {
    canonicalStage: input.stage,
    canonicalStageLabel: LABELS[input.stage],
    displayStage: input.held
      ? `On Hold — ${LABELS[input.stage]}`
      : LABELS[input.stage],
    held: input.held,
    archived: input.archived,
    version: input.version,
    facts,
    validActions,
  };
}

export function isJobLifecycleCommand(
  value: unknown,
): value is JobLifecycleCommand {
  return (
    typeof value === "string" &&
    [
      "ADVANCE",
      "RETURN_TO_WORK",
      "HOLD",
      "RESUME",
      "CANCEL",
      "REOPEN",
      "ARCHIVE",
      "RECORD_ESTIMATE_APPROVED",
      "RECORD_WORK_ACCEPTED",
      "RECORD_PAYMENT_CLEARED",
    ].includes(value)
  );
}
