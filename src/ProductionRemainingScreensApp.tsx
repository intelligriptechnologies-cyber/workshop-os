import { type FormEvent, useEffect, useMemo, useState } from "react";

import { loadAuthConfig, loadWorkshopSession } from "./auth";
import { ModalDialog, ReasonCommandDialog } from "./dialog-primitives";
import { ProductionNavigation } from "./ProductionNavigation";
import {
  createRemainingScreensApi,
  RemainingScreenApiError,
  type RemainingAuth,
} from "./production-remaining-screens-api";
import {
  DEFAULT_WORK_ITEM_LIST_QUERY,
  type WorkItemListQuery,
} from "./work-items-api";
import {
  isRemainingScreenKey,
  REMAINING_SCREEN_META,
  type RemainingScreenKey,
  type RemainingScreenRow,
} from "../production/src/remaining-screens";
import "./production-work-items.css";

function screenFromPath(): RemainingScreenKey {
  const value = location.pathname.split("/").filter(Boolean).at(-1) ?? "";
  return isRemainingScreenKey(value) ? value : "appointments";
}

function fromUrl(): WorkItemListQuery {
  const params = new URLSearchParams(location.search);
  const size = Number(params.get("pageSize"));
  const sort = params.get("sort");
  return {
    search: params.get("search") ?? "",
    branchId: params.get("branchId") ?? "",
    sort: ([
      "updatedAt.desc",
      "updatedAt.asc",
      "summary.asc",
      "summary.desc",
    ].includes(sort ?? "")
      ? sort
      : "updatedAt.desc") as WorkItemListQuery["sort"],
    page: Math.max(1, Number(params.get("page") ?? 1)),
    pageSize: ([25, 50, 100].includes(size) ? size : 25) as 25 | 50 | 100,
  };
}

function readable(error: unknown) {
  return error instanceof RemainingScreenApiError
    ? `${error.message} Reference: ${error.traceId}`
    : "WorkshopOS could not complete this request.";
}

