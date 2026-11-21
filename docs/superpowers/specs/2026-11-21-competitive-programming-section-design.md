# Competitive programming section — short design (approved 2026-11-21)

**Why:** CP is a major part of the owner's background and is currently scattered across Hero, Achievements, Experience → Earlier and the footer. Give it one home-page section.

**Approaches considered:** (A) new section that takes over all CP content — **picked**; (B) numbers-only section, rest stays scattered — CP still doesn't read as one story; (C) separate `/competitive-programming` page with a home teaser — more work, one click away, no extra content yet.

**Placement:** after Stack (Hero → Projects → Experience → Stack → Competitive programming → Certifications → About → Contact). Nav link "Competitive programming".

**Contents, top to bottom:**
1. Numbers row: problems solved (3000+), Codeforces (Master, 2183), CodeChef (6★, 2324), each rating linking to the profile.
2. Best results: ICPC World Finals, ICPC Asia West, ICPC Dhaka, SEC, BUET, Meta Hacker Cup.
3. Problem setting: CodeChef, Toph, inter-university contests.
4. Teaching: CPS Academy trainer, TLE Eliminators mentor.

**Moves:** those items leave Achievements and Experience → Earlier. Achievements becomes "Certifications" (Claude, ML).

**Constraints:** existing blocks and styles only — no new visual styles. Copy in `content/site.ts`; section = one registry entry in `content/home.ts`. Don't commit until the owner approves the look.

**Not doing:** contest history, problem links, separate page.

**Left to the builder:** exact spacing and group labels, matched to existing sections.
