import * as XLSX from "xlsx";
import type { InventoryItem } from "./types";

export const INVENTORY_IMPORT_FIELDS = [
  "sku",
  "name",
  "category",
  "unit",
  "stock_qty",
  "low_stock_qty",
] as const;

export type InventoryImportField = (typeof INVENTORY_IMPORT_FIELDS)[number];
export type InventoryColumnMapping = Partial<Record<InventoryImportField, string>>;
export type InventoryImportSourceRow = Record<string, unknown>;

export interface ParsedInventoryWorkbook {
  sheetName: string;
  headers: string[];
  rows: InventoryImportSourceRow[];
}

export type InventoryImportIssueCode =
  | "MISSING_MAPPING"
  | "UNKNOWN_COLUMN"
  | "MISSING_VALUE"
  | "INVALID_QUANTITY"
  | "NEGATIVE_QUANTITY"
  | "DUPLICATE_SKU_FILE"
  | "DUPLICATE_SKU_EXISTING";

export interface InventoryImportIssue {
  code: InventoryImportIssueCode;
  field: InventoryImportField;
  message: string;
}

export interface ValidInventoryImportRow {
  sourceRowNumber: number;
  source: InventoryImportSourceRow;
  item: InventoryItem;
}

export interface RejectedInventoryImportRow {
  sourceRowNumber: number;
  source: InventoryImportSourceRow;
  normalized: Partial<Omit<InventoryItem, "id">>;
  issues: InventoryImportIssue[];
}

export interface InventoryImportPreview {
  totalRows: number;
  validRows: ValidInventoryImportRow[];
  rejectedRows: RejectedInventoryImportRow[];
  mappingIssues: InventoryImportIssue[];
}

const FIELD_ALIASES: Record<InventoryImportField, string[]> = {
  sku: ["sku", "stockkeepingunit", "itemcode", "productcode", "partcode", "partnumber"],
  name: ["name", "itemname", "productname", "itemdescription", "description"],
  category: ["category", "itemcategory", "productcategory", "group", "itemgroup"],
  unit: ["unit", "uom", "unitofmeasure", "measure"],
  stock_qty: ["stockqty", "stockquantity", "openingqty", "openingquantity", "openingstock", "quantity", "qty"],
  low_stock_qty: ["lowstockqty", "lowstockthreshold", "minimumstock", "minstock", "reorderlevel", "reorderqty", "minimumquantity"],
};

function headerKey(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
}

function displayHeader(value: unknown, columnIndex: number) {
  const header = String(value ?? "").trim();
  return header || `Column ${columnIndex + 1}`;
}

function uniqueHeaders(values: unknown[]) {
  const counts = new Map<string, number>();
  return values.map((value, index) => {
    const base = displayHeader(value, index);
    const key = base.toLocaleLowerCase();
    const count = (counts.get(key) ?? 0) + 1;
    counts.set(key, count);
    return count === 1 ? base : `${base} (${count})`;
  });
}

function isBlankRow(row: unknown[]) {
  return row.every((value) => value === undefined || value === null || String(value).trim() === "");
}

const UNIT_PATTERNS: [RegExp, string][] = [
  [/\b(ltr|litre|liter)\b|\d\s*l\b/i, "ltr"],
  [/\d\s*ml\b/i, "ml"],
  [/\d\s*kg\b|\bkg\b/i, "kg"],
  [/\d\s*gm?\b|\bgms?\b/i, "g"],
  [/\broll\b/i, "roll"],
];

function inferUnit(name: string) {
  return UNIT_PATTERNS.find(([pattern]) => pattern.test(name))?.[1] ?? "pcs";
}

function sheetMatrix(sheet: XLSX.WorkSheet) {
  return XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", blankrows: false, raw: true });
}

/**
 * Sheet-per-category layout (no SKU column): every sheet is a category with an item-name column,
 * optionally a brand and an opening balance ("OB"). SKU, unit and stock are derived so the rows
 * flow through the normal mapping/validation preview.
 */
