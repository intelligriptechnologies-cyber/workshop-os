import { ApiError } from "./admin-users.js";

export const MEDIA_CATEGORIES = [
  "BEFORE",
  "INSPECTION",
  "PROGRESS",
  "AFTER",
] as const;
export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];
export type MediaScanStatus = "PENDING" | "CLEAN" | "INFECTED" | "FAILED";

export type MediaListQuery = {
  search: string;
  branchId: string;
  visitDate: string;
  jobId: string;
  category: MediaCategory | "";
  includeArchived: boolean;
  page: number;
  pageSize: 25 | 50 | 100;
};

export type JobMediaRecord = {
  id: string;
  jobId: string;
  branchId: string;
  jobNumber: string;
  visitDate: string;
  customerName: string;
  registration: string;
  label: string;
  category: MediaCategory;
  fileName: string;
  mimeType: string;
  byteLength: number;
  scanStatus: MediaScanStatus;
  thumbnailDataUrl: string;
  available: boolean;
  archived: boolean;
  version: number;
  createdAt: string;
};

const BEFORE_STAGES = new Set([
  "APPOINTMENT",
  "CHECK_IN",
  "INSPECTION",
  "ESTIMATE",
  "APPROVED",
]);
const AFTER_STAGES = new Set([
  "QC",
  "BILLING",
  "GATE_VERIFICATION",
  "DELIVERED",
]);

export function allowedMediaCategories(stage: string): MediaCategory[] {
  if (BEFORE_STAGES.has(stage)) return ["BEFORE", "INSPECTION"];
  if (stage === "ACTIVE") return ["PROGRESS"];
  if (stage === "QC") return ["PROGRESS", "AFTER"];
  if (AFTER_STAGES.has(stage)) return ["AFTER"];
  return [];
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function parseMediaListQuery(params: URLSearchParams): MediaListQuery {
  const visitDate = (params.get("visitDate") ?? "").trim();
  if (visitDate && !validDate(visitDate))
    throw new ApiError(400, "VISIT_DATE_INVALID");
  const category = (params.get("category") ?? "").toUpperCase();
  if (category && !MEDIA_CATEGORIES.includes(category as MediaCategory))
    throw new ApiError(400, "MEDIA_CATEGORY_INVALID");
  const page = Number(params.get("page") ?? 1);
  const pageSize = Number(params.get("pageSize") ?? 25);
  if (!Number.isSafeInteger(page) || page < 1)
    throw new ApiError(400, "PAGE_INVALID");
  if (![25, 50, 100].includes(pageSize))
    throw new ApiError(400, "PAGE_SIZE_INVALID");
  return {
    search: (params.get("search") ?? "").trim().slice(0, 200),
    branchId: (params.get("branchId") ?? "").trim(),
    visitDate,
    jobId: (params.get("jobId") ?? "").trim(),
    category: category as MediaCategory | "",
    includeArchived: params.get("includeArchived") === "true",
    page,
    pageSize: pageSize as 25 | 50 | 100,
  };
}
