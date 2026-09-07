// ============================================================
// <blog-drawer> — a self-contained widget.
//
// This is the "micro frontend" piece: its own file, its own
// Shadow DOM, its own template and event handling. It only reads
// window.SITE_DATA.blogs from the page and otherwise doesn't know
// or care how the rest of the site is built. You could lift this
// one file into a completely different site and it would still work,
// as long as that site also defines SITE_DATA.blogs somewhere.
//
// It intentionally reuses the page's design tokens (--signal,
// --panel, etc.) — CSS custom properties inherit through the
// Shadow DOM boundary even though normal styles don't, so the
// widget stays visually consistent without copy-pasting the theme.
// ============================================================

class BlogDrawer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.open = false;
  }

  connectedCallback() {
    const blogs = (window.SITE_DATA && window.SITE_DATA.blogs) || [];
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          right: 1.25rem;
          bottom: 0;
          z-index: 50;
          font-family: var(--font-body, sans-serif);
        }

        .panel {
          width: min(320px, calc(100vw - 2.5rem));
          background: var(--panel, #0E1826);
          border: 1px solid var(--line, #1F3040);
          border-bottom: none;
          transform: translateY(calc(100% - 42px));
          transition: transform 0.45s var(--ease, cubic-bezier(.16,1,.3,1));
        }

        :host([data-open="true"]) .panel {
          transform: translateY(0);
        }

        .handle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.7rem 1rem;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          font-family: var(--font-mono, monospace);
          font-size: 0.82rem;
          color: var(--signal, #4CF2C8);
        }

        .handle .chevron {
          transition: transform 0.35s var(--ease, ease);
          color: var(--ink-dim, #7C90A3);
        }
        :host([data-open="true"]) .handle .chevron { transform: rotate(180deg); }

        .list {
          max-height: 46vh;
          overflow-y: auto;
          border-top: 1px solid var(--line, #1F3040);
          padding: 0.25rem 0;
        }

        .entry {
          display: block;
          padding: 0.7rem 1rem;
          text-decoration: none;
          border-bottom: 1px solid var(--line, #1F3040);
        }
        .entry:last-child { border-bottom: none; }

        .entry .title {
          color: var(--ink, #DCE6EC);
          font-size: 0.92rem;
          font-weight: 500;
          display: block;
        }
        .entry .source {
          color: var(--signal, #4CF2C8);
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          display: block;
          margin-top: 0.15rem;
        }
        .entry .note {
          color: var(--ink-dim, #7C90A3);
          font-size: 0.82rem;
          display: block;
          margin-top: 0.35rem;
          line-height: 1.5;
        }
        .entry:hover .title { color: var(--signal, #4CF2C8); }

        .empty {
          padding: 1rem;
          color: var(--ink-faint, #45566A);
          font-size: 0.85rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .panel, .handle .chevron { transition: none; }
        }
      </style>

      <div class="panel">
        <button class="handle" id="handle" aria-expanded="false">
          <span>Blogs I'm reading (${blogs.length})</span>
          <span class="chevron" aria-hidden="true">&#9650;</span>
        </button>
        <div class="list">
          ${blogs.length
            ? blogs.map((b) => `
                <a class="entry" href="${b.url}" target="_blank" rel="noopener">
                  <span class="title">${b.title}</span>
                  <span class="source">${b.source}</span>
                  ${b.note ? `<span class="note">${b.note}</span>` : ""}
                </a>
              `).join("")
            : `<div class="empty">Add entries to SITE_DATA.blogs in data.js.</div>`
          }
        </div>
      </div>
    `;

    this._handle = this.shadowRoot.getElementById("handle");
    this._handle.addEventListener("click", () => this.toggle());

    // let the main nav's "Blogs" link open this from anywhere on the page
    document.addEventListener("open-blog-drawer", () => this.setOpen(true));
  }

  toggle() { this.setOpen(!this.open); }

  setOpen(value) {
    this.open = value;
    this.setAttribute("data-open", String(value));
    this._handle.setAttribute("aria-expanded", String(value));
  }
}

customElements.define("blog-drawer", BlogDrawer);
