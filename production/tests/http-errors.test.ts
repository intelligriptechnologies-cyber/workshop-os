import assert from "node:assert/strict";
import test from "node:test";

import { ApiError } from "../src/admin-users.js";
import { publicApiError } from "../src/http-errors.js";

test("API errors expose safe guidance and a correlation identifier", () => {
  assert.deepEqual(publicApiError(new ApiError(409, "VERSION_CONFLICT"), "trace-123"), {
    status: 409,
    body: {
      code: "VERSION_CONFLICT",
      message: "This work item changed since you opened it. Refresh and try again.",
      traceId: "trace-123",
    },
  });
  assert.deepEqual(publicApiError(new Error("secret database password"), "trace-456"), {
    status: 500,
    body: {
      code: "INTERNAL_ERROR",
      message: "WorkshopOS could not complete the request. Try again.",
      traceId: "trace-456",
    },
  });
});
