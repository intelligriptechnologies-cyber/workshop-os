import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import type { JobRecord } from "../local/database.js";
export function createJobListExportArtifact(
  format: "PDF" | "XLSX",
  rows: JobRecord[],
) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const table = rows.map((r) => ({
    Job: r.jobNumber,
    "Visit/check-in date": r.visitDate,
    Customer: r.customerName,
    Vehicle: r.registration,
    Status: r.statusLabel,
    Branch: r.branchId,
    Reference: r.id,
  }));
  if (format === "XLSX") {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(table), "Jobs");
    return {
      content: Buffer.from(
        XLSX.write(wb, { bookType: "xlsx", type: "buffer", compression: true }),
      ),
      rowCount: rows.length,
      filename: `jobs-${stamp}.xlsx`,
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  }
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  pdf.setFontSize(16);
  pdf.text("WorkshopOS Jobs", 36, 38);
  pdf.setFontSize(9);
  let y = 60;
  table.forEach((r, i) => {
    if (y > 555) {
      pdf.addPage();
      y = 38;
    }
    pdf.text(`${i + 1}. ${Object.values(r).join(" | ")}`, 36, y, {
      maxWidth: 760,
    });
    y += 14;
  });
  if (!rows.length) pdf.text("No matching Jobs", 36, y);
  return {
    content: Buffer.from(pdf.output("arraybuffer")),
    rowCount: rows.length,
    filename: `jobs-${stamp}.pdf`,
    mimeType: "application/pdf",
  };
}
export function createJobCardPdf(job: JobRecord) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  pdf.setFontSize(18);
  pdf.text(`WorkshopOS Job Card ${job.jobNumber}`, 40, 48);
  pdf.setFontSize(11);
  [
    ["Visit/check-in", job.checkedInAt],
    ["Customer", job.customerName],
    ["Vehicle", `${job.registration} · ${job.vehicleDescription}`],
    ["Status", job.statusLabel],
    ["Customer request", job.customerRequest],
    ["Promised handoff", job.promisedHandoffAt],
  ].forEach(([a, b], i) =>
    pdf.text(`${a}: ${b}`, 40, 82 + i * 24, { maxWidth: 510 }),
  );
  return {
    content: Buffer.from(pdf.output("arraybuffer")),
    filename: `job-card-${job.jobNumber}.pdf`,
    mimeType: "application/pdf",
  };
}
