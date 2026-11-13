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
import { makeDownloadLink } from "@/lib/link";

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
  // A link to this site, not to the .exe: see lib/link.js
  const link = makeDownloadLink(SITE);
  const details = `version ${release.version} · ${formatSize(release.size)} · Windows 10 or 11`;

  const text = [
    `Hi ${first},`,
    "",
    "Thanks for trying Ancesra, the AI that runs on your laptop and works offline. Here is your download link:",
    "",
    link,
    `(${details}. The link works for 7 days.)`,
    "",
    "After installing, open Ancesra once with the internet on. It sets itself up (about 2.5 GB, one time), and from then on it works with the internet off.",
    "",
    `Step-by-step install guide: ${SITE}/docs#install`,
    "",
    "You got this email because this address was entered on ancesra.vercel.app. If that was not you, you can ignore it.",
    "",
    "Abhimanyu",
    "Ancesra AI"
  ].join("\n");

  const html = `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110e;max-width:520px">
<p>Hi ${escapeHtml(first)},</p>
<p>Thanks for trying <b>Ancesra</b>, the AI that runs on your laptop and works offline. Here is your download link:</p>
<p><a href="${escapeHtml(link)}" style="display:inline-block;padding:12px 22px;background:#ef5a3c;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:600">Download Ancesra for Windows</a></p>
<p style="color:#655d57;font-size:13px">${escapeHtml(details)}. The link works for 7 days.</p>
<p>After installing, open Ancesra once with the internet on. It sets itself up (about 2.5 GB, one time), and from then on it works with the internet off.</p>
<p><a href="${SITE}/docs#install" style="color:#bf3a1b">Step-by-step install guide</a></p>
<p style="color:#655d57;font-size:13px">You got this email because this address was entered on ancesra.vercel.app. If that wasn't you, you can ignore it.</p>
<p>Abhimanyu<br>Ancesra AI</p>
</div>`;

  await transport.sendMail({
    from: { name: "Ancesra AI", address: user },
    replyTo: user,
    to: email,
    subject: "Your Ancesra download link",
    text,
    html
  });
  // If the marker can't be written the email has still gone: don't fail the request
  await markMailed(email).catch(() => {});
}
