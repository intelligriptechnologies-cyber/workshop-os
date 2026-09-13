import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { loadAuthConfig, loadWorkshopSession, type CognitoConfig, type WorkshopSession } from "./auth";
import { DirtyFormDialog, ReasonCommandDialog } from "./dialog-primitives";
import { createWorkItemsApi, DEFAULT_WORK_ITEM_LIST_QUERY, workItemListSearch, WorkItemsApiError, type WorkItem, type WorkItemAuth, type WorkItemListQuery } from "./work-items-api";
import "./production-work-items.css";

const localIdentities = {
  "north-reception": "00000000-0000-4000-8000-000000000011",
  "north-jaipur-manager": "00000000-0000-4000-8000-000000000012",
  "south-reception": "00000000-0000-4000-8000-000000000021",
} as const;

type ReadyIdentity = { auth: WorkItemAuth; branches: Array<{ id: string; name: string }>; permissions: string[] };

function readableFailure(error: unknown): string {
  if (error instanceof WorkItemsApiError) return `${error.message} Reference: ${error.traceId}`;
  return "WorkshopOS could not reach the production API. Check your connection and try again.";
}

function queryFromLocation(): WorkItemListQuery {
  const params = new URLSearchParams(location.search);
  const pageSize = Number(params.get("pageSize")); const page = Number(params.get("page"));
  const sort = params.get("sort");
  return {
    search: (params.get("search") ?? "").trim(), branchId: params.get("branchId") ?? "",
    sort: sort === "updatedAt.asc" || sort === "summary.asc" || sort === "summary.desc" ? sort : "updatedAt.desc",
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    pageSize: pageSize === 50 || pageSize === 100 ? pageSize : 25,
  };
}

