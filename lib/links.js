// Every outside link on the site, in one place.
// download = the public releases page, so it always offers the newest installer.
export const LINKS = {
  download: "https://github.com/4bhimxnyu/Nexus-releases/releases/latest",
  founder: "#about",
  contribute: "https://github.com/4bhimxnyu/Nexus-releases"
};

// Props for an <a>: outside links open in a new tab
export function linkProps(href) {
  return href.startsWith("http") ? { href, target: "_blank", rel: "noopener" } : { href };
}
