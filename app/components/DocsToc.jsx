"use client";

import { useEffect, useRef, useState } from "react";

// The "on this page" menu of /docs. The section you're reading is shown in
// white with a coral line; clicking a link jumps there and marks it at once.
export default function DocsToc({ items }) {
  const [active, setActive] = useState(items[0][0]);
  // The link last clicked: near the bottom of the page several sections fit on
  // screen at once, and the clicked one should stay marked
  const clicked = useRef(null);
  const list = useRef(null);

  // On phones the menu is one scrolling row of chips (mobile.css): slide the
  // row so the current chip stays in view. scrollTo on the row only, so the
  // page itself never jumps.
  useEffect(() => {
    const ol = list.current;
    if (!ol || ol.scrollWidth <= ol.clientWidth) return;
    const a = ol.querySelector("a.active");
    if (a) ol.scrollTo({ left: a.offsetLeft - (ol.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // At the very bottom the last section can't scroll to the top: mark it anyway
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        const el = clicked.current && document.getElementById(clicked.current);
        setActive(el && el.getBoundingClientRect().top < window.innerHeight ? clicked.current : items[items.length - 1][0]);
        return;
      }
      // Otherwise: the last section whose heading has passed the line below the sticky header
      let current = items[0][0];
      for (const [id] of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    // Scrolling by hand (wheel, touch, keys) forgets the click
    const forget = () => { clicked.current = null; };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    for (const ev of ["wheel", "touchstart", "keydown"]) window.addEventListener(ev, forget, { passive: true });
    return () => {
      for (const ev of ["wheel", "touchstart", "keydown"]) window.removeEventListener(ev, forget);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav className="docs-toc" aria-label="On this page">
      <p>on this page</p>
      <ol ref={list}>
        {items.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} className={active === id ? "active" : undefined} aria-current={active === id ? "location" : undefined}
              onClick={() => { clicked.current = id; setActive(id); }}>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
