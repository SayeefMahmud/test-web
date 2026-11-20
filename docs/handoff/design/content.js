// Shared portfolio content for all three directions. Edit copy here once.
const content = {
  email: 'hello@sayeefmahmud.com',
  proof: [
    { k: 'Work', v: 'Associate Software Engineer, Cefalo' },
    { k: 'ICPC', v: 'World Finalist' },
    { k: 'Anthropic', v: 'Claude Certified Architect' },
    { k: 'Codeforces', v: 'Master, max 2183' },
  ],
  projects: [
    { slug: 'watchlist', name: 'Watchlist', summary: 'Track movies, TV shows and sports in one place, with reminders for new episodes and upcoming fixtures.', platform: 'Web app', devices: 'Web, responsive', tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL (Neon)', 'Auth.js', 'Vitest'], status: 'Live', kind: 'live', signal: '980+ tests · security-reviewed API · deployed on Vercel', links: [{ label: 'Live site', a: '↗' }, { label: 'GitHub', a: '↗' }, { label: 'Case study', a: '→', cs: true }], shot: 'Screenshot: Watchlist dashboard, desktop browser', frame: 'browser', accent: '#B3352B' },
    { slug: 'stash', name: 'Stash', summary: 'Clipboard history for macOS, Windows and Ubuntu. A global hotkey opens a searchable popup at the cursor and pastes straight into the app you were using.', platform: 'Desktop app', devices: 'macOS · Windows · Ubuntu', tech: ['Flutter', 'Dart', 'SQLite', 'Swift platform channels'], status: 'macOS ready · Windows & Linux in progress', kind: 'progress', signal: '480+ tests · built from a full spec and design handoff', links: [{ label: 'GitHub', a: '↗' }, { label: 'Case study', a: '→', cs: true }], shot: 'Screenshot: Stash popup, macOS', frame: 'window', accent: '#1D6B66' },
    { slug: 'nebula-dash', name: 'Nebula Dash', summary: 'A 3D space racer: fly through rings and dodge debris across 18 levels in six skies, then spend coins on 16 ships. Every scene is generated from code.', platform: 'Mobile game', devices: 'Android · iOS', tech: ['Unity', 'C#', 'Procedural generation'], status: 'Google Play · closed testing', kind: 'beta', signal: 'Fully offline · landscape touch controls', links: [{ label: 'Google Play', a: '↗' }, { label: 'GitHub', a: '↗' }, { label: 'Case study', a: '→', cs: true }], shot: 'Screenshot: Nebula Dash gameplay, landscape phone', frame: 'land', accent: '#2E3480' },
    { slug: 'dreamwall', name: 'DreamWall', summary: 'Generates a new AI wallpaper every day and sets it automatically, with a gallery of past wallpapers, theme suggestions and a "Generate now" button.', platform: 'Desktop app', devices: 'macOS · Windows', tech: ['Flutter', 'Cloudflare Workers AI', 'SQLite', 'Swift / C++ channels', 'GitHub Actions'], status: 'macOS ready · Windows via CI', kind: 'progress', signal: 'An LLM writes the prompt, an image model paints it', links: [{ label: 'GitHub', a: '↗' }, { label: 'Case study', a: '→', cs: true }], shot: 'Screenshot: DreamWall gallery, macOS', frame: 'window', accent: '#6A4291' },
    { slug: 'doom-scroll', name: 'Doom Scroll', summary: 'Turns doom-scrolling into learning. Pick topics and get short, LLM-written learning cards as notifications and in a feed.', platform: 'Mobile app', devices: 'iOS · Android', tech: ['React Native (Expo)', 'TypeScript', 'ASP.NET Core', 'EF Core', 'OpenAPI'], status: 'In development', kind: 'dev', signal: 'Typed client generated from the OpenAPI spec', links: [{ label: 'GitHub', a: '↗' }, { label: 'Case study', a: '→', cs: true }], shot: 'Screenshot: Doom Scroll card feed, phone', frame: 'phone', accent: '#8A520C' },
  ],
  more: [
    { name: 'Book Recommender System', type: 'Web app' },
    { name: 'QR code detection in perspective-distorted images', type: 'Deep learning' },
    { name: 'AI-powered semantic search engine', type: 'Hackathon' },
  ],
  experience: [
    { time: 'YYYY – Present', role: 'Associate Software Engineer', org: 'Cefalo', type: 'Enterprise web platform · Nordic client', summary: 'Placeholder. One or two sentences on what I built and owned, e.g. ASP.NET Core services and a Next.js frontend, from design through production support.', tech: 'C# · ASP.NET Core · Next.js · TypeScript · Azure · MSSQL' },
    { time: 'YYYY – YYYY', role: 'Associate Software Engineer', org: 'Cefalo', type: 'Identity and access · Nordic client', summary: 'Placeholder. Sign-in and authorization across tenants with Microsoft Entra ID and OIDC, and debugging auth issues in distributed production systems.', tech: 'Entra ID · OIDC · Node.js · Google Cloud · PostgreSQL' },
  ],
  earlier: [
    { time: 'YYYY – YYYY', role: 'Competitive Programming Trainer', org: 'CPS Academy', d: 'Taught algorithms and problem solving.' },
    { time: 'YYYY – YYYY', role: 'Mentor', org: 'TLE Eliminators', d: 'Mentored students preparing for rated contests.' },
  ],
  steps: [
    { n: '01', t: 'Spec', d: 'Write down what done means: behaviour, edge cases and the tests that will prove it.' },
    { n: '02', t: 'Plan', d: 'Break the spec into small, reviewable steps and find the risky parts before any code exists.' },
    { n: '03', t: 'Tested implementation', d: 'Build each step against its tests. Agents and people work from the same spec, and nothing merges red.' },
  ],
  tools: [
    { t: 'Custom skills', d: 'Team procedures written once, so agents follow the same conventions every time.' },
    { t: 'Hooks', d: 'Formatting, linting and tests run automatically around agent actions.' },
    { t: 'Subagents', d: 'Focused helpers for review, research and test writing, each with a narrow brief.' },
    { t: 'MCP integrations', d: 'Agents read from the tools the team already uses: trackers, docs, cloud.' },
    { t: 'Agent memory', d: 'A persistent knowledge base, so project context survives between sessions.' },
  ],
  skills: [
    { cat: 'Languages', items: 'TypeScript, JavaScript, C#, C++, Dart, SQL' },
    { cat: 'Frontend', items: 'Next.js, React, Tailwind CSS' },
    { cat: 'Backend', items: 'ASP.NET Core, Node.js, EF Core, Prisma, REST & OpenAPI' },
    { cat: 'Mobile & Desktop', items: 'React Native (Expo), Flutter, Unity' },
    { cat: 'Cloud & Identity', items: 'Azure, Google Cloud, Vercel, Cloudflare Workers, Microsoft Entra ID, OIDC, Multi-tenancy, Authorization' },
    { cat: 'Databases', items: 'PostgreSQL, MSSQL, MongoDB, SQLite' },
    { cat: 'AI & agentic tooling', items: 'Claude Code, Skills, Hooks, Subagents, MCP, Agent knowledge bases' },
    { cat: 'Testing & practices', items: 'Vitest, Spec-driven development, CI with GitHub Actions, Code review, Production debugging' },
  ],
  achievements: [
    { t: 'Claude Certified Architect – Foundations', m: 'Anthropic', y: '2026' },
    { t: '46th ICPC World Finals', m: 'Honorable Mention', y: '' },
    { t: 'Codeforces Master', m: 'Max rating 2183', y: '' },
    { t: 'CodeChef 6-star', m: 'Max rating 2324', y: '' },
    { t: '3000+ problems solved', m: 'Across online judges', y: '' },
    { t: 'Meta Hacker Cup, Round 3', m: '259th of ~22,000', y: '2024' },
    { t: 'Problem setter and judge', m: 'CodeChef, Toph, inter-university contests', y: '' },
    { t: 'Machine Learning certificates', m: 'Coursera', y: '2023, 2024' },
  ],
  big: [
    { v: 'WF', l: 'ICPC World Finalist, 46th Finals' },
    { v: '2183', l: 'Codeforces max rating, Master' },
    { v: '2324', l: 'CodeChef max rating, 6-star' },
    { v: '3000+', l: 'Problems solved' },
  ],
  cs: {
    name: 'Watchlist',
    summary: 'One place to track movies, TV shows and sports teams, with reminders for new episodes and upcoming fixtures.',
    meta: [
      { k: 'Role', v: 'Solo: product, design, build, deploy' },
      { k: 'Timeline', v: 'YYYY – present' },
      { k: 'Platform', v: 'Web, responsive' },
      { k: 'Status', v: 'Live on Vercel' },
    ],
    stack: ['Next.js (App Router)', 'TypeScript', 'Prisma', 'PostgreSQL (Neon)', 'Auth.js', 'TMDB API', 'TheSportsDB API', 'Cron jobs', 'Vitest'],
    toc: ['The problem', 'What I built', 'Key features', 'Architecture', 'Challenges', 'Results', "What's next"],
    problem: 'Films lived in one app, shows in another and football fixtures in a third, and none of them told me when something I cared about was about to air. I wanted one list for everything I watch, and reminders I could trust.',
    built: 'A Next.js web app where you follow movies, shows, teams and leagues side by side. It tracks progress down to the episode, sends reminders by email and in the app, shows live scores during matches, and comes with 56 curated "best of" lists to start from.',
    features: [
      { t: 'One list for everything', d: 'Movies, TV shows, teams and leagues in a single watchlist.' },
      { t: 'Episode tracking', d: 'Mark episodes watched and see what is next.' },
      { t: 'Reminders', d: 'Email and in-app alerts for new episodes and upcoming fixtures.' },
      { t: 'Live scores', d: 'Match scores update while a game is on.' },
      { t: 'Curated lists', d: '56 hand-picked "best of" lists.' },
      { t: 'Sign-in', d: 'Email link or Google account, via Auth.js.' },
    ],
    decisions: [
      { t: 'Server components first', d: 'Pages render on the server with the App Router; client components only where there is interaction.' },
      { t: 'Prisma on Neon Postgres', d: 'A typed schema and migrations, on serverless Postgres that suits Vercel.' },
      { t: 'Scheduled jobs for reminders', d: 'Cron routes look for upcoming episodes and fixtures and send notifications.' },
      { t: 'One model, two sources', d: 'TMDB and TheSportsDB responses are mapped into one internal model at the edge of the app.' },
    ],
    code: `// app/api/cron/reminders/route.ts (simplified)
export async function GET(req: Request) {
  assertCronSecret(req);
  const due = await db.reminder.findMany({
    where: { sendAt: { lte: new Date() }, sentAt: null },
  });
  for (const r of due) {
    await sendReminder(r);
    await db.reminder.update({
      where: { id: r.id },
      data: { sentAt: new Date() },
    });
  }
  return Response.json({ sent: due.length });
}`,
    challenges: [
      { t: 'Reminders that fire exactly once', d: 'Cron runs can overlap or retry. Each reminder records when it was sent, so a repeated run does nothing.' },
      { t: 'Rate-limited data sources', d: 'Third-party data is cached and refreshed on a schedule instead of on every request.' },
      { t: 'A reviewed API surface', d: 'Every route checks the session and validates input; the API went through a dedicated security review.' },
    ],
    results: [
      { v: 'Live', l: 'Deployed on Vercel' },
      { v: '980+', l: 'Automated tests' },
      { v: '56', l: 'Curated lists' },
    ],
    next: ['Push notifications for mobile browsers', 'Shared watchlists with friends'],
    gallery: ['Screenshot: Show page with episode tracker', 'Screenshot: Live match score', 'Screenshot: Reminder email'],
    nextProject: { name: 'Stash', summary: 'Cross-platform clipboard manager', accent: '#1D6B66' },
  },
};

const dot = { live: 'var(--ok)', beta: 'var(--info)', progress: 'var(--warn)', dev: 'var(--muted)' };

export function prep(c) {
  return {
    ...c,
    projects: c.projects.map((p, i) => ({
      ...p,
      num: String(i + 1).padStart(2, '0'),
      techLine: p.tech.join(' · '),
      dir: i % 2 ? 'row-reverse' : 'row',
      dot: dot[p.kind],
      isBrowser: p.frame === 'browser', isWindow: p.frame === 'window', isPhone: p.frame === 'phone', isLand: p.frame === 'land',
      span: i === 0 ? '1 / -1' : 'auto',
      visFlex: i === 0 ? '1 1 560px' : '1 1 100%',
      textFlex: i === 0 ? '1 1 320px' : '1 1 100%',
    })),
    skills: c.skills.map(s => ({ ...s, list: s.items.split(', ') })),
  };
}

export const EMPTY = { proof: [], projects: [], more: [], experience: [], earlier: [], steps: [], tools: [], skills: [], achievements: [], big: [], cs: { meta: [], stack: [], toc: [], features: [], decisions: [], challenges: [], results: [], next: [], gallery: [], nextProject: {} } };

export default content;
