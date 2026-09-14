import assert from "node:assert/strict";
import test from "node:test";

import { Client } from "pg";
import { PostgresVertical, type Membership } from "../local/database.js";

const adminUrl = process.env.CUSTOMERS_VEHICLES_TEST_ADMIN_URL;
const appUrl = process.env.CUSTOMERS_VEHICLES_TEST_APP_URL;

test("PostgreSQL customer and vehicle records are versioned, duplicate-safe, associated, and RLS isolated", {
  skip: !adminUrl || !appUrl ? "isolated PostgreSQL URLs not supplied" : false,
}, async () => {
  const seed = new Client({ connectionString: adminUrl }); await seed.connect();
  try { await seed.query(`
    INSERT INTO workshopos.tenant(tenant_id,legal_name,plan_id,entitlements,quotas,base_currency,timezone,configuration_template_id) VALUES
      ('60000000-0000-4000-8000-000000000001','Identity Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1'),
      ('60000000-0000-4000-8000-000000000002','Other Workshop','pilot','[]','{}','INR','Asia/Kolkata','india-v1');
    INSERT INTO workshopos.branch(id,tenant_id,name) VALUES
      ('60000000-0000-4000-8000-000000000011','60000000-0000-4000-8000-000000000001','Delhi'),
      ('60000000-0000-4000-8000-000000000012','60000000-0000-4000-8000-000000000001','Jaipur'),
      ('60000000-0000-4000-8000-000000000021','60000000-0000-4000-8000-000000000002','Other');
  `); } finally { await seed.end(); }

  const delhi: Membership = { subject: "identity-user", tenantId: "60000000-0000-4000-8000-000000000001", branchIds: ["60000000-0000-4000-8000-000000000011"] };
  const jaipur: Membership = { subject: "jaipur-user", tenantId: delhi.tenantId, branchIds: ["60000000-0000-4000-8000-000000000012"] };
  const database = new PostgresVertical(appUrl);
  try {
    const customer = (await database.createCustomer(delhi, { branchId: delhi.branchIds[0], displayName: "Asha Rao", mobile: "+91 98765 43210", email: "asha@example.test" }, "customer-1")).customer;
    assert.equal((await database.createCustomer(delhi, { branchId: delhi.branchIds[0], displayName: "Asha Rao", mobile: "+91 98765 43210", email: "asha@example.test" }, "customer-1")).customer.id, customer.id);
    await assert.rejects(() => database.createCustomer(delhi, { branchId: delhi.branchIds[0], displayName: "Another Asha", mobile: "9876543210", email: "" }, "customer-2"), (error: any) => error.code === "DUPLICATE_MOBILE");
    const edited = await database.updateCustomer(delhi, customer.id, { displayName: "Asha Rao-Singh", mobile: "9876543210", email: "asha@example.test", version: 1 });
    assert.equal(edited.version, 2);
    assert.equal((await database.getCustomer(delhi, customer.id)).displayName, "Asha Rao-Singh");
    await assert.rejects(() => database.updateCustomer(delhi, customer.id, { ...edited, version: 1 }), (error: any) => error.code === "VERSION_CONFLICT");

    const vehicle = (await database.createVehicle(delhi, { branchId: delhi.branchIds[0], registration: "DL 01 AB 1234", vin: "", make: "Tata", model: "Nexon", ownerCustomerId: customer.id }, "vehicle-1")).vehicle;
    assert.equal(vehicle.ownerCustomerId, customer.id);
    const vehicleEdited = await database.updateVehicle(delhi, vehicle.id, { registration: vehicle.registration, vin: "", make: "Tata", model: "Nexon EV", ownerCustomerId: customer.id, version: 1 });
    assert.equal(vehicleEdited.version, 2);
    assert.equal((await database.getVehicle(delhi, vehicle.id)).model, "Nexon EV");
    await assert.rejects(() => database.updateVehicle(delhi, vehicle.id, { ...vehicleEdited, version: 1 }), (error: any) => error.code === "VERSION_CONFLICT");
    await assert.rejects(() => database.createVehicle(delhi, { branchId: delhi.branchIds[0], registration: "DL01AB1234", vin: "", make: "Tata", model: "Nexon", ownerCustomerId: customer.id }, "vehicle-2"), (error: any) => error.code === "DUPLICATE_REGISTRATION");
    await assert.rejects(() => database.createVehicle(delhi, { branchId: "60000000-0000-4000-8000-000000000012", registration: "RJ14ZZ0001", vin: "", make: "", model: "", ownerCustomerId: customer.id }, "branch-hop"), (error: any) => error.code === "BRANCH_FORBIDDEN");
    assert.equal((await database.queryCustomers(delhi, { search: "Asha", branchId: "", sort: "summary.asc", page: 1, pageSize: 25 })).page.totalCount, 1);
    assert.equal((await database.queryVehicles(delhi, { search: "DL01", branchId: "", sort: "summary.asc", page: 1, pageSize: 25 })).vehicles[0].registration, "DL01AB1234");
    assert.equal((await database.queryCustomers(jaipur, { search: "", branchId: "", sort: "updatedAt.desc", page: 1, pageSize: 25 })).page.totalCount, 0);
  } finally { await database.close(); }
});
