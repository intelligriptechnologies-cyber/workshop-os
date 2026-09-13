# WorkshopOS v1.2 absence hunt

Status: COMPLETE

This pass asks only what the approved discussion had not explicitly covered. It does not reopen frozen decisions.

| Potential absence | Resolution |
| --- | --- |
| Exact new scale or latency budgets for v1.2 screens | Deferred to the simplest compatible default: inherited frozen v1.1 budgets (D-023). |
| Locale/time-zone boundary for “today” | Use the authenticated tenant/branch local calendar already defined by v1.1; no new browser-local authority (D-001, D-023). |
| Whether every screen must offer grid mode | Only where useful and specified by the screen inventory; table/list behavior remains mandatory (V12-R006, V12-R030). |
| Whether ordinary edits require a reason | No new universal rule; only destructive/exceptional commands where domain policy requires it (V12-R004, D-016). |
| What happens to uploads awaiting scan | They are not available for view/download until the scan reaches an allowed result; provider failure remains recoverable and auditable (V12-R024, D-023). |
| Whether Platform Super Admin automatically receives tenant permissions | Explicitly no ambient tenant access; approved support scope/emulation is required (V12-R031, V12-R033). |
| Cross-tenant identity/email semantics | Inherit the existing v1.1 identity model until the user-management slice proves and documents its PostgreSQL behavior (D-023); do not silently loosen uniqueness. |
| How external/manual gates affect local completion | Local implementation may reach a release-candidate state, but the programme goal remains incomplete while required external evidence is absent (V12-R036, D-021). |

No new requirement or slice is needed. All findings map to an existing frozen requirement or explicit deferred default.

