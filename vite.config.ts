import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

const scope = process.env.WORKSHOPOS_SLICE ?? "dev";
const integrated = scope === "dev" || scope === "test";


const generated = "backend/customer-slice/.generated/";
export default defineConfig(({ command }) => {

  return ({
  plugins: [react(), {
    name: "require-postgresql-runtime",
    generateBundle() {
      const sqlite = [...this.getModuleIds()].filter(id => id.replaceAll("\\", "/").includes("/node_modules/sql.js/"));
      if (sqlite.length) this.error("Retired SQL.js runtime must not enter the application bundle");
      this.emitFile({type:"asset",fileName:".verification/postgres-runtime.json",source:JSON.stringify({backend:"postgresql",sqliteRuntimeModules:sqlite,testMode:false})});
    },
  }, {
    name: "development-credential-fixture",
    resolveId(id) { if (id === "virtual:workshop-demo-credentials") return "\0" + id; },
    load(id) {
      if (id === "\0virtual:workshop-demo-credentials") {
        return integrated && command === "serve"
          ? readFileSync(generated + "demo-credentials.ts", "utf8").replace(" as Record<string,string>", "")
          : "export default {};";
      }
    },
  }],
  define: { "import.meta.env.VITE_CUSTOMERS_API": JSON.stringify("true") },
  server: {
    allowedHosts: true,
    ...(integrated && command === "serve" ? {
      host: "localhost", port: scope === "test" ? 18444 : 18443, strictPort: true,
      https: { key: readFileSync(generated + "localhost.key"), cert: readFileSync(generated + "localhost.crt") },
      proxy: { "/api": { target: "http://127.0.0.1:" + (scope === "test" ? "18285" : "18284") } },
    } : {}),
  },
  preview: { allowedHosts: true },
}); });
