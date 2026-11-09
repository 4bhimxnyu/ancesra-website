import PillButton from "../components/PillButton";
import { PageHero, SiteFooter, SiteHeader } from "../components/SiteChrome";
import { LINKS, linkProps } from "@/lib/links";

export const metadata = {
  title: "contribute — ancesra ai",
  description: "Help build ancesra: report bugs, suggest features, test it on your PC and spread the word."
};

const WAYS = [
  { title: "report a bug", text: "something broke, froze or gave a wrong answer? open an issue with what you did, what happened, and your app version (it's at the bottom of the sidebar).",
    href: `${LINKS.issues}/new?labels=bug&title=Bug:%20`, cta: "report a bug" },
  { title: "suggest a feature", text: "tell us what would make ancesra more useful for you: a mode, a file type, a setting. one idea per issue keeps it easy to track.",
    href: `${LINKS.issues}/new?labels=idea&title=Idea:%20`, cta: "suggest an idea" },
  { title: "test it on your pc", text: "every laptop is different. install it, use it for a day, and tell us how setup and speed went, with your Windows version and memory size.",
    href: LINKS.download, cta: "download", download: true },
  { title: "share it", text: "know someone stuck with bad wifi, or who doesn't want their notes in the cloud? send them the link. that's the biggest help of all.",
    href: "/", cta: "the home page" }
];

export default function Contribute() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHero title="contribute">
          ancesra is free software, built in the open by one developer. you don&apos;t need to write code to help: bug reports, ideas and testing on real laptops shape what gets built next.
        </PageHero>

        <section className="section" aria-labelledby="ways-title">
          <h2 className="section-title" id="ways-title">ways to help</h2>
          <div className="value-grid">
            {WAYS.map((w, i) => (
              <article key={w.title} className="card value-card">
                <h3><span className="num">{String(i + 1).padStart(2, "0")}</span>{w.title}</h3>
                <p>{w.text}</p>
                <div className="card-cta">
                  <PillButton href={w.href} outline download={w.download}>{w.cta}</PillButton>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="code-title">
          <h2 className="section-title" id="code-title">the code</h2>
          <div className="about-row">
            <div className="about-copy">
              <p>ancesra is licensed under the GNU AGPL-3.0. the source repository opens to contributors soon; until then, issues on GitHub are the way in. when it opens, this page will have the setup guide and the first good issues to pick up.</p>
              <a className="more" {...linkProps(LINKS.issues)}>open issues<span className="more-arrow" aria-hidden="true" /></a>
            </div>
            <dl className="stats">
              <div><dt>AGPL</dt><dd>free software licence</dd></div>
              <div><dt>MIT</dt><dd>the AI model&apos;s licence</dd></div>
            </dl>
          </div>
        </section>

        <section className="section" aria-labelledby="rules-title">
          <h2 className="section-title" id="rules-title">ground rules</h2>
          <ul className="facts wide">
            <li><b>Be kind.</b> Everyone here is learning, the founder included.</li>
            <li><b>Never paste private data</b> (chats, files, passwords) into a public issue. Describe the problem instead.</li>
            <li><b>Only commercially usable parts.</b> Anything added must allow commercial use (MIT, Apache 2.0, BSD), so ancesra can stay free.</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
