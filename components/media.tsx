import Image from "next/image";
import type { ReactNode } from "react";
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
        <Image
          src={shot.src}
          alt={shot.label}
          fill
          sizes={sizes}
          quality={90}
          className="object-cover"
          style={shot.position ? { objectPosition: shot.position } : undefined}
        />
      </div>
    );
  }
  return (
    <Placeholder
      label={shot.label}
      textClassName={textClassName}
      className={className}
    />
  );
}

function Dots({ size }: { size: 8 | 9 }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cx(
            "rounded-full bg-border2",
            size === 8 ? "size-2" : "size-[9px]",
          )}
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
  /** Replaces the screenshot inside a phone frame (`phone`, `land`), e.g. a 3D view. */
  screen?: ReactNode;
};

/** A screenshot drawn inside a browser, desktop window, portrait phone or landscape phone, or frameless (`app`). */
export function DeviceFrame({
  frame,
  shot,
  context = "row",
  sizes = "(min-width: 768px) 700px, 100vw",
  screen,
}: DeviceFrameProps) {
  const hero = context === "hero";

  if (frame === "browser" || frame === "window") {
    const browser = frame === "browser";
    return (
      <div
        className={cx(
          "flex flex-col overflow-hidden bg-surface",
          browser ? "rounded-control" : "rounded-[10px]",
          hero
            ? "shadow-[0_1px_2px_rgb(0_0_0/0.06),0_16px_40px_-16px_rgb(0_0_0/0.2)]"
            : "shadow-shot",
          // Browser: as wide as fits both the panel's width and its height (31px toolbar + 16:10 screen).
          hero || !browser
            ? "w-full"
            : "w-[min(100cqw,calc((100cqh-31px)*1.6))]",
          !hero && !browser && "h-[86%]",
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
          // Browser screen is 16:10 (a 1440×900 viewport), so the screenshot fits uncropped.
          className={
            hero
              ? "aspect-video p-0! leading-normal!"
              : browser
                ? "aspect-[16/10]"
                : "flex-1"
          }
        />
      </div>
    );
  }

  // Frameless app window: the screenshot is the window. Sized from `shot.aspect` to fit the
  // panel's content box both ways; drop-shadow follows the window's transparent corners.
  if (frame === "app") {
    const ratio = shot.aspect ?? 4 / 3;
    return (
      <div
        className={cx(
          "drop-shadow-shot",
          hero && "mx-auto h-[min(70vh,640px)] max-w-full",
        )}
        style={{
          aspectRatio: ratio,
          width: hero ? undefined : `min(100cqw, 100cqh * ${ratio})`,
        }}
      >
        <Screen
          shot={shot}
          sizes={hero ? "1100px" : "(min-width: 768px) 520px, 80vw"}
          textClassName="text-label p-3!"
          className={cx("box-border size-full", !shot.src && "rounded-[10px]")}
        />
      </div>
    );
  }

  // Phone frames: 7px device-coloured bezel. The landscape frame sizes the screen (19:9)
  // rather than the outer box, so a 19:9 screenshot fits with no cropping.
  // The portrait phone in a project row is ~60% of its desktop size below md, so its bezel
  // and radius scale down with it (owner, 2026-11-22: 7px looked too thick on mobile).
  const phone = frame === "phone";
  return (
    <div
      className={cx(
        "box-border overflow-hidden border-device shadow-device",
        phone && !hero ? "border-4 md:border-[7px]" : "border-[7px]",
        phone
          ? hero
            ? "mx-auto aspect-[9/19] h-[min(70vh,640px)] rounded-[28px]"
            : "aspect-[9/19] h-full rounded-[18px] md:rounded-[28px]"
          : "w-full rounded-[24px]",
      )}
    >
      {screen ? (
        <div
          className={cx(
            "relative overflow-hidden",
            phone ? "size-full" : "aspect-[19/9] w-full",
          )}
        >
          {screen}
        </div>
      ) : (
        <Screen
          shot={shot}
          sizes={sizes}
          textClassName={phone ? "text-[11px] p-3!" : "text-label p-3!"}
          className={cx(
            "box-border",
            phone ? "size-full" : "aspect-[19/9] w-full",
          )}
        />
      )}
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
  /** Replaces the default frame (`aspect-[4/5] rounded-photo`), e.g. a circle on mobile. */
  frameClassName?: string;
  /** Extra classes for the image, e.g. `object-position`. */
  imageClassName?: string;
};

/** 4:5 photo, radius 4, over the striped placeholder (which also shows if `src` is missing). */
export function Portrait({
  src,
  alt,
  preload,
  sizes,
  placeholderLabel = "Portrait",
  className,
  frameClassName = "aspect-[4/5] rounded-photo",
  imageClassName,
}: PortraitProps) {
  return (
    <div className={cx("relative overflow-hidden", frameClassName, className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className={cx("bg-stripes object-cover", imageClassName)}
        />
      ) : (
        <Placeholder
          label={placeholderLabel}
          className="box-border size-full"
        />
      )}
    </div>
  );
}

/**
 * Backdrop for a 3D view inside a device frame: the project's screenshot, blurred and dimmed, so
 * the model sits in the same sky as the screenshot. Decorative (empty alt).
 */
export function ScreenBackdrop({ shot }: { shot: Shot }) {
  if (!shot.src) return <div className="bg-stripes absolute inset-0" />;
  return (
    <Image
      src={shot.src}
      alt=""
      fill
      sizes="400px"
      quality={75}
      className="scale-125 object-cover blur-xl brightness-[0.55]"
    />
  );
}
