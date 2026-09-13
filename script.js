// ============================================================
// Renders the page from SITE_DATA (see data.js), handles tab
// switching and the one-time hero animation.
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

/* Feature flags live in SITE_DATA.features (see data.js). A section with no
   explicit flag stays on, so adding one never requires registering it first. */
function featureOn(name) {
  const flags = SITE_DATA.features || {};
  return flags[name] !== false;
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

  /* The closing line gets its own treatment — it's the one claim on the page
     worth reading twice. *Asterisks* in the text mark the phrases that take
     the accent; split on them and alternate, so it stays plain text in
     data.js and never goes near innerHTML. */
  if (p.credo) {
    const quote = el("p", { class: "credo-text" });
    p.credo.trim().replace(/\s+/g, " ").split("*").forEach((chunk, i) => {
      if (!chunk) return;
      quote.appendChild(i % 2
        ? el("em", { class: "credo-hl", text: chunk })
        : document.createTextNode(chunk));
    });
    originEl.appendChild(el("div", { class: "credo" }, [quote]));
  }

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

/* Icons come in two flavours: a Devicon class for anything with a real brand
   mark, and a sprite id for the concepts that don't have one. Both end up the
   same size and colour, so a row can mix them without looking assembled from
   two sets. Anything unmapped simply renders label-only. */
const SVG_NS = "http://www.w3.org/2000/svg";

function spriteIcon(id, cls) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", cls);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const use = document.createElementNS(SVG_NS, "use");
  // both spellings: href is current, xlink:href is what older Safari reads
  use.setAttribute("href", "#" + id);
  use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + id);
  svg.appendChild(use);
  return svg;
}

function iconFor(key, cls) {
  if (!key) return null;
  return key.startsWith("devicon-")
    ? el("i", { class: cls + " " + key, "aria-hidden": "true" })
    : spriteIcon(key, cls);
}

function renderSkills() {
  const grid = $("#skillsGrid");
  const icons = SITE_DATA.skillIcons || {};

  SITE_DATA.skills.forEach((group) => {
    const chips = el("div", { class: "chip-row" },
      group.items.map((item) => {
        const chip = el("span", { class: "chip" });
        const icon = iconFor(icons[item], "chip-icon");
        if (icon) chip.appendChild(icon);
        chip.appendChild(el("span", { text: item }));
        return chip;
      })
    );

    const heading = el("h3", {});
    const groupIcon = iconFor(group.icon, "group-icon");
    if (groupIcon) heading.appendChild(groupIcon);
    heading.appendChild(el("span", { text: group.group }));

    grid.appendChild(el("div", { class: "skill-group" }, [heading, chips]));
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
      /* A decorative shot takes an empty alt; a certificate is content, so it
         describes itself when it can't be seen or won't load. */
      const img = el("img", { src: media.src, alt: media.alt || "", loading: "lazy" });
      img.addEventListener("error", fallback);
      frame.appendChild(img);
    });
  }

  return frame;
}

/* Every card, so the click controller below can close the ones you didn't
   click. Filled by renderProjects, read by initProjectCards. */
const projectCards = [];

