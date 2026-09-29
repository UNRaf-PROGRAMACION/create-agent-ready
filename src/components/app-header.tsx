import { Menu } from "lucide-react";
import type { GuideId } from "../content/guides";
import { guideHref, guides } from "../content/guides";
import { GithubRepoLink } from "./github-repo-link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

function LogoMark({ className }: { className?: string }) {
  return (
    <img className={className} src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Logotipo Agent Ready" />
  );
}

type AppHeaderProps = { activeGuide?: GuideId };

function GuideLinks({ activeGuide }: AppHeaderProps) {
  return (
    <nav aria-label="Guías" className="flex flex-col gap-2 lg:flex-row lg:items-center">
      {guides.map((guide) => (
        <a
          className={`rounded-xs border px-3 py-2 text-sm font-semibold transition duration-200 motion-safe:hover:-translate-y-0.5 hover:border-mint/70 hover:bg-mint/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint ${activeGuide === guide.id ? "border-mint/50 bg-mint/10 text-mint" : "border-white/15 bg-white/5 text-slate-200 hover:text-white"}`}
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
        <a className="group flex items-center gap-2 text-white focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint" href="./" aria-label="Ir al inicio">
          <LogoMark className="size-8 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5" />
          <span className="font-display text-sm font-bold tracking-wide">AGENT READY</span>
        </a>
        <div className="hidden items-center gap-2 lg:flex">
          <GuideLinks activeGuide={activeGuide} />
          <GithubRepoLink compact />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="motion-safe:hover:-translate-y-0.5 lg:hidden" aria-label="Abrir menú"><Menu className="size-5" /></Button>
          </SheetTrigger>
          <SheetContent aria-describedby={undefined}>
            <p className="font-display text-sm font-bold tracking-widest text-mint">NAVEGACIÓN</p>
            <div className="mt-8"><GuideLinks activeGuide={activeGuide} /></div>
            <div className="mt-8"><GithubRepoLink /></div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