function parseCategorySheets(workbook: XLSX.WorkBook): ParsedInventoryWorkbook | null {
  const rows: InventoryImportSourceRow[] = [];
  for (const sheetName of workbook.SheetNames) {
    const matrix = sheetMatrix(workbook.Sheets[sheetName]);
    if (matrix.length === 0 || isBlankRow(matrix[0])) continue;
    const keys = matrix[0].map((value) => headerKey(String(value ?? "")));
    const nameIndex = keys.findIndex((key) => FIELD_ALIASES.name.includes(key));
    if (nameIndex < 0) continue;
    const brandIndex = keys.indexOf("brand");
    const balanceIndex = keys.findIndex((key) => key === "ob" || FIELD_ALIASES.stock_qty.includes(key));
    const prefix = sheetName.trim().toLocaleUpperCase().replace(/[^A-Z0-9]+/g, "") || "ITEM";
    let serial = 0;
    for (const row of matrix.slice(1)) {
      const name = normalizedText(row[nameIndex]);
      if (!name) continue;
      serial += 1;
      const brand = brandIndex >= 0 ? normalizedText(row[brandIndex]) : "";
      const balance = balanceIndex >= 0 ? row[balanceIndex] : "";
      rows.push({
        SKU: `${prefix}-${String(serial).padStart(3, "0")}`,
        Name: brand ? `${name} (${brand})` : name,
        Category: sheetName.trim(),
        Unit: inferUnit(name),
        "Stock Qty": normalizedText(balance) === "" ? 0 : balance,
        "Low Stock Qty": 0,
      });
    }
  }
  if (rows.length === 0) return null;
  return { sheetName: "All sheets", headers: ["SKU", "Name", "Category", "Unit", "Stock Qty", "Low Stock Qty"], rows };
}

