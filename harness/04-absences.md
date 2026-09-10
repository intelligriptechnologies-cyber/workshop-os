# Absence hunt

Status: RESOLVED WITHOUT REOPENING FROZEN DECISIONS

| Never-discussed edge | Resolution |
| --- | --- |
| Exact tenant templates, thresholds, workflow labels, tolerances, and mandatory evidence sets | Deferred to versioned tenant configuration; simplest production default is deny sensitive exceptions and require the core evidence named in the BRD. Logged by D-005, D-007, D-024. |
| Exact Cognito topology and provider identifiers | Environment-specific external prerequisite; local identity adapter is allowed until provisioned. Logged by D-003, D-032. |
| Exact WhatsApp/SMS templates and sender enrollment | External prerequisite; test transport must preserve consent, fallback, and delivery semantics. Logged by D-028, D-032. |
| Exact Cashfree and Tally credentials/builds available in pilot | External prerequisite; contract fixtures and file fallback cover implementation until representative systems exist. Logged by D-026, D-027, D-032. |
| GST and invoice certification authority | Explicit qualified India finance review gate. Logged by D-033. |
| Pilot hardware inventory and representative staff | External acceptance input; automated accessibility/device checks proceed with the declared client matrix. Logged by D-030, D-031. |
| Production migration source | Explicitly not the demo SQLite data; import framework accepts later tenant extracts. Logged by D-002, D-031. |
| Data residency outside India | Deferred/non-certified; AWS Mumbai is the production home for this release. Logged by D-003, D-022. |

No requirement was cut. All deferred details map to an implementation slice and acceptance criteria.
