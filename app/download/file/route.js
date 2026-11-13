// /download/file: where the button in the download email leads.
// A link made by this site in the last 7 days (lib/link.js) is sent on to the
// newest installer. Anything else goes to the home page, where the popup opens.
import { getLatestRelease } from "@/lib/release";
import { checkDownloadLink } from "@/lib/link";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const url = new URL(request.url);
  const popup = new URL("/#download", request.url);
  if (!checkDownloadLink(url.searchParams.get("e"), url.searchParams.get("s"))) return Response.redirect(popup, 307);
  const release = await getLatestRelease();
  if (!release) return Response.redirect(popup, 307);
  return Response.redirect(release.url, 302);
}
