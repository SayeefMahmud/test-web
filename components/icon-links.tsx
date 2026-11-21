import type { IconLink } from "@/content/types";
import { cx } from "./layout";
import { SmartLink } from "./ui";

/** Brand marks (GitHub, LinkedIn) and a mail glyph; 24×24, filled with currentColor. */
const paths: Record<IconLink["icon"], string> = {
  github:
    "M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z",
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
  email:
    "M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2 .9v11.6h16V6.4l-8 5.6-8-5.6Zm1.7-.4L12 10.4 18.3 6H5.7Z",
};

/** Row of 44×44 icon-only links; each link is named by its `label`. Entries without an href are skipped. */
export function IconLinks({ links, className }: { links: IconLink[]; className?: string }) {
  const visible = links.filter((l) => l.href);
  if (visible.length === 0) return null;
  return (
    <ul className={cx("m-0 flex list-none gap-1 p-0", className)}>
      {visible.map((l) => (
        <li key={l.icon}>
          <SmartLink
            href={l.href!}
            aria-label={l.label}
            title={l.label}
            className="box-border grid size-11 place-items-center rounded-control text-muted transition-colors duration-150 hover:bg-sunk hover:text-fg"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
              <path d={paths[l.icon]} />
            </svg>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}