/** Parses the first worksheet from either CSV or an Excel-compatible ArrayBuffer. */
export function parseInventoryWorkbook(data: ArrayBuffer | Uint8Array): ParsedInventoryWorkbook {
  const workbook = XLSX.read(data, { type: "array", raw: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("The inventory file does not contain a worksheet.");

  const matrix = sheetMatrix(workbook.Sheets[sheetName]);
  if (matrix.length === 0 || isBlankRow(matrix[0])) {
    throw new Error("The inventory file does not contain a header row.");
  }

  const firstKeys = matrix[0].map((value) => headerKey(String(value ?? "")));
  if (!firstKeys.some((key) => FIELD_ALIASES.sku.includes(key))) {
    const categorized = parseCategorySheets(workbook);
    if (categorized) return categorized;
  }

  const headers = uniqueHeaders(matrix[0]);
  const rows = matrix.slice(1).filter((row) => !isBlankRow(row)).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
  );
  return { sheetName, headers, rows };
}

/** Suggests canonical fields from common inventory-column names. Unmatched fields are omitted. */
export function suggestInventoryColumnMapping(headers: string[]): InventoryColumnMapping {
  const normalizedHeaders = headers.map((header) => ({ header, key: headerKey(header) }));
  const claimed = new Set<string>();
  const mapping: InventoryColumnMapping = {};

  for (const field of INVENTORY_IMPORT_FIELDS) {
    const match = normalizedHeaders.find(({ header, key }) => !claimed.has(header) && FIELD_ALIASES[field].includes(key));
    if (match) {
      mapping[field] = match.header;
      claimed.add(match.header);
    }
  }
  return mapping;
}

function normalizedText(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function normalizedSku(value: unknown) {
  return normalizedText(value).toLocaleUpperCase();
}

function parseQuantity(value: unknown) {
  if (typeof value === "number") return value;
  const text = normalizedText(value);
  return text === "" ? Number.NaN : Number(text.replace(/,/g, ""));
}

function deterministicId(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return -(hash >>> 0 || 1);
}

function mappingIssues(headers: string[], mapping: InventoryColumnMapping) {
  const issues: InventoryImportIssue[] = [];
  for (const field of INVENTORY_IMPORT_FIELDS) {
    const column = mapping[field];
    if (!column) {
      issues.push({ code: "MISSING_MAPPING", field, message: `Map a source column to ${field}.` });
    } else if (!headers.includes(column)) {
      issues.push({ code: "UNKNOWN_COLUMN", field, message: `The mapped column “${column}” is not present in the file.` });
    }
  }
  return issues;
}

export interface BuildInventoryImportPreviewOptions {
  headers: string[];
  rows: InventoryImportSourceRow[];
  mapping: InventoryColumnMapping;
  existingInventory?: Pick<InventoryItem, "id" | "sku">[];
}

/** Validates and normalizes parsed rows without mutating existing inventory. */
export function buildInventoryImportPreview({
  headers,
  rows,
  mapping,
  existingInventory = [],
}: BuildInventoryImportPreviewOptions): InventoryImportPreview {
  const mapIssues = mappingIssues(headers, mapping);
  if (mapIssues.length > 0) {
    return { totalRows: rows.length, validRows: [], rejectedRows: [], mappingIssues: mapIssues };
  }

  const sourceColumn = mapping as Record<InventoryImportField, string>;
  const skus = rows.map((row) => normalizedSku(row[sourceColumn.sku]));
  const fileSkuCounts = new Map<string, number>();
  for (const sku of skus) if (sku) fileSkuCounts.set(sku, (fileSkuCounts.get(sku) ?? 0) + 1);
  const existingSkus = new Set(existingInventory.map((item) => normalizedSku(item.sku)));
  const usedIds = new Set(existingInventory.map((item) => item.id));
  const validRows: ValidInventoryImportRow[] = [];
  const rejectedRows: RejectedInventoryImportRow[] = [];

  rows.forEach((source, index) => {
    const sourceRowNumber = index + 2;
    const normalized: Omit<InventoryItem, "id"> = {
      sku: skus[index],
      name: normalizedText(source[sourceColumn.name]),
      category: normalizedText(source[sourceColumn.category]),
      unit: normalizedText(source[sourceColumn.unit]).toLocaleLowerCase(),
      stock_qty: parseQuantity(source[sourceColumn.stock_qty]),
      low_stock_qty: parseQuantity(source[sourceColumn.low_stock_qty]),
    };
    const issues: InventoryImportIssue[] = [];

    for (const field of ["sku", "name", "category", "unit"] as const) {
      if (!normalized[field]) issues.push({ code: "MISSING_VALUE", field, message: `${field} is required.` });
    }
    for (const field of ["stock_qty", "low_stock_qty"] as const) {
      const quantity = normalized[field];
      if (!Number.isFinite(quantity)) {
        issues.push({ code: "INVALID_QUANTITY", field, message: `${field} must be a finite number.` });
      } else if (quantity < 0) {
        issues.push({ code: "NEGATIVE_QUANTITY", field, message: `${field} cannot be negative.` });
      }
    }
    if (normalized.sku && (fileSkuCounts.get(normalized.sku) ?? 0) > 1) {
      issues.push({ code: "DUPLICATE_SKU_FILE", field: "sku", message: `SKU ${normalized.sku} occurs more than once in this file.` });
    }
    if (normalized.sku && existingSkus.has(normalized.sku)) {
      issues.push({ code: "DUPLICATE_SKU_EXISTING", field: "sku", message: `SKU ${normalized.sku} already exists in inventory.` });
    }

    if (issues.length > 0) {
      rejectedRows.push({ sourceRowNumber, source, normalized, issues });
      return;
    }

    let id = deterministicId(`${sourceRowNumber}|${normalized.sku}|${normalized.name}|${normalized.category}|${normalized.unit}`);
    while (usedIds.has(id)) id -= 1;
    usedIds.add(id);
    validRows.push({ sourceRowNumber, source, item: { id, ...normalized } });
  });

  return { totalRows: rows.length, validRows, rejectedRows, mappingIssues: [] };
}

export const INVENTORY_TEMPLATE_HEADERS: Record<InventoryImportField, string> = {
  sku: "SKU",
  name: "Item Name",
  category: "Category",
  unit: "Unit",
  stock_qty: "Opening Quantity",
  low_stock_qty: "Low Stock Threshold",
};

/** Produces a browser-agnostic XLSX payload suitable for a template download. */
export function buildInventoryTemplateBuffer(): ArrayBuffer {
  const headers = INVENTORY_IMPORT_FIELDS.map((field) => INVENTORY_TEMPLATE_HEADERS[field]);
  const worksheet = XLSX.utils.aoa_to_sheet([
    headers,
    ["PPF-001", "Paint Protection Film", "Film", "roll", 10, 2],
  ]);
  worksheet["!cols"] = headers.map((header) => ({ wch: Math.max(14, header.length + 2) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Import");
  return XLSX.write(workbook, { type: "array", bookType: "xlsx", compression: true }) as ArrayBuffer;
}
