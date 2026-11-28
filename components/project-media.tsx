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
          box (100cqh) also holds the 12px gap and the switch: 38px below md, 42px from md
          (button + 2px padding + 1px border, top and bottom). Reserve = gap + switch + 14px bezel. */}
      <div className="w-[min(100cqw,calc((100cqh-64px)*19/9+14px))] flex-none md:w-[min(100cqw,calc((100cqh-68px)*19/9+14px))]">
        {view === "screenshot" ? screenshot : model}
      </div>
      <div
        role="group"
        aria-label={labels.group}
        className="inline-flex flex-none gap-[2px] rounded-control border border-border2 bg-surface p-[2px]"
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={view === o.value}
            onClick={() => setView(o.value)}
            className={cx(
              // 32px tall below md, 36px from md. The ::before strip stretches the tap area to 44px.
              "relative h-8 cursor-pointer rounded-[6px] px-3 text-[13px] font-medium transition-colors duration-150 md:h-9 md:px-3.5 md:text-small",
              "before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[''] md:before:-inset-y-1",
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
