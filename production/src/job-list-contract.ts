export const JOB_PAGE_SIZES = [25, 50, 100] as const;
export const JOB_SORTS = [
  "visitDate.desc",
  "visitDate.asc",
  "jobNumber.asc",
  "jobNumber.desc",
] as const;
export const JOB_STAGES = [
  "",
  "APPOINTMENT",
  "CHECK_IN",
  "INSPECTION",
  "ESTIMATE",
  "APPROVED",
  "ACTIVE",
  "QC",
  "BILLING",
  "GATE_VERIFICATION",
  "DELIVERED",
  "CLOSED",
  "CANCELLED",
] as const;
export type JobListQuery = {
  search: string;
  branchId: string;
  visitDate: string;
  stage: (typeof JOB_STAGES)[number];
  sort: (typeof JOB_SORTS)[number];
  page: number;
  pageSize: (typeof JOB_PAGE_SIZES)[number];
};
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number),
    date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}
export function parseJobListQuery(params: URLSearchParams): JobListQuery {
  const page = Number(params.get("page") ?? 1);
  const size = Number(params.get("pageSize") ?? 25);
  const date = params.get("visitDate") ?? "";
  const stage = params.get("stage") ?? "";
  const sort = params.get("sort") ?? "visitDate.desc";
  return {
    search: (params.get("search") ?? "").trim().slice(0, 200),
    branchId: (params.get("branchId") ?? "").trim(),
    visitDate: validDate(date) ? date : "",
    stage: JOB_STAGES.includes(stage as any)
      ? (stage as JobListQuery["stage"])
      : "",
    sort: JOB_SORTS.includes(sort as any)
      ? (sort as JobListQuery["sort"])
      : "visitDate.desc",
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    pageSize: JOB_PAGE_SIZES.includes(size as any)
      ? (size as JobListQuery["pageSize"])
      : 25,
  };
}
export function jobStageLabel(stage: string) {
  return stage === "ACTIVE"
    ? "In Progress"
    : stage
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
