import { ArrowDown } from "lucide-react";

export type WorkflowStep = { title: string; detail: string };

export function WorkflowCards({ steps }: { steps: WorkflowStep[] }) {
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
