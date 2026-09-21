# UIR-06 — Repair operational UI

Requirements: UIR-R007, UIR-R009, UIR-R012, UIR-R015. Acceptance: Inventory, Materials, Appointments, Follow-ups, and Action Inbox use shared list/detail/dialog conventions while preserving behavior.

Evidence: all five routes opt into the list-workspace contract; remaining-screen lists use the shared semantic root. Inventory receipt validation now belongs to its dialog; receipt/import and follow-up/action completion flows retain accessible modal/reason handling. Focused operational Playwright: 9 runnable passed, 2 PostgreSQL-only skipped and covered by the passing 45-migration local gate. Build, unit (30), production typecheck, verifier, and diff passed.
