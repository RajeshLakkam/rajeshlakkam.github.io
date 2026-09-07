// ============================================================
// Renders the page from SITE_DATA (see data.js), handles tab
// switching, the live clock, and the one-time hero animation.
// ============================================================

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(opts).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  });
  children.forEach((c) => node.appendChild(c));
  return node;
}

function assetExists(src) {
  return fetch(src, { method: "HEAD" })
    .then((res) => res.ok)
    .catch(() => false);
}

function renderHero() {
  const p = SITE_DATA.profile;
  $("#siteMark").textContent = p.name;
  $("#heroRole").textContent = p.role.toLowerCase();
  $("#heroTagline").textContent = p.tagline;
  $("#metaLocation").textContent = p.location;
  $("#metaStatus").textContent = p.status || "—";
  $("#metaEmail").textContent = p.email;
  $("#metaEmail").href = "mailto:" + p.email;

  const linksList = $("#metaLinks");
  p.links.forEach((link) => {
    linksList.appendChild(el("li", {}, [
      el("a", { href: link.url, text: link.label, target: "_blank", rel: "noopener" })
    ]));
  });

  const originEl = $("#originText");
  p.origin.trim().split(/\n\s*\n/).forEach((para) => {
    originEl.appendChild(el("p", { text: para.trim() }));
  });

  $("#contactLine").textContent = `Based in ${p.location}. ${p.tagline}`;
  const contactLinks = $("#contactLinks");
  contactLinks.appendChild(el("a", { href: "mailto:" + p.email, text: p.email }));
  p.links.forEach((link) => {
    contactLinks.appendChild(el("a", { href: link.url, text: link.label, target: "_blank", rel: "noopener" }));
  });

  animateHeroName(p.name);
}

/* One-time "settling" reveal for the name — the single orchestrated
   motion moment on the page. Characters briefly cycle through a few
   glyphs before landing on the real letter, left to right. */
function animateHeroName(name) {
  const heading = $("#heroName");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heading.textContent = name;
    return;
  }

  const glyphs = "!<>-_\\/[]{}—=+*^?#";
  const chars = name.split("");
  heading.innerHTML = "";
  const spans = chars.map((ch) => {
    const span = el("span", { class: "char", text: ch === " " ? "\u00A0" : ch });
    heading.appendChild(span);
    return span;
  });

  spans.forEach((span, i) => {
    const finalChar = chars[i];
    if (finalChar === " ") return;
    let ticks = 0;
    const maxTicks = 5 + Math.floor(Math.random() * 4);
    const delay = i * 35;
    setTimeout(() => {
      const interval = setInterval(() => {
        ticks += 1;
        if (ticks >= maxTicks) {
          span.textContent = finalChar;
          clearInterval(interval);
        } else {
          span.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }, 28);
    }, delay);
  });
}

function renderSkills() {
  const grid = $("#skillsGrid");
  SITE_DATA.skills.forEach((group) => {
    const chips = el("div", { class: "chip-row" },
      group.items.map((item) => el("span", { class: "chip", text: item }))
    );
    grid.appendChild(el("div", { class: "skill-group" }, [
      el("h3", { text: group.group }),
      chips
    ]));
  });
}

function buildMediaFrame(media) {
  if (!media || media.type === "none") return null;

  const frame = el("div", { class: "media-frame" });
  const fallback = () => {
    frame.innerHTML = "";
    frame.appendChild(el("div", {
      class: "media-fallback",
      text: `Add a file at ${media.src} to show it here.`
    }));
  };

  if (media.type === "pdf") {
    assetExists(media.src).then((ok) => {
      if (!ok) return fallback();
      frame.appendChild(el("iframe", { src: media.src, title: "Project PDF", loading: "lazy" }));
    });
  } else if (media.type === "video") {
    assetExists(media.src).then((ok) => {
      if (!ok) return fallback();
      const video = el("video", { controls: "", preload: "metadata" });
      if (media.poster) video.setAttribute("poster", media.poster);
      video.appendChild(el("source", { src: media.src }));
      video.addEventListener("error", fallback);
      frame.appendChild(video);
    });
  } else if (media.type === "image") {
    assetExists(media.src).then((ok) => {
      if (!ok) return fallback();
      const img = el("img", { src: media.src, alt: "" });
      img.addEventListener("error", fallback);
      frame.appendChild(img);
    });
  }

  return frame;
}

function renderProjects() {
  const list = $("#projectsList");
  SITE_DATA.projects.forEach((proj) => {
    const chipRow = el("div", { class: "chip-row" },
      proj.stack.map((tech) => el("span", { class: "chip", text: tech }))
    );

    const linksRow = el("div", { class: "project-links" },
      (proj.links || []).map((l) => el("a", { href: l.url, text: l.label, target: "_blank", rel: "noopener" }))
    );

    const body = el("div", {}, [
      el("div", { class: "project-meta" }, [document.createTextNode(proj.period)]),
      el("h3", { text: proj.title }),
      el("p", { class: "summary", text: proj.summary }),
      chipRow,
      linksRow
    ]);

    const mediaFrame = buildMediaFrame(proj.media);
    if (mediaFrame) body.appendChild(mediaFrame);

    list.appendChild(el("div", { class: "project" }, [body]));
  });
}

