import type { JobView, MainStatus } from "./types";

export const SERVICE_ACTIVE_JOB_STATUSES: MainStatus[] = ["NEW", "IN_PROGRESS", "HOLD", "COMPLETED"];

export function isServiceActiveJob(view: Pick<JobView, "job">) {
  return SERVICE_ACTIVE_JOB_STATUSES.includes(view.job.main_status);
}

export function serviceFollowupStatus(view: Pick<JobView, "followups">) {
  return view.followups.length > 0 && view.followups.every((followup) => Boolean(followup.done)) ? "Done" : "Pending";
}
