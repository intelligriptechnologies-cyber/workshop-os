import { jsPDF } from "jspdf";
import { writeObjectXlsx } from "../../shared/xlsx-writer.js";

export const REMAINING_SCREEN_KEYS = ["appointments", "follow-ups", "action-inbox", "materials", "reports", "masters"] as const;
export type RemainingScreenKey = (typeof REMAINING_SCREEN_KEYS)[number];

export type RemainingScreenRow = {
  id: string;
  branchId: string;
  title: string;
  subtitle: string;
  status: string;
  updatedAt: string;
  version: number;
};

export const REMAINING_SCREEN_META: Record<RemainingScreenKey, { label: string; readPermission: string; managePermission?: string }> = {
  appointments: { label: "Appointments", readPermission: "appointment.read", managePermission: "appointment.manage" },
  "follow-ups": { label: "Follow-ups", readPermission: "follow-up.read", managePermission: "follow-up.manage" },
  "action-inbox": { label: "Action inbox", readPermission: "action-inbox.read", managePermission: "action-inbox.manage" },
  materials: { label: "Material issue and reconciliation", readPermission: "material.read", managePermission: "material.manage" },
  reports: { label: "Reports", readPermission: "report.read" },
  masters: { label: "Operational masters", readPermission: "masters.read" },
};

export function isRemainingScreenKey(value: string): value is RemainingScreenKey {
  return (REMAINING_SCREEN_KEYS as readonly string[]).includes(value);
}

export function createRemainingScreenExportArtifact(screen: RemainingScreenKey, format: "PDF" | "XLSX", rows: RemainingScreenRow[]) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const table = rows.map((row) => ({ Reference: row.id, Branch: row.branchId, Title: row.title, Detail: row.subtitle, Status: row.status, Updated: row.updatedAt, Version: row.version }));
  if (format === "XLSX") {
    return { content: Buffer.from(writeObjectXlsx(table, screen)), rowCount: rows.length, filename: `${screen}-${stamp}.xlsx`, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
  }
  const document = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  document.setFontSize(16); document.text(`WorkshopOS ${REMAINING_SCREEN_META[screen].label}`, 36, 38); document.setFontSize(9);
  let y = 60;
  table.forEach((row, index) => { if (y > 555) { document.addPage(); y = 38; } document.text(`${index + 1}. ${Object.values(row).join(" | ")}`, 36, y, { maxWidth: 760 }); y += 14; });
  if (!rows.length) document.text("No matching records", 36, y);
  return { content: Buffer.from(document.output("arraybuffer")), rowCount: rows.length, filename: `${screen}-${stamp}.pdf`, mimeType: "application/pdf" };
}
