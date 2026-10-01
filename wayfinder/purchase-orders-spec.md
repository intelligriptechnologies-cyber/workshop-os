---
title: Store Purchase Requests and Purchase Order Lifecycle
labels: [ready-for-agent]
status: open
parent: purchase-orders-map.md
---

## Problem Statement

Store users can currently add Stock Inward directly and the current purchase
order experience is a short, supplier-first form with legacy statuses. It does
not let Store request procurement safely, give Admin a controlled supplier and
pricing workflow, expose prior purchasing evidence, manage partial deliveries,
or prevent inventory from becoming available before the goods are accepted.

## Solution

WorkshopOS will make the Purchase Order page the sole procurement entry point.
Store creates a Purchase Request with a system-generated PO number and no
supplier. Admin evaluates it, assigns a single supplier per resulting PO,
prices and approves the lines, issues the order, records one or more deliveries,
confirms accepted quantities, and closes it. Closure creates the Stock Inward
record automatically; only then can Store issue the received Inventory Item.

The Purchase Order workspace will make the lifecycle visible as a persistent
pipeline and will give each role only the actions appropriate to its stage.

## User Stories

1. As a Store user, I want to create a Purchase Request from the Purchase Order page, so that procurement begins in one controlled place.
2. As a Store user, I want the next PO number filled in automatically, so that I cannot create duplicate or malformed document numbers.
3. As a Store user, I want the order date prefilled, so that I can submit a request quickly.
4. As a Store user, I want the supplier field disabled when I create a request, so that supplier selection remains an Admin responsibility.
5. As a Store user, I want to request existing Inventory Items and quantities, so that low or unavailable stock can be procured.
6. As a Store user, I want to add a New Item Request without inventing an SKU, so that the workshop can procure an item not yet catalogued.
7. As a Store user, I want to amend or cancel only an unreviewed request, so that I can correct a genuine mistake without altering an Admin decision.
8. As a Store user, I want to see the current lifecycle stage and my request history, so that I know what is happening next.
9. As a Store user, I want the Stock Inward quick-add actions hidden, so that I cannot bypass the procurement and acceptance process.
10. As a Store user, I want Material Requests with adequate stock to remain issuable, so that procurement does not delay available work.
11. As a Store user, I want unavailable existing-SKU demand and New Item Requests clearly separated, so that I choose the correct next action.
12. As an Admin, I want a queue of submitted Purchase Requests, so that I can evaluate demand before ordering.
13. As an Admin, I want to identify New Item Requests separately from existing SKUs, so that I can complete the catalogue before issuing an order.
14. As an Admin, I want to add an approved New Item as an Inventory Item with zero stock, so that it can participate in the PO without being issuable early.
15. As an Admin, I want to select an active supplier and set a pre-GST unit cost for every approved line, so that the PO total is authoritative before issue.
16. As an Admin, I want a single supplier on each PO, so that the document, delivery, and purchase history are unambiguous.
17. As an Admin, I want to split a multi-line request into supplier-specific POs while retaining the original request trace, so that different suppliers can fulfill different items.
18. As an Admin, I want to inspect the last three completed purchases for an SKU, so that I can make an informed price and supplier decision.
19. As an Admin, I want a compact `N/A` history card for a New Item Request, so that absence of history is clear rather than an error.
20. As an Admin, I want optional quotation details visible during supplier evaluation, so that I may compare suppliers without a supplier portal integration.
21. As an Admin, I want to approve a fully priced and supplier-assigned request, so that its commercial commitment is explicit.
22. As an Admin, I want a Supplier Basket showing supplier contact information and ordered-item count after issue, so that follow-up is efficient.
23. As an Admin, I want to mark a PO issued only after it is approved, so that vendors receive a complete order.
24. As an Admin, I want to record several partial deliveries against issued lines, so that outstanding quantity remains visible.
25. As an Admin, I want to distinguish delivered, accepted, returned, damaged, and wasted quantities, so that stock and supplier outcomes are accurate.
26. As an Admin, I want to confirm accepted quantity before closure, so that stock cannot be posted merely because goods arrived.
27. As an Admin, I want closing a PO to create traceable Stock Inward entries automatically, so that accepted items become available exactly once.
28. As an Admin, I want closed POs to be view-only and downloadable, so that their commercial record cannot be changed later.
29. As an Admin, I want cancelled requests and POs to retain their assigned PO number, so that audit history has no renumbering or reuse.
30. As an Admin, I want validation messages at each transition, so that missing supplier, price, catalogue, quantity, or acceptance data is fixed before progressing.
31. As either role, I want empty, loading, error, and permission-denied states to explain the next safe action, so that the workspace remains usable under real conditions.
32. As a mobile or desktop user, I want the lifecycle pipeline, current status, and permitted action to remain understandable, so that I can operate POs without relying on hidden workflow knowledge.

