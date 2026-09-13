import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { loadAuthConfig, loadWorkshopSession, type CognitoConfig, type WorkshopSession } from "./auth";
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
  const [summary, setSummary] = useState("");
  const [branchId, setBranchId] = useState(identity.branches[0]?.id ?? "");
  const [editing, setEditing] = useState<WorkItem>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const retry = useRef<{ signature: string; key: string } | undefined>(undefined);

  const refresh = useCallback(async () => {
    setBusy(true);
    setError("");
    try { setItems(await api.list()); }
    catch (failure) { setError(readableFailure(failure)); }
    finally { setBusy(false); }
  }, [api]);

  useEffect(() => { void refresh(); }, [refresh]);

  async function create(event: FormEvent) {
    event.preventDefault();
    const signature = JSON.stringify({ branchId, summary: summary.trim() });
    if (!retry.current || retry.current.signature !== signature) retry.current = { signature, key: crypto.randomUUID() };
    setBusy(true);
    setError("");
    try {
      await api.create({ branchId, summary }, retry.current.key);
      retry.current = undefined;
      setSummary("");
      setItems(await api.list());
    } catch (failure) { setError(readableFailure(failure)); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      await api.update(editing);
      setEditing(undefined);
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
    <section aria-labelledby="create-work-item">
      <h2 id="create-work-item">Create work item</h2>
      <form onSubmit={create}>
        <label>Branch <select value={branchId} onChange={(event) => setBranchId(event.target.value)} required>
          {identity.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
        </select></label>{" "}
        <label>Summary <input value={summary} onChange={(event) => setSummary(event.target.value)} required /></label>{" "}
        <button disabled={busy}>Create</button>
      </form>
    </section>
    <section aria-labelledby="saved-work-items">
      <h2 id="saved-work-items">Saved work items</h2>
      <button type="button" onClick={() => void refresh()} disabled={busy}>Refresh</button>
      {!busy && items.length === 0 && <p>No work items in your permitted branches.</p>}
      <ul>{items.map((item) => <li key={item.id}>
        <strong>{item.summary}</strong> <small>version {item.version}</small>{" "}
        <button type="button" onClick={() => setEditing({ ...item })}>Edit</button>
      </li>)}</ul>
    </section>
    {editing && <section aria-labelledby="edit-work-item">
      <h2 id="edit-work-item">Edit work item</h2>
      <form onSubmit={save}>
        <label>Summary <input autoFocus value={editing.summary} onChange={(event) => setEditing({ ...editing, summary: event.target.value })} required /></label>{" "}
        <button disabled={busy}>Save</button>{" "}
        <button type="button" onClick={() => setEditing(undefined)} disabled={busy}>Cancel</button>
      </form>
    </section>}
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
