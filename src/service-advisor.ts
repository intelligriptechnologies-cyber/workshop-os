import type { JobView, MainStatus } from "./types";

export const SERVICE_ACTIVE_JOB_STATUSES: MainStatus[] = ["NEW", "IN_PROGRESS", "HOLD", "COMPLETED"];
export const FOLLOWUP_EDITABLE_JOB_STATUSES: MainStatus[] = ["NEW", "IN_PROGRESS", "COMPLETED"];

export function isServiceActiveJob(view: Pick<JobView, "job">) {
  return SERVICE_ACTIVE_JOB_STATUSES.includes(view.job.main_status);
}

export function canAddServiceFollowup(view: Pick<JobView, "job">) {
  return FOLLOWUP_EDITABLE_JOB_STATUSES.includes(view.job.main_status);
}

export function serviceFollowupStatus(view: Pick<JobView, "followups">) {
  const completed = view.followups.filter((followup) => Boolean(followup.done)).length;
  return view.followups.length > 0 && completed === view.followups.length
    ? `Done(${completed})`
    : `Pending (${completed}/${view.followups.length})`;
}
