import DocsToc from "../components/DocsToc";
import PillButton from "../components/PillButton";
import { PageHero, SiteFooter, SiteHeader } from "../components/SiteChrome";
import { LINKS, linkProps } from "@/lib/links";
import { formatSize, getLatestRelease } from "@/lib/release";

export const metadata = {
  title: "docs — ancesra ai",
  description: "How to install ancesra, what it needs, and how to use chat, coding, debug, My files and memory, all offline."
};

// Re-check the newest version every 10 minutes
export const revalidate = 600;

const TOC = [
  ["install", "Install"],
  ["requirements", "What your PC needs"],
  ["modes", "Chat, coding, debug"],
  ["files", "My files"],
  ["memory", "Memory and profile"],
  ["offline", "What goes online"],
  ["updates", "Updates"],
  ["troubleshooting", "Troubleshooting"],
  ["faq", "FAQ"]
];

function Section({ id, title, children }) {
  return (
    <section className="doc-section" id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  );
}

export default async function Docs() {
  const release = await getLatestRelease();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <PageHero title="docs">
          everything you need to get ancesra running and get the most out of it. short version: download, open, wait for the one-time setup, then unplug the wifi.
        </PageHero>

        <div className="docs-layout">
          <DocsToc items={TOC} />

          <div className="docs-body">
            <Section id="install" title="Install">
              <ol className="steps">
                <li><strong>Download the installer.</strong> {release
                  ? <>The newest version is <b>{release.version}</b> ({formatSize(release.size)}, Windows 10 or 11).</>
                  : <>It's a single Windows installer of about 120 MB.</>}</li>
                <li><strong>Run it.</strong> Windows may warn that the app is from an unknown publisher, because the installer isn't code-signed yet. Choose <em>More info</em>, then <em>Run anyway</em>.</li>
                <li><strong>Open Ancesra with the internet on, once.</strong> The first start installs Ollama (the free program that runs the AI) and downloads the AI model, about 2.5 GB. The loading screen shows each step.</li>
                <li><strong>That's it.</strong> From now on Ancesra works with the internet off.</li>
              </ol>
              <div className="doc-cta">
                <PillButton href={LINKS.download} download>download for windows</PillButton>
                <a className="text-link" {...linkProps(LINKS.releases)}>all versions and release notes</a>
              </div>
            </Section>

            <Section id="requirements" title="What your PC needs">
              <ul className="facts">
                <li><b>Windows 10 or 11</b>, 64-bit. A Mac version isn't available yet.</li>
                <li><b>About 4 GB of free disk space</b> for the app and the AI model.</li>
                <li><b>8 GB of memory</b> or more is comfortable. A graphics card (GPU) makes answers faster but isn't required.</li>
                <li><b>Internet once</b>, for the first setup. After that, never required.</li>
              </ul>
            </Section>

            <Section id="modes" title="Chat, coding, debug">
              <p>Pick a mode at the top of the chat. Each one shapes the answer differently.</p>
              <div className="doc-cards">
                <div><h3>Chat</h3><p>General questions. A direct answer first, then a few key points. It knows events up to 2026 from a built-in Wikipedia pack and shows its sources.</p></div>
                <div><h3>Coding</h3><p>Name the function and the language. You get the approach, the full code, then its time and space complexity.</p></div>
                <div><h3>Debug</h3><p>Paste broken code. One sentence on what's wrong, then the fixed code, keeping the same function name and parameters.</p></div>
              </div>
              <p className="muted-note">Settings lets you choose how detailed answers are (concise, balanced or detailed) and which mode Ancesra starts in.</p>
            </Section>

            <Section id="files" title="My files">
              <p>Add your own documents and Ancesra answers from them, naming the file and the page.</p>
              <ul className="facts">
                <li><b>Add files</b> from <em>My files</em> in the sidebar, or drop them anywhere on the window.</li>
                <li><b>Supported:</b> PDF, Word (.docx), .txt, .md, .csv and .json, up to 50 MB each.</li>
                <li><b>Not yet:</b> scanned PDFs (pictures of pages), because they have no text to read.</li>
                <li><b>Private:</b> files are read and indexed on your computer. Removing a file deletes its index; the original is never changed.</li>
              </ul>
              <p>Try: <q>how many sick days do I get?</q> after adding a company handbook, or <q>when is my midterm?</q> with a course plan.</p>
            </Section>

            <Section id="memory" title="Memory and profile">
              <ul className="facts">
                <li>Say <q>remember that my exam is on Friday</q>. Ancesra <b>asks before saving</b> anything about you.</li>
                <li>Your <b>Profile</b> shows what it remembers, and you can delete any of it.</li>
                <li>The profile also shows your stats: questions asked, active days, streak and the topics you ask about.</li>
              </ul>
            </Section>

            <Section id="offline" title="What goes online">
              <p>Your chats, files, profile and memory never leave your computer. Ancesra only uses the internet for:</p>
              <ul className="facts">
                <li><b>The first setup</b>: downloading Ollama and the AI model.</li>
                <li><b>Checking for updates</b>, when you're online: one request to GitHub asking for the newest version. No chats or files are sent.</li>
              </ul>
              <p>There's no account, no analytics and no server of ours involved.</p>
            </Section>

            <Section id="updates" title="Updates">
              <p>When a new version is out and you're online, Ancesra offers it in a dialog. Choose <em>Download</em>, then <em>Restart and update</em>: it installs itself and opens again, with your chats kept. You can also use <em>Check for updates</em> at the bottom of the sidebar, or skip a version.</p>
            </Section>

            <Section id="troubleshooting" title="Troubleshooting">
              <dl className="qa">
                <dt>The loading screen says Ollama didn't start</dt>
                <dd>Restart your computer and open Ancesra again. If it still fails, reinstall Ollama from ollama.com.</dd>
                <dt>It says it needs to download the AI model</dt>
                <dd>The first setup needs the internet once (about 2.5 GB). Connect, reopen Ancesra, and let it finish.</dd>
                <dt>Another program uses port 3000</dt>
                <dd>Nothing to do: Ancesra picks a free port by itself.</dd>
                <dt>Answers are slow</dt>
                <dd>The first answer after starting loads the model into memory. Closing heavy apps helps on PCs with 8 GB of memory.</dd>
              </dl>
            </Section>

            <Section id="faq" title="FAQ">
              <dl className="qa">
                <dt>Is it really free?</dt>
                <dd>Yes. No account, no subscription.</dd>
                <dt>Which AI model does it use?</dt>
                <dd>Microsoft's phi4-mini, an open model (MIT licence), running on your computer through Ollama.</dd>
                <dt>Is there a Mac or Linux version?</dt>
                <dd>Not yet. Windows only for now.</dd>
                <dt>Can it browse the internet?</dt>
                <dd>No. It answers from its own knowledge, the built-in knowledge pack and the files you give it.</dd>
              </dl>
            </Section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
