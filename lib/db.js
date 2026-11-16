// The database the owner reads: a free Supabase (Postgres) project, where
// sign-ups and app users show up as tables. Tables: db/schema.sql.
//
// Two environment variables, set in Vercel and nowhere else:
//   SUPABASE_URL         https://<project>.supabase.co
//   SUPABASE_SECRET_KEY  the project's secret key (never the publishable one)
// The tables have row level security on and no policies, so only this secret
// key can read or write them. Nothing here runs in the visitor's browser.
//
// The private Blob store stays the first copy (lib/signups.js, lib/appusers.js).
// A row is written here as well, and if the database is slow or down the
// download still goes ahead: /api/db/sync copies anything that was missed.

const URL_ = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const dbReady = () => /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(URL_) && KEY.length > 20;

// Insert rows, or update the ones that already exist (matched on `conflict`).
// Throws on failure. Columns left out of the rows keep their stored value.
export async function upsert(table, rows, conflict) {
  if (!dbReady()) throw new Error("No database connected");
  const list = Array.isArray(rows) ? rows : [rows];
  if (!list.length) return 0;
  const res = await fetch(`${URL_}/rest/v1/${table}?on_conflict=${encodeURIComponent(conflict)}`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify(list),
    signal: AbortSignal.timeout(8000),
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Database answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return list.length;
}

// For the live path: try, and never let a database problem stop the visitor.
export async function mirror(table, row, conflict) {
  if (!dbReady()) return false;
  try {
    await upsert(table, row, conflict);
    return true;
  } catch (err) {
    console.error(`db mirror (${table}) failed:`, err.message);
    return false;
  }
}
