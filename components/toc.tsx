"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/content/types";
import { labels } from "@/content/site";
import { cx } from "./layout";

/** Px from the top of the viewport where a heading counts as "current" (header 64 + breathing room). */
const ACTIVE_LINE = 120;

/**
 * Sticky "On this page" nav (md and up). The current section is the last H2 that has
 * scrolled past `ACTIVE_LINE`; its link gets the fg left border.
 */
export function Toc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState(entries[0]?.id);

  useEffect(() => {
    const headings = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= ACTIVE_LINE) current = h.id;
      }
      // At the very bottom, the last section is current even if its heading never reaches the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = headings[headings.length - 1].id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [entries]);

  if (entries.length === 0) return null;
  return (
    <nav
      aria-label={labels.onThisPage}
      className="sticky top-24 hidden flex-[0_0_200px] text-small md:block"
    >
      <p className="mb-3 font-mono text-label text-muted">{labels.onThisPage}</p>
      <ul className="m-0 list-none p-0">
        {entries.map((t) => {
          const current = t.id === active;
          return (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                aria-current={current ? "location" : undefined}
                className={cx(
                  "block border-l py-[5px] pl-3 no-underline transition-colors duration-150 ease-out hover:border-fg hover:text-fg",
                  current ? "border-fg text-fg" : "border-border text-muted",
                )}
              >
                {t.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
