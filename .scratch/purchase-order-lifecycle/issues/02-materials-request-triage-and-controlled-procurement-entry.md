# 02: Materials Request triage and controlled procurement entry

**What to build:** Store users can distinguish immediately issuable Materials Request demand from existing-SKU procurement demand and New Item Requests, while Purchase Order remains the only way to begin procurement and direct Store Stock Inward is unavailable.

**Blocked by:** 01: Store Purchase Request and PO numbering.

**Status:** ready-for-agent

- [ ] The Materials Request page clearly identifies sufficient stock as issuable, existing-SKU shortages as procurement demand, and uncatalogued items as New Item Requests with an understandable next action for each state.
- [ ] Store Stock Inward quick-add controls are hidden and cannot be invoked through the page; procurement navigation leads to creation of the controlled Purchase Request from ticket 01.
- [ ] Behavior-level and browser tests prove all three triage outcomes, the absence of Store direct-inward actions, and the procurement handoff.
