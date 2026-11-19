// The ancesra ai landing page, from the Figma "Landing — v2 (editorial)" frame.
import Image from "next/image";
import OfflineToggle from "./components/OfflineToggle";
import DownloadCount from "./components/DownloadCount";
import PillButton from "./components/PillButton";
import SendToLaptop from "./components/SendToLaptop";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { LINKS } from "@/lib/links";

const MARQUEE = ["works offline", "zero cloud", "free forever", "your files stay yours", "no account", "runs on your laptop"];

// What changed in version 2.8 (from the app's CHANGELOG)
const NEW_28 = [
  { cls: "new-chat", title: "talk", text: "press the mic and speak. listen to any answer in a natural voice, or switch to talk mode for a spoken conversation. your voice never leaves your laptop." },
  { cls: "new-code", title: "anywhere", text: "ctrl+alt+space types what you say into any program. alt+space opens a small ancesra bar over whatever you're working on." },
  { cls: "new-debug", title: "faster", text: "about three times faster answers on a 4 gb graphics card. timers, reminders, sums and “open spotify” happen at once, done by the app itself." }
];

// What changed in version 2.7, with real screenshots
const NEW_27 = [
  { cls: "new-chat", title: "chat", text: "one calm reading column. think it through in plain words.",
    img: "/assets/v27-chat.jpg", alt: "Ancesra 2.7 in Chat: a question and a short answer in one reading column" },
  { cls: "new-code", title: "code", text: "the chat stays on the left. the code opens in its own panel on the right, ready to copy or save.",
    img: "/assets/v27-code.jpg", alt: "Ancesra 2.7 in Code: the conversation on the left and the code in a panel on the right" },
  { cls: "new-debug", title: "debug", text: "paste what's broken. the line to change gets marked, and the fix is explained step by step.",
    img: "/assets/v27-debug.jpg", alt: "Ancesra 2.7 in Debug: the pasted code with line 3 marked and numbered cards explaining the fix" }
];

const STATS = [
  ["100%", "offline, always"],
  ["0", "chats sent. ever."],
  ["1", "download. that's it."]
];

// The four cards with an app preview (exported from Figma); the fifth is "private"
const CARDS = [
  { cls: "card-chat", num: "01", title: "chat", text: "ask literally anything. answer first, key points after, zero yapping. it knows 2022–2026 stuff too, with sources, offline.",
    img: "/assets/preview-chat.png", w: 812, h: 330, alt: "Ancesra chat answering “Why is Python so popular?” with key points and a Wikipedia source" },
  { cls: "card-code", num: "02", title: "code", text: "say the function name and language. approach, full code, time + space complexity. in 2.7 the code opens in its own panel.",
    img: "/assets/preview-code.png", w: 388, h: 330, alt: "Ancesra writing reverse_list(head) in Python with its time and space complexity" },
  { cls: "card-files", num: "03", title: "my files", text: "drop in notes, pdfs, the hostel handbook. it answers from your files and cites the page. nothing gets uploaded.",
    img: "/assets/preview-files.png", w: 379, h: 230, alt: "The My files page with a drop zone and a file being indexed" },
  { cls: "card-debug", num: "04", title: "debug", text: "paste the broken function. 2.7 marks the line to change, then shows what's wrong and the fix, step by step.",
    img: "/assets/preview-debug.png", w: 379, h: 230, alt: "Ancesra in Debug mode, ready for a broken function" }
];

