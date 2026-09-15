import { useEffect, useMemo, useState } from "react";
import { loadAuthConfig, loadWorkshopSession } from "./auth";
import {
  createJobsApi,
  JobApiError,
  type Job,
  type JobAuth,
  type JobLifecycle,
} from "./production-jobs-api";
import {
  JOB_STAGES,
  jobStageLabel,
  type JobListQuery,
} from "../production/src/job-list-contract";
import { ProductionNavigation } from "./ProductionNavigation";
import { ReasonCommandDialog } from "./dialog-primitives";
import "./production-work-items.css";
const blank: JobListQuery = {
  search: "",
  branchId: "",
  visitDate: "",
  stage: "",
  sort: "visitDate.desc",
  page: 1,
  pageSize: 25,
};
function fromUrl(): JobListQuery {
  const p = new URLSearchParams(location.search),
    size = Number(p.get("pageSize")),
    sort = p.get("sort") ?? "",
    stage = p.get("stage") ?? "";
  return {
    ...blank,
    search: p.get("search") ?? "",
    branchId: p.get("branchId") ?? "",
    visitDate: p.get("visitDate") ?? "",
    stage: JOB_STAGES.includes(stage as any) ? (stage as any) : "",
    sort: [
      "visitDate.desc",
      "visitDate.asc",
      "jobNumber.asc",
      "jobNumber.desc",
    ].includes(sort)
      ? (sort as any)
      : blank.sort,
    page: Math.max(1, Number(p.get("page") ?? 1)),
    pageSize: [25, 50, 100].includes(size) ? (size as any) : 25,
  };
}
function save(value: { blob: Blob; filename: string }) {
  const u = URL.createObjectURL(value.blob),
    a = document.createElement("a");
  a.href = u;
  a.download = value.filename;
  a.click();
  URL.revokeObjectURL(u);
}
const Status = ({ job }: { job: Job }) => (
  <span
    className={
      job.stage === "ACTIVE"
        ? "job-status job-status-in-progress"
        : "job-status"
    }
  >
    {job.statusLabel}
  </span>
);
function Screen({ auth, session }: { auth: JobAuth; session: any }) {
  const api = useMemo(() => createJobsApi(auth), [auth]),
    [query, setQuery] = useState(fromUrl),
    [draft, setDraft] = useState(query.search),
    [rows, setRows] = useState<Job[]>([]),
    [page, setPage] = useState({
      page: 1,
      pageSize: 25,
      totalCount: 0,
      pageCount: 1,
    }),
    [view, setView] = useState<"grid" | "table">("table"),
    [detail, setDetail] = useState<Job>(),
    [lifecycle, setLifecycle] = useState<JobLifecycle>(),
    [pendingCommand, setPendingCommand] =
      useState<JobLifecycle["validActions"][number]>(),
    [busy, setBusy] = useState(false),
    [failure, setFailure] = useState("");
  const branches = session.membership.branches as Array<{
      id: string;
      name: string;
    }>,
    permissions = session.membership.permissions as string[];
  const readable = (e: unknown) =>
    e instanceof JobApiError
      ? `${e.message} Reference: ${e.traceId}`
      : "WorkshopOS could not complete the Job request.";
  async function load(next = query) {
    setBusy(true);
    try {
      const r = await api.list(next);
      setRows(r.jobs);
      setPage(r.page);
      setQuery(r.query);
      setFailure("");
    } catch (e) {
      setFailure(readable(e));
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void load();
    void api.getPreference().then((p) => setView(p.viewMode));
  }, []);
  function go(next: JobListQuery) {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(next))
      if (
        v !== "" &&
        !(k === "page" && v === 1) &&
        !(k === "pageSize" && v === 25) &&
        !(k === "sort" && v === "visitDate.desc")
      )
        p.set(k, String(v));
    history.pushState({}, "", `${location.pathname}${p.size ? `?${p}` : ""}`);
    setQuery(next);
    void load(next);
  }
  async function download(
    action: () => Promise<{ blob: Blob; filename: string }>,
  ) {
    setBusy(true);
    try {
      save(await action());
      setFailure("");
    } catch (e) {
      setFailure(readable(e));
    } finally {
      setBusy(false);
    }
  }
  async function exportRows(format: "PDF" | "XLSX") {
    setBusy(true);
    try {
      let x = await api.requestExport(format, query);
      for (let i = 0; i < 20 && x.status === "PENDING"; i++) {
        await new Promise((r) => setTimeout(r, 100));
        x = await api.getExport(x.id);
      }
      if (x.status !== "READY") throw new Error();
      save(await api.downloadExport(x.id));
    } catch (e) {
      setFailure(readable(e));
    } finally {
      setBusy(false);
    }
  }
  async function openDetail(id: string) {
    setBusy(true);
    try {
      const [job, projection] = await Promise.all([
        api.get(id),
        api.lifecycle(id),
      ]);
      setDetail(job);
      setLifecycle(projection);
      setFailure("");
    } catch (e) {
      setFailure(readable(e));
    } finally {
      setBusy(false);
    }
  }
  async function runLifecycle(
    command: JobLifecycle["validActions"][number],
    reason = "",
  ) {
    if (!detail || !lifecycle) return;
    setBusy(true);
    try {
      const result = await api.commandLifecycle(detail.id, {
        command: command.command,
        version: lifecycle.version,
        reason,
        ...(command.command.startsWith("RECORD_")
          ? { evidence: { note: reason } }
          : {}),
      });
      setLifecycle(result.lifecycle);
      setDetail(await api.get(detail.id));
      setPendingCommand(undefined);
      setFailure("");
      await load(query);
    } catch (e) {
      setFailure(readable(e));
      try {
        setLifecycle(await api.lifecycle(detail.id));
      } catch {
        /* preserve the command error */
      }
    } finally {
      setBusy(false);
    }
  }
  const actions = (j: Job, showDetails = true) => (
    <>
      {permissions.includes("job.document.download") && (
        <>
          <button onClick={() => void download(() => api.jobCard(j.id))}>
            Download Job Card PDF
          </button>
          {j.documents.map((d) => (
            <button
              key={d.id}
              onClick={() => void download(() => api.document(d.id))}
            >
              Download {d.type.toLowerCase()} {d.label}
            </button>
          ))}
        </>
      )}
      {showDetails && (
        <button onClick={() => void openDetail(j.id)}>View details</button>
      )}
    </>
  );
  return (
    <main className="v12-work-items">
      <header>
        <a href="/">Back to WorkshopOS</a>
        <h1>Jobs</h1>
        <p>
          Current workshop Jobs from PostgreSQL. Visit dates use the workshop
          timezone.
        </p>
        <ProductionNavigation permissions={permissions} />
      </header>
      {failure && <p role="alert">{failure}</p>}
      <ReasonCommandDialog
        open={Boolean(pendingCommand)}
        title={pendingCommand?.label ?? "Job lifecycle action"}
        commandLabel={pendingCommand?.label ?? "Confirm"}
        busy={busy}
        onConfirm={(reason) =>
          pendingCommand && void runLifecycle(pendingCommand, reason)
        }
        onClose={() => setPendingCommand(undefined)}
      />
      {detail && (
        <section aria-labelledby="job-detail">
          <h2 id="job-detail">{detail.jobNumber}</h2>
          <p>
            {detail.customerName} · {detail.registration}
          </p>
          <p>Visit/check-in date: {detail.visitDate}</p>
          <p>
            Status: <Status job={detail} />{" "}
            {lifecycle?.held && <strong>· On Hold</strong>}
          </p>
          <p>{detail.customerRequest}</p>
          {lifecycle && (
            <div className="job-lifecycle" aria-label="Job lifecycle">
              <h3>Lifecycle</h3>
              <p>
                Canonical stage:{" "}
                <strong>{lifecycle.canonicalStageLabel}</strong>
              </p>
              <dl className="job-facts">
                <div>
                  <dt>Estimate Approved</dt>
                  <dd>
                    {lifecycle.facts.estimateApproved
                      ? "Recorded"
                      : "Not recorded"}
                  </dd>
                </div>
                <div>
                  <dt>Work Accepted</dt>
                  <dd>
                    {lifecycle.facts.workAccepted ? "Recorded" : "Not recorded"}
                  </dd>
                </div>
                <div>
                  <dt>Payment Cleared</dt>
                  <dd>
                    {lifecycle.facts.paymentCleared
                      ? "Recorded"
                      : "Not recorded"}
                  </dd>
                </div>
              </dl>
              {permissions.some((permission) =>
                [
                  "job.lifecycle.manage",
                  "job.estimate-approval.record",
                  "job.work-acceptance.record",
                  "job.payment-clearance.record",
                ].includes(permission),
              ) && (
                <div
                  className="v12-row-actions"
                  aria-label="Valid lifecycle actions"
                >
                  {lifecycle.validActions
                    .filter((action) => {
                      const factPermissions: Record<string, string> = {
                        RECORD_ESTIMATE_APPROVED:
                          "job.estimate-approval.record",
                        RECORD_WORK_ACCEPTED: "job.work-acceptance.record",
                        RECORD_PAYMENT_CLEARED: "job.payment-clearance.record",
                      };
                      return factPermissions[action.command]
                        ? permissions.includes(factPermissions[action.command])
                        : permissions.includes("job.lifecycle.manage");
                    })
                    .map((action) => (
                      <div key={action.command}>
                        <button
                          disabled={busy || action.blockers.length > 0}
                          onClick={() =>
                            action.reasonRequired
                              ? setPendingCommand(action)
                              : void runLifecycle(action)
                          }
                        >
                          {action.label}
                        </button>
                        {action.blockers.length > 0 && (
                          <ul aria-label={`${action.label} blockers`}>
                            {action.blockers.map((item) => (
                              <li key={item.code}>
                                <strong>{item.message}</strong>{" "}
                                {item.resolution}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                </div>
              )}
              <h3>Immutable history</h3>
              {lifecycle.history.length ? (
                <ol className="job-history">
                  {lifecycle.history.map((event) => (
                    <li key={event.auditReference}>
                      <strong>{event.label}</strong> · {event.actor} ·{" "}
                      <time dateTime={event.at}>
                        {new Date(event.at).toLocaleString()}
                      </time>
                      {event.reason && <span> · {event.reason}</span>}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No lifecycle commands have been recorded yet.</p>
              )}
            </div>
          )}
          <div>{actions(detail, false)}</div>
          {permissions.includes("media.upload") && (
            <a href={`/production/media?visitDate=${encodeURIComponent(detail.visitDate)}&jobId=${encodeURIComponent(detail.id)}`}>
              Upload media for this Job
            </a>
          )}
          <button
            onClick={() => {
              setDetail(undefined);
              setLifecycle(undefined);
            }}
          >
            Close details
          </button>
        </section>
      )}
      <section>
        <div className="ws-tracer-actions">
          <h2>Job List</h2>
          <button onClick={() => void load()} disabled={busy}>
            Refresh
          </button>
        </div>
        <form
          className="v12-list-controls"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            go({ ...query, search: draft.trim(), page: 1 });
          }}
        >
          <label htmlFor="job-search">Search</label>
          <input
            id="job-search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <label htmlFor="visit-date">Visit/check-in date</label>
          <input
            id="visit-date"
            type="date"
            value={query.visitDate}
            onChange={(e) =>
              go({ ...query, visitDate: e.target.value, page: 1 })
            }
          />
          <label htmlFor="job-status">Status</label>
          <select
            id="job-status"
            value={query.stage}
            onChange={(e) =>
              go({ ...query, stage: e.target.value as any, page: 1 })
            }
          >
            <option value="">All statuses</option>
            {JOB_STAGES.filter(Boolean).map((s) => (
              <option key={s} value={s}>
                {jobStageLabel(s)}
              </option>
            ))}
          </select>
          <label htmlFor="job-branch">Branch</label>
          <select
            id="job-branch"
            value={query.branchId}
            onChange={(e) =>
              go({ ...query, branchId: e.target.value, page: 1 })
            }
          >
            <option value="">All permitted branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <label htmlFor="job-sort">Sort</label>
          <select
            id="job-sort"
            value={query.sort}
            onChange={(e) =>
              go({ ...query, sort: e.target.value as any, page: 1 })
            }
          >
            <option value="visitDate.desc">Newest check-in</option>
            <option value="visitDate.asc">Oldest check-in</option>
            <option value="jobNumber.asc">Job number A–Z</option>
            <option value="jobNumber.desc">Job number Z–A</option>
          </select>
          <button>Apply</button>
          <button
            type="button"
            onClick={() => {
              setDraft("");
              go(blank);
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
                void api.savePreference("table");
              }}
            >
              Table
            </button>
            <button
              aria-pressed={view === "grid"}
              onClick={() => {
                setView("grid");
                void api.savePreference("grid");
              }}
            >
              Grid
            </button>
          </div>
          {permissions.includes("job.export") && (
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
            <p>No Jobs match this Visit/check-in date and filters.</p>
            <button
              onClick={() => {
                setDraft("");
                go(blank);
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
                  <th>Job</th>
                  <th>Visit/check-in date</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((j) => (
                  <tr key={j.id}>
                    <td>{j.jobNumber}</td>
                    <td>{j.visitDate}</td>
                    <td>{j.customerName}</td>
                    <td>{j.registration}</td>
                    <td>
                      <Status job={j} />
                    </td>
                    <td>{actions(j)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="v12-card-grid">
            {rows.map((j) => (
              <li key={j.id}>
                <strong>{j.jobNumber}</strong>
                <small>Visit/check-in date: {j.visitDate}</small>
                <span>
                  {j.customerName} · {j.registration}
                </span>
                <Status job={j} />
                <div>{actions(j)}</div>
              </li>
            ))}
          </ul>
        )}
        <nav className="v12-pagination" aria-label="Job pages">
          <span>
            {page.totalCount
              ? `${(page.page - 1) * page.pageSize + 1}–${Math.min(page.page * page.pageSize, page.totalCount)} of ${page.totalCount}`
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
          <label htmlFor="job-size">Rows</label>
          <select
            id="job-size"
            value={query.pageSize}
            onChange={(e) =>
              go({ ...query, pageSize: Number(e.target.value) as any, page: 1 })
            }
          >
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </nav>
      </section>
    </main>
  );
}
export default function ProductionJobsApp() {
  const [ready, setReady] = useState<{ auth: JobAuth; session: any }>(),
    [error, setError] = useState("");
  useEffect(() => {
    void (async () => {
      try {
        const config = await loadAuthConfig();
        let auth: JobAuth, session;
        if (config.mode === "local") {
          if (!config.allowDemo) throw new Error();
          auth = { mode: "local", identity: "north-admin" };
          session = await createJobsApi(auth).session();
        } else {
          session = await loadWorkshopSession(config);
          if (!session) throw new Error();
          auth = { mode: "cognito", config };
        }
        if (
          !session.membership.permissions.includes("jobs.page") ||
          !session.membership.permissions.includes("job.read")
        ) {
          setError("You do not have permission to view Jobs.");
          return;
        }
        setReady({ auth, session });
      } catch {
        setError("WorkshopOS could not establish the Jobs session.");
      }
    })();
  }, []);
  if (error)
    return (
      <main>
        <h1>Jobs</h1>
        <p role="alert">{error}</p>
      </main>
    );
  if (!ready)
    return (
      <main>
        <p>Loading Jobs…</p>
      </main>
    );
  return <Screen {...ready} />;
}
