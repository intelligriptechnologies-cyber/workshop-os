import { ApiError } from "./admin-users.js";

const messages: Record<string, string> = {
  LOCAL_IDENTITY_REQUIRED: "Sign in to continue.",
  MEMBERSHIP_REQUIRED: "Your account does not have an active WorkshopOS membership.",
  PLATFORM_CREDENTIAL_REQUIRED: "A platform credential is required.",
  BRANCH_FORBIDDEN: "You do not have access to that branch.",
  PERMISSION_DENIED: "You do not have permission to perform this action.",
  IDEMPOTENCY_KEY_REQUIRED: "The request could not be retried safely. Try again.",
  IDEMPOTENCY_KEY_REUSED: "This retry belongs to a different change. Try again.",
  SUMMARY_REQUIRED: "Enter a work item summary.",
  REASON_REQUIRED: "Enter a reason for this command.",
  VERSION_REQUIRED: "Refresh the work item and try again.",
  VERSION_CONFLICT: "This work item changed since you opened it. Refresh and try again.",
  WORK_ITEM_NOT_FOUND: "The work item was not found or is no longer available.",
  EXPORT_NOT_FOUND: "The export was not found or is no longer available.",
  EXPORT_NOT_READY: "The export is still being prepared. Try again shortly.",
  EXPORT_FORMAT_INVALID: "Choose PDF or XLSX export format.",
  VIEW_MODE_INVALID: "Choose grid or table view.",
  NOT_FOUND: "The requested resource was not found.",
  EMAIL_EXISTS: "A user with that email already exists.",
  INTERNAL_ERROR: "WorkshopOS could not complete the request. Try again.",
};

export type PublicApiError = {
  status: number;
  body: { code: string; message: string; traceId: string };
};

export function publicApiError(error: unknown, traceId: string): PublicApiError {
  const duplicateEmail = (error as { code?: string }).code === "23505";
  const status = error instanceof ApiError ? error.status : duplicateEmail ? 409 : 500;
  const code = error instanceof ApiError ? error.code : duplicateEmail ? "EMAIL_EXISTS" : "INTERNAL_ERROR";
  return { status, body: { code, message: messages[code] ?? messages.INTERNAL_ERROR, traceId } };
}
