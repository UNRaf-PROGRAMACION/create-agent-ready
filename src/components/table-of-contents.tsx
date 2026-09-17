import type { TableOfContentsItem } from "../lib/markdown";

export function TableOfContents({ items }: { items: TableOfContentsItem[] }) {
  if (!items.length) return null;

  return (
    <aside className="toc" aria-label="En esta guía">
      <p className="toc-title">EN ESTA GUÍA</p>
      <nav className="mt-4 space-y-1">
        {items.map((item) => (
          <a className={item.depth === 3 ? "toc-child" : "toc-link"} href={`#${item.id}`} key={item.id}>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
