import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

export interface ExportColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

export interface ExportReport<T> {
  title: string;
  filters: string[];
  columns: ExportColumn<T>[];
  rows: T[];
  generatedAt?: Date;
}

export function buildExportMatrix<T>({ title, filters, columns, rows, generatedAt = new Date() }: ExportReport<T>) {
  return [
    [title],
    ["Generated", generatedAt.toLocaleString("en-IN")],
    ["Active filters", filters.length ? filters.join("; ") : "None"],
    [],
    columns.map((column) => column.header),
    ...rows.map((row) => columns.map((column) => column.value(row))),
  ];
}

function fileStem(title: string) {
  return title.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "workshop-report";
}

export function downloadExcel<T>(report: ExportReport<T>) {
  const matrix = buildExportMatrix(report);
  const sheet = XLSX.utils.aoa_to_sheet(matrix);
  sheet["!cols"] = report.columns.map((column, index) => ({
    wch: Math.min(42, Math.max(column.header.length, ...matrix.slice(5).map((row) => String(row[index] ?? "").length)) + 2),
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Report");
  XLSX.writeFile(workbook, `${fileStem(report.title)}.xlsx`, { compression: true });
}

export function downloadPdf<T>(report: ExportReport<T>) {
  const generatedAt = report.generatedAt ?? new Date();
  const document = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const margin = 32;
  const width = document.internal.pageSize.getWidth() - margin * 2;
  const columnWidth = width / Math.max(1, report.columns.length);
  const lineHeight = 15;
  let y = margin;

  const header = () => {
    document.setFont("helvetica", "bold");
    document.setFontSize(15);
    document.text(report.title, margin, y);
    y += 18;
    document.setFont("helvetica", "normal");
    document.setFontSize(8);
    document.text(`Generated: ${generatedAt.toLocaleString("en-IN")}`, margin, y);
    y += 12;
    document.text(`Active filters: ${report.filters.length ? report.filters.join("; ") : "None"}`, margin, y, { maxWidth: width });
    y += 20;
    document.setFont("helvetica", "bold");
    report.columns.forEach((column, index) => document.text(column.header, margin + index * columnWidth, y, { maxWidth: columnWidth - 5 }));
    document.line(margin, y + 4, margin + width, y + 4);
    y += lineHeight;
    document.setFont("helvetica", "normal");
  };

  header();
  for (const row of report.rows) {
    if (y > document.internal.pageSize.getHeight() - margin) {
      document.addPage();
      y = margin;
      header();
    }
    report.columns.forEach((column, index) => {
      const value = String(column.value(row) ?? "").replace(/[^\x20-\x7E]/g, " ");
      document.text(value, margin + index * columnWidth, y, { maxWidth: columnWidth - 5 });
    });
    y += lineHeight;
  }
  document.save(`${fileStem(report.title)}.pdf`);
}
