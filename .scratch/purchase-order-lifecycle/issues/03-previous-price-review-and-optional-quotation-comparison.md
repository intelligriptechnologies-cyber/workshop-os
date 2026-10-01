# 03: Previous Price Review and optional quotation comparison

**What to build:** Admin can evaluate requested items with item-level Purchase Order history and optional manually recorded supplier quotations before deciding how to source the request.

**Blocked by:** 01: Store Purchase Request and PO numbering.

**Status:** ready-for-agent

- [ ] An Admin sees a Previous Price Review for each existing SKU with item identity, current stock, and the three most recent completed purchases across suppliers, showing supplier, purchase date, pre-GST unit price, and quantity.
- [ ] A New Item Request shows a compact `N/A` history card rather than misleading purchase history, and optional quotation details can be recorded and compared without supplier messaging or portal integration.
- [ ] Workflow-level and browser tests prove history ordering and limits, empty-history rendering for new items, and the optional nature of quotation data.
