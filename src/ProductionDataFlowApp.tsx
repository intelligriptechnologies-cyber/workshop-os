import { useEffect, useMemo, useState } from "react";

import { loadAuthConfig, loadWorkshopSession } from "./auth";
import {
  createJobsApi,
  JobApiError,
  type JobAuth,
  type JobDataFlow,
} from "./production-jobs-api";
import { ProductionNavigation } from "./ProductionNavigation";
import "./production-work-items.css";

function DataFlowScreen({ auth, session }: { auth: JobAuth; session: any }) {
  const api = useMemo(() => createJobsApi(auth), [auth]);
  const [jobs, setJobs] = useState<
    Array<{
      id: string;
      jobNumber: string;
      checkedInAt: string;
      customerName: string;
      registration: string;
    }>
  >([]);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(
    () => new URLSearchParams(location.search).get("jobId") ?? "",
  );
  const [flow, setFlow] = useState<JobDataFlow>();
  const [error, setError] = useState("");
  const permissions = session.membership.permissions as string[];

  useEffect(() => {
    void api
      .dataFlowJobs(search)
      .then(setJobs)
      .catch((failure) =>
        setError(
          failure instanceof JobApiError
            ? `${failure.message} Reference: ${failure.traceId}`
            : "Jobs could not be loaded.",
        ),
      );
  }, [api, search]);

  useEffect(() => {
    if (!selectedId) {
      setFlow(undefined);
      return;
    }
    const query = new URLSearchParams({ jobId: selectedId });
    history.replaceState({}, "", `${location.pathname}?${query}`);
    void api
      .dataFlow(selectedId)
      .then((result) => {
        setFlow(result);
        setError("");
      })
      .catch((failure) =>
        setError(
          failure instanceof JobApiError
            ? `${failure.message} Reference: ${failure.traceId}`
            : "Data Flow could not be loaded.",
        ),
      );
  }, [api, selectedId]);

  return (
    <main className="v12-work-items">
      <header>
        <a href="/">Back to WorkshopOS</a>
        <h1>Data Flow</h1>
        <p>
          Explain one selected Job across Visit, work, finance, custody,
          documents, and immutable history.
        </p>
        <ProductionNavigation permissions={permissions} />
      </header>
      {error && <p role="alert">{error}</p>}
      <section aria-labelledby="job-selection">
        <h2 id="job-selection">Select the Job to explain</h2>
        <form
          role="search"
          className="v12-list-controls"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchDraft.trim());
          }}
        >
          <label htmlFor="data-flow-search">Search all permitted Jobs</label>
          <input
            id="data-flow-search"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Job ID, customer, or registration"
          />
          <button>Search</button>
          <button
            type="button"
            onClick={() => {
              setSearchDraft("");
              setSearch("");
            }}
          >
            Clear
          </button>
        </form>
        <label htmlFor="data-flow-job">Job</label>
        <select
          id="data-flow-job"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
        >
          <option value="">Choose a permitted historical or current Job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.jobNumber} · {job.registration} · {job.customerName} ·{" "}
              {new Date(job.checkedInAt).toLocaleDateString()}
            </option>
          ))}
        </select>
        {!selectedId && (
          <p className="v12-empty">
            Select a Job above. Data Flow never mixes records or shows an
            unexplained tenant-wide diagram.
          </p>
        )}
      </section>
      {flow && (
        <section aria-labelledby="selected-job-flow">
          <h2 id="selected-job-flow">
            {flow.selectedJob.jobNumber}: {flow.selectedJob.customerName} ·{" "}
            {flow.selectedJob.registration}
          </h2>
          <p>
            Selected Job ID: <code>{flow.selectedJob.id}</code> · Visit ID:{" "}
            <code>{flow.selectedJob.visitId}</code>
          </p>
          <p>
            Current lifecycle: <strong>{flow.lifecycle.displayStage}</strong>
          </p>
          <div className="data-flow-grid">
            {flow.sections.map((section) => (
              <article key={section.key}>
                <h3>{section.label}</h3>
                <p>{section.summary}</p>
                <p>
                  <strong>Why it matters:</strong> {section.relevance}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default function ProductionDataFlowApp() {
  const [ready, setReady] = useState<{ auth: JobAuth; session: any }>();
  const [error, setError] = useState("");
  useEffect(() => {
    void (async () => {
      try {
        const config = await loadAuthConfig();
        let auth: JobAuth;
        let session;
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
          !session.membership.permissions.includes("data-flow.page") ||
          !session.membership.permissions.includes("job.data-flow.read")
        ) {
          setError("You do not have permission to view Job Data Flow.");
          return;
        }
        setReady({ auth, session });
      } catch {
        setError("WorkshopOS could not establish the Data Flow session.");
      }
    })();
  }, []);
  if (error)
    return (
      <main>
        <h1>Data Flow</h1>
        <p role="alert">{error}</p>
      </main>
    );
  if (!ready)
    return (
      <main>
        <p>Loading Data Flow…</p>
      </main>
    );
  return <DataFlowScreen {...ready} />;
}
