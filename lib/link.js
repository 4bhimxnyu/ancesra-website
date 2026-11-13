// The link inside the download email.
// It points at this site (/download/file), not at the installer file itself:
// an email from a new address that links straight to a .exe looks like a virus
// email to spam filters. The link carries an expiry time and a signature, so
// only links this site made work, and only for 7 days.

import { createHmac, timingSafeEqual } from "node:crypto";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Any private value only this site knows works as the signing key. The Blob
// store's token is always there in production, so no extra setup is needed.
const secret = () => process.env.DOWNLOAD_LINK_SECRET || process.env.BLOB_READ_WRITE_TOKEN || "";

const sign = (expires) => createHmac("sha256", secret()).update(`download:${expires}`).digest("base64url").slice(0, 32);

export function makeDownloadLink(site) {
  const expires = Date.now() + WEEK_MS;
  return `${site}/download/file?e=${expires}&s=${sign(expires)}`;
}

export function checkDownloadLink(e, s) {
  const expires = Number(e);
  if (!secret() || !expires || !s || Date.now() > expires) return false;
  const a = Buffer.from(sign(expires));
  const b = Buffer.from(String(s));
  return a.length === b.length && timingSafeEqual(a, b);
}
