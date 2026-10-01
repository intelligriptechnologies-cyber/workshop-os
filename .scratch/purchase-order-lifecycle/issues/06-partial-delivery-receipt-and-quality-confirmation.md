# 06: Partial delivery receipt and quality confirmation

**What to build:** Admin can record one or more partial deliveries for an issued Purchase Order and confirm accepted, returned, damaged, and wasted quantities without allowing quantities to exceed the ordered or delivered amounts.

**Blocked by:** 05: PO issue and Supplier Basket.

**Status:** ready-for-agent

- [ ] An Admin can record multiple receipts against an issued line and see ordered, received, outstanding, and cumulative delivery quantities accurately after each receipt.
- [ ] Confirmation accounts for every delivered quantity as accepted, returned, damaged, or wasted, rejects invalid or over-limit quantities, and advances the PO through PO Received and PO Confirmation only when its data is complete.
- [ ] Workflow-level and browser tests prove multiple partial receipts, outstanding totals, confirmation accounting validation, role restrictions, and lifecycle visibility.
