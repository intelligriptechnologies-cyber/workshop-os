# UIR-02 — Restore the Production Workspace

Requirements: UIR-R001, UIR-R002, UIR-R003, UIR-R004. Acceptance: every tenant route uses a permission-filtered grouped shell with active state, persistence, mobile drawer, identity, Logout, and demo/platform separation.

Evidence: root composition wraps every tenant route and excludes `/demo` and `/platform`; the shell uses the session adapter, grouped permission navigation, `aria-current`, persisted collapse, mobile drawer with Escape/focus restoration, tenant/member identity, and local/Cognito Logout. `tests/ui-recovery-shell.spec.ts`: 3 passed. Unit: 30 passed. Build/typecheck/verifier/diff: passed. Real PostgreSQL `local:up` and `local:test`: PASS (45 migrations and all authority/security checks); stack shut down cleanly.
