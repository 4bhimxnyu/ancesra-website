"use client";

// "all of it, offline": every feature as a card in one endless row (the React
// Bits Flex Carousel, FlexCarousel.jsx). The cards are pictures made from the
// page's own design (public/assets/features/01.jpg … 13.jpg, 600 × 800), and
// the same list is in the page as plain text for screen readers and search.
// From the Figma frame "Home · all features, flex carousel".
//
// The row follows the page: the section is tall, its content stays pinned in
// the window while you scroll through it, and how far you have scrolled picks
// the card in the middle (first card at the top of the section, last at the
// bottom). So scrolling never stops here; it turns the row. Dragging still works.
import { useEffect, useRef } from "react";
import FlexCarousel from "./FlexCarousel";

// number, title, the line shown under the row, the sentence for screen readers
const FEATURES = [
  ["01", "chat", "the answer first, key points after", "Chat: ask anything and get the answer first, then the key points."],
  ["02", "code", "the code opens in its own panel", "Code: the conversation stays on the left and the code opens in its own panel."],
  ["03", "debug", "the line to change, then the fix", "Debug: the line to change is marked and the fix is explained step by step."],
  ["04", "my files", "answers from your own documents, with the page", "My files: answers from your own PDFs and notes, with the file and page."],
  ["05", "knows 2022 to 2026", "recent events with sources, still offline", "Knowledge: recent events from 2022 to 2026 with Wikipedia sources, offline."],
  ["06", "memory that asks", "nothing is kept unless you say yes", "Memory: it asks before remembering anything, and you can delete it."],
  ["07", "talk and listen", "speak your question, hear the answer", "Talk and listen: speak your question and hear the answer. New in 2.8."],
  ["08", "dictate anywhere", "ctrl + alt + space, in any program", "Dictate anywhere: Ctrl+Alt+Space types what you say into any program. New in 2.8."],
  ["09", "quick ask", "alt + space, from any program", "Quick ask: Alt+Space opens a small Ancesra bar over any program. New in 2.8."],
  ["10", "timers and reminders", "“remind me at 6 to call mom”", "Timers and reminders, set by a sentence. New in 2.8."],
  ["11", "does it itself", "sums, conversions and “open spotify”, at once", "Sums, unit conversions and opening apps are done by the app itself. New in 2.8."],
  ["12", "three times faster", "the whole model on a 4 gb graphics card", "About three times faster answers on a 4 GB graphics card. New in 2.8."],
  ["13", "private", "nothing leaves your computer", "Private: chats, files and voice never leave your computer."]
];

const ITEMS = FEATURES.map(([n, title, line, alt]) => ({ src: `/assets/features/${n}.jpg`, alt, title, subtitle: line }));

export default function Features() {
  const section = useRef(null);
  const control = useRef(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return undefined;
    let shown = -1, raf = 0;
    const follow = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const travel = box.height - window.innerHeight; // how far the page scrolls while the section is pinned
      if (travel <= 0) return;
      const done = Math.min(1, Math.max(0, -box.top / travel));
      const index = Math.round(done * (ITEMS.length - 1));
      if (index !== shown && control.current) {
        shown = index;
        control.current.goTo(index);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(follow); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const first = setTimeout(follow, 600); // once the row has loaded
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(first);
    };
  }, []);

  return (
    <section className="section f13" id="everything" aria-labelledby="f13-title" ref={section}>
      <div className="f13-pin">
      <div className="f13-head" data-reveal>
        <p className="new-kicker"><b>everything it does</b></p>
        <h2 className="section-title" id="f13-title">all of it, <span className="accent">offline</span></h2>
        <p className="f13-intro">thirteen things ancesra does on your own laptop. keep scrolling: the row turns with you.</p>
      </div>

      <div className="f13-stage">
        <FlexCarousel items={ITEMS} preset="liquid" fit="portrait" radius={26} cardHeight={0.66} gap={22}
          wheel={false} controlRef={control} />
      </div>
      <p className="f13-hint" aria-hidden="true">scroll or drag to move · click a card to open it</p>
      </div>

      <ul className="f13-list">
        {FEATURES.map(([n, , , alt]) => <li key={n}>{alt}</li>)}
      </ul>
    </section>
  );
}
