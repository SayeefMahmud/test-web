import { footer, site } from "@/content/site";
import { cx } from "./layout";
import { SmartLink, TextLink } from "./ui";

/**
 * Footer line with a 1px top rule. Sits at the end of the last section.
 * `home`: "© 2026 Sayeef Mahmud · Dhaka" + profile links.
 * `caseStudy`: "© 2026 Sayeef Mahmud" + email.
 */
export function Footer({ variant = "home" }: { variant?: "home" | "caseStudy" }) {
  const home = variant === "home";
  return (
    <footer
      className={cx(
        "flex flex-wrap justify-between gap-3 border-t border-border pt-6 text-small text-muted",
        home ? "mt-[clamp(80px,10vw,128px)]" : "mt-16",
      )}
    >
      <span>{home ? footer.copyright : footer.copyrightShort}</span>
      {home ? (
        <ul className="m-0 flex list-none flex-wrap gap-5 p-0">
          {footer.links
            .filter((l) => l.href)
            .map((l) => (
              <li key={l.label}>
                <TextLink href={l.href!} variant="plain">
                  {l.label}
                </TextLink>
              </li>
            ))}
        </ul>
      ) : (
        <SmartLink href={`mailto:${site.email}`} className="no-underline hover:text-fg">
          {site.email}
        </SmartLink>
      )}
    </footer>
  );
}
