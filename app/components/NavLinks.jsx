"use client";

import { useEffect, useState } from "react";
import { LINKS, linkProps } from "@/lib/links";

const ITEMS = [
  { label: "home", href: "#top", section: "top" },
  { label: "about", href: "#about", section: "about" },
  { label: "docs", href: "#features", section: "features" },
  { label: "founder", href: LINKS.founder },
  { label: "contribute", href: LINKS.contribute }
];

// The nav links. The one for the section being read gets the coral underline.
export default function NavLinks({ className = "nav-links", label = "Main", highlight = true }) {
  const [active, setActive] = useState("top");

  useEffect(() => {
    if (!highlight || !("IntersectionObserver" in window)) return;
    const sections = ["about", "features"].map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => observer.observe(s));
    const onScroll = () => { if (window.scrollY < 200) setActive("top"); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [highlight]);

  return (
    <nav className={className} aria-label={label}>
      {ITEMS.map((item) => (
        <a key={item.label} className={highlight && item.section === active ? "active" : undefined} {...linkProps(item.href)}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
