# S03 — Versioned tenant configuration and masters

Status: Approved  
Implements: R-011, R-012, R-013, R-014, R-019, R-020

## Outcome
Provide tenant master CRUD/publication with stable lifecycle semantics, exact units/money, immutable effective versions, snapshots, and fiscal sequences.

## Acceptance criteria
- [ ] Draft masters can change; a used published version cannot, and a replacement has explicit effective dates.
- [ ] Activating scope snapshots price, tax, workflow, recipe, checklist, and policy so later publication does not alter it.
- [ ] Concurrent sequence allocation yields unique non-reused numbers per tenant/branch/type/financial year and exact minor-unit/fixed-decimal results.

