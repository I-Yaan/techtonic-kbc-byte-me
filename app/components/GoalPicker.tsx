"use client";

import { useState, type FormEvent } from "react";
import { Home, Receipt, TrendingUp } from "lucide-react";
import { GOAL_CARDS, formatEuro } from "@/lib/plans";
import { CUSTOMER, CUSTOMER_EVENTS } from "@/lib/customer";

type GoalPickerProps = {
  onPick: (goalId: string, customTitle?: string) => void;
};

const ICONS = {
  investir: TrendingUp,
  depenses: Receipt,
  maison: Home,
} as const;

export default function GoalPicker({ onPick }: GoalPickerProps) {
  const [custom, setCustom] = useState("");

  function handleCustom(e: FormEvent) {
    e.preventDefault();
    const title = custom.trim();
    if (!title) return;
    onPick("custom", title);
  }

  return (
    <div className="tx-picker">
      <header className="tx-hero">
        <div className="tx-hero-topline">
          <p className="tx-brand">
            Traject <span>KBC</span>
          </p>
          <span className="tx-live"><i /> Analyse en direct</span>
        </div>
        <p className="tx-eyebrow">Bonjour {CUSTOMER.name.split(" ")[0]}</p>
        <h1>Ton argent a déjà un prochain mouvement.</h1>
        <p className="tx-lead">
          KBC a repéré quelques changements dans ta situation. Choisis un cap et
          Traject transforme ces signaux en petites décisions concrètes.
        </p>
      </header>

      <section className="tx-insight-board" aria-label="Synthèse de ta situation">
        <div className="tx-insight-head">
          <div>
            <p className="tx-kicker">Vue d’ensemble</p>
            <h2>Ce que l’agent voit pour toi</h2>
          </div>
          <span className="tx-profile">Profil {CUSTOMER.riskProfile === "BALANCED" ? "équilibré" : CUSTOMER.riskProfile.toLowerCase()}</span>
        </div>
        <div className="tx-money-row">
          <div><span>Disponible aujourd’hui</span><strong>{formatEuro(CUSTOMER.accounts.checking.balance)}</strong></div>
          <div><span>Épargne de sécurité</span><strong>{formatEuro(CUSTOMER.accounts.savings.balance)}</strong></div>
          <div><span>Surplus estimé / mois</span><strong>{formatEuro(CUSTOMER.monthlyCashflow.discretionarySurplus)}</strong></div>
        </div>
        <ul className="tx-events">
          {CUSTOMER_EVENTS.map((event) => (
            <li key={event.eventId} className={`tx-event tx-event-${event.tone}`}>
              <span className="tx-event-dot" aria-hidden />
              <span><strong>{event.label}</strong><small>{event.detail}</small></span>
            </li>
          ))}
        </ul>
      </section>

      <div className="tx-recommendation">
        <div><span className="tx-kicker">Suggestion prioritaire</span><strong>Transformer le nouveau surplus en automatisme</strong><p>Commencer à 250 € / mois, puis réévaluer quand le crédit auto se termine.</p></div>
        <button type="button" className="tx-recommendation-action" onClick={() => onPick("investir")}>Voir le chemin <span aria-hidden>↗</span></button>
      </div>

      <div className="tx-section-heading">
        <div><p className="tx-kicker">À toi de choisir</p><h2>Quel cap tu veux tenir ?</h2></div>
        <span>3 chemins prêts à démarrer</span>
      </div>

      <ul className="tx-goals">
        {GOAL_CARDS.map((goal) => {
          const Icon = ICONS[goal.id as keyof typeof ICONS] ?? TrendingUp;
          return (
            <li key={goal.id}>
              <button type="button" className="tx-goal" onClick={() => onPick(goal.id)}>
                <span className="tx-goal-icon" aria-hidden>
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span className="tx-kicker">{goal.kicker}</span>
                <strong>{goal.title}</strong>
                <span>{goal.description}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <form className="tx-custom" onSubmit={handleCustom}>
        <label htmlFor="custom-goal">Autre idée</label>
        <div className="tx-custom-row">
          <input
            id="custom-goal"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Ex. partir 3 mois, rembourser un prêt…"
          />
          <button type="submit" className="tx-primary" disabled={!custom.trim()}>
            Créer le chemin
          </button>
        </div>
      </form>
    </div>
  );
}
