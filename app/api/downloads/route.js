// /api/downloads: the total number of downloads, from download.md.
// Cached for 10 seconds on Vercel's edge, so the count stays near real time
// without calling GitHub for every visitor.
import { getDownloadCount } from "@/lib/downloads";

export async function GET() {
  const count = await getDownloadCount();
  return Response.json({ count }, {
    headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60" }
  });
}
