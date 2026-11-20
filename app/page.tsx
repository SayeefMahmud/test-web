import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Temporary Phase 1 page: verifies tokens, fonts and the theme toggle.
 * Replaced by the section-registry home page in Phase 4.
 */
const swatches = [
  "bg",
  "surface",
  "sunk",
  "fg",
  "muted",
  "border",
  "border2",
  "accent",
  "ok",
  "warn",
  "info",
  "device",
  "code",
] as const;

export default function Home() {
  return (
    <main className="mx-auto max-w-[var(--container)] px-[var(--page-pad)] py-16">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <span className="font-serif text-[21px] tracking-[-0.01em]">Sayeef Mahmud</span>
        <ThemeToggle className="size-9 rounded-control border border-border" />
      </div>

      <p className="mt-16 font-mono text-meta text-muted">Dhaka, Bangladesh · Software engineer at Cefalo</p>
      <h1 className="mt-5 max-w-[17em] font-serif text-display text-balance">
        I&rsquo;m Sayeef Mahmud, a full-stack engineer building production web, mobile and AI-assisted systems.
      </h1>
      <p className="mt-7 max-w-[36em] text-lead text-muted">
        Foundation check: Newsreader for headings, Public Sans for body, IBM Plex Mono for meta.
      </p>

      <h2 className="mt-16 font-serif text-h1">Selected projects</h2>
      <h3 className="mt-6 text-h3 font-semibold">Associate Software Engineer</h3>
      <p className="mt-2 text-body">Body 16/1.6 · <span className="font-medium">500</span> · <span className="font-semibold">600</span> · <em className="font-serif italic">serif italic</em></p>

      <ul className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
        {swatches.map((s) => (
          <li key={s} className="text-small">
            <span
              className="block h-12 rounded-control border border-border"
              style={{ background: `var(--${s})` }}
            />
            <span className="mt-1 block font-mono text-label text-muted">--{s}</span>
          </li>
        ))}
        <li className="text-small">
          <span className="block h-12 rounded-control border border-border bg-stripes" />
          <span className="mt-1 block font-mono text-label text-muted">placeholder</span>
        </li>
      </ul>
    </main>
  );
}
