// Sign-ups: the name and email asked for before a download (app/get).
// Each one is saved in the site's PRIVATE Vercel Blob store, under signups/,
// away from the download log (downloads/), so names and emails can never reach
// the public download.md. Read them back as a spreadsheet from /api/signups.

import { list, put } from "@vercel/blob";

const PREFIX = "signups/";

// Tidy and check what the form sent. Returns { name, email } or null.
export function cleanSignup(rawName, rawEmail) {
  const name = String(rawName || "").replace(/\s+/g, " ").trim();
  const email = String(rawEmail || "").trim().toLowerCase();
  if (name.length < 2 || name.length > 80) return null;
  // One @, something before it, a dot somewhere after it, no spaces
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null;
  return { name, email };
}

// Like the download log, the record lives in the file name, so listing the
// store returns every sign-up without opening each file:
//   signups/<time in ms, 15 digits>-<random>__<base64url JSON>
// Throws if the store can't be written: the caller must not start the download.
export async function saveSignup({ name, email, version, place, time = new Date() }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("No Blob store connected");
  const data = Buffer.from(JSON.stringify({ name, email, version, place, time: time.toISOString() })).toString("base64url");
  const id = `${String(time.getTime()).padStart(15, "0")}-${Math.random().toString(36).slice(2, 8)}`;
  await put(`${PREFIX}${id}__${data}`, "1", { access: "private", contentType: "text/plain", addRandomSuffix: false });
}

// Every sign-up, oldest first: [{ name, email, version, place, time }]
export async function listSignups() {
  const rows = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      const [id, data] = blob.pathname.slice(PREFIX.length).split("__");
      try {
        rows.push({ id, ...JSON.parse(Buffer.from(data, "base64url").toString("utf8")) });
      } catch {
        // Not one of ours: skip it
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return rows.sort((a, b) => (a.id < b.id ? -1 : 1));
}
