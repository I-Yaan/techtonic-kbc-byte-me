"use client";

import type { RoadmapStep } from "@/lib/plans";

type AgentStepProps = {
  step: RoadmapStep | undefined;
  onAnswer: (value: string) => void;
  onCompleteAction: () => void;
};

export default function AgentStep({
  step,
  onAnswer,
  onCompleteAction,
}: AgentStepProps) {
  if (!step) {
    return (
      <aside className="tx-agent">
        <p className="tx-kicker">L’agent</p>
        <h2>Chemin parcouru</h2>
        <p>Tu as répondu et agi sur chaque étape. Le graphe ci-dessous montre l’écart.</p>
      </aside>
    );
  }

  const isQuestion = step.kind === "question";
  const locked = step.status === "done";

  return (
    <aside className="tx-agent" aria-live="polite">
      <p className="tx-kicker">
        {isQuestion ? "L’agent pose une question" : "L’agent donne une action"}
      </p>
      <h2>{isQuestion ? step.prompt : step.title}</h2>
      <p>{step.detail}</p>

      {isQuestion && step.options && !locked && (
        <div className="tx-choices">
          {step.options.map((option) => (
            <button
              key={option}
              type="button"
              className="tx-choice"
              onClick={() => onAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {isQuestion && locked && step.answer && (
        <p className="tx-answer">Tu as répondu : {step.answer}</p>
      )}

      {!isQuestion && !locked && (
        <button type="button" className="tx-primary" onClick={onCompleteAction}>
          Marquer comme fait
        </button>
      )}

      {!isQuestion && locked && <p className="tx-answer">Geste enregistré. Le graphe a bougé.</p>}
    </aside>
  );
}
