Put your files here.

- `resume.pdf` — referenced by the "Résumé (PDF)" link in data.js
- `portrait.jpg` — your photo; covers the hero readout panel until it is hovered
- `projects/<name>.pdf` — a project writeup, embedded inline on that project's card
- `projects/<name>.mp4` — a demo video, embedded inline with playback controls
- `projects/<name>.jpg` — a screenshot

Nothing needs to be renamed in the HTML/CSS — just point `media.src` in
data.js at whatever path you put the file at. If a path in data.js
doesn't match a real file, that section of the page shows a small
"add a file here" note instead of a broken embed, so the site never
looks broken while you're filling it in.
