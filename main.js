// ancesra ai website: links in one place, the offline toggle, and the nav
// highlight for the section on screen.

// Change links here. download = the public releases page, so it always shows
// the newest installer.
const LINKS = {
  download: "https://github.com/4bhimxnyu/Nexus-releases/releases/latest",
  founder: "#about",
  contribute: "https://github.com/4bhimxnyu/Nexus-releases"
};

for (const a of document.querySelectorAll("[data-link]")) {
  const url = LINKS[a.dataset.link];
  if (!url) continue;
  a.href = url;
  if (url.startsWith("http")) {
    a.target = "_blank";
    a.rel = "noopener";
  }
}

// The hero's "offline mode" switch: a toy, but it should still work like a switch
const toggle = document.querySelector(".offline-toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    const on = toggle.getAttribute("aria-checked") !== "true";
    toggle.setAttribute("aria-checked", String(on));
    toggle.querySelector("small").textContent = on ? "on · always" : "off · ancesra doesn't mind";
  });
}

// Underline the nav link of the section being read
const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
const sections = ["about", "features"].map((id) => document.getElementById(id)).filter(Boolean);
if ("IntersectionObserver" in window && sections.length) {
  const setActive = (id) => navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}` && a.dataset.link !== "founder"));
  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => observer.observe(s));
  window.addEventListener("scroll", () => { if (window.scrollY < 200) setActive("top"); }, { passive: true });
  setActive("top");
}
