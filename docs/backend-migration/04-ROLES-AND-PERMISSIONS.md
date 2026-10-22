# Roles and permissions

Seven built-in workshop roles are declared in `src/types.ts:1-2` and `src/admin-demo-state.ts:10-18`. Developer control-plane access and support emulation are separate concepts, not additional values of the workshop Role type. Custom demo role definitions exist, but arbitrary custom roles are not automatically supported by the fixed Role union or role-menu dispatch.

| ID | Role | Default sidebar page keys |
|---|---|---|
| ROLE-admin | Owner/Admin | dashboard, advance-bookings, approvals, data-flow, jobs, media, inward-purchases, manage, search, sales-leads, quotations, quotation-settings, admin-console |
| ROLE-service | Service Advisor | my-queue, job-card, estimate, follow-ups, media, search |
| ROLE-service_manager | Service Department Manager | my-queue, job-card, estimate, follow-ups, media, search |
| ROLE-reception | Reception | today-queue, advance-bookings, customers, vehicles, search |
| ROLE-accounts | Accounts | ready-to-invoice, invoice, payment, delivery, search |
| ROLE-store | Store | material-requests, issue-material, reconcile, stock, inward-purchases, search |
| ROLE-tech | Technician | my-tasks, work-update, qc-prep, search |

Owner/Admin additionally has Search operational grants for material-requests, issue-material, reconcile, stock, estimate, follow-ups. `resolveRoleMenuPageKeys` intersects a fixed role-owned menu with saved permitted pages. Granting a page outside that role's fixed menu does not automatically create a navigation entry. Owner `admin-console` access is protected. Role and page grants live in sessionStorage in local demo mode; user rows/role keys live in SQLite. Exact defaults and all custom-role validators are in [defaults](evidence-default-fixtures.json.md) and [operation contracts](evidence-operation-contracts.md).

## Record and command authority

| Operation | Observed local enforcement | Backend requirement |
|---|---|---|
| Job lifecycle / estimate | Owner or linked advisor; terminal CLOSED/CANCELLED read-only; service_manager is not included by canMutateJobLifecycle | Enforce actor-to-job linkage and terminal guards server-side; resolve manager discrepancy explicitly |
| Job task catalog | assertAdminAccess requires active Owner/Admin | Tenant-scoped owner authority |
| Invoice create/edit | Shared canCreateInvoice/canEditInvoice predicates; role, job stage, linkage and current invoice status matter | Preserve exact predicate, not blanket Accounts CRUD |
| Payment / void | assertBillingMutationAccess: Accounts/Owner; invoice/job/payment guards additionally apply | Atomic finance command, server-owned actor and amounts |
| Material request/release | Distinct manager/store/owner checks; pending/approved material approval blocks operations; invoiced rows constrained | Separate request, store issue and approval permissions |
| Purchase requests / orders | assertPurchaseActor; Store requests, Owner approval and later actions; status-specific commands | Do not expose unrestricted PO updates |
| Booking capacity override | Actor and reason guard; date/type capacity, excluding existing booking on edit | Capacity lock and explicit override audit |
| User archive | Reason, acting user and user constraints in archiveUser | Prevent actor spoofing and preserve history |
| Media / checklist | Actor-aware wrappers and terminal status checks | Same record scope and evidence restrictions |
| Backend tenant APIs | Existing TenantScope, permissions, branch and support-emulation checks | Audit existing code for parity before reuse; do not treat UI visibility as security |

The exact predicates are reproduced by symbol in `evidence-operation-contracts.md` and `evidence-private-data-contracts.md`; feature-specific controls and disabled reasons are in `evidence-ui-controls.md`. Some lower-level legacy CRUD functions accept no actor; frontend use of these is not evidence of secure authorization. Server-side authority must be derived from the authenticated session, not a trusted client actorId.

## Identity and external mode

Local demo login reads active SQLite user records and compares supplied credentials. The application offers quick demo identities. Passwords are redacted from the documentation record export. This mechanism is not a production authentication requirement. Existing `auth.ts` supports Cognito configuration, PKCE callback, session tokens, refresh and workshop membership. External users are represented with local id -1 and external identity fields; some UI branches switch to remote APIs while others retain SQLite state. This split must be reconciled before architecture is finalized.

Backend modules already model platform users, tenants, memberships, branches, roles, permissions and support emulation. Their presence is source-verified; deployment, populated records, RLS effectiveness and real Cognito sessions are UNVERIFIED in this audit. No external account was used and no invitation/message was sent.
