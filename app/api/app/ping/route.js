// POST /api/app/ping: at most once a day the desktop app says it was opened:
// its version and how many messages were sent per mode. lib/appusers.js
import { cleanPing, savePing } from "@/lib/appusers";

const answer = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return answer({ ok: false }, 400);
  }
  const ping = cleanPing(body);
  if (!ping) return answer({ ok: false }, 400);
  try {
    await savePing(ping);
  } catch {
    return answer({ ok: false }, 503);
  }
  return answer({ ok: true });
}
