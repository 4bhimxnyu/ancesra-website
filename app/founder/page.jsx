import PillButton from "../components/PillButton";
import { PageHero, SiteFooter, SiteHeader } from "../components/SiteChrome";
import { LINKS, linkProps } from "@/lib/links";

export const metadata = {
  title: "founder — ancesra ai",
  description: "Ancesra is built by one student developer, 4bhimxnyu: from a college project to a private, offline AI assistant."
};

// From the app's CHANGELOG
const JOURNEY = [
  ["25 Oct 2026", "v2.0", "the first desktop app", "chats, three modes, streaming answers. works offline after a one-time setup."],
  ["26 Oct 2026", "v2.1–2.2", "one click, no terminal", "a loading screen, updates that install themselves, and a setup that installs everything on the first start."],
  ["27 Oct 2026", "v2.3", "knows 2026", "a built-in Wikipedia pack for recent events. 2026 questions went from 0% to 86% correct, still offline."],
  ["29 Oct 2026", "v2.4", "it gets to know you", "a welcome tour, a profile with stats, and memory that asks before saving anything."],
  ["9 Nov 2026", "v2.5–2.6", "my files, and a new name", "answers from your own pdfs and notes. nexus became ancesra ai, with a new look."]
];

const VALUES = [
  ["private by default", "your chats, files and memory stay on your computer. no account, no analytics."],
  ["free, actually", "built on open models and open-source tools that allow commercial use, so it can stay free."],
  ["measured, not guessed", "every change is tested against a question set before it ships. if a score drops, it doesn't ship."],
  ["honest answers", "no made-up policies, no fake sources. if your files don't say it, ancesra says so."]
];

export default function Founder() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHero title="the founder">
          one dev, one laptop, zero servers. ancesra is built by 4bhimxnyu, a student who wanted an ai for study sessions and coding interviews that didn&apos;t need the internet or anyone else&apos;s cloud.
        </PageHero>

        <section className="section founder-intro" aria-labelledby="who-title">
          <div className="founder-card">
            <img src="/assets/logo.png" width={72} height={72} alt="" />
            <div>
              <h2 id="who-title">Abhimanyu <span>· 4bhimxnyu</span></h2>
              <p>founder and developer of ancesra ai. design, code, model testing and releases: one person, with every decision written down so others can learn from it.</p>
              <div className="doc-cta">
                <PillButton href={LINKS.github} outline>github</PillButton>
              </div>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="journey-title">
          <h2 className="section-title" id="journey-title">the journey</h2>
          <p className="section-lead">it started as a college project: a command-line chatbot on a local model. here&apos;s how it grew.</p>
          <ol className="timeline">
            {JOURNEY.map(([date, version, title, text]) => (
              <li key={version}>
                <div className="tl-meta"><span className="tl-version">{version}</span><time>{date}</time></div>
                <div className="tl-body"><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" aria-labelledby="values-title">
          <h2 className="section-title" id="values-title">what it stands for</h2>
          <div className="value-grid">
            {VALUES.map(([title, text], i) => (
              <article key={title} className="card value-card">
                <h3><span className="num">{String(i + 1).padStart(2, "0")}</span>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section closing" aria-label="Try ancesra">
          <p>want to see what one laptop can do?</p>
          <div className="buttons">
            <PillButton href={LINKS.download} download>get ancesra</PillButton>
            <a className="text-link" {...linkProps("/contribute")}>help build it</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
