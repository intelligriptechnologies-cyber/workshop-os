import type { AdminDemoState } from "./admin-demo-state";
import type { JobView } from "./types";
import { documentInfo, renderLive, SLOT_KINDS, type DocumentKind } from "./job-documents";
import { buildReportLines, buildReportValues, type ReportCategory, type ReportLine } from "./report-templates";

/**
 * A frozen document. Written when an Estimate is approved, an Invoice is Cleared, a Receipt / Gate Pass is created,
 * or a document is voided; it keeps the Active template and Company Settings as they were, so later edits never rewrite it.
 */
export interface DocumentSnapshot {
  id: string;
  jobId: number;
  jobNo: string;
  kind: DocumentKind;
  number: string;
  state: "frozen" | "void";
  templateId: string;
  html: string;
  values: Record<string, string>;
  lines: ReportLine[];
  frozenAt: string;
  voidedAt?: string;
}

export const DOCUMENT_SNAPSHOT_KEY = "workshopos.documentSnapshots.v1";

export interface SnapshotStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem?(key: string): void }

const browserStorage = (): SnapshotStorage | undefined => { try { return typeof sessionStorage === "undefined" ? undefined : sessionStorage; } catch { return undefined; } };

let cache: DocumentSnapshot[] | undefined;

export function loadDocumentSnapshots(storage: SnapshotStorage | undefined = browserStorage()): DocumentSnapshot[] {
  if (cache && storage === browserStorage()) return cache;
  let parsed: DocumentSnapshot[] = [];
  try { const raw = storage?.getItem(DOCUMENT_SNAPSHOT_KEY); const value = raw ? JSON.parse(raw) : []; parsed = Array.isArray(value) ? value : []; } catch { parsed = []; }
  if (storage === browserStorage()) cache = parsed;
  return parsed;
}

export function saveDocumentSnapshots(snapshots: DocumentSnapshot[], storage: SnapshotStorage | undefined = browserStorage()) {
  if (storage === browserStorage()) cache = snapshots;
  try { storage?.setItem(DOCUMENT_SNAPSHOT_KEY, JSON.stringify(snapshots)); } catch { /* quota or blocked storage: keep the in-memory copy */ }
}

export function clearDocumentSnapshots(storage: SnapshotStorage | undefined = browserStorage()) { saveDocumentSnapshots([], storage); }

type Templates = Pick<AdminDemoState, "reportTemplates" | "businessSettings" | "companyAssets">;

function freeze(kind: DocumentKind, view: JobView, number: string, admin: Templates, now: string): DocumentSnapshot {
  const category = kind as ReportCategory;
  return {
    id: `${view.job.id}:${kind}:${number}:${now}`, jobId: view.job.id, jobNo: view.job.job_no, kind, number, state: "frozen",
    templateId: admin.reportTemplates.find((template) => template.category === category && template.active)?.id ?? "",
    html: renderLive(kind, view, admin), values: buildReportValues(category, view, admin.businessSettings, admin.companyAssets), lines: buildReportLines(category, view), frozenAt: now,
  };
}

/**
 * Pure planner: given the job views before and after a change, returns the next snapshot list.
 * `prev` may be omitted (first load): frozen documents that have no snapshot yet are frozen from `next`.
 */
export function planSnapshots(existing: readonly DocumentSnapshot[], prev: readonly JobView[] | undefined, next: readonly JobView[], admin: Templates, now: string = new Date().toISOString()): DocumentSnapshot[] {
  let snapshots = [...existing];
  const prevById = new Map((prev ?? []).map((view) => [view.job.id, view]));
  const live = (jobId: number, jobNo: string, kind: DocumentKind, number: string) => snapshots.findIndex((item) => item.jobId === jobId && item.jobNo === jobNo && item.kind === kind && item.number === number && item.state === "frozen");
  for (const view of next) {
    const candidate = prevById.get(view.job.id);
    const before = candidate && candidate.job.job_no === view.job.job_no ? candidate : undefined;
    for (const kind of SLOT_KINDS) {
      const was = before && documentInfo(kind, before);
      const now_ = documentInfo(kind, view);
      try {
        if (was && (!now_ || now_.number !== was.number)) {
          const index = live(view.job.id, view.job.job_no, kind, was.number);
          if (index >= 0) snapshots[index] = { ...snapshots[index], state: "void", voidedAt: now };
          else snapshots.push({ ...freeze(kind, before!, was.number, admin, now), state: "void", voidedAt: now });
        }
        if (now_) {
          const index = live(view.job.id, view.job.job_no, kind, now_.number);
          if (now_.frozen && index < 0) snapshots.push(freeze(kind, view, now_.number, admin, now));
          // An Invoice reopened by a voided payment is live again; it re-freezes when Cleared once more.
          if (!now_.frozen && index >= 0) snapshots = snapshots.filter((_item, position) => position !== index);
        }
      } catch { /* a missing template must never break a job update */ }
    }
  }
  return snapshots;
}

/** Applies planSnapshots to the stored list; returns true when anything changed. */
export function syncDocumentSnapshots(prev: readonly JobView[] | undefined, next: readonly JobView[], admin: Templates, storage?: SnapshotStorage): boolean {
  const existing = loadDocumentSnapshots(storage);
  const updated = planSnapshots(existing, prev, next, admin);
  if (JSON.stringify(updated) === JSON.stringify(existing)) return false;
  saveDocumentSnapshots(updated, storage);
  return true;
}
