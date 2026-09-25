import { useState } from "react";
import type { Database } from "sql.js";
import {
  addMaterialRowForActor,
  cancelMaterialRowForActor,
  deleteMaterialRowForActor,
  reRequestMaterialRowForActor,
  requestMaterialRowForActor,
  updateMaterialRowForActor,
} from "./db";
import { canManageMaterialRows, filterInventory, materialRowActions, materialRowStatus, overStockWarning, pickerLabel } from "./materials";
import type { InventoryItem, JobView, MaterialRequest, User } from "./types";
import type { Mutate } from "./App";

/** Type-to-select inventory picker; every option shows the stock on hand. */
function InventoryPicker({ inventory, value, onChange, label }: { inventory: InventoryItem[]; value?: number; onChange: (id: number) => void; label: string }) {
  const selected = inventory.find((item) => item.id === value);
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);
  const matches = filterInventory(inventory, selected && query === selected.name ? "" : query).slice(0, 8);
  return <div className="inventory-picker">
    <input aria-label={label} role="combobox" aria-expanded={open} aria-autocomplete="list" value={query} placeholder="Type to search inventory" onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} />
    {open && <ul role="listbox" aria-label={`${label} options`} className="inventory-picker-options">
      {matches.map((item) => <li key={item.id} role="option" aria-selected={item.id === value}><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(item.id); setQuery(item.name); setOpen(false); }}>{pickerLabel(item)}</button></li>)}
      {matches.length === 0 && <li className="empty-state">No matching inventory</li>}
    </ul>}
    {selected && <small className="picker-stock">in stock: {selected.stock_qty} {selected.unit}</small>}
  </div>;
}

function MaterialRow({ row, inventory, editable, actor, mutate }: { row: MaterialRequest; inventory: InventoryItem[]; editable: boolean; actor: User; mutate: Mutate }) {
  const item = inventory.find((candidate) => candidate.id === row.item_id);
  const status = materialRowStatus(row);
  const actions = editable ? materialRowActions(row) : [];
  const [editing, setEditing] = useState(false);
  const [itemId, setItemId] = useState(row.item_id);
  const [qty, setQty] = useState(row.requested_qty);
  const [error, setError] = useState("");
  const live = status !== "Cancelled" && status !== "Issued";
  const shownItem = editing ? inventory.find((candidate) => candidate.id === itemId) : item;
  const warning = live ? overStockWarning(editing ? qty : row.requested_qty, shownItem?.stock_qty ?? 0) : undefined;
  const run = (action: (db: Database) => unknown) => { setError(""); return mutate((db) => { action(db); }, setError); };
  const canEditFields = editing && (actions.includes("edit") || actions.includes("re-request"));
  const isDraft = actions.includes("edit");
  return <li className="material-row" data-status={status}>
    <div className="material-row-main">
      {canEditFields ? <>
        <InventoryPicker inventory={inventory} value={itemId} onChange={setItemId} label="Material item" />
        <input aria-label="Material quantity" type="number" min="0.01" step="0.01" value={qty} onChange={(event) => setQty(Number(event.target.value))} />
      </> : <><strong>{item?.name ?? `Item ${row.item_id}`}</strong><span>{row.requested_qty} {item?.unit ?? ""}</span><small>in stock: {item?.stock_qty ?? 0}</small></>}
      <span className={`status-badge material-status material-status-${status.toLowerCase()}`}>{status}</span>
    </div>
    {warning && <p className="permission-note material-warning" role="status">Warning: {warning}</p>}
    {error && <p className="error-text" role="alert">{error}</p>}
    {actions.length > 0 && <div className="action-row">
      {canEditFields
        ? <>
          <button type="button" className="primary-action" onClick={() => { if (run((db) => isDraft ? updateMaterialRowForActor(db, row.id, actor.id, itemId, qty) : reRequestMaterialRowForActor(db, row.id, actor.id, itemId, qty))) setEditing(false); }}>{isDraft ? "Save row" : "Save and Re-request"}</button>
          <button type="button" onClick={() => { setEditing(false); setItemId(row.item_id); setQty(row.requested_qty); setError(""); }}>Cancel edit</button>
        </>
        : <>
          {(isDraft || actions.includes("re-request")) && <button type="button" onClick={() => setEditing(true)}>{isDraft ? "Edit" : "Edit and Re-request"}</button>}
          {actions.includes("request") && <button type="button" className="primary-action" onClick={() => run((db) => requestMaterialRowForActor(db, row.id, actor.id))}>Request</button>}
          {actions.includes("cancel") && <button type="button" className="danger-action" onClick={() => run((db) => cancelMaterialRowForActor(db, row.id, actor.id))}>Cancel request</button>}
          {actions.includes("delete") && <button type="button" className="danger-action" onClick={() => run((db) => deleteMaterialRowForActor(db, row.id, actor.id))}>Delete</button>}
        </>}
    </div>}
  </li>;
}

export function JobMaterialsPanel({ view, inventory, actor, mutate }: { view: JobView; inventory: InventoryItem[]; actor: User; mutate: Mutate }) {
  const editable = canManageMaterialRows(actor, view.job);
  const [itemId, setItemId] = useState<number>();
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const rows = view.material_requests;
  const add = () => {
    if (itemId === undefined) { setError("Choose an inventory item."); return; }
    setError("");
    if (mutate((db) => { addMaterialRowForActor(db, view.job.id, actor.id, itemId, qty); }, setError)) { setItemId(undefined); setQty(1); }
  };
  return <section className="editor-block job-card-materials" aria-label="Job materials">
    {editable && <div className="material-add"><InventoryPicker key={rows.length} inventory={inventory} value={itemId} onChange={setItemId} label="Add material item" /><input aria-label="Add material quantity" type="number" min="0.01" step="0.01" value={qty} onChange={(event) => setQty(Number(event.target.value))} /><button type="button" className="primary-action" onClick={add}>Add row</button></div>}
    {error && <p className="error-text" role="alert">{error}</p>}
    {!editable && <p className="permission-note">Read only. Material rows change only while the job card is IN_PROGRESS, by the Owner or the linked Service Advisor.</p>}
    {rows.length === 0 ? <p className="empty-state">No material rows yet.</p> : <ul className="material-rows" aria-label="Material rows">{rows.map((row) => <MaterialRow key={`${row.id}-${row.status}-${row.requested_qty}-${row.item_id}`} row={row} inventory={inventory} editable={editable} actor={actor} mutate={mutate} />)}</ul>}
  </section>;
}
