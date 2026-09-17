import { GitFork, Menu, Terminal } from "lucide-react";
import type { GuideId } from "../content/guides";
import { guideHref, guides } from "../content/guides";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

type AppHeaderProps = { activeGuide?: GuideId };

function GuideLinks({ activeGuide }: AppHeaderProps) {
  return (
    <nav aria-label="Guías" className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-5">
      {guides.map((guide) => (
        <a
          className={`rounded-md px-2 py-1 text-sm transition ${activeGuide === guide.id ? "text-mint" : "text-slate-300 hover:text-white"}`}
          href={guideHref(guide.id)}
          key={guide.id}
        >
          {guide.eyebrow}
        </a>
      ))}
    </nav>
  );
}

export function AppHeader({ activeGuide }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a className="flex items-center gap-2 text-white" href="./" aria-label="Ir al inicio">
          <span className="grid size-8 place-items-center rounded bg-mint text-ink"><Terminal className="size-4" /></span>
          <span className="font-display text-sm font-bold tracking-wide">AGENT READY</span>
        </a>
        <div className="hidden items-center gap-7 lg:flex">
          <GuideLinks activeGuide={activeGuide} />
          <a className="text-slate-300 transition hover:text-mint" href="https://github.com/UNRaf-PROGRAMACION/create-agent-ready" target="_blank" rel="noreferrer">
            <GitFork className="size-5" />
            <span className="sr-only">Repositorio en GitHub</span>
          </a>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="lg:hidden" aria-label="Abrir menú"><Menu className="size-5" /></Button>
          </SheetTrigger>
          <SheetContent aria-describedby={undefined}>
            <p className="font-display text-sm font-bold tracking-widest text-mint">NAVEGACIÓN</p>
            <div className="mt-8"><GuideLinks activeGuide={activeGuide} /></div>
            <a className="mt-8 flex items-center gap-2 text-sm text-slate-300 hover:text-mint" href="https://github.com/UNRaf-PROGRAMACION/create-agent-ready" target="_blank" rel="noreferrer"><GitFork className="size-4" /> Ver repositorio</a>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
