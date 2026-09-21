# UIR-04 — Standardize primary production lists

Requirements: UIR-R007, UIR-R010, UIR-R015. Acceptance: Jobs, Customers, Vehicles, and Work Items share list conventions while preserving state, exports, permissions, documents, and lifecycle behavior.

Evidence: `ListWorkspace` supplies the shared semantic root and all four routes opt into the root list contract. Existing filter/view/result/pagination/export/empty conventions remain intact. Primary focused browser suites: 19 runnable passed across shell, Jobs, Customers/Vehicles, and Work Items; PostgreSQL-only cases were covered by `local:test`, which passed all authority/security checks after 45 migrations. Build, unit (30), production typecheck, verifier, and diff passed.