function renderHobbies() {
  const grid = $("#hobbiesGrid");
  SITE_DATA.hobbies.forEach((h) => {
    grid.appendChild(el("div", { class: "hobby" }, [
      el("h3", { text: h.title }),
      el("p", { text: h.note })
    ]));
  });
}

/* ---------- section nav ----------
   All four sections are on the page at once. The nav is plain anchors —
   scrolling is the browser's job (html { scroll-behavior: smooth }), so it
   still works with JS off. What's left for us is keeping the indicator on
   whichever section you're actually looking at. */
function moveIndicator(link) {
  const indicator = $("#tabIndicator");
  if (!indicator || !link) return;
  indicator.style.left = link.offsetLeft + "px";
  indicator.style.width = link.offsetWidth + "px";
}

function setActiveNav(id) {
  const link = $(`[data-nav="${id.replace("panel-", "")}"]`);
  if (!link || link.getAttribute("aria-current") === "true") return;

  $$("[data-nav]").forEach((a) => a.setAttribute("aria-current", "false"));
  link.setAttribute("aria-current", "true");
  moveIndicator(link);

  if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
}

function initNav() {
  const sections = $$(".panel-section");
  if (!sections.length) return;

  // the site mark scrolls home rather than jumping
  $("#siteMark").setAttribute("href", "#" + sections[0].id);

  /* A section counts as "current" while it crosses a band under the header.
     Several can qualify at once mid-scroll, so we always take the topmost in
     document order — that matches what reads as the section you're in. */
  const inBand = new Set();
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) inBand.add(e.target);
      else inBand.delete(e.target);
    });
    const current = sections.find((s) => inBand.has(s));
    if (current) setActiveNav(current.id);
  }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });

  sections.forEach((s) => spy.observe(s));

  /* A short last section can sit entirely below the band and never light up,
     so the bottom of the page always claims the last nav item. */
  window.addEventListener("scroll", () => {
    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    if (atBottom) setActiveNav(sections[sections.length - 1].id);
  }, { passive: true });

  setActiveNav((location.hash || "#" + sections[0].id).slice(1));
  // About already carries aria-current in the markup, so setActiveNav short-
  // circuits on a default load — place the indicator once, unconditionally.
  moveIndicator($('[aria-current="true"]'));

  // fonts loading can shift nav widths after first paint — resnap once ready
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => moveIndicator($('[aria-current="true"]')));
  }
  window.addEventListener("resize", () => moveIndicator($('[aria-current="true"]')));
}

/* ---------- collapsible header (phones) ----------
   The panel itself is opened and closed in CSS off .is-open; this just owns
   the state and makes sure it can't get stranded open. */
function initMobileNav() {
  const header = $(".site-header");
  const toggle = $("#navToggle");
  if (!header || !toggle) return;

  const setOpen = (open) => {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => {
    setOpen(!header.classList.contains("is-open"));
  });

  // picking a destination closes the sheet, otherwise it covers what you scrolled to
  $$("[data-nav], #navBlogs").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !header.classList.contains("is-open")) return;
    setOpen(false);
    toggle.focus();
  });

  // rotating to landscape or widening past the breakpoint drops the collapsed
  // state, so the desktop header never inherits a stale .is-open
  const wide = window.matchMedia("(min-width: 721px)");
  const onWide = (e) => { if (e.matches) setOpen(false); };
  if (wide.addEventListener) wide.addEventListener("change", onWide);
  else wide.addListener(onWide);   // Safari < 14
}

/* ---------- reveal on scroll ----------
   The motion the tabs used to play on switch, now tied to scroll position.
   The hero is skipped — it has its own boot sequence on load. */
function initReveal() {
  const sections = $$(".panel-section").slice(1);
  if (!sections.length) return;

  if (!("IntersectionObserver" in window)) return;

  sections.forEach((s) => s.classList.add("reveal"));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      io.unobserve(e.target);   // one-time settle, not a re-trigger on every pass
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });

  sections.forEach((s) => io.observe(s));
}

/* ---------- hero portrait ----------
   The portrait sits on top of the readout panel and lifts away on hover or
   keyboard focus. If the file isn't there yet, drop it so the panel just
   renders as it always did rather than showing a broken image. */
function initPortrait() {
  const portrait = $("#readoutPortrait");
  if (!portrait) return;
  portrait.addEventListener("error", () => portrait.remove());
}

/* ---------- blog drawer ----------
   The widget itself is defined in blog-drawer.js and listens on the document,
   so all the page has to do is announce the intent. */
function initBlogsLink() {
  const btn = $("#navBlogs");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("open-blog-drawer"));
  });
}

/* ---------- live clock ---------- */
function startClock() {
  const clockEl = $("#clock");
  const fmt = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });
  const tick = () => { clockEl.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 1000);
}

renderHero();
renderSkills();
renderProjects();
renderHobbies();
initNav();
initMobileNav();
initReveal();
initPortrait();
initBlogsLink();
startClock();
