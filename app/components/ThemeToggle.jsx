"use client";

import { useEffect, useState } from "react";

// The light / dark switch in the header. Dark is the default. The choice is
// kept in localStorage and applied before the first paint by the small script
// in app/layout.jsx, so the page never flashes the wrong theme.
export const THEME_KEY = "ancesra-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  // Read what the layout script already applied
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    const root = document.documentElement;
    // Cross-fade the colours for a moment, then remove the class so normal
    // hover transitions go back to their own timings
    root.classList.add("theme-switching");
    root.dataset.theme = next;
    setTimeout(() => root.classList.remove("theme-switching"), 400);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "light" ? "#f6f1ea" : "#070707");
    // Private windows can block storage; the switch still works for this visit
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    setTheme(next);
  }

  const label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";
  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label={label} title={label}>
      <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
      </svg>
      <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2z" />
      </svg>
    </button>
  );
}
