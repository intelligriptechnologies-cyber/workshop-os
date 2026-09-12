# Dead-letter diagnosis and replay

Owner: application-operations

## Immediate actions

1. Group dead letters by tenant, branch, effect kind, safe error code, and correlation reference without exposing payloads.
2. Decide whether the cause is transient, permanent data rejection, provider failure, or an application defect.
3. Block replay until the cause is corrected and a named operator records the reason and scope.

## Recovery

1. Use the original delivery and effect key through the authorized replay command; never create a substitute posting or edit append-only attempt evidence.
2. Replay one canary, verify its effect, then process a bounded batch. Keep invalid permanent records quarantined with an actionable resolution.
3. Stop immediately on renewed failures, scope mismatch, stale resource state, or any duplicate-effect signal.

## Verification

Confirm each replay has one authorization record, one terminal effect at most, complete attempt history, original correlation, and tenant/branch isolation. Reconcile downstream documents, notifications, or provider acknowledgements as applicable.

## Escalation

Escalate application defects to engineering, suspected data or authorization faults to security, provider faults to integration operations, and financial/document divergence to the qualified business owner before further replay.
