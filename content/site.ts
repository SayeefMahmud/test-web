// All site copy except projects (`content/projects.ts`) and case studies
// (`content/projects/<slug>.mdx`). Ported from `docs/handoff/design/content.js`
// and the inline copy in `docs/handoff/design/A-Home.dc.html`.
//
// Pending from the owner (keep as-is until provided, don't invent):
// real email, resume PDF, experience dates and summaries,
// the second About paragraph.

import type {
  Achievement,
  Action,
  EarlierEntry,
  ExperienceEntry,
  Fact,
  Link,
  MoreProject,
  Paragraph,
  SkillGroup,
  Step,
  Tool,
} from "./types";

/** Identity and global links. A missing `href` hides that link everywhere. */
export const site = {
  name: "Sayeef Mahmud",
  location: "Dhaka, Bangladesh",
  url: "https://sayeefmahmud.com",
  /** Placeholder from the handoff; replace with the real address. */
  email: "hello@sayeefmahmud.com",
  /** Set to "/resume.pdf" once `public/resume.pdf` exists; all resume buttons stay hidden until then. */
  resumeUrl: undefined as string | undefined,
  copyrightYear: "2026",
} as const;

export const social = {
  linkedin: { label: "LinkedIn", href: "https://linkedin.com/in/notsayeef/" },
  github: { label: "GitHub", href: "https://github.com/SayeefMahmud" },
  codeforces: { label: "Codeforces", href: "https://codeforces.com/profile/thisIsMorningstar" },
  codechef: { label: "CodeChef", href: "https://www.codechef.com/users/sayeef_mahmud" },
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
  projectFacts: { status: "Status", devices: "Runs on", stack: "Stack", notes: "Notes" },
  caseStudyLink: "Case study",
  caseStudyEyebrow: "Case study",
  allProjects: "All projects",
  onThisPage: "On this page",
  nextProject: "Next project",
  stack: "Stack",
} as const;

export const header = {
  /** Links derive from `nav` labels in `content/home.ts`; this is only the resume button. */
  resume: resume(labels.resume, "secondary"),
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
  lead: "I build software for clients in the Nordics at Cefalo, mostly ASP.NET Core and Next.js. I like the hard, unglamorous parts: identity and access, cloud infrastructure, and bugs that only appear in production. Outside work I ship my own apps for desktop, mobile and the web.",
  portraitAlt: "Sayeef Mahmud",
  actions: [
    { label: "View projects", href: "#projects", variant: "primary" },
    { label: "Contact", href: "#contact", variant: "secondary" },
    resume("Resume (PDF)", "text"),
  ] satisfies Action[],
  facts: [
    { label: "Work", value: "Associate Software Engineer, Cefalo" },
    { label: "ICPC", value: "World Finalist" },
    { label: "Anthropic", value: "Claude Certified Architect" },
    { label: "Codeforces", value: "Master, max 2183" },
  ] satisfies Fact[],
};

export const moreProjects = {
  title: "More projects",
  items: [
    { name: "Book Recommender System", type: "Web app" },
    { name: "QR code detection in perspective-distorted images", type: "Deep learning" },
    { name: "AI-powered semantic search engine", type: "Hackathon" },
  ] satisfies MoreProject[],
};

export const experience = {
  entries: [
    {
      time: "YYYY – Present",
      role: "Associate Software Engineer",
      org: "Cefalo",
      context: "Enterprise web platform · Nordic client",
      summary:
        "Placeholder. One or two sentences on what I built and owned, e.g. ASP.NET Core services and a Next.js frontend, from design through production support.",
      tech: ["C#", "ASP.NET Core", "Next.js", "TypeScript", "Azure", "MSSQL"],
    },
    {
      time: "YYYY – YYYY",
      role: "Associate Software Engineer",
      org: "Cefalo",
      context: "Identity and access · Nordic client",
      summary:
        "Placeholder. Sign-in and authorization across tenants with Microsoft Entra ID and OIDC, and debugging auth issues in distributed production systems.",
      tech: ["Entra ID", "OIDC", "Node.js", "Google Cloud", "PostgreSQL"],
    },
  ] satisfies ExperienceEntry[],
  earlierTitle: "Earlier",
  earlier: [
    {
      time: "YYYY – YYYY",
      role: "Competitive Programming Trainer",
      org: "CPS Academy",
      description: "Taught algorithms and problem solving.",
    },
    {
      time: "YYYY – YYYY",
      role: "Mentor",
      org: "TLE Eliminators",
      description: "Mentored students preparing for rated contests.",
    },
  ] satisfies EarlierEntry[],
};

