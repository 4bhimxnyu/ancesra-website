# Security policy

## Reporting a problem

If you find a security problem in this website (for example a way to fake downloads, read data you shouldn't, or change what the site serves), please **don't open a public issue**.

Report it privately instead: go to this repository's **Security** tab and choose **Report a vulnerability**. Only the maintainer sees it.

Please include what you found, the steps to reproduce it, and what someone could do with it. You'll get a reply as soon as possible.

## What's in scope

- This website: https://ancesra.vercel.app and the code in this repository
- The download redirect (`/download`) and the download log (`/api/downloads`, `download.md`)

For the ancesra **app** itself, report problems in [Nexus-releases issues](https://github.com/4bhimxnyu/Nexus-releases/issues), or privately in the same way through that repository's Security tab.

## Good to know

- The site stores no passwords, accounts or personal data beyond the public download log (time and approximate place, no IP address).
- Secrets (the Vercel Blob key) live only in Vercel's environment settings, never in this repository.
