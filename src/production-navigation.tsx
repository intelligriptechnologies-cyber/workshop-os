export type ProductionNavItem = { href: string; label: string; permission: string };

export const PRODUCTION_NAVIGATION: ProductionNavItem[] = [
  { href: "/production/work-items", label: "Work items", permission: "work-items.page" },
  { href: "/production/users", label: "Tenant users", permission: "admin.users.page" },
  { href: "/production/roles", label: "Roles and permissions", permission: "admin.roles.page" },
  { href: "/production/settings", label: "Business Settings", permission: "business-settings.page" },
  { href: "/production/search", label: "Global search", permission: "global-search.page" },
];

export function permittedProductionNavigation(permissions: string[]) {
  const granted = new Set(permissions);
  return PRODUCTION_NAVIGATION.filter((item) => granted.has(item.permission));
}
