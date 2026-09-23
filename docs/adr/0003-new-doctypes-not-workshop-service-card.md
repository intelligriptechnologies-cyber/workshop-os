# JobCard/Visit/StatusHistory are new doctypes, not a repurposed WorkshopServiceCard

hyperflow_forge already has a `WorkshopServiceCard` doctype implementing a similar job-lifecycle state machine, but its status vocabulary (Booked → CheckedIn → Diagnosis → AwaitingApproval → InProgress → QC → Delivered) does not overlap cleanly with WorkshopOS's own two-layer model (`main_status` + `sub_status`, see CONTEXT.md). We chose to build new doctypes (JobCard, Visit, StatusHistory) in the forked app rather than repurpose or extend WorkshopServiceCard to speak both vocabularies. We reuse the *pattern* — guarded, audited status transitions like `_transition_status`/`_check_transition_role` — not the doctype itself.

## Considered options

- Extend WorkshopServiceCard with a second, WorkshopOS-flavored status field: rejected — one doctype serving two incompatible state machines is a maintenance trap, and every transition guard would need to branch on which vocabulary is active.
- Map WorkshopOS's sub_status values onto WorkshopServiceCard's existing statuses: rejected — the granularity doesn't line up (WorkshopOS's sub_status has states like "Washing Needed" and "Follow-up Needed" with no WorkshopServiceCard equivalent), so the mapping would be lossy in both directions.

## Consequences

- Customer and Vehicle *are* reused directly (ERPNext's native `Customer` doctype, and hyperflow_forge's existing `Workshop Vehicle` doctype) — this ADR applies specifically to the job-lifecycle entities, not the whole domain model.
