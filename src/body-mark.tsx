import { Download, X } from "lucide-react";
import { useState } from "react";
import { addDamageMark, removeDamageMark, staticDamageDiagramSvg, type DamageMark } from "./job-sheet";

export interface BodyMarkMeta {
  jobNo?: string;
  vehicleName: string;
  color?: string;
  regNo: string;
}

const esc = (value: string) => value.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch] ?? ch);

/** Renders the annotated combined vehicle sheet to a PNG and downloads it. */
export async function downloadBodyMarkImage(marks: DamageMark[], meta: BodyMarkMeta) {
  const width = 400;
  const line = [meta.jobNo ? `Job Card: ${meta.jobNo}` : "Job Card: (new)", `Vehicle: ${meta.vehicleName || "-"}`, `Colour: ${meta.color || "-"}`, `Reg No: ${meta.regNo || "-"}`];
  const height = 390;
  const diagram = staticDamageDiagramSvg(marks).replace(/width="130" height="260"/, 'x="135" y="96" width="130" height="260"');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#fff"/><text x="8" y="22" font-size="15" font-weight="700" font-family="Arial,sans-serif">Body Mark</text>${line.map((text, i) => `<text x="8" y="${42 + i * 16}" font-size="12" font-family="Arial,sans-serif">${esc(text)}</text>`).join("")}${diagram}</svg>`;
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

/** Combined vehicle illustration with normalized, removable damage markers. */
export function BodyMarkDiagram({ marks, onChange, meta, hideDownload = false }: { marks: DamageMark[]; onChange?: (marks: DamageMark[]) => void; meta: BodyMarkMeta; hideDownload?: boolean }) {
  const [error, setError] = useState("");
  const download = () => { setError(""); downloadBodyMarkImage(marks, meta).catch((err) => setError(err instanceof Error ? err.message : "Download failed.")); };
  return (
    <div className="body-mark" data-testid="damage-diagram">
      <div className={`body-mark-canvas${onChange ? " editable" : ""}`} role="group" aria-label="Combined vehicle body-mark illustration" onClick={onChange ? (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onChange(addDamageMark(marks, ((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100));
      } : undefined}>
        <img src="/body-mark-vehicle.svg" alt="Vehicle body illustration" />
        {marks.map((mark) => <button key={mark.id} type="button" className="damage-marker" data-testid="damage-mark" style={{ left: `${mark.x}%`, top: `${mark.y}%` }} aria-label={`Remove damage mark ${mark.id}`} title={`Remove damage mark ${mark.id}`} onClick={(event) => { event.stopPropagation(); onChange?.(removeDamageMark(marks, mark.id)); }} disabled={!onChange}>{mark.id}<X size={10} aria-hidden="true" /></button>)}
      </div>
      <div className="body-mark-footer">
        <p className="damage-hint">{onChange ? "Click the illustration to mark damage; use a numbered marker to remove it." : ""} {marks.length} mark{marks.length === 1 ? "" : "s"} recorded.</p>
        {!hideDownload && <button type="button" className="document-download" onClick={download}><Download size={15} />Download image</button>}
      </div>
      {error && <p role="alert" className="form-error">{error}</p>}
    </div>
  );
}
