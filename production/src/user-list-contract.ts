export const USER_PAGE_SIZES = [25, 50, 100] as const;
export const USER_STATUSES = ["INVITED", "ACTIVE", "SUSPENDED"] as const;
export const USER_SORTS = ["updatedAt.desc", "updatedAt.asc", "name.asc", "name.desc", "email.asc", "email.desc"] as const;

export type UserListQuery = {
  search: string;
  status: "" | typeof USER_STATUSES[number];
  roleId: string;
  branchId: string;
  sort: typeof USER_SORTS[number];
  page: number;
  pageSize: typeof USER_PAGE_SIZES[number];
};

export const DEFAULT_USER_LIST_QUERY: UserListQuery = {
  search: "", status: "", roleId: "", branchId: "", sort: "updatedAt.desc", page: 1, pageSize: 25,
};

export function parseUserListQuery(params: URLSearchParams): UserListQuery {
  const requestedStatus = params.get("status") ?? "";
  const requestedSort = params.get("sort") ?? DEFAULT_USER_LIST_QUERY.sort;
  const requestedPage = Number(params.get("page") ?? 1);
  const requestedSize = Number(params.get("pageSize") ?? 25);
  return {
    search: (params.get("search") ?? "").trim().slice(0, 200),
    status: USER_STATUSES.includes(requestedStatus as typeof USER_STATUSES[number]) ? requestedStatus as UserListQuery["status"] : "",
    roleId: (params.get("roleId") ?? "").trim(),
    branchId: (params.get("branchId") ?? "").trim(),
    sort: USER_SORTS.includes(requestedSort as UserListQuery["sort"]) ? requestedSort as UserListQuery["sort"] : DEFAULT_USER_LIST_QUERY.sort,
    page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    pageSize: USER_PAGE_SIZES.includes(requestedSize as UserListQuery["pageSize"]) ? requestedSize as UserListQuery["pageSize"] : 25,
  };
}
