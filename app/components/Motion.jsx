"use client";

// The home page's movement that needs a script (the rest is plain CSS in
// globals.css, "home page motion"). It draws nothing itself.
//
// - [data-reveal]: gets the class "is-in" the first time it scrolls into view;
//   the CSS does the rest (cards rising, tags popping, the story line drawing).
// - [data-count="47"] (optional data-from="14"): the number runs up when seen.
// - [data-timer="299"]: a timer that really counts down, as 4:59, and starts again.
// - .marquee-track: scrolls faster for a moment in the direction the page is scrolled.
// - .h28-app: leans a few degrees toward the pointer.
//
// With "reduce motion" switched on in the system, none of this runs and the
// page is shown still. Until this has started, nothing is hidden: the hidden
// starting states in the CSS only apply under html.motion-on.
import { useEffect } from "react";

const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function Motion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const root = document.documentElement;
    root.classList.add("motion-on");
    const stops = [];

    // ---- into view
    const count = (el) => {
      const to = Number(el.dataset.count), from = Number(el.dataset.from || 0), t0 = performance.now(), ms = 900;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms), eased = 1 - Math.pow(1 - k, 3);
        el.textContent = String(Math.round(from + (to - from) * eased)) + (el.dataset.suffix || "");
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const seen = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        if (e.target.dataset.count) count(e.target);
        e.target.querySelectorAll("[data-count]").forEach(count);
        seen.unobserve(e.target);
      }
    }, { threshold: 0.2, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll("[data-reveal], [data-count]:not([data-reveal] [data-count])").forEach((el) => seen.observe(el));
    stops.push(() => seen.disconnect());

    // ---- timers that count
    const timers = [...document.querySelectorAll("[data-timer]")].map((el) => ({ el, from: Number(el.dataset.timer), left: Number(el.dataset.timer) }));
    if (timers.length) {
      const id = setInterval(() => {
        for (const t of timers) {
          t.left = t.left > 1 ? t.left - 1 : t.from;
          t.el.textContent = clock(t.left);
        }
      }, 1000);
      stops.push(() => clearInterval(id));
    }

    // ---- the marquee follows the scroll
    const track = document.querySelector(".marquee-track");
    if (track && track.getAnimations) {
      let last = window.scrollY, rate = 1, raf = 0;
      const settle = () => {
        rate += (1 - rate) * 0.06;
        const anim = track.getAnimations()[0];
        if (anim) anim.playbackRate = rate;
        raf = Math.abs(rate - 1) > 0.02 ? requestAnimationFrame(settle) : 0;
      };
      const onScroll = () => {
        const dy = window.scrollY - last;
        last = window.scrollY;
        rate = Math.max(-3, Math.min(4, 1 + dy / 14));
        if (!raf) raf = requestAnimationFrame(settle);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      stops.push(() => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); });
    }

    // ---- the drawn app leans toward the pointer
    const stage = document.querySelector(".h28-stage");
    const app = stage && stage.querySelector(".h28-app");
    if (app && window.matchMedia("(hover: hover)").matches) {
      const onMove = (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        app.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
        app.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
      };
      const onLeave = () => { app.style.setProperty("--ry", "0deg"); app.style.setProperty("--rx", "0deg"); };
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
      stops.push(() => { stage.removeEventListener("pointermove", onMove); stage.removeEventListener("pointerleave", onLeave); });
    }

    return () => { stops.forEach((s) => s()); root.classList.remove("motion-on"); };
  }, []);
  return null;
}
