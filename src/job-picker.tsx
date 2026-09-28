import { useEffect, useMemo, useState } from "react";
import { normalizeSearch } from "./list-utils";
import type { JobView } from "./types";
import { FilterClearButton } from "./ui-kit";

export type JobPeriod = { monthYear: string };
export function localCalendarDate(now = new Date()) { const offset = now.getTimezoneOffset() * 60_000; return new Date(now.getTime() - offset).toISOString().slice(0, 10); }
export function todayJobPeriod(now = new Date()): JobPeriod { return { monthYear: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}` }; }
export function jobMatchesPeriod(view: JobView, period: JobPeriod) { return period.monthYear === "ALL" || view.visit.received_at.startsWith(period.monthYear); }
export function jobsForPeriod(jobs: JobView[], period: JobPeriod) { return jobs.filter((view) => jobMatchesPeriod(view, period)); }
export function selectedJobRemainsInPeriod(jobs: JobView[], selectedJobId: number | undefined, period: JobPeriod) { return !selectedJobId || jobsForPeriod(jobs, period).some((view) => view.job.id === selectedJobId); }

function monthYearLabel(month: string) { const date = new Date(`${month}-01T00:00:00`); return Number.isNaN(date.valueOf()) ? month : date.toLocaleDateString("en-IN", { month: "long", year: "numeric" }); }
export function JobPicker({ jobs, selectedJobId, onSelect, label = "Select job", period: controlledPeriod, onPeriodChange, onClear, showJobResults = true }: { jobs: JobView[]; selectedJobId?: number; onSelect: (id?: number) => void; label?: string; period?: JobPeriod; onPeriodChange?: (period: JobPeriod) => void; onClear?: () => void; showJobResults?: boolean }) {
  const [localPeriod, setLocalPeriod] = useState<JobPeriod>({ monthYear: "ALL" }); const [query, setQuery] = useState(""); const period = controlledPeriod ?? localPeriod;
  const setPeriod = (next: JobPeriod) => { if (!selectedJobRemainsInPeriod(jobs, selectedJobId, next)) onSelect(undefined); if (controlledPeriod) onPeriodChange?.(next); else setLocalPeriod(next); };
  const reset = () => { const next = { monthYear: "ALL" }; setQuery(""); onSelect(undefined); if (controlledPeriod) onPeriodChange?.(next); else setLocalPeriod(next); onClear?.(); };
  const periodJobs = useMemo(() => jobsForPeriod(jobs, period), [jobs, period]); const needle = normalizeSearch(query);
  const options = periodJobs.filter((view) => !needle || normalizeSearch(`${view.job.job_no} ${view.vehicle.number} ${view.customer.name} ${view.customer.mobile}`).includes(needle)).sort((left, right) => right.visit.received_at.localeCompare(left.visit.received_at) || right.job.id - left.job.id);
  const availableMonths = useMemo(() => Array.from(new Set(jobs.map((view) => view.visit.received_at.slice(0, 7)).filter(Boolean))).sort((left, right) => right.localeCompare(left)), [jobs]);
  useEffect(() => { if (!selectedJobRemainsInPeriod(jobs, selectedJobId, period)) onSelect(undefined); }, [jobs, period, selectedJobId, onSelect]);
  return <div className="job-selector">{showJobResults && <label className="list-search">Search<input type="search" aria-label={`${label} search`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job, vehicle, customer or mobile" /></label>}<label>Month-Year<select aria-label={`${label} Month-Year filter`} value={period.monthYear} onChange={(event) => setPeriod({ monthYear: event.target.value })}><option value="ALL">All months</option>{availableMonths.map((month) => <option key={month} value={month}>{monthYearLabel(month)}</option>)}</select></label>{showJobResults && <label>Matching jobs<select aria-label="Job results" value={selectedJobId ?? ""} onChange={(event) => onSelect(event.target.value ? Number(event.target.value) : undefined)}><option value="">Choose a job</option>{options.map((view) => <option key={view.job.id} value={view.job.id}>{view.job.job_no} · {view.vehicle.number} · {view.customer.name}</option>)}</select></label>}<FilterClearButton onClick={reset} label="Clear filters" />{showJobResults && query && options.length === 0 && <p className="job-picker-empty" role="status">No matching jobs</p>}</div>;
}
