"use client";

import NextLink from "next/link";
import { useCallback, useRef, useState } from "react";
import { navLinks } from "@/content/home";
import { /* header, */ labels, site } from "@/content/site";
import { Container, cx } from "./layout";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";
// import { ActionButton } from "./ui";

type HeaderProps = {
  /** Section id of the current nav link (e.g. "projects" on a case study). */
  current?: string;
  /** Theme toggle next to the menu button below md. The case-study design shows only the menu button. */
  mobileThemeToggle?: boolean;
};

/** Sticky 64px header with a 1px bottom rule (always shown, as in the reference screenshots). */
export function Header({ current, mobileThemeToggle = true }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButton.current?.focus();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <Container className="flex h-16 items-center justify-between gap-6">
        <NextLink href="/" className="hit-area font-serif text-[21px] tracking-[-0.01em] no-underline">
          {site.name}
        </NextLink>

        {/* Desktop */}
        <nav aria-label="Main" className="hidden items-center gap-9 text-ui md:flex">
          <ul className="m-0 flex list-none gap-7 p-0">
            {navLinks.map((l) => (
              <li key={l.id}>
                <NextLink
                  href={l.href}
                  aria-current={l.id === current ? "page" : undefined}
                  className={cx(
                    "no-underline transition-colors duration-150 ease-out hover:text-fg",
                    l.id === current ? "text-fg" : "text-muted",
                  )}
                >
                  {l.label}
                </NextLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2.5">
            <ThemeToggle className="size-9 rounded-control border border-border hover:bg-sunk" />
            {/* Resume download disabled for now (owner, 2026-11-21); uncomment to restore. */}
            {/* <ActionButton action={header.resume} size="sm" /> */}
          </div>
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          {mobileThemeToggle && <ThemeToggle className="size-11" iconClassName="size-4" />}
          <button
            ref={menuButton}
            type="button"
            aria-label={labels.openMenu}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
            className="flex size-11 cursor-pointer flex-col items-center justify-center gap-1.5"
          >
            <span aria-hidden="true" className="h-[1.5px] w-5 bg-fg" />
            <span aria-hidden="true" className="h-[1.5px] w-5 bg-fg" />
          </button>
        </div>
      </Container>

      {menuOpen && (
<MobileMenu onClose={closeMenu} />
      )}
    </header>
  );
}
