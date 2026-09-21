import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { loadAuthConfig, loadWorkshopSession } from "./auth";
import { DirtyFormDialog, ReasonCommandDialog } from "./dialog-primitives";
import { createProductionUsersApi, DEFAULT_USER_QUERY, userListSearch, UsersApiError, type ManagedUser, type UserDirectory, type UserQuery, type UsersAuth } from "./production-users-api";
import "./production-users.css";

type Draft = { id?: string; name: string; email: string; roleIds: string[]; branchIds: string[]; version?: number };
const blankDraft = (): Draft => ({ name: "", email: "", roleIds: [], branchIds: [] });

function queryFromLocation(): UserQuery {
  const params = new URLSearchParams(location.search);
  const pageSize = Number(params.get("pageSize")); const page = Number(params.get("page"));
  const status = params.get("status"); const sort = params.get("sort");
  return { ...DEFAULT_USER_QUERY, search: params.get("search") ?? "", status: status === "INVITED" || status === "ACTIVE" || status === "SUSPENDED" ? status : "",
    roleId: params.get("roleId") ?? "", branchId: params.get("branchId") ?? "",
    sort: ["updatedAt.asc", "name.asc", "name.desc", "email.asc", "email.desc"].includes(sort ?? "") ? sort as UserQuery["sort"] : "updatedAt.desc",
    page: Number.isSafeInteger(page) && page > 0 ? page : 1, pageSize: pageSize === 50 || pageSize === 100 ? pageSize : 25 };
}

