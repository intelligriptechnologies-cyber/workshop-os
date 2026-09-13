# WorkshopOS v1.2 intake

Status: CONFIRMED  
Confirmed from: approved v1.2 execution plan and `spec v2 UI cahnges prompt.txt`  
Date: 2026-09-13

## Problem restatement

The current WorkshopOS PWA demonstrates rich workshop behavior but most screens still treat browser-local `sql.js` state as authoritative. v1.2 must move those experiences to authenticated production `/api/v1` operations backed by PostgreSQL while making CRUD, lists, exports, Job workflow, media, tenant administration, platform support, and accessibility consistent, safe, and testable. Existing canonical domain rules and immutable records must be preserved, and local evidence must never be confused with real deployment or manual certification.

## Confirmed users and constraints

Tenant administrators, owners, branch managers, receptionists, service advisors, technicians, stores staff, accounts/cashiers, gate/security staff, and distinct Platform Super Admin operators use the system. The approved v1.1 production stack, scale, availability, privacy, tenant isolation, and India-first operating assumptions remain in force. v1.2 is an incremental migration, not a rewrite and not authorization to deploy, import live data, or contact external systems.

## Capability decomposition

| Requested capability | Classification |
| --- | --- |
| Dialog-based CRUD everywhere | Feature plus accessibility constraint |
| Pagination, search, filters, Refresh, Clear, grid/table | Cross-screen feature family |
| PDF/XLSX and Job document downloads | Feature family plus privacy constraint |
| Job List date default and orange In Progress | Feature/presentation rule |
| Job lifecycle controls and Data Flow explanation | Multiple features plus domain invariants |
| Job-linked media and lifecycle categories | Multiple features plus storage/security constraints |
| Production users, roles, and settings | Multiple administration features |
| Inventory analytics and import | Multiple features plus reconciliation controls |
| Platform logs, support, and emulation | Multiple platform features plus high-risk controls |
| Production API/PostgreSQL authority | Architecture and migration constraint |
| WCAG/responsive behavior | Release constraint |
| Traceability, verification, handoffs | Programme governance constraint |

## Non-goals

Changing canonical lifecycle stages; hard-deleting cancelled Jobs or immutable operational/financial/audit records; storing private originals in PostgreSQL; authorizing external deployment, live import, provider contact, or pilot activity; treating fixtures as certification; or expanding the historical S00–S28 programme.

## Definition of done

V12-00 through V12-16 are complete with clean bidirectional traceability and passing build, unit, production, typecheck, PostgreSQL integration, Playwright, historical harness, v1.2 verifier, and diff gates. No rich production screen relies on `sql.js` as authority. External and manual certification gaps are recorded as blockers rather than marked complete.

