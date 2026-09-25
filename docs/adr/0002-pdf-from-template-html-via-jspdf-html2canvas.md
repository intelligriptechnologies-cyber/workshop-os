# 0002. PDFs render from template HTML through jsPDF html() with a print fallback

Status: accepted (demo scope). Reconciles wayfinder tickets #19 and #26; built in #43.

## Context

#19 recommended jsPDF plus autotable with an embedded TTF for the rupee glyph, and html2pdf.js only if HTML pixel fidelity was needed. #26 then made the Owner-edited, sanitised template HTML the source of every document, so the PDF must come from that HTML, not from hand-laid jsPDF text.

## Decision

- Every document (Estimate, Invoice, Receipt, Gate Pass, Job Card sheet) is the merged and sanitised template HTML, rendered to PDF in the browser with `jsPDF.html()`. That call rasterises the HTML through html2canvas, which is what html2pdf.js wraps, so no new dependency is added (jsPDF is already installed; html2canvas ships with it).
- The rupee glyph and company branding come from the HTML rendered with the system font, replacing the ASCII-only jsPDF text path. Output is raster, which is accepted for the demo.
- Fallback: any generation error opens the same HTML in a print window (Save as PDF). A separate Print button offers it directly.
- Frozen documents (approved Estimate, Cleared Invoice, Receipt, Gate Pass, void documents) render from a stored snapshot `{templateId, html, values, lines}` taken when they froze, so later template or Company Settings edits never change them.
- The Job Card sheet embeds the damage diagram as static inline SVG injected after sanitising (templates cannot contain SVG).

## Consequences

PDF text is not selectable. If selectable text or a smaller file is needed later, swap `src/pdf-render.ts` for jsPDF plus autotable; nothing else depends on the approach.
