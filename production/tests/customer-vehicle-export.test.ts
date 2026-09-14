import assert from "node:assert/strict";
import test from "node:test";
import { createCustomerVehicleExportArtifact } from "../src/customer-vehicle-export.js";

test("customer and vehicle exports contain every supplied filtered row", () => {
  const customers = Array.from({ length: 51 }, (_, index) => ({ id: `c-${index}`, tenantId: "t", branchId: "b", displayName: `Customer ${index}`, mobile: `9000000${String(index).padStart(3,"0")}`, email: "", status: "ACTIVE" as const, version: 1, updatedAt: "2026-09-14T00:00:00Z" }));
  const customerExport = createCustomerVehicleExportArtifact("customers", "XLSX", customers);
  assert.equal(customerExport.rowCount, 51); assert.match(customerExport.mimeType, /spreadsheet/); assert.ok(customerExport.content.length > 100);
  const vehicleExport = createCustomerVehicleExportArtifact("vehicles", "PDF", [{ id: "v1", tenantId: "t", branchId: "b", registration: "DL01AB1234", vin: "", make: "Tata", model: "Nexon", ownerCustomerId: "c1", ownerName: "Asha", status: "ACTIVE", version: 1, updatedAt: "2026-09-14T00:00:00Z" }]);
  assert.equal(vehicleExport.rowCount, 1); assert.equal(vehicleExport.mimeType, "application/pdf"); assert.equal(vehicleExport.content.subarray(0,4).toString(), "%PDF");
});
