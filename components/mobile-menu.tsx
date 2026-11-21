"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { navLinks } from "@/content/home";
import { labels, mobileMenu, site } from "@/content/site";
import { /* ActionButton, */ SmartLink } from "./ui";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen menu sheet below md. Fades in over 200ms, locks body scroll,
 * traps focus, and closes on Esc, on a link click, or when the viewport grows to md.
 */
export function MobileMenu({ onClose }: { onClose: () => void }) {
  const sheet = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  /**
   * On the home page, jump to the section ourselves: close the sheet first (which releases
   * the scroll lock), then scroll and update the URL. Letting `next/link` do a hash
   * navigation while the sheet unmounts drops the navigation. Elsewhere, navigate normally.
   */
  const onLinkClick = (e: React.MouseEvent, id: string) => {
    if (pathname !== "/") {
      setTimeout(onClose, 0);
      return;
    }
    e.preventDefault();
    onClose();
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
      history.pushState(history.state, "", `#${id}`);
    });
  };

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !sheet.current) return;
      const items = [...sheet.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const md = matchMedia("(min-width: 768px)");
    const onResize = () => md.matches && onClose();

    document.addEventListener("keydown", onKey);
    md.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      md.removeEventListener("change", onResize);
    };
  }, [onClose]);

  return (
    <div
      ref={sheet}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 flex animate-fade-in flex-col bg-bg px-5 pb-8 md:hidden"
    >
      <div className="-mx-5 flex h-16 flex-none items-center justify-between border-b border-border px-5">
        <span className="font-serif text-[21px] tracking-[-0.01em]">{site.name}</span>
        <button
          ref={closeButton}
          type="button"
          aria-label={labels.closeMenu}
          onClick={onClose}
          className="flex size-11 cursor-pointer items-center justify-center text-[26px] leading-none text-fg"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <nav aria-label="Main" className="mt-6">
        <ul className="m-0 flex list-none flex-col p-0">
          {navLinks.map((l) => (
            <li key={l.id}>
              <NextLink
                href={l.href}
                onClick={(e) => onLinkClick(e, l.id)}
                className="block border-b border-border py-3.5 font-serif text-[36px] leading-[1.2] no-underline"
              >
                {l.label}
              </NextLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        {/* Resume download disabled for now (owner, 2026-11-21); uncomment to restore. */}
        {/* <ActionButton action={mobileMenu.resume} size="block" /> */}
        <div className="flex justify-between gap-4 pt-2 text-small text-muted">
          <SmartLink href={`mailto:${site.email}`} className="no-underline hover:text-fg">
            {site.email}
          </SmartLink>
          <span className="flex-none">
            {mobileMenu.links
              .filter((l) => l.href)
              .map((l, i) => (
                <span key={l.label}>
                  {i > 0 && " · "}
                  <SmartLink href={l.href!} className="no-underline hover:text-fg">
                    {l.label}
                  </SmartLink>
                </span>
              ))}
          </span>
        </div>
      </div>
    </div>
  );
}
