# UIR-01 — Lock the regression baseline

Requirements: UIR-R016. Acceptance: references plus failing shell contracts cover sidebar, active navigation, identity, Logout, mobile navigation, and visual markers; mutation inventory is complete.

Evidence: `tests/ui-recovery/baseline/home-before.png` captures the deterministic 1280px baseline. `tests/ui-recovery-shell.spec.ts` has two observable contracts. RED confirmed on 2026-09-21: desktop could not find `Workshop navigation`; mobile could not find `Open navigation` (2 failed). Dialog inventory is recorded in `04-dialog-inventory.md`.
