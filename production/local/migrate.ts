import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Client } from "pg";

const adminUrl = process.env.DATABASE_ADMIN_URL;
if (!adminUrl) throw new Error("DATABASE_ADMIN_URL is required");

const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../db/migrations");
const client = new Client({ connectionString: adminUrl });

function withoutEmbeddedTransaction(sql: string): string {
  return sql.replace(/^\s*BEGIN;\s*/i, "").replace(/\s*COMMIT;\s*$/i, "");
}

await client.connect();
try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.schema_migrations (
      filename text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT transaction_timestamp()
    )
  `);

  const filenames = (await readdir(directory)).filter((name) => /^\d{3}_.+\.sql$/.test(name)).sort();
  for (const filename of filenames) {
    const sql = await readFile(path.join(directory, filename), "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    const existing = await client.query<{ checksum: string }>(
      "SELECT checksum FROM public.schema_migrations WHERE filename = $1",
      [filename],
    );
    if (existing.rowCount) {
      if (existing.rows[0].checksum !== checksum) throw new Error(`Applied migration changed: ${filename}`);
      console.log(`unchanged ${filename}`);
      continue;
    }
    await client.query("BEGIN");
    try {
      await client.query(withoutEmbeddedTransaction(sql));
      await client.query("INSERT INTO public.schema_migrations (filename, checksum) VALUES ($1, $2)", [filename, checksum]);
      await client.query("COMMIT");
      console.log(`applied   ${filename}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }

  await client.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'workshopos_app') THEN
        CREATE ROLE workshopos_app LOGIN PASSWORD 'workshopos_app_local' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
      END IF;
    END $$;
    GRANT USAGE ON SCHEMA public TO workshopos_app;
    GRANT SELECT ON public.schema_migrations TO workshopos_app;
    GRANT USAGE ON SCHEMA workshopos TO workshopos_app;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA workshopos TO workshopos_app;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA workshopos TO workshopos_app;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA workshopos TO workshopos_app;
    ALTER DEFAULT PRIVILEGES IN SCHEMA workshopos GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO workshopos_app;
    ALTER DEFAULT PRIVILEGES IN SCHEMA workshopos GRANT USAGE, SELECT ON SEQUENCES TO workshopos_app;
    ALTER DEFAULT PRIVILEGES IN SCHEMA workshopos GRANT EXECUTE ON FUNCTIONS TO workshopos_app;
  `);
  console.log(`database ready (${filenames.length} migrations)`);
} finally {
  await client.end();
}
