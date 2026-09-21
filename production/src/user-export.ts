import { jsPDF } from "jspdf";
import { writeObjectXlsx } from "../../shared/xlsx-writer.js";

import type { ManagedUser } from "./admin-users.js";

export function createUserExportArtifact(format: "PDF" | "XLSX", rows: ManagedUser[]) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const exportRows = rows.map((user) => ({
    Name: user.name, Email: user.email, Status: user.status,
    Roles: user.roles.map((role) => role.name).join(", "), Branches: user.branches.map((branch) => branch.name).join(", "),
    Version: user.version, Updated: user.updatedAt,
  }));
  if (format === "XLSX") {
    return { content: Buffer.from(writeObjectXlsx(exportRows, "Users")), rowCount: rows.length,
      filename: `users-${stamp}.xlsx`, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
  }
  const document = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  document.setFontSize(16); document.text("WorkshopOS tenant users", 36, 38); document.setFontSize(9);
  let y = 60;
  exportRows.forEach((row, index) => {
    if (y > 555) { document.addPage(); y = 38; }
    document.text(`${index + 1}. ${row.Name} | ${row.Email} | ${row.Status} | ${row.Roles} | ${row.Branches}`, 36, y, { maxWidth: 760 }); y += 14;
  });
  if (!rows.length) document.text("No matching users", 36, y);
  return { content: Buffer.from(document.output("arraybuffer")), rowCount: rows.length, filename: `users-${stamp}.pdf`, mimeType: "application/pdf" };
}
