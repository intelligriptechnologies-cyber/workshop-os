import assert from "node:assert/strict";
import test from "node:test";

import { pagesFromRolePermissions, permissionsFromPages } from "../src/remote-role-access";

test("remote role adapter maps page checkboxes without discarding server-enforced capabilities", () => {
  const pages = ["customers", "vehicles", "admin-console"] as const;
  const existing = ["tenant.users.manage", "page.customers.read", "page.customers.write"];

  assert.deepEqual(pagesFromRolePermissions(existing, pages), ["customers"]);
  assert.deepEqual(permissionsFromPages(existing, ["vehicles"]), [
    "page.vehicles.read", "page.vehicles.write", "tenant.users.manage",
  ]);
});
