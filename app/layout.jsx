import localFont from "next/font/local";
import "./globals.css";

// Urbanist, bundled with the site (SIL Open Font License, app/fonts/OFL-Urbanist.txt)
const urbanist = localFont({
  src: "./fonts/urbanist.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-urbanist"
});

// Vercel sets this to the production domain, so share previews get a full image URL
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={urbanist.variable}>
      <body>{children}</body>
    </html>
  );
}
