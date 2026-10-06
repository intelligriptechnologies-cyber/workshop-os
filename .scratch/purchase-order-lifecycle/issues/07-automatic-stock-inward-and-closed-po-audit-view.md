# 07: Automatic Stock Inward and closed-PO audit view

**What to build:** Closing a fully confirmed Purchase Order automatically creates one traceable Stock Inward outcome for accepted quantities, makes those Inventory Items issuable, and locks the commercial record into a view-only audit experience.

**Blocked by:** 06: Partial delivery receipt and quality confirmation.

**Status:** ready-for-agent

- [ ] Admin can close only a completely confirmed PO; closure posts accepted quantities to Stock Inward and the stock ledger exactly once, even if the close action is retried or the record is revisited.
- [ ] Accepted items become available for Store issue after closure, while all users see a view-only PO Closed record with its lifecycle context and downloadable purchase information.
- [ ] Workflow-level and browser tests prove closure gating, idempotent inward posting, newly issuable accepted stock, closed-record immutability, and the closed audit view.
