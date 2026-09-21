# Production Route Inventory

| Family | Routes | Component |
| --- | --- | --- |
| Home | `/`, `/production` | `ProductionHomeApp` |
| Primary | jobs, customers, vehicles, work-items | Dedicated production apps |
| Execution | media, estimates, tasks, qc, billing | Dedicated/combined apps |
| Operations | inventory, materials, appointments, follow-ups, action-inbox | Inventory/remaining screens |
| Administration | users, roles, settings, reports, masters, search, data-flow | Dedicated/remaining screens |
| Platform | `/platform` | `PlatformAdminApp` |
| Demo | `/demo` | Lazy legacy `App` |

Baseline: tenant routes load sessions independently and render repeated headers plus flat `ProductionNavigation`. The demo local-data shell is not production authority.
