export const WORK_ITEM_PAGE_SIZES = [25, 50, 100] as const;
export const WORK_ITEM_SORTS = ["updatedAt.desc", "updatedAt.asc", "summary.asc", "summary.desc"] as const;

export type WorkItemSort = typeof WORK_ITEM_SORTS[number];
export type ServerListQuery = {
  search: string;
  branchId: string;
  sort: WorkItemSort;
  page: number;
  pageSize: typeof WORK_ITEM_PAGE_SIZES[number];
};

export const DEFAULT_WORK_ITEM_QUERY: ServerListQuery = {
  search: "", branchId: "", sort: "updatedAt.desc", page: 1, pageSize: 25,
};

export function parseListQuery(params: URLSearchParams): ServerListQuery {
  const requestedPage = Number(params.get("page") ?? DEFAULT_WORK_ITEM_QUERY.page);
  const requestedSize = Number(params.get("pageSize") ?? DEFAULT_WORK_ITEM_QUERY.pageSize);
  const requestedSort = params.get("sort") ?? DEFAULT_WORK_ITEM_QUERY.sort;
  return {
    search: (params.get("search") ?? "").trim().slice(0, 200),
    branchId: (params.get("branchId") ?? "").trim(),
    sort: WORK_ITEM_SORTS.includes(requestedSort as WorkItemSort) ? requestedSort as WorkItemSort : DEFAULT_WORK_ITEM_QUERY.sort,
    page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    pageSize: WORK_ITEM_PAGE_SIZES.includes(requestedSize as ServerListQuery["pageSize"])
      ? requestedSize as ServerListQuery["pageSize"]
      : DEFAULT_WORK_ITEM_QUERY.pageSize,
  };
}
