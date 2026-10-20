# `a315448` UI parity gate

Reference: `Prem-dev-fbb` commit `a315448`, running against its bundled SQLite file.
The captured navigation inventory is in [reference-pages-a315448.json](reference-pages-a315448.json).
The local capture directory `.scratch/reference-capture-a315448/` contains 102
desktop and mobile screenshots, covering 51 role/page combinations, plus
`controls.json` with the visible button, select, and input inventory.

| Workflow | Reference actions to preserve | PostgreSQL parity |
| --- | --- | --- |
| Login | Workshop, user, password, sign in, logout | Workshop and user dropdown flow implemented; automated login/session tests pass |
| Dashboard and navigation | Role menus, drilldowns, search, filters, browser navigation | Not visually or behaviorally reconciled |
| Reception and bookings | Today queue, calls, reschedule, cancel, no-show, check-in, calendar, daily limits, booking dialog | Not reconciled; current remote booking desk uses a different table/form |
| Customers and vehicles | Search, view mode, add/edit, linked selection | Not reconciled |
| Job Cards and estimates | Filters, lifecycle, dialogs, service tasks, documents | Not reconciled |
| Approvals, materials, inventory | Approve, reserve, issue, reconcile, purchase orders, stock | Not reconciled |
| Finance and sales | Invoice, payment, delivery, leads, quotations, downloads | Not reconciled |
| Admin settings | Users, roles, templates, theme, catalogue | Not reconciled |

The existing remote page components in `src/App.tsx` are still selected for
database sessions. Several have layouts and controls that differ from the
reference. Keep the current deployment active until every row above has a
fixed-viewport screenshot comparison and end-to-end command check. The 2026-10-19
database rehearsal validates the data import only; it does not clear this gate.
