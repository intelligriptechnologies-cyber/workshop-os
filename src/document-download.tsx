import { Download, Printer } from "lucide-react";
import { useState } from "react";
import { loadAdminDemoState } from "./admin-demo-state";
import { loadDocumentSnapshots } from "./document-snapshots";
import { printRenderedDocument, renderJobDocument, renderSnapshotDocument, type DocumentKind, type RenderedDocument } from "./job-documents";
import { renderHtmlToPdf } from "./pdf-render";
import type { JobView } from "./types";

export function DocumentDownloadButton({ kind, view, className = "workflow-action action-document document-download", label, snapshotId, showPrint = true }: { kind: DocumentKind; view: JobView; className?: string; label?: string; snapshotId?: string; showPrint?: boolean }) {
  const [status, setStatus] = useState<"idle" | "preparing" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const resolve = (): RenderedDocument => {
    const snapshots = loadDocumentSnapshots();
    const snap = snapshotId ? snapshots.find((item) => item.id === snapshotId) : undefined;
    return snap ? renderSnapshotDocument(snap) : renderJobDocument(kind, view, loadAdminDemoState(), snapshots);
  };
  const print = () => {
    try { const result = printRenderedDocument(resolve()); if (!result.ok) throw new Error(result.error); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : "The document could not be printed."); setStatus("error"); }
  };
  const download = async () => {
    setStatus("preparing"); setErrorMessage("");
    try { const doc = resolve(); await renderHtmlToPdf(doc.html, doc.filename); setStatus("done"); window.setTimeout(() => setStatus("idle"), 2500); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : "Document generation failed."); setStatus("error"); }
  };
  return <><button type="button" className={className} disabled={status === "preparing"} aria-busy={status === "preparing"} onClick={(event) => { event.stopPropagation(); void download(); }}><Download size={15} />{status === "preparing" ? "Preparing…" : status === "done" ? "Downloaded ✓" : label ?? "Download PDF"}</button>{showPrint && <button type="button" className="workflow-action action-secondary document-print" onClick={(event) => { event.stopPropagation(); print(); }}><Printer size={15} />Print</button>}{status === "error" && <span className="document-error" role="alert">{errorMessage}</span>}</>;
}
