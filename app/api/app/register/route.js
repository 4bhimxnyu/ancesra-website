// POST /api/app/register: the desktop app sends the first-run setup details
// here, once (name, email, city, how they heard about Ancesra). lib/appusers.js
import { cleanAppUser, saveAppUser } from "@/lib/appusers";

const answer = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return answer({ ok: false }, 400);
  }
  const user = cleanAppUser(body);
  if (!user) return answer({ ok: false }, 400);
  try {
    await saveAppUser(user);
  } catch {
    return answer({ ok: false }, 503);
  }
  return answer({ ok: true });
}
