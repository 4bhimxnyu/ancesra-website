"use client";

// "all of it, offline": every feature as a card in one endless row (the React
// Bits Flex Carousel, FlexCarousel.jsx). The cards are pictures made from the
// page's own design (public/assets/features/01.jpg … 13.jpg, 600 × 800), and
// the same list is in the page as plain text for screen readers and search.
// From the Figma frame "Home · all features, flex carousel".
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
  return (
    <section className="section f13" id="everything" aria-labelledby="f13-title">
      <div className="f13-head" data-reveal>
        <p className="new-kicker"><b>everything it does</b></p>
        <h2 className="section-title" id="f13-title">all of it, <span className="accent">offline</span></h2>
        <p className="f13-intro">thirteen things ancesra does on your own laptop. drag the row, or let it drift.</p>
      </div>

      <div className="f13-stage">
        <FlexCarousel items={ITEMS} preset="liquid" fit="portrait" radius={26} cardHeight={0.66} gap={22}
          autoplay interval={3.5} captureWheel={false} />
      </div>
      <p className="f13-hint" aria-hidden="true">drag to move · click a card to open it</p>

      <ul className="f13-list">
        {FEATURES.map(([n, , , alt]) => <li key={n}>{alt}</li>)}
      </ul>
    </section>
  );
}
