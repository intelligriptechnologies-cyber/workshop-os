# 05: PO issue and Supplier Basket

**What to build:** Admin can issue an approved Purchase Order to its assigned supplier and use a Supplier Basket to follow up on the resulting order while the workspace makes its lifecycle position clear.

**Blocked by:** 04: Admin approval, SKU enrichment, supplier, and pricing.

**Status:** ready-for-agent

- [ ] An Admin can mark only a fully approved Purchase Order as PO Issued; Store cannot issue it, and incomplete or unapproved POs remain blocked with an explanation.
- [ ] Once issued, Supplier Basket shows the assigned supplier’s identity and contact information plus the number of ordered items, and the Purchase Order presents its PO Issued state and next permitted action.
- [ ] Workflow-level and browser tests prove the issue gate, role restrictions, Supplier Basket content, and visible issued-stage context.
