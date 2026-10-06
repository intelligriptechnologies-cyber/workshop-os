import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import {
  appointServiceDepartmentManager,
  assignServiceAdvisorTeam,
  createSchema,
  createServiceDepartment,
  ensureDemoTeamStructure,
  migrateSchema,
  readState,
  removeServiceAdvisorTeam,
  removeServiceDepartmentManager,
  updateUser,
  archiveUser,
} from "../src/db";

async function database() {
  const SQL = await initSqlJs({
    locateFile: () => fileURLToPath(new URL("../node_modules/sql.js/dist/sql-wasm.wasm", import.meta.url)),
  });
  const db = new SQL.Database();
  createSchema(db);
  migrateSchema(db);
  db.run("insert into users(id,email,name,role,password) values (1,'manager.one@test','Manager One','service_manager','x'),(2,'manager.two@test','Manager Two','service_manager','x'),(3,'advisor.one@test','Advisor One','service','x'),(4,'advisor.two@test','Advisor Two','service','x'),(5,'reception@test','Reception','reception','x')");
  return db;
}

test("departments retain manager appointments and expose advisors under their assigned manager", async () => {
  const db = await database();
  const departmentId = createServiceDepartment(db, "General Service");

  appointServiceDepartmentManager(db, departmentId, 1);
  appointServiceDepartmentManager(db, departmentId, 2);
  assignServiceAdvisorTeam(db, departmentId, 1, 3);
  assignServiceAdvisorTeam(db, departmentId, 2, 4);

  assert.deepEqual(readState(db).service_departments[0], {
    id: departmentId,
    name: "General Service",
    status: "ACTIVE",
    created_at: readState(db).service_departments[0].created_at,
    updated_at: readState(db).service_departments[0].updated_at,
    manager_ids: [1, 2],
    advisor_team_ids: [3, 4],
    advisor_teams: [{ manager_id: 1, advisor_id: 3 }, { manager_id: 2, advisor_id: 4 }],
  });
});

test("advisor reassignment is exclusive and removing a manager cascades only that manager's team", async () => {
  const db = await database();
  const departmentId = createServiceDepartment(db, "Body Repair");
  appointServiceDepartmentManager(db, departmentId, 1);
  appointServiceDepartmentManager(db, departmentId, 2);
  assignServiceAdvisorTeam(db, departmentId, 1, 3);
  assignServiceAdvisorTeam(db, departmentId, 2, 3);
  assignServiceAdvisorTeam(db, departmentId, 2, 4);

  assert.deepEqual(readState(db).service_departments[0].advisor_teams, [{ manager_id: 2, advisor_id: 3 }, { manager_id: 2, advisor_id: 4 }]);
  removeServiceDepartmentManager(db, departmentId, 2);
  assert.deepEqual(readState(db).service_departments[0].manager_ids, [1]);
  assert.deepEqual(readState(db).service_departments[0].advisor_teams, []);

  assignServiceAdvisorTeam(db, departmentId, 1, 3);
  removeServiceAdvisorTeam(db, departmentId, 1, 3);
  assert.deepEqual(readState(db).service_departments[0].advisor_teams, []);
});

test("only active role-qualified users can be appointed or assigned", async () => {
  const db = await database();
  const departmentId = createServiceDepartment(db, "Express Service");

  assert.throws(() => appointServiceDepartmentManager(db, departmentId, 3), /Service Department Manager role/);
  appointServiceDepartmentManager(db, departmentId, 1);
  assert.throws(() => assignServiceAdvisorTeam(db, departmentId, 1, 5), /Service Advisor role/);
  db.run("update users set archived_at='2026-10-03T00:00:00.000Z' where id=3");
  assert.throws(() => assignServiceAdvisorTeam(db, departmentId, 1, 3), /Expected row/);
});

test("preloads the two service departments and maps one manager to each", async () => {
  const db = await database();

  ensureDemoTeamStructure(db);
  ensureDemoTeamStructure(db);

  const state = readState(db);
  const general = state.service_departments.find((department) => department.name === "General Service Work");
  const ppfPaint = state.service_departments.find((department) => department.name === "PPF/Paint Work");
  const generalManager = state.users.find((user) => user.email === "general.service.manager@example.com");
  const ppfPaintManager = state.users.find((user) => user.email === "ppf.paint.manager@example.com");

  assert.ok(general);
  assert.ok(ppfPaint);
  assert.equal(generalManager?.role, "service_manager");
  assert.equal(ppfPaintManager?.role, "service_manager");
  assert.deepEqual(general.manager_ids, [generalManager!.id]);
  assert.deepEqual(ppfPaint.manager_ids, [ppfPaintManager!.id]);
  assert.throws(() => updateUser(db, generalManager!.id, { ...generalManager!, name: "Changed" }), /locked/);
  assert.throws(() => archiveUser(db, ppfPaintManager!.id, "No longer needed", 1), /locked/);
});
