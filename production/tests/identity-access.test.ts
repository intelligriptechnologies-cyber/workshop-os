import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createLocalIdentityAccessSystem } from "../src/identity-access.js";

test("authenticated membership grants only assigned permissions in its branch", () => {
  const system = createLocalIdentityAccessSystem();
  system.testing.seedMembership({
    identityId: "identity-reception-1",
    membershipId: "membership-reception-1",
    tenantId: "tenant-north",
    branchIds: ["branch-delhi"],
    permissions: ["visit.create"],
  });

  const token = system.identityProvider.issueToken("identity-reception-1", {
    authenticatedAt: "2026-09-10T09:00:00.000Z",
    mfa: false,
  });

  assert.deepEqual(
    system.authorize(token, {
      branchId: "branch-delhi",
      permission: "visit.create",
      now: "2026-09-10T09:05:00.000Z",
    }),
    {
      allowed: true,
      identityId: "identity-reception-1",
      membershipId: "membership-reception-1",
      tenantId: "tenant-north",
      branchId: "branch-delhi",
    },
  );
  assert.deepEqual(
    system.authorize(token, {
      branchId: "branch-delhi",
      permission: "payment.reverse",
      now: "2026-09-10T09:05:00.000Z",
    }),
    { allowed: false, code: "PERMISSION_DENIED" },
  );
  assert.deepEqual(
    system.authorize(token, {
      branchId: "branch-jaipur",
      permission: "visit.create",
      now: "2026-09-10T09:05:00.000Z",
    }),
    { allowed: false, code: "BRANCH_FORBIDDEN" },
  );
});

test("platform provisioning is MFA-protected, idempotent, and creates a complete tenant baseline", () => {
  const system = createLocalIdentityAccessSystem();
  system.testing.seedPlatformIdentity("platform-admin-1");
  const token = system.identityProvider.issueToken("platform-admin-1", {
    authenticatedAt: "2026-09-10T10:00:00.000Z",
    mfa: true,
  });
  const command = {
    tenantId: "tenant-ultraguard",
    legalName: "Ultraguard Service Private Limited",
    owner: { identityId: "owner-1", email: "owner@ultraguard.example" },
    branch: { id: "branch-pune", name: "Pune" },
    planId: "growth",
    entitlements: ["workshop", "inventory"],
    quotas: { users: 50, branches: 3 },
    baseCurrency: "INR",
    timezone: "Asia/Kolkata",
    configurationTemplateId: "india-workshop-v1",
  };

  const first = system.provisionTenant(token, command, {
    idempotencyKey: "provision-ultraguard-1",
    requestId: "request-1",
    now: "2026-09-10T10:01:00.000Z",
  });
  const replay = system.provisionTenant(token, command, {
    idempotencyKey: "provision-ultraguard-1",
    requestId: "request-2",
    now: "2026-09-10T10:02:00.000Z",
  });

  assert.equal(first.status, 201);
  assert.equal(replay.status, 200);
  if (!("tenant" in first.body) || !("tenant" in replay.body)) assert.fail("expected provisioned tenant");
  assert.equal(replay.body.auditReference, first.body.auditReference);
  assert.equal(first.body.tenant?.roles.length, 9);
  assert.deepEqual(first.body.tenant?.roles.map((role) => role.name), [
    "Platform Super Admin",
    "Business Owner/Admin",
    "Workshop/Branch Manager",
    "Reception",
    "Service Advisor",
    "Technician",
    "Store",
    "Accounts/Cashier",
    "Gate/Security",
  ]);
  assert.equal(first.body.tenant?.ownerMembership.identityId, "owner-1");
  assert.deepEqual(first.body.tenant?.ownerMembership.branchIds, ["branch-pune"]);
  assert.equal(first.body.tenant?.baseCurrency, "INR");
  assert.equal(first.body.tenant?.timezone, "Asia/Kolkata");
  assert.deepEqual(first.body.tenant?.entitlements, ["workshop", "inventory"]);
  assert.deepEqual(first.body.tenant?.quotas, { users: 50, branches: 3 });
  assert.equal(first.body.tenant?.configurationTemplateId, "india-workshop-v1");
});

