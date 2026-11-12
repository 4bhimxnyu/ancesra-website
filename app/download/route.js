// /download: the popup (app/components/DownloadDialog.jsx) posts a name and
// email here.
// 1. The name and email are saved privately (lib/signups.js). If that fails,
//    nothing else happens.
// 2. The download link is emailed to that address (lib/mail.js), and the popup
//    says "check your inbox".
// 3. The request is added to the anonymous public log (download.md,
//    lib/downloads.js): file, version, time, place. No name or email goes there.
// The answer is JSON: { ok, mode: "email" } or { ok, mode: "direct", url }.
// "direct" (the popup starts the download itself) happens only when email
// isn't set up yet, or Gmail refused to send: the details are saved either way.
//
// Opening /download as a page (an old link, no JavaScript) goes to the home
// page, where "#download" opens the popup.
import { after } from "next/server";
import { headers } from "next/headers";
import { getLatestRelease } from "@/lib/release";
import { isBot, placeFrom, saveDownload } from "@/lib/downloads";
import { cleanSignup, saveSignup } from "@/lib/signups";
import { mailConfigured, recentlyMailed, sendDownloadEmail } from "@/lib/mail";

const answer = (body, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export function GET(request) {
  return Response.redirect(new URL("/#download", request.url), 307);
}

export async function POST(request) {
  const h = await headers();
  let body;
  try {
    body = await request.json();
  } catch {
    return answer({ ok: false, error: "details" }, 400);
  }
  if (isBot(h.get("user-agent") || "")) return answer({ ok: false, error: "details" }, 400);
  // "website" is a hidden field people never see. A script that fills it gets
  // a normal-looking answer and nothing is saved or sent.
  if (body.website) return answer({ ok: true, mode: "email" });

  const signup = cleanSignup(body.name, body.email);
  if (!signup) return answer({ ok: false, error: "details" }, 400);

  const release = await getLatestRelease();
  if (!release) return answer({ ok: false, error: "later" }, 503);

  const place = placeFrom(h);
  try {
    await saveSignup({ ...signup, version: release.version, place });
  } catch {
    return answer({ ok: false, error: "later" }, 503);
  }

  const file = release.url.split("/").pop();
  // Runs after the response, so the visitor isn't kept waiting
  const log = () => after(() => saveDownload({ file, version: release.version, place }).catch(() => {}));

  if (mailConfigured()) {
    try {
      // Asked again within 10 minutes: the first email is still on its way
      if (await recentlyMailed(signup.email)) return answer({ ok: true, mode: "email" });
      await sendDownloadEmail({ ...signup, release });
      log();
      return answer({ ok: true, mode: "email" });
    } catch (err) {
      console.error("download email failed:", err && err.message);
      // Fall through: the details are saved, so let the visitor download
    }
  }

  log();
  return answer({ ok: true, mode: "direct", url: release.url });
}
