import { ArrowDown, ArrowUpRight, Check, ChevronDown, ChevronsDownUp, FileText, GitBranch, Maximize2, MessageSquare, Play, Terminal } from "lucide-react";
import { useState, type ReactNode } from "react";
import flowSource from "../../docs/Flujos (2).md?raw";
import { slugify } from "../lib/markdown";

// Keep commands, prompts and instructions in the original document as the source of truth.
const flows = flowSource.split(/^## (?=Flujo de Trabajo )/m).slice(1).map((section) => {
  const [title, ...parts] = section.split(/\r?\n/);
  const [, ...steps] = parts.join("\n").split(/^\*\*(Paso \d+: .+)\*\*\s*$/m);
  return {
    title,
    steps: Array.from({ length: steps.length / 2 }, (_, index) => ({
      title: steps[index * 2],
      // Empty headings in the source are spacing, not additional steps.
      content: steps[index * 2 + 1].replace(/^##\s*$/gm, "").trim(),
    })),
  };
});

const stepIds = flows.flatMap((flow) => flow.steps.map((_, index) => `${flow.title}-${index}`));

export function WorkshopFlows({ renderContent }: { renderContent: (content: string) => ReactNode }) {
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const [activeRoute, setActiveRoute] = useState(0);
  const allExpanded = opened.size === stepIds.length;

  function toggleStep(id: string, open: boolean) {
    setOpened((previous) => {
      if (previous.has(id) === open) return previous;
      const next = new Set(previous);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <div className="workshop-flows">
      <div className="flow-toolbar">
        <div className="flow-intro">
          <span className="flow-eyebrow"><GitBranch size={14} aria-hidden="true" /> MAPA DE TRABAJO</span>
          <h3>Tu punto de partida.<br /><span>Tu próximo paso.</span></h3>
          <p>Elegí un recorrido. Abrí cada paso para ver qué hacer y copiar su comando o prompt.</p>
        </div>
        <button className="flow-view-button" type="button" onClick={() => setOpened(allExpanded ? new Set() : new Set(stepIds))}>
          {allExpanded ? <ChevronsDownUp size={14} aria-hidden="true" /> : <Maximize2 size={14} aria-hidden="true" />}
          {allExpanded ? "Vista compacta" : "Expandir pasos"}
        </button>
      </div>

      <div className="flow-origin">
        <div className="flow-start"><Play size={16} aria-hidden="true" /> Iniciar proyecto</div>
        <div className="flow-stem" aria-hidden="true"><ArrowDown size={18} /></div>
        <div className="flow-decision"><span>¿Tenés<br /><strong>un GDD?</strong></span></div>
      </div>

      <nav className="flow-fork" aria-label="Elegí el recorrido según tu GDD">
        <a className="flow-route flow-route-a" href={`#${slugify(flows[0].title)}`} onClick={() => setActiveRoute(0)}><span>NO</span> Crear el GDD <ArrowDown size={16} aria-hidden="true" /></a>
        <a className="flow-route flow-route-b" href={`#${slugify(flows[1].title)}`} onClick={() => setActiveRoute(1)}><span>SÍ</span> Usar un GDD existente <ArrowDown size={16} aria-hidden="true" /></a>
      </nav>

      <div className="flow-mobile-switch" role="group" aria-label="Recorrido visible">
        <button type="button" aria-pressed={activeRoute === 0} aria-controls="flow-branch-a" onClick={() => setActiveRoute(0)}><span>A</span> Crear GDD</button>
        <button type="button" aria-pressed={activeRoute === 1} aria-controls="flow-branch-b" onClick={() => setActiveRoute(1)}><span>B</span> Tengo GDD</button>
      </div>

      <div className="flow-branches">
      {flows.map((flow, flowIndex) => (
        <section className={`flow-branch flow-branch-${flowIndex === 0 ? "a" : "b"}`} key={flow.title} id={`flow-branch-${flowIndex === 0 ? "a" : "b"}`} data-active={activeRoute === flowIndex} aria-labelledby={slugify(flow.title)}>
          <header className="flow-branch-heading">
            <span className="flow-letter" aria-hidden="true">{flowIndex === 0 ? "A" : "B"}</span>
            <div>
              <span className="flow-branch-count">RECORRIDO {flowIndex === 0 ? "A" : "B"} <span>· {flow.steps.length} pasos</span></span>
              <h3 id={slugify(flow.title)}>{flow.title.replace(/^Flujo de Trabajo [AB]: /, "")}</h3>
            </div>
          </header>
          <ol className="flow-nodes" aria-label={flow.title}>
            {flow.steps.map((step, index) => (
              <li className="flow-node" key={step.title}>
                <FlowNode step={step} number={index + 1} open={opened.has(`${flow.title}-${index}`)} onToggle={(open) => toggleStep(`${flow.title}-${index}`, open)} renderContent={renderContent} />
                {index < flow.steps.length - 1 && <div className="flow-connector" aria-hidden="true"><ArrowDown size={18} /></div>}
              </li>
            ))}
          </ol>
          <div className="flow-end"><Check size={13} aria-hidden="true" /> Próximos pasos recomendados</div>
        </section>
      ))}
      </div>
      <div className="flow-source"><FileText size={14} aria-hidden="true" /> Contenido original de Flujos (2).md · Los recorridos se mantienen independientes.</div>
    </div>
  );
}

function FlowNode({ step, number, open, onToggle, renderContent }: {
  step: { title: string; content: string };
  number: number;
  open: boolean;
  onToggle: (open: boolean) => void;
  renderContent: (content: string) => ReactNode;
}) {
  const terminal = step.content.includes("npx ");
  const prompt = !terminal && step.content.includes("```sh");
  const Icon = terminal ? Terminal : prompt ? MessageSquare : FileText;
  return (
    <details className={`flow-node-card flow-node-${terminal ? "terminal" : prompt ? "prompt" : "manual"}`} open={open} onToggle={(event) => onToggle(event.currentTarget.open)}>
      <summary aria-label={step.title}>
        <span className="flow-step-number" aria-hidden="true">{String(number).padStart(2, "0")}</span>
        <span className="flow-node-label">
          <span className="flow-node-meta"><Icon size={13} aria-hidden="true" /> {terminal ? "TERMINAL" : prompt ? "AGENTE" : "ACCIÓN MANUAL"}</span>
          <span className="flow-node-title">{step.title.replace(/^Paso \d+: /, "")}</span>
        </span>
        <span className="flow-node-action" aria-hidden="true">{open ? <ChevronDown size={16} /> : <ArrowUpRight size={16} />}</span>
      </summary>
      <div className="flow-node-content">
        {terminal || prompt ? <div className="flow-content-label"><span aria-hidden="true">{terminal ? "$" : "✦"}</span> {terminal ? "Ejecutá en la terminal" : "Enviá al agente"}</div> : null}
        {renderContent(step.content)}
      </div>
    </details>
  );
}
