import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { loadAuthConfig, loadWorkshopSession } from "./auth";
import { DirtyFormDialog, ReasonCommandDialog } from "./dialog-primitives";
import {
  createProductionRolesApi, RolesApiError, type ManagedRole, type PermissionGroup, type RoleDraft, type RolesAuth,
} from "./production-roles-api";
import "./production-roles.css";

type Draft = RoleDraft & { id?: string; version?: number };
const blankDraft = (): Draft => ({ name: "", description: "", permissions: [] });

function RolesScreen({ auth, permissions }: { auth: RolesAuth; permissions: string[] }) {
  const api = useMemo(() => createProductionRolesApi(auth), [auth]);
  const [roles, setRoles] = useState<ManagedRole[]>([]); const [catalog, setCatalog] = useState<PermissionGroup[]>([]);
  const [draft, setDraft] = useState<Draft>(); const [original, setOriginal] = useState<Draft>();
  const [catalogSearch, setCatalogSearch] = useState(""); const [errors, setErrors] = useState<string[]>([]);
  const [archiveTarget, setArchiveTarget] = useState<ManagedRole>(); const [failure, setFailure] = useState("");
  const [status, setStatus] = useState(""); const [busy, setBusy] = useState(false); const nameRef = useRef<HTMLInputElement>(null);
  const createKey = useRef(crypto.randomUUID());

  function showFailure(error: unknown) {
    setFailure(error instanceof RolesApiError ? `${error.message} Reference: ${error.traceId}` : error instanceof Error ? error.message : "WorkshopOS could not complete the request.");
  }
  async function refresh(search = catalogSearch) {
    setBusy(true); try { const result = await api.list(search); setRoles(result.roles); setCatalog(result.catalog); setFailure(""); }
    catch (error) { showFailure(error); } finally { setBusy(false); }
  }
  useEffect(() => { void refresh(""); }, []);

  function openCreate() { const next = blankDraft(); createKey.current = crypto.randomUUID(); setDraft(next); setOriginal(next); setErrors([]); setCatalogSearch(""); void refresh(""); }
  function openEdit(role: ManagedRole) { const next = { id: role.id, name: role.name, description: role.description, permissions: [...role.permissions], version: role.version }; setDraft(next); setOriginal(next); setErrors([]); setCatalogSearch(""); void refresh(""); }
  function togglePage(page: PermissionGroup["pages"][number], checked: boolean) {
    if (!draft) return; const keys = [page.key, ...page.actions.map((action) => action.key)];
    setDraft({ ...draft, permissions: checked ? [...new Set([...draft.permissions, page.key])] : draft.permissions.filter((key) => !keys.includes(key)) });
  }
  function toggleAction(pageKey: string, actionKey: string, checked: boolean) {
    if (!draft) return; setDraft({ ...draft, permissions: checked ? [...new Set([...draft.permissions, pageKey, actionKey])] : draft.permissions.filter((key) => key !== actionKey) });
  }
  async function save(event: FormEvent) {
    event.preventDefault(); if (!draft) return;
    const nextErrors = [!draft.name.trim() ? "Enter a role name." : "", !draft.permissions.length ? "Choose at least one page or action permission." : ""].filter(Boolean);
    setErrors(nextErrors); if (nextErrors.length) return; setBusy(true); setFailure("");
    try {
      if (draft.id) await api.update({ id: draft.id, version: draft.version!, name: draft.name.trim(), description: draft.description.trim(), permissions: draft.permissions });
      else await api.create({ name: draft.name.trim(), description: draft.description.trim(), permissions: draft.permissions }, createKey.current);
      setDraft(undefined); setOriginal(undefined); setCatalogSearch(""); setStatus("Role saved. Navigation and API policy use these grants on the next session refresh."); await refresh("");
    } catch (error) { showFailure(error); } finally { setBusy(false); }
  }
  async function archive(reason: string) {
    if (!archiveTarget) return; setBusy(true); setFailure("");
    try { await api.archive(archiveTarget, reason); setArchiveTarget(undefined); setStatus("Role archived."); await refresh(""); }
    catch (error) { showFailure(error); } finally { setBusy(false); }
  }
  const dirty = JSON.stringify(draft) !== JSON.stringify(original);
  return <main className="v12-roles"><header><a href="/">Back to WorkshopOS</a><h1>Roles and Permissions</h1><p>Create versioned tenant roles from the shared page and action permission catalog.</p></header>
    {failure && <p role="alert" className="v12-role-error">{failure}</p>}{status && <p role="status">{status}</p>}
    <section aria-labelledby="role-list"><div className="v12-role-heading"><h2 id="role-list">Tenant roles</h2><button type="button" onClick={openCreate}>Create role</button><button type="button" disabled={busy} onClick={() => void refresh("")}>Refresh</button></div>
      <ul className="v12-role-list">{roles.map((role) => <li key={role.id}><div><h3>{role.name} {role.protected && <span className="v12-protected">Protected template</span>}</h3><p>{role.description || "No description"}</p><small>Version {role.version} · {role.permissions.length} grants</small></div><div className="v12-role-actions">{role.protected ? <span>Cannot be changed or archived</span> : <><button type="button" onClick={() => openEdit(role)}>Edit {role.name}</button><button type="button" onClick={() => setArchiveTarget(role)}>Archive {role.name}</button></>}</div></li>)}</ul>
    </section>
    <DirtyFormDialog open={Boolean(draft)} title={draft?.id ? "Edit custom role" : "Create custom role"} dirty={dirty} errors={errors} busy={busy} initialFocusRef={nameRef} submitLabel={draft?.id ? "Save role version" : "Create role"} onSubmit={save} onClose={() => { setDraft(undefined); setOriginal(undefined); setCatalogSearch(""); void refresh(""); }}>
      <label htmlFor="role-name">Role name</label><input id="role-name" ref={nameRef} value={draft?.name ?? ""} onChange={(event) => draft && setDraft({ ...draft, name: event.target.value })} />
      <label htmlFor="role-description">Description</label><textarea id="role-description" value={draft?.description ?? ""} onChange={(event) => draft && setDraft({ ...draft, description: event.target.value })} />
      <div className="v12-permission-search" role="search"><label htmlFor="permission-search">Search permission catalog</label><input id="permission-search" value={catalogSearch} onChange={(event) => setCatalogSearch(event.target.value)} /><button type="button" onClick={() => void refresh(catalogSearch)}>Search permissions</button><button type="button" onClick={() => { setCatalogSearch(""); void refresh(""); }}>Clear permission search</button></div>
      <div className="v12-permission-tree">{catalog.length ? catalog.map((group) => <fieldset key={group.key}><legend>{group.label}</legend>{group.pages.map((page) => <div className="v12-permission-page" key={page.key}><label><input type="checkbox" checked={draft?.permissions.includes(page.key) ?? false} onChange={(event) => togglePage(page, event.target.checked)} />{page.label} <code>{page.key}</code></label><p>{page.description}</p>{page.actions.map((action) => <label className="v12-permission-action" key={action.key}><input type="checkbox" checked={draft?.permissions.includes(action.key) ?? false} onChange={(event) => toggleAction(page.key, action.key, event.target.checked)} />{action.label} <code>{action.key}</code><small>{action.description}</small></label>)}</div>)}</fieldset>) : <p>No permissions match this search. Clear the search to see the full catalog.</p>}</div>
    </DirtyFormDialog>
    <ReasonCommandDialog open={Boolean(archiveTarget)} title="Archive custom role" commandLabel="Archive role" busy={busy} onConfirm={(reason) => void archive(reason)} onClose={() => setArchiveTarget(undefined)} />
  </main>;
}

