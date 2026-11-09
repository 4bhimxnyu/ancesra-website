// The newest Ancesra release, from the public releases repo on GitHub.
// Cached for 10 minutes, so visitors don't each call GitHub (it allows 60
// unauthenticated requests an hour per server).

export const RELEASES_REPO = "4bhimxnyu/Nexus-releases";
export const RELEASES_PAGE = `https://github.com/${RELEASES_REPO}/releases/latest`;

// { version, url, size, date } of the Windows installer, or null if GitHub can't be reached
export async function getLatestRelease() {
  try {
    const res = await fetch(`https://api.github.com/repos/${RELEASES_REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "ancesra-website" },
      next: { revalidate: 600 }
    });
    if (!res.ok) return null;
    const release = await res.json();
    const exe = (release.assets || []).find((a) => /\.exe$/i.test(a.name));
    if (!exe) return null;
    return {
      version: String(release.tag_name || "").replace(/^v/, ""),
      url: exe.browser_download_url,
      size: exe.size,
      date: release.published_at
    };
  } catch {
    return null;
  }
}

export function formatSize(bytes) {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}
