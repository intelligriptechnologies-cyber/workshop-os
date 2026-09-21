# Dialog Inventory

| Family | Baseline | Recovery |
| --- | --- | --- |
| Customers / Vehicles | Dirty create/edit dialog | Retain and restyle |
| Work Items | Dirty create/edit and reason dialogs | Retain and restyle |
| Jobs | Reason commands; no general create/edit API | Retain; defer missing CRUD |
| Media | Upload/edit inline; archive dialog | Move upload/edit to dialog |
| Estimates / Tasks / QC | Dirty and reason dialogs | Retain and restyle |
| Billing / delivery | Dirty command dialogs | Retain and restyle |
| Inventory | Receipt/import dialogs | Retain and restyle |
| Operational remaining screens | Shared modal/reason paths vary by metadata | Normalize existing mutations only |
| Users / Roles | Dirty forms and reason commands | Retain and restyle |
| Business Settings | Page-level draft editing | Move editing to wide dialog |
| Reports / Search / Data Flow | Read/filter/command surfaces vary | Dialog only where mutation exists |
| Platform | Grant and emulation forms inline | Move creation to dialogs |

Shared acceptance: validation, busy and error states, focus containment, Escape, restoration, and dirty-close confirmation.
