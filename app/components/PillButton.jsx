import { linkProps } from "@/lib/links";

// The Figma "Pill button": white (default) or glass outline, with an arrow
// circle. Hover: fill flips to coral / white, the arrow slides right (globals.css).
// download: the link starts a file download (the arrow points down).
export default function PillButton({ href, children, outline = false, download = false }) {
  const cls = ["pill", outline && "outline", download && "is-download"].filter(Boolean).join(" ");
  return (
    <a className={cls} {...linkProps(href)}>
      {children}
      <span className="pill-arrow" aria-hidden="true" />
    </a>
  );
}
