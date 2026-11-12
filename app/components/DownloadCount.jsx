"use client";

import { useEffect, useState } from "react";

// The live download counter. Refreshes every `every` seconds. big = the
// founder page's large number.
export default function DownloadCount({ initial = null, children = "downloads so far", every = 60, big = false }) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    let stop = false;
    const refresh = async () => {
      try {
        const { count: n } = await (await fetch("/api/downloads", { cache: "no-store" })).json();
        if (!stop && typeof n === "number") setCount((c) => (c === null ? n : Math.max(c, n)));
      } catch {}
    };
    refresh();
    const timer = setInterval(refresh, every * 1000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, [every]);

  if (count === null) return null;
  if (big) {
    return (
      <div className="count-big" aria-live="polite">
        <span className="count-number">{count.toLocaleString("en-IN")}</span>
        <span className="count-label"><span className="count-dot" aria-hidden="true" />{children} · live</span>
      </div>
    );
  }
  return (
    <p className="download-count" aria-live="polite">
      <span className="count-dot" aria-hidden="true" />
      <b>{count.toLocaleString("en-IN")}</b> {children}
    </p>
  );
}
