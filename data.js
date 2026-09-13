
const SITE_DATA = {
  features: {
    blogs: false
  },

  profile: {
    name: "Rajesh Lakkam",
    role: "Senior Software Engineer",
    tagline: "Building the engines behind reliable, scalable applications.",
    location: "Bengaluru, Karnataka",
    email: "rajesh.lakkam327@gmail.com",
    status: "building enterprise software",

    links: [
      { label: "GitHub", url: "https://github.com/RajeshLakkam" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/rajesh-lakkam/" },
      { label: "Résumé (PDF)", url: "assets/Rajesh_Lakkam.pdf" }
    ],

    origin: `I'm a Java backend developer with four and a half years of
experience building and migrating enterprise-grade applications — Most of that time has been spent in the
Spring ecosystem: Spring Boot services, REST APIs that other teams build
on top of, and the data layer underneath them.

The work I enjoy most sits where design meets delivery — drawing service
boundaries that hold up, trading brittle batch jobs for event-driven
flows, and running things cloud-native on Google Cloud with Pub/Sub and
Dataflow. I write tests early rather than late, not out of discipline but
because it's the fastest way I know to find out I was wrong about
something.

Four and a half years in, the thing I've come to value most is
unremarkable reliability: clear boundaries, code the next person can
read, deploys nobody has to babysit. I'll work across the stack when a
feature needs it — Angular on the front end, some .NET earlier on — but
backend systems are where I do my best thinking.`,

    // Closes the overview. Text between *asterisks* renders in the accent.
    credo: `the best
engineers aren't the ones with every answer — they're the ones who know
*where the system fails*, and who are honest about the *trade-offs* they
chose along the way.`
  },

  github: "RajeshLakkam",

  skillIcons: {
    "Java": "devicon-java-plain",
    "TypeScript": "devicon-typescript-plain",
    "JavaScript": "devicon-javascript-plain",
    "SQL": "i-db",
    "C#": "devicon-csharp-plain",

    "Google Cloud Platform": "devicon-googlecloud-plain",
    "Cloud Run": "i-play",
    "Kubernetes Engine (GKE)": "devicon-kubernetes-plain",
    "Pub/Sub": "i-broadcast",
    "Dataflow": "i-flow",
    "Cloud Storage": "i-box",
    "IAM": "i-key",
    "Gemini": "i-sparkle",

    "Spring Boot": "devicon-spring-original",
    "Spring MVC": "devicon-spring-original",
    "Spring Security": "devicon-spring-original",
    "Spring Data": "devicon-spring-original",
    "Hibernate": "devicon-hibernate-plain",
    "MySQL": "devicon-mysql-original",
    "REST APIs": "i-braces",
    "OpenAPI": "devicon-swagger-plain",

    "Microservices": "i-blocks",
    "Event-driven architecture": "i-bolt",
    "Cloud-native applications": "i-cloud",
    "Scalability": "i-chart",
    "Software design": "i-compass",

    "JUnit": "devicon-junit-plain",
    "Test-driven development": "i-check",
    "Unit testing": "i-flask",
    "Integration testing": "i-link",
    "Code coverage": "i-shield",
    "Postman": "devicon-postman-plain",

    "Git": "devicon-git-plain",
    "Maven": "devicon-maven-plain",
    "Docker": "devicon-docker-plain",
    "CI/CD": "i-cycle",
    "DevOps": "i-infinity",
    "Microsoft Azure": "devicon-azure-plain",

    "Angular": "devicon-angular-plain",
    "HTML": "devicon-html5-plain",
    "CSS": "devicon-css3-plain",
    "Bootstrap": "devicon-bootstrap-plain",

    ".NET Framework": "devicon-dot-net-plain",
    "ASP.NET": "devicon-dotnetcore-plain"
  },

  skills: [
    {
      group: "Languages", icon: "i-code",
      items: ["Java", "TypeScript", "JavaScript", "SQL", "C#"]
    },
    {
      group: "Google Cloud", icon: "i-cloud",
      items: [
        "Google Cloud Platform", "Cloud Run", "Kubernetes Engine (GKE)",
        "Pub/Sub", "Dataflow", "Cloud Storage", "IAM", "Gemini"
      ]
    },
    {
      group: "Backend & APIs", icon: "i-server",
      items: [
        "Spring Boot", "Spring MVC", "Spring Security", "Spring Data",
        "Hibernate", "MySQL", "REST APIs", "OpenAPI"
      ]
    },
    {
      group: "Architecture", icon: "i-blocks",
      items: [
        "Microservices", "Event-driven architecture", "Cloud-native applications",
        "Scalability", "Software design"
      ]
    },
    {
      group: "Testing & quality", icon: "i-check",
      items: [
        "JUnit", "Test-driven development", "Unit testing",
        "Integration testing", "Code coverage", "Postman"
      ]
    },
    {
      group: "Build & delivery", icon: "i-terminal",
      items: ["Git", "Maven", "Docker", "CI/CD", "DevOps", "Microsoft Azure"]
    },
    {
      group: "Front-end", icon: "i-window",
      items: ["Angular", "HTML", "CSS", "Bootstrap"]
    },
    {
      group: "Also worked with", icon: "i-archive",
      items: [".NET Framework", "ASP.NET"]
    }
  ],

  projects: [
    {
      title: "Gift Registry Data Migration & Bi-Directional Sync",
      org: "Kognivera · Senior Software Engineer · Senior Java Resource",
      period: "",
      summary: "Moving Gift Registry data off Oracle ATG and onto PostgreSQL without ever taking either system offline. The answer was a real-time, bi-directional sync: whatever is written on one side shows up on the other, so the legacy monolith and the new microservices can both stay live and correct through the whole transition.",
      highlights: [
        "Architected and implemented a bi-directional, real-time data synchronization solution to migrate Gift Registry data from Oracle ATG to PostgreSQL, letting legacy and new microservices run concurrently without data inconsistency.",
        "Designed a real-time migration strategy on Google Cloud Pub/Sub and Dataflow, keeping data continuously available in both the legacy ATG application and the new Spring Boot platform.",
        "Built event-driven pipelines with Cloud Dataflow that stream changes in real time — propagating new records written to PostgreSQL back to Oracle ATG for legacy dependencies, and vice versa.",
        "Bridged two heterogeneous database ecosystems (Oracle ATG → PostgreSQL) inside a microservices architecture, reconciling schema and data-model differences while holding referential integrity on both sides.",
        "Delivered a live dual-write synchronization framework: anything added or modified in either system is reflected immediately in the other, with no manual intervention."
      ],
      stack: ["Java", "Spring Boot", "Google Cloud Platform", "Pub/Sub", "Dataflow", "PostgreSQL", "Oracle ATG", "Event-driven"],
      links: [],
      media: { type: "none" }
    },
    {
      title: "Liverpool Gift Registry",
      org: "Kognivera · Senior Software Engineer · Senior Java Resource",
      period: "",
      summary: "A monolithic Oracle ATG Gift Registry service broken out into a distributed microservices architecture — a core component of a high-traffic e-commerce platform handling millions of real-time transactions and events. I built the main services from the ground up and sat between the solution architect and the developers implementing against his decisions.",
      highlights: [
        "Led the migration of a monolithic Oracle ATG Gift Registry service to a distributed microservices architecture, delivering a core component of a platform that handles millions of real-time transactions and events.",
        "Served as the technical bridge between the solution architect and junior developers — turning high-level architectural decisions into actionable tasks and keeping implementation consistent.",
        "Engineered the platform's main microservices from the ground up, designing RESTful APIs and event-driven communication (Pub/Sub / RabbitMQ) for high-throughput, low-latency transactional flows.",
        "Resolved application-layer performance bottlenecks and verified the reliability and correctness of every service across development, QA and production at scale.",
        "Championed code quality and team growth — mentoring junior developers, running rigorous pull request reviews, and enforcing clean code and TDD throughout the project lifecycle."
      ],
      stack: ["Java", "Spring Boot", "Microservices", "REST APIs", "Pub/Sub", "RabbitMQ", "Oracle ATG", "Event-driven"],
      links: [],
      media: { type: "none" }
    },
    {
      title: "WFE Migration",
      org: "Infosys · Systems Engineer · Java Resource",
      period: "",
      summary: "A legacy .NET application re-engineered into Spring Boot microservices. The work began with reading the old codebase closely enough to know what its behaviour actually was — not what it was documented to be — then rebuilding it in Java, with the test coverage the original never had.",
      highlights: [
        "Re-engineered a legacy .NET application into Spring Boot microservices, rebuilding the core business logic and exposing RESTful APIs integrated with downstream services.",
        "Achieved 92% unit-test coverage with JUnit and Mockito; used SonarQube for static analysis and early bug detection.",
        "Recognised with the Rise Award twice for outstanding project contributions."
      ],
      stack: ["Java", "Spring Boot", "Microservices", "REST APIs", "JUnit", "Mockito", "SonarQube", ".NET (legacy)"],
      links: [],
      media: { type: "none" }
    },
    {
      title: "Mlivr Application",
      org: "Infosys · Systems Engineer · Angular Resource",
      period: "",
      summary: "Front-end work on Mlivr: building the responsive Angular UI, and the integration layer where those components meet the backend's REST APIs.",
      highlights: [
        "Built responsive Angular UIs and collaborated with backend teams to integrate front-end components with RESTful APIs.",
        "Diagnosed and resolved UI bugs using browser developer tools."
      ],
      stack: ["Angular", "TypeScript", "HTML", "CSS", "REST APIs"],
      links: [],
      media: { type: "none" }
    },
    {
      title: "Full-stack engineering training",
      org: "Infosys · Systems Engineer Trainee",
      period: "",
      summary: "Infosys' foundation programme — the six months that turned a graduate into someone who could be handed a service and trusted with it.",
      highlights: [
        "Completed intensive full-stack training covering Java, DBMS and Angular.",
        "Graduated the Foundation Training Programme in the High Performer category with 91%."
      ],
      stack: ["Java", "SQL", "Angular"],
      links: [],
      media: { type: "none" }
    }
  ],

  awards: [
    {
      title: "Microservices Maestro",
      org: "Kognivera",
      note: `Recognised by the team for establishing real-time, two-way data
synchronization between the new Gift Registry microservices on PostgreSQL
and the legacy monolith on an ATG Oracle database — keeping the legacy
application fully supported, with no data loss, using Dataflow and
Pub/Sub across the whole application.`,
      media: {
        type: "image",
        src: "assets/awards/microservices-maestro.jpg",
        alt: "KogniVera and Liverpool appreciation certificate for the Gift Registry project, Sprint I — \"Recognizing your excellence\", addressed to Rajesh Lakkam, Our Microservices Maestro."
      }
    },
    {
      title: "Rise Award",
      org: "Infosys",
      note: `Awarded in two consecutive quarters for contributions to the WFE
migration project.`
    }
  ],

  certifications: [
    {
      title: "Professional Cloud Developer",
      issuer: "Google Cloud",
      icon: "devicon-googlecloud-plain"
    },
    {
      title: "Certified Java Developer",
      issuer: "Infosys",
      icon: "devicon-java-plain"
    },
    {
      title: "Certified Spring Boot Developer",
      issuer: "Infosys",
      icon: "devicon-spring-original"
    },
    {
      title: "Azure Fundamentals",
      issuer: "Microsoft Certified",
      icon: "devicon-azure-plain"
    },
    {
      title: "Certified Angular Developer",
      issuer: "Infosys",
      icon: "devicon-angular-plain"
    },
    {
      title: "Certified DevOps Professional (Open Source)",
      issuer: "Infosys",
      icon: "i-infinity"
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
window.SITE_DATA = SITE_DATA;
