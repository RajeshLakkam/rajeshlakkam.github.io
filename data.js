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
    name: "Rajesh Lakkam",
    role: "Software Engineer",
    tagline: "I like taking things apart to see how they actually work.",
    location: "Bengaluru, Karnataka",
    email: "rajesh.lakkam327@gmail.com",
    status: "building enterprise software",

    links: [
      { label: "GitHub", url: "https://github.com/RajeshLakkam" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/rajesh-lakkam/" },
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

  // Grouped so the strongest, most current work (Google Cloud, Spring) reads
  // first and the older .NET/front-end work sits further down. The grid is
  // auto-fit, so adding or removing a group reflows without touching the CSS.
  skills: [
    {
      group: "Languages",
      items: ["Java", "TypeScript", "JavaScript", "SQL", "C#"]
    },
    {
      group: "Google Cloud",
      items: [
        "Google Cloud Platform", "Cloud Run", "Kubernetes Engine (GKE)",
        "Pub/Sub", "Dataflow", "Cloud Storage", "IAM", "Gemini"
      ]
    },
    {
      group: "Backend & APIs",
      items: [
        "Spring Boot", "Spring MVC", "Spring Security", "Spring Data",
        "Hibernate", "MySQL", "REST APIs", "OpenAPI"
      ]
    },
    {
      group: "Architecture",
      items: [
        "Microservices", "Event-driven architecture", "Cloud-native applications",
        "Scalability", "Software design"
      ]
    },
    {
      group: "Testing & quality",
      items: [
        "JUnit", "Test-driven development", "Unit testing",
        "Integration testing", "Code coverage", "Postman"
      ]
    },
    {
      group: "Build & delivery",
      items: ["Git", "Maven", "Docker", "CI/CD", "DevOps", "Microsoft Azure"]
    },
    {
      group: "Front-end",
      items: ["Angular", "HTML", "CSS", "Bootstrap"]
    },
    {
      group: "Also worked with",
      items: [".NET Framework", "ASP.NET"]
    }
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
  ],

  // Shown in the <blog-drawer> widget pinned to the bottom-right of the page.
  blogs: [
    {
      title: "Designing Data-Intensive Applications, revisited",
      source: "martin.kleppmann.com",
      url: "https://martin.kleppmann.com/",
      note: "The chapter on consensus is the one I keep coming back to."
    },
    {
      title: "Notes on Distributed Systems for Young Bloods",
      source: "somethingsimilar.com",
      url: "https://www.somethingsimilar.com/2013/01/14/notes-on-distributed-systems-for-young-bloods/",
      note: "Still the most honest description of what production actually feels like."
    },
    {
      title: "Writing",
      source: "brandur.org",
      url: "https://brandur.org/articles",
      note: "Long-form posts on Postgres and API design, written by someone who ships."
    },
    {
      title: "The Pragmatic Engineer",
      source: "newsletter.pragmaticengineer.com",
      url: "https://newsletter.pragmaticengineer.com/",
      note: "How engineering orgs actually work, minus the LinkedIn gloss."
    }
  ]
};

// the <blog-drawer> widget lives in its own file and its own Shadow DOM, so it
// reads content off the global rather than importing anything from this file.
window.SITE_DATA = SITE_DATA;
