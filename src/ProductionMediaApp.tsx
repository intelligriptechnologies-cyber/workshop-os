import { useEffect, useMemo, useState } from "react";
import { loadAuthConfig, loadWorkshopSession } from "./auth";
import { ProductionNavigation } from "./ProductionNavigation";
import { ReasonCommandDialog } from "./dialog-primitives";
import {
  createMediaApi,
  MediaApiError,
  type MediaAuth,
  type MediaJobOption,
} from "./production-media-api";
import {
  MEDIA_CATEGORIES,
  type JobMediaRecord,
  type MediaCategory,
  type MediaListQuery,
} from "../production/src/job-media";
import "./production-media.css";

const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
const initial = (): MediaListQuery => {
  const p = new URLSearchParams(location.search),
    size = Number(p.get("pageSize")),
    requestedPage = Number(p.get("page") ?? 1),
    requestedCategory = p.get("category") ?? "";
  return {
    search: p.get("search") ?? "",
    branchId: p.get("branchId") ?? "",
    visitDate: p.get("visitDate") ?? today(),
    jobId: p.get("jobId") ?? "",
    category: MEDIA_CATEGORIES.includes(requestedCategory as MediaCategory)
      ? (requestedCategory as MediaCategory)
      : "",
    includeArchived: p.get("includeArchived") === "true",
    page:
      Number.isSafeInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1,
    pageSize: [25, 50, 100].includes(size) ? (size as 25 | 50 | 100) : 25,
  };
};
function save(value: { blob: Blob; filename: string }, inline = false) {
  const url = URL.createObjectURL(value.blob);
  if (inline) window.open(url, "_blank", "noopener,noreferrer");
  else {
    const a = document.createElement("a");
    a.href = url;
    a.download = value.filename;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Screen({ auth, session }: { auth: MediaAuth; session: any }) {
  const api = useMemo(() => createMediaApi(auth), [auth]);
  const permissions = session.membership.permissions as string[];
  const branches = session.membership.branches as Array<{
    id: string;
    name: string;
  }>;
  const [query, setQuery] = useState(initial);
  const [rows, setRows] = useState<JobMediaRecord[]>([]);
  const [page, setPage] = useState({
    page: 1,
    pageSize: 25,
    totalCount: 0,
    pageCount: 1,
  });
  const [jobs, setJobs] = useState<MediaJobOption[]>([]);
  const [jobSearch, setJobSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<MediaJobOption>();
  const [file, setFile] = useState<File>();
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<MediaCategory | "">("");
  const [archive, setArchive] = useState<JobMediaRecord>();
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [notice, setNotice] = useState("");
  const readable = (error: unknown) =>
    error instanceof MediaApiError
      ? `${error.message} Reference: ${error.traceId}`
      : "WorkshopOS could not complete the Media request.";
  async function load(next = query) {
    setBusy(true);
    try {
      const result = await api.list(next);
      setRows(result.media);
      setPage(result.page);
      setQuery(result.query);
      setFailure("");
    } catch (error) {
      setFailure(readable(error));
    } finally {
      setBusy(false);
    }
  }
  async function loadJobs() {
    if (!query.visitDate) return;
    try {
      const result = await api.jobs(query.visitDate, jobSearch, query.branchId);
      setJobs(result.jobs);
      const requested = new URLSearchParams(location.search).get("jobId");
      const match = result.jobs.find(
        (job) => job.id === (selectedJob?.id ?? requested),
      );
      if (match) {
        setSelectedJob(match);
        if (
          !category ||
          !match.allowedCategories.includes(category as MediaCategory)
        )
          setCategory(match.allowedCategories[0] ?? "");
      }
    } catch (error) {
      setFailure(readable(error));
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    void loadJobs();
  }, [query.visitDate, query.branchId]);
  function go(next: MediaListQuery) {
    history.replaceState(
      {},
      "",
      `${location.pathname}?${new URLSearchParams(
        Object.entries(next)
          .filter(([, v]) => v !== "" && v !== false)
          .map(([k, v]) => [k, String(v)]),
      )}`,
    );
    setQuery(next);
    void load(next);
  }
  async function upload() {
    if (!selectedJob || !file || !category) return;
    setBusy(true);
    try {
      await api.upload({ job: selectedJob, category, label, file });
      setNotice(
        "Upload is quarantined until the trusted scanner marks it clean.",
      );
      setFile(undefined);
      setLabel("");
      await load({ ...query, jobId: selectedJob.id, page: 1 });
    } catch (error) {
      setFailure(readable(error));
    } finally {
      setBusy(false);
    }
  }
  async function access(row: JobMediaRecord, mode: "view" | "download") {
    setBusy(true);
    try {
      save(await api[mode](row.id), mode === "view");
      setFailure("");
    } catch (error) {
      setFailure(readable(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="v12-media">
      <header>
        <a href="/">Back to WorkshopOS</a>
        <h1>Media</h1>
        <p>
          Job-linked evidence from PostgreSQL. Private originals remain
          quarantined until scanning completes.
        </p>
        <ProductionNavigation permissions={permissions} />
      </header>
      {failure && <p role="alert">{failure}</p>}
      {notice && <p role="status">{notice}</p>}
      <ReasonCommandDialog
        open={Boolean(archive)}
        title="Archive media"
        commandLabel="Archive media"
        busy={busy}
        onClose={() => setArchive(undefined)}
        onConfirm={async (reason) => {
          if (!archive) return;
          setBusy(true);
          try {
            await api.archive(archive.id, archive.version, reason);
            setArchive(undefined);
            setNotice(
              "Media archived; its metadata and audit trail were retained.",
            );
            await load();
          } catch (error) {
            setFailure(readable(error));
          } finally {
            setBusy(false);
          }
        }}
      />
      {permissions.includes("media.upload") && (
        <section aria-labelledby="media-upload">
          <h2 id="media-upload">Upload Job media</h2>
          <div className="media-form">
            <label>
              Visit/check-in date
              <input
                type="date"
                value={query.visitDate}
                onChange={(e) => {
                  setSelectedJob(undefined);
                  setCategory("");
                  go({
                    ...query,
                    visitDate: e.target.value,
                    jobId: "",
                    page: 1,
                  });
                }}
              />
            </label>
            <label>
              Search matching Jobs
              <input
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
              />
            </label>
            <button type="button" onClick={() => void loadJobs()}>
              Search Jobs
            </button>
            <label>
              Job
              <select
                value={selectedJob?.id ?? ""}
                onChange={(e) => {
                  const job = jobs.find((item) => item.id === e.target.value);
                  setSelectedJob(job);
                  setCategory(job?.allowedCategories[0] ?? "");
                }}
              >
                <option value="">Choose a Job</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.jobNumber} · {job.registration} · {job.customerName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Upload category
              <select
                value={category}
                disabled={!selectedJob}
                onChange={(e) => setCategory(e.target.value as MediaCategory)}
              >
                <option value="">Choose category</option>
                {MEDIA_CATEGORIES.filter((item) =>
                  selectedJob?.allowedCategories.includes(item),
                ).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Label
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                maxLength={200}
              />
            </label>
            <label>
              File
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0])}
              />
            </label>
            <button
              disabled={
                busy || !selectedJob || !category || !label.trim() || !file
              }
              onClick={() => void upload()}
            >
              Upload to private quarantine
            </button>
          </div>
          {selectedJob && selectedJob.allowedCategories.length === 0 && (
            <p role="status">
              This Job's lifecycle does not currently accept media uploads.
            </p>
          )}
        </section>
      )}
      <section aria-labelledby="media-list">
        <div className="media-heading">
          <h2 id="media-list">Media for {query.visitDate}</h2>
          <button onClick={() => void load()} disabled={busy}>
            Refresh
          </button>
        </div>
        <div className="media-filters">
          <label>
            Search media
            <input
              value={query.search}
              onChange={(e) => setQuery({ ...query, search: e.target.value })}
            />
          </label>
          <button onClick={() => go({ ...query, page: 1 })}>Search</button>
          <label>
            Branch
            <select
              value={query.branchId}
              onChange={(e) =>
                go({ ...query, branchId: e.target.value, page: 1 })
              }
            >
              <option value="">All permitted branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Filter category
            <select
              value={query.category}
              onChange={(e) =>
                go({ ...query, category: e.target.value as any, page: 1 })
              }
            >
              <option value="">All categories</option>
              {MEDIA_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={query.includeArchived}
              onChange={(e) =>
                go({ ...query, includeArchived: e.target.checked, page: 1 })
              }
            />{" "}
            Include archived
          </label>
        </div>
        {rows.length === 0 ? (
          <p>No media matches this Visit date and filters.</p>
        ) : (
          <ul className="media-grid">
            {rows.map((row) => (
              <li key={row.id}>
                <img src={row.thumbnailDataUrl} alt="" />
                <h3>{row.label}</h3>
                <p>
                  {row.jobNumber} · {row.registration}
                </p>
                <p>
                  <strong>{row.category}</strong> · {row.scanStatus}
                  {row.archived ? " · Archived" : ""}
                </p>
                <div>
                  {permissions.includes("media.download") && row.available && (
                    <>
                      <button onClick={() => void access(row, "view")}>
                        View original
                      </button>
                      <button onClick={() => void access(row, "download")}>
                        Download original
                      </button>
                    </>
                  )}
                  {permissions.includes("media.archive") && !row.archived && (
                    <button onClick={() => setArchive(row)}>Archive</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <nav className="media-pages" aria-label="Media pages">
          <button
            disabled={page.page <= 1}
            onClick={() => go({ ...query, page: page.page - 1 })}
          >
            Previous
          </button>
          <span>
            Page {page.page} of {page.pageCount} · {page.totalCount} items
          </span>
          <button
            disabled={page.page >= page.pageCount}
            onClick={() => go({ ...query, page: page.page + 1 })}
          >
            Next
          </button>
          <label>
            Rows
            <select
              value={query.pageSize}
              onChange={(e) =>
                go({
                  ...query,
                  pageSize: Number(e.target.value) as 25 | 50 | 100,
                  page: 1,
                })
              }
            >
              {[25, 50, 100].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        </nav>
      </section>
    </main>
  );
}
export default function ProductionMediaApp() {
  const [state, setState] = useState<{ auth: MediaAuth; session: any } | null>(
    null,
  );
  const [error, setError] = useState("");
  useEffect(() => {
    void (async () => {
      try {
        const config = await loadAuthConfig();
        let auth: MediaAuth, session;
        if (config.mode === "local") {
          if (!config.allowDemo) throw new Error();
          auth = { mode: "local", identity: "north-admin" };
          session = await createMediaApi(auth).session();
        } else {
          session = await loadWorkshopSession(config);
          if (!session) throw new Error();
          auth = { mode: "cognito", config };
        }
        if (
          !session.membership.permissions.includes("media.page") ||
          !session.membership.permissions.includes("media.read")
        ) {
          setError("You do not have permission to view Media.");
          return;
        }
        setState({ auth, session });
      } catch {
        setError("Sign in with an active WorkshopOS membership to open Media.");
      }
    })();
  }, []);
  if (error)
    return (
      <main>
        <p role="alert">{error}</p>
      </main>
    );
  return state ? (
    <Screen {...state} />
  ) : (
    <main>
      <p role="status">Loading Media…</p>
    </main>
  );
}
