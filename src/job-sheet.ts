/** Pure helpers for the paper job-sheet fidelity fields (#36). Signatures/sign-off stay print-only. */
export interface DamageMark {
  id: number;
  /** Percent (0-100) across the diagram width. */
  x: number;
  /** Percent (0-100) down the diagram height. */
  y: number;
  /** Body-mark panel the mark belongs to; absent on legacy top-view marks. */
  view?: BodyView;
}

export const BODY_VIEWS = [
  { key: "LF", label: "Left Front" },
  { key: "LR", label: "Left Rear" },
  { key: "RF", label: "Right Front" },
  { key: "RR", label: "Right Rear" },
] as const;
export type BodyView = (typeof BODY_VIEWS)[number]["key"];
const isBodyView = (value: unknown): value is BodyView => BODY_VIEWS.some((item) => item.key === value);

export const SERVICE_TYPES = ["Repair", "Service", "Detailing", "PPF", "Paint", "Other"] as const;
export const PICKUP_DROP_OPTIONS = ["Customer drop-in", "Workshop pickup", "Pickup and drop", "Drop only"] as const;
export const FUEL_LEVELS = ["Empty", "Quarter", "Half", "Three-quarter", "Full"] as const;

const clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value * 10) / 10));

export function parseDamageMarks(raw: string | null | undefined): DamageMark[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is DamageMark => !!item && typeof item.id === "number" && Number.isFinite(item.x) && Number.isFinite(item.y))
      .map((item) => legacyMarkToUnified({ id: item.id, x: clamp(item.x), y: clamp(item.y), ...(isBodyView(item.view) ? { view: item.view } : {}) }));
  } catch {
    return [];
  }
}

export function serializeDamageMarks(marks: DamageMark[]): string {
  // New saves are always positions on the combined vehicle sheet. `parseDamageMarks`
  // maps historical four-panel marks before they reach this point.
  return JSON.stringify(marks.map((mark) => ({ id: mark.id, x: clamp(mark.x), y: clamp(mark.y) })));
}

/** Keeps old left/right panel records visible on the single combined illustration. */
export function legacyMarkToUnified(mark: DamageMark): DamageMark {
  if (!mark.view) return { id: mark.id, x: clamp(mark.x), y: clamp(mark.y) };
  const origins: Record<BodyView, [number, number]> = { LF: [8, 8], RF: [54, 8], LR: [8, 54], RR: [54, 54] };
  const [left, top] = origins[mark.view];
  return { id: mark.id, x: clamp(left + mark.x * .38), y: clamp(top + mark.y * .38) };
}

export function addDamageMark(marks: DamageMark[], x: number, y: number, view?: BodyView): DamageMark[] {
  const id = marks.reduce((max, mark) => Math.max(max, mark.id), 0) + 1;
  return [...marks, { id, x: clamp(x), y: clamp(y), ...(view ? { view } : {}) }];
}

export function removeDamageMark(marks: DamageMark[], id: number): DamageMark[] {
  return marks.filter((mark) => mark.id !== id);
}

/** Placeholder emitted by `{{blocks.damage_diagram}}`; swapped for the static SVG after sanitising (SVG is not allowed in templates). */
export const DAMAGE_SLOT = '<div class="damage-diagram-slot"></div>';

