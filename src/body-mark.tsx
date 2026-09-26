import { Download } from "lucide-react";
import { useState } from "react";
import { addDamageMark, BODY_VIEWS, bodyPanelShapes, removeDamageMark, staticBodyMarksSvg, type BodyView, type DamageMark } from "./job-sheet";

export interface BodyMarkMeta {
  jobNo?: string;
  vehicleName: string;
  color?: string;
  regNo: string;
}

const esc = (value: string) => value.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch] ?? ch);

/** Renders the annotated body-mark sheet (job no., vehicle, colour, reg no. + 4 panels) to a PNG and downloads it. */
export async function downloadBodyMarkImage(marks: DamageMark[], meta: BodyMarkMeta) {
  const width = 400;
  const panelW = 190;
  const panelH = 127;
  const line = [meta.jobNo ? `Job Card: ${meta.jobNo}` : "Job Card: (new)", `Vehicle: ${meta.vehicleName || "-"}`, `Colour: ${meta.color || "-"}`, `Reg No: ${meta.regNo || "-"}`];
  const panels = BODY_VIEWS.map((item, index) => {
    const x = 6 + (index % 2) * (panelW + 8);
    const y = 92 + Math.floor(index / 2) * (panelH + 26);
    const dots = marks.filter((mark) => mark.view === item.key).map((mark) => `<g transform="translate(${mark.x * 1.2} ${mark.y * 0.8})"><circle r="5" fill="#d64545" stroke="#fff" stroke-width="1"/><text text-anchor="middle" dy="2.5" font-size="6" font-weight="700" font-family="Arial,sans-serif" fill="#fff">${mark.id}</text></g>`).join("");
    return `<text x="${x}" y="${y - 5}" font-size="12" font-weight="700" font-family="Arial,sans-serif">${item.label}</text><svg x="${x}" y="${y}" width="${panelW}" height="${panelH}" viewBox="0 0 120 80">${bodyPanelShapes(item.key)}${dots}</svg>`;
  }).join("");
  const height = 92 + 2 * (panelH + 26) + 4;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#fff"/><text x="8" y="22" font-size="15" font-weight="700" font-family="Arial,sans-serif">Body Mark</text>${line.map((text, i) => `<text x="8" y="${42 + i * 16}" font-size="12" font-family="Arial,sans-serif">${esc(text)}</text>`).join("")}${panels}</svg>`;
  const scale = 3;
  const image = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("Could not render body mark image.")); image.src = url; });
  const canvas = document.createElement("canvas");
  canvas.width = width * scale; canvas.height = height * scale;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available.");
  context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not create image.");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `body-mark-${(meta.jobNo || meta.regNo || "vehicle").replace(/[^\w-]+/g, "_")}.png`;
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

/** Left/right front/rear door panels with tap-to-mark. Controlled: pass `marks`; omit `onChange` for read-only. Reusable in Create Visit and Job edit. */
export function BodyMarkDiagram({ marks, onChange, meta, hideDownload = false }: { marks: DamageMark[]; onChange?: (marks: DamageMark[]) => void; meta: BodyMarkMeta; hideDownload?: boolean }) {
  const [error, setError] = useState("");
  const download = () => { setError(""); downloadBodyMarkImage(marks, meta).catch((err) => setError(err instanceof Error ? err.message : "Download failed.")); };
  const bodyMarks = marks.filter((mark) => mark.view);
  return (
    <div className="body-mark" data-testid="damage-diagram">
      <div className="body-mark-grid">
        {BODY_VIEWS.map((item) => (
          <figure key={item.key} className="body-mark-panel">
            <figcaption>{item.label}</figcaption>
            <svg viewBox="0 0 120 80" role="img" aria-label={`${item.label} body panel`} onClick={onChange ? (event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              onChange(addDamageMark(marks, ((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100, item.key));
            } : undefined}>
              <g dangerouslySetInnerHTML={{ __html: bodyPanelShapes(item.key) }} />
              {marks.filter((mark) => mark.view === item.key).map((mark) => (
                <g key={mark.id} className="damage-mark" data-testid="damage-mark" transform={`translate(${mark.x * 1.2} ${mark.y * 0.8})`} onClick={(event) => { event.stopPropagation(); onChange?.(removeDamageMark(marks, mark.id)); }}>
                  <circle r="5" /><text textAnchor="middle" dy="2.5">{mark.id}</text>
                </g>
              ))}
            </svg>
          </figure>
        ))}
      </div>
      <div className="body-mark-footer">
        <p className="damage-hint">{onChange ? "Tap a panel to mark damage; tap a mark to remove it." : ""} {bodyMarks.length} mark{bodyMarks.length === 1 ? "" : "s"} recorded.</p>
        {!hideDownload && <button type="button" className="document-download" onClick={download}><Download size={15} />Download image</button>}
      </div>
      {error && <p role="alert" className="form-error">{error}</p>}
    </div>
  );
}

export { staticBodyMarksSvg };
