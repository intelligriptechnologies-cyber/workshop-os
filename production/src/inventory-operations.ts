export type InventoryImportInput = { sku?: unknown; warehouseCode?: unknown; quantity?: unknown; valueMinor?: unknown };
export type NormalizedInventoryImportRow = {
  rowNumber: number; sku: string; warehouseCode: string; quantity: string; valueMinor: string; errors: string[];
};

const decimal = /^(?:0|[1-9]\d*)(?:\.\d{1,6})?$/;
const integer = /^(?:0|[1-9]\d*)$/;
const maxQuantityUnits = 10n ** 38n - 1n;
const maxValueMinor = 9223372036854775807n;

function normalizedDecimal(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!decimal.test(raw)) return raw;
  const [whole, fraction = ""] = raw.split(".");
  const normalizedFraction = fraction.replace(/0+$/, "");
  return normalizedFraction ? `${whole}.${normalizedFraction}` : whole;
}

export function inventoryQuantityUnits(value: string): bigint { const [whole, fraction=""] = value.split("."); return BigInt(whole) * 1_000_000n + BigInt(fraction.padEnd(6,"0")); }
export function formatInventoryQuantity(units: bigint): string { const whole=units/1_000_000n,fraction=(units%1_000_000n).toString().padStart(6,"0").replace(/0+$/,""); return fraction?`${whole}.${fraction}`:whole.toString(); }
export function isValidInventoryQuantity(value: string): boolean { try { const units=inventoryQuantityUnits(value); return decimal.test(value)&&units>0n&&units<=maxQuantityUnits; } catch { return false; } }
export function isValidInventoryValueMinor(value: string): boolean { try { return integer.test(value)&&BigInt(value)<=maxValueMinor; } catch { return false; } }

export function normalizeInventoryImportRows(input: unknown): NormalizedInventoryImportRow[] {
  if (!Array.isArray(input)) return [];
  return input.map((raw, index) => {
    const source = raw && typeof raw === "object" ? raw as InventoryImportInput : {};
    const sku = String(source.sku ?? "").trim().toUpperCase();
    const warehouseCode = String(source.warehouseCode ?? "").trim().toUpperCase();
    const quantity = normalizedDecimal(source.quantity);
    const valueMinor = String(source.valueMinor ?? "").trim();
    const errors: string[] = [];
    if (!sku) errors.push("SKU_REQUIRED");
    if (!warehouseCode) errors.push("WAREHOUSE_REQUIRED");
    if (!isValidInventoryQuantity(quantity)) errors.push("QUANTITY_INVALID");
    if (!isValidInventoryValueMinor(valueMinor)) errors.push("VALUE_MINOR_INVALID");
    return { rowNumber: index + 1, sku, warehouseCode, quantity, valueMinor, errors };
  });
}

function csv(value: unknown): string {
  const raw = String(value ?? "");
  return /[",\r\n]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw;
}

export function buildInventoryErrorManifest(rows: NormalizedInventoryImportRow[]) {
  const rejected = rows.filter((row) => row.errors.length);
  const lines = ["row,sku,warehouseCode,errors", ...rejected.map((row) => [row.rowNumber, row.sku, row.warehouseCode, row.errors.join("|")].map(csv).join(","))];
  return { content: Buffer.from(`${lines.join("\r\n")}\r\n`, "utf8"), filename: "inventory-import-errors.csv", mimeType: "text/csv; charset=utf-8", rowCount: rejected.length };
}
