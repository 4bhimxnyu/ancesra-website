// /download: sends the browser straight to the newest Windows installer, so
// clicking "download" starts the download (no GitHub page in between).
// If GitHub can't be reached, falls back to the release page.
import { getLatestRelease, RELEASES_PAGE } from "@/lib/release";

export async function GET() {
  const release = await getLatestRelease();
  return Response.redirect(release ? release.url : RELEASES_PAGE, 302);
}
