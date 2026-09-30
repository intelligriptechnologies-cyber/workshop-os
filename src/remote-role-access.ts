/** Pure conversion between the Roles & Page Access UI and API permissions. */

export function pagesFromRolePermissions<Page extends string>(permissions: readonly string[], pageKeys: readonly Page[]): Page[] {
  const granted = new Set(permissions);
  return pageKeys.filter((page) => granted.has(`page.${page}.read`));
}

export function permissionsFromPages<Page extends string>(existing: readonly string[] | undefined, pages: readonly Page[]): string[] {
  const retained = existing?.filter((permission) => !permission.startsWith("page.")) ?? [];
  return Array.from(new Set([...retained, ...pages.flatMap((page) => [`page.${page}.read`, `page.${page}.write`])])).sort();
}
