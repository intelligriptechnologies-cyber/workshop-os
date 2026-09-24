# Report Templates and Company Settings — Implementation Checklist

## Slice 1 — Company identity settings

- [x] Add the Build Company Settings Admin Console tab.
- [x] Reuse the business profile name as the canonical company name.
- [x] Validate PNG/JPEG/WebP uploads up to 1 MB without replacing valid drafts on failure.
- [x] Preview and draft-clear logo, stamp, and authorized signature images.
- [x] Save company name and all images atomically; preserve saved state on storage failure.
- [x] Support reset and session refresh persistence.

## Slice 2 — Template editor and preview

- [x] Seed one active template for Invoice, Gate Pass, Job Card, and Payment Receipt.
- [x] Add category/template selectors, new/update actions, and active-template transfer.
- [x] Enforce required HTML/name and case-insensitive category-local name uniqueness.
- [x] Prevent leaving a category without one active template.
- [x] Confirm dirty category/template/Admin-tab navigation and browser unload.
- [x] Render deterministic sample data in Type/Preview modes.
- [x] Escape scalar data and sanitize executable/unsupported HTML, attributes, styles, and URLs.
- [x] Reject and display unsupported placeholders.

## Slice 3 — Invoice and Gate Pass integration

- [x] Resolve the active template from current session state at print time.
- [x] Print sanitized Invoice and Gate Pass documents with a restrictive CSP.
- [x] Preserve the existing Estimate jsPDF path.
- [x] Expose actions in Job Documents and Data Flow.
- [x] Show an actionable popup-blocker error.

## Slice 4 — Job Card and Payment Receipt

- [x] Make Job Card output available for every job.
- [x] Make Payment Receipt available only with a receipt record and at least one payment.
- [x] Render receipt number, all payments, paid total, invoice total, and balance.
- [x] Render configured logo, stamp, and signature blocks.
- [x] Show available/unavailable states in Job Documents and Data Flow.

## Slice 5 — Verification

- [x] Unit tests: defaults, hydration, validation, activation, immutability, placeholders, availability, and aggregation.
- [x] Production TypeScript/Vite build.
- [x] Playwright tests: company settings, templates, dirty navigation, sanitization, persistence, print actions, and regressions.
- [x] Visual QA at desktop and 390 px widths for both Admin tabs and all four previews.
- [x] Visual QA for uploaded-image scaling and all four operational print layouts.
- [x] Refresh the Graft graph after implementation.

## Verification record

- `npm run test:unit` — 32 passed.
- `npm run build` — passed (Vite bundle-size advisory only).
- `npm run test:e2e -- --workers=1` on a fresh preview port — 33 passed.
