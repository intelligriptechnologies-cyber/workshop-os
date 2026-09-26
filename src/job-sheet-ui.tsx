import { useState } from "react";
import { updateJobSheetForActor } from "./db";
import { FUEL_LEVELS, parseDamageMarks, PICKUP_DROP_OPTIONS, SERVICE_TYPES } from "./job-sheet";
import type { JobView, User } from "./types";
import type { Mutate } from "./App";

function Row({ label, value }: { label: string; value: string }) {
  return <div className="info-row"><span>{label}</span><strong>{value || "—"}</strong></div>;
}

export function DamageDiagram({ marks, onAdd, onRemove }: { marks: ReturnType<typeof parseDamageMarks>; onAdd?: (x: number, y: number) => void; onRemove?: (id: number) => void }) {
  return (
    <div className="damage-diagram" data-testid="damage-diagram">
      <svg viewBox="0 0 100 200" role="img" aria-label="Vehicle damage diagram, top view" onClick={onAdd ? (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onAdd(((event.clientX - rect.left) / rect.width) * 100, ((event.clientY - rect.top) / rect.height) * 100);
      } : undefined}>
        <rect x="18" y="8" width="64" height="184" rx="26" className="damage-body" />
        <rect x="26" y="40" width="48" height="34" rx="6" className="damage-glass" />
        <rect x="26" y="128" width="48" height="26" rx="6" className="damage-glass" />
        <line x1="18" y1="100" x2="82" y2="100" className="damage-body-line" />
        {marks.filter((mark) => !mark.view).map((mark) => (
          <g key={mark.id} className="damage-mark" data-testid="damage-mark" transform={`translate(${mark.x} ${mark.y * 2})`} onClick={(event) => { event.stopPropagation(); onRemove?.(mark.id); }}>
            <circle r="5" />
            <text textAnchor="middle" dy="2.5">{mark.id}</text>
          </g>
        ))}
      </svg>
      <p className="damage-hint">{onAdd ? "Tap the diagram to mark damage; tap a mark to remove it." : `${marks.length} damage mark${marks.length === 1 ? "" : "s"} recorded.`}</p>
    </div>
  );
}

export function JobSheetSection({ view, actor, mutate, editable = false }: { view: JobView; actor: User; mutate: Mutate; editable?: boolean }) {
  const [draft, setDraft] = useState({
    service_type: view.job.service_type ?? "",
    pickup_drop: view.job.pickup_drop ?? "",
    estimated_delivery: view.job.estimated_delivery ?? "",
    fuel: view.visit.fuel ?? "",
    accessories: view.visit.accessories ?? "",
    engine_no: view.vehicle.engine_no ?? "",
    address: view.customer.address ?? "",
  });
  const [error, setError] = useState("");
  if (!editable) {
    return (
      <section className="editor-block job-sheet" aria-label="Job sheet">
        <h4>Job sheet</h4>
        <div className="snapshot">
          <Row label="Service type" value={view.job.service_type ?? ""} />
          <Row label="Pickup / Drop" value={view.job.pickup_drop ?? ""} />
          <Row label="Estimated delivery" value={view.job.estimated_delivery ?? ""} />
          <Row label="Fuel" value={view.visit.fuel} />
          <Row label="Accessories" value={view.visit.accessories} />
          <Row label="Engine number" value={view.vehicle.engine_no ?? ""} />
          <Row label="Address" value={view.customer.address ?? ""} />
        </div>
      </section>
    );
  }
  const set = (key: keyof typeof draft) => (event: { target: { value: string } }) => setDraft({ ...draft, [key]: event.target.value });
  return (
    <section className="editor-block job-sheet" aria-label="Job sheet">
      <h4>Job sheet</h4>
      <form onSubmit={(event) => { event.preventDefault(); setError(""); mutate((db) => updateJobSheetForActor(db, view.job.id, actor.id, draft), setError); }}>
        <div className="form-grid">
          <label>Service Type<select value={draft.service_type} onChange={set("service_type")}><option value="">—</option>{SERVICE_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Pickup / Drop<select value={draft.pickup_drop} onChange={set("pickup_drop")}><option value="">—</option>{PICKUP_DROP_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Estimated Delivery<input value={draft.estimated_delivery} onChange={set("estimated_delivery")} /></label>
          <label>Fuel<select value={draft.fuel} onChange={set("fuel")}>{[...new Set([draft.fuel, ...FUEL_LEVELS])].filter(Boolean).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Accessories<input value={draft.accessories} onChange={set("accessories")} /></label>
          <label>Engine Number<input value={draft.engine_no} onChange={set("engine_no")} /></label>
        </div>
        <label>Address<input value={draft.address} onChange={set("address")} /></label>
        <button className="primary-action">Save Job Sheet</button>
        {error && <p role="alert" className="form-error">{error}</p>}
      </form>
    </section>
  );
}