export default function ProductionRolesApp() {
  const [ready, setReady] = useState<{ auth: RolesAuth; permissions: string[] }>(); const [error, setError] = useState("");
  useEffect(() => { void (async () => { try {
    const config = await loadAuthConfig();
    if (config.mode === "local") {
      if (!config.allowDemo) { setError("Local demo authentication is disabled."); return; }
      const auth: RolesAuth = { mode: "local", identity: "north-admin" }; const session = await createProductionRolesApi(auth).session();
      if (!session.membership.permissions.includes("admin.roles.page") || !session.membership.permissions.includes("role.manage")) { setError("You do not have permission to manage roles."); return; }
      setReady({ auth, permissions: session.membership.permissions }); return;
    }
    const session = await loadWorkshopSession(config); if (!session) { setError("Sign in to manage roles."); return; }
    if (!session.membership.permissions.includes("admin.roles.page") || !session.membership.permissions.includes("role.manage")) { setError("You do not have permission to manage roles."); return; }
    setReady({ auth: { mode: "cognito", config }, permissions: session.membership.permissions });
  } catch { setError("WorkshopOS could not establish the role-management session."); } })(); }, []);
  if (error) return <main><h1>Roles and Permissions</h1><p role="alert">{error}</p><a href="/">Return to WorkshopOS</a></main>;
  if (!ready) return <main><p>Loading roles and permissions…</p></main>;
  return <RolesScreen {...ready} />;
}
