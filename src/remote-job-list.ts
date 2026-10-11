import { jobDeliveryClass } from "./job-delivery-highlight";
import type { RemoteJob } from "./jobs-api";

export type RemoteJobFilters = {
  month: string;
  date: string;
  sort: "newest" | "oldest" | "delivery-soonest" | "delivery-latest";
};

export function filterRemoteJobs(jobs: RemoteJob[], filters: RemoteJobFilters): RemoteJob[] {
  const { month, date, sort } = filters;
  return jobs.filter((job) =>
    (!date || job.estimatedDelivery === date)
    && (!month || job.estimatedDelivery?.slice(0, 7) === month)
  ).sort((a, b) => {
    if (sort === "newest") return b.id - a.id;
    if (sort === "oldest") return a.id - b.id;
    const aDate = a.estimatedDelivery || (sort === "delivery-soonest" ? "9999-12-31" : "");
    const bDate = b.estimatedDelivery || (sort === "delivery-soonest" ? "9999-12-31" : "");
    return (sort === "delivery-soonest" ? aDate.localeCompare(bDate) : bDate.localeCompare(aDate)) || b.id - a.id;
  });
}

export function remoteJobDeliveryClass(job: RemoteJob, today: string): string {
  return jobDeliveryClass({
    estimated_delivery: job.estimatedDelivery ?? undefined,
    main_status: job.status,
    archived_at: job.archivedAt ?? undefined,
  }, today);
}
