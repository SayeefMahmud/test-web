"use client";

import { useState, type ReactNode } from "react";
import { cx } from "./layout";

type View = "screenshot" | "model";

type ProjectMediaProps = {
  /** The project's device frame with its screenshot. */
  screenshot: ReactNode;
  /** The same frame with the 3D view in it. Mounted (and three.js loaded) only once picked. */
  model: ReactNode;
  labels: { group: string; screenshot: string; model: string };
};

/**
 * A project's media with a "Screenshot / 3D model" switch under it. Both views share one box,
 * sized so frame + switch fit the 4:3 panel both ways, so switching never moves the layout.
 */
export function ProjectMedia({ screenshot, model, labels }: ProjectMediaProps) {
  const [view, setView] = useState<View>("screenshot");
  const options: { value: View; label: string }[] = [
    { value: "screenshot", label: labels.screenshot },
    { value: "model", label: labels.model },
  ];

  return (
    <>
      {/* Landscape phone: outer height = (width − 14px bezel) × 9/19 + 14px. The panel's content
          box (100cqh) also holds the 50px switch and the 12px gap. */}
      <div className="w-[min(100cqw,calc((100cqh-76px)*19/9+14px))] flex-none">
        {view === "screenshot" ? screenshot : model}
      </div>
      <div
        role="group"
        aria-label={labels.group}
        className="inline-flex flex-none gap-[3px] rounded-control border border-border2 bg-surface p-[2px]"
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={view === o.value}
            onClick={() => setView(o.value)}
            className={cx(
              "h-11 cursor-pointer rounded-[6px] px-4 text-ui font-medium transition-colors duration-150",
              view === o.value ? "bg-fg text-bg" : "text-muted hover:text-fg",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </>
  );
}