test("an individual membership combines role permissions without sharing identity", () => {
  const system = createLocalIdentityAccessSystem();
  const provisioned = system.testing.provisionTenant("tenant-combined", "owner-combined", "branch-one");
  const ownerToken = system.identityProvider.issueToken("owner-combined", {
    authenticatedAt: "2026-09-10T11:00:00.000Z",
    mfa: true,
  });
  const receptionRole = provisioned.roles.find((role) => role.name === "Reception")!;
  const advisorRole = provisioned.roles.find((role) => role.name === "Service Advisor")!;

  const added = system.addMembership(ownerToken, {
    identityId: "employee-1",
    email: "employee-1@example.test",
    branchIds: ["branch-one"],
    roleIds: [receptionRole.id, advisorRole.id],
    additionalPermissions: ["customer.merge"],
  }, { requestId: "request-add-employee-1", now: "2026-09-10T11:01:00.000Z" });

  assert.equal(added.status, 201);
  assert.notEqual(added.body.membership?.identityId, "owner-combined");
  const employeeToken = system.identityProvider.issueToken("employee-1", {
    authenticatedAt: "2026-09-10T11:02:00.000Z",
    mfa: false,
  });
  for (const permission of ["visit.create", "estimate.manage", "customer.merge"]) {
    assert.equal(system.authorize(employeeToken, {
      branchId: "branch-one",
      permission,
      now: "2026-09-10T11:03:00.000Z",
    }).allowed, true);
  }

  const sharedIdentity = system.addMembership(ownerToken, {
    identityId: "shared-counter",
    email: "employee-1@example.test",
    branchIds: ["branch-one"],
    roleIds: [receptionRole.id],
    additionalPermissions: [],
  }, { requestId: "request-shared", now: "2026-09-10T11:04:00.000Z" });
  assert.equal(sharedIdentity.status, 409);
  assert.equal(sharedIdentity.body.code, "INDIVIDUAL_IDENTITY_REQUIRED");
});

test("a registered shared device switches attributable PIN sessions and locks out abuse", () => {
  const system = createLocalIdentityAccessSystem();
  const tenant = system.testing.provisionTenant("tenant-kiosk", "owner-kiosk", "branch-kiosk");
  system.testing.seedMembership({
    identityId: "technician-kiosk",
    membershipId: "membership-technician-kiosk",
    tenantId: tenant.id,
    branchIds: ["branch-kiosk"],
    roleIds: [tenant.roles.find((role) => role.name === "Technician")!.id],
    permissions: ["task.execute"],
  });
  const ownerToken = system.identityProvider.issueToken("owner-kiosk", {
    authenticatedAt: "2026-09-10T12:00:00.000Z",
    mfa: true,
  });
  system.registerSharedDevice(ownerToken, {
    deviceId: "device-bay-1",
    branchId: "branch-kiosk",
    label: "Bay 1 tablet",
  }, { requestId: "register-device-1", now: "2026-09-10T12:01:00.000Z" });
  system.setKioskPin(ownerToken, {
    membershipId: "membership-technician-kiosk",
    pin: "4826",
  }, { requestId: "set-pin-1", now: "2026-09-10T12:02:00.000Z" });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const denied = system.switchKioskUser({
      deviceId: "device-bay-1",
      membershipId: "membership-technician-kiosk",
      pin: "0000",
      now: `2026-09-10T12:0${3 + attempt}:00.000Z`,
      requestId: `bad-pin-${attempt}`,
    });
    assert.equal(denied.status, 401);
  }
  const locked = system.switchKioskUser({
    deviceId: "device-bay-1",
    membershipId: "membership-technician-kiosk",
    pin: "4826",
    now: "2026-09-10T12:06:00.000Z",
    requestId: "locked-pin",
  });
  assert.equal(locked.status, 423);
  assert.equal(locked.body.code, "KIOSK_LOCKED");

  const switched = system.switchKioskUser({
    deviceId: "device-bay-1",
    membershipId: "membership-technician-kiosk",
    pin: "4826",
    now: "2026-09-10T12:21:00.000Z",
    requestId: "good-pin",
  });
  assert.equal(switched.status, 201);
  const decision = system.authorize(String(switched.body.token), {
    branchId: "branch-kiosk",
    permission: "task.execute",
    now: "2026-09-10T12:22:00.000Z",
  });
  assert.equal(decision.allowed, true);
  if (decision.allowed) assert.equal(decision.identityId, "technician-kiosk");
});

