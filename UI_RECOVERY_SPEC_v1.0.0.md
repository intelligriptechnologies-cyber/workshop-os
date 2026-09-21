# WorkshopOS UI Recovery Specification v1.0.0

Status: APPROVED FOR EXECUTION  
Date: 2026-09-21

## Problem and outcomes

The PostgreSQL-backed production routes are functionally substantial but visually fragmented. Recovery introduces one responsive and accessible tenant workspace, permission-filtered navigation, account identity and Logout, scoped visual primitives, consistent lists, and shared dialogs without changing backend authority or domain behavior. `/demo` remains isolated and `/platform` remains security-separated.

## Requirements

| ID | Requirement |
| --- | --- |
| UIR-R001 | One shared tenant production workspace surrounds every tenant route. |
| UIR-R002 | Permission-filtered grouped sidebar, active route, persisted collapse state, and mobile drawer are available. |
| UIR-R003 | Account identity and working Logout exist for local and Cognito sessions. |
| UIR-R004 | `/demo` remains isolated and `/platform` remains security-separated from tenant navigation. |
| UIR-R005 | Production styling is scoped and cannot collide with legacy demo CSS. |
| UIR-R006 | Controls, surfaces, tables, cards, badges, and states use one WorkshopOS visual interface. |
| UIR-R007 | List routes use consistent filter, view, result, pagination, export, and empty-state structure. |
| UIR-R008 | All routes preserve actions and usable layouts at 320, 768, and 1280 pixels. |
| UIR-R009 | Shared dialogs own validation, busy state, errors, focus, Escape, restoration, and dirty-close behavior. |
| UIR-R010 | Existing Customer, Vehicle, Job-command, and Work Item mutations follow shared conventions. |
| UIR-R011 | Existing Media, Billing, Estimate, Task, and QC create/edit flows use dialogs. |
| UIR-R012 | Existing Inventory, Material, Appointment, Follow-up, and Action Inbox mutations use dialogs. |
| UIR-R013 | Existing User, Role, Settings, Reports, Masters, Search, and Data Flow screens use shared conventions and dialogs where mutations exist. |
| UIR-R014 | Platform administration receives consistent controls, Logout, and dialog-based grant/emulation creation without tenant navigation. |
| UIR-R015 | Existing permissions, URL state, exports, concurrency, idempotency, lifecycle, and PostgreSQL behavior remain unchanged. |
| UIR-R016 | Structural and screenshot tests protect the shell and every distinct page family. |
| UIR-R017 | Missing Job/remaining-screen CRUD is recorded separately and is not falsely implemented as frontend-only behavior. |
| UIR-R018 | Checklist, evidence, percentages, commits, traceability, and handoffs remain current. |

## Non-goals

No new backend mutation, domain entity, lifecycle rule, frontend-only persistence, replacement of PostgreSQL authority, tenant navigation in platform, or redesign of `/demo`.

## Release contract

Completion requires UIR-00 through UIR-10, clean bidirectional traceability, the checklist release matrix, and honest documentation of manual limitations and deferred CRUD.
