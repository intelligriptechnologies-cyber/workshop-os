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
