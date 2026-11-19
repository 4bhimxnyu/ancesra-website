"use client";

// The app, drawn in the page (hero, right side): the real layout of the
// Ancesra window, with the three things that float beside it since 2.8 (the
// timer card, the dictation pill, the quick-ask bar). It is a picture made of
// HTML, not a screenshot, so it stays sharp at any size and follows the page's
// fonts. Hidden from screen readers: the text next to it says the same.
// From the Figma frame "Home · top of the page".
//
// It plays: a question is typed, the answer appears line by line, and after a
// pause the next of three questions starts. With "reduce motion" switched on,
// the first question and its answer are simply shown.
import { useEffect, useState } from "react";

const BARS = [8, 16, 22, 12, 18, 9];

// question, the answer's first line, its points [bold, rest], the chat it lights in the sidebar
const TALKS = [
  { q: "explain hash maps, fast", lead: "A hash map stores values under keys, and finds any key in about one step.",
    points: [["Hashing:", "the key becomes a number that picks a slot."], ["Lookup:", "average O(1), no searching through the list."], ["Collisions:", "two keys in one slot are kept in a small list."]], chat: 0 },
  { q: "why does my loop skip the last item?", lead: "The range stops one short: it ends before its last number.",
    points: [["Cause:", "range(len(xs) - 1) leaves out the final index."], ["Fix:", "use range(len(xs)), or loop over the list itself."], ["Check:", "print the last index once to be sure."]], chat: 1 },
  { q: "when is my midterm?", lead: "Your handbook says the midterm week starts on 14 December.",
    points: [["Source:", "exam calendar, page 3 of the handbook you added."], ["First paper:", "operating systems, 10 am."], ["Tip:", "say “remind me on 12 December” and it will."]], chat: 2 }
];
const CHATS = ["hash maps, fast", "fix word_count bug", "when is my midterm?", "notes for os exam"];

export default function HeroApp() {
  const [talk, setTalk] = useState(0);
  const [typed, setTyped] = useState(TALKS[0].q.length); // letters of the question shown
  const [lines, setLines] = useState(4); // parts of the answer shown: 0 none … 4 all

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let stop = false;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(3200); // the first answer is read before anything moves
      for (let i = 1; !stop; i = (i + 1) % TALKS.length) {
        setLines(0);
        setTyped(0);
        setTalk(i);
        await wait(500);
        for (let n = 1; n <= TALKS[i].q.length && !stop; n++) { setTyped(n); await wait(34); }
        await wait(450);
        for (let n = 1; n <= 4 && !stop; n++) { setLines(n); await wait(380); }
        await wait(4200);
      }
    })();
    return () => { stop = true; };
  }, []);

  const t = TALKS[talk];
  const writing = typed < t.q.length;

  return (
    <div className="h28-stage" aria-hidden="true">
      <div className="h28-glow" />

      <div className="h28-app">
        <div className="h28-side">
          <div className="h28-brand"><img src="/assets/logo.png" alt="" width="20" height="20" />ancesra</div>
          <div className="h28-new">+ New chat</div>
          <div className="h28-lbl">timers</div>
          <div className="h28-tm"><b data-timer="299">4:59</b><span>pasta</span></div>
          <div className="h28-lbl">chats</div>
          {CHATS.map((c, i) => <div key={c} className={`h28-row${i === t.chat ? " on" : ""}`}>{c}</div>)}
        </div>
        <div className="h28-main">
          <div className="h28-tabs"><span className="on">Chat</span><span>Code</span><span>Debug</span></div>
          <div className="h28-msgs">
            {typed > 0 && <div className={`h28-q${writing ? " writing" : ""}`}>{t.q.slice(0, typed)}</div>}
            {lines > 0 && (
              <div className="h28-a" key={talk}>
                <b className="h28-line">{t.lead}</b>
                <ul>
                  {t.points.slice(0, Math.max(0, lines - 1)).map(([head, rest]) => <li key={head} className="h28-line"><b>{head}</b> {rest}</li>)}
                </ul>
                {lines >= 4 && <div className="h28-tools h28-line"><span className="on">Listen</span><span>Copy</span></div>}
              </div>
            )}
            {typed >= t.q.length && lines === 0 && <div className="h28-think"><i /><i /><i /></div>}
          </div>
          <div className="h28-box"><span>Ask anything…</span><i className="mic" /><i className="send">↑</i></div>
          <div className="h28-offline">offline · nothing leaves this computer</div>
        </div>
      </div>

      <div className="h28-float h28-timer">
        <div className="top"><span className="t" data-timer="299">4:59</span><span className="l">timer · pasta</span></div>
        <div className="track"><b /></div>
      </div>
      <div className="h28-float h28-dict">
        <div className="bars">{BARS.map((h, i) => <b key={i} className={`bar-${h}`} />)}</div>
        <span>listening…</span>
        <em>types into any program</em>
      </div>
      <div className="h28-float h28-quick">
        <div className="kb"><kbd>Alt</kbd>+<kbd>Space</kbd><span>from anywhere</span></div>
        <div className="in"><span>ask anything…</span><i>↑</i></div>
      </div>
    </div>
  );
}
