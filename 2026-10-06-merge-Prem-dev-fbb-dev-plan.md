# Merge notes — Prem-dev-fbb

**Date:** 2026-10-06  
**Source branch:** `origin/Prem-dev-fbb` (tip: `97b5a9a`)  
**Target branch:** `prem-dev-fbb-backend`  
**Merge commit:** `adbf2cc`

## Summary

Merged 45 source-branch commits into the backend branch. The source branch
extends the existing multi-tenant WorkshopOS foundation with operational,
procurement, finance, booking, and sales-CRM workflows, plus their API,
migration, browser, integration, and unit-test coverage.

## Changes brought in

- **Bookings and workshop operations:** booking lifecycle, calendar/capacity,
  expected-today reception view, check-in conversion, follow-ups, improved
  responsive filters/pickers, job-card search, and technician execution/QC.
- **Store and purchasing:** tenant-scoped inventory, material reservations,
  store purchase requests, commercial approval, supplier/price comparison,
  purchase-order issue, partial-delivery confirmation, stock inward, and the
  closed-PO audit view. The supporting purchase-order specs and issue notes are
  included under `wayfinder/` and `.scratch/`.
- **Finance and documents:** API-backed finance delivery, invoice issuance and
  corrections, credit-note and replacement-invoice safeguards, financial
  document rendering/download protection, and associated test coverage.
- **Backend platform:** local FastAPI/PostgreSQL foundation, tenant isolation
  and RLS tests, superadmin/tenant administration, Alembic migrations through
  `20261006_0017_lead_not_entered_flags`, and staging Docker/Compose/GitHub
  Actions deployment assets.
- **Follow-ups and search:** authenticated follow-up creation plus remote/API
  search and follow-up workflow restoration.
- **Sales CRM and quotations:** sales-lead register/dialog/API integration,
  lead and quotation workflow enhancements, quotation UI/filtering, reporting
  updates, and final lead-register styling refinements.
- **Quality coverage:** backend integration and unit suites, Playwright/browser
  assertions, and frontend unit tests were expanded or realigned to the new
  workflows.

## Merge resolution

The branches had diverged: the target had the earlier `3e9965d` multi-tenant
foundation, while `Prem-dev-fbb` carried its later evolution. Twenty-four
conflicts were resolved in favor of `Prem-dev-fbb` so the latest implementations
and their subsequent safeguards remain intact. Notable examples include the
finance workflow, application shell, admin console, backend configuration, and
their tests.

## Suggested development plan

1. Install/update dependencies for both the frontend and `backend/` services,
   then apply the Alembic migration chain to a disposable local database.
2. Run backend unit and integration tests, then frontend unit tests and the
   Playwright suite; address environment-specific failures separately from
   functional regressions.
3. Exercise the end-to-end operational path: booking → check-in → job →
   material reservation → purchase request/PO → receipt/stock inward → invoice
   or credit-note handling.
4. Validate tenant isolation and role permissions with at least two tenants,
   particularly for store, finance, sales, and superadmin screens.
5. Use the staging compose/environment templates to deploy a non-production
   smoke environment before promoting the branch or pushing the merge commit.

## Scope reference

The imported history spans `7465f38` through `97b5a9a`. The substantive final
source commits are `86ebff6`, `b155490`, `016a032`, and `c43caf3`, which focus
on sales CRM, leads, quotations, and reporting; `97b5a9a` only saves the final
lead-register/style adjustments.
