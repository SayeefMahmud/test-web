// All site copy except projects (`content/projects.ts`) and case studies
// (`content/projects/<slug>.mdx`). Ported from `docs/handoff/design/content.js`
// and the inline copy in `docs/handoff/design/A-Home.dc.html`.
//
// Pending from the owner (keep as-is until provided, don't invent):
// resume PDF (resume buttons are also commented out until the owner wants them).
// Experience, stack and achievements follow the owner's Cefalo CV and contest resume.

import type {
  Achievement,
  Action,
  IconLink,
  EarlierEntry,
  ExperienceEntry,
  Fact,
  Link,
  MoreProject,
  Paragraph,
  SkillGroup,
} from "./types";

/** Identity and global links. A missing `href` hides that link everywhere. */
export const site = {
  name: "Sayeef Mahmud",
  location: "Dhaka, Bangladesh",
  url: "https://sayeefmahmud.com",
  email: "smahmud2866@gmail.com",
  /** Set to "/resume.pdf" once `public/resume.pdf` exists; all resume buttons stay hidden until then. */
  resumeUrl: undefined as string | undefined,
  copyrightYear: "2026",
  /** 4:5 photo used in Hero and About. Remove to show the striped placeholder. */
  portrait: "/images/portrait.jpg" as string | undefined,
} as const;

export const social = {
  linkedin: { label: "LinkedIn", href: "https://linkedin.com/in/notsayeef/" },
  github: { label: "GitHub", href: "https://github.com/SayeefMahmud" },
  codeforces: {
    label: "Codeforces",
    href: "https://codeforces.com/profile/thisIsMorningstar",
  },
  codechef: {
    label: "CodeChef",
    href: "https://www.codechef.com/users/sayeef_mahmud",
  },
} satisfies Record<string, Link>;

const resume = (label: string, variant: Action["variant"]): Action => ({
  label,
  href: site.resumeUrl,
  variant,
  arrow: "↓",
});

/** Shared UI labels, so components hold no copy. */
export const labels = {
  openMenu: "Open menu",
  closeMenu: "Close menu",
  switchTheme: "Switch theme",
  resume: "Resume",
  menuResume: "Download resume (PDF)",
  projectFacts: {
    status: "Status",
    devices: "Runs on",
    stack: "Stack",
  },
  caseStudyLink: "Case study",
  caseStudyEyebrow: "Case study",
  allProjects: "All projects",
  onThisPage: "On this page",
  nextProject: "Next project",
  screenshots: "Screenshots",
  stack: "Stack",
} as const;

export const header = {
  /** Links derive from `nav` labels in `content/home.ts`; this is only the resume button. */
  resume: resume(labels.resume, "outline"),
};

export const mobileMenu = {
  resume: resume(labels.menuResume, "primary"),
  /** Links in the bottom row next to the email. */
  links: [social.linkedin, social.github] satisfies Link[],
};

export const hero = {
  eyebrow: "Dhaka, Bangladesh · Software engineer at Cefalo",
  headline:
    "I'm Sayeef Mahmud, a full-stack engineer building production web, mobile and AI-assisted systems.",
  lead: "I'm an ICPC World Finalist with more than five years in competitive programming. Now I build production software at Cefalo, mostly ASP.NET Core and Next.js. I work across the whole stack, from database design and APIs to frontends and deployment, and I enjoy the hard problems most. Outside work I ship my own apps for desktop, mobile and the web.",
  portraitAlt: "Sayeef Mahmud",
  actions: [
    { label: "View projects", href: "#projects", variant: "secondary" },
    // Replaced by the profile icons below (owner, 2026-11-21).
    // { label: "Contact", href: "#contact", variant: "secondary" },
    // Resume download disabled for now (owner, 2026-11-21); uncomment to restore.
    // resume("Resume (PDF)", "text"),
  ] satisfies Action[],
  /** Icon links after the hero button. Remove an entry to hide its icon. */
  profiles: [
    { ...social.github, icon: "github" },
    { ...social.linkedin, icon: "linkedin" },
    { label: "Email", href: `mailto:${site.email}`, icon: "email" },
  ] satisfies IconLink[],
  facts: [
    { label: "Work", value: "Associate Software Engineer, Cefalo" },
    { label: "ICPC", value: "World Finalist" },
    { label: "Anthropic", value: "Claude Certified Architect" },
    { label: "Codeforces", value: "Master, max 2183" },
  ] satisfies Fact[],
};

/** `/projects`: every selected project, then the smaller ones. */
export const projectsPage = {
  title: "All projects",
  description:
    "Web, desktop and mobile apps and games by Sayeef Mahmud, with stack, status and case studies.",
};

export const moreProjects = {
  title: "More projects",
  items: [
    { name: "Book Recommender System", type: "Web app" },
    {
      name: "QR code detection in perspective-distorted images",
      type: "Deep learning",
    },
    { name: "AI-powered semantic search engine", type: "Hackathon" },
  ] satisfies MoreProject[],
};

