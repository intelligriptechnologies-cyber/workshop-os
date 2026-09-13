# Migrate billing, payment, gate, delivery, and closure

Status: Planned  
Implements: V12-R028, V12-R029  
Blocked by: V12-08, V12-10, V12-12

## Outcome

Deliver the production financial and custody path from final invoice through payment, receipt, pre-release gate pass, release, delivery acknowledgement, and closure.

## Acceptance criteria

- [ ] Final invoices and posted payments are immutable; authorized corrections use maker-checker approval and compensating records.
- [ ] Payment recording creates attributable receipt evidence and Payment Cleared is derived/enforced separately from Work Accepted.
- [ ] A gate pass is generated and authorization-checked before vehicle release; required documents/facts block release and closure.
- [ ] Delivery acknowledgement and closure append immutable custody/lifecycle history and cannot be reordered by direct API calls.

## Evidence

Pending.

