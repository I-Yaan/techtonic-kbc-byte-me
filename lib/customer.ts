export type CustomerProfile = {
  customerId: string;
  name: string;
  age: number;
  riskProfile: "BALANCED";
  accounts: {
    checking: { balance: number; currency: string };
    savings: { balance: number; rate: number };
    boleroPortfolio: { currentValuation: number; monthlyAutoInvest: number };
  };
  liabilities: { type: string; monthlyPayment: number; endDate: string }[];
  monthlyCashflow: {
    netIncome: number;
    fixedOutflows: number;
    variableBurnAverage: number;
    discretionarySurplus: number;
  };
  safetyBufferTarget: number;
  spendingSnapshot: { label: string; amount: number; change: string }[];
};

export type CustomerEvent = {
  eventId: string;
  type: string;
  label: string;
  detail: string;
  amount?: number;
  tone: "positive" | "neutral" | "attention";
};

export const CUSTOMER: CustomerProfile = {
  customerId: "BE-982144",
  name: "Sarah De Smet",
  age: 24,
  riskProfile: "BALANCED",
  accounts: {
    checking: { balance: 3450, currency: "EUR" },
    savings: { balance: 14200, rate: 0.015 },
    boleroPortfolio: { currentValuation: 6800, monthlyAutoInvest: 0 },
  },
  liabilities: [
    { type: "AUTO_LOAN", monthlyPayment: 310, endDate: "2026-10-31" },
  ],
  monthlyCashflow: {
    netIncome: 2650,
    fixedOutflows: 1450,
    variableBurnAverage: 720,
    discretionarySurplus: 480,
  },
  safetyBufferTarget: 7500,
  spendingSnapshot: [
    { label: "Livraisons", amount: 186, change: "+22 %" },
    { label: "Abonnements", amount: 74, change: "3 actifs" },
    { label: "Sorties", amount: 142, change: "stable" },
  ],
};

export const CUSTOMER_EVENTS: CustomerEvent[] = [
  {
    eventId: "EVT-001",
    type: "WAGE_INDEXATION_DETECTED",
    label: "Salaire indexé",
    detail: "+240 € nets détectés depuis ce mois-ci",
    amount: 240,
    tone: "positive",
  },
  {
    eventId: "EVT-002",
    type: "DEBT_AMORTIZATION_COMPLETED",
    label: "Crédit auto bientôt terminé",
    detail: "310 € libérés chaque mois dès novembre 2026",
    amount: 310,
    tone: "positive",
  },
  {
    eventId: "EVT-003",
    type: "INVESTMENT_GAP_DETECTED",
    label: "Potentiel d’investissement",
    detail: "0 € de versement automatique sur un portefeuille de 6 800 €",
    tone: "attention",
  },
];
