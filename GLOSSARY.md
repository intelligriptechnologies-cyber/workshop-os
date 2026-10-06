# WorkshopOS Glossary

## Booking

A future reservation for a customer and vehicle to visit the workshop. A Booking
does not create a Visit or Job Card until the customer physically checks in.

## Visit

The record of a customer's physical check-in at reception, including the intake
snapshot. A Visit is created from an arriving Booking or directly at reception.

## Job Card

The operational workshop record created with a Visit. It enters the active
reception and workshop queues only after the vehicle is received.

## Purchase Request

A Store-initiated request to procure one or more inventory items. It becomes a
Purchase Order only after an Admin has reviewed and approved it.

## New Item Request

A Purchase Request line for an item that does not yet have an inventory SKU.
Admin may create its SKU with zero stock after approval and before the Purchase
Order is issued.

## Purchase Order

A single-supplier procurement document. It moves from request through approval,
issue, receipt, confirmation, and closure; only an Admin may move it beyond the
initial Store request.

## Stock Inward

The inventory receipt created automatically when a Purchase Order closes. Its
quantity is the accepted quantity confirmed for the delivered items.
