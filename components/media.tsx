import Image from "next/image";
import type { Frame, Shot } from "@/content/types";
import { cx } from "./layout";

// Media: striped placeholders, device frames around screenshots, the portrait.
// Any image without a `src` falls back to the striped placeholder with its label.

/** Striped box with a centred Plex Mono label (used until a screenshot exists). */
export function Placeholder({
  label,
  className,
  textClassName = "text-label",
}: {
  label: string;
  className?: string;
  textClassName?: string;
}) {
  return (
    <div
      className={cx(
        "bg-stripes flex items-center justify-center p-4 text-center font-mono leading-[1.5] text-muted",
        textClassName,
        className,
      )}
    >
      {label}
    </div>
  );
}

/** Screenshot, or its placeholder, filling the parent. */
function Screen({
  shot,
  sizes,
  textClassName,
  className,
}: {
  shot: Shot;
  sizes: string;
  textClassName?: string;
  className?: string;
}) {
  if (shot.src) {
    return (
      <div className={cx("relative overflow-hidden", className)}>
        <Image src={shot.src} alt={shot.label} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }
  return <Placeholder label={shot.label} textClassName={textClassName} className={className} />;
}

function Dots({ size }: { size: 8 | 9 }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cx("rounded-full bg-border2", size === 8 ? "size-2" : "size-[9px]")}
        />
      ))}
    </>
  );
}

type DeviceFrameProps = {
  frame: Frame;
  shot: Shot;
  /**
   * `row`: inside a 4:3 project media panel (Home, /projects).
   * `hero`: case-study hero, full width, 16:9 browser screen.
   */
  context?: "row" | "hero";
  /** `sizes` for `next/image` once a screenshot exists. */
  sizes?: string;
};

/** A screenshot drawn inside a browser, desktop window, portrait phone or landscape phone. */
export function DeviceFrame({
  frame,
  shot,
  context = "row",
  sizes = "(min-width: 768px) 700px, 100vw",
}: DeviceFrameProps) {
  const hero = context === "hero";

  if (frame === "browser" || frame === "window") {
    const browser = frame === "browser";
    return (
      <div
        className={cx(
          "flex w-full flex-col overflow-hidden bg-surface",
          browser ? "rounded-control" : "rounded-[10px]",
          hero
            ? "shadow-[0_1px_2px_rgb(0_0_0/0.06),0_16px_40px_-16px_rgb(0_0_0/0.2)]"
            : "shadow-shot",
          !hero && (browser ? "h-full" : "h-[86%]"),
        )}
      >
        <div
          aria-hidden="true"
          className={cx(
            "flex flex-none items-center gap-1.5 px-3",
            browser && "border-b border-border",
            hero ? "h-8" : browser ? "h-[30px]" : "h-7",
          )}
        >
          <Dots size={browser ? 8 : 9} />
        </div>
        <Screen
          shot={shot}
          sizes={sizes}
          textClassName={hero ? "text-meta" : "text-label"}
          className={hero ? "aspect-video p-0! leading-normal!" : "flex-1"}
        />
      </div>
    );
  }

  // Phone frames: 7px device-coloured bezel.
  const phone = frame === "phone";
  return (
    <div
      className={cx(
        "box-border overflow-hidden border-[7px] border-device shadow-device",
        phone
          ? hero
            ? "mx-auto aspect-[9/19] h-[min(70vh,640px)] rounded-[28px]"
            : "aspect-[9/19] h-full rounded-[28px]"
          : "aspect-[19/9] w-full rounded-[24px]",
      )}
    >
      <Screen
        shot={shot}
        sizes={sizes}
        textClassName={phone ? "text-[11px] p-3" : "text-label p-3"}
        className="size-full"
      />
    </div>
  );
}

/** Small screenshot tile (case-study gallery): 4:3, radius 10. */
export function GalleryTile({ shot }: { shot: Shot }) {
  return (
    <Screen
      shot={shot}
      sizes="(min-width: 768px) 380px, 100vw"
      className="aspect-[4/3] rounded-[10px]"
    />
  );
}

type PortraitProps = {
  src?: string;
  alt: string;
  /** Preload in the hero (LCP image). */
  preload?: boolean;
  /** `sizes` for `next/image`, matching the rendered width. */
  sizes: string;
  /** Placeholder label when `src` is missing. */
  placeholderLabel?: string;
  className?: string;
};

/** 4:5 photo, radius 4, over the striped placeholder (which also shows if `src` is missing). */
export function Portrait({
  src,
  alt,
  preload,
  sizes,
  placeholderLabel = "Portrait",
  className,
}: PortraitProps) {
  return (
    <div className={cx("relative aspect-[4/5] overflow-hidden rounded-photo", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className="bg-stripes object-cover"
        />
      ) : (
        <Placeholder label={placeholderLabel} className="size-full" />
      )}
    </div>
  );
}
