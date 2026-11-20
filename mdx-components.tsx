import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import type { ArchitectureDiagramProps, Item, Result } from "@/content/types";
import { slugify } from "@/lib/slug";

// Components available in every case-study MDX file.
// Phase 2: plain semantic markup so content renders; Phase 3 replaces these
// with the styled blocks from the design (keep the names and props).

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return "";
}

function FeatureList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((f) => (
        <li key={f.title}>
          <strong>{f.title}</strong>
          <br />
          <span>{f.description}</span>
        </li>
      ))}
    </ul>
  );
}

function ArchitectureDiagram({ flow, services = [], caption }: ArchitectureDiagramProps) {
  return (
    <figure>
      <p>{flow.join(" → ")}</p>
      {services.length > 0 && <p>{services.join(" · ")}</p>}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function Results({ items }: { items: Result[] }) {
  return (
    <dl>
      {items.map((r) => (
        <div key={r.label}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const components = {
  h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  FeatureList,
  ArchitectureDiagram,
  Results,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
