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

/* ---------- tabs ---------- */
function moveIndicator(btn) {
  const indicator = $("#tabIndicator");
  if (!indicator || !btn) return;
  indicator.style.left = btn.offsetLeft + "px";
  indicator.style.width = btn.offsetWidth + "px";
}

function showTab(name) {
  $$(".panel-section").forEach((p) => p.classList.remove("is-active"));
  $$("[role=tab]").forEach((b) => b.setAttribute("aria-selected", "false"));

  const panel = $(`#panel-${name}`);
  const btn = $(`[data-tab="${name}"]`);
  if (!panel || !btn) return;

  panel.classList.add("is-active");
  btn.setAttribute("aria-selected", "true");
  moveIndicator(btn);
  history.replaceState(null, "", `#${name}`);
}

function initTabs() {
  $$("[role=tab]").forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });
  $("#siteMark").addEventListener("click", (e) => {
    e.preventDefault();
    showTab("about");
  });

  const initial = (location.hash || "#about").slice(1);
  const valid = ["about", "projects", "hobbies", "contact"].includes(initial) ? initial : "about";
  showTab(valid);

  // fonts loading can shift tab widths after first paint — resnap once they're ready
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => moveIndicator($('[aria-selected="true"]')));
  }
  window.addEventListener("resize", () => moveIndicator($('[aria-selected="true"]')));
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
initTabs();
startClock();
