type MediaMembership = {
  tenantId: string;
  branchIds: string[];
  permissions: string[];
};

type UploadInput = {
  branchId: string;
  fileName: string;
  mimeType: string;
  byteLength: number;
  checksumSha256: string;
  contentChecksumSha256: string;
  malwareStatus: "PENDING" | "CLEAN" | "INFECTED" | "FAILED";
};

type MediaObject = UploadInput & {
  id: string;
  tenantId: string;
  objectRef: string;
  status: "QUARANTINED" | "AVAILABLE";
};

type ApiResponse = { status: number; body: Record<string, any> };
type AccessAudit = { tenantId?: string; mediaId: string; outcome: "ALLOWED" | "DENIED"; code?: string };

const clone = <T>(value: T): T => structuredClone(value);

export function createLocalSecureMediaVault(input: {
  memberships: Record<string, MediaMembership>;
  tenantQuotaBytes: Record<string, number>;
  scannerToken: string;
}) {
  const objects: MediaObject[] = [];
  const accessAudits: AccessAudit[] = [];
  return {
    signIn(token: string) {
      return {
        async upload(body: UploadInput): Promise<ApiResponse> {
          const membership = input.memberships[token];
          if (!membership) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
          if (!membership.permissions.includes("media.upload")) return { status: 403, body: { code: "PERMISSION_DENIED" } };
          if (!membership.branchIds.includes(body.branchId)) return { status: 403, body: { code: "BRANCH_FORBIDDEN" } };
          if (!new Set(["image/jpeg", "image/png", "application/pdf"]).has(body.mimeType)) {
            return { status: 422, body: { code: "MEDIA_TYPE_NOT_ALLOWED" } };
          }
          if (!/^[a-f0-9]{64}$/i.test(body.checksumSha256) || body.checksumSha256 !== body.contentChecksumSha256) {
            return { status: 422, body: { code: "MEDIA_CHECKSUM_MISMATCH" } };
          }
          if (body.malwareStatus === "INFECTED" || body.malwareStatus === "FAILED") {
            return { status: 422, body: { code: "MEDIA_MALWARE_REJECTED" } };
          }
          const usedBytes = objects.filter((item) => item.tenantId === membership.tenantId).reduce((sum, item) => sum + item.byteLength, 0);
          const quota = input.tenantQuotaBytes[membership.tenantId] ?? 0;
          if (!Number.isSafeInteger(body.byteLength) || body.byteLength <= 0 || usedBytes + body.byteLength > quota) {
            return { status: 422, body: { code: "MEDIA_QUOTA_EXCEEDED" } };
          }
          const object: MediaObject = {
            ...body,
            id: `media-${objects.length + 1}`,
            tenantId: membership.tenantId,
            objectRef: `private/${membership.tenantId}/${body.branchId}/media/media-${objects.length + 1}`,
            malwareStatus: "PENDING",
            status: "QUARANTINED",
          };
          objects.push(object);
          return { status: 201, body: { media: clone(object) } };
        },
        async get(mediaId: string): Promise<ApiResponse> {
          const membership = input.memberships[token];
          if (!membership) return { status: 401, body: { code: "AUTHENTICATION_REQUIRED" } };
          const object = objects.find((candidate) => candidate.id === mediaId && candidate.tenantId === membership.tenantId && membership.branchIds.includes(candidate.branchId));
          if (!object) {
            accessAudits.push({ tenantId: membership.tenantId, mediaId, outcome: "DENIED", code: "MEDIA_NOT_FOUND" });
            return { status: 404, body: { code: "MEDIA_NOT_FOUND" } };
          }
          if (!membership.permissions.includes("media.read")) {
            accessAudits.push({ tenantId: membership.tenantId, mediaId, outcome: "DENIED", code: "PERMISSION_DENIED" });
            return { status: 403, body: { code: "PERMISSION_DENIED" } };
          }
          if (object.status !== "AVAILABLE") {
            accessAudits.push({ tenantId: membership.tenantId, mediaId, outcome: "DENIED", code: "MEDIA_NOT_AVAILABLE" });
            return { status: 409, body: { code: "MEDIA_NOT_AVAILABLE" } };
          }
          accessAudits.push({ tenantId: membership.tenantId, mediaId, outcome: "ALLOWED" });
          return { status: 200, body: { media: clone(object) } };
        },
      };
    },
    scanner: {
      recordResult(scannerToken: string, mediaId: string, result: { status: "CLEAN" | "INFECTED" | "FAILED"; checksumSha256: string }): ApiResponse {
        if (scannerToken !== input.scannerToken) return { status: 403, body: { code: "SCANNER_AUTHORIZATION_FAILED" } };
        const object = objects.find((candidate) => candidate.id === mediaId);
        if (!object) return { status: 404, body: { code: "MEDIA_NOT_FOUND" } };
        if (result.checksumSha256 !== object.checksumSha256) return { status: 409, body: { code: "MEDIA_SCAN_CHECKSUM_MISMATCH" } };
        object.malwareStatus = result.status;
        object.status = result.status === "CLEAN" ? "AVAILABLE" : "QUARANTINED";
        return { status: 200, body: { media: clone(object) } };
      },
    },
    inspect() {
      return { objects: clone(objects), accessAudits: clone(accessAudits) };
    },
  };
}
