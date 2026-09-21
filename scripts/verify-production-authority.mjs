import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";

const root = process.cwd();
const entry = resolve(root, "src/main.tsx");
const forbidden = [/\bsql\.js\b/, /["']\.\/?db(?:\.ts)?["']/, /from\s+["'][^"']*\/db(?:\.ts)?["']/];
const visited = new Set();
const edges = [];
const requiredRoutes = [
  "/",
  "/production/work-items",
  "/production/users",
  "/production/roles",
  "/production/settings",
  "/production/customers",
  "/production/vehicles",
  "/production/inventory",
  "/production/jobs",
  "/production/data-flow",
  "/production/media",
  "/production/estimates",
  "/production/tasks",
  "/production/qc",
  "/production/billing",
  "/production/search",
  "/production/appointments",
  "/production/follow-ups",
  "/production/action-inbox",
  "/production/materials",
  "/production/reports",
  "/production/masters",
];
const remainingRichRoutes = [
  "/production/appointments",
  "/production/follow-ups",
  "/production/action-inbox",
  "/production/materials",
  "/production/reports",
  "/production/masters",
];
const requiredLegacySurfaces = {
  reception: ["Receive Vehicle", "Today Queue", "Customers", "Vehicles", "Search"],
  service: ["My Queue", "Job Card", "Estimate", "Follow-ups", "Media", "Search"],
  store: ["Material Requests", "Issue Material", "Reconcile", "Stock", "Search"],
  tech: ["My Tasks", "Work Update", "QC Prep", "Search"],
  accounts: ["Ready To Invoice", "Invoice", "Payment", "Delivery", "Search"],
  admin: ["Dashboard", "Data Flow", "Jobs", "Customers", "Vehicles", "Media", "Masters", "Manage", "Search"],
};

function resolveModule(source, importer) {
  if (!source.startsWith(".")) return undefined;
  const base = resolve(dirname(importer), source);
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.jsx`, `${base}.css`]) if (existsSync(candidate)) return candidate;
}

function visit(file) {
  if (visited.has(file) || extname(file) === ".css") return;
  visited.add(file);
  const source = readFileSync(file, "utf8");
  for (const rule of forbidden) if (rule.test(source)) throw new Error(`Production authority violation in ${file.slice(root.length + 1)}: ${rule}`);
  if (/href\s*=\s*["'{][^\n}]*\/demo/.test(source)) throw new Error(`Production route links to the isolated demo in ${file.slice(root.length + 1)}.`);
  const staticImport = /(?:^|\n)\s*import\s+(?!\()(?:(?:type\s+)?[^"'\n]*?\s+from\s+)?["']([^"']+)["']/g;
  const staticExport = /(?:^|\n)\s*export\s+(?:type\s+)?(?:\*|\{[^\n]*\})\s+from\s+["']([^"']+)["']/g;
  const dynamicImport = /import\(\s*["']([^"']+)["']\s*\)/g;
  for (const match of [...source.matchAll(staticImport), ...source.matchAll(staticExport), ...source.matchAll(dynamicImport)]) {
    if (file === entry && match[1] === "./App") continue;
    const target = resolveModule(match[1], file);
    if (target) { edges.push([file, target]); visit(target); }
  }
}

visit(entry);
const main = readFileSync(entry, "utf8");
if (/^\s*import\s+[^\n]*from\s+["']\.\/App["']/m.test(main)) throw new Error("Legacy App must not be statically imported by the production entry.");
if (!/lazy\(\(\)\s*=>\s*import\(["']\.\/App["']\)\)/.test(main) || !/location\.pathname\s*===\s*["']\/demo["']/.test(main)) throw new Error("Legacy App must remain behind the explicit /demo dynamic boundary.");
if ([...visited].some((file) => /[\\/]App\.tsx$|[\\/]db\.ts$/.test(file))) throw new Error("Legacy App or db.ts is reachable from the static production graph.");

const inventory = JSON.parse(readFileSync(resolve(root, "production/remaining-screen-inventory.json"), "utf8"));
const routes = inventory.routes.map((item) => item.route);
if (new Set(routes).size !== routes.length) throw new Error("Screen inventory contains duplicate routes.");
for (const route of requiredRoutes) if (!routes.includes(route)) throw new Error(`${route} is required but missing from the production inventory.`);
for (const route of routes) if (!requiredRoutes.includes(route)) throw new Error(`${route} is inventoried but absent from the locked production route set.`);
for (const item of inventory.routes) {
  if (!item.resource?.startsWith("/api/v1/")) throw new Error(`${item.route} lacks an /api/v1 resource mapping.`);
  if (!item.component || !item.slice) throw new Error(`${item.route} lacks component or implementation-slice evidence.`);
  if (item.route !== "/" && !main.includes(`"${item.route}"`)) throw new Error(`${item.route} is inventoried but absent from the production router.`);
}
for (const route of remainingRichRoutes) {
  const item = inventory.routes.find((candidate) => candidate.route === route);
  for (const contract of ["server-list", "url-state", "detail-dialog", "grid-table-preference", "full-filtered-pdf", "full-filtered-xlsx"]) {
    if (!item.contracts?.includes(contract)) throw new Error(`${route} lacks the ${contract} contract.`);
  }
  if (!item.postgresEvidence || !existsSync(resolve(root, item.postgresEvidence))) throw new Error(`${route} lacks PostgreSQL acceptance evidence.`);
}
const coverage = new Map(inventory.legacySurfaceCoverage.map((item) => [`${item.role}:${item.surface}`, item]));
for (const [role, surfaces] of Object.entries(requiredLegacySurfaces)) for (const surface of surfaces) {
  const item = coverage.get(`${role}:${surface}`);
  if (!item) throw new Error(`${role} / ${surface} is missing from legacy rich-surface coverage.`);
  if (!Array.isArray(item.routes) || !item.routes.length || item.routes.some((route) => !routes.includes(route))) throw new Error(`${role} / ${surface} has an invalid production route mapping.`);
}
if (coverage.size !== Object.values(requiredLegacySurfaces).flat().length) throw new Error("Legacy rich-surface coverage contains an unlocked or duplicate mapping.");
const navigation = readFileSync(resolve(root, "src/production-navigation.tsx"), "utf8");
const navigationRoutes = [...navigation.matchAll(/href:\s*["']([^"']+)["']/g)].map((match) => match[1]);
for (const route of navigationRoutes) if (!routes.includes(route)) throw new Error(`${route} is navigable but missing from the production inventory.`);
for (const route of requiredRoutes.filter((route) => route !== "/")) if (!navigationRoutes.includes(route)) throw new Error(`${route} is missing from production navigation.`);
if (navigation.includes('href: "/demo"')) throw new Error("The isolated demo must not appear in production navigation.");
if (inventory.demoBoundary.productionNavigation !== false || inventory.demoBoundary.productionLink !== false) throw new Error("The demo boundary must be explicitly excluded from production navigation and links.");

console.log(`Production authority gate passed: ${visited.size} static modules, ${routes.length} locked routes, ${coverage.size} legacy surfaces, demo isolated.`);
