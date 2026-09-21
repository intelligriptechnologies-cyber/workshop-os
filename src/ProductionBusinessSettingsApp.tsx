import { useEffect, useMemo, useRef, useState } from "react";

import { loadAuthConfig, loadWorkshopSession } from "./auth";
import { DirtyFormDialog } from "./dialog-primitives";
import { createProductionBusinessSettingsApi, SettingsApiError, type BusinessSettings, type SettingsAuth, type SettingsWorkspace } from "./production-business-settings-api";
import "./production-business-settings.css";

type Tab = "operations" | "billing" | "communications";
const fields: Record<Tab, (keyof BusinessSettings)[]> = { operations: ["defaultLaborRateMinor", "defaultJobDurationMinutes"], billing: ["invoiceFooter"], communications: ["customerUpdatesEnabled"] };
const labels: Record<keyof BusinessSettings, string> = { defaultLaborRateMinor: "Default labor rate (minor currency units)", defaultJobDurationMinutes: "Default Job duration (minutes)", customerUpdatesEnabled: "Customer updates enabled", invoiceFooter: "Invoice footer" };

function SettingsScreen({ auth, session }: { auth: SettingsAuth; session: Awaited<ReturnType<ReturnType<typeof createProductionBusinessSettingsApi>["session"]>> }) {
  const api = useMemo(() => createProductionBusinessSettingsApi(auth), [auth]); const [branchId, setBranchId] = useState("");
  const [workspace, setWorkspace] = useState<SettingsWorkspace>(); const [values, setValues] = useState<Partial<BusinessSettings>>({});
  const [tab, setTab] = useState<Tab>("operations"); const [busy, setBusy] = useState(false); const [failure, setFailure] = useState(""); const [status, setStatus] = useState("");
  const [editOpen, setEditOpen] = useState(false); const editorFocus = useRef<HTMLButtonElement>(null);
  async function load(nextBranch = branchId) { setBusy(true); try { const result = await api.get(nextBranch || undefined); setWorkspace(result); setValues(result.overrides); setFailure(""); } catch (error) { show(error); } finally { setBusy(false); } }
  function show(error: unknown) { setFailure(error instanceof SettingsApiError ? `${error.message} Reference: ${error.traceId}` : "WorkshopOS could not complete the request."); }
  useEffect(() => { void load(""); }, []);
  function displayValue(key: keyof BusinessSettings) { return values[key] ?? workspace?.inherited[key]; }
  function setValue(key: keyof BusinessSettings, value: BusinessSettings[keyof BusinessSettings]) { setValues((current) => ({ ...current, [key]: value })); }
  function reset(key: keyof BusinessSettings) { setValues((current) => { const next = { ...current }; delete next[key]; return next; }); }
  async function save() { if (!workspace) return; setBusy(true); try { const result = await api.save(workspace, values); setWorkspace(result); setValues(result.overrides); setStatus("Draft saved. Review it before publishing."); setFailure(""); } catch (error) { show(error); } finally { setBusy(false); } }
  async function publish() { if (!workspace) return; setBusy(true); try { const result = await api.publish(workspace); setWorkspace(result); setValues(result.overrides); setStatus(`Published version ${result.publishedVersion}. Active work keeps its existing snapshot.`); setFailure(""); } catch (error) { show(error); } finally { setBusy(false); } }
  return <main className="v12-settings"><header><a href="/">Back to WorkshopOS</a><h1>Business Settings</h1><p>Publish tenant defaults and branch overrides without changing active work.</p></header>
    {failure && <p role="alert">{failure}</p>}{status && <p role="status">{status}</p>}
    <section aria-labelledby="settings-scope"><h2 id="settings-scope">Settings scope</h2><label htmlFor="settings-branch">Tenant or branch</label><select id="settings-branch" value={branchId} disabled={busy} onChange={(event) => { setBranchId(event.target.value); void load(event.target.value); }}><option value="">Tenant defaults</option>{session.membership.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} overrides</option>)}</select>
      {workspace && <p>Draft version {workspace.draftVersion} · Published version {workspace.publishedVersion || "None"}</p>}</section>
    <section aria-label="Settings editor"><h2>Settings editor</h2><p>Edit the current draft in a focused workspace before publishing it.</p><button type="button" disabled={!workspace || busy} onClick={() => setEditOpen(true)}>Edit settings</button><button type="button" disabled={busy} onClick={() => void load()}>Refresh</button></section>
    <DirtyFormDialog open={editOpen} title="Edit Business Settings" size="wide" dirty={Boolean(workspace && JSON.stringify(values)!==JSON.stringify(workspace.overrides))} errors={[]} busy={busy} initialFocusRef={editorFocus} submitLabel="Save draft" onSubmit={(event) => { event.preventDefault(); void save(); }} onClose={() => { setValues(workspace?.overrides ?? {}); setEditOpen(false); }}><div role="tablist" aria-label="Business Settings sections">{(["operations", "billing", "communications"] as Tab[]).map((item, index) => <button ref={index===0?editorFocus:undefined} type="button" role="tab" aria-selected={tab === item} aria-controls={`settings-${item}`} id={`tab-${item}`} key={item} onClick={() => setTab(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>
      <div role="tabpanel" id={`settings-${tab}`} aria-labelledby={`tab-${tab}`}>{workspace ? fields[tab].map((key) => <div className="v12-setting-row" key={key}>
        {workspace.scope.kind === "BRANCH" && <label><input type="checkbox" checked={Object.hasOwn(values, key)} onChange={(event) => event.target.checked ? setValue(key, workspace.inherited[key] as never) : reset(key)} /> Override {labels[key]}</label>}
        {key === "customerUpdatesEnabled" ? <label><input aria-label={labels[key]} type="checkbox" disabled={workspace.scope.kind === "BRANCH" && !Object.hasOwn(values, key)} checked={Boolean(displayValue(key))} onChange={(event) => setValue(key, event.target.checked)} /> {labels[key]}</label>
          : <><label htmlFor={`setting-${key}`}>{labels[key]}</label><input id={`setting-${key}`} type={key === "invoiceFooter" ? "text" : "number"} min={key === "defaultJobDurationMinutes" ? 15 : 0} max={key === "defaultJobDurationMinutes" ? 1440 : 100000000} disabled={workspace.scope.kind === "BRANCH" && !Object.hasOwn(values, key)} value={String(displayValue(key) ?? "")} onChange={(event) => setValue(key, (key === "invoiceFooter" ? event.target.value : Number(event.target.value)) as never)} /></>}
        {workspace.scope.kind === "BRANCH" && <p className="v12-inherited">Inherited tenant value: {String(workspace.inherited[key])} {!Object.hasOwn(values, key) && "(effective)"}</p>}
      </div>) : <p>Loading settings…</p>}</div>
      {workspace?.scope.kind === "BRANCH" && <button type="button" onClick={() => setValues({})}>Reset all to inherited</button>}
      <div className="v12-settings-actions"><button type="button" disabled={busy || !workspace} onClick={() => void publish()}>Publish settings</button></div>
    </DirtyFormDialog></main>;
}

export default function ProductionBusinessSettingsApp() {
  const [ready, setReady] = useState<{ auth: SettingsAuth; session: any }>(); const [error, setError] = useState("");
  useEffect(() => { void (async () => { try { const config = await loadAuthConfig(); let auth: SettingsAuth; let session;
    if (config.mode === "local") { if (!config.allowDemo) throw new Error(); auth = { mode: "local", identity: "north-admin" }; session = await createProductionBusinessSettingsApi(auth).session(); }
    else { session = await loadWorkshopSession(config); if (!session) { setError("Sign in to manage Business Settings."); return; } auth = { mode: "cognito", config }; }
    if (!session.membership.permissions.includes("business-settings.page") || !session.membership.permissions.includes("business-settings.manage")) { setError("You do not have permission to manage Business Settings."); return; }
    setReady({ auth, session });
  } catch { setError("WorkshopOS could not establish the Business Settings session."); } })(); }, []);
  if (error) return <main><h1>Business Settings</h1><p role="alert">{error}</p><a href="/">Return to WorkshopOS</a></main>;
  if (!ready) return <main><p>Loading Business Settings…</p></main>;
  return <SettingsScreen {...ready} />;
}
