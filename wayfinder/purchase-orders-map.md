---
title: Store purchase requests and purchase-order lifecycle
labels: [wayfinder:map]
status: open
---

## Destination

An approved, implementation-ready frontend specification for Store-created
Purchase Requests and the Admin-managed Purchase Order lifecycle, ending in an
automatic Stock Inward entry when a PO closes.

## Notes

- Frontend planning only: screens, dialog fields, information architecture,
  permissions, UI states, validations, and acceptance criteria. Backend/schema
  implementation and accounting/payment are excluded.
- Store creates, views, and may amend/cancel only its unreviewed requests.
  Admin owns approval, supplier and price selection, issue, receipt,
  confirmation, and closure.
- A PO is single-supplier. Supplier is disabled/empty on the initial Store
  request and is assigned by Admin at the `PO Request` stage.
- Lifecycle shown as a persistent page pipeline: `New Item Request` (only
  where a request has an unskued line) or `PO Request` -> `PO Request Approved`
  -> `PO Issued` -> `PO Received` -> `PO Confirmation` -> `PO Closed`.
- PO numbers are globally permanent and sequential: `PO-WOS-A-00001` through
  `PO-WOS-Z-99999`, then `PO-WOS-AA-00001`; cancelled requests leave gaps.
- Partial deliveries are supported. Only the confirmed accepted quantity posts
  automatically to stock on closure.

## Decisions so far

<!-- Closed child tickets will be indexed here as they resolve. -->

## Not yet specified

- Exact required inventory-catalogue fields for a newly approved SKU.
- Whether an optional supplier quotation comparison needs persisted quote data
  or a display-only decision aid in the first release.
- The treatment and audit visibility of returns, breakage, and wastage after
  receipt but before final PO closure.

## Out of scope

- Backend/schema/API implementation, payment/accounting, multi-branch
  purchasing, supplier portal access, and automated vendor communications.

## Tickets

- [Purchase-order lifecycle and transition authority](purchase-orders/001-lifecycle-and-authority.md)
- [Material-request triage and Store request creation](purchase-orders/002-request-triage-and-creation.md)
- [PO identity, line composition, and single-supplier split](purchase-orders/003-po-identity-and-supplier-split.md)
- [Supplier evaluation, quotations, and previous-price review](purchase-orders/004-supplier-evaluation-and-price-review.md)
- [Receipt, confirmation, exceptions, and automatic Stock Inward](purchase-orders/005-receipt-confirmation-and-stock-inward.md)
- [Purchase-order workspace, dialog, and lifecycle-pipeline UX](purchase-orders/006-po-workspace-and-pipeline-ux.md)

## Dependency convention

`Depends on` is the local-Markdown blocking convention. A ticket is on the
frontier only when every listed ticket is closed.