export const howIWork = {
  lead: "I work spec-first, and I use Claude Code agents as part of a team's normal process. They get the same inputs a new teammate would: a written spec, a reviewed plan, and tests that define done.",
  /** Numbered automatically (01, 02, …) in display order. */
  steps: [
    {
      title: "Spec",
      description:
        "Write down what done means: behaviour, edge cases and the tests that will prove it.",
    },
    {
      title: "Plan",
      description:
        "Break the spec into small, reviewable steps and find the risky parts before any code exists.",
    },
    {
      title: "Tested implementation",
      description:
        "Build each step against its tests. Agents and people work from the same spec, and nothing merges red.",
    },
  ] satisfies Step[],
  tools: [
    {
      title: "Custom skills",
      description:
        "Team procedures written once, so agents follow the same conventions every time.",
    },
    {
      title: "Hooks",
      description: "Formatting, linting and tests run automatically around agent actions.",
    },
    {
      title: "Subagents",
      description:
        "Focused helpers for review, research and test writing, each with a narrow brief.",
    },
    {
      title: "MCP integrations",
      description: "Agents read from the tools the team already uses: trackers, docs, cloud.",
    },
    {
      title: "Agent memory",
      description: "A persistent knowledge base, so project context survives between sessions.",
    },
    {
      title: "Certified",
      description: "Anthropic Claude Certified Architect – Foundations, 2026.",
      highlight: true,
    },
  ] satisfies Tool[],
};

export const stack: SkillGroup[] = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "C#", "C++", "Dart", "SQL"] },
  { category: "Frontend", items: ["Next.js", "React", "Tailwind CSS"] },
  {
    category: "Backend",
    items: ["ASP.NET Core", "Node.js", "EF Core", "Prisma", "REST & OpenAPI"],
  },
  { category: "Mobile & Desktop", items: ["React Native (Expo)", "Flutter", "Unity"] },
  {
    category: "Cloud & Identity",
    items: [
      "Azure",
      "Google Cloud",
      "Vercel",
      "Cloudflare Workers",
      "Microsoft Entra ID",
      "OIDC",
      "Multi-tenancy",
      "Authorization",
    ],
  },
  { category: "Databases", items: ["PostgreSQL", "MSSQL", "MongoDB", "SQLite"] },
  {
    category: "AI & agentic tooling",
    items: ["Claude Code", "Skills", "Hooks", "Subagents", "MCP", "Agent knowledge bases"],
  },
  {
    category: "Testing & practices",
    items: [
      "Vitest",
      "Spec-driven development",
      "CI with GitHub Actions",
      "Code review",
      "Production debugging",
    ],
  },
];

export const achievements: Achievement[] = [
  { title: "Claude Certified Architect – Foundations", detail: "Anthropic", year: "2026" },
  { title: "46th ICPC World Finals", detail: "Honorable Mention" },
  { title: "Codeforces Master", detail: "Max rating 2183" },
  { title: "CodeChef 6-star", detail: "Max rating 2324" },
  { title: "3000+ problems solved", detail: "Across online judges" },
  { title: "Meta Hacker Cup, Round 3", detail: "259th of ~22,000", year: "2024" },
  { title: "Problem setter and judge", detail: "CodeChef, Toph, inter-university contests" },
  { title: "Machine Learning certificates", detail: "Coursera", year: "2023, 2024" },
];

export const about = {
  portraitAlt: "Sayeef Mahmud",
  paragraphs: [
    {
      text: "I studied Computer Science and Engineering at RUET, where most of my free time went into competitive programming and, eventually, the ICPC World Finals. The habits carried over to production work: read the problem carefully, think about edge cases, and test before trusting anything.",
    },
    {
      text: "Placeholder: one or two personal sentences, e.g. what you do away from the keyboard.",
      muted: true,
    },
  ] satisfies Paragraph[],
  facts: [
    { label: "Based in", value: "Dhaka, Bangladesh" },
    { label: "Work", value: "Associate Software Engineer, Cefalo" },
    { label: "Education", value: "BSc in Computer Science & Engineering, RUET" },
  ] satisfies Fact[],
};

export const contact = {
  actions: [
    { ...social.linkedin, variant: "secondary", arrow: "↗" },
    { ...social.github, variant: "secondary", arrow: "↗" },
    resume("Resume (PDF)", "secondary"),
  ] satisfies Action[],
};

export const footer = {
  /** Home footer: "© 2026 Sayeef Mahmud · Dhaka". */
  copyright: `© ${site.copyrightYear} ${site.name} · Dhaka`,
  /** Case-study footer omits the city. */
  copyrightShort: `© ${site.copyrightYear} ${site.name}`,
  links: [social.codeforces, social.codechef, social.linkedin, social.github] satisfies Link[],
};
