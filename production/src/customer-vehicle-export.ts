import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import type { CustomerRecord, VehicleRecord } from "../local/database.js";

export function createCustomerVehicleExportArtifact(screen: "customers" | "vehicles", format: "PDF" | "XLSX", rows: CustomerRecord[] | VehicleRecord[]) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const table = screen === "customers" ? (rows as CustomerRecord[]).map((row) => ({ Name: row.displayName, Mobile: row.mobile, Email: row.email, Branch: row.branchId, Version: row.version, Reference: row.id })) : (rows as VehicleRecord[]).map((row) => ({ Registration: row.registration, VIN: row.vin, Make: row.make, Model: row.model, Owner: row.ownerName, Branch: row.branchId, Version: row.version, Reference: row.id }));
  if (format === "XLSX") { const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(table), screen); return { content: Buffer.from(XLSX.write(workbook, { bookType: "xlsx", type: "buffer", compression: true })), rowCount: rows.length, filename: `${screen}-${stamp}.xlsx`, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }; }
  const document = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" }); document.setFontSize(16); document.text(`WorkshopOS ${screen}`, 36, 38); document.setFontSize(9); let y = 60;
  table.forEach((row, index) => { if (y > 555) { document.addPage(); y = 38; } document.text(`${index + 1}. ${Object.values(row).join(" | ")}`, 36, y, { maxWidth: 760 }); y += 14; }); if (!rows.length) document.text(`No matching ${screen}`, 36, y);
  return { content: Buffer.from(document.output("arraybuffer")), rowCount: rows.length, filename: `${screen}-${stamp}.pdf`, mimeType: "application/pdf" };
}
