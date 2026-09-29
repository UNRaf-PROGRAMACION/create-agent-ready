import { ArrowDown } from "lucide-react";

const steps = [
  { title: "GDD o intención", detail: "Definí qué necesita la persona jugadora." },
  { title: "Spec", detail: "Acotá el cambio y sus criterios de aceptación." },
  { title: "Plan", detail: "Elegí una ruta técnica revisable." },
  { title: "Cambio pequeño", detail: "Implementá una pieza por vez." },
  { title: "Verificación", detail: "Comprobá el comportamiento esperado." },
  { title: "Evidencia", detail: "Registrá resultados y limitaciones." },
  { title: "Decisión humana", detail: "Aceptá, ajustá o volvé a planificar." },
] as const;

export function WorkflowCards() {
  return (
    <ol className="workflow-cards" aria-label="Etapas del ciclo de trabajo">
      {steps.map((step, index) => (
        <li className="workflow-step" key={step.title}>
          <div className="workflow-card">
            <span className="workflow-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <span className="workflow-title">{step.title}</span>
              <span className="workflow-detail">{step.detail}</span>
            </div>
          </div>
          {index < steps.length - 1 && <ArrowDown className="workflow-arrow" size={18} aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}
