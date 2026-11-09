// Downloads: the count and the log.
// - The count shown on the site is GitHub's own download counter for every
//   installer ever released (it rises by itself on each download, no token needed).
// - The log is download.md in this site's own GitHub repo: each download from
//   /download adds a row (file, time, approximate place).
//
// Writing needs GITHUB_TOKEN on Vercel: a fine-grained token with
// "Contents: read and write" on 4bhimxnyu/ancesra-website only. Without it,
// downloads still work and the count is read, but nothing is logged.

const REPO = "4bhimxnyu/ancesra-website";
const FILE = "download.md";
const BRANCH = "main";
const API = `https://api.github.com/repos/${REPO}/contents/${FILE}`;

const TOTAL_RE = /^Total downloads: \*\*(\d+)\*\*$/m;

function headers() {
  const h = { Accept: "application/vnd.github+json", "User-Agent": "ancesra-website" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

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

async function readFile({ fresh = false } = {}) {
  const res = await fetch(`${API}?ref=${BRANCH}`, fresh
    ? { headers: headers(), cache: "no-store" }
    : { headers: headers(), next: { revalidate: 10 } });
  if (!res.ok) return null;
  const data = await res.json();
  return { sha: data.sha, text: Buffer.from(data.content, "base64").toString("utf8") };
}

// Sum of GitHub's download counts for every installer (.exe) of every release.
// Cached 90 s: without a token GitHub allows 60 requests an hour per server.
async function releaseDownloads() {
  const res = await fetch("https://api.github.com/repos/4bhimxnyu/Nexus-releases/releases?per_page=100", {
    headers: headers(),
    next: { revalidate: 90 }
  });
  if (!res.ok) return null;
  let total = 0;
  for (const release of await res.json()) {
    for (const asset of release.assets || []) if (/.exe$/i.test(asset.name)) total += asset.download_count || 0;
  }
  return total;
}

// The number shown on the site. Falls back to download.md's total if GitHub's
// releases can't be read.
export async function getDownloadCount() {
  try {
    const fromReleases = await releaseDownloads();
    if (fromReleases !== null) return fromReleases;
    const file = await readFile();
    const m = file && file.text.match(TOTAL_RE);
    return m ? Number(m[1]) : null;
  } catch {
    return null;
  }
}

const cell = (s) => String(s).replace(/[|\r\n]/g, " ").trim();

// Adds one row and raises the total. Retries when two downloads write at once
// (GitHub then rejects the second write because the file changed).
export async function recordDownload({ file, version, place, time = new Date() }) {
  if (!process.env.GITHUB_TOKEN) return false;
  for (let attempt = 0; attempt < 4; attempt++) {
    const current = await readFile({ fresh: true });
    if (!current) return false;
    const m = current.text.match(TOTAL_RE);
    const total = (m ? Number(m[1]) : 0) + 1;
    const stamp = time.toISOString().replace("T", " ").slice(0, 19) + " UTC";
    const row = `| ${total} | ${cell(file)} | ${cell(version)} | ${stamp} | ${cell(place)} |`;
    const text = current.text.replace(TOTAL_RE, `Total downloads: **${total}**`).replace(/\n*$/, "\n") + row + "\n";
    const res = await fetch(API, {
      method: "PUT",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Download #${total}: ${cell(place)}`,
        content: Buffer.from(text, "utf8").toString("base64"),
        sha: current.sha,
        branch: BRANCH,
        committer: { name: "ancesra downloads", email: "downloads@users.noreply.github.com" }
      }),
      cache: "no-store"
    });
    if (res.ok) return true;
    if (res.status !== 409 && res.status !== 422) return false;
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 700));
  }
  return false;
}
