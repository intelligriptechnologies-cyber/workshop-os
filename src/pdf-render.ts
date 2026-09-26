/**
 * PDF from the sandbox-safe template HTML (decision: ADR 0002). The HTML is rasterised with html2canvas (system font,
 * so the rupee glyph renders) at A4 proportions and placed on A4 pages as images. jsPDF.html() is not used: it would
 * draw vector text with the built-in Helvetica (no rupee sign) and, when html2canvas.scale is set, ignores its own
 * width fitting, which clipped the right edge. Callers fall back to print-to-PDF when this throws.
 */
const PAGE_WIDTH_PX = 794;
const A4_RATIO = 841.89 / 595.28;
const SCALE = 2;

export async function renderHtmlToPdf(html: string, filename: string): Promise<void> {
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = `position:fixed;left:0;top:0;z-index:-1;pointer-events:none;box-sizing:border-box;width:${PAGE_WIDTH_PX}px;background:#fff;color:#111`;
  host.innerHTML = html;
  document.body.appendChild(host);
  try {
    const [{ jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")]);
    const canvas = await html2canvas(host, { scale: SCALE, useCORS: false, backgroundColor: "#ffffff", width: PAGE_WIDTH_PX, windowWidth: PAGE_WIDTH_PX, scrollX: 0, scrollY: 0 });
    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const slice = Math.floor(canvas.width * A4_RATIO);
    const pages = Math.max(1, Math.ceil((canvas.height - 2) / slice));
    for (let index = 0; index < pages; index += 1) {
      const height = Math.min(slice, canvas.height - index * slice);
      const part = document.createElement("canvas");
      part.width = canvas.width;
      part.height = slice;
      const context = part.getContext("2d");
      if (!context) throw new Error("Canvas is not available.");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, part.width, part.height);
      context.drawImage(canvas, 0, index * slice, canvas.width, height, 0, 0, canvas.width, height);
      if (index > 0) pdf.addPage();
      pdf.addImage(part.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, pageWidth, pageHeight);
    }
    pdf.save(filename);
  } finally {
    host.remove();
  }
}