function save(file: { blob: Blob; filename: string }) {
  const url = URL.createObjectURL(file.blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Screen({
  auth,
  session,
  screen,
}: {
  auth: RemainingAuth;
  session: any;
  screen: RemainingScreenKey;
}) {
  const api = useMemo(() => createRemainingScreensApi(auth), [auth]);
  const meta = REMAINING_SCREEN_META[screen];
  const permissions = session.membership.permissions as string[];
  const branches = session.membership.branches as Array<{
    id: string;
    name: string;
  }>;
  const [query, setQuery] = useState(fromUrl);
  const [draft, setDraft] = useState(query.search);
  const [rows, setRows] = useState<RemainingScreenRow[]>([]);
  const [page, setPage] = useState({
    page: 1,
    pageSize: 25,
    totalCount: 0,
    pageCount: 1,
  });
  const [view, setView] = useState<"grid" | "table">("table");
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [status, setStatus] = useState("");
  const [target, setTarget] = useState<RemainingScreenRow>();
  const [details, setDetails] = useState<RemainingScreenRow>();

  async function load(next = query) {
    setBusy(true);
    try {
      const result = await api.list(screen, next);
      setRows(result.rows);
      setPage(result.page);
      setFailure("");
    } catch (error) {
      setFailure(readable(error));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void load();
    void api
      .getPreference(screen)
      .then((preference) => setView(preference.viewMode));
  }, []);

  function go(next: WorkItemListQuery) {
    const params = new URLSearchParams();
    if (next.search) params.set("search", next.search);
    if (next.branchId) params.set("branchId", next.branchId);
    if (next.sort !== "updatedAt.desc") params.set("sort", next.sort);
    if (next.page !== 1) params.set("page", String(next.page));
    if (next.pageSize !== 25)
      params.set("pageSize", String(next.pageSize));
    history.pushState(
      {},
      "",
      `${location.pathname}${params.size ? `?${params}` : ""}`,
    );
    setQuery(next);
    void load(next);
  }

  async function exportRows(format: "PDF" | "XLSX") {
    setBusy(true);
    try {
      let job = await api.requestExport(screen, format, query);
      for (
        let attempt = 0;
        attempt < 30 && job.status === "PENDING";
        attempt++
      ) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        job = await api.getExport(job.id);
      }
      if (job.status !== "READY") throw new Error();
      save(await api.downloadExport(job.id));
      setStatus(
        `${format} export ready with ${job.rowCount ?? 0} filtered rows.`,
      );
    } catch (error) {
      setFailure(readable(error));
    } finally {
      setBusy(false);
    }
  }

  async function complete(reason: string) {
    if (!target || (screen !== "follow-ups" && screen !== "action-inbox"))
      return;
    setBusy(true);
    try {
      await api.complete(screen, target, reason);
      setTarget(undefined);
      setStatus("The record was completed and the reason was recorded.");
      await load();
    } catch (error) {
      setFailure(readable(error));
    } finally {
      setBusy(false);
    }
  }

  const canComplete = Boolean(
    meta.managePermission &&
      permissions.includes(meta.managePermission) &&
      (screen === "follow-ups" || screen === "action-inbox"),
  );
  const actions = (row: RemainingScreenRow) => (
    <div className="ws-tracer-actions">
      <button onClick={() => setDetails(row)}>View {row.title}</button>
      {canComplete && row.status === "OPEN" && (
        <button onClick={() => setTarget(row)}>Complete {row.title}</button>
      )}
    </div>
  );

  return (
    <main className="v12-work-items">
      <header>
        <a href="/">WorkshopOS production home</a>
        <h1>{meta.label}</h1>
        <p>Authenticated PostgreSQL records from permitted branches.</p>
        <ProductionNavigation permissions={permissions} />
      </header>
      {failure && <p role="alert">{failure}</p>}
      {status && <p role="status">{status}</p>}
      <section>
        <div className="ws-tracer-actions">
          <h2>{meta.label} list</h2>
          <button onClick={() => void load()} disabled={busy}>
            Refresh
          </button>
        </div>
        <form
          role="search"
          className="v12-list-controls"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            go({ ...query, search: draft.trim(), page: 1 });
          }}
        >
          <label htmlFor="remaining-search">Search</label>
          <input
            id="remaining-search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <label htmlFor="remaining-branch">Branch</label>
          <select
            id="remaining-branch"
            value={query.branchId}
            onChange={(event) =>
              go({ ...query, branchId: event.target.value, page: 1 })
            }
          >
            <option value="">All permitted branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <label htmlFor="remaining-sort">Sort</label>
          <select
            id="remaining-sort"
            value={query.sort}
            onChange={(event) =>
              go({
                ...query,
                sort: event.target.value as WorkItemListQuery["sort"],
                page: 1,
              })
            }
          >
            <option value="updatedAt.desc">Recently updated</option>
            <option value="updatedAt.asc">Oldest updated</option>
            <option value="summary.asc">Title A–Z</option>
            <option value="summary.desc">Title Z–A</option>
          </select>
          <button>Apply</button>
          <button
            type="button"
            onClick={() => {
              setDraft("");
              go(DEFAULT_WORK_ITEM_LIST_QUERY);
            }}
          >
            Clear
          </button>
        </form>
        <div className="v12-presentation">
          <div role="group" aria-label="View mode">
            <button
              aria-pressed={view === "table"}
              onClick={() => {
                setView("table");
                void api.savePreference(screen, "table");
              }}
            >
              Table
            </button>
            <button
              aria-pressed={view === "grid"}
              onClick={() => {
                setView("grid");
                void api.savePreference(screen, "grid");
              }}
            >
              Grid
            </button>
          </div>
          {permissions.includes(`${screen}.export`) && (
            <>
              <button onClick={() => void exportRows("PDF")}>Export PDF</button>
              <button onClick={() => void exportRows("XLSX")}>
                Export XLSX
              </button>
            </>
          )}
        </div>
        {!busy && !rows.length ? (
          <div className="v12-empty">
            <p>No {meta.label.toLowerCase()} match these filters.</p>
            <button
              onClick={() => {
                setDraft("");
                go(DEFAULT_WORK_ITEM_LIST_QUERY);
              }}
            >
              Clear filters
            </button>
          </div>
        ) : view === "table" ? (
          <div className="v12-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Record</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.title}</td>
                    <td>{row.subtitle}</td>
                    <td>{row.status}</td>
                    <td>{new Date(row.updatedAt).toLocaleString()}</td>
                    <td>{actions(row)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="v12-card-grid">
            {rows.map((row) => (
              <li key={row.id}>
                <strong>{row.title}</strong>
                <small>{row.subtitle}</small>
                <span>{row.status}</span>
                {actions(row)}
              </li>
            ))}
          </ul>
        )}
        <nav
          className="v12-pagination"
          aria-label={`${meta.label} pages`}
        >
          <span>
            {page.totalCount
              ? `${(page.page - 1) * page.pageSize + 1}–${Math.min(
                  page.page * page.pageSize,
                  page.totalCount,
                )} of ${page.totalCount}`
              : "0 results"}
          </span>
          <button
            disabled={page.page <= 1 || busy}
            onClick={() => go({ ...query, page: page.page - 1 })}
          >
            Previous
          </button>
          <span>
            Page {page.page} of {page.pageCount}
          </span>
          <button
            disabled={page.page >= page.pageCount || busy}
            onClick={() => go({ ...query, page: page.page + 1 })}
          >
            Next
          </button>
          <label htmlFor="remaining-size">Rows</label>
          <select
            id="remaining-size"
            value={query.pageSize}
            onChange={(event) =>
              go({
                ...query,
                pageSize: Number(event.target.value) as 25 | 50 | 100,
                page: 1,
              })
            }
          >
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </nav>
      </section>
      <ModalDialog
        open={Boolean(details)}
        title={details?.title ?? "Record details"}
        onRequestClose={() => setDetails(undefined)}
      >
        <dl>
          <dt>Details</dt>
          <dd>{details?.subtitle}</dd>
          <dt>Status</dt>
          <dd>{details?.status}</dd>
          <dt>Updated</dt>
          <dd>{details ? new Date(details.updatedAt).toLocaleString() : ""}</dd>
          <dt>Record reference</dt>
          <dd>
            <code>{details?.id}</code>
          </dd>
        </dl>
        <div className="ws-dialog-actions">
          <button onClick={() => setDetails(undefined)}>Close</button>
        </div>
      </ModalDialog>
      <ReasonCommandDialog
        open={Boolean(target)}
        title={`Complete ${target?.title ?? "record"}`}
        commandLabel="Complete"
        busy={busy}
        onConfirm={(reason) => void complete(reason)}
        onClose={() => setTarget(undefined)}
      />
    </main>
  );
}

