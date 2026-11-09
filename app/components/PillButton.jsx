import { linkProps } from "@/lib/links";

// The Figma "Pill button": white (default) or glass outline, with an arrow
// circle. Hover: fill flips to coral / white, the arrow slides right (globals.css).
export default function PillButton({ href, children, outline = false }) {
  return (
    <a className={outline ? "pill outline" : "pill"} {...linkProps(href)}>
      {children}
      <span className="pill-arrow" aria-hidden="true" />
    </a>
  );
}