function ProductionUsersScreen({ auth, actorId, permissions }: { auth: UsersAuth; actorId: string; permissions: string[] }) {
  const api = useMemo(() => createProductionUsersApi(auth), [auth]);
  const [directory, setDirectory] = useState<UserDirectory>(); const [query, setQuery] = useState(queryFromLocation);
  const [search, setSearch] = useState(query.search); const [view, setView] = useState<"grid" | "table">("table");
  const [draft, setDraft] = useState<Draft>(); const [original, setOriginal] = useState<Draft>(); const [errors, setErrors] = useState<string[]>([]);
  const [command, setCommand] = useState<{ user: ManagedUser; kind: "archive" | "suspend" | "activate" }>();
  const [busy, setBusy] = useState(false); const [failure, setFailure] = useState<{ message: string; conflict: boolean }>(); const [status, setStatus] = useState("");
  const nameRef = useRef<HTMLInputElement>(null); const inviteKey = useRef(crypto.randomUUID());

  async function refresh(next = query) { setBusy(true); try { setDirectory(await api.list(next)); setFailure(undefined); } catch (error) { showFailure(error); } finally { setBusy(false); } }
  function showFailure(error: unknown) { setFailure({ message: error instanceof UsersApiError ? `${error.message} Reference: ${error.traceId}` : error instanceof Error ? error.message : "WorkshopOS could not complete the request.", conflict: error instanceof UsersApiError && error.code === "VERSION_CONFLICT" }); }
  async function refreshConflict() {
    if (!draft?.id) { await refresh(); return; }
    setBusy(true);
    try {
      const latest = await api.list(query); setDirectory(latest);
      const current = latest.users.find((user) => user.id === draft.id);
      if (!current) { setFailure({ message: "This user is no longer available. Close the dialog and refresh the list.", conflict: false }); return; }
      const baseline: Draft = { id: current.id, name: current.name, email: current.email, roleIds: [...current.roleIds], branchIds: [...current.branchIds], version: current.version };
      setOriginal(baseline); setDraft((intended) => intended ? { ...intended, version: current.version } : intended);
      setFailure(undefined); setStatus("Latest user version loaded; your intended changes are preserved.");
    } catch (error) { showFailure(error); } finally { setBusy(false); }
  }
  function navigate(next: UserQuery) { const value = userListSearch(next); history.pushState({}, "", `${location.pathname}${value ? `?${value}` : ""}`); setQuery(next); setSearch(next.search); void refresh(next); }
  useEffect(() => { void refresh(); void api.getPreference().then((preference) => setView(preference.viewMode)).catch(showFailure); const pop = () => { const next = queryFromLocation(); setQuery(next); setSearch(next.search); void refresh(next); }; addEventListener("popstate", pop); return () => removeEventListener("popstate", pop); }, []);

  function openInvite() { const next = blankDraft(); inviteKey.current = crypto.randomUUID(); setDraft(next); setOriginal(next); setErrors([]); }
  function openEdit(user: ManagedUser) { const next = { id: user.id, name: user.name, email: user.email, roleIds: [...user.roleIds], branchIds: [...user.branchIds], version: user.version }; setDraft(next); setOriginal(next); setErrors([]); }
  async function save(event: FormEvent) {
    event.preventDefault(); if (!draft || !directory) return;
    const nextErrors = [!draft.name.trim() ? "Enter a user name." : "", !/^\S+@\S+\.\S+$/.test(draft.email) ? "Enter a valid email." : "", !draft.roleIds.length ? "Choose at least one role." : "", !draft.branchIds.length ? "Choose at least one branch." : ""].filter(Boolean);
    setErrors(nextErrors); if (nextErrors.length) return; setBusy(true); setFailure(undefined);
    try { if (draft.id) await api.update({ id: draft.id, name: draft.name, roleIds: draft.roleIds, branchIds: draft.branchIds, version: draft.version! }); else await api.invite({ name: draft.name, email: draft.email, roleIds: draft.roleIds, branchIds: draft.branchIds }, inviteKey.current); setDraft(undefined); setOriginal(undefined); await refresh(); }
    catch (error) { showFailure(error); } finally { setBusy(false); }
  }
  async function reasonCommand(reason: string) {
    if (!command) return; setBusy(true); setFailure(undefined);
    try { if (command.kind === "archive") await api.archive(command.user, reason); else await api.status(command.user, command.kind === "suspend" ? "SUSPENDED" : "ACTIVE", reason); setCommand(undefined); await refresh(); }
    catch (error) { showFailure(error); } finally { setBusy(false); }
  }
  async function resend(user: ManagedUser) { setBusy(true); try { await api.resend(user); setStatus(`Invitation resent to ${user.email}.`); await refresh(); } catch (error) { showFailure(error); } finally { setBusy(false); } }
  async function chooseView(next: "grid" | "table") { setView(next); try { await api.savePreference(next); } catch (error) { showFailure(error); } }
  async function exportUsers(format: "PDF" | "XLSX") { setBusy(true); try { let job = await api.requestExport(format, query); for (let i = 0; job.status === "PENDING" && i < 40; i++) { await new Promise((resolve) => setTimeout(resolve, 100)); job = await api.getExport(job.id); } if (job.status !== "READY") throw new Error("The export could not be prepared."); const file = await api.downloadExport(job.id); const url = URL.createObjectURL(file.blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = file.filename; anchor.click(); URL.revokeObjectURL(url); setStatus(`${format} export ready with ${job.rowCount ?? 0} users.`); } catch (error) { showFailure(error); } finally { setBusy(false); } }

  if (!directory) return <main className="v12-users"><h1>Tenant User Management</h1>{failure ? <p role="alert">{failure.message}</p> : <p>Loading tenant users…</p>}</main>;
  const dirty = JSON.stringify(draft) !== JSON.stringify(original); const activeFilters = Boolean(query.search || query.status || query.roleId || query.branchId);
  return <main className="v12-users"><header><a href="/">Back to WorkshopOS</a><h1>Tenant User Management</h1><p>Invite and govern users in the authenticated PostgreSQL tenant.</p></header>
    {failure && !draft && <div role="alert" className="v12-user-error"><span>{failure.message}</span></div>}{status && <p role="status">{status}</p>}
    <section aria-labelledby="tenant-users"><div className="v12-user-heading"><h2 id="tenant-users">Users</h2><button onClick={openInvite}>Invite user</button><button onClick={() => void refresh()} disabled={busy}>Refresh</button></div>
      <form role="search" className="v12-user-filters" onSubmit={(event) => { event.preventDefault(); navigate({ ...query, search: search.trim(), page: 1 }); }}><label>Search <input value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <label>Status <select value={query.status} onChange={(event) => navigate({ ...query, status: event.target.value as UserQuery["status"], page: 1 })}><option value="">All active records</option><option>INVITED</option><option>ACTIVE</option><option>SUSPENDED</option></select></label>
        <label>Role <select value={query.roleId} onChange={(event) => navigate({ ...query, roleId: event.target.value, page: 1 })}><option value="">All roles</option>{directory.roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>
        <label>Branch <select value={query.branchId} onChange={(event) => navigate({ ...query, branchId: event.target.value, page: 1 })}><option value="">All permitted branches</option>{directory.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
        <label>Sort <select value={query.sort} onChange={(event) => navigate({ ...query, sort: event.target.value as UserQuery["sort"], page: 1 })}><option value="updatedAt.desc">Recently updated</option><option value="name.asc">Name A–Z</option><option value="name.desc">Name Z–A</option><option value="email.asc">Email A–Z</option><option value="email.desc">Email Z–A</option></select></label>
        <button type="submit">Apply</button><button type="button" onClick={() => navigate(DEFAULT_USER_QUERY)}>Clear</button></form>
      <div className="v12-user-tools"><span role="group" aria-label="View mode"><button aria-pressed={view === "table"} onClick={() => void chooseView("table")}>Table</button><button aria-pressed={view === "grid"} onClick={() => void chooseView("grid")}>Grid</button></span><button onClick={() => void exportUsers("PDF")}>Export PDF</button><button onClick={() => void exportUsers("XLSX")}>Export XLSX</button></div>
      {!directory.users.length ? <div className="v12-user-empty"><p>{activeFilters ? "No users match these filters." : "No tenant users found."}</p><button onClick={activeFilters ? () => navigate(DEFAULT_USER_QUERY) : openInvite}>{activeFilters ? "Clear filters" : "Invite first user"}</button></div> : view === "table" ? <div className="v12-user-table"><table><thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Roles</th><th>Branches</th><th>Actions</th></tr></thead><tbody>{directory.users.map((user) => <tr key={user.id}><UserCells user={user} actorId={actorId} onEdit={() => openEdit(user)} onResend={() => void resend(user)} onCommand={(kind) => setCommand({ user, kind })} /></tr>)}</tbody></table></div> : <ul className="v12-user-grid">{directory.users.map((user) => <li key={user.id}><UserCard user={user} actorId={actorId} onEdit={() => openEdit(user)} onResend={() => void resend(user)} onCommand={(kind) => setCommand({ user, kind })} /></li>)}</ul>}
      <nav aria-label="User pages" className="v12-user-pages"><button disabled={directory.page.page <= 1} onClick={() => navigate({ ...query, page: directory.page.page - 1 })}>Previous</button><span>Page {directory.page.page} of {directory.page.pageCount} · {directory.page.totalCount} users</span><button disabled={directory.page.page >= directory.page.pageCount} onClick={() => navigate({ ...query, page: directory.page.page + 1 })}>Next</button><label>Rows <select value={query.pageSize} onChange={(event) => navigate({ ...query, page: 1, pageSize: Number(event.target.value) as 25 | 50 | 100 })}><option>25</option><option>50</option><option>100</option></select></label></nav>
    </section>
    <DirtyFormDialog open={Boolean(draft)} title={draft?.id ? "Edit user" : "Invite user"} dirty={dirty} errors={errors} busy={busy} initialFocusRef={nameRef} submitLabel={draft?.id ? "Save changes" : "Send invitation"} onSubmit={save} onClose={() => { setDraft(undefined); setOriginal(undefined); }}>
      {failure && <div role="alert" className="v12-user-error"><span>{failure.message}</span>{failure.conflict && <button type="button" onClick={() => void refreshConflict()}>Refresh latest users</button>}</div>}
      <label htmlFor="managed-user-name">Name</label><input id="managed-user-name" ref={nameRef} value={draft?.name ?? ""} onChange={(event) => draft && setDraft({ ...draft, name: event.target.value })} />
      <label htmlFor="managed-user-email">Email</label><input id="managed-user-email" type="email" disabled={Boolean(draft?.id)} value={draft?.email ?? ""} onChange={(event) => draft && setDraft({ ...draft, email: event.target.value })} />
      <fieldset><legend>Roles</legend>{directory.roles.map((role) => <label key={role.id}><input type="checkbox" checked={draft?.roleIds.includes(role.id) ?? false} onChange={(event) => draft && setDraft({ ...draft, roleIds: event.target.checked ? [...draft.roleIds, role.id] : draft.roleIds.filter((id) => id !== role.id) })} />{role.name}</label>)}</fieldset>
      <fieldset><legend>Branches</legend>{directory.branches.map((branch) => <label key={branch.id}><input type="checkbox" checked={draft?.branchIds.includes(branch.id) ?? false} onChange={(event) => draft && setDraft({ ...draft, branchIds: event.target.checked ? [...draft.branchIds, branch.id] : draft.branchIds.filter((id) => id !== branch.id) })} />{branch.name}</label>)}</fieldset>
    </DirtyFormDialog>
    <ReasonCommandDialog open={Boolean(command)} title={`${command?.kind === "archive" ? "Archive" : command?.kind === "suspend" ? "Suspend" : "Activate"} user`} commandLabel={command?.kind === "archive" ? "Archive" : command?.kind === "suspend" ? "Suspend" : "Activate"} busy={busy} onConfirm={(reason) => void reasonCommand(reason)} onClose={() => setCommand(undefined)} />
  </main>;
}

type Actions = { user: ManagedUser; actorId: string; onEdit: () => void; onResend: () => void; onCommand: (kind: "archive" | "suspend" | "activate") => void };
function UserActions({ user, actorId, onEdit, onResend, onCommand }: Actions) { const self = user.id === actorId; return <span className="v12-user-actions"><button onClick={onEdit}>Edit {user.name}</button>{user.status === "INVITED" && <button onClick={onResend}>Resend invite to {user.name}</button>}{user.status === "ACTIVE" && <button disabled={self} onClick={() => onCommand("suspend")}>Suspend {user.name}</button>}{user.status === "SUSPENDED" && <button onClick={() => onCommand("activate")}>Activate {user.name}</button>}<button disabled={self} onClick={() => onCommand("archive")}>Archive {user.name}</button></span>; }
function UserCells(props: Actions) { const { user } = props; return <><td>{user.name}</td><td>{user.email}</td><td><span className={`v12-user-status ${user.status.toLowerCase()}`}>{user.status}</span></td><td>{user.roles.map((role) => role.name).join(", ")}</td><td>{user.branches.map((branch) => branch.name).join(", ")}</td><td><UserActions {...props} /></td></>; }
function UserCard(props: Actions) { return <><h3>{props.user.name}</h3><p>{props.user.email}</p><p>{props.user.status}</p><p>{props.user.roles.map((role) => role.name).join(", ")}</p><UserActions {...props} /></>; }

export default function ProductionUsersApp() {
  const [ready, setReady] = useState<{ auth: UsersAuth; actorId: string; permissions: string[] }>(); const [error, setError] = useState("");
  useEffect(() => { void (async () => { try {
    const config = await loadAuthConfig();
    if (config.mode === "local") {
      if (!config.allowDemo) { setError("Local demo authentication is disabled."); return; }
      const auth: UsersAuth = { mode: "local", identity: "north-admin" };
      const session = await createProductionUsersApi(auth).session();
      if (!session.membership.permissions.includes("admin.users.page") || !session.membership.permissions.includes("membership.manage")) { setError("You do not have permission to manage tenant users."); return; }
      setReady({ auth, actorId: session.membership.id, permissions: session.membership.permissions }); return;
    }
    const session = await loadWorkshopSession(config);
    if (!session) { setError("Sign in to manage tenant users."); return; }
    if (!session.membership.permissions.includes("admin.users.page") || !session.membership.permissions.includes("membership.manage")) { setError("You do not have permission to manage tenant users."); return; }
    setReady({ auth: { mode: "cognito", config }, actorId: session.membership.id, permissions: session.membership.permissions });
  } catch { setError("WorkshopOS could not establish the user-management session."); } })(); }, []);
  if (error) return <main><h1>Tenant User Management</h1><p role="alert">{error}</p><a href="/">Return to WorkshopOS</a></main>; if (!ready) return <main><p>Loading user management…</p></main>; return <ProductionUsersScreen {...ready} />;
}