export default function ProductionRemainingScreensApp() {
  const screen = screenFromPath();
  const meta = REMAINING_SCREEN_META[screen];
  const [ready, setReady] = useState<{
    auth: RemainingAuth;
    session: any;
  }>();
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const config = await loadAuthConfig();
        let auth: RemainingAuth;
        let session;
        if (config.mode === "local") {
          if (!config.allowDemo) throw new Error();
          auth = { mode: "local", identity: "north-admin" };
          session = await createRemainingScreensApi(auth).session();
        } else {
          session = await loadWorkshopSession(config);
          if (!session) throw new Error();
          auth = { mode: "cognito", config };
        }
        if (
          !session.membership.permissions.includes(`${screen}.page`) ||
          !session.membership.permissions.includes(meta.readPermission)
        ) {
          setError(`You do not have permission to view ${meta.label}.`);
          return;
        }
        setReady({ auth, session });
      } catch {
        setError(`WorkshopOS could not establish the ${meta.label} session.`);
      }
    })();
  }, []);

  if (error)
    return (
      <main>
        <h1>{meta.label}</h1>
        <p role="alert">{error}</p>
      </main>
    );
  if (!ready)
    return (
      <main>
        <p>Loading {meta.label}…</p>
      </main>
    );
  return <Screen {...ready} screen={screen} />;
}
