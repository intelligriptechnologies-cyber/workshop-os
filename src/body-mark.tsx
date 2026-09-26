import { Download, X } from "lucide-react";
import { useState } from "react";
import { addDamageMark, DAMAGE_DIAGRAM_ASSET, legacyMarkToUnified, removeDamageMark, type DamageMark } from "./job-sheet";

export interface BodyMarkMeta {
  jobNo?: string;
  vehicleName: string;
  color?: string;
  regNo: string;
  recordedAt?: string | null;
}

function formatRecordedAt(recordedAt?: string | null) {
  if (!recordedAt) return "Not recorded";
  const date = new Date(recordedAt);
  return Number.isNaN(date.valueOf()) ? recordedAt : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

/** Renders the annotated combined vehicle sheet to a PNG and downloads it. */
export async function downloadBodyMarkImage(marks: DamageMark[], meta: BodyMarkMeta) {
  const width = 600;
  const padding = 24;
  const headerHeight = 152;
  const line = [meta.jobNo ? `Job Card: ${meta.jobNo}` : "Job Card: (new)", `Vehicle: ${meta.vehicleName || "-"}`, `Colour: ${meta.color || "-"}`, `Reg No: ${meta.regNo || "-"}`, `Date & Time of Record: ${formatRecordedAt(meta.recordedAt)}`];
  const image = new Image();
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("Could not load body mark illustration.")); image.src = DAMAGE_DIAGRAM_ASSET; });
  const diagramWidth = width - padding * 2;
  const diagramHeight = Math.round(diagramWidth * (image.naturalHeight / image.naturalWidth));
  const height = headerHeight + diagramHeight + padding;
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale; canvas.height = height * scale;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available.");
  context.scale(scale, scale);
  context.fillStyle = "#fff"; context.fillRect(0, 0, width, height);
  context.fillStyle = "#18222d"; context.font = "700 20px Arial,sans-serif"; context.fillText("Body Mark", padding, 30);
  context.font = "14px Arial,sans-serif";
  line.forEach((text, index) => context.fillText(text, padding, 54 + index * 18));
  context.drawImage(image, padding, headerHeight, diagramWidth, diagramHeight);
  marks.map(legacyMarkToUnified).forEach((mark) => {
    const x = padding + diagramWidth * mark.x / 100;
    const y = headerHeight + diagramHeight * mark.y / 100;
    context.beginPath(); context.arc(x, y, 14, 0, Math.PI * 2);
    context.fillStyle = "#dc3545"; context.fill();
    context.lineWidth = 2; context.strokeStyle = "#fff"; context.stroke();
    context.fillStyle = "#fff"; context.font = "700 12px Arial,sans-serif"; context.textAlign = "center"; context.textBaseline = "middle"; context.fillText(String(mark.id), x, y + .5);
  });
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not create image.");
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `body-mark-${(meta.jobNo || meta.regNo || "vehicle").replace(/[^\w-]+/g, "_")}.png`;
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
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
        <img src={DAMAGE_DIAGRAM_ASSET} alt="Vehicle body illustration" />
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
