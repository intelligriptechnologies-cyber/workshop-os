import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import type { InventoryPosition } from "../local/database.js";

export function createInventoryExportArtifact(format: "PDF" | "XLSX", rows: InventoryPosition[]) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const table = rows.map((row) => ({ SKU: row.sku, Warehouse: row.warehouseName, Quantity: row.quantity, UOM: row.baseUom, ValueMinor: row.valueMinor, ReorderPoint: row.reorderPoint, Reorder: row.reorder ? "YES" : "NO", AgeDays: row.ageDays ?? "Never moved", Branch: row.branchId }));
  if (format === "XLSX") { const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(table), "inventory"); return { content: Buffer.from(XLSX.write(workbook, { bookType: "xlsx", type: "buffer", compression: true })), rowCount: rows.length, filename: `inventory-${stamp}.xlsx`, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }; }
  const document = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" }); document.setFontSize(16); document.text("WorkshopOS inventory", 36, 38); document.setFontSize(8); let y = 60;
  table.forEach((row, index) => { if (y > 555) { document.addPage(); y = 38; } document.text(`${index + 1}. ${Object.values(row).join(" | ")}`, 36, y, { maxWidth: 760 }); y += 14; }); if (!rows.length) document.text("No matching inventory", 36, y);
  return { content: Buffer.from(document.output("arraybuffer")), rowCount: rows.length, filename: `inventory-${stamp}.pdf`, mimeType: "application/pdf" };
}
