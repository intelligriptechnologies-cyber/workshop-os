# UIR-03 — Establish the visual system

Requirements: UIR-R005, UIR-R006, UIR-R008. Acceptance: scoped tokens and semantic states are proven on Home, Jobs, and Customers at 320, 768, and 1280 pixels.

Evidence: legacy `styles.css` now loads only with lazy `/demo`; tenant tokens and semantic PageHeader, Surface, Button, Badge, and EmptyState interfaces are production-scoped. Home responsive contract passed at 1280/768/320; Home, Jobs, and Customers focused suites passed (12 runnable, 2 PostgreSQL-only skipped). Reviewed Home image is under `tests/ui-recovery/reviewed/`. Unit (30), build, production typecheck, diff, and the real PostgreSQL local gate all passed.
