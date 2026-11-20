import type { MDXComponents } from "mdx/types";
import { isValidElement, type ReactNode } from "react";
import { ArchitectureDiagram, CodeBlock, FeatureList, Results } from "@/components/case-study";
import { slugify } from "@/lib/slug";

// Components and element styles for every case-study MDX file
// (`content/projects/<slug>.mdx`), rendered inside `<Article>` (18px, max 680px).
// Spacing follows A-CaseStudy.dc.html: H2 64px above (0 when first), 16px to the next
// paragraph; paragraphs 20px apart; challenge H3 18px/600 with 6px to its text.

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

const components = {
  h2: ({ children }) => (
    <h2
      id={slugify(textOf(children))}
      className="mt-16 scroll-mt-24 font-serif text-h2 font-normal first:mt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="mt-5 text-[18px] font-semibold">{children}</h3>,
  p: ({ children }) => (
    <p className="mt-5 text-pretty [h2+&]:mt-4 [h3+&]:mt-1.5">{children}</p>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  a: ({ href = "", children }) => (
    <a
      href={href}
      className="underline decoration-border2 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-fg"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="mt-4 list-disc pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal pl-5">{children}</ol>,
  li: ({ children }) => <li className="mt-1.5">{children}</li>,
  // Fenced code: ```ts → <pre><code className="language-ts">…</code></pre>
  pre: ({ children }) => {
    const code = isValidElement<{ children?: ReactNode; className?: string }>(children)
      ? children.props
      : undefined;
    const lang = /language-(\S+)/.exec(code?.className ?? "")?.[1];
    return <CodeBlock code={textOf(code?.children ?? children)} lang={lang} />;
  },
  FeatureList,
  ArchitectureDiagram,
  Results,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
