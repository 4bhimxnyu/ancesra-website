// /api/app/users?key=…: everyone who set up the desktop app, as a CSV file,
// with how many days they used it and their message counts per mode.
// Same key as /api/signups (SIGNUPS_KEY); 404 without it.
import { timingSafeEqual } from "node:crypto";
import { listAppUsers } from "@/lib/appusers";

export const dynamic = "force-dynamic";

function keyMatches(given) {
  const real = process.env.SIGNUPS_KEY || "";
  if (real.length < 16 || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(real);
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
    rows = await listAppUsers();
  } catch {
    return new Response("Couldn't read the app users", { status: 503 });
  }
  const head = ["set up (UTC)", "name", "email", "city", "heard from", "version", "days used", "last used", "chat messages", "coding messages", "debug messages"];
  const lines = [head.map(cell).join(",")];
  for (const r of rows) lines.push([r.time, r.name, r.email, r.city, r.source, r.version, r.days, r.lastDay, r.chat, r.coding, r.debug].map(cell).join(","));
  // The first character tells Excel the file is UTF-8, so names keep their letters
  return new Response("﻿" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="ancesra-app-users.csv"',
      "Cache-Control": "no-store"
    }
  });
}
