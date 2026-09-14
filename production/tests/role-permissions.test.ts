import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_PERMISSION_CATALOG,
  RolePermissionService,
  type RoleDirectory,
  type RolePermissionRepository,
} from "../src/role-permissions.js";
import { ApiError, type AuthenticatedMembership } from "../src/admin-users.js";

const actor: AuthenticatedMembership = {
  id: "admin", identitySubject: "admin-sub", tenantId: "tenant", displayName: "Admin",
  email: "admin@example.com", status: "ACTIVE", roleIds: [], roles: [], branchIds: ["branch"], branches: [],
  permissions: ["admin.roles.page", "role.manage"], version: 1,
};

function repository(): RolePermissionRepository & { directoryValue: RoleDirectory } {
  const directoryValue: RoleDirectory = { roles: [{
    id: "owner", name: "Business Owner/Admin", description: "Protected", permissions: ["role.manage"],
    protected: true, active: true, version: 1, updatedAt: "2026-09-14T00:00:00.000Z",
  }], catalog: DEFAULT_PERMISSION_CATALOG };
  return {
    directoryValue,
    async roleDirectory() { return directoryValue; },
    async createRole(_actor, input) {
      const role = { id: "custom-role", ...input, protected: false, active: true, version: 1, updatedAt: "2026-09-14T00:00:00.000Z" };
      directoryValue.roles.push(role);
      return { role, replay: false };
    },
    async updateRole(_actor, id, input) {
      const current = directoryValue.roles.find((role) => role.id === id)!;
      if (!current) throw new ApiError(404, "ROLE_NOT_FOUND");
      if (current.protected) throw new ApiError(409, "PROTECTED_ROLE");
      const role = { ...current, ...input, version: current.version + 1 };
      directoryValue.roles[directoryValue.roles.indexOf(current)] = role;
      return role;
    },
    async archiveRole(_actor, id) {
      const current = directoryValue.roles.find((role) => role.id === id)!;
      if (!current) throw new ApiError(404, "ROLE_NOT_FOUND");
      if (current.protected) throw new ApiError(409, "PROTECTED_ROLE");
      const role = { ...current, active: false, version: current.version + 1 };
      return { role, replay: false };
    },
  };
}

test("authorized administrators create custom roles from the hierarchical permission catalog", async () => {
  const store = repository();
  const service = new RolePermissionService(store);
  const directory = await service.list(actor, "export");
  assert.deepEqual(directory.catalog.flatMap((group) => group.pages).flatMap((page) => page.actions).map((item) => item.key), ["membership.manage", "customer.export", "vehicle.export", "work-item.export"]);

  const created = await service.create(actor, {
    name: "Workshop Reporter", description: "Can view and export work items",
    permissions: ["work-items.page", "work-item.read", "work-item.export"],
  }, "create-reporter");
  assert.equal(created.role.name, "Workshop Reporter");
  assert.deepEqual(created.role.permissions, ["work-item.export", "work-item.read", "work-items.page"]);

  await assert.rejects(
    () => service.create(actor, { name: "Invalid", permissions: ["secret.unlisted"] }, "invalid-role"),
    (error: ApiError) => error.code === "PERMISSION_INVALID",
  );
});

test("custom role revisions are versioned while protected templates and unauthorized callers are rejected", async () => {
  const store = repository(); const service = new RolePermissionService(store);
  const created = (await service.create(actor, {
    name: "Technician", description: "Views assigned work", permissions: ["work-items.page", "work-item.read"],
  }, "technician-create")).role;
  const revised = await service.update(actor, created.id, {
    name: "Senior Technician", description: "Manages assigned work", version: 1,
    permissions: ["work-items.page", "work-item.read", "work-item.manage"],
  });
  assert.equal(revised.version, 2);
  await assert.rejects(
    () => service.update(actor, "owner", { name: "Weakened", description: "", version: 1, permissions: ["admin.roles.page"] }),
    (error: ApiError) => error.code === "PROTECTED_ROLE",
  );
  await assert.rejects(
    () => service.list({ ...actor, permissions: ["admin.roles.page"] }),
    (error: ApiError) => error.code === "PERMISSION_DENIED",
  );
});
