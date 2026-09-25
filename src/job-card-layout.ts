import { resolveJobDocumentActions, resolveJobDocuments, type DocumentKind, type JobDocumentAction } from "./job-documents";
import type { JobView, User } from "./types";

export const JOB_CARD_TABS = [
  { key: "details", label: "Details" },
  { key: "materials", label: "Materials" },
  { key: "documents", label: "Documents" },
  { key: "media", label: "Photos / Media" },
  { key: "invoice", label: "Invoice" },
  { key: "payment", label: "Payment" },
] as const;

export type JobCardTabKey = (typeof JOB_CARD_TABS)[number]["key"];

/** Tabs whose real content ships in a later ticket render a stub. */
export const JOB_CARD_STUB_TABS: readonly JobCardTabKey[] = ["materials", "invoice", "payment"];

export function isStubTab(key: JobCardTabKey) {
  return JOB_CARD_STUB_TABS.includes(key);
}

export type FooterAction = Exclude<JobDocumentAction, "download">;

export interface FooterDownload {
  kind: DocumentKind;
  label: string;
  enabled: boolean;
  reason?: string;
}

export interface JobCardFooter {
  actions: FooterAction[];
  downloads: FooterDownload[];
}

const ACTION_ORDER: FooterAction[] = ["create-estimate", "edit-estimate", "create-invoice", "edit-invoice"];

/** Contextual actions (left) and document downloads (right) for the sticky footer. */
export function resolveJobCardFooter(view: JobView, actor: Pick<User, "id" | "role">): JobCardFooter {
  const actions = new Set<FooterAction>();
  for (const kind of ["estimate", "invoice"] as const) {
    for (const action of resolveJobDocumentActions(kind, view, actor)) if (action !== "download") actions.add(action);
  }
  const downloads = resolveJobDocuments(view).map((doc) => ({
    kind: doc.kind,
    label: doc.label,
    enabled: doc.available,
    reason: doc.available ? undefined : doc.message,
  }));
  return { actions: ACTION_ORDER.filter((action) => actions.has(action)), downloads };
}
