import assert from "node:assert/strict";
import test from "node:test";

import { permittedProductionNavigation, PRODUCTION_NAVIGATION } from "../src/production-navigation.js";
import { permissionKeys } from "../production/src/role-permissions.js";

test("production navigation uses the same explicit page permission keys as policy", () => {
  assert.deepEqual(permittedProductionNavigation(["admin.roles.page", "role.manage"]).map((item) => item.href), ["/production/roles"]);
  assert.deepEqual(permittedProductionNavigation(["membership.manage"]), []);
  const catalogKeys = new Set(permissionKeys());
  assert.ok(PRODUCTION_NAVIGATION.every((item) => catalogKeys.has(item.permission)));
});
