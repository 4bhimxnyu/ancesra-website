// Adds new downloads to download.md. Run by .github/workflows/sync-downloads.yml.
// Reads every recorded download from the website (/api/downloads/log), skips
// the ones already written (.downloads-synced holds the last id), and appends
// one row per new download. No dependencies: Node 20+ only.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const SITE = process.env.SITE_URL || "https://ancesra.vercel.app";
const TOTAL_RE = /^Total downloads: \*\*(\d+)\*\*$/m;
const cell = (s) => String(s ?? "").replace(/[|\r\n]/g, " ").trim();

const res = await fetch(`${SITE}/api/downloads/log`);
if (!res.ok) {
  console.error(`The website answered ${res.status}; trying again next run.`);
  process.exit(0);
}
const { events } = await res.json();

const last = existsSync(".downloads-synced") ? readFileSync(".downloads-synced", "utf8").trim() : "";
const fresh = events.filter((e) => e.id > last);
if (!fresh.length) {
  console.log("No new downloads.");
  process.exit(0);
}

let md = readFileSync("download.md", "utf8").replace(/\r\n/g, "\n");
let total = Number((md.match(TOTAL_RE) || [])[1] || 0);
const rows = fresh.map((e) => {
  total++;
  const time = new Date(e.time).toISOString().replace("T", " ").slice(0, 19) + " UTC";
  return `| ${total} | ${cell(e.file)} | ${cell(e.version)} | ${time} | ${cell(e.place)} |`;
});
md = md.replace(TOTAL_RE, `Total downloads: **${total}**`).replace(/\n*$/, "\n") + rows.join("\n") + "\n";

writeFileSync("download.md", md);
writeFileSync(".downloads-synced", fresh[fresh.length - 1].id + "\n");
console.log(`Added ${fresh.length} download(s); total ${total}.`);
