import { Children, cloneElement, isValidElement, type ComponentProps, type ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, Lightbulb, TriangleAlert } from "lucide-react";
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
          blockquote: ({ children, node }) => <Blockquote node={node}>{children}</Blockquote>,
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
        }}
      >
        {guide.content}
      </ReactMarkdown>
    </article>
  );
}

type AlertType = "NOTE" | "TIP" | "IMPORTANT" | "WARNING" | "CAUTION";

const alertDetails: Record<AlertType, { label: string; icon: typeof Info }> = {
  NOTE: { label: "Nota", icon: Info },
  TIP: { label: "Sugerencia", icon: Lightbulb },
  IMPORTANT: { label: "Importante", icon: CircleCheck },
  WARNING: { label: "Atención", icon: TriangleAlert },
  CAUTION: { label: "Precaución", icon: CircleAlert },
};

function markdownText(node: unknown): string {
  if (typeof node !== "object" || node === null) return "";
  const current = node as { value?: unknown; children?: unknown[] };
  if (typeof current.value === "string") return current.value;
  return current.children?.map(markdownText).join("") ?? "";
}

function alertTypeFromNode(node: unknown): AlertType | null {
  const match = markdownText(node).match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
  return match?.[1].toUpperCase() as AlertType | undefined ?? null;
}

function withoutAlertMarker(children: ReactNode): ReactNode {
  let markerRemoved = false;

  function removeMarker(value: ReactNode): ReactNode {
    if (!markerRemoved && typeof value === "string") {
      const nextValue = value.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, "");
      if (nextValue !== value) markerRemoved = true;
      return nextValue;
    }

    if (Array.isArray(value)) return value.map(removeMarker);

    if (!markerRemoved && isValidElement<{ children?: ReactNode }>(value)) {
      return cloneElement(value, undefined, removeMarker(value.props.children));
    }

    return value;
  }

  return Children.map(children, removeMarker);
}

function Blockquote({ children, node }: { children: ReactNode; node: unknown }) {
  const type = alertTypeFromNode(node);
  if (!type) return <blockquote>{children}</blockquote>;

  const { label, icon: Icon } = alertDetails[type];
  return (
    <aside className={`markdown-alert markdown-alert-${type.toLowerCase()}`} aria-label={label}>
      <p className="markdown-alert-title"><Icon className="size-4" aria-hidden="true" /> {label}</p>
      <div className="markdown-alert-content">{withoutAlertMarker(children)}</div>
    </aside>
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
