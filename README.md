# Portfolio site

A plain HTML/CSS/JS site — no build step, no framework. Open `index.html`
in a browser (ideally via a local server, see below) or push it straight
to GitHub Pages.

## File map

- `index.html` — page structure and the four tabs (About, Projects, Hobbies, Contact)
- `data.js` — **all your content lives here.** Name, bio, skills, projects, hobbies.
- `styles.css` — visual design (colors, type, layout)
- `script.js` — renders `data.js` into the page, handles tab switching and media embeds
- `assets/` — drop your résumé PDF, project PDFs, videos, and screenshots here

## Filling it in

1. Open `data.js` and replace every placeholder value (name, tagline, origin
   story, skills, project entries, hobbies).
2. For a project with a PDF or video, add the file under `assets/` (or
   `assets/projects/`) and point `media.src` at it — see the comments
   above the `projects` array in `data.js` for the exact shape.
3. Delete or duplicate project/hobby blocks freely; the page just loops
   over whatever's in the array.

## Previewing locally

Opening `index.html` directly (`file://`) mostly works, but the check
that confirms a PDF/video file actually exists uses `fetch`, which some
browsers block on `file://`. Serve the folder instead:

```bash
cd portfolio-site
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Create a new GitHub repository (public, unless you have GitHub Pro/Team
   for private Pages).
2. Push this folder's contents to the repo's default branch:

   ```bash
   cd portfolio-site
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment → Source**,
   choose "Deploy from a branch," pick `main` and `/ (root)`, then save.
4. The site publishes at `https://<you>.github.io/<repo>/` within a
   minute or two. If you want it at the bare `https://<you>.github.io`,
   name the repo exactly `<you>.github.io` instead.

Large video files count against GitHub's repo size limits (soft cap
around 1 GB, individual files over 100 MB are rejected outright) — for
anything beyond a short demo clip, consider hosting the video elsewhere
(e.g. YouTube unlisted) and swapping the project's `media.type` to a
plain link instead of `"video"`.
