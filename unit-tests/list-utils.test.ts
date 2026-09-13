import assert from "node:assert/strict";
import test from "node:test";
import { activeFilterSummary, clampPage, normalizeSearch, pageNumbers, paginate } from "../src/list-utils";
import { buildExportMatrix } from "../src/export-utils";

test("pagination calculates ranges and only returns the active page", () => {
  assert.deepEqual(paginate(Array.from({ length: 25 }, (_, i) => i + 1), 2, 12), {
    items: Array.from({ length: 12 }, (_, i) => i + 13), totalCount: 25, pageCount: 3, page: 2, from: 13, to: 24,
  });
});

test("pagination clamps pages, handles empty results and page-size changes", () => {
  assert.equal(clampPage(4, 13, 12), 2);
  assert.deepEqual(paginate([], 8, 24), { items: [], totalCount: 0, pageCount: 1, page: 1, from: 0, to: 0 });
  assert.equal(paginate(Array.from({ length: 49 }), 3, 24).items.length, 1);
});

test("search normalization and compact page numbers are deterministic", () => {
  assert.equal(normalizeSearch("  RaHuL  "), "rahul");
  assert.deepEqual(pageNumbers(8, 10), [6, 7, 8, 9, 10]);
});

test("active filters omit defaults and retain their labels", () => {
  assert.deepEqual(activeFilterSummary({ Search: "film", Category: "PPF", Unit: "ALL" }), ["Search: film", "Category: PPF"]);
});

test("exports contain exactly the supplied filtered rows and visible columns", () => {
  const matrix = buildExportMatrix({
    title: "Stock",
    filters: ["Category: PPF"],
    generatedAt: new Date("2026-09-12T12:00:00Z"),
    columns: [{ header: "SKU", value: (row: { sku: string; hidden: string }) => row.sku }],
    rows: [{ sku: "PPF-01", hidden: "never exported" }],
  });
  assert.deepEqual(matrix[4], ["SKU"]);
  assert.deepEqual(matrix.slice(5), [["PPF-01"]]);
  assert.equal(JSON.stringify(matrix).includes("never exported"), false);
});
