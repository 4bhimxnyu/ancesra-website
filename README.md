<p align="center">
  <img src="public/assets/logo.png" width="96" height="96" alt="ancesra logo">
</p>

<h1 align="center">ancesra ai — website</h1>

<p align="center">
  <b>no signal. no cloud. no problem.</b><br>
  The website for <a href="https://ancesra.vercel.app">ancesra ai</a>, a free AI assistant that runs 100% offline on your laptop.
</p>

<p align="center">
  <a href="https://ancesra.vercel.app"><b>ancesra.vercel.app</b></a> ·
  <a href="https://ancesra.vercel.app/download">Download for Windows</a> ·
  <a href="https://ancesra.vercel.app/docs">Docs</a> ·
  <a href="download.md">Download log</a>
</p>

---

## What's here

| Page | What it is |
|---|---|
| [`/`](https://ancesra.vercel.app) | The landing page, with a live download counter |
| [`/docs`](https://ancesra.vercel.app/docs) | Install guide, requirements, features, privacy, troubleshooting, FAQ |
| [`/founder`](https://ancesra.vercel.app/founder) | The story behind ancesra and its release timeline |
| [`/contribute`](https://ancesra.vercel.app/contribute) | How to report bugs, suggest ideas and help test |
| [`/download`](https://ancesra.vercel.app/download) | Starts the newest Windows installer straight away |

The design comes from the Figma file's "Website UI" page (Landing — v2, editorial).

## How it works

- **Next.js (App Router)**, plain JavaScript, deployed on **Vercel**. Every push to `main` goes live automatically.
- **`/download`** asks GitHub for the newest release of [Nexus-releases](https://github.com/4bhimxnyu/Nexus-releases) (cached 10 minutes) and redirects to its `.exe`, so the download starts immediately and new releases need no change here.
- **Download counter:** the sum of GitHub's own download counts for every released installer, refreshed every 15 seconds on the page.
- **Download log ([`download.md`](download.md)):** each download through the site is saved to a private Vercel Blob store with the file, version, time and approximate place (city, region, country, from Vercel's IP geolocation; the IP address is never stored). A GitHub Action ([`sync-downloads.yml`](.github/workflows/sync-downloads.yml)) copies new entries into `download.md` every 30 minutes. Link previews, crawlers and scripts are not counted.

```
app/
  page.jsx              landing page
  docs/ founder/ contribute/   the other pages
  download/route.js     /download: redirect to the newest installer, log the download
  api/downloads/        the counter (route.js) and the log (log/route.js)
  components/           header, footer, pill button, counters, docs menu
  globals.css           all styles (design tokens at the top)
lib/                    links, release lookup, download log
public/assets/          logo, app previews, glow graphics
scripts/sync-downloads.mjs   used by the GitHub Action
```

## Run it locally

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Locally, the download log isn't written (it needs the Vercel Blob key, which only the deployed site has); everything else works.

## Privacy

The ancesra **app** never sends chats or files anywhere. This **website** keeps one public record per download (time and approximate place, no IP address) and uses no analytics or cookies.

## Security

Found a security problem? Please report it privately; see [SECURITY.md](SECURITY.md).

## Credits

- Typeface: [Urbanist](https://github.com/coreyhu/Urbanist), SIL Open Font License 1.1 (`app/fonts/OFL-Urbanist.txt`)
- Built and maintained by [4bhimxnyu](https://github.com/4bhimxnyu)

© 2026 Abhimanyu. All rights reserved for the website's code and design, unless stated otherwise.
