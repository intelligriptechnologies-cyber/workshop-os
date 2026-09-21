import assert from "node:assert/strict";
import test from "node:test";
import { requirePlatformPermission, requireRecentMfa, requireReason } from "../production/src/platform-admin.js";

const principal={identityId:"support",displayName:"Support",permissions:["platform.emulation.use"],mfaAuthenticatedAt:"2026-09-21T10:00:00.000Z"};
test("platform authorization is permission-specific and requires accountable reasons",()=>{
  assert.doesNotThrow(()=>requirePlatformPermission(principal,"platform.emulation.use"));
  assert.throws(()=>requirePlatformPermission(principal,"platform.logs.read"),/PLATFORM_PERMISSION_DENIED/);
  assert.equal(requireReason("  customer-approved investigation "),"customer-approved investigation");
  assert.throws(()=>requireReason("  "),/REASON_REQUIRED/);
});
test("privileged platform commands require MFA within 15 minutes",()=>{
  assert.doesNotThrow(()=>requireRecentMfa(principal,new Date("2026-09-21T10:14:59.999Z")));
  assert.throws(()=>requireRecentMfa(principal,new Date("2026-09-21T10:15:00.001Z")),/RECENT_MFA_REQUIRED/);
  assert.throws(()=>requireRecentMfa({...principal,mfaAuthenticatedAt:"invalid"},new Date("2026-09-21T10:01:00Z")),/RECENT_MFA_REQUIRED/);
});
