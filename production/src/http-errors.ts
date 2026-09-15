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
  ROLE_NAME_REQUIRED: "Enter a role name.",
  ROLE_NAME_TOO_LONG: "Role names must be 100 characters or fewer.",
  ROLE_DESCRIPTION_TOO_LONG: "Role descriptions must be 500 characters or fewer.",
  ROLE_NAME_EXISTS: "A role with that name already exists.",
  ROLE_NOT_FOUND: "The role was not found or is no longer available.",
  ROLE_IN_USE: "Remove this role from every user before archiving it.",
  PROTECTED_ROLE: "Protected role templates cannot be changed or archived.",
  PERMISSION_INVALID: "Choose permissions from the current catalog.",
  PAGE_PERMISSION_REQUIRED: "Select a page permission before selecting its actions.",
  ARCHIVE_REASON_REQUIRED: "Enter a reason for archiving this record.",
  CUSTOMER_NAME_REQUIRED: "Enter a customer name.",
  MOBILE_INVALID: "Enter a valid 10-digit mobile number.",
  DUPLICATE_MOBILE: "That mobile number already belongs to another customer. Open the existing record or use a different number.",
  CUSTOMER_NOT_FOUND: "The customer was not found or is no longer available.",
  VEHICLE_IDENTITY_REQUIRED: "Enter a registration or VIN.",
  VIN_INVALID: "Enter a valid 17-character VIN.",
  DUPLICATE_REGISTRATION: "That registration already belongs to another vehicle. Open the existing record instead.",
  DUPLICATE_VIN: "That VIN already belongs to another vehicle.",
  OWNER_ASSOCIATION_INVALID: "Choose an active customer from the same branch.",
  OWNERSHIP_DATE_CONFLICT: "This vehicle already has an ownership change for today. Review its ownership history before trying again.",
  VEHICLE_NOT_FOUND: "The vehicle was not found or is no longer available.",
  EXPORT_SCREEN_INVALID: "Choose the customer or vehicle export.",
  IMPORT_FILENAME_REQUIRED: "Enter the source filename for this inventory import.",
  IMPORT_ROWS_INVALID: "Add between 1 and 1,000 inventory rows.",
  IMPORT_VALIDATION_FAILED: "Resolve every rejected inventory row before committing.",
  IMPORT_REFERENCE_CHANGED: "An inventory item or warehouse changed after validation. Stage the import again.",
  INVENTORY_IMPORT_NOT_FOUND: "The inventory import was not found or is no longer available.",
  IMPORT_HAS_NO_ERRORS: "This inventory import has no rejected-row manifest.",
  INVENTORY_POSITION_NOT_FOUND: "The inventory item or warehouse is not available in your scope.",
  QUANTITY_INVALID: "Enter a positive inventory quantity with no more than six decimal places.",
  VALUE_MINOR_INVALID: "Enter a non-negative whole value within the supported currency range.",
  JOB_NOT_FOUND: "The Job was not found or is no longer available in your permitted branches.",
  JOB_DOCUMENT_NOT_FOUND: "The Job document was not found, is not final, or is no longer available.",
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
