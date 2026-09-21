# Reviewed UI recovery images

These deterministic 1280-pixel desktop checkpoints cover every distinct production page family required by UIR-09:

- `home-1280.png` — tenant workspace and dashboard
- `standard-list-1280.png` — shared list workspace
- `jobs-1280.png` — primary job records
- `media-1280.png` — workshop execution and upload dialog entry point
- `settings-1280.png` — administration and draft editing
- `roles-1280.png` — permission administration
- `billing-1280.png` — financial workflow
- `platform-1280.png` — security-separated platform administration

The images are captured from the deterministic local PostgreSQL stack by `node scripts/capture-ui-recovery.mjs` and manually inspected before the UIR-09 commit. Structural, responsive, accessibility, action-parity, and overflow assertions remain executable in `tests/v12-release-assurance.spec.ts`.
