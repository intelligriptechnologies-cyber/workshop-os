# UIR-07 — Repair administration UI

Requirements: UIR-R009, UIR-R013, UIR-R015. Acceptance: Users, Roles, Settings, Reports, Masters, Search, and Data Flow use shared conventions and retain protections.

Evidence: Business Settings draft editing now uses a wide `DirtyFormDialog` with focus restoration and dirty-close handling while versioned save/publication and branch inheritance remain unchanged. Users/Roles keep their existing accessible mutation dialogs; Reports/Masters/Search/Data Flow retain read/export/command behavior. Administration Playwright: 16 runnable passed, 6 PostgreSQL-only skipped and covered by the passing local gate. Build, unit (30), production typecheck, verifier, and diff passed.
