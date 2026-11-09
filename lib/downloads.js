// Downloads: the count and the log.
// - The count shown on the site is GitHub's own download counter for every
//   installer ever released (it rises by itself on each download).
// - The log: each download from /download is saved as a tiny record in the
//   site's private Vercel Blob store (saveDownload). Every 30 minutes a GitHub
//   Action (.github/workflows/sync-downloads.yml) reads them from
//   /api/downloads/log and adds them as rows to download.md.
// No personal GitHub token is involved: Vercel provides BLOB_READ_WRITE_TOKEN,
// and GitHub Actions can write to their own repo.

import { list, put } from "@vercel/blob";

const PREFIX = "downloads/";

// Link previews, crawlers and scripts shouldn't count as downloads
const BOT_RE = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|slack|curl|wget|python|go-http|headless|lighthouse/i;
export function isBot(userAgent = "") {
  return !userAgent || BOT_RE.test(userAgent);
}

// Approximate place from Vercel's request headers (worked out from the IP
// address, which itself is never stored)
export function placeFrom(headersList) {
  const decode = (v) => { try { return v ? decodeURIComponent(v) : ""; } catch { return v || ""; } };
  const city = decode(headersList.get("x-vercel-ip-city"));
  const region = decode(headersList.get("x-vercel-ip-country-region"));
  const code = headersList.get("x-vercel-ip-country") || "";
  let country = code;
  try {
    if (code) country = new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {}
  return [city, region && region !== city ? region : "", country].filter(Boolean).join(", ") || "Unknown";
}

// ---------- the count ----------

// Sum of GitHub's download counts for every installer (.exe) of every release.
// Cached 90 s: without a token GitHub allows 60 requests an hour per server.
export async function getDownloadCount() {
  try {
    const res = await fetch("https://api.github.com/repos/4bhimxnyu/Nexus-releases/releases?per_page=100", {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "ancesra-website" },
      next: { revalidate: 90 }
    });
    if (!res.ok) return null;
    let total = 0;
    for (const release of await res.json()) {
      for (const asset of release.assets || []) if (/\.exe$/i.test(asset.name)) total += asset.download_count || 0;
    }
    return total;
  } catch {
    return null;
  }
}

// ---------- the log ----------

// The record lives in the file name itself, so listing the store returns every
// download without reading each file:
//   downloads/<time in ms, 15 digits>-<random>__<base64url JSON>
export async function saveDownload({ file, version, place, time = new Date() }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  const data = Buffer.from(JSON.stringify({ file, version, place, time: time.toISOString() })).toString("base64url");
  const id = `${String(time.getTime()).padStart(15, "0")}-${Math.random().toString(36).slice(2, 8)}`;
  await put(`${PREFIX}${id}__${data}`, "1", { access: "private", contentType: "text/plain", addRandomSuffix: false });
  return true;
}

// Every saved download, oldest first: [{ id, file, version, place, time }]
export async function listDownloads() {
  const events = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      const [id, data] = blob.pathname.slice(PREFIX.length).split("__");
      try {
        events.push({ id, ...JSON.parse(Buffer.from(data, "base64url").toString("utf8")) });
      } catch {
        // Not one of ours: skip it
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return events.sort((a, b) => (a.id < b.id ? -1 : 1));
}
