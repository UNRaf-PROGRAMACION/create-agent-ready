import { ArrowRight, BookOpen, CheckCircle2, GitFork, ShieldCheck, Terminal } from "lucide-react";
import { guides, guideHref } from "../content/guides";
import { CopyCodeButton } from "./copy-code-button";

const command = "npx create-agent-ready-unraf . --level=sdd --dry-run";

export function LandingPage() {
  return (
    <main>
      <section className="hero-grid overflow-hidden border-b border-white/10">
        <div className="mx-auto grid min-h-[38rem] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
          <div className="relative z-10">
            <p className="eyebrow"><span /> Videojuegos UNRAF</p>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-black leading-[.96] tracking-[-.05em] text-white sm:text-7xl">
              El agente acelera.<br /><span className="text-mint">Vos decidís.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Un punto de partida para usar agentes de programación con contexto, límites y evidencia. Diseñado para pasar de una idea de juego a cambios pequeños y verificables.
            </p>
            <div className="command-panel mt-9 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[.16em] text-mint"><Terminal className="size-4" /> PRIMERO, REVISÁ</div>
              <code className="mt-3 block pr-20 text-sm text-white sm:text-base">{command}</code>
              <CopyCodeButton value={command} />
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-mint" /> Sin sobrescribir por sorpresa</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-mint" /> Con evidencia verificable</span>
            </div>
          </div>
          <div className="flow-card relative z-10">
            <p className="text-xs font-bold tracking-[.2em] text-amber">CICLO DE TRABAJO</p>
            <div className="mt-7 space-y-3 font-display text-xl font-bold text-white">
              {["contexto", "spec", "plan", "cambio pequeño", "verificación", "evidencia"].map((step, index) => (
                <div className="flow-step" key={step}><span>0{index + 1}</span>{step}</div>
              ))}
            </div>
            <p className="mt-7 border-t border-white/10 pt-5 text-sm leading-6 text-slate-400">La autoridad sobre el producto, el repositorio y la publicación sigue siendo humana.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="eyebrow"><span /> Ruta de aprendizaje</p><h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Leé, probá, verificá.</h2></div>
          <p className="max-w-md text-sm leading-6 text-slate-400">Tres guías para comprender el método y usarlo en un proyecto real.</p>
        </div>
        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {guides.map((guide, index) => (
            <a className="guide-card group" href={guideHref(guide.id)} key={guide.id}>
              <span className="text-sm font-bold text-amber">0{index + 1}</span>
              <p className="mt-8 text-xs font-bold tracking-[.16em] text-mint">{guide.eyebrow}</p>
              <h3 className="mt-3 font-display text-2xl font-bold text-white">{guide.title}</h3>
              <p className="mt-4 leading-7 text-slate-400">{guide.description}</p>
              <span className="mt-8 flex items-center gap-2 text-sm font-semibold text-white">Abrir guía <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span>
            </a>
          ))}
        </div>
      </section>
      <section className="border-y border-white/10 bg-white/[.025]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-10 sm:flex-row sm:items-center lg:px-8">
          <div className="flex items-center gap-4"><span className="grid size-11 place-items-center rounded-full border border-mint/30 bg-mint/10 text-mint"><BookOpen className="size-5" /></span><p className="max-w-xl text-sm leading-6 text-slate-300">OpenCode es el ejemplo del workshop. El proceso es independiente del proveedor, modelo o motor de juegos.</p></div>
          <a className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-mint" href="https://github.com/UNRaf-PROGRAMACION/create-agent-ready" target="_blank" rel="noreferrer"><GitFork className="size-4" /> Ver repositorio</a>
        </div>
      </section>
    </main>
  );
}
