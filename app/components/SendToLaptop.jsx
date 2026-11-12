"use client";

import { useState } from "react";

// Phones only (mobile.css shows it under 720px). Ancesra is a Windows app, so
// a visitor on a phone can't install it there: this hands the link to their
// laptop through the phone's own share sheet (WhatsApp, email, notes…), or
// copies it when the browser has no share sheet. Nothing is sent to us.
export default function SendToLaptop() {
  const [copied, setCopied] = useState(false);

  async function send() {
    const url = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({ title: "ancesra ai", text: "free ai that works offline. open this on a windows laptop:", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Closing the share sheet throws; nothing to do
    }
  }

  return (
    <p className="send-laptop">
      on your phone? ancesra runs on windows laptops.{" "}
      <button type="button" onClick={send} aria-live="polite">{copied ? "link copied ✓" : "send the link to your laptop"}</button>
    </p>
  );
}
