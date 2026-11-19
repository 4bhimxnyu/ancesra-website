// "2.8 is here": the five big changes, each with a small picture of the
// feature drawn in the page, a row of the smaller ones, and the story of every
// version so far. The words come from the app's CHANGELOG; the speed is the
// measured 14 to 47 tokens a second. From the Figma frame "Home · 2.8 is here".
import PillButton from "./PillButton";
import { LINKS } from "@/lib/links";

const WAVE = [18, 42, 64, 30, 54, 76, 38, 22, 50, 28, 14];

const ALSO = ["knows 2022 to 2026", "its own notification cards", "stays ready next to the clock", "calendar link", "daily brief", "quiz me",
  "search and pinned chats", "check my setup"];

// version, date, what it was, one line
const STORY = [
  ["v2.0", "25 oct", "the first desktop app", "chats, three modes, answers that stream."],
  ["v2.2", "26 oct", "one click, no terminal", "sets itself up and updates itself."],
  ["v2.3", "27 oct", "knows recent events", "a built-in wikipedia pack, offline."],
  ["v2.4", "29 oct", "it gets to know you", "a profile, and memory that asks first."],
  ["v2.6", "9 nov", "my files, and a new name", "answers from your own pdfs. nexus became ancesra."],
  ["v2.7", "16 nov", "a screen for each job", "chat, code and debug, each with its own screen."],
  ["v2.8", "20 nov", "it listens and talks", "voice, dictation, quick ask, and three times the speed."]
];

function Keys({ keys }) {
  return (
    <div className="u28-keys">
      {keys.map((k, i) => <span key={k} className="u28-keygroup">{i > 0 && <span className="plus">+</span>}<kbd>{k}</kbd></span>)}
    </div>
  );
}

export default function Updates28() {
  return (
    <section className="section whats-new u28" id="new" aria-labelledby="new-title">
      <p className="new-kicker"><b>released 20 nov 2026</b></p>
      <h2 className="section-title" id="new-title">2.8 version <span className="accent">is here</span></h2>
      <div className="features-intro">
        <p>ancesra stopped being only a chat window. it listens, talks, types into other programs, and does small jobs by itself. still offline, still on your own laptop.</p>
        <PillButton href={LINKS.download} download>get 2.8</PillButton>
      </div>

      <div className="u28-grid">
        <article className="u28-card coral wide">
          <span className="num">01</span>
          <h3>it listens. it talks.</h3>
          <p>press the mic and speak. hear any answer in a natural voice, or switch to talk mode for a spoken conversation. your voice never leaves your laptop.</p>
          <div className="u28-art u28-voice" aria-hidden="true">
            <div className="u28-wave">{WAVE.map((h, i) => <b key={i} className={`wave-${h}`} />)}</div>
            <div className="u28-chat">
              <div className="q">what is seventeen times twenty-three?</div>
              <div className="a"><strong>391</strong><span>Listen</span></div>
            </div>
          </div>
        </article>

        <article className="u28-card teal">
          <span className="num">02</span>
          <h3>dictate anywhere</h3>
          <p>one shortcut in any program. speak, and your words are typed where the cursor is.</p>
          <div className="u28-art" aria-hidden="true">
            <Keys keys={["Ctrl", "Alt", "Space"]} />
            <div className="u28-typed">Dear team, <em>the report will be ready by friday</em><i /></div>
          </div>
        </article>

        <article className="u28-card coral">
          <span className="num">03</span>
          <h3>quick ask</h3>
          <p>a small ancesra bar over whatever you are working on.</p>
          <div className="u28-art" aria-hidden="true">
            <Keys keys={["Alt", "Space"]} />
            <div className="u28-bar"><span>ask anything…</span><i>↑</i></div>
            <div className="u28-chips"><span>explain</span><span>summarise</span><span>fix</span><span>rewrite</span></div>
          </div>
        </article>

        <article className="u28-card amber">
          <span className="num">04</span>
          <h3>does it itself</h3>
          <p>timers, reminders, sums and “open spotify” happen at once. small typos are understood.</p>
          <div className="u28-art" aria-hidden="true">
            <div className="u28-said">“set a timr for 5 minuts” <em>→</em></div>
            <div className="u28-timer">
              <div className="top"><span className="t">4:59</span><span className="l">timer · 5 minutes</span></div>
              <div className="track"><b /></div>
            </div>
          </div>
        </article>

        <article className="u28-card coral">
          <span className="num">05</span>
          <h3>three times faster</h3>
          <p>the whole model now runs on a 4 gb graphics card.</p>
          <div className="u28-art u28-speed" aria-hidden="true">
            <div className="big"><strong>47</strong><span>tokens a second</span></div>
            <div className="bars">
              <div><b className="old" /><span>14 before</span></div>
              <div><b className="now" /><span>47 now</span></div>
            </div>
          </div>
        </article>
      </div>

      <ul className="u28-also" aria-label="Also new in 2.8">
        <li className="t" aria-hidden="true">also new</li>
        {ALSO.map((a) => <li key={a}>{a}</li>)}
      </ul>

      <div className="u28-story">
        <h3>the story so far</h3>
        <ol>
          {STORY.map(([v, date, what, line], i) => (
            <li key={v} className={i === STORY.length - 1 ? "now" : undefined}>
              <span className="v">{v}</span>
              <span className="d">{date}</span>
              <span className="w">{what}</span>
              <span className="x">{line}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="new-note">already on 2.7? open ancesra with the internet on and it offers the update.</p>
    </section>
  );
}
