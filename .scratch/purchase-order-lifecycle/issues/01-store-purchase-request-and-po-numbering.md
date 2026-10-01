# 01: Store Purchase Request and PO numbering

**What to build:** Store users can create, view, amend, and cancel an unreviewed Purchase Request from the Purchase Order workspace. Each request receives a permanent system-generated PO number and begins without a supplier, making the request safe for Admin review.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] A Store user can create an existing-SKU request or a New Item Request with an auto-populated order date and an immutable PO number following the global `PO-WOS-A-00001` sequence, including alphabetic rollover and no number reuse after cancellation.
- [ ] The initial request dialog shows PO number, order date, item lines, and notes before a disabled empty supplier field; Store can amend or cancel only an unreviewed request and cannot access later-stage actions.
- [ ] Workflow-level and browser tests prove Store request creation, numbering, disabled supplier selection, permitted request changes, and denied post-review actions.
