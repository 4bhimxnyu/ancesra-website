// The header and footer shared by every page
import NavLinks from "./NavLinks";
import PillButton from "./PillButton";
import { LINKS } from "@/lib/links";

export function SiteHeader() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav" id="top">
        <a className="brand" href="/">ancesra.</a>
        <NavLinks />
        <PillButton href={LINKS.download} download>download</PillButton>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src="/assets/logo.png" width={19} height={19} alt="" />
        <span>© 2026 ancesra ai · made offline by 4bhimxnyu</span>
      </div>
      <NavLinks className="footer-links" label="Footer" highlight={false} />
    </footer>
  );
}

// The big uppercase title block at the top of the inner pages
export function PageHero({ title, children }) {
  return (
    <section className="page-hero">
      <img className="page-glow" src="/assets/halo.svg" alt="" aria-hidden="true" />
      <h1 className="page-title">{title}</h1>
      {children ? <p className="page-lead">{children}</p> : null}
    </section>
  );
}