export const experience = {
  /** Newest first. Several projects at one employer go in `projects`, so the role shows once. */
  entries: [
    {
      time: "Jul 2025 – Present",
      role: "Associate Software Engineer",
      org: "Cefalo",
      projects: [
        {
          name: "Cutters",
          time: "Sep 2026 – Present",
          context: "Digital platform for a Nordic hair-salon chain",
          summary:
            "Traced duplicate customer profiles from the React Native app to the POS through GCP logs and MongoDB, then moved POS customer creation to a background Pub/Sub subscriber: median sign-up time fell from 7.1 s to 0.4 s and new duplicates by 98%. Isolated a third-party API slowdown by instrumenting 1,217 vendor calls. After the Vercel shutdown, rebuilt the contact form with signed Cloud Storage uploads and rate limiting, fixing a bug that silently dropped attachments.",
          tech: [
            "ASP.NET Core",
            "Node.js",
            "Next.js",
            "React Native",
            "MongoDB",
            "Google Cloud",
            "Pub/Sub",
            "Sentry",
          ],
        },
        {
          name: "OceanQuest",
          time: "Jul 2026 – Sep 2026",
          context: "B2B ocean-literacy platform",
          summary:
            "Architected the identity and multi-tenancy layer, where each partner organisation signs in through its own Microsoft Entra tenant. Wrote a custom issuer validator that checks every token against a database-backed tenant registry, and removed the Global Administrator consent step so partners activate with a single link. Also built the Ocean Impact dashboard, which turns verified ocean actions into CSRD-ready reports mapped to GRI/ESRS, migrated the map layer to Mapbox GL behind a shared adapter, and built an Obsidian knowledge vault as persistent AI-agent memory for the codebase.",
          tech: [
            "ASP.NET Core 8",
            "EF Core",
            "PostgreSQL",
            "Redis",
            "React",
            "TypeScript",
            "Entra ID",
            "Azure",
          ],
        },
        {
          name: "HR Portal",
          time: "Jan 2026 – Jul 2026",
          context: "Cefalo's HR system, used by 250+ employees",
          summary:
            "Built the Team Fund module end to end, with separate views for HR, team leads, engineering managers and employees, and the in-product AI assistant chat with session history and markdown replies. Made table sort, filters and pagination persist in the URL, so list views can be shared and survive a reload. Set up the team's Claude Code workflow: project docs, custom skills for feature work and code review, hooks that enforce standards, and subagents.",
          tech: [
            "Next.js",
            "React",
            "TypeScript",
            "Ant Design",
            "Tailwind CSS",
            "ASP.NET Core",
            "EF Core",
          ],
        },
        {
          name: "InnovatorsBay",
          time: "Jul 2025 – Jan 2026",
          context: "Platform for founders to share startup ideas",
          summary:
            "Built the platform full-stack with React and Express.js: a REST API with JWT role-based access, a PostgreSQL schema on TypeORM, Swagger docs and Jest tests. Then re-architected the backend in ASP.NET Core with Clean Architecture, ASP.NET Identity, policy-based authorization, Hangfire background jobs, Serilog logging and xUnit tests.",
          tech: [
            "React",
            "Redux",
            "Express.js",
            "PostgreSQL",
            "TypeORM",
            "ASP.NET Core",
            "MSSQL",
            "Hangfire",
          ],
        },
      ],
    },
  ] satisfies ExperienceEntry[],
  earlierTitle: "Earlier",
  earlier: [] as EarlierEntry[],
};

export const stack: SkillGroup[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "C#", "C", "C++", "SQL"],
  },
  {
    category: "Frontend",
    items: [
      "Next.js",
      "React",
      "Redux Toolkit",
      "TanStack Query",
      "Tailwind CSS",
      "Ant Design",
    ],
  },
  {
    category: "Backend",
    items: [
      "ASP.NET Core",
      "Node.js",
      "Express.js",
      "EF Core",
      "Prisma",
      "TypeORM",
      "Hangfire",
    ],
  },
  {
    category: "Mobile & Desktop",
    items: ["React Native (Expo)", "Flutter", "Unity"],
  },
  {
    category: "Cloud & Identity",
    items: [
      "Azure (Container Apps, Static Web Apps, Communication Services)",
      "Google Cloud (GKE, Pub/Sub, BigQuery)",
      "Vercel",
      "Microsoft Entra ID",
    ],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MSSQL", "MongoDB", "Redis", "SQLite"],
  },
  {
    category: "AI & agentic tooling",
    items: [
      "Claude Code",
      "Skills",
      "Hooks",
      "Subagents",
      "MCP",
      "Agent knowledge bases",
    ],
  },
  {
    category: "Architecture & DevOps",
    items: [
      "Clean Architecture",
      "CQRS",
      "Multi-tenancy",
      "Docker",
      "GitHub Actions",
      "CircleCI",
      "Jenkins",
      "Serilog",
      "Sentry",
    ],
  },
  {
    category: "Testing & practices",
    items: [
      "xUnit",
      "Jest",
      "Vitest",
      "Moq",
      "FakeItEasy",
      "Spec-driven development",
      "Test-driven development",
    ],
  },
];

