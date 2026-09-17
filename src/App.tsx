import { useEffect, useState } from "react";
import { ArrowLeft, Compass } from "lucide-react";
import { AppHeader } from "./components/app-header";
import { GuideRenderer } from "./components/guide-renderer";
import { LandingPage } from "./components/landing-page";
import { TableOfContents } from "./components/table-of-contents";
import { findGuide } from "./content/guides";
import { tableOfContents } from "./lib/markdown";

function selectedGuide() {
  return new URLSearchParams(window.location.search).get("guia");
}

export default function App() {
  const [guideId, setGuideId] = useState(selectedGuide);
  const guide = findGuide(guideId);

  useEffect(() => {
    const updateGuide = () => setGuideId(selectedGuide());
    window.addEventListener("popstate", updateGuide);
    return () => window.removeEventListener("popstate", updateGuide);
  }, []);

  useEffect(() => {
    document.title = guide ? `${guide.title} | create-agent-ready` : "create-agent-ready | UNRAF";
  }, [guide]);

  if (guideId && !guide) {
    return (
      <>
        <AppHeader />
        <main className="mx-auto grid min-h-[65vh] max-w-7xl place-items-center px-5 py-16 lg:px-8">
          <div className="max-w-lg text-center"><Compass className="mx-auto size-9 text-amber" /><p className="mt-6 text-xs font-bold tracking-[.18em] text-mint">RUTA NO ENCONTRADA</p><h1 className="mt-3 font-display text-4xl font-bold text-white">Esta guía no existe.</h1><a className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-mint hover:text-white" href="./"><ArrowLeft className="size-4" /> Volver al inicio</a></div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader activeGuide={guide?.id} />
      {guide ? (
        <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
          <div className="mb-9 border-b border-white/10 pb-8 lg:hidden"><p className="text-xs font-bold tracking-[.18em] text-mint">{guide.eyebrow}</p><p className="mt-2 font-display text-2xl font-bold text-white">{guide.title}</p></div>
          <div className="guide-layout">
            <TableOfContents items={tableOfContents(guide.content)} />
            <GuideRenderer guide={guide} />
          </div>
        </main>
      ) : <LandingPage />}
      <footer className="border-t border-white/10 px-5 py-8 text-center text-xs text-slate-500">Videojuegos UNRAF · Desarrollo guiado por agentes y SDD</footer>
    </>
  );
}
