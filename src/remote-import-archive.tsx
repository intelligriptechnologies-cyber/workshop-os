import { useEffect, useState } from "react";
import { authenticatedFetch, type CognitoConfig } from "./auth";

type ArchivedRow = { sourceTable: string; sourceId: string; targetId: string | null; payload: Record<string, unknown> };
type Result = { total: number; rows: ArchivedRow[] };

export function RemoteImportArchive({ config }: { config: CognitoConfig }) {
  const [table, setTable] = useState("");
  const [offset, setOffset] = useState(0);
  const [result, setResult] = useState<Result>({ total: 0, rows: [] });
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true; setError("");
    const params = new URLSearchParams({ limit: "100", offset: String(offset) });
    if (table) params.set("sourceTable", table);
    void authenticatedFetch(config, `/api/v1/admin/demo-import/rows?${params}`)
      .then(async (response) => {
        if (!response.ok) throw new Error(`Could not load imported records (${response.status}).`);
        return response.json() as Promise<Result>;
      }).then((value) => { if (active) setResult(value); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Could not load imported records."); });
    return () => { active = false; };
  }, [config, table, offset]);
  return <section className="manager-panel" aria-label="Bundled import archive">
    <h3>Bundled import archive</h3>
    <p>Source records and links retained for reconciliation. Operational records are edited in their workspaces.</p>
    <label>Source table<input value={table} onChange={(event) => { setTable(event.target.value.trim()); setOffset(0); }} placeholder="All tables" /></label>
    {error && <p role="alert" className="form-error">{error}</p>}
    <p>{result.total} source records</p>
    <div className="table-wrap"><table><thead><tr><th>Table</th><th>Source ID</th><th>Mapped ID</th><th>Source values</th></tr></thead><tbody>
      {result.rows.map((row) => <tr key={`${row.sourceTable}-${row.sourceId}`}><td>{row.sourceTable}</td><td>{row.sourceId}</td>
        <td>{row.targetId ?? "Archive only"}</td><td><details><summary>View values</summary><pre>{JSON.stringify(row.payload, null, 2)}</pre></details></td></tr>)}
    </tbody></table></div>
    <div className="action-row"><button type="button" disabled={!offset} onClick={() => setOffset(Math.max(0, offset - 100))}>Previous</button>
      <span>{result.total ? `${offset + 1}–${Math.min(offset + 100, result.total)} of ${result.total}` : "0 records"}</span>
      <button type="button" disabled={offset + 100 >= result.total} onClick={() => setOffset(offset + 100)}>Next</button></div>
  </section>;
}
