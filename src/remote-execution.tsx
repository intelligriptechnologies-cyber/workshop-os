import { useEffect, useMemo, useState } from "react";
import { authenticatedFetch, type CognitoConfig } from "./auth";
import { executionApi, type RemoteAttachment, type RemoteExecution, type RemoteTask } from "./execution-api";

export function RemoteTechnicianWorkspace({ config }: { config: CognitoConfig }) {
  const [tasks, setTasks] = useState<RemoteTask[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [execution, setExecution] = useState<RemoteExecution>();
  const [workNote, setWorkNote] = useState("");
  const [workKind, setWorkKind] = useState<"progress" | "blocker">("progress");
  const [qcLabel, setQcLabel] = useState("");
  const [qcNotes, setQcNotes] = useState<Record<number, string>>({});
  const [caption, setCaption] = useState("");
  const [mediaCategory, setMediaCategory] = useState<RemoteAttachment["category"]>("work_evidence");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const selected = useMemo(() => tasks.find((task) => task.id === selectedId) ?? tasks[0], [tasks, selectedId]);

  const refresh = async () => {
    const next = await executionApi.myTasks(config);
    setTasks(next);
    setSelectedId((previous) => previous && next.some((task) => task.id === previous) ? previous : next[0]?.id);
    const active = next.find((task) => task.id === (selectedId && next.some((item) => item.id === selectedId) ? selectedId : next[0]?.id));
    setExecution(active ? await executionApi.job(config, active.jobId) : undefined);
  };
  useEffect(() => { void refresh().catch((caught) => setError(caught instanceof Error ? caught.message : "EXECUTION_API_FAILED")); }, [config]);
  useEffect(() => { if (selected) void executionApi.job(config, selected.jobId).then(setExecution).catch((caught) => setError(caught instanceof Error ? caught.message : "EXECUTION_API_FAILED")); }, [config, selected?.id]);
  const run = (action: () => Promise<unknown>) => {
    setBusy(true); setError("");
    void action().then(() => refresh()).catch((caught) => setError(caught instanceof Error ? caught.message : "EXECUTION_API_FAILED")).finally(() => setBusy(false));
  };
  const command = (command: "start" | "pause" | "resume" | "complete" | "cancel") => {
    if (!selected) return;
    const reason = command === "pause" || command === "cancel" ? window.prompt("Reason for this task command:") ?? "" : "";
    run(() => executionApi.commandTask(config, selected.id, command, reason));
  };
  const attach = async (file?: File) => {
    if (!selected || !file) return;
    if (!["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type) || file.size > 10 * 1024 * 1024) { setError("Use a JPG, PNG, WEBP, or PDF no larger than 10 MB."); return; }
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    run(() => executionApi.addAttachment(config, selected.jobId, { category: mediaCategory, filename: file.name, contentType: file.type, dataBase64: btoa(binary), caption }));
  };
  const openAttachment = async (attachment: RemoteAttachment) => {
    try {
      const response = await authenticatedFetch(config, attachment.contentPath);
      if (!response.ok) throw new Error("ATTACHMENT_DOWNLOAD_FAILED");
      const url = URL.createObjectURL(await response.blob());
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "ATTACHMENT_DOWNLOAD_FAILED"); }
  };
  return <section className="workspace two-panel" aria-label="Online technician execution">
    <section className="desk-panel store-list-page"><div className="panel-actions"><div><h3>My Tasks</h3><span>Live tenant and branch work. Signed-out mode retains the SQLite demo workspace.</span></div></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="table-wrap"><table><thead><tr><th>Task</th><th>Job</th><th>Status</th></tr></thead><tbody>{tasks.map((task) => <tr key={task.id} aria-selected={selected?.id === task.id}><td><button type="button" className="link-action" onClick={() => setSelectedId(task.id)}>{task.title}</button></td><td>{task.jobId}</td><td>{task.status}</td></tr>)}</tbody></table></div>
    </section>
    <section className="desk-panel">{selected && execution ? <>
      <div className="panel-actions"><div><h3>{selected.title}</h3><span>{execution.job.jobNo} · {execution.job.status} · {selected.status}</span></div><div className="action-row">{selected.status === "PENDING" && <button className="primary-action" disabled={busy} onClick={() => command("start")}>Start</button>}{selected.status === "IN_PROGRESS" && <><button disabled={busy} onClick={() => command("pause")}>Pause</button><button className="primary-action" disabled={busy} onClick={() => command("complete")}>Complete task</button></>}{selected.status === "PAUSED" && <button className="primary-action" disabled={busy} onClick={() => command("resume")}>Resume</button>}</div></div>
      <p>{selected.instructions || "No additional instructions."}</p>
      <section><h4>Work update</h4><div className="form-grid"><label>Type<select value={workKind} onChange={(event) => setWorkKind(event.target.value as typeof workKind)}><option value="progress">Progress</option><option value="blocker">Blocker</option></select></label><label>Update<input value={workNote} onChange={(event) => setWorkNote(event.target.value)} /></label><div className="action-row"><button disabled={busy || !workNote.trim() || !["IN_PROGRESS", "PAUSED"].includes(selected.status)} onClick={() => { run(() => executionApi.updateWork(config, selected.jobId, { taskId: selected.id, body: workNote, kind: workKind })); setWorkNote(""); }}>Record update</button></div></div>
        {execution.updates.map((update) => <p key={update.id}><strong>{update.kind}</strong> · {update.body}</p>)}</section>
      <section><h4>Evidence attachment</h4><div className="form-grid"><label>Category<select value={mediaCategory} onChange={(event) => setMediaCategory(event.target.value as RemoteAttachment["category"])}>{["before_work", "after_work", "work_evidence", "qc_evidence"].map((category) => <option key={category}>{category}</option>)}</select></label><label>Caption<input value={caption} onChange={(event) => setCaption(event.target.value)} /></label><label className="file-upload-button">Attach file<input hidden type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => { void attach(event.target.files?.[0]); event.target.value = ""; }} /></label></div>
        {execution.attachments.map((attachment) => <p key={attachment.id}><button className="link-action" type="button" onClick={() => void openAttachment(attachment)}>{attachment.filename}</button> · {attachment.category}</p>)}</section>
      <section><h4>QC</h4><div className="form-grid"><label>Checklist item<input value={qcLabel} onChange={(event) => setQcLabel(event.target.value)} /></label><div className="action-row"><button disabled={busy || !qcLabel.trim()} onClick={() => { run(() => executionApi.addQcCheck(config, selected.jobId, { label: qcLabel })); setQcLabel(""); }}>Add check</button></div></div>
        {execution.qcChecks.map((check) => <div className="request-line" key={check.id}><strong>{check.label}</strong><span>{check.status}</span><input aria-label={`QC note ${check.label}`} value={qcNotes[check.id] ?? ""} onChange={(event) => setQcNotes({ ...qcNotes, [check.id]: event.target.value })} placeholder="Fail reason or pass note" /><div className="action-row"><button disabled={busy || check.status === "passed"} onClick={() => run(() => executionApi.resultQc(config, check.id, { outcome: "pass", note: qcNotes[check.id] }))}>Pass</button><button className="danger-action" disabled={busy || check.status === "failed" || !(qcNotes[check.id] ?? "").trim()} onClick={() => run(() => executionApi.resultQc(config, check.id, { outcome: "fail", note: qcNotes[check.id] }))}>Fail → rework</button></div></div>)}</section>
    </> : <p className="empty-state">No assigned technician tasks.</p>}</section>
  </section>;
}
