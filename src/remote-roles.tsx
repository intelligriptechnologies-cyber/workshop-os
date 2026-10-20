import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { CognitoConfig } from "./auth";
import { adminRolesApi, type AdminRole } from "./admin-users-api";
import { ADMIN_PAGE_GROUPS } from "./admin-demo-state";

const pagePermissions = ADMIN_PAGE_GROUPS.flatMap((group) => group.pages.flatMap((page) => [
  { code: `page.${page.key}.read`, label: `${page.label} · view` },
  { code: `page.${page.key}.write`, label: `${page.label} · change` },
]));
const tenantPermissions = ["tenant.settings.read", "tenant.settings.write", "tenant.users.read", "tenant.users.manage",
  "branch.settings.read", "branch.settings.write"].map((code) => ({ code, label: code }));

export function RemoteRoles({ config }: { config: CognitoConfig }) {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [draft, setDraft] = useState<AdminRole | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const refresh = async () => setRoles((await adminRolesApi.list(config)).roles);
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "Roles could not be loaded.")); }, [config]);
  const choices = useMemo(() => {
    const known = new Set([...pagePermissions, ...tenantPermissions].map((item) => item.code));
    return [...pagePermissions, ...tenantPermissions,
      ...[...new Set(roles.flatMap((role) => role.permissions))].filter((code) => !known.has(code)).map((code) => ({ code, label: code }))];
  }, [roles]);
  const run = async (work: () => Promise<unknown>) => {
    setBusy(true); setError("");
    try { await work(); await refresh(); setDraft(null); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Role could not be saved."); }
    finally { setBusy(false); }
  };
  const save = (event: FormEvent) => {
    event.preventDefault(); if (!draft) return;
    if (draft.id) void run(() => adminRolesApi.update(config, { id: draft.id, name: draft.name, version: draft.version ?? 1,
      description: draft.description ?? "", permissions: draft.permissions }));
    else void run(() => adminRolesApi.create(config, { name: draft.name, description: draft.description ?? "", permissions: draft.permissions }));
  };
  const toggle = (permission: string) => {
    if (!draft) return;
    setDraft({ ...draft, permissions: draft.permissions.includes(permission)
      ? draft.permissions.filter((item) => item !== permission) : [...draft.permissions, permission] });
  };
  return <section className="admin-tab"><div className="panel-actions"><h3>Roles & Page Access</h3>
    <button className="primary-action" onClick={() => setDraft({ id: "", name: "", description: "", permissions: [], version: 0 })}>Add role</button></div>
    {error && <p className="api-error" role="alert">{error} <button onClick={() => void refresh()}>Retry</button></p>}
    {draft && <form onSubmit={save}><div className="form-grid"><label>Name<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
      <label>Description<input value={draft.description ?? ""} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label></div>
      <fieldset className="assignment-fieldset"><legend>Permissions</legend>{choices.map((choice) => <label key={choice.code}><input type="checkbox" checked={draft.permissions.includes(choice.code)} onChange={() => toggle(choice.code)} />{choice.label}</label>)}</fieldset>
      <div className="action-row"><button className="primary-action" disabled={busy}>Save role</button><button type="button" onClick={() => setDraft(null)}>Cancel</button></div></form>}
    <div className="table-wrap"><table><thead><tr><th>Role</th><th>Status</th><th>Permissions</th><th>Actions</th></tr></thead><tbody>{roles.map((role) => <tr key={role.id}><td>{role.name}</td><td>{role.status}</td><td>{role.permissions.length}</td><td><button disabled={busy} onClick={() => setDraft({ ...role })}>Edit</button>{!role.systemKey && <button disabled={busy} onClick={() => { const reason = window.prompt("Reason for archiving:"); if (reason?.trim()) void run(() => adminRolesApi.archive(config, role.id, reason)); }}>Archive</button>}</td></tr>)}</tbody></table></div>
  </section>;
}
