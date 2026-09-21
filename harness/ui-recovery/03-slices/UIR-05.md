# UIR-05 — Repair workshop execution UI

Requirements: UIR-R009, UIR-R011, UIR-R015. Acceptance: Media, Estimates, Tasks, QC, and Billing use shared visuals/dialogs without changing command rules.

Evidence: Media upload moved from the inline surface to `DirtyFormDialog` with validation, busy state, initial focus, dirty close, and restoration; archive remains a reason dialog. Estimate/Task/QC/Billing behavior remained intact. Execution-family Playwright: 9 runnable passed, 1 PostgreSQL-only skipped and covered by `local:test`. Build, unit (30), production typecheck, verifier, diff, and real PostgreSQL gate passed.
