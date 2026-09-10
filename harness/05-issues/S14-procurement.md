# S14 — Supplier and procurement workflow

Status: Approved  
Implements: R-057, R-058, R-059, R-060

## Outcome
Manage suppliers, requisitions, POs, GRNs, landed cost, discrepancies, partials, and purchase returns.

## Acceptance criteria
- [ ] Supplier duplicates/status/tax/terms are controlled; requisition and PO versions follow thresholds and retain cancellation/partial history.
- [ ] Idempotent GRN posts accepted lots/rolls/value once and preserves rejected/discrepant evidence.
- [ ] Purchase returns reference eligible receipt stock and create approved compensating stock/value entries without destructive edits.

