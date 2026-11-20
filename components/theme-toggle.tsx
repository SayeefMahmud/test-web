"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function savedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

/** Watches the class on <html> so every toggle instance (header, mobile menu) stays in sync. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  // Follow OS changes until the visitor picks a theme explicitly.
  const media = matchMedia("(prefers-color-scheme: dark)");
  const onMedia = () => {
    if (!savedTheme()) applyTheme(media.matches ? "dark" : "light");
  };
  media.addEventListener("change", onMedia);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", onMedia);
  };
}

type ThemeToggleProps = {
  className?: string;
};

/**
 * Theme toggle: a 14px circle with a 1.5px border, left half filled.
 * Size and border come from the caller (36×36 bordered on desktop, 44×44 borderless on mobile).
 */
export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => "light");
  const isDark = theme === "dark";

  // React's dev Strict Mode remount resets <html> attributes; re-apply. No-op in production.
  useLayoutEffect(() => {
    const t = savedTheme() ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(t);
  }, []);

  function toggle() {
    const next: Theme = isDark ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the theme still applies for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center text-fg transition-colors duration-150 ease-out ${className}`}
    >
      <span
        aria-hidden="true"
        className="block size-3.5 rounded-full border-[1.5px] border-current"
        style={{ background: "linear-gradient(90deg, currentColor 50%, transparent 50%)" }}
      />
    </button>
  );
}
