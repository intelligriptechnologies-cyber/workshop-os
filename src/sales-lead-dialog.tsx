import { useState, type FormEvent } from "react";
import { Dialog } from "./ui-kit";

export type LeadFormDraft = {
  displayName: string;
  phone: string;
  company: string;
  email: string;
  address: string;
  serviceInterest: string;
  notes: string;
  stage: "NEW" | "QUALIFIED" | "QUOTATION_SENT" | "WON" | "LOST";
  temperature: "HOT" | "WARM" | "COLD";
  followUpDue: string | null;
  siteVisitCompleted: boolean;
  siteVisitDate: string | null;
};

export const blankLeadDraft: LeadFormDraft = {
  displayName: "", phone: "", company: "", email: "", address: "", serviceInterest: "", notes: "",
  stage: "NEW", temperature: "WARM", followUpDue: null, siteVisitCompleted: false, siteVisitDate: null,
};

export function SalesLeadDialog({ lead = blankLeadDraft, editing = false, busy = false, onSave, onClose }: {
  lead?: LeadFormDraft;
  editing?: boolean;
  busy?: boolean;
  onSave: (lead: LeadFormDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(lead);
  const save = (event: FormEvent) => { event.preventDefault(); onSave(draft); };
  const update = (patch: Partial<LeadFormDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const formId = "sales-lead-dialog-form";
  return <Dialog wide title={editing ? "Edit Lead" : "Add Lead"} onClose={onClose} footer={<button className="primary-action" type="submit" form={formId} disabled={busy}>{editing ? "Save Changes" : "Save Lead"}</button>}>
    <form id={formId} className="form-grid" onSubmit={save}>
      <label>Name<input data-dialog-initial-focus required value={draft.displayName} onChange={(event) => update({ displayName: event.target.value })} /></label>
      <label>Phone<input required value={draft.phone} onChange={(event) => update({ phone: event.target.value })} /></label>
      <label>Company<input value={draft.company} onChange={(event) => update({ company: event.target.value })} /></label>
      <label>Email<input type="email" value={draft.email} onChange={(event) => update({ email: event.target.value })} /></label>
      <label>Address<textarea value={draft.address} onChange={(event) => update({ address: event.target.value })} /></label>
      <label>Service interest<input value={draft.serviceInterest} onChange={(event) => update({ serviceInterest: event.target.value })} /></label>
      <label>Stage<select value={draft.stage} onChange={(event) => update({ stage: event.target.value as LeadFormDraft["stage"] })}><option value="NEW">New</option><option value="QUALIFIED">Qualified</option><option value="QUOTATION_SENT">Quotation sent</option><option value="WON">Won</option><option value="LOST">Lost</option></select></label>
      <label>Temperature<select value={draft.temperature} onChange={(event) => update({ temperature: event.target.value as LeadFormDraft["temperature"] })}><option value="HOT">Hot</option><option value="WARM">Warm</option><option value="COLD">Cold</option></select></label>
      <label>Follow-up date<input type="date" value={draft.followUpDue ?? ""} onChange={(event) => update({ followUpDue: event.target.value || null })} /></label>
      <label>Site visit completed<input type="checkbox" checked={draft.siteVisitCompleted} onChange={(event) => update({ siteVisitCompleted: event.target.checked, siteVisitDate: event.target.checked ? draft.siteVisitDate : null })} /></label>
      <label>Site visit date<input type="date" disabled={!draft.siteVisitCompleted} value={draft.siteVisitDate ?? ""} onChange={(event) => update({ siteVisitDate: event.target.value || null })} /></label>
      <label>Notes<textarea value={draft.notes} onChange={(event) => update({ notes: event.target.value })} /></label>
    </form>
  </Dialog>;
}
