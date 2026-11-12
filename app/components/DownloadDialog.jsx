"use client";

import { useEffect, useRef, useState } from "react";

const ERRORS = {
  details: "please enter your name and a valid email address.",
  later: "that didn't work just now. please try again in a minute."
};

// The download popup. Every download button on the site is a link to
// /download; this catches the click and opens the popup instead. It asks for
// a name and an email, sends them to /download, and then either says "check
// your inbox" (the link was emailed) or starts the download (email not set up
// yet: `mail` is false).
// A native <dialog>: the browser handles Escape, the dimmed background and
// keeping the keyboard focus inside.
export default function DownloadDialog({ mail }) {
  const dialog = useRef(null);
  const [state, setState] = useState("form"); // form | sending | emailed | direct
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const open = () => {
      const d = dialog.current;
      if (d && !d.open) {
        setState("form");
        setError(null);
        d.showModal();
      }
    };
    const onClick = (e) => {
      // Let ctrl/middle clicks do their normal thing
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest && e.target.closest('a[href="/download"]');
      if (!link) return;
      e.preventDefault();
      open();
    };
    document.addEventListener("click", onClick);
    // /download opened as a page lands on /#download
    if (window.location.hash === "#download") {
      open();
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    return () => document.removeEventListener("click", onClick);
  }, []);

  async function submit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), email: form.get("email"), website: form.get("website") })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "later");
      setEmail(String(form.get("email")).trim());
      if (data.mode === "direct" && data.url) {
        setUrl(data.url);
        setState("direct");
        // The address is a file, so the browser downloads it and stays here
        window.location.assign(data.url);
      } else {
        setState("emailed");
      }
    } catch (err) {
      setError(ERRORS[err.message] ? err.message : "later");
      setState("form");
    }
  }

  const close = () => dialog.current && dialog.current.close();
  const done = state === "emailed" || state === "direct";

  return (
    <dialog className="dl-dialog" ref={dialog} aria-labelledby="dl-title"
      // A click on the dimmed background (the dialog element itself) closes it
      onClick={(e) => { if (e.target === dialog.current) close(); }}>
      <div className="dl-body">
        <button className="dl-close" type="button" onClick={close} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        {state === "emailed" ? (
          <div className="dl-done" role="status">
            <span className="dl-tick" aria-hidden="true">✓</span>
            <h2 id="dl-title">check your inbox</h2>
            <p>we sent the download link to <b>{email}</b>. it should arrive within a minute. not there? look in spam or promotions.</p>
            <button className="text-link dl-again" type="button" onClick={() => setState("form")}>use a different email</button>
          </div>
        ) : state === "direct" ? (
          <div className="dl-done" role="status">
            <span className="dl-tick" aria-hidden="true">✓</span>
            <h2 id="dl-title">your download is starting</h2>
            <p>when it finishes, open the file to install. windows may warn about an unknown publisher: choose <i>More info</i>, then <i>Run anyway</i>.</p>
            {url ? <a className="text-link dl-again" href={url}>didn&apos;t start? download again</a> : null}
          </div>
        ) : (
          <>
            <h2 id="dl-title">get ancesra</h2>
            <p className="dl-lead">{mail
              ? "tell us where to send it. the download link arrives by email in a minute."
              : "two quick things, then your download starts."}</p>

            <form className="dl-form" onSubmit={submit}>
              {error ? <p className="form-error" role="alert">{ERRORS[error]}</p> : null}

              <label htmlFor="dl-name">your name</label>
              <input id="dl-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} placeholder="e.g. riya sharma" />

              <label htmlFor="dl-email">email</label>
              <input id="dl-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={120} placeholder="you@example.com" />

              {/* Hidden from people; scripts that fill every field are ignored */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="dl-website">leave this empty</label>
                <input id="dl-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <button className={mail ? "pill" : "pill is-download"} type="submit" disabled={state === "sending"}>
                {state === "sending" ? "one moment…" : mail ? "email me the link" : "download for windows"}
                <span className="pill-arrow" aria-hidden="true" />
              </button>
            </form>

            <p className="form-note">free, forever. we keep your name and email privately, to know who uses ancesra and to contact you about it. never sold, never shown in public. the app itself has no account.</p>
          </>
        )}
        {done ? <button className="pill outline dl-ok" type="button" onClick={close}>done<span className="pill-arrow" aria-hidden="true" /></button> : null}
      </div>
    </dialog>
  );
}
