// Every link the site shares, in one place.
// download = /download (app/download/route.js), which starts the newest installer.
export const LINKS = {
  download: "/download",
  github: "https://github.com/4bhimxnyu",
  releases: "https://github.com/4bhimxnyu/Nexus-releases/releases",
  issues: "https://github.com/4bhimxnyu/Nexus-releases/issues"
};

// The site's pages, for the header and footer
export const PAGES = [
  { label: "home", href: "/" },
  { label: "about", href: "/#about" },
  { label: "docs", href: "/docs" },
  { label: "founder", href: "/founder" },
  { label: "contribute", href: "/contribute" }
];

// Props for an <a>: outside links open in a new tab
export function linkProps(href) {
  return href.startsWith("http") ? { href, target: "_blank", rel: "noopener" } : { href };
}
