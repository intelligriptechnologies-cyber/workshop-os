import assert from "node:assert/strict";
import test from "node:test";
import { supplierNameForPurchaseOrder } from "../src/purchase-order-supplier-display";

test("purchase-order grid resolves a string-serialized supplier ID", () => {
  const supplier = supplierNameForPurchaseOrder(
    [{ id: 42, name: "Metro Parts" }],
    "42",
  );

  assert.equal(supplier, "Metro Parts");
});
