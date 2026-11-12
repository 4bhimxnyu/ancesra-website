// /api/signups?key=…: every sign-up (name, email, version, place, time) as a
// CSV file that opens in Excel or Google Sheets. For the site's owner only.
// The key is the SIGNUPS_KEY environment variable, set in Vercel's project
// settings. Until it is set, or with a wrong key, this answers 404, the same
// as a page that doesn't exist.
import { timingSafeEqual } from "node:crypto";
import { listSignups } from "@/lib/signups";

export const dynamic = "force-dynamic";

function keyMatches(given) {
  const real = process.env.SIGNUPS_KEY || "";
  if (real.length < 16 || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(real);
  // Compares in the same time whether the first or the last character differs
  return a.length === b.length && timingSafeEqual(a, b);
}

// Quote every cell; a leading = + - @ would run as a formula in a spreadsheet
const cell = (v) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(request) {
  if (!keyMatches(new URL(request.url).searchParams.get("key"))) return new Response("Not found", { status: 404 });
  let rows;
  try {
    rows = await listSignups();
  } catch {
    return new Response("Couldn't read the sign-ups", { status: 503 });
  }
  const lines = [["time (UTC)", "name", "email", "version", "place"].map(cell).join(",")];
  for (const r of rows) lines.push([r.time, r.name, r.email, r.version, r.place].map(cell).join(","));
  // The first character tells Excel the file is UTF-8, so names keep their letters
  return new Response("﻿" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="ancesra-signups.csv"',
      "Cache-Control": "no-store"
    }
  });
}
