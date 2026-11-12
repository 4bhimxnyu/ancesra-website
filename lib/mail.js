// The email that carries the download link.
// Sent through a Gmail account with an "app password" (free, about 500 emails
// a day, no domain needed). Two environment variables in Vercel's project
// settings turn it on:
//   GMAIL_USER          the Gmail address the emails come from
//   GMAIL_APP_PASSWORD  a 16-letter app password made for this site (NOT the
//                       account's normal password)
// Until both are set, mailConfigured() is false and the site starts the
// download directly after saving the visitor's details.

import { createHash } from "node:crypto";
import nodemailer from "nodemailer";
import { list, put } from "@vercel/blob";
import { formatSize } from "@/lib/release";

const SITE = "https://ancesra.vercel.app";

export function mailConfigured() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

// ---------- one email per address every 10 minutes ----------
// Without this, anyone could type someone else's address again and again and
// fill their inbox with our emails. A tiny marker file per email (named by a
// hash, so the address isn't readable in the file name) records the last send.
const COOLDOWN_MS = 10 * 60 * 1000;
const markerPrefix = (email) => `mailed/${createHash("sha256").update(email).digest("hex").slice(0, 32)}/`;

export async function recentlyMailed(email) {
  const page = await list({ prefix: markerPrefix(email), limit: 1000 });
  const newest = Math.max(0, ...page.blobs.map((b) => Number(b.pathname.split("/").pop()) || 0));
  return Date.now() - newest < COOLDOWN_MS;
}

async function markMailed(email) {
  await put(`${markerPrefix(email)}${Date.now()}`, "1", { access: "private", contentType: "text/plain", addRandomSuffix: false });
}

// ---------- the email ----------
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// release = { version, url, size } from lib/release.js. Throws if Gmail refuses.
export async function sendDownloadEmail({ name, email, release }) {
  const user = process.env.GMAIL_USER;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, "") }
  });
  const first = name.split(" ")[0];
  const details = `version ${release.version} · ${formatSize(release.size)} · Windows 10 or 11`;

  const text = [
    `hi ${first},`,
    "",
    "here's your download link for ancesra, the ai that runs on your laptop and works offline:",
    "",
    release.url,
    `(${details})`,
    "",
    "how to install:",
    "1. open the downloaded file. windows may say the app is from an unknown publisher, because the installer isn't code-signed yet: choose \"More info\", then \"Run anyway\".",
    "2. open ancesra once with the internet on. it sets itself up (about 2.5 GB, one time).",
    "3. that's it. from then on it works with the internet off.",
    "",
    `guide: ${SITE}/docs`,
    "",
    "you got this email because this address was entered on ancesra.vercel.app. if that wasn't you, just ignore it.",
    "",
    "ancesra ai"
  ].join("\n");

  const html = `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110e;max-width:520px">
<p>hi ${escapeHtml(first)},</p>
<p>here's your download link for <b>ancesra</b>, the ai that runs on your laptop and works offline.</p>
<p><a href="${escapeHtml(release.url)}" style="display:inline-block;padding:12px 22px;background:#ef5a3c;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:600">download ancesra for windows</a></p>
<p style="color:#655d57;font-size:13px">${escapeHtml(details)}</p>
<p><b>how to install</b></p>
<ol style="padding-left:20px">
<li>open the downloaded file. windows may say the app is from an unknown publisher, because the installer isn't code-signed yet: choose <i>More info</i>, then <i>Run anyway</i>.</li>
<li>open ancesra once with the internet on. it sets itself up (about 2.5 GB, one time).</li>
<li>that's it. from then on it works with the internet off.</li>
</ol>
<p><a href="${SITE}/docs" style="color:#bf3a1b">read the guide</a></p>
<p style="color:#655d57;font-size:13px">you got this email because this address was entered on ancesra.vercel.app. if that wasn't you, just ignore it.</p>
</div>`;

  await transport.sendMail({
    from: { name: "ancesra ai", address: user },
    to: email,
    subject: "your ancesra download link",
    text,
    html
  });
  // If the marker can't be written the email has still gone: don't fail the request
  await markMailed(email).catch(() => {});
}
