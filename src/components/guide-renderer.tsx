import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Guide } from "../content/guides";
import { guideHref } from "../content/guides";
import { guideIdFromHref, nodeText, slugify } from "../lib/markdown";
import { CopyCodeButton } from "./copy-code-button";

export function GuideRenderer({ guide }: { guide: Guide }) {
  return (
    <article className="guide-prose">
      <div className="guide-kicker">{guide.eyebrow}</div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 id={slugify(nodeText(children))}>{children}</h1>,
          h2: ({ children }) => <h2 id={slugify(nodeText(children))}>{children}</h2>,
          h3: ({ children }) => <h3 id={slugify(nodeText(children))}>{children}</h3>,
          a: ({ href = "", children, node: _node, ...props }) => {
            const id = guideIdFromHref(href);
            return id ? <a href={guideHref(id)} {...props}>{children}</a> : <a href={href} {...props}>{children}</a>;
          },
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
        }}
      >
        {guide.content}
      </ReactMarkdown>
    </article>
  );
}

function CodeBlock({ children }: ComponentProps<"pre">) {
  return (
    <div className="code-block">
      <CopyCodeButton value={nodeText(children)} />
      <pre>{children}</pre>
    </div>
  );
}
