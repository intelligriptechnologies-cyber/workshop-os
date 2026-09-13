import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { loadAuthConfig, loadWorkshopSession, type CognitoConfig, type WorkshopSession } from "./auth";
import { DirtyFormDialog, ReasonCommandDialog } from "./dialog-primitives";
import { createWorkItemsApi, WorkItemsApiError, type WorkItem, type WorkItemAuth } from "./work-items-api";

const localIdentities = {
  "north-reception": "00000000-0000-4000-8000-000000000011",
  "north-jaipur-manager": "00000000-0000-4000-8000-000000000012",
  "south-reception": "00000000-0000-4000-8000-000000000021",
} as const;

type ReadyIdentity = { auth: WorkItemAuth; branches: Array<{ id: string; name: string }> };

function readableFailure(error: unknown): string {
  if (error instanceof WorkItemsApiError) return `${error.message} Reference: ${error.traceId}`;
  return "WorkshopOS could not reach the production API. Check your connection and try again.";
}

export function ProductionWorkItemsScreen({ identity }: { identity: ReadyIdentity }) {
  const api = useMemo(() => createWorkItemsApi(identity.auth), [identity.auth]);
  const [items, setItems] = useState<WorkItem[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [branchId, setBranchId] = useState(identity.branches[0]?.id ?? "");
  const [createErrors, setCreateErrors] = useState<string[]>([]);
  const [editing, setEditing] = useState<WorkItem>();
  const [editErrors, setEditErrors] = useState<string[]>([]);
  const [archiveTarget, setArchiveTarget] = useState<WorkItem>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const branchRef = useRef<HTMLSelectElement>(null);
  const editSummaryRef = useRef<HTMLInputElement>(null);
  const retry = useRef<{ signature: string; key: string } | undefined>(undefined);

  const refresh = useCallback(async () => {
    setBusy(true);
    setError("");
    try { setItems(await api.list()); }
    catch (failure) { setError(readableFailure(failure)); }
    finally { setBusy(false); }
  }, [api]);

  useEffect(() => { void refresh(); }, [refresh]);

  function openCreate() {
    setSummary("");
    setBranchId(identity.branches[0]?.id ?? "");
    setCreateErrors([]);
    setCreateOpen(true);
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = [!branchId ? "Choose a branch." : "", !summary.trim() ? "Enter a summary." : ""].filter(Boolean);
    setCreateErrors(errors);
    if (errors.length) return;
    const signature = JSON.stringify({ branchId, summary: summary.trim() });
    if (!retry.current || retry.current.signature !== signature) retry.current = { signature, key: crypto.randomUUID() };
    setBusy(true);
    setError("");
    try {
      await api.create({ branchId, summary }, retry.current.key);
      retry.current = undefined;
      setCreateOpen(false);
      setItems(await api.list());
    } catch (failure) { setError(readableFailure(failure)); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const errors = editing.summary.trim() ? [] : ["Enter a summary."];
    setEditErrors(errors);
    if (errors.length) return;
    setBusy(true);
    setError("");
    try {
      await api.update(editing);
      setEditing(undefined);
      setItems(await api.list());
    } catch (failure) { setError(readableFailure(failure)); }
    finally { setBusy(false); }
  }

  async function archive(reason: string) {
    if (!archiveTarget) return;
    setBusy(true);
    setError("");
    try {
      await api.archive({ id: archiveTarget.id, version: archiveTarget.version, reason });
      setArchiveTarget(undefined);
      setItems(await api.list());
    } catch (failure) { setError(readableFailure(failure)); }
    finally { setBusy(false); }
  }

  return <main style={{ maxWidth: 880, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
    <header>
      <p><a href="/">Back to WorkshopOS</a></p>
      <h1>Production work items</h1>
      <p>This tracer reads and writes the authenticated PostgreSQL tenant and branch scope.</p>
    </header>
    {error && <p role="alert" style={{ color: "#9b1c1c" }}>{error}</p>}
    <section aria-labelledby="saved-work-items">
      <div className="ws-tracer-actions">
        <h2 id="saved-work-items">Saved work items</h2>
        <button type="button" onClick={openCreate}>Create work item</button>
        <button type="button" onClick={() => void refresh()} disabled={busy}>Refresh</button>
      </div>
      {!busy && items.length === 0 && <p>No work items in your permitted branches.</p>}
      <ul>{items.map((item) => <li key={item.id}>
        <strong>{item.summary}</strong> <small>version {item.version}</small>{" "}
        <button type="button" onClick={() => { setEditErrors([]); setEditing({ ...item }); }}>Edit {item.summary}</button>{" "}
        <button type="button" onClick={() => setArchiveTarget(item)}>Archive {item.summary}</button>
      </li>)}</ul>
    </section>

    <DirtyFormDialog
      open={createOpen}
      title="Create work item"
      dirty={Boolean(summary.trim()) || branchId !== (identity.branches[0]?.id ?? "")}
      errors={createErrors}
      busy={busy}
      initialFocusRef={branchRef}
      submitLabel="Create"
      onSubmit={create}
      onClose={() => setCreateOpen(false)}
    >
      <label htmlFor="create-work-item-branch">Branch</label>
      <select id="create-work-item-branch" ref={branchRef} value={branchId} onChange={(event) => setBranchId(event.target.value)} required>
        {identity.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
      </select>
      <label htmlFor="create-work-item-summary">Summary</label>
      <input id="create-work-item-summary" value={summary} onChange={(event) => setSummary(event.target.value)} required />
    </DirtyFormDialog>

    <DirtyFormDialog
      open={Boolean(editing)}
      title="Edit work item"
      dirty={Boolean(editing && items.find((item) => item.id === editing.id)?.summary !== editing.summary)}
      errors={editErrors}
      busy={busy}
      initialFocusRef={editSummaryRef}
      submitLabel="Save"
      onSubmit={save}
      onClose={() => setEditing(undefined)}
    >
      <label htmlFor="edit-work-item-summary">Summary</label>
      <input id="edit-work-item-summary" ref={editSummaryRef} value={editing?.summary ?? ""} onChange={(event) => editing && setEditing({ ...editing, summary: event.target.value })} required />
    </DirtyFormDialog>

    <ReasonCommandDialog
      open={Boolean(archiveTarget)}
      title="Archive work item"
      commandLabel="Archive"
      busy={busy}
      onConfirm={(reason) => void archive(reason)}
      onClose={() => setArchiveTarget(undefined)}
    />
  </main>;
}

export default function ProductionWorkItemsApp() {
  const [identity, setIdentity] = useState<ReadyIdentity>();
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const config = await loadAuthConfig();
        if (config.mode === "local") {
          if (!config.allowDemo) { setSessionError("Local demo authentication is disabled."); return; }
          const name = "north-reception" as keyof typeof localIdentities;
          setIdentity({ auth: { mode: "local", identity: name }, branches: [{ id: localIdentities[name], name: "Delhi" }] });
          return;
        }
        const session = await loadWorkshopSession(config);
        if (!session) { setSessionError("Sign in from WorkshopOS before opening the production tracer."); return; }
        setIdentityFromSession(config, session, setIdentity);
      } catch { setSessionError("WorkshopOS could not establish an authenticated production session."); }
    })();
  }, []);

  if (sessionError) return <main><h1>Production work items</h1><p role="alert">{sessionError}</p><a href="/">Return to sign in</a></main>;
  if (!identity) return <main><p>Loading authenticated work items…</p></main>;
  return <ProductionWorkItemsScreen identity={identity} />;
}

function setIdentityFromSession(config: CognitoConfig, session: WorkshopSession, setter: (value: ReadyIdentity) => void) {
  setter({ auth: { mode: "cognito", config }, branches: session.membership.branches });
}