function CardTitle({ num, children }) {
  return <h3><span className="num">{num}</span>{children}</h3>;
}

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* Hero */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-art" aria-hidden="true">
            <img className="halo" src="/assets/halo.svg" alt="" />
            <div className="blob blob-hero" />
          </div>

          <a className="announce" href="#new">
            <b>new</b>
            <span>version 2.8 is here</span>
            <i aria-hidden="true">→</i>
          </a>

          <h1 className="headline" id="hero-title">
            <span>no signal.</span>
            <span className="center">no cloud.</span>
            <span className="accent right">no problem.</span>
          </h1>

          <ul className="chips" aria-label="Things you can ask">
            <li className="chip chip-1"><span className="dot" />fix my word_count bug</li>
            <li className="chip chip-2"><span className="dot" />when&apos;s my midterm?</li>
            <li className="chip chip-3"><span className="dot" />explain hash maps, fast</li>
          </ul>

          <OfflineToggle />

          <div className="hero-bottom">
            <p>stuck in traffic. power cut. hostel wifi dead again. still need ai? ancesra runs 100% on your laptop. ask it anything, get your code fixed, read your own notes. your chats and files never leave your machine. fr.</p>
            <div className="buttons">
              <PillButton href={LINKS.download} download>get it for windows</PillButton>
              <PillButton href="#features" outline>how it works</PillButton>
            </div>
            <SendToLaptop />
            <DownloadCount big every={15}>downloads so far</DownloadCount>
          </div>
        </section>

        {/* Marquee: the list twice, so the scroll loops seamlessly */}
        <div className="marquee" aria-label={MARQUEE.join(", ")}>
          <div className="marquee-track" aria-hidden="true">
            {[...MARQUEE, ...MARQUEE].map((text, i) => (
              <span key={i} className="marquee-item"><span>{text}</span><i>✦</i></span>
            ))}
          </div>
        </div>

        {/* Version 2.8, and under it the screens that came with 2.7 */}
        <section className="section whats-new" id="new" aria-labelledby="new-title">
          <p className="new-kicker"><b>released 20 nov 2026</b></p>
          <h2 className="section-title" id="new-title">2.8 version <span className="accent">is here</span></h2>
          <div className="features-intro">
            <p>ancesra now listens and talks. speak your question, hear the answer, and dictate into any program. it sets timers and reminders, does sums and opens your apps by itself. all of it still offline, on your own laptop.</p>
            <PillButton href={LINKS.download} download>get 2.8</PillButton>
          </div>
          <div className="new-grid">
            {NEW_28.map((n) => (
              <article key={n.title} className={`new-card new-text ${n.cls}`}>
                <h3>{n.title}</h3>
                <p>{n.text}</p>
              </article>
            ))}
          </div>
          <p className="new-note new-from">from 2.7: a screen for each job</p>
          <div className="new-grid">
            {NEW_27.map((n) => (
              <article key={n.title} className={`new-card ${n.cls}`}>
                <Image src={n.img} width={1600} height={900} alt={n.alt} sizes="(max-width: 720px) 100vw, 33vw" />
                <h3>{n.title}</h3>
                <p>{n.text}</p>
              </article>
            ))}
          </div>
          <p className="new-note">already on 2.7? open ancesra with the internet on and it offers the update.</p>
        </section>

        {/* The vibe */}
        <section className="section about" id="about" aria-labelledby="about-title">
          <h2 className="section-title" id="about-title">the vibe</h2>
          <div className="about-row">
            <div className="about-copy">
              <p>ancesra is the ai that doesn&apos;t need the internet. one dev, one laptop, zero servers. built for 2am study sessions, trains with no bars, and the simple idea that your data should just… stay yours. install once with wifi on. then unplug. it keeps going.</p>
              <a className="more" href="/founder">more<span className="more-arrow" aria-hidden="true" /></a>
            </div>
            <dl className="stats">
              {STATS.map(([value, label]) => (
                <div key={label}><dt>{value}</dt><dd>{label}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        {/* What it does */}
        <section className="section features" id="features" aria-labelledby="features-title">
          <h2 className="section-title" id="features-title">what it does</h2>
          <div className="features-intro">
            <p>three modes plus your own files. all of it runs on your computer, even in airplane mode. when it uses one of your docs it tells you the file and the page. no guessing.</p>
            <PillButton href={LINKS.download} download>download</PillButton>
          </div>

          <div className="bento">
            {CARDS.map((c) => (
              <article key={c.num} className={`card ${c.cls}`}>
                <CardTitle num={c.num}>{c.title}</CardTitle>
                <p>{c.text}</p>
                <Image className="window" src={c.img} width={c.w} height={c.h} alt={c.alt}
                  sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 860px" />
              </article>
            ))}
            <article className="card card-private">
              <CardTitle num="05">private</CardTitle>
              <div className="private-body">
                <p className="big">0 chats</p>
                <p className="accent-line">sent to anyone. ever.</p>
                <ul className="tags">
                  <li>no login</li>
                  <li>no cloud</li>
                  <li>no server</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        {/* Offer */}
        <section className="offer" aria-labelledby="offer-title">
          <img className="offer-glow" src="/assets/offer-glow.svg" alt="" aria-hidden="true" />
          <div className="offer-art" aria-hidden="true">
            <img className="halo" src="/assets/offer-halo.svg" alt="" />
            <div className="blob blob-offer" />
          </div>
          <h2 className="offer-title" id="offer-title">
            <span>no wifi.</span>
            <span>no cloud.</span>
            <span className="accent">no cap.</span>
          </h2>
          <p>free. forever. download once with wifi on, let it set itself up, then go offline for good. updates are optional, and checking for one only asks for the latest version number. your chats never leave.</p>
          <PillButton href={LINKS.download} download>get ancesra</PillButton>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
