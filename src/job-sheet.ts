/** Pure helpers for the paper job-sheet fidelity fields (#36). Signatures/sign-off stay print-only. */
export interface DamageMark {
  id: number;
  /** Percent (0-100) across the diagram width. */
  x: number;
  /** Percent (0-100) down the diagram height. */
  y: number;
}

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
      .map((item) => ({ id: item.id, x: clamp(item.x), y: clamp(item.y) }));
  } catch {
    return [];
  }
}

export function serializeDamageMarks(marks: DamageMark[]): string {
  return JSON.stringify(marks.map((mark) => ({ id: mark.id, x: clamp(mark.x), y: clamp(mark.y) })));
}

export function addDamageMark(marks: DamageMark[], x: number, y: number): DamageMark[] {
  const id = marks.reduce((max, mark) => Math.max(max, mark.id), 0) + 1;
  return [...marks, { id, x: clamp(x), y: clamp(y) }];
}

export function removeDamageMark(marks: DamageMark[], id: number): DamageMark[] {
  return marks.filter((mark) => mark.id !== id);
}

/** Placeholder emitted by `{{blocks.damage_diagram}}`; swapped for the static SVG after sanitising (SVG is not allowed in templates). */
export const DAMAGE_SLOT = '<div class="damage-diagram-slot"></div>';

/** Static (no handlers) vehicle diagram with the recorded marks, inline-styled so it prints and rasterises without app CSS. */
export function staticDamageDiagramSvg(marks: DamageMark[]): string {
  const dots = marks.map((mark) => `<g transform="translate(${mark.x} ${mark.y * 2})"><circle r="5" fill="#d64545" stroke="#fff" stroke-width="1"/><text text-anchor="middle" dy="2.5" font-size="6" font-weight="700" font-family="Arial,sans-serif" fill="#fff">${mark.id}</text></g>`).join("");
  return `<div style="width:130px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="130" height="260" role="img" aria-label="Vehicle damage diagram, top view"><rect x="18" y="8" width="64" height="184" rx="26" fill="#f3f5f8" stroke="#7b8794" stroke-width="1.5"/><rect x="26" y="40" width="48" height="34" rx="6" fill="#dfe6ee" stroke="#9aa5b1"/><rect x="26" y="128" width="48" height="26" rx="6" fill="#dfe6ee" stroke="#9aa5b1"/><line x1="18" y1="100" x2="82" y2="100" stroke="#c3cad3"/>${dots}</svg><p style="margin:4px 0 0;font:11px Arial,sans-serif">${marks.length} damage mark${marks.length === 1 ? "" : "s"} recorded</p></div>`;
}