function renderProjects() {
  const list = $("#projectsList");
  SITE_DATA.projects.forEach((proj, i) => {
    const chipRow = el("div", { class: "chip-row" },
      proj.stack.map((tech) => el("span", { class: "chip", text: tech }))
    );

    /* Closed, a card shows the project and who it was for — nothing else. The
       period and the seat are still in the header, just hidden until it opens,
       so opening a card doesn't reflow the two lines you were reading.

       `org` is written "Company · Seat · Seat" in data.js, so the company is
       the first segment. A string without separators is all company, which is
       the right answer for an org that is only a name. */
    const orgParts = proj.org ? proj.org.split("·") : [];
    const company = (orgParts.shift() || "").trim();
    const seat = orgParts.join("·").trim();

    const head = el("div", { class: "project-head" }, [
      el("div", { class: "project-meta" }, [document.createTextNode(proj.period)]),
      el("h3", { text: proj.title })
    ]);

    // Where the work happened, and in what seat — only for the ones that had one.
    if (company) {
      const org = el("div", { class: "project-org" }, [
        el("span", { class: "project-company", text: company })
      ]);
      if (seat) org.appendChild(el("span", { class: "project-seat", text: " · " + seat }));
      head.appendChild(org);
    }

    const body = el("div", { class: "project-body", id: "project-" + i }, [
      el("p", { class: "summary", text: proj.summary })
    ]);

    /* The summary says what the project was; these say what I did on it.
       A list, because that's the shape of the information — flattening six
       responsibilities into one paragraph just hides them. */
    if (proj.highlights && proj.highlights.length) {
      body.appendChild(el("ul", { class: "project-highlights" },
        proj.highlights.map((h) => el("li", { text: h }))
      ));
    }

    body.appendChild(chipRow);

    // An empty links row still costs its bottom margin, so only add a real one.
    if (proj.links && proj.links.length) {
      body.appendChild(el("div", { class: "project-links" },
        proj.links.map((l) => el("a", { href: l.url, text: l.label, target: "_blank", rel: "noopener" }))
      ));
    }

    const mediaFrame = buildMediaFrame(proj.media);
    if (mediaFrame) body.appendChild(mediaFrame);

    const card = el("div", { class: "project" }, [head, body]);
    list.appendChild(card);

    /* Cards start closed: five open ones make the timeline a page of prose you
       have to scroll past, and the point of the list is to scan it first. The
       Projects section around them does not collapse — only the cards do. */
    const shell = makeCollapsible(body, false);
    const btn = el("button", {
      class: "project-toggle",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": shell.id,
      "aria-label": "Expand " + proj.title
    }, [spriteIcon("i-chevron", "collapse-chevron")]);

    head.appendChild(btn);
    projectCards.push({ card, shell, btn, title: proj.title, open: false });
  });
}

/* ---------- project open/close ----------
   One listener on the document rather than one per card: a click either lands
   inside a card or it doesn't, and "outside" includes every other card, so the
   same handler gives click-to-toggle, click-away-to-close, and one-open-at-a-
   time without any of them being special-cased.

   The chevron stays a real button — it is the keyboard path in, and a bare
   clickable div is not. Its Enter/Space also arrives here as a click, so the
   two routes share one code path instead of racing each other, and the button
   needs no listener of its own: a click on it is a click on the card. */
function setProjectOpen(entry, open) {
  if (entry.open === open) return;
  entry.open = open;
  entry.card.classList.toggle("is-open", open);
  entry.btn.setAttribute("aria-expanded", String(open));
  entry.btn.setAttribute("aria-label", (open ? "Collapse " : "Expand ") + entry.title);
  setCollapsed(entry.shell, !open, false);
}

function initProjectCards() {
  if (!projectCards.length) return;

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".project");

    // anything that isn't the card you clicked closes, this one included if
    // you clicked nothing at all
    projectCards.forEach((entry) => {
      if (entry.card !== card) setProjectOpen(entry, false);
    });
    if (!card) return;

    const entry = projectCards.find((x) => x.card === card);
    if (!entry) return;

    // a link inside a card is a link — following it shouldn't also shut the
    // card you followed it from
    if (e.target.closest("a")) return;

    /* Finishing a text selection ends in a click, and collapsing the paragraph
       someone just highlighted is the most annoying way to lose it. Only bail
       for a selection that actually lives in this card. */
    const sel = window.getSelection && window.getSelection();
    if (sel && !sel.isCollapsed && sel.anchorNode && card.contains(sel.anchorNode)) return;

    // the whole card is the toggle, chevron included
    setProjectOpen(entry, !entry.open);
  });

  // Escape is the other way out, for anyone who got here by keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    projectCards.forEach((entry) => setProjectOpen(entry, false));
  });
}

/* Awards sit under the timeline they came out of. Each one is a title, who
   gave it, and what for — the citation matters more than the name, which means
   nothing to a reader outside the company. */
