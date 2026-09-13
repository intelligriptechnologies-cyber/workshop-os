import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

export type ExportableWorkItem = { id: string; branchId: string; summary: string; version: number; updatedAt: string };

export function createWorkItemExportArtifact(format: "PDF" | "XLSX", rows: ExportableWorkItem[]) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  if (format === "XLSX") {
    const sheet = XLSX.utils.json_to_sheet(rows.map((row) => ({
      Summary: row.summary, Branch: row.branchId, Version: row.version, Updated: row.updatedAt, Reference: row.id,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Work items");
    return {
      content: Buffer.from(XLSX.write(workbook, { bookType: "xlsx", type: "buffer", compression: true })),
      rowCount: rows.length, filename: `work-items-${stamp}.xlsx`,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }
  const document = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  document.setFontSize(16); document.text("WorkshopOS work items", 36, 38);
  document.setFontSize(9);
  let y = 60;
  rows.forEach((row, index) => {
    if (y > 555) { document.addPage(); y = 38; }
    document.text(`${index + 1}. ${row.summary} | ${row.branchId} | v${row.version} | ${row.updatedAt}`, 36, y, { maxWidth: 760 });
    y += 14;
  });
  if (!rows.length) document.text("No matching work items", 36, y);
  return { content: Buffer.from(document.output("arraybuffer")), rowCount: rows.length, filename: `work-items-${stamp}.pdf`, mimeType: "application/pdf" };
}
