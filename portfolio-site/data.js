// ============================================================
// SITE CONTENT — this is the only file you should need to edit.
// Everything on the page is generated from the object below.
//
// This version is filled with realistic PLACEHOLDER content —
// including sample PDF, image, and video files under assets/ —
// so you can see the full site once it's hosted before swapping
// in your real details. Replace everything here with your own.
// ============================================================

const SITE_DATA = {
  profile: {
    name: "Alex Rivera",
    role: "Software Engineer",
    tagline: "I build backend systems and developer tools, and I like taking things apart to see how they actually work.",
    location: "Austin, TX",
    email: "alex@example.com",
    status: "Currently deep in distributed systems and developer tooling.",

    links: [
      { label: "GitHub", url: "https://github.com/yourhandle" },
      { label: "LinkedIn", url: "https://linkedin.com/in/yourhandle" },
      { label: "Résumé (PDF)", url: "assets/resume.pdf" }
    ],

    origin: `I got into software engineering by accident, fixing a spreadsheet
macro for a part-time job that had quietly grown into the thing the
whole team depended on. Watching one small script save people hours
every week was the hook — I wanted to know how far that idea could go.

Since then I've mostly worked on backend systems and internal tools:
the unglamorous plumbing that has to be right or everything downstream
breaks. I like problems with a clear before-and-after — a report that
used to take 40 seconds and now takes two, a deploy that used to need
a person babysitting it and now doesn't.

Outside of work I'm usually pulling something apart to understand it,
which is as true of my hobbies as it is of my job.`
  },

  skills: [
    { group: "Languages", items: ["Python", "TypeScript", "Go", "SQL"] },
    { group: "Tools & platforms", items: ["Docker", "AWS", "PostgreSQL", "Kafka"] },
    { group: "Areas", items: ["Distributed systems", "API design", "Data pipelines"] }
  ],

  projects: [
    {
      title: "Analytics pipeline rewrite",
      period: "2024",
      summary: "Reporting queries were timing out as event volume grew, so I re-architected the pipeline around streaming aggregation instead of nightly batch jobs — p95 query latency dropped from 40s to under 2s.",
      stack: ["Python", "Kafka", "PostgreSQL"],
      links: [{ label: "Writeup", url: "assets/projects/analytics-pipeline.pdf" }],
      media: { type: "pdf", src: "assets/projects/analytics-pipeline.pdf" }
    },
    {
      title: "Field inspection mobile app",
      period: "2023",
      summary: "Built the offline-first mobile client field inspectors use to log site visits without signal, syncing automatically once they're back online.",
      stack: ["React Native", "SQLite"],
      links: [{ label: "Code", url: "#" }],
      media: { type: "image", src: "assets/projects/mobile-app.jpg" }
    },
    {
      title: "Command-line deploy tool",
      period: "2022",
      summary: "A small CLI that replaced a wiki page of manual deploy steps with a single command, cutting deploy time from ~25 minutes to about 3.",
      stack: ["Go"],
      links: [{ label: "Code", url: "#" }],
      media: { type: "video", src: "assets/projects/cli-tool-demo.mp4" }
    },
    {
      title: "Personal budgeting tool",
      period: "2021",
      summary: "A weekend project turned daily habit — a plain-text ledger with a small parser that categorizes spending automatically.",
      stack: ["Python"],
      links: [{ label: "Code", url: "#" }],
      media: { type: "none" }
    }
  ],

  hobbies: [
    {
      title: "Mechanical keyboards",
      note: "Building and tuning them from loose parts — mostly an excuse to solder something."
    },
    {
      title: "Bread baking",
      note: "Currently in a long argument with my starter about hydration percentages."
    },
    {
      title: "Old radios",
      note: "Restoring vacuum-tube radios from the 1950s, one bad capacitor at a time."
    }
  ]
};
