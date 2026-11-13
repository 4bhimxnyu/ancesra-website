// What the desktop app sends (electron/telemetry.js in the app's repository):
//   app-users/  the setup details, once per install: name, email, city, how
//               they heard about Ancesra, app version
//   app-pings/  at most one a day per install: app version and how many
//               messages were sent in each mode. Numbers only.
// Both live in the site's PRIVATE Blob store, like the website sign-ups, and
// never reach the public download.md. No IP address is stored. Chats and files
// are never sent by the app, so they cannot be here.

import { list, put } from "@vercel/blob";
import { cleanSignup } from "@/lib/signups";

const USERS = "app-users/";
const PINGS = "app-pings/";
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const VERSION_RE = /^\d{1,3}\.\d{1,3}\.\d{1,3}$/;

const tidy = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const store = (pathname) => put(pathname, "1", { access: "private", contentType: "text/plain", addRandomSuffix: false, allowOverwrite: true });

// Returns the cleaned record, or null if anything required is missing or odd
export function cleanAppUser(body) {
  const person = cleanSignup(body && body.name, body && body.email);
  const installId = tidy(body && body.installId, 40).toLowerCase();
  const version = tidy(body && body.version, 12);
  const city = tidy(body && body.city, 60);
  const source = tidy(body && body.source, 60);
  if (!person || !ID_RE.test(installId) || !VERSION_RE.test(version) || city.length < 2 || !source) return null;
  return { ...person, city, source, version, installId };
}

export function cleanPing(body) {
  const installId = tidy(body && body.installId, 40).toLowerCase();
  const version = tidy(body && body.version, 12);
  if (!ID_RE.test(installId) || !VERSION_RE.test(version)) return null;
  const count = (v) => Math.max(0, Math.min(100000, Math.floor(Number(v) || 0)));
  const m = (body && body.modes) || {};
  const modes = { chat: count(m.chat), coding: count(m.coding), debug: count(m.debug) };
  return { installId, version, modes };
}

// The record lives in the file name (as in lib/signups.js), so one listing
// returns everything. One folder per install; if details are sent again, the
// newest file wins when reading.
export async function saveAppUser(user, time = new Date()) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("No Blob store connected");
  const stamp = String(time.getTime()).padStart(15, "0");
  await store(`${USERS}${user.installId}/${stamp}__${encode({ ...user, time: time.toISOString() })}`);
}

// One file per install per day
export async function savePing(ping, time = new Date()) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("No Blob store connected");
  const day = time.toISOString().slice(0, 10);
  await store(`${PINGS}${day}/${ping.installId}__${encode(ping)}`);
}

async function listAll(prefix) {
  const names = [];
  let cursor;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    for (const blob of page.blobs) names.push(blob.pathname.slice(prefix.length));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return names.sort();
}

const decode = (data) => {
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
  } catch {
    return null;
  }
};

// Every app user, oldest first, with their days active and message totals
export async function listAppUsers() {
  const users = new Map();
  for (const name of await listAll(USERS)) {
    const row = decode(name.split("__")[1] || "");
    if (!row) continue;
    const first = users.get(row.installId);
    // Sorted by time, so later files replace the details but keep the first date
    users.set(row.installId, { ...row, time: first ? first.time : row.time, days: 0, lastDay: "", chat: 0, coding: 0, debug: 0 });
  }
  for (const name of await listAll(PINGS)) {
    const [day, rest = ""] = name.split("/");
    const ping = decode(rest.split("__")[1] || "");
    const user = ping && users.get(ping.installId);
    if (!user) continue;
    user.days += 1;
    user.lastDay = day;
    user.version = ping.version;
    for (const m of ["chat", "coding", "debug"]) user[m] += (ping.modes && ping.modes[m]) || 0;
  }
  return [...users.values()].sort((a, b) => (a.time < b.time ? -1 : 1));
}
