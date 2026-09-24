import assert from "node:assert/strict";
import test from "node:test";
import { activeFilterSummary, applyFilterDraft, clampPage, clearFilterDraft, DEFAULT_PAGE_SIZE, normalizeSearch, PAGE_SIZE_OPTIONS, pageNumbers, paginate } from "../src/list-utils";
import { buildExportMatrix } from "../src/export-utils";

test("pagination calculates ranges and only returns the active page", () => {
  assert.deepEqual(paginate(Array.from({ length: 25 }, (_, i) => i + 1), 2, DEFAULT_PAGE_SIZE), {
    items: Array.from({ length: 10 }, (_, i) => i + 11), totalCount: 25, pageCount: 3, page: 2, from: 11, to: 20,
  });
});

test("pagination clamps pages, handles empty results and page-size changes", () => {
  assert.deepEqual(PAGE_SIZE_OPTIONS, [10, 20, 50]);
  assert.equal(DEFAULT_PAGE_SIZE, 10);
  assert.equal(clampPage(4, 13, 10), 2);
  assert.deepEqual(paginate([], 8, 20), { items: [], totalCount: 0, pageCount: 1, page: 1, from: 0, to: 0 });
  assert.equal(paginate(Array.from({ length: 41 }), 3, 20).items.length, 1);
});

test("search normalization and adaptive page numbers are deterministic", () => {
  assert.equal(normalizeSearch("  RaHuL  "), "rahul");
  assert.deepEqual(pageNumbers(3, 7), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(pageNumbers(2, 12), [1, 2, 3, 4, 5, "ellipsis", 12]);
  assert.deepEqual(pageNumbers(6, 12), [1, "ellipsis", 5, 6, 7, "ellipsis", 12]);
  assert.deepEqual(pageNumbers(11, 12), [1, "ellipsis", 8, 9, 10, 11, 12]);
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

test("draft filters apply explicitly and clear resets both copies and page", () => {
  const initial = { draft: { search: "new" }, applied: { search: "old" }, page: 3 };
  assert.deepEqual(applyFilterDraft(initial), { draft: { search: "new" }, applied: { search: "new" }, page: 1 });
  assert.deepEqual(clearFilterDraft(initial, { search: "" }), { draft: { search: "" }, applied: { search: "" }, page: 1 });
});
