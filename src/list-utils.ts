import type { PagedResult } from "./types";

export function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function clampPage(page: number, totalCount: number, pageSize: number) {
  const pageCount = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));
  return Math.min(Math.max(1, page), pageCount);
}

export function paginate<T>(items: T[], requestedPage: number, pageSize: number): PagedResult<T> {
  const safeSize = Math.max(1, pageSize);
  const page = clampPage(requestedPage, items.length, safeSize);
  const start = (page - 1) * safeSize;
  const visible = items.slice(start, start + safeSize);
  return {
    items: visible,
    totalCount: items.length,
    pageCount: Math.max(1, Math.ceil(items.length / safeSize)),
    page,
    from: items.length === 0 ? 0 : start + 1,
    to: items.length === 0 ? 0 : start + visible.length,
  };
}

export function pageNumbers(page: number, pageCount: number) {
  const first = Math.max(1, Math.min(page - 2, pageCount - 4));
  return Array.from({ length: Math.min(5, pageCount) }, (_, index) => first + index);
}

export function activeFilterSummary(filters: Record<string, string>, ignoredValues = ["", "ALL"]) {
  return Object.entries(filters)
    .filter(([, value]) => !ignoredValues.includes(value))
    .map(([label, value]) => `${label}: ${value}`);
}
