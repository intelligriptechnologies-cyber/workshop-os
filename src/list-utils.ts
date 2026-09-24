import type { PagedResult } from "./types";

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

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
  const safePageCount = Math.max(1, pageCount);
  const currentPage = Math.min(Math.max(1, page), safePageCount);

  if (safePageCount <= 7) {
    return Array.from({ length: safePageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", safePageCount] as const;
  }

  if (currentPage >= safePageCount - 3) {
    return [1, "ellipsis", ...Array.from({ length: 5 }, (_, index) => safePageCount - 4 + index)] as const;
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", safePageCount] as const;
}

export function activeFilterSummary(filters: Record<string, string>, ignoredValues = ["", "ALL"]) {
  return Object.entries(filters)
    .filter(([, value]) => !ignoredValues.includes(value))
    .map(([label, value]) => `${label}: ${value}`);
}

export interface FilterDraftState<T> {
  draft: T;
  applied: T;
  page: number;
}

export function applyFilterDraft<T>({ draft }: FilterDraftState<T>): FilterDraftState<T> {
  return { draft, applied: draft, page: 1 };
}

export function clearFilterDraft<T>(_state: FilterDraftState<T>, empty: T): FilterDraftState<T> {
  return { draft: empty, applied: empty, page: 1 };
}
