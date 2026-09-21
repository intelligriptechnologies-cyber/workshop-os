import { useEffect, useMemo, useRef, useState } from "react";
import { loadAuthConfig, loadWorkshopSession } from "./auth";
import {
  createOperationalApi,
  OpsApiError,
  type OpsAuth,
} from "./production-estimates-tasks-qc-api";
import { DirtyFormDialog, ReasonCommandDialog } from "./dialog-primitives";
import "./production-work-items.css";

function save(value: { blob: Blob; filename: string }) {
  const u = URL.createObjectURL(value.blob),
    a = document.createElement("a");
  a.href = u;
  a.download = value.filename;
  a.click();
  URL.revokeObjectURL(u);
}
function Screen({ auth, session }: { auth: OpsAuth; session: any }) {
  const api = useMemo(() => createOperationalApi(auth), [auth]),
    kind = location.pathname.split("/").pop()!,
    permissions = session.membership.permissions as string[],
    branches = session.membership.branches as Array<{
      id: string;
      name: string;
    }>;
  const [rows, setRows] = useState<any[]>([]),
    [busy, setBusy] = useState(false),
    [failure, setFailure] = useState(""),
    [notice, setNotice] = useState(""),
    [dialog, setDialog] = useState<any>(),
    [command, setCommand] = useState<any>(),
    [form, setForm] = useState({
      jobId: "",
      branchId: branches[0]?.id ?? "",
      notes: "",
      totalMinor: "",
      validDays: "14",
      customerName: "",
      acknowledgement: "",
      result: "PASS",
      checkKey: "workmanship",
      checkStatus: "PASS",
      checkNotes: "",
      technicianId: "",
      evidenceId: "",
    });
  const first = useRef<HTMLInputElement>(null);
  const requiredPage =
      kind === "estimates"
        ? "estimates.page"
        : kind === "tasks"
          ? "tasks.page"
          : "qc.page",
    readPermission =
      kind === "estimates"
        ? "estimate.read"
        : kind === "tasks"
          ? "task.read"
          : "qc.read";
  const readable = (e: unknown) =>
    e instanceof OpsApiError
      ? `${e.message} Reference: ${e.traceId}`
      : "WorkshopOS could not complete the request.";
  async function load() {
    setBusy(true);
    try {
      const result =
        kind === "estimates"
          ? await api.estimates()
          : kind === "tasks"
            ? await api.tasks()
            : await api.qc();
      setRows(result[kind === "qc" ? "qc" : kind]);
      setFailure("");
    } catch (e) {
      setFailure(readable(e));
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void load();
  }, [kind]);
  async function run(action: () => Promise<any>, message: string) {
    setBusy(true);
    try {
      await action();
      setDialog(undefined);
      setCommand(undefined);
      setNotice(message);
      await load();
    } catch (e) {
      setFailure(readable(e));
    } finally {
      setBusy(false);
    }
  }
  if (
    !permissions.includes(requiredPage) ||
    !permissions.includes(readPermission)
  )
    return (
      <main>
        <p role="alert">
          You do not have permission to view this production screen.
        </p>
      </main>
    );
  const errors =
    dialog?.type === "estimate"
      ? ([
          !form.jobId && "Choose a Job identifier.",
          !/^\d+$/.test(form.totalMinor) &&
            "Enter the total in minor currency units.",
        ].filter(Boolean) as string[])
      : dialog?.type === "approve"
        ? ([
            !form.customerName.trim() && "Enter the approving customer name.",
            !form.acknowledgement.trim() &&
              "Enter the acknowledgement evidence.",
          ].filter(Boolean) as string[])
        : ["qc", "reinspect"].includes(dialog?.type)
          ? ([!form.checkNotes.trim() && "Enter checklist notes."].filter(
              Boolean,
            ) as string[])
          : ["reworkAssign", "taskAssign"].includes(dialog?.type)
            ? ([
                !form.technicianId.trim() &&
                  "Enter a technician membership identifier.",
              ].filter(Boolean) as string[])
            : ["reworkComplete", "taskEvidence"].includes(dialog?.type)
              ? ([
                  !form.evidenceId.trim() &&
                    "Enter a clean Job Media identifier.",
                  dialog?.type === "taskEvidence" &&
                    !form.checkKey.trim() &&
                    "Enter a checklist key.",
                ].filter(Boolean) as string[])
              : [];
  return (
    <main className="production-work-items">
      <header>
        <a href="/">Back to WorkshopOS</a>
        <h1>
          {kind === "estimates"
            ? "Estimates"
            : kind === "tasks"
              ? "Technician Tasks"
              : "Quality control"}
        </h1>
        <p>
          Production PostgreSQL authority with versioned commands and immutable
          evidence.
        </p>

      </header>
      {failure && <p role="alert">{failure}</p>}
      {notice && <p role="status">{notice}</p>}
      <DirtyFormDialog
        open={Boolean(dialog)}
        title={
          dialog?.type === "approve"
            ? "Record Estimate approval"
            : ["qc", "reinspect"].includes(dialog?.type)
              ? "Independent QC inspection"
              : ["reworkAssign", "taskAssign"].includes(dialog?.type)
                ? "Assign technician"
                : dialog?.type === "reworkComplete"
                  ? "Complete rework with evidence"
                  : dialog?.type === "taskEvidence"
                    ? "Add Task evidence"
                    : dialog?.edit
                      ? "Edit draft Estimate"
                      : "Create Estimate version"
        }
        dirty={Boolean(Object.values(form).some(Boolean))}
        errors={errors}
        busy={busy}
        initialFocusRef={first}
        submitLabel="Save"
        onClose={() => setDialog(undefined)}
        onSubmit={(e) => {
          e.preventDefault();
          if (errors.length) return;
          if (dialog.type === "estimate")
            void run(
              () =>
                dialog.edit
                  ? api.updateEstimate(dialog.row.id, {
                      version: dialog.row.version,
                      notes: form.notes,
                      totalMinor: form.totalMinor,
                    })
                  : api.createEstimate({
                      ...form,
                      priorVersionId: dialog.row?.id,
                    }),
              dialog.edit
                ? "Draft Estimate updated."
                : "Estimate version saved.",
            );
          else if (dialog.type === "approve")
            void run(
              () =>
                api.approveEstimate(dialog.row.id, {
                  version: dialog.row.version,
                  customerName: form.customerName,
                  acknowledgement: form.acknowledgement,
                }),
              "Approval evidence and canonical Estimate Approved fact recorded.",
            );
          else if (dialog.type === "qc")
            void run(
              () =>
                api.inspect(dialog.row.taskId, {
                  version: dialog.row.version,
                  result: form.result,
                  reason: form.checkNotes,
                  items: [
                    {
                      key: form.checkKey,
                      status: form.checkStatus,
                      notes: form.checkNotes,
                    },
                  ],
                }),
              "Independent QC decision recorded.",
            );
          else if (dialog.type === "taskAssign")
            void run(
              () =>
                api.task(dialog.row.id, "assign", {
                  version: dialog.row.version,
                  technicianId: form.technicianId,
                }),
              "Task assignment recorded.",
            );
          else if (dialog.type === "taskEvidence")
            void run(
              () =>
                api.task(dialog.row.id, "evidence", {
                  version: dialog.row.version,
                  checklistKey: form.checkKey,
                  evidenceId: form.evidenceId,
                }),
              "Task evidence recorded.",
            );
          else if (dialog.type === "reworkAssign")
            void run(
              () =>
                api.rework(dialog.row.rework.id, "assign", {
                  version: dialog.row.rework.version,
                  reason: "Assigned for failed QC items",
                  technicianId: form.technicianId,
                }),
              "Rework assigned.",
            );
          else if (dialog.type === "reworkComplete")
            void run(
              () =>
                api.rework(dialog.row.rework.id, "completion", {
                  version: dialog.row.rework.version,
                  reason: "Failed items corrected",
                  evidenceId: form.evidenceId,
                }),
              "Rework is ready for independent reinspection.",
            );
          else
            void run(
              () =>
                api.rework(dialog.row.rework.id, "reinspection", {
                  version: dialog.row.rework.version,
                  result: form.result,
                  reason: form.checkNotes,
                  items: [
                    {
                      key: form.checkKey,
                      status: form.checkStatus,
                      notes: form.checkNotes,
                    },
                  ],
                }),
              "Reinspection decision recorded.",
            );
        }}
      >
        {dialog?.type === "estimate" && (
          <>
            <label>
              Branch
              <select
                value={form.branchId}
                onChange={(e) => setForm({ ...form, branchId: e.target.value })}
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Job identifier
              <input
                autoFocus
                ref={first}
                value={form.jobId}
                onChange={(e) => setForm({ ...form, jobId: e.target.value })}
              />
            </label>
            <label>
              Total (minor units)
              <input
                inputMode="numeric"
                value={form.totalMinor}
                onChange={(e) =>
                  setForm({ ...form, totalMinor: e.target.value })
                }
              />
            </label>
            <label>
              Notes
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
          </>
        )}
        {dialog?.type === "approve" && (
          <>
            <label>
              Customer name
              <input
                ref={first}
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
            </label>
            <label>
              Acknowledgement evidence
              <textarea
                value={form.acknowledgement}
                onChange={(e) =>
                  setForm({ ...form, acknowledgement: e.target.value })
                }
              />
            </label>
          </>
        )}
        {dialog?.type === "qc" && (
          <>
            <label>
              Decision
              <select
                value={form.result}
                onChange={(e) => setForm({ ...form, result: e.target.value })}
              >
                <option>PASS</option>
                <option>FAIL</option>
              </select>
            </label>
            <label>
              Checklist item
              <input
                ref={first}
                value={form.checkKey}
                onChange={(e) => setForm({ ...form, checkKey: e.target.value })}
              />
            </label>
            <label>
              Item status
              <select
                value={form.checkStatus}
                onChange={(e) =>
                  setForm({ ...form, checkStatus: e.target.value })
                }
              >
                <option>PASS</option>
                <option>FAIL</option>
                <option>NOT_APPLICABLE</option>
              </select>
            </label>
            <label>
              Inspection notes
              <textarea
                value={form.checkNotes}
                onChange={(e) =>
                  setForm({ ...form, checkNotes: e.target.value })
                }
              />
            </label>
          </>
        )}
        {dialog?.type === "reinspect" && (
          <>
            <label>
              Decision
              <select
                value={form.result}
                onChange={(e) => setForm({ ...form, result: e.target.value })}
              >
                <option>PASS</option>
                <option>FAIL</option>
              </select>
            </label>
            <label>
              Failed checklist item
              <input
                ref={first}
                value={form.checkKey}
                onChange={(e) => setForm({ ...form, checkKey: e.target.value })}
              />
            </label>
            <label>
              Item status
              <select
                value={form.checkStatus}
                onChange={(e) =>
                  setForm({ ...form, checkStatus: e.target.value })
                }
              >
                <option>PASS</option>
                <option>FAIL</option>
              </select>
            </label>
            <label>
              Reinspection notes
              <textarea
                value={form.checkNotes}
                onChange={(e) =>
                  setForm({ ...form, checkNotes: e.target.value })
                }
              />
            </label>
          </>
        )}
        {dialog?.type === "reworkAssign" && (
          <label>
            Technician membership identifier
            <input
              ref={first}
              value={form.technicianId}
              onChange={(e) =>
                setForm({ ...form, technicianId: e.target.value })
              }
            />
          </label>
        )}
        {dialog?.type === "reworkComplete" && (
          <label>
            Clean Job Media identifier
            <input
              ref={first}
              value={form.evidenceId}
              onChange={(e) => setForm({ ...form, evidenceId: e.target.value })}
              placeholder="Media UUID"
            />
          </label>
        )}
        {dialog?.type === "taskAssign" && (
          <label>
            Technician membership identifier
            <input
              ref={first}
              value={form.technicianId}
              onChange={(e) =>
                setForm({ ...form, technicianId: e.target.value })
              }
            />
          </label>
        )}
        {dialog?.type === "taskEvidence" && (
          <>
            <label>
              Checklist key
              <input
                ref={first}
                value={form.checkKey}
                onChange={(e) => setForm({ ...form, checkKey: e.target.value })}
              />
            </label>
            <label>
              Clean Job Media identifier
              <input
                value={form.evidenceId}
                onChange={(e) =>
                  setForm({ ...form, evidenceId: e.target.value })
                }
                placeholder="Media UUID"
              />
            </label>
          </>
        )}
      </DirtyFormDialog>
      <ReasonCommandDialog
        open={Boolean(command)}
        title={`${command?.action ?? "Task"} task`}
        commandLabel={command?.action ?? "Run"}
        busy={busy}
        onClose={() => setCommand(undefined)}
        onConfirm={(reason) =>
          void run(
            () =>
              api.task(command.row.id, command.action, {
                version: command.row.version,
                reason,
              }),
            `Task ${command.action.toLocaleLowerCase()} recorded.`,
          )
        }
      />
      {kind === "tasks" && rows.length > 0 && (
        <section aria-labelledby="task-controls">
          <h2 id="task-controls">Assignment and evidence</h2>
          {rows.map((row) => (
            <div className="row-actions" key={row.id}>
              {permissions.includes("task.assign") && (
                <button onClick={() => setDialog({ type: "taskAssign", row })}>
                  Assign {row.title}
                </button>
              )}
              {permissions.includes("task.evidence.write") && (
                <button
                  onClick={() => setDialog({ type: "taskEvidence", row })}
                >
                  Add evidence for {row.title}
                </button>
              )}
            </div>
          ))}
        </section>
      )}
      {kind === "qc" && rows.some((row) => row.rework) && (
        <section aria-labelledby="rework-controls">
          <h2 id="rework-controls">Blocking rework</h2>
          {rows
            .filter((row) => row.rework)
            .map((row) => (
              <div className="row-actions" key={row.taskId}>
                {row.rework.status === "BLOCKING" &&
                  permissions.includes("rework.assign") && (
                    <button
                      onClick={() => setDialog({ type: "reworkAssign", row })}
                    >
                      Assign rework for {row.title}
                    </button>
                  )}
                {row.rework.status === "ASSIGNED" &&
                  permissions.includes("rework.execute") && (
                    <button
                      onClick={() => setDialog({ type: "reworkComplete", row })}
                    >
                      Complete rework for {row.title}
                    </button>
                  )}
                {row.rework.status === "READY_FOR_REINSPECTION" &&
                  permissions.includes("qc.inspect") && (
                    <button
                      onClick={() => setDialog({ type: "reinspect", row })}
                    >
                      Reinspect {row.title}
                    </button>
                  )}
              </div>
            ))}
        </section>
      )}
      <section>
        <div className="list-toolbar">
          <h2>{rows.length} records</h2>
          <button onClick={() => void load()} disabled={busy}>
            Refresh
          </button>
          {kind === "estimates" && permissions.includes("estimate.manage") && (
            <button onClick={() => setDialog({ type: "estimate" })}>
              Create Estimate
            </button>
          )}
        </div>
        {!rows.length ? (
          <p>
            No records are available. Refresh or create the first eligible
            record.
          </p>
        ) : (
          <div className="work-item-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Record</th>
                  <th>Status</th>
                  <th>Version</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id ?? row.taskId}>
                    <td>{row.jobNumber}</td>
                    <td>
                      {row.documentNumber ??
                        row.title ??
                        `Estimate revision ${row.revision}`}
                      {row.superseded && " (superseded)"}
                    </td>
                    <td>
                      {row.status}
                      {row.rework && ` · Rework ${row.rework.status}`}
                    </td>
                    <td>{row.version}</td>
                    <td>
                      <div className="row-actions">
                        {kind === "estimates" && (
                          <>
                            {permissions.includes("estimate.manage") && (
                              <button
                                onClick={() => {
                                  setForm({
                                    ...form,
                                    jobId: row.jobId,
                                    branchId: row.branchId,
                                    totalMinor: row.totalMinor,
                                    notes: row.notes,
                                  });
                                  setDialog({
                                    type: "estimate",
                                    row,
                                    edit: row.status === "DRAFT",
                                  });
                                }}
                              >
                                {row.status === "DRAFT"
                                  ? "Edit draft"
                                  : "New version"}
                              </button>
                            )}
                            {row.status === "DRAFT" &&
                              permissions.includes("estimate.submit") && (
                                <button
                                  onClick={() =>
                                    void run(
                                      () =>
                                        api.submitEstimate(row.id, {
                                          version: row.version,
                                          validDays: 14,
                                        }),
                                      "Estimate submitted and frozen.",
                                    )
                                  }
                                >
                                  Submit
                                </button>
                              )}
                            {row.status === "SENT" &&
                              !row.superseded &&
                              permissions.includes("estimate.approve") && (
                                <button
                                  onClick={() =>
                                    setDialog({ type: "approve", row })
                                  }
                                >
                                  Approve
                                </button>
                              )}
                            {[
                              "SENT",
                              "APPROVED",
                              "PARTIALLY_APPROVED",
                            ].includes(row.status) &&
                              permissions.includes(
                                "estimate.document.download",
                              ) && (
                                <button
                                  onClick={() =>
                                    void api
                                      .downloadEstimate(row.id)
                                      .then(save)
                                      .catch((e) => setFailure(readable(e)))
                                  }
                                >
                                  PDF v{row.revision}
                                </button>
                              )}
                          </>
                        )}
                        {kind === "tasks" &&
                          permissions.includes("task.execute") && (
                            <>
                              {row.status === "ASSIGNED" && (
                                <button
                                  onClick={() =>
                                    setCommand({ row, action: "START" })
                                  }
                                >
                                  Start
                                </button>
                              )}
                              {row.status === "IN_PROGRESS" && (
                                <>
                                  <button
                                    onClick={() =>
                                      setCommand({ row, action: "PAUSE" })
                                    }
                                  >
                                    Pause
                                  </button>
                                  <button
                                    onClick={() =>
                                      setCommand({ row, action: "COMPLETE" })
                                    }
                                  >
                                    Complete
                                  </button>
                                </>
                              )}
                              {row.status === "PAUSED" && (
                                <button
                                  onClick={() =>
                                    setCommand({ row, action: "RESUME" })
                                  }
                                >
                                  Resume
                                </button>
                              )}
                              {row.blockedBy?.length > 0 && (
                                <span>
                                  Blocked by {row.blockedBy.length} task(s)
                                </span>
                              )}
                            </>
                          )}
                        {kind === "qc" &&
                          permissions.includes("qc.inspect") &&
                          row.status === "PENDING_QC" && (
                            <button
                              onClick={() => setDialog({ type: "qc", row })}
                            >
                              Inspect
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
export default function ProductionEstimatesTasksQcApp() {
  const [state, setState] = useState<{ auth: OpsAuth; session: any }>(),
    [error, setError] = useState("");
  useEffect(() => {
    void (async () => {
      try {
        const config = await loadAuthConfig();
        let auth: OpsAuth, session;
        if (config.mode === "local") {
          if (!config.allowDemo) throw new Error();
          auth = { mode: "local", identity: "north-admin" };
          session = await createOperationalApi(auth).session();
        } else {
          session = await loadWorkshopSession(config);
          if (!session) throw new Error();
          auth = { mode: "cognito", config };
        }
        setState({ auth, session });
      } catch {
        setError("Sign in with an active WorkshopOS membership.");
      }
    })();
  }, []);
  return state ? (
    <Screen {...state} />
  ) : (
    <main>
      <p role={error ? "alert" : "status"}>{error || "Loading…"}</p>
    </main>
  );
}