## Implementation Decisions

- Purchase Request is the pre-procurement record shown on the Purchase Order
  page. It receives an immutable system-generated PO number at creation. The
  number is globally sequential and permanent: `PO-WOS-A-00001` through
  `PO-WOS-Z-99999`, followed by `PO-WOS-AA-00001`; cancellation never reuses a
  number.
- The purchase lifecycle is `New Item Request` (when unresolved New Item
  Request lines exist) or `PO Request`, then `PO Request Approved`, `PO Issued`,
  `PO Received`, `PO Confirmation`, and `PO Closed`. Cancellation is a terminal
  exception from a pre-closure state. The current short legacy status model is
  replaced rather than mapped cosmetically.
- Store may create, view, amend, and cancel only its unreviewed Purchase
  Requests. Admin alone may evaluate suppliers and quotations, create a missing
  SKU, price and approve lines, issue, receive, confirm, close, or cancel an
  in-progress PO. Closed POs are view-only for every role.
- Initial request creation shows PO number and order date before the supplier
  field. Supplier is disabled and empty at this stage. At Admin evaluation the
  PO must have exactly one active supplier; an Admin splits lines into separate
  supplier-specific POs when needed while preserving the originating request
  reference.
- Existing Inventory Items are selected by SKU. A New Item Request captures a
  requested name, unit, and quantity until approval. Admin may add it to
  inventory before issue using the existing catalogue essentials: SKU, name,
  category, unit, low-stock threshold, and selling price, with stock fixed at
  zero. It cannot be issued before PO closure.
- The Materials Request page shows three outcomes: immediately issuable stock,
  existing-SKU procurement demand, and New Item Requests. Procurement starts
  only from the Purchase Order page; direct Store Stock Inward controls are
  removed.
- `Previous Price Review` is a detail-page tab or panel of item cards. Each
  existing-SKU card shows current stock, its identity, and a small table of the
  three most recent completed purchases: supplier, purchase date, pre-GST unit
  price, and quantity. A New Item Request renders a smaller `N/A` card.
- Supplier quotations are optional manual comparison data in the frontend;
  they do not send messages, call a supplier API, or require a vendor portal.
  The Supplier Basket becomes available after issue and shows supplier identity,
  contact details, and ordered-item count.
- A receipt may be recorded more than once for a line. Confirmation records
  accepted quantity and any returned, damaged, or wasted remainder. A PO may
  close only when the confirmation accounts for every delivered quantity and
  does not exceed ordered quantity.
- Closing performs one atomic business outcome: it creates Stock Inward and
  stock-ledger evidence for the accepted quantity of every confirmed line,
  makes that Inventory Item issuable, and locks the PO. Repeating or revisiting
  closure must never post stock twice.
- The Purchase Order workspace uses a responsive list/detail pattern. Its
  detail header includes a persistent status pipeline, current-stage context,
  and only the next permitted action. The create/edit dialog follows the order
  PO number, order date, item lines, notes, then supplier when the current stage
  permits it.

## Testing Decisions

- Tests assert externally observable workflow behavior, permissions, persisted
  records, and visible controls; they do not assert component-local state or
  implementation details.
- The primary seam is the actor-aware Purchase Order workflow against the local
  SQLite state. It covers number generation, lifecycle validation, one-supplier
  enforcement, New Item SKU creation, role denial, supplier pricing, partial
  receipt, confirmation accounting, single-post Stock Inward, and read-only
  closure.
- Browser tests cover one Store journey (create and track a request) and one
  Admin journey (evaluate through close), including hidden direct-inward
  controls, disabled supplier selection, lifecycle pipeline visibility, and
  responsive toolbar behavior.
- Existing material, inward-purchase, lifecycle-model, and browser-workspace
  tests are the prior art to extend. Every vertical slice adds its own workflow
  assertions before it is considered complete.

## Out of Scope

- Payment, accounting, invoice settlement, budget approval, multi-branch
  procurement, supplier portal accounts, automated quotation requests, vendor
  messaging, external API synchronisation, and historical data migration beyond
  preserving existing records.

## Further Notes

- The specification is frontend-ready but assumes the local SQLite demo remains
  the source of truth for the workflow.
- Returns, breakage, and wastage are captured for audit during confirmation;
  their financial settlement with a supplier is out of scope.
- The existing advance-bookings Wayfinder map is unaffected. This specification
  is a new procurement effort and does not close or modify its parent map.
