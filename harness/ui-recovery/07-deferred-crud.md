# Deferred CRUD Register

Status: explicit non-UI scope after UIR-08.

| Area | Existing authoritative behavior | Deferred backend/product work |
| --- | --- | --- |
| Jobs | List, detail, documents, lifecycle commands, hold/cancel/archive reasons | General Job creation and arbitrary field editing APIs |
| Appointments | Permitted production list, filters, views, pagination, export, details | Appointment create/reschedule/cancel mutations |
| Materials | Permitted production list, filters, views, pagination, export, details | General material-request/issue/reconciliation CRUD beyond currently exposed server commands |
| Reports | Permitted report list/export presentation | Report-definition authoring |
| Masters | Permitted production list, views, export, details | Master-data create/edit/archive APIs |
| Media | Upload, private access, scan lifecycle, archive | Metadata editing (no server mutation exists) |

These items are not implemented with browser-only state. They require separately specified, authorized, audited PostgreSQL APIs before UI controls may be added.
