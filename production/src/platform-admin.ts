import { ApiError } from "./admin-users.js";

export type PlatformPrincipal = { identityId: string; displayName: string; permissions: string[]; mfaAuthenticatedAt: string };
export type EmulationContext = { emulationId: string; platformActorId: string; effectiveMembershipId: string; tenantId: string; branchId: string; expiresAt: string };

export const PLATFORM_PERMISSIONS = [
  "platform.tenants.read", "platform.support.grant", "platform.support.approve",
  "platform.logs.read", "platform.logs.download", "platform.logs.recover",
  "platform.emulation.request", "platform.emulation.approve", "platform.emulation.use",
] as const;

export function requirePlatformPermission(principal: PlatformPrincipal, permission: string) {
  if (!principal.permissions.includes(permission)) throw new ApiError(403, "PLATFORM_PERMISSION_DENIED");
}

export function requireRecentMfa(principal: PlatformPrincipal, now = new Date(), maximumAgeMinutes = 15) {
  const authenticatedAt = Date.parse(principal.mfaAuthenticatedAt);
  if (!Number.isFinite(authenticatedAt) || authenticatedAt > now.getTime() || now.getTime() - authenticatedAt > maximumAgeMinutes * 60_000) {
    throw new ApiError(401, "RECENT_MFA_REQUIRED");
  }
}

export function requireReason(value: unknown): string {
  const reason = typeof value === "string" ? value.trim() : "";
  if (!reason) throw new ApiError(422, "REASON_REQUIRED");
  return reason;
}
