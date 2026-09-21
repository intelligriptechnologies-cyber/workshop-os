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

Recovery: every tenant route is surrounded by `ProductionWorkspace`; its grouped permission navigation and account session are shared. `/demo` remains a lazy browser-only reference boundary and is not production authority. `/platform` remains independently authenticated and has no tenant navigation.
