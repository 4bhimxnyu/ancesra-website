import localFont from "next/font/local";
import "./globals.css";
import "./light.css";
import "./mobile.css";

// Urbanist, bundled with the site (SIL Open Font License, app/fonts/OFL-Urbanist.txt)
const urbanist = localFont({
  src: "./fonts/urbanist.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-urbanist"
});

// The site's address, so share previews get a full image URL
const site = process.env.VERCEL_ENV ? "https://ancesra.vercel.app" : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(site),
  title: "ancesra ai — private AI that works offline",
  description: "ancesra is a free AI assistant that runs 100% on your laptop. Chat, code, debug and ask your own files, with no internet, no account and no cloud.",
  openGraph: {
    title: "ancesra ai — no signal. no cloud. no problem.",
    description: "A free AI assistant that runs 100% on your laptop. Works offline, nothing leaves your machine.",
    images: ["/assets/logo.png"]
  }
};

export const viewport = {
  themeColor: "#070707"
};

// Runs before the page paints: applies the saved theme (dark unless the visitor
// chose light), so there is no flash of the wrong one. Keep the key in step
// with THEME_KEY in components/ThemeToggle.jsx. A link can also ask for a
// theme with ?theme=light or ?theme=dark (not saved).
const themeScript = `try{var q=new URLSearchParams(location.search).get("theme");if(q==="light"||(q!=="dark"&&localStorage.getItem("ancesra-theme")==="light")){document.documentElement.dataset.theme="light";var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#f6f1ea")}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={urbanist.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
