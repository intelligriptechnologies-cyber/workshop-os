import { type FormEvent, useEffect, useMemo, useState } from "react";

import { loadAuthConfig, loadWorkshopSession } from "./auth";
import { ProductionNavigation } from "./ProductionNavigation";
import { createProductionSearchApi, type SearchAuth, type SearchRecord } from "./production-search-api";
import "./production-roles.css";

function SearchScreen({ auth, permissions }: { auth: SearchAuth; permissions: string[] }) {
  const api = useMemo(() => createProductionSearchApi(auth), [auth]); const [query, setQuery] = useState("");
  const [records, setRecords] = useState<SearchRecord[]>([]); const [searched, setSearched] = useState(false); const [error, setError] = useState("");
  async function search(event: FormEvent) { event.preventDefault(); if (query.trim().length < 2) { setError("Enter at least two characters."); return; } try { setRecords((await api.search(query.trim())).records); setSearched(true); setError(""); } catch (failure) { setError(failure instanceof Error ? failure.message : "Search could not be completed."); } }
  return <main className="v12-roles"><header><a href="/">Back to WorkshopOS</a><h1>Global record search</h1><p>Results contain only records allowed by your current tenant, branch, and action permissions.</p><ProductionNavigation permissions={permissions} /></header>
    {error && <p role="alert" className="v12-role-error">{error}</p>}<form role="search" onSubmit={search}><label htmlFor="global-query">Search permitted records</label><input id="global-query" value={query} onChange={(event) => setQuery(event.target.value)} /><button type="submit">Search</button></form>
    {searched && !records.length ? <p>No permitted records match this search.</p> : <ul>{records.map((record) => <li key={`${record.kind}:${record.id}`}><strong>{record.label}</strong> <span>{record.kind === "work-item" ? "Work item" : "Tenant user"}</span></li>)}</ul>}
  </main>;
}

export default function ProductionSearchApp() {
  const [ready, setReady] = useState<{ auth: SearchAuth; permissions: string[] }>(); const [error, setError] = useState("");
  useEffect(() => { void (async () => { try { const config = await loadAuthConfig();
    if (config.mode === "local") { if (!config.allowDemo) { setError("Local demo authentication is disabled."); return; } const auth: SearchAuth = { mode: "local", identity: "north-admin" }; const session = await createProductionSearchApi(auth).session(); if (!session.membership.permissions.includes("global-search.page") || !session.membership.permissions.includes("global-search.use")) { setError("You do not have permission to use global search."); return; } setReady({ auth, permissions: session.membership.permissions }); return; }
    const session = await loadWorkshopSession(config); if (!session) { setError("Sign in to search records."); return; } if (!session.membership.permissions.includes("global-search.page") || !session.membership.permissions.includes("global-search.use")) { setError("You do not have permission to use global search."); return; } setReady({ auth: { mode: "cognito", config }, permissions: session.membership.permissions });
  } catch { setError("WorkshopOS could not establish the search session."); } })(); }, []);
  if (error) return <main><h1>Global record search</h1><p role="alert">{error}</p></main>; if (!ready) return <main><p>Loading global search…</p></main>; return <SearchScreen {...ready} />;
}