export function ProductionWorkItemsScreen({ identity }: { identity: ReadyIdentity }) {
  const api = useMemo(() => createWorkItemsApi(identity.auth), [identity.auth]);
  const [items, setItems] = useState<WorkItem[]>([]);
  const [query, setQuery] = useState(queryFromLocation);
  const [searchDraft, setSearchDraft] = useState(() => queryFromLocation().search);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 25, totalCount: 0, pageCount: 1 });
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [exportMessage, setExportMessage] = useState("");
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
  const canManage = identity.permissions.includes("work-item.manage") || identity.permissions.includes("membership.manage");
  const canExport = identity.permissions.includes("work-item.export") || identity.permissions.includes("membership.manage");

  const refresh = useCallback(async () => {
    setBusy(true);
    setError("");
    try { const result = await api.list(query); setItems(result.workItems); setPageInfo(result.page); }
    catch (failure) { setError(readableFailure(failure)); }
    finally { setBusy(false); }
  }, [api, query]);

  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => { void api.getPreference().then((preference) => setViewMode(preference.viewMode)).catch((failure) => setError(readableFailure(failure))); }, [api]);
  useEffect(() => {
    const restore = () => { const next = queryFromLocation(); setQuery(next); setSearchDraft(next.search); };
    addEventListener("popstate", restore); return () => removeEventListener("popstate", restore);
  }, []);

  function navigate(next: WorkItemListQuery) {
    const search = workItemListSearch(next); history.pushState({}, "", `${location.pathname}${search ? `?${search}` : ""}`); setQuery(next);
  }

  async function chooseView(next: "grid" | "table") {
    setViewMode(next);
    try { await api.savePreference(next); } catch (failure) { setError(readableFailure(failure)); }
  }

  async function exportItems(format: "PDF" | "XLSX") {
    setBusy(true); setError(""); setExportMessage(`Preparing ${format} export…`);
    try {
      let job = await api.requestExport(format, query);
      for (let attempt = 0; job.status === "PENDING" && attempt < 30; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 100)); job = await api.getExport(job.id);
      }
      if (job.status !== "READY") throw new Error("export failed");
      const artifact = await api.downloadExport(job.id); const href = URL.createObjectURL(artifact.blob);
      const anchor = document.createElement("a"); anchor.href = href; anchor.download = artifact.filename; anchor.click(); URL.revokeObjectURL(href);
      setExportMessage(`${format} export ready: ${job.rowCount ?? 0} rows.`);
    } catch (failure) { setExportMessage(""); setError(readableFailure(failure)); }
    finally { setBusy(false); }
  }

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
      await refresh();
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
      await refresh();
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
      await refresh();
    } catch (failure) { setError(readableFailure(failure)); }
    finally { setBusy(false); }
  }

  const activeFilters = Boolean(query.search || query.branchId);
  return <main className="v12-work-items">
    <header>
      <p><a href="/">Back to WorkshopOS</a></p>
      <h1>Production work items</h1>
      <p>This tracer reads and writes the authenticated PostgreSQL tenant and branch scope.</p>
    </header>
    {error && <p role="alert" style={{ color: "#9b1c1c" }}>{error}</p>}
    <section aria-labelledby="saved-work-items">
      <div className="ws-tracer-actions">
        <h2 id="saved-work-items">Saved work items</h2>
        {canManage && <button type="button" onClick={openCreate}>Create work item</button>}
        <button type="button" onClick={() => void refresh()} disabled={busy}>Refresh</button>
      </div>
      <form className="v12-list-controls" role="search" onSubmit={(event) => { event.preventDefault(); navigate({ ...query, search: searchDraft.trim(), page: 1 }); }}>
        <label htmlFor="work-item-search">Search</label><input id="work-item-search" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} />
        <label htmlFor="work-item-branch-filter">Location filter</label><select id="work-item-branch-filter" value={query.branchId} onChange={(event) => navigate({ ...query, branchId: event.target.value, page: 1 })}>
          <option value="">All permitted branches</option>{identity.branches.map((branch) => <option value={branch.id} key={branch.id}>{branch.name}</option>)}
        </select>
        <label htmlFor="work-item-sort">Sort</label><select id="work-item-sort" value={query.sort} onChange={(event) => navigate({ ...query, sort: event.target.value as WorkItemListQuery["sort"], page: 1 })}>
          <option value="updatedAt.desc">Recently updated</option><option value="updatedAt.asc">Oldest updated</option><option value="summary.asc">Summary A–Z</option><option value="summary.desc">Summary Z–A</option>
        </select>
        <button type="submit">Apply</button><button type="button" onClick={() => { setSearchDraft(""); navigate(DEFAULT_WORK_ITEM_LIST_QUERY); }}>Clear</button>
      </form>
      <div className="v12-presentation" aria-label="List presentation and exports">
        <div role="group" aria-label="View mode"><button type="button" aria-pressed={viewMode === "table"} onClick={() => void chooseView("table")}>Table</button><button type="button" aria-pressed={viewMode === "grid"} onClick={() => void chooseView("grid")}>Grid</button></div>
        {canExport && <><button type="button" onClick={() => void exportItems("PDF")} disabled={busy}>Export PDF</button><button type="button" onClick={() => void exportItems("XLSX")} disabled={busy}>Export XLSX</button></>}
      </div>
      {exportMessage && <p role="status">{exportMessage}</p>}
      {!busy && items.length === 0 && <div className="v12-empty"><p>{activeFilters ? "No work items match these filters." : "No work items in your permitted branches."}</p>{(activeFilters || canManage) && <button type="button" onClick={activeFilters ? () => { setSearchDraft(""); navigate(DEFAULT_WORK_ITEM_LIST_QUERY); } : openCreate}>{activeFilters ? "Clear filters" : "Create first work item"}</button>}</div>}
      {items.length > 0 && (viewMode === "table" ? <div className="v12-table-wrap"><table><thead><tr><th>Summary</th><th>Branch</th><th>Version</th>{canManage && <th>Actions</th>}</tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.summary}</td><td>{identity.branches.find((branch) => branch.id === item.branchId)?.name ?? "Permitted branch"}</td><td>{item.version}</td>{canManage && <td><ItemActions item={item} onEdit={() => { setEditErrors([]); setEditing({ ...item }); }} onArchive={() => setArchiveTarget(item)} /></td>}</tr>)}</tbody></table></div> : <ul className="v12-card-grid">{items.map((item) => <li key={item.id}><strong>{item.summary}</strong><small>version {item.version}</small>{canManage && <ItemActions item={item} onEdit={() => { setEditErrors([]); setEditing({ ...item }); }} onArchive={() => setArchiveTarget(item)} />}</li>)}</ul>)}
      <nav className="v12-pagination" aria-label="Work item pages"><span>{pageInfo.totalCount ? `${(pageInfo.page - 1) * pageInfo.pageSize + 1}–${Math.min(pageInfo.page * pageInfo.pageSize, pageInfo.totalCount)} of ${pageInfo.totalCount}` : "0 results"}</span><button type="button" disabled={pageInfo.page <= 1 || busy} onClick={() => navigate({ ...query, page: pageInfo.page - 1 })}>Previous</button><span>Page {pageInfo.page} of {pageInfo.pageCount}</span><button type="button" disabled={pageInfo.page >= pageInfo.pageCount || busy} onClick={() => navigate({ ...query, page: pageInfo.page + 1 })}>Next</button><label htmlFor="work-item-page-size">Rows</label><select id="work-item-page-size" value={query.pageSize} onChange={(event) => navigate({ ...query, pageSize: Number(event.target.value) as 25 | 50 | 100, page: 1 })}><option value="25">25</option><option value="50">50</option><option value="100">100</option></select></nav>
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

function ItemActions({ item, onEdit, onArchive }: { item: WorkItem; onEdit: () => void; onArchive: () => void }) {
  return <span className="v12-row-actions"><button type="button" onClick={onEdit}>Edit {item.summary}</button><button type="button" onClick={onArchive}>Archive {item.summary}</button></span>;
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
          setIdentity({ auth: { mode: "local", identity: name }, branches: [{ id: localIdentities[name], name: "Delhi" }], permissions: ["work-item.read", "work-item.manage", "work-item.export"] });
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
  setter({ auth: { mode: "cognito", config }, branches: session.membership.branches, permissions: session.membership.permissions });
}