test("tenant MFA policy and recent re-authentication are enforced server-side", () => {
  const system = createLocalIdentityAccessSystem();
  system.testing.provisionTenant("tenant-secure", "owner-secure", "branch-secure");
  const ownerToken = system.identityProvider.issueToken("owner-secure", {
    authenticatedAt: "2026-09-10T13:00:00.000Z",
    mfa: true,
  });
  system.configureSecurityPolicy(ownerToken, {
    requireStaffMfa: true,
    recentAuthenticationMinutes: 10,
  }, { requestId: "security-policy-1", now: "2026-09-10T13:01:00.000Z" });

  const withoutMfa = system.identityProvider.issueToken("owner-secure", {
    authenticatedAt: "2026-09-10T13:05:00.000Z",
    mfa: false,
  });
  assert.deepEqual(system.authorize(withoutMfa, {
    branchId: "branch-secure",
    permission: "tenant.manage",
    now: "2026-09-10T13:06:00.000Z",
  }), { allowed: false, code: "MFA_REQUIRED" });

  const staleMfa = system.identityProvider.issueToken("owner-secure", {
    authenticatedAt: "2026-09-10T13:05:00.000Z",
    mfa: true,
  });
  assert.deepEqual(system.authorize(staleMfa, {
    branchId: "branch-secure",
    permission: "tenant.manage",
    sensitive: true,
    now: "2026-09-10T13:16:00.001Z",
  }), { allowed: false, code: "RECENT_AUTHENTICATION_REQUIRED" });

  const recentMfa = system.identityProvider.issueToken("owner-secure", {
    authenticatedAt: "2026-09-10T13:15:00.000Z",
    mfa: true,
  });
  const allowed = system.authorize(recentMfa, {
    branchId: "branch-secure",
    permission: "tenant.manage",
    sensitive: true,
    now: "2026-09-10T13:16:00.000Z",
  });
  assert.equal(allowed.allowed, true);
  if (allowed.allowed) assert.deepEqual(allowed.authentication, {
    authenticatedAt: "2026-09-10T13:15:00.000Z",
    mfa: true,
  });
});

test("maker-checker thresholds require a different authorized checker", () => {
  const system = createLocalIdentityAccessSystem();
  system.testing.provisionTenant("tenant-approval", "owner-approval", "branch-approval");
  system.testing.seedMembership({
    identityId: "maker-1",
    membershipId: "membership-maker-1",
    tenantId: "tenant-approval",
    branchIds: ["branch-approval"],
    permissions: ["stock.adjust.request"],
  });
  system.testing.seedMembership({
    identityId: "checker-1",
    membershipId: "membership-checker-1",
    tenantId: "tenant-approval",
    branchIds: ["branch-approval"],
    permissions: ["approval.decide"],
  });
  const ownerToken = system.identityProvider.issueToken("owner-approval", {
    authenticatedAt: "2026-09-10T14:00:00.000Z", mfa: true,
  });
  system.configureMakerChecker(ownerToken, {
    action: "stock.adjust",
    thresholdMinor: 1_000,
  }, { requestId: "policy-stock-adjust", now: "2026-09-10T14:01:00.000Z" });
  const makerToken = system.identityProvider.issueToken("maker-1", {
    authenticatedAt: "2026-09-10T14:02:00.000Z", mfa: true,
  });
  const submitted = system.submitControlledAction(makerToken, {
    action: "stock.adjust",
    amountMinor: 1_500,
    branchId: "branch-approval",
    reason: "Count variance",
    subjectReference: "stock-count-42",
  }, { requestId: "submit-adjustment", now: "2026-09-10T14:03:00.000Z" });
  assert.equal(submitted.status, 202);
  assert.equal(submitted.body.approval?.status, "PENDING");

  const selfApproval = system.decideApproval(makerToken, {
    approvalId: String(submitted.body.approval?.id), decision: "APPROVE", reason: "self",
  }, { requestId: "self-approve", now: "2026-09-10T14:04:00.000Z" });
  assert.equal(selfApproval.status, 403);
  assert.equal(selfApproval.body.code, "MAKER_CANNOT_CHECK");

  const checkerToken = system.identityProvider.issueToken("checker-1", {
    authenticatedAt: "2026-09-10T14:04:30.000Z", mfa: true,
  });
  const approved = system.decideApproval(checkerToken, {
    approvalId: String(submitted.body.approval?.id), decision: "APPROVE", reason: "Evidence checked",
  }, { requestId: "checker-approve", now: "2026-09-10T14:05:00.000Z" });
  assert.equal(approved.status, 200);
  assert.equal(approved.body.approval?.status, "APPROVED");
  assert.deepEqual(approved.body.approval?.approvalChain.map((step) => step.membershipId), [
    "membership-maker-1", "membership-checker-1",
  ]);
});

