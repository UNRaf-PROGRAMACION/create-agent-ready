import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const repoUrl = "https://github.com/UNRaf-PROGRAMACION/create-agent-ready";
const apiUrl = "https://api.github.com/repos/UNRaf-PROGRAMACION/create-agent-ready";
let starsRequest: Promise<number | null> | undefined;

function getStars() {
  starsRequest ??= fetch(apiUrl)
    .then(async (response) => {
      if (!response.ok) return null;
      const repo: unknown = await response.json();
      if (typeof repo !== "object" || repo === null || !("stargazers_count" in repo)) return null;
      return typeof repo.stargazers_count === "number" ? repo.stargazers_count : null;
    })
    .catch(() => null);
  return starsRequest;
}

export function GithubRepoLink({ compact = false }: { compact?: boolean }) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    void getStars().then((count) => {
      if (mounted) setStars(count);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <a
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-xs border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition duration-200 motion-safe:hover:-translate-y-0.5 hover:border-mint/70 hover:bg-mint/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
      href={repoUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={compact ? `Repositorio en GitHub${stars !== null ? `, ${stars.toLocaleString("es-AR")} estrellas` : ""}` : undefined}
    >
      <svg className="size-4 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
      {!compact && <span>Ver repositorio</span>}
      {stars !== null && (
        <span className="inline-flex items-center gap-1 border-l border-white/15 pl-2 text-amber" aria-label={`${stars.toLocaleString("es-AR")} estrellas`}>
          <Star className="size-3.5" aria-hidden="true" />
          {stars.toLocaleString("es-AR")}
        </span>
      )}
    </a>
  );
}
