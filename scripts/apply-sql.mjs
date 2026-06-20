// Applies every SQL file in supabase/migrations/ over a direct Postgres connection.
// Reads connection details from .env.local (SUPABASE_PROJECT_REF + SUPABASE_DB_PASSWORD).
//
// Usage: node scripts/apply-sql.mjs

import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";

// Minimal .env.local loader (no dotenv dependency).
async function loadEnv() {
  const env = {};
  try {
    const text = await fs.readFile(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim();
    }
  } catch {}
  return env;
}

const env = await loadEnv();
const ref = env.SUPABASE_PROJECT_REF;
const password = env.SUPABASE_DB_PASSWORD;

if (!ref || !password) {
  console.error("Missing SUPABASE_PROJECT_REF or SUPABASE_DB_PASSWORD in .env.local");
  process.exit(1);
}

// Try direct connection first, then poolers across common regions.
const candidates = [
  { host: `db.${ref}.supabase.co`, port: 5432, user: "postgres" },
  ...["eu-central-1", "eu-west-1", "eu-west-2", "us-east-1", "us-east-2", "us-west-1", "ap-southeast-1"].map(
    (r) => ({ host: `aws-0-${r}.pooler.supabase.com`, port: 5432, user: `postgres.${ref}` }),
  ),
];

async function connect() {
  for (const c of candidates) {
    const client = new pg.Client({
      host: c.host,
      port: c.port,
      user: c.user,
      password,
      database: "postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    });
    try {
      process.stdout.write(`Trying ${c.host} ... `);
      await client.connect();
      console.log("connected");
      return client;
    } catch (e) {
      console.log(`no (${e.message.split("\n")[0]})`);
      try { await client.end(); } catch {}
    }
  }
  throw new Error("Could not connect to any Supabase host. Check password / region.");
}

const dir = path.join(process.cwd(), "supabase", "migrations");
const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

console.log(`Connecting to ${ref}...`);
const client = await connect();
console.log(`Applying ${files.length} migrations...\n`);

for (const file of files) {
  const sql = await fs.readFile(path.join(dir, file), "utf8");
  process.stdout.write(`→ ${file} ... `);
  try {
    await client.query(sql);
    console.log("OK");
  } catch (e) {
    console.error(`FAILED\n${e.message}`);
    await client.end();
    process.exit(1);
  }
}

await client.end();
console.log("\nAll migrations applied successfully.");