function renderAwards() {
  const list = $("#awardsList");
  if (!list || !SITE_DATA.awards) return;

  SITE_DATA.awards.forEach((award) => {
    const head = el("div", { class: "award-head" });
    const icon = iconFor("i-award", "award-icon");
    if (icon) head.appendChild(icon);
    head.appendChild(el("h3", { text: award.title }));

    const card = el("div", { class: "award" }, [
      head,
      el("div", { class: "award-org", text: award.org }),
      el("p", { text: award.note.trim().replace(/\s+/g, " ") })
    ]);

    /* The certificate itself, when there is one. It's small on the page, so it
       also links out to the full image — a certificate nobody can read is
       decoration. */
    const frame = buildMediaFrame(award.media);
    if (frame) {
      card.appendChild(el("a", {
        class: "award-media",
        href: award.media.src,
        target: "_blank",
        rel: "noopener",
        "aria-label": "Open the full-size certificate in a new tab"
      }, [frame]));
      card.appendChild(el("span", { class: "award-media-hint", text: "Open full size ↗" }));
    }

    list.appendChild(card);
  });
}

/* Certifications sit under the awards on the same tab. They are deliberately
   flatter than an award card — a name, who issued it, and a mark — because
   there is no story to tell about a certification beyond having earned it. */
function renderCertifications() {
  const grid = $("#certsGrid");
  if (!grid || !SITE_DATA.certifications) return;

  SITE_DATA.certifications.forEach((cert) => {
    const card = el("div", { class: "cert" });
    const icon = iconFor(cert.icon, "cert-icon");
    if (icon) card.appendChild(icon);
    card.appendChild(el("div", { class: "cert-body" }, [
      el("h3", { text: cert.title }),
      el("span", { class: "cert-issuer", text: cert.issuer })
    ]));
    grid.appendChild(card);
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

/* ---------- GitHub analytics ----------
   One figure and one graph: every contribution since the account opened, and
   the last twelve months day by day. Nothing about repositories owned,
   languages used, or stars collected — none of that is work done.

   The total has to come from the contribution calendar, because that's the
   only public source that counts private work, and private repositories are
   where nearly all of this activity lives. GitHub publishes the calendar on
   the profile page and through GraphQL: the first isn't readable cross-origin,
   the second needs a token, and a token can't be shipped in public source. So
   it arrives via a proxy of that same public calendar — a third party, and
   therefore treated as optional: if it's slow or gone, the panel falls back to
   a link to the profile rather than showing a broken figure. */

const GH_CACHE_KEY = "gh-activity-v4";
const GH_CACHE_TTL = 30 * 60 * 1000;   // half an hour is plenty for a CV page
const GH_CALENDAR_API = "https://github-contributions-api.jogruber.de/v4/";

function ghCacheRead(user) {
  try {
    const raw = sessionStorage.getItem(GH_CACHE_KEY);
    if (!raw) return null;
    const hit = JSON.parse(raw);
    if (hit.user !== user || Date.now() - hit.at > GH_CACHE_TTL) return null;
    return hit.data;
  } catch (e) {
    return null;   // private mode, blocked storage — just fetch again
  }
}

function ghCacheWrite(user, data) {
  try {
    sessionStorage.setItem(GH_CACHE_KEY, JSON.stringify({ user, at: Date.now(), data }));
  } catch (e) {
    /* nothing to do; the cache is an optimisation, not a dependency */
  }
}

/* 1,284 stays 1,284 — grouped, never compacted. This is the one number on the
   panel, so it's worth reading exactly. */
function groupNumber(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* y=all: the total counts every year, and the same response carries the daily
   grid, so the whole panel is one request (~90KB, once per session). */
function ghCalendar(user) {
  const cached = ghCacheRead(user);
  if (cached) return Promise.resolve(cached);

  return fetch(`${GH_CALENDAR_API}${encodeURIComponent(user)}?y=all`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((d) => {
      if (!d || !d.total || !Array.isArray(d.contributions)) return null;

      // { "2021": 98, "2022": 135, ... } — one entry per year, unordered.
      const years = Object.entries(d.total)
        .filter(([y, n]) => /^\d{4}$/.test(y) && typeof n === "number")
        .sort((a, b) => Number(a[0]) - Number(b[0]));
      if (!years.length) return null;

      /* Two things the response does that would quietly wreck the grid: the
         days run newest year first rather than straight through, and the
         current year is padded out to December with zero-count days that
         haven't happened yet. So sort, drop the future, take the last year. */
      const today = new Date().toISOString().slice(0, 10);
      const sorted = d.contributions
        .filter((day) => day.date <= today)
        .sort((a, b) => a.date.localeCompare(b.date));

      const data = {
        total: years.reduce((sum, [, n]) => sum + n, 0),
        since: years[0][0],
        days: sorted.slice(-371)
      };
      ghCacheWrite(user, data);
      return data;
    })
    .catch(() => null);
}

/* --- the graph ---
   A year of daily counts: magnitude over time on a fixed date grid, so it's a
   heatmap. Sequential job, so one hue stepped light-to-dark — the page's own
   teal, four steps above the empty-day surface, never a rainbow. The step is
   ordinal (GitHub's own level 0-4) and every cell carries its exact count in
   the tooltip, so nothing is readable by shade alone. */
const GH_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function contributionHeatmap(cal) {
  const days = cal.days;
  if (!days.length) return null;

  const firstDate = new Date(days[0].date + "T00:00:00");
  const pad = firstDate.getDay();                       // Sunday-first, like the grid
  const weeks = Math.ceil((pad + days.length) / 7);

  const grid = el("div", { class: "gh-heatmap", role: "img",
    "aria-label": `${days.reduce((sum, d) => sum + d.count, 0)} contributions in the last year, one cell per day` });

  // Blanks so the first real day lands on its own weekday row.
  for (let i = 0; i < pad; i++) grid.appendChild(el("div", { class: "gh-cell gh-cell-pad" }));

  days.forEach((d) => {
    const date = new Date(d.date + "T00:00:00");
    const when = `${GH_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    grid.appendChild(el("div", {
      class: "gh-cell",
      "data-level": String(d.level || 0),
      "data-tip": `${d.count} contribution${d.count === 1 ? "" : "s"} · ${when}`
    }));
  });

  /* Month labels sit on their own grid of the same column width, each placed
     on the week its month starts in. */
  const months = el("div", { class: "gh-heatmap-months" });
  months.style.gridTemplateColumns = `repeat(${weeks}, var(--gh-cell))`;
  let lastMonth = -1;
  days.forEach((d, i) => {
    const date = new Date(d.date + "T00:00:00");
    const week = Math.floor((pad + i) / 7);
    // Skip a label in the final column — it would overflow the grid's width.
    if (date.getMonth() === lastMonth || date.getDate() > 7 || week >= weeks - 1) return;
    lastMonth = date.getMonth();
    const label = el("span", { text: GH_MONTHS[date.getMonth()] });
    label.style.gridColumn = `${week + 1} / span 4`;
    months.appendChild(label);
  });

  const scale = el("div", { class: "gh-heatmap-legend" }, [
    el("span", { text: "Less" })
  ]);
  [0, 1, 2, 3, 4].forEach((lvl) => {
    scale.appendChild(el("span", { class: "gh-cell", "data-level": String(lvl) }));
  });
  scale.appendChild(el("span", { text: "More" }));

  /* The headline sits inside the graph's own block, directly above the grid:
     one number, then the year it counts from, then the year it draws. */
  const headline = el("div", { class: "gh-headline" }, [
    el("div", { class: "gh-headline-value", text: groupNumber(cal.total) }),
    el("div", { class: "gh-headline-label", text: `Contributions since ${cal.since}` })
  ]);

  const tip = el("div", { class: "gh-tip", hidden: "hidden" });
  const plot = el("div", { class: "gh-heatmap-plot" }, [months, grid]);
  const block = el("div", { class: "gh-block gh-heatmap-block" }, [
    headline,
    el("p", { class: "gh-heatmap-caption", text: "Last 12 months, day by day" }),
    el("div", { class: "gh-heatmap-scroll" }, [plot]),
    scale,
    tip
  ]);

  /* One listener on the grid rather than 365 — the tooltip follows whichever
     cell is under the pointer. */
  const showTip = (e) => {
    const cell = e.target.closest(".gh-cell[data-tip]");
    if (!cell) return;
    tip.textContent = cell.getAttribute("data-tip");
    tip.hidden = false;
    const box = block.getBoundingClientRect();
    const spot = cell.getBoundingClientRect();
    // Clamped so a cell at either end doesn't push the label off the panel.
    const half = tip.offsetWidth / 2;
    const x = spot.left - box.left + spot.width / 2;
    tip.style.left = Math.round(Math.min(Math.max(x, half), box.width - half)) + "px";
    tip.style.top = Math.round(spot.top - box.top) + "px";
  };
  grid.addEventListener("mousemove", showTip);
  grid.addEventListener("mouseleave", () => { tip.hidden = true; });

  return block;
}

function renderGitHub() {
  const root = $("#githubPanel");
  const user = SITE_DATA.github;
  if (!root || !user) return;

  const profileUrl = `https://github.com/${user}`;
  const fail = () => {
    root.innerHTML = "";
    root.appendChild(el("p", { class: "gh-fallback" }, [
      document.createTextNode("Live GitHub data isn't available right now. "),
      el("a", { href: profileUrl, text: "View the profile on GitHub", target: "_blank", rel: "noopener" })
    ]));
  };

  root.appendChild(el("p", { class: "gh-loading", text: "Loading GitHub activity…" }));

  ghCalendar(user)
    .then((cal) => {
      if (!cal) return fail();
      const graph = contributionHeatmap(cal);
      if (!graph) return fail();

      root.innerHTML = "";
      root.appendChild(graph);
      root.appendChild(el("p", { class: "gh-source" }, [
        document.createTextNode("Live contribution total across all repositories, private work included · "),
        el("a", { href: profileUrl, text: "@" + user, target: "_blank", rel: "noopener" })
      ]));
    })
    .catch(fail);
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

/* ---------- collapsible regions ----------
   The open/close mechanism behind the project cards. Section headings used to
   use it too; they don't any more, but it stays generic — nothing here knows
   what a project is, so any region can be wrapped.

   The animation is the grid 0fr → 1fr trick rather than max-height: a region
   animates to its real height without anyone having to guess a pixel ceiling
   that a long project would silently blow past. The inner wrapper is what
   clips, so the outer grid row is the only thing being transitioned.

   Collapsing sets hidden on the inner wrapper once the transition ends, so a
   closed region is genuinely out of the tab order and out of find-in-page —
   a region that merely has zero height still traps a keyboard user in it. */
let collapseSeq = 0;

function makeCollapsible(region, expanded) {
  const inner = el("div", { class: "collapse-inner" });
  region.parentNode.insertBefore(inner, region);
  inner.appendChild(region);

  const shell = el("div", { class: "collapse" });
  inner.parentNode.insertBefore(shell, inner);
  shell.appendChild(inner);

  shell.id = region.id ? region.id + "-collapse" : "collapse-" + ++collapseSeq;
  setCollapsed(shell, !expanded, true);
  return shell;
}

const REDUCED_MOTION = window.matchMedia
  && window.matchMedia("(prefers-reduced-motion: reduce)");

function setCollapsed(shell, collapsed, immediate) {
  const inner = shell.firstElementChild;
  shell.classList.toggle("is-collapsed", collapsed);

  /* With motion reduced the CSS transition is off, so transitionend never
     fires and the region would stay focusable at zero height. Same branch as
     the initial state: hide it outright. */
  const now = immediate || (REDUCED_MOTION && REDUCED_MOTION.matches);

  if (collapsed) {
    // hide only once it has finished shrinking, or the region vanishes mid-slide
    if (now) inner.hidden = true;
    else shell.addEventListener("transitionend", function done(e) {
      if (e.target !== shell) return;
      shell.removeEventListener("transitionend", done);
      if (shell.classList.contains("is-collapsed")) inner.hidden = true;
    });
  } else {
    inner.hidden = false;
  }
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
   so all the page has to do is announce the intent. Behind the `blogs` feature
   flag: when it is off the nav button is removed from the DOM rather than
   hidden, so it does not linger as a keyboard tab stop. */
function initBlogsLink() {
  const btn = $("#navBlogs");
  if (!btn) return;
  if (!featureOn("blogs")) {
    btn.remove();
    return;
  }
  btn.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("open-blog-drawer"));
  });
}

renderHero();
renderSkills();
renderProjects();
renderAwards();
renderCertifications();
renderHobbies();
renderGitHub();
initProjectCards();
initNav();
initMobileNav();
initReveal();
initPortrait();
initBlogsLink();
