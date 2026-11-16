// /api/db/sync?key=…: copies everything in the private Blob store (website
// sign-ups, app users, daily counts) into the database (lib/db.js). Run it once
// after connecting the database, and again any time to fill in rows that were
// missed while the database was unreachable. Running it twice changes nothing.
// For the site's owner only: same key as /api/signups (SIGNUPS_KEY); 404 without it.
import { timingSafeEqual } from "node:crypto";
import { dbReady, upsert } from "@/lib/db";
import { listSignups } from "@/lib/signups";
import { listAppUsers, listPings } from "@/lib/appusers";

export const dynamic = "force-dynamic";

function keyMatches(given) {
  const real = process.env.SIGNUPS_KEY || "";
  if (real.length < 16 || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(real);
  return a.length === b.length && timingSafeEqual(a, b);
}

// 500 rows per request keeps each one small
async function send(table, rows, conflict) {
  for (let i = 0; i < rows.length; i += 500) await upsert(table, rows.slice(i, i + 500), conflict);
  return rows.length;
}

export async function GET(request) {
  if (!keyMatches(new URL(request.url).searchParams.get("key"))) return new Response("Not found", { status: 404 });
  if (!dbReady()) return Response.json({ ok: false, error: "The database is not connected: set SUPABASE_URL and SUPABASE_SECRET_KEY in Vercel, then redeploy." }, { status: 503 });
  try {
    const signups = (await listSignups()).map((r) => ({ id: r.id, time: r.time, name: r.name, email: r.email, version: r.version, place: r.place }));
    const users = (await listAppUsers()).map((u) => ({ install_id: u.installId, time: u.time, name: u.name, email: u.email, city: u.city, source: u.source, version: u.version }));
    const pings = (await listPings()).map((p) => ({ day: p.day, install_id: p.installId, version: p.version, chat: (p.modes && p.modes.chat) || 0, coding: (p.modes && p.modes.coding) || 0, debug: (p.modes && p.modes.debug) || 0 }));
    const copied = {
      signups: await send("signups", signups, "id"),
      app_users: await send("app_users", users, "install_id"),
      app_pings: await send("app_pings", pings, "day,install_id")
    };
    return Response.json({ ok: true, copied }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 502 });
  }
}
