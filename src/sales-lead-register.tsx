import { useState } from "react";
import type { Lead, LeadStage } from "./sales-api";
import type { LeadFormDraft } from "./sales-lead-dialog";
import type { ExportReport } from "./ui-kit";

export const leadStages: Array<{ value: LeadStage; label: string }> = [
  { value: "NEW", label: "New" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "QUOTATION_SENT", label: "Quotation sent" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
];

export const leadDraft = (lead: Lead): LeadFormDraft => ({
  displayName: lead.displayName, phone: lead.phone, company: lead.company,
  companyNotEntered: lead.companyNotEntered, email: lead.email,
  emailNotEntered: lead.emailNotEntered, address: lead.address,
  serviceInterest: lead.serviceInterest, notes: lead.notes, stage: lead.stage,
  temperature: lead.temperature, followUpDue: lead.followUpDue,
  siteVisitCompleted: lead.siteVisitCompleted, siteVisitDate: lead.siteVisitDate,
});

export function filterSalesLeads(leads: Lead[], query: string, stage: LeadStage | "", createdMonth = ""): Lead[] {
  const normalizedQuery = query.trim().toLowerCase();
  return leads.filter((lead) =>
    (!normalizedQuery || `${lead.displayName} ${lead.company} ${lead.phone}`.toLowerCase().includes(normalizedQuery))
    && (!stage || lead.stage === stage)
    && (!createdMonth || lead.createdAt.startsWith(createdMonth)),
  );
}

export function leadFilterQuery(query: string, stage: LeadStage | "", createdMonth = ""): string {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (stage) params.set("stage", stage);
  if (createdMonth) params.set("month", createdMonth);
  const value = params.toString();
  return value ? `?${value}` : "";
}

function monthYearLabel(month: string) {
  const date = new Date(`${month}-01T00:00:00`);
  return Number.isNaN(date.valueOf()) ? month : date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export function salesLeadsReport(leads: Lead[], createdMonth: string, query = "", stage: LeadStage | "" = ""): ExportReport<Lead> {
  return {
    title: "Sales leads register",
    filters: [
      ...(query ? [`Search: ${query}`] : []),
      ...(stage ? [`Status: ${leadStages.find((option) => option.value === stage)?.label ?? stage}`] : []),
      ...(createdMonth ? [`Created month/year: ${monthYearLabel(createdMonth)}`] : []),
    ],
    columns: [
      { header: "Lead", value: (lead) => lead.displayName },
      { header: "Company", value: (lead) => lead.companyNotEntered ? "Not entered" : lead.company || "—" },
      { header: "Phone", value: (lead) => lead.phone },
      { header: "Email", value: (lead) => lead.emailNotEntered ? "Not entered" : lead.email || "—" },
      { header: "Stage", value: (lead) => lead.stage },
      { header: "Temperature", value: (lead) => lead.temperature },
      { header: "Follow-up", value: (lead) => lead.followUpDue || "—" },
      { header: "Site visit", value: (lead) => lead.siteVisitCompleted ? "Yes" : "No" },
      { header: "Created", value: (lead) => lead.createdAt.slice(0, 10) },
    ],
    rows: leads,
  };
}

export function SalesLeadFilterBar({ query, stage, createdMonth, busy, onQueryChange, onStageChange, onCreatedMonthChange, onApply, onClear }: {
  query: string;
  stage: LeadStage | "";
  createdMonth: string;
  busy?: boolean;
  onQueryChange: (query: string) => void;
  onStageChange: (stage: LeadStage | "") => void;
  onCreatedMonthChange: (month: string) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return <div className="sales-lead-filter-row sales-crm-filter">
    <label className="list-search">Search leads
      <input value={query} onChange={(event) => onQueryChange(event.target.value)} onKeyDown={(event) => {
        if (event.key === "Enter") { event.preventDefault(); onApply(); }
      }} placeholder="Name, company, or phone" />
    </label>
    <label>Status
      <select aria-label="Lead status filter" value={stage} onChange={(event) => onStageChange(event.target.value as LeadStage | "")}>
        <option value="">All statuses</option>
        {leadStages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
    <label>Created month/year
      <input type="month" value={createdMonth} onChange={(event) => onCreatedMonthChange(event.target.value)} />
    </label>
    <button type="button" onClick={onApply} disabled={busy}>Apply</button>
    <button type="button" onClick={onClear} disabled={busy}>Clear</button>
  </div>;
}

export function SalesLeadRegister({ leads, busy = false, onEdit, onSave }: {
  leads: Lead[];
  busy?: boolean;
  onEdit: (lead: Lead) => void;
  onSave: (lead: Lead, draft: LeadFormDraft) => Promise<boolean>;
}) {
  const [drafts, setDrafts] = useState<Record<number, LeadFormDraft>>({});
  const [dirtyIds, setDirtyIds] = useState<Set<number>>(() => new Set());
  const [savingIds, setSavingIds] = useState<Set<number>>(() => new Set());
  const update = (lead: Lead, patch: Partial<LeadFormDraft>) => {
    setDrafts((current) => ({ ...current, [lead.id]: { ...(current[lead.id] ?? leadDraft(lead)), ...patch } }));
    setDirtyIds((current) => new Set(current).add(lead.id));
  };
  const cancel = (id: number) => {
    setDrafts((current) => { const next = { ...current }; delete next[id]; return next; });
    setDirtyIds((current) => { const next = new Set(current); next.delete(id); return next; });
  };
  const save = async (lead: Lead) => {
    const draft = drafts[lead.id] ?? leadDraft(lead);
    setSavingIds((current) => new Set(current).add(lead.id));
    try {
      if (await onSave(lead, draft)) cancel(lead.id);
    } finally {
      setSavingIds((current) => { const next = new Set(current); next.delete(lead.id); return next; });
    }
  };
  return <div className="table-wrap sales-crm-table"><table aria-label="Sales leads"><thead><tr><th>Lead</th><th>Contact</th><th>Stage</th><th>Temperature</th><th>Follow-up</th><th>Site visit</th><th>Actions</th></tr></thead><tbody>{leads.map((item) => {
    const draft = drafts[item.id] ?? leadDraft(item); const dirty = dirtyIds.has(item.id); const disabled = busy || savingIds.has(item.id);
    return <tr key={item.id} className={`sales-temperature-${draft.temperature.toLowerCase()}`}><td><strong>{item.displayName}</strong><br />{item.companyNotEntered ? "Not entered" : item.company || "—"}</td><td>{item.phone}<br />{item.emailNotEntered ? "Not entered" : item.email || "—"}</td><td><select aria-label={`Stage for ${item.displayName}`} disabled={disabled} value={draft.stage} onChange={(event) => update(item, { stage: event.target.value as LeadFormDraft["stage"] })}>{leadStages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></td><td><select aria-label={`Temperature for ${item.displayName}`} disabled={disabled} value={draft.temperature} onChange={(event) => update(item, { temperature: event.target.value as LeadFormDraft["temperature"] })}><option value="HOT">Hot</option><option value="WARM">Warm</option><option value="COLD">Cold</option></select></td><td><input aria-label={`Follow-up for ${item.displayName}`} disabled={disabled} type="date" value={draft.followUpDue ?? ""} onChange={(event) => update(item, { followUpDue: event.target.value || null })} /></td><td><select aria-label={`Site visit for ${item.displayName}`} disabled={disabled} value={draft.siteVisitCompleted ? "yes" : "no"} onChange={(event) => update(item, { siteVisitCompleted: event.target.value === "yes", siteVisitDate: event.target.value === "yes" ? draft.siteVisitDate : null })}><option value="yes">Yes</option><option value="no">No</option></select></td><td><div className="grid-actions"><button type="button" disabled={disabled} onClick={() => onEdit(item)}>Edit</button>{dirty && <><button type="button" className="primary-action" disabled={disabled} onClick={() => void save(item)}>Save</button><button type="button" disabled={disabled} onClick={() => cancel(item.id)}>Cancel</button></>}</div></td></tr>;
  })}</tbody></table>{!leads.length && <p className="empty-state">No leads match these filters.</p>}</div>;
}
