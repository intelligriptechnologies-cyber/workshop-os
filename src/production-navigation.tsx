export type ProductionNavItem = { href: string; label: string; permission: string };

export const PRODUCTION_NAVIGATION: ProductionNavItem[] = [
  { href: "/production/work-items", label: "Work items", permission: "work-items.page" },
  { href: "/production/users", label: "Tenant users", permission: "admin.users.page" },
  { href: "/production/roles", label: "Roles and permissions", permission: "admin.roles.page" },
  { href: "/production/settings", label: "Business Settings", permission: "business-settings.page" },
  { href: "/production/customers", label: "Customers", permission: "customers.page" },
  { href: "/production/vehicles", label: "Vehicles", permission: "vehicles.page" },
  { href: "/production/inventory", label: "Inventory", permission: "inventory.page" },
  { href: "/production/jobs", label: "Jobs", permission: "jobs.page" },
  { href: "/production/media", label: "Media", permission: "media.page" },
  { href: "/production/estimates", label: "Estimates", permission: "estimates.page" },
  { href: "/production/tasks", label: "Tasks", permission: "tasks.page" },
  { href: "/production/qc", label: "Quality control", permission: "qc.page" },
  { href: "/production/billing", label: "Billing and delivery", permission: "billing.page" },
  { href: "/production/data-flow", label: "Data Flow", permission: "data-flow.page" },
  { href: "/production/search", label: "Global search", permission: "global-search.page" },
];

export function permittedProductionNavigation(permissions: string[]) {
  const granted = new Set(permissions);
  return PRODUCTION_NAVIGATION.filter((item) => granted.has(item.permission));
}
