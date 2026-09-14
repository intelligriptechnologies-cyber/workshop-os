import assert from "node:assert/strict";
import test from "node:test";

import { ApiError, type AuthenticatedMembership } from "../src/admin-users.js";
import { BusinessSettingsService, type BusinessSettingsRepository, type SettingsWorkspace } from "../src/business-settings.js";

const actor: AuthenticatedMembership = {
  id: "member-1", identitySubject: "subject-1", tenantId: "tenant-1", displayName: "Owner", email: "owner@example.test",
  status: "ACTIVE", roleIds: [], roles: [], branchIds: ["branch-1"], branches: [{ id: "branch-1", name: "Delhi" }],
  permissions: ["business-settings.page", "business-settings.manage", "work-item.manage"], version: 1,
};

const workspace: SettingsWorkspace = {
  scope: { kind: "BRANCH", branchId: "branch-1", branchName: "Delhi" }, draftVersion: 2, publishedVersion: 3,
  inherited: { defaultLaborRateMinor: 150000, defaultJobDurationMinutes: 60, customerUpdatesEnabled: true, invoiceFooter: "Thank you" },
  overrides: { defaultJobDurationMinutes: 90 },
  effective: { defaultLaborRateMinor: 150000, defaultJobDurationMinutes: 90, customerUpdatesEnabled: true, invoiceFooter: "Thank you" },
  updatedAt: "2026-09-14T00:00:00.000Z",
};

const repository: BusinessSettingsRepository = {
  workspace: async () => workspace,
  saveDraft: async (_actor, _branchId, input) => ({ ...workspace, draftVersion: input.version + 1, overrides: input.values, effective: { ...workspace.inherited, ...input.values } }),
  publish: async () => ({ ...workspace, publishedVersion: 4 }),
  snapshotWorkItem: async () => ({ workItemId: "work-1", tenantVersion: 5, branchVersion: 4, values: workspace.effective, capturedAt: "2026-09-14T00:00:00.000Z" }),
};

async function rejectsCode(action: () => Promise<unknown>, code: string) {
  await assert.rejects(action, (error: unknown) => error instanceof ApiError && error.code === code);
}

test("branch settings expose inheritance, validate drafts, and reset selected values to inherited", async () => {
  const service = new BusinessSettingsService(repository);
  assert.equal((await service.get(actor, "branch-1")).effective.defaultJobDurationMinutes, 90);
  await rejectsCode(() => service.save(actor, "branch-1", { version: 2, values: { defaultJobDurationMinutes: 4 } }), "SETTINGS_INVALID");
  const reset = await service.save(actor, "branch-1", { version: 2, values: {} });
  assert.equal(reset.effective.defaultJobDurationMinutes, 60);
});

test("publishing and governed-work snapshots require matching action permissions", async () => {
  const service = new BusinessSettingsService(repository);
  await rejectsCode(() => service.publish({ ...actor, permissions: ["business-settings.page"] }, "branch-1", { version: 2 }, "key"), "PERMISSION_DENIED");
  await rejectsCode(() => service.snapshot({ ...actor, permissions: ["business-settings.page"] }, "work-1", "branch-1", "key"), "PERMISSION_DENIED");
  assert.equal((await service.snapshot(actor, "work-1", "branch-1", "key")).values.defaultJobDurationMinutes, 90);
});