/** Inner SVG (viewBox 0 0 120 80) of one body-mark panel: a door/fender side profile. Front of the car is on the left for left views, right for right views. */
export function bodyPanelShapes(view: BodyView): string {
  const front = view === "LF" || view === "RR";
  // "front" = the panel shows the front half of the car; the fender sits toward the car's nose.
  const facingLeft = view === "LF" || view === "LR";
  const noseLeft = facingLeft; // left side viewed from the left: nose points left
  const fenderOnLeft = front ? noseLeft : !noseLeft;
  const doorX = fenderOnLeft ? 44 : 12;
  const fenderX = fenderOnLeft ? 8 : 92;
  const fenderW = fenderOnLeft ? 34 : 20;
  const wheelX = fenderOnLeft ? 26 : 102;
  const lamp = front ? `<rect x="${fenderOnLeft ? 8 : 108}" y="34" width="4" height="10" rx="2" fill="#f5d76e" stroke="#9aa5b1"/>` : `<rect x="${fenderOnLeft ? 8 : 108}" y="34" width="4" height="10" rx="2" fill="#e07a7a" stroke="#9aa5b1"/>`;
  return `<rect x="8" y="12" width="104" height="52" rx="8" fill="#f3f5f8" stroke="#7b8794" stroke-width="1.5"/>`
    + `<rect x="${fenderX}" y="14" width="${fenderW}" height="48" rx="4" fill="none" stroke="#c3cad3"/>`
    + `<rect x="${doorX}" y="14" width="64" height="48" rx="5" fill="none" stroke="#9aa5b1"/>`
    + `<rect x="${doorX + 6}" y="18" width="52" height="16" rx="3" fill="#dfe6ee" stroke="#9aa5b1"/>`
    + `<rect x="${doorX + (fenderOnLeft ? 44 : 6)}" y="40" width="14" height="4" rx="2" fill="#c3cad3"/>`
    + `<circle cx="${wheelX}" cy="66" r="10" fill="#4b5563" stroke="#1f2937"/><circle cx="${wheelX}" cy="66" r="4" fill="#d1d5db"/>${lamp}`;
}

/** Static 2x2 body-mark grid with the recorded marks, inline-styled for print / rasterisation. */
export function staticBodyMarksSvg(marks: DamageMark[]): string {
  const panels = BODY_VIEWS.map((item) => {
    const dots = marks.filter((mark) => mark.view === item.key).map((mark) => `<g transform="translate(${mark.x * 1.2} ${mark.y * 0.8})"><circle r="5" fill="#d64545" stroke="#fff" stroke-width="1"/><text text-anchor="middle" dy="2.5" font-size="6" font-weight="700" font-family="Arial,sans-serif" fill="#fff">${mark.id}</text></g>`).join("");
    return `<div style="width:170px"><div style="font:600 11px Arial,sans-serif;margin-bottom:2px">${item.label}</div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" width="170" height="113" role="img" aria-label="${item.label} body panel">${bodyPanelShapes(item.key)}${dots}</svg></div>`;
  });
  return `<div style="display:grid;grid-template-columns:repeat(2,170px);gap:8px">${panels.join("")}</div>`;
}

/** Static (no handlers) vehicle diagram with the recorded marks, inline-styled so it prints and rasterises without app CSS. */
export function staticDamageDiagramSvg(allMarks: DamageMark[]): string {
  return staticTopDiagram(allMarks.map(legacyMarkToUnified));
}

function staticTopDiagram(marks: DamageMark[]): string {
  const dots = marks.map((mark) => `<g transform="translate(${mark.x} ${mark.y * 2})"><circle r="5" fill="#d64545" stroke="#fff" stroke-width="1"/><text text-anchor="middle" dy="2.5" font-size="6" font-weight="700" font-family="Arial,sans-serif" fill="#fff">${mark.id}</text></g>`).join("");
  return `<div style="width:130px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="130" height="260" role="img" aria-label="Vehicle damage diagram, top view"><rect x="18" y="8" width="64" height="184" rx="26" fill="#f3f5f8" stroke="#7b8794" stroke-width="1.5"/><rect x="26" y="40" width="48" height="34" rx="6" fill="#dfe6ee" stroke="#9aa5b1"/><rect x="26" y="128" width="48" height="26" rx="6" fill="#dfe6ee" stroke="#9aa5b1"/><line x1="18" y1="100" x2="82" y2="100" stroke="#c3cad3"/>${dots}</svg><p style="margin:4px 0 0;font:11px Arial,sans-serif">${marks.length} damage mark${marks.length === 1 ? "" : "s"} recorded</p></div>`;
}
