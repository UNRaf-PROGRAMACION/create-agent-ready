import type { ReactNode } from "react";
import type { GuideId } from "../content/guides";

export type TableOfContentsItem = {
  depth: 2 | 3;
  label: string;
  id: string;
};

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return nodeText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

export function tableOfContents(markdown: string): TableOfContentsItem[] {
  return [...markdown.matchAll(/^(##|###)\s+(.+)$/gm)].map((match) => {
    const label = match[2].replace(/[*_`]/g, "");
    return { depth: match[1].length as 2 | 3, label, id: slugify(label) };
  });
}

export function guideIdFromHref(href: string): GuideId | null {
  if (href.endsWith("01-marco-conceptual.md")) return "marco-conceptual";
  if (href.endsWith("02-guia-workshop.md")) return "workshop";
  if (href.endsWith("03-referencia-cli.md")) return "referencia-cli";
  return null;
}
