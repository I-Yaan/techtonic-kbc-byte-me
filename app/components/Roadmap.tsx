"use client";

import type { RoadmapStep } from "@/lib/plans";

type RoadmapProps = {
  steps: RoadmapStep[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function Roadmap({ steps, selectedId, onSelect }: RoadmapProps) {
  return (
    <ol className="tx-roadmap">
      {steps.map((step, index) => (
        <li key={step.id}>
          <button
            type="button"
            className={`tx-step tx-step-${step.status} tx-step-${step.kind}${
              selectedId === step.id ? " tx-step-selected" : ""
            }`}
            onClick={() => onSelect(step.id)}
            aria-current={step.status === "current" ? "step" : undefined}
          >
            <span className="tx-step-index" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="tx-step-body">
              <span className="tx-step-meta">
                <span className={`tx-pill tx-pill-${step.kind}`}>
                  {step.kind === "question" ? "Question" : "Action"}
                </span>
                {step.cadence && <span className="tx-cadence">{step.cadence}</span>}
                {step.status === "done" && <span className="tx-cadence">Fait</span>}
              </span>
              <strong>{step.title}</strong>
              <span className="tx-step-detail">
                {step.answer ? `Réponse : ${step.answer}` : step.detail}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}
