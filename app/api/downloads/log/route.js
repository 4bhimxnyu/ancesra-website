// /api/downloads/log: every recorded download (file, version, time, place),
// read by the GitHub Action that writes download.md. The same information is
// public in download.md, so this needs no secret.
// Listing the store costs a Blob operation, so the result is kept for 5 minutes
// per server, whatever the URL's query string.
import { listDownloads } from "@/lib/downloads";

let cached = null; // { at, events }

export async function GET() {
  if (!cached || Date.now() - cached.at > 5 * 60 * 1000) {
    try {
      cached = { at: Date.now(), events: await listDownloads() };
    } catch {
      return Response.json({ error: "Couldn't read the download log" }, { status: 503 });
    }
  }
  return Response.json({ events: cached.events }, {
    headers: { "Cache-Control": "public, s-maxage=300" }
  });
}
