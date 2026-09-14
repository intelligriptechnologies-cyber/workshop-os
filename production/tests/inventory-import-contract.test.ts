import assert from "node:assert/strict";
import test from "node:test";

import { buildInventoryErrorManifest, formatInventoryQuantity, inventoryQuantityUnits, normalizeInventoryImportRows } from "../src/inventory-operations.js";
import { createInventoryExportArtifact } from "../src/inventory-export.js";

test("inventory import normalizes valid rows and reports every invalid row without throwing", () => {
  const rows = normalizeInventoryImportRows([
    { sku: " oil-5w30 ", warehouseCode: " main ", quantity: "2.500", valueMinor: "12500" },
    { sku: "", warehouseCode: "main", quantity: "-1", valueMinor: "x" },
  ]);

  assert.deepEqual(rows[0], { rowNumber: 1, sku: "OIL-5W30", warehouseCode: "MAIN", quantity: "2.5", valueMinor: "12500", errors: [] });
  assert.deepEqual(rows[1].errors, ["SKU_REQUIRED", "QUANTITY_INVALID", "VALUE_MINOR_INVALID"]);
});

test("inventory import preserves exact large decimals and rejects PostgreSQL numeric overflow", () => {
  const rows = normalizeInventoryImportRows([
    { sku: "EXACT", warehouseCode: "MAIN", quantity: "9007199254740993.123400", valueMinor: "9223372036854775807" },
    { sku: "TOO-LARGE", warehouseCode: "MAIN", quantity: "100000000000000000000000000000000", valueMinor: "9223372036854775808" },
  ]);
  assert.equal(rows[0].quantity, "9007199254740993.1234");
  assert.deepEqual(rows[0].errors, []);
  assert.deepEqual(rows[1].errors, ["QUANTITY_INVALID", "VALUE_MINOR_INVALID"]);
});

test("inventory XLSX export contains every supplied filtered position", () => {
  const rows = Array.from({length: 30},(_,index)=>({ id:`item-${index}`,branchId:"branch",warehouseId:"warehouse",warehouseName:"MAIN",sku:`PART-${index}`,baseUom:"EA",quantity:"1",valueMinor:"100",reorderPoint:"2",reorder:true }));
  const artifact=createInventoryExportArtifact("XLSX",rows);
  assert.equal(artifact.rowCount,30);assert.match(artifact.mimeType,/spreadsheet/);assert.ok(artifact.content.length>100);
});

test("import reconciliation quantities remain exact beyond floating point precision",()=>{
  const total=inventoryQuantityUnits("9007199254740991.000001")+inventoryQuantityUnits("0.000002");
  assert.equal(formatInventoryQuantity(total),"9007199254740991.000003");
});

test("error manifest is a safe downloadable CSV containing only rejected rows", () => {
  const rows = normalizeInventoryImportRows([
    { sku: "bad,sku", warehouseCode: "main", quantity: "0", valueMinor: "1" },
    { sku: "OK", warehouseCode: "main", quantity: "1", valueMinor: "100" },
  ]);
  const manifest = buildInventoryErrorManifest(rows);

  assert.equal(manifest.filename, "inventory-import-errors.csv");
  assert.equal(manifest.mimeType, "text/csv; charset=utf-8");
  assert.match(manifest.content.toString("utf8"), /row,sku,warehouseCode,errors/);
  assert.match(manifest.content.toString("utf8"), /"BAD,SKU"/);
  assert.doesNotMatch(manifest.content.toString("utf8"), /,OK,/);
});
