"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PAGES } from "@/lib/links";

// The phone menu. Under 720px the header has no room for the page links, so
// they move into a panel that drops down from the header (mobile.css).
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    // Rotating to a wide screen brings the normal links back: close the panel
    const wide = window.matchMedia("(min-width: 721px)");
    const onWide = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
      <nav className="mobile-menu" id="mobile-menu" aria-label="Menu" hidden={!open}>
        {PAGES.map((p, i) => (
          <a key={p.label} href={p.href} style={{ "--i": i }} onClick={() => setOpen(false)}
            aria-current={!p.href.includes("#") && pathname === p.href ? "page" : undefined}>
            <span>{p.label}</span>
            <small>0{i + 1}</small>
          </a>
        ))}
      </nav>
    </>
  );
}
