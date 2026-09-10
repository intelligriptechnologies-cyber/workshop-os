# S15 — Job material control and reconciliation

Status: Approved  
Implements: R-061, R-062, R-063

## Outcome
Control request, Store issue, technician consumption/waste, verified return, and Manager-approved variance.

## Acceptance criteria
- [ ] Store cannot issue without approved Job/task demand or separately approved reason, available authorized stock, and exact lot/UOM data.
- [ ] Technician outcomes and Store return verification preserve evidence and separation of duties.
- [ ] Reconciliation blocks until `Issued = Consumed + Verified Return + Wastage + Approved Variance`; excess/variance thresholds require Manager approval under concurrency.

