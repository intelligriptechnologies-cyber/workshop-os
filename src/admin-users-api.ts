import { authenticatedFetch, type CognitoConfig } from "./auth";

export type AdminRole = {
  id: string; name: string; description?: string; status?: "ACTIVE" | "ARCHIVED";
  systemKey?: string | null; permissions: string[]; version?: number; createdAt?: string; updatedAt?: string;
};
export type AdminBranch = { id: string; name: string };
export type AdminUser = {
  id: string; name: string; email: string; status: "INVITED" | "ACTIVE" | "ARCHIVED";
  roleIds: string[]; roles: AdminRole[]; branchIds: string[]; branches: AdminBranch[];
  version: number; invitedAt?: string; lastInvitedAt?: string; createdAt: string; updatedAt: string;
};
export type ServiceDepartment = {
  id: string; branchId: string; branchName: string; name: string; status: "ACTIVE" | "ARCHIVED";
  managers: Array<{ membershipId: string; userId: string; name: string }>;
  advisorTeams: Array<{ managerMembershipId: string; managerUserId: string; managerName: string; advisorMembershipId: string; advisorUserId: string; advisorName: string }>;
  createdAt: string; updatedAt: string;
};
export type AdminDirectory = { users: AdminUser[]; roles: AdminRole[]; branches: AdminBranch[]; serviceDepartments: ServiceDepartment[] };

export class AdminApiError extends Error {
  constructor(readonly code: string) { super(code); }
}

async function request<T>(config: CognitoConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(config, path, init);
  const payload = await response.json() as T & { code?: string };
  if (!response.ok) throw new AdminApiError(payload.code ?? "API_FAILED");
  return payload;
}

export const adminUsersApi = {
  list: (config: CognitoConfig) => request<AdminDirectory>(config, "/api/v1/admin/users"),
  create: (config: CognitoConfig, input: { name: string; email: string; roleIds: string[]; branchIds: string[] }) =>
    request<{ user: AdminUser }>(config, "/api/v1/admin/users", {
      method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify(input),
    }),
  update: (config: CognitoConfig, user: AdminUser) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${user.id}`, {
    method: "PATCH", headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: user.name, roleIds: user.roleIds, branchIds: user.branchIds, version: user.version }),
  }),
  archive: (config: CognitoConfig, id: string, reason: string) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${id}/archive`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reason }),
  }),
  resend: (config: CognitoConfig, id: string) => request<{ user: AdminUser }>(config, `/api/v1/admin/users/${id}/resend-invite`, { method: "POST" }),
  listServiceDepartments: (config: CognitoConfig) => request<{ serviceDepartments: ServiceDepartment[] }>(config, "/api/v1/admin/service-departments"),
  createServiceDepartment: (config: CognitoConfig, input: { branchId: string; name: string }) => request<{ serviceDepartment: ServiceDepartment }>(config, "/api/v1/admin/service-departments", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }),
  updateServiceDepartment: (config: CognitoConfig, id: string, input: { name: string; status: "ACTIVE" | "ARCHIVED" }) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }),
  appointManager: (config: CognitoConfig, departmentId: string, membershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${membershipId}`, { method: "PUT" }),
  removeManager: (config: CognitoConfig, departmentId: string, membershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${membershipId}`, { method: "DELETE" }),
  assignAdvisorTeam: (config: CognitoConfig, departmentId: string, managerMembershipId: string, advisorMembershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${managerMembershipId}/advisors/${advisorMembershipId}`, { method: "PUT" }),
  removeAdvisorTeam: (config: CognitoConfig, departmentId: string, managerMembershipId: string, advisorMembershipId: string) => request<{ serviceDepartment: ServiceDepartment }>(config, `/api/v1/admin/service-departments/${departmentId}/managers/${managerMembershipId}/advisors/${advisorMembershipId}`, { method: "DELETE" }),
};

export const adminRolesApi = {
  list: (config: CognitoConfig) => request<{ roles: AdminRole[] }>(config, "/api/v1/admin/roles"),
  create: (config: CognitoConfig, input: { name: string; description: string; permissions: string[] }) =>
    request<{ role: AdminRole }>(config, "/api/v1/admin/roles", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input),
    }),
  update: (config: CognitoConfig, role: Required<Pick<AdminRole, "id" | "name" | "version">> & { description: string; permissions: string[] }) =>
    request<{ role: AdminRole }>(config, `/api/v1/admin/roles/${role.id}`, {
      method: "PATCH", headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: role.name, description: role.description, permissions: role.permissions, version: role.version }),
    }),
  archive: (config: CognitoConfig, id: string, reason: string) => request<{ role: AdminRole }>(config, `/api/v1/admin/roles/${id}/archive`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reason }),
  }),
};
