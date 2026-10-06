# 04: Admin approval, SKU enrichment, supplier, and pricing

**What to build:** Admin can turn a reviewed Purchase Request into an approved, commercially complete, single-supplier Purchase Order by adding catalogue data for New Item Requests where needed, assigning supplier and pre-GST prices, and splitting supplier-specific orders while retaining request traceability.

**Blocked by:** 01: Store Purchase Request and PO numbering; 03: Previous Price Review and optional quotation comparison.

**Status:** ready-for-agent

- [ ] Only Admin can set one active supplier and a pre-GST unit cost for every approved line; attempts to approve without complete supplier, price, or catalogue information show actionable validation and leave the PO unapproved.
- [ ] Admin can create a zero-stock Inventory Item from an approved New Item Request before issue, and can split lines requiring different suppliers into traceable supplier-specific POs.
- [ ] Workflow-level and browser tests prove role denial, supplier and price validation, zero-stock SKU creation, one-supplier enforcement, split traceability, and successful transition to PO Request Approved.
