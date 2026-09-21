# UIR-08 — Repair Platform Administration

Requirements: UIR-R004, UIR-R014, UIR-R015. Acceptance: independent platform identity/Logout and grant/emulation dialogs exist without tenant navigation or ambient access.

Evidence: the platform-only header presents its principal and working local/Cognito Logout; grant and emulation requests use validated dirty form dialogs. Platform Playwright proves no tenant navigation, explicit tenant scope, independent approval, exact emulation scope, dialogs, and local Logout (2 runnable passed, 1 PostgreSQL-only covered by `local:test`). Build, unit (30), production typecheck, verifier, diff, and real PostgreSQL gate passed.
