"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PAGES } from "@/lib/links";

// The site's links. The current page gets the coral underline; on the home
// page, "about" takes it while that section is on screen.
export default function NavLinks({ className = "nav-links", label = "Main", highlight = true }) {
  const pathname = usePathname();
  const [section, setSection] = useState(null);

  useEffect(() => {
    if (!highlight || pathname !== "/" || !("IntersectionObserver" in window)) return;
    const about = document.getElementById("about");
    if (!about) return;
    const observer = new IntersectionObserver(([e]) => setSection(e.isIntersecting ? "about" : null), { rootMargin: "-45% 0px -50% 0px" });
    observer.observe(about);
    return () => observer.disconnect();
  }, [highlight, pathname]);

  const isActive = (href) => {
    if (!highlight) return false;
    if (href === "/#about") return pathname === "/" && section === "about";
    if (href === "/") return pathname === "/" && section !== "about";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className={className} aria-label={label}>
      {PAGES.map((p) => (
        <a key={p.label} href={p.href} className={isActive(p.href) ? "active" : undefined} aria-current={isActive(p.href) && !p.href.includes("#") ? "page" : undefined}>
          {p.label}
        </a>
      ))}
    </nav>
  );
}
