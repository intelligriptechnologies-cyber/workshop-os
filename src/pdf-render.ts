/**
 * PDF from the sandbox-safe template HTML (decision: ADR 0002). jsPDF's html() renders through html2canvas,
 * which is exactly what html2pdf.js wraps, so no extra dependency is needed. Output is raster, and the system
 * font carries the rupee glyph. Callers fall back to print-to-PDF when this throws.
 */
export async function renderHtmlToPdf(html: string, filename: string): Promise<void> {
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;left:-10000px;top:0;width:794px;background:#fff;color:#111";
  host.innerHTML = html;
  document.body.appendChild(host);
  try {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    await pdf.html(host, { html2canvas: { scale: 2, useCORS: false, backgroundColor: "#ffffff" }, margin: 0, width: 595, windowWidth: 794, autoPaging: "text" });
    pdf.save(filename);
  } finally {
    host.remove();
  }
}
