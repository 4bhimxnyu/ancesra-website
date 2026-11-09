// /download: sends the browser straight to the newest Windows installer, so
// clicking "download" starts the download (no GitHub page in between).
// After the redirect is sent, the download is saved for the log (download.md)
// (lib/downloads.js). If GitHub can't be reached, falls back to the release page.
import { after } from "next/server";
import { headers } from "next/headers";
import { getLatestRelease, RELEASES_PAGE } from "@/lib/release";
import { isBot, placeFrom, saveDownload } from "@/lib/downloads";

export async function GET() {
  const release = await getLatestRelease();
  const h = await headers();

  if (release && !isBot(h.get("user-agent") || "")) {
    const file = release.url.split("/").pop();
    const place = placeFrom(h);
    // Runs after the response, so the download isn't slowed down
    after(() => saveDownload({ file, version: release.version, place }).catch(() => {}));
  }

  return Response.redirect(release ? release.url : RELEASES_PAGE, 302);
}