test("support access is separately approved, time-bound, tenant-visible, and fully audited", () => {
  const system = createLocalIdentityAccessSystem();
  system.testing.provisionTenant("tenant-support", "owner-support", "branch-support");
  system.testing.seedPlatformIdentity("support-agent-1");
  const supportToken = system.identityProvider.issueToken("support-agent-1", {
    authenticatedAt: "2026-09-10T15:00:00.000Z", mfa: true,
  });
  const requested = system.requestSupportAccess(supportToken, {
    tenantId: "tenant-support",
    branchIds: ["branch-support"],
    permissions: ["visit.view"],
    reason: "Investigate tenant ticket WS-42",
    expiresAt: "2026-09-10T16:00:00.000Z",
  }, { requestId: "support-request-1", now: "2026-09-10T15:01:00.000Z" });
  assert.equal(requested.status, 202);

  const ownerToken = system.identityProvider.issueToken("owner-support", {
    authenticatedAt: "2026-09-10T15:02:00.000Z", mfa: true,
  });
  assert.equal(system.listSupportAccess(ownerToken).body.grants?.length, 1);
  const decided = system.decideSupportAccess(ownerToken, {
    grantId: String(requested.body.grant?.id),
    decision: "APPROVE",
    reason: "Ticket confirmed",
  }, { requestId: "support-decision-1", now: "2026-09-10T15:03:00.000Z" });
  assert.equal(decided.status, 200);

  assert.equal(system.authorizeSupport(supportToken, {
    grantId: String(requested.body.grant?.id),
    branchId: "branch-support",
    permission: "visit.view",
    now: "2026-09-10T15:30:00.000Z",
  }).allowed, true);
  assert.deepEqual(system.authorizeSupport(supportToken, {
    grantId: String(requested.body.grant?.id),
    branchId: "branch-support",
    permission: "visit.view",
    now: "2026-09-10T16:00:00.000Z",
  }), { allowed: false, code: "SUPPORT_ACCESS_EXPIRED" });

  const evidence = system.listAudit(ownerToken).body.auditEntries ?? [];
  const approvalAudit = evidence.find((entry) => entry.action === "support-access.approved");
  assert.equal(approvalAudit?.actorIdentityId, "owner-support");
  assert.equal(approvalAudit?.membershipId, "tenant-support-membership-owner");
  assert.equal(approvalAudit?.branchId, "branch-support");
  assert.equal(approvalAudit?.reason, "Ticket confirmed");
  assert.equal(approvalAudit?.requestId, "support-decision-1");
  assert.equal(approvalAudit?.oldState, "PENDING");
  assert.equal(approvalAudit?.newState, "APPROVED");
  assert.ok(approvalAudit?.auditReference);
  assert.deepEqual(approvalAudit?.authentication, {
    authenticatedAt: "2026-09-10T15:02:00.000Z", mfa: true,
  });
  assert.deepEqual(approvalAudit?.approvalChain, ["support-agent-1", "owner-support"]);
});

test("identity and access persistence is tenant-keyed, row-secured, and stores only PIN digests", async () => {
  const migration = await readFile(new URL("../db/migrations/002_identity_access.sql", import.meta.url), "utf8");
  for (const table of [
    "tenant", "branch", "role_template", "membership", "membership_role", "membership_permission",
    "shared_device", "kiosk_pin_credential", "security_policy", "maker_checker_policy",
    "approval_request", "support_access_grant",
  ]) {
    assert.match(migration, new RegExp(`CREATE TABLE workshopos\\.${table}`));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} ENABLE ROW LEVEL SECURITY`));
    assert.match(migration, new RegExp(`ALTER TABLE workshopos\\.${table} FORCE ROW LEVEL SECURITY`));
  }
  assert.match(migration, /pin_digest text NOT NULL/);
  assert.doesNotMatch(migration, /pin_plain|plain_pin/);
  assert.match(migration, /identity_subject text NOT NULL/);
  assert.match(migration, /UNIQUE \(tenant_id, identity_subject\)/);
  assert.match(migration, /support_access_grant_platform_guard/);
  assert.match(migration, /audit_entry[\s\S]*membership_id[\s\S]*request_id[\s\S]*authentication_context/);
});