export const achievements: Achievement[] = [
  {
    title: "Claude Certified Architect – Foundations",
    detail: "Anthropic",
    year: "2026",
    href: "https://www.credly.com/badges/9b409dd9-99ed-4575-a8b7-5dc8b6145c76/public_url",
  },
  {
    title: "Unsupervised Learning, Recommenders, Reinforcement Learning",
    detail: "Coursera",
    year: "2024",
    href: "https://coursera.org/share/3ad31f201bf69ba6d603ffc7daac0dad",
  },
  {
    title: "Supervised Machine Learning: Regression and Classification",
    detail: "Coursera",
    year: "2023",
    href: "https://coursera.org/share/ffc2b07f07cd521e6670cad26a070704",
  },
];

/** Competitive programming section: numbers, best results, problem setting, teaching. */
export const competitiveProgramming = {
  facts: [
    { label: "Problems solved", value: "3000+ across online judges" },
    { label: "Codeforces", value: "Master, max 2183", href: social.codeforces.href },
    { label: "CodeChef", value: "6-star, max 2324", href: social.codechef.href },
  ] satisfies Fact[],
  resultsTitle: "Best results",
  results: [
    {
      title: "46th ICPC World Finals",
      detail: "Honorable Mention",
      year: "2024",
    },
    {
      title: "ICPC Asia West Continent Finals",
      detail: "5th place",
      year: "2021",
    },
    { title: "ICPC Asia Dhaka Regional", detail: "8th place", year: "2024" },
    {
      title: "SEC Inter University Junior Contest",
      detail: "Champion",
      year: "2022",
    },
    { title: "BUET Inter University Contest", detail: "4th place", year: "2023" },
    {
      title: "Meta Hacker Cup, Round 3",
      detail: "259th of ~22,000",
      year: "2024",
    },
  ] satisfies Achievement[],
  problemSettingTitle: "Problem setting",
  problemSetting: [
    {
      title: "UU Inter University Programming Contest",
      detail: "Authored “MEX-imum Beauty”",
      year: "2025",
      href: "https://toph.co/c/uttara-university-inter-university-2025",
    },
    {
      title: "MU Inter University Programming Contest",
      detail: "Authored “Too Much Walking”",
      year: "2024",
      href: "https://toph.co/c/inter-university-sylhet-division-2024",
    },
    {
      title: "CodeChef Starters 136",
      detail: "Authored “Minimum Segments”",
      year: "2024",
      href: "https://www.codechef.com/problems/MINSEG",
    },
    {
      title: "IIUC Inter University Programming Contest",
      detail: "Authored “Not a Fun Game”",
      year: "2023",
      href: "https://toph.co/c/15th-iiuc-inter-university-2023",
    },
    {
      title: "Toph Criterion 2022, Round 17",
      detail: "Authored “Life Is All About Balance”",
      year: "2022",
      href: "https://toph.co/p/life-is-all-about-balance",
    },
    {
      title: "Toph Tough Duo",
      detail: "Authored “Birthday Present?!”",
      year: "2022",
      href: "https://toph.co/p/birthday-present",
    },
  ] satisfies Achievement[],
  teachingTitle: "Teaching",
  teaching: [
    {
      time: "Feb 2024 – Dec 2025",
      role: "Competitive Programming Trainer",
      org: "CPS Academy",
      description:
        "Taught competitive programming and organised practice contests.",
    },
    {
      time: "Feb 2022 – May 2023",
      role: "Mentor",
      org: "TLE Eliminators",
      description:
        "Taught algorithms to students in India and ran debugging and doubt-solving sessions.",
    },
  ] satisfies EarlierEntry[],
};

export const about = {
  portraitAlt: "Sayeef Mahmud",
  paragraphs: [
    {
      text: "I studied Computer Science and Engineering at RUET, where most of my free time went into competitive programming and, eventually, the ICPC World Finals. The habits carried over to production work: read the problem carefully, think about edge cases, and test before trusting anything.",
    },
    {
      text: "Away from the keyboard I play table tennis, and now and then I enter tournaments at local clubs. I also love running and take part in marathons.",
    },
  ] satisfies Paragraph[],
  facts: [
    { label: "Based in", value: "Dhaka, Bangladesh" },
    { label: "Work", value: "Associate Software Engineer, Cefalo" },
    {
      label: "Education",
      value: "BSc in Computer Science & Engineering, RUET",
    },
  ] satisfies Fact[],
};

export const contact = {
  actions: [
    // Profile links live in the footer only, so Contact shows just the email (owner, 2026-11-21).
    // { ...social.linkedin, variant: "secondary", arrow: "↗" },
    // { ...social.github, variant: "secondary", arrow: "↗" },
    // Resume download disabled for now (owner, 2026-11-21); uncomment to restore.
    // resume("Resume (PDF)", "secondary"),
  ] satisfies Action[],
};

export const footer = {
  /** Home footer: "© 2026 Sayeef Mahmud · Dhaka". */
  copyright: `© ${site.copyrightYear} ${site.name} · Dhaka`,
  /** Case-study footer omits the city. */
  copyrightShort: `© ${site.copyrightYear} ${site.name}`,
  links: [
    social.codeforces,
    social.codechef,
    social.linkedin,
    social.github,
  ] satisfies Link[],
};
