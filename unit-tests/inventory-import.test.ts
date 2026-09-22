import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import {
  buildInventoryImportPreview,
  buildInventoryTemplateBuffer,
  parseInventoryWorkbook,
  suggestInventoryColumnMapping,
} from "../src/inventory-import";

function arrayBuffer(value: Uint8Array) {
  return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;
}

test("parses CSV buffers and suggests canonical mappings", () => {
  const csv = "Part Code,Item Name,Category,UOM,Opening Qty,Reorder Level\nppf-01,Film,PPF,Roll,12,2\n";
  const parsed = parseInventoryWorkbook(arrayBuffer(new TextEncoder().encode(csv)));

  assert.deepEqual(parsed.headers, ["Part Code", "Item Name", "Category", "UOM", "Opening Qty", "Reorder Level"]);
  assert.equal(parsed.rows[0]["Item Name"], "Film");
  assert.deepEqual(suggestInventoryColumnMapping(parsed.headers), {
    sku: "Part Code",
    name: "Item Name",
    category: "Category",
    unit: "UOM",
    stock_qty: "Opening Qty",
    low_stock_qty: "Reorder Level",
  });
});

test("parses XLSX buffers and gives duplicate headers stable names", () => {
  const sheet = XLSX.utils.aoa_to_sheet([
    ["SKU", "Name", "Name", "Category", "Unit", "Stock Qty", "Low Stock Qty"],
    ["A-1", "Primary", "Alternate", "General", "piece", 5, 1],
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Stock");
  const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer;

  const parsed = parseInventoryWorkbook(buffer);
  assert.equal(parsed.sheetName, "Stock");
  assert.deepEqual(parsed.headers.slice(0, 3), ["SKU", "Name", "Name (2)"]);
  assert.equal(parsed.rows[0]["Name (2)"], "Alternate");
});

test("normalizes valid rows and assigns deterministic session IDs", () => {
  const headers = ["SKU", "Item", "Category", "Unit", "Qty", "Minimum"];
  const rows = [{ SKU: " ppf-01 ", Item: "  Paint   Film ", Category: " Films ", Unit: " Roll ", Qty: "1,250", Minimum: 5 }];
  const mapping = { sku: "SKU", name: "Item", category: "Category", unit: "Unit", stock_qty: "Qty", low_stock_qty: "Minimum" } as const;

  const first = buildInventoryImportPreview({ headers, rows, mapping });
  const second = buildInventoryImportPreview({ headers, rows, mapping });
  assert.equal(first.rejectedRows.length, 0);
  assert.deepEqual(first.validRows[0].item, {
    id: first.validRows[0].item.id,
    sku: "PPF-01",
    name: "Paint Film",
    category: "Films",
    unit: "roll",
    stock_qty: 1250,
    low_stock_qty: 5,
  });
  assert.ok(first.validRows[0].item.id < 0);
  assert.equal(first.validRows[0].item.id, second.validRows[0].item.id);
});

test("rejects missing values, invalid quantities, negative quantities and duplicate SKUs", () => {
  const headers = ["sku", "name", "category", "unit", "stock", "low"];
  const mapping = { sku: "sku", name: "name", category: "category", unit: "unit", stock_qty: "stock", low_stock_qty: "low" } as const;
  const rows = [
    { sku: "DUP-1", name: "First", category: "General", unit: "piece", stock: 1, low: 0 },
    { sku: "dup-1", name: "Second", category: "General", unit: "piece", stock: 2, low: 0 },
    { sku: "KNOWN", name: "Existing", category: "General", unit: "piece", stock: 2, low: 0 },
    { sku: "BAD", name: "", category: "General", unit: "piece", stock: "lots", low: -1 },
  ];
  const preview = buildInventoryImportPreview({ headers, rows, mapping, existingInventory: [{ id: 1, sku: "known" }] });

  assert.equal(preview.validRows.length, 0);
  assert.equal(preview.rejectedRows.length, 4);
  assert.deepEqual(preview.rejectedRows[0].issues.map((issue) => issue.code), ["DUPLICATE_SKU_FILE"]);
  assert.deepEqual(preview.rejectedRows[2].issues.map((issue) => issue.code), ["DUPLICATE_SKU_EXISTING"]);
  assert.deepEqual(preview.rejectedRows[3].issues.map((issue) => issue.code), ["MISSING_VALUE", "INVALID_QUANTITY", "NEGATIVE_QUANTITY"]);
});

test("reports incomplete or stale explicit mappings before validating rows", () => {
  const preview = buildInventoryImportPreview({
    headers: ["SKU"],
    rows: [{ SKU: "A-1" }],
    mapping: { sku: "Removed SKU", name: "SKU" },
  });
  assert.equal(preview.validRows.length, 0);
  assert.equal(preview.rejectedRows.length, 0);
  assert.deepEqual(preview.mappingIssues.map((issue) => issue.code), [
    "UNKNOWN_COLUMN", "MISSING_MAPPING", "MISSING_MAPPING", "MISSING_MAPPING", "MISSING_MAPPING",
  ]);
});

test("inventory template is a parseable workbook with auto-mappable headers", () => {
  const parsed = parseInventoryWorkbook(buildInventoryTemplateBuffer());
  const mapping = suggestInventoryColumnMapping(parsed.headers);
  assert.deepEqual(Object.keys(mapping).sort(), ["category", "low_stock_qty", "name", "sku", "stock_qty", "unit"]);
  assert.equal(parsed.rows.length, 1);
});
