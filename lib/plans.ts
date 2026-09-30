export type StepKind = "question" | "action";
export type StepStatus = "done" | "current" | "upcoming";

export type RoadmapStep = {
  id: string;
  kind: StepKind;
  title: string;
  detail: string;
  status: StepStatus;
  prompt?: string;
  options?: string[];
  cadence?: string;
  answer?: string;
};

export type ChartSeries = {
  labels: string[];
  baseline: number[];
  projected: number[];
  metricLabel: string;
};

export type Plan = {
  goalId: string;
  goalTitle: string;
  tagline: string;
  horizon: string;
  steps: RoadmapStep[];
  chart: ChartSeries;
};

export type GoalCard = {
  id: string;
  title: string;
  kicker: string;
  description: string;
};

export const GOAL_CARDS: GoalCard[] = [
  {
    id: "investir",
    title: "Investir",
    kicker: "Faire travailler l’argent",
    description: "Un rythme d’épargne, un véhicule simple, un horizon clair.",
  },
  {
    id: "depenses",
    title: "Analyser mes dépenses",
    kicker: "Voir où part l’argent",
    description: "Repérer les fuites, couper une habitude, réinjecter ailleurs.",
  },
  {
    id: "maison",
    title: "Acheter une maison",
    kicker: "Construire l’apport",
    description: "Un montant cible, des versements, des délais réalistes.",
  },
];

const MONTHS = ["Oct", "Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep"];

function markFirstCurrent(steps: Omit<RoadmapStep, "status">[]): RoadmapStep[] {
  return steps.map((step, i) => ({
    ...step,
    status: i === 0 ? "current" : "upcoming",
  }));
}

export function createPlan(goalId: string, customTitle?: string): Plan {
  if (goalId === "investir") {
    return {
      goalId,
      goalTitle: "Investir",
      tagline: "Un petit montant, chaque mois, plutôt qu’un grand geste plus tard.",
      horizon: "12 mois",
      steps: markFirstCurrent([
        {
          id: "q-capacity",
          kind: "question",
          title: "Quelle capacité mensuelle ?",
          detail: "L’agent a besoin d’un ordre de grandeur pour caler le versement.",
          prompt: "Combien peux-tu mettre de côté chaque mois, sans te mettre à découvert ?",
          options: ["100 €", "250 €", "400 €"],
        },
        {
          id: "a-virement",
          kind: "action",
          title: "Virement automatique le 1er du mois",
          detail: "Le jour de paie, avant que le compte ne se vide tout seul.",
          cadence: "Chaque mois",
        },
        {
          id: "q-risk",
          kind: "question",
          title: "Quel confort de risque ?",
          detail: "Ça change le type de produit, pas l’habitude de verser.",
          prompt: "Si le placement baisse de 10 % pendant 6 mois, tu fais quoi ?",
          options: ["Je laisse", "Je réduis", "Je sors"],
        },
        {
          id: "a-stop-daily",
          kind: "action",
          title: "Couper un achat quotidien",
          detail: "Arrêter le café à emporter 5 jours / 7 et basculer ~120 € / mois vers l’investissement.",
          cadence: "Tous les jours",
        },
        {
          id: "a-review",
          kind: "action",
          title: "Revue trimestrielle",
          detail: "Vérifier le versement, pas le cours. Ajuster si le revenu a changé.",
          cadence: "Tous les 3 mois",
        },
      ]),
      chart: {
        labels: MONTHS,
        baseline: [0, 40, 70, 90, 100, 110, 120, 125, 130, 135, 140, 145],
        projected: [0, 250, 510, 780, 1060, 1350, 1650, 1960, 2280, 2610, 2950, 3300],
        metricLabel: "Capital estimé",
      },
    };
  }

  if (goalId === "depenses") {
    return {
      goalId,
      goalTitle: "Analyser mes dépenses",
      tagline: "Une fuite identifiée vaut mieux que dix bonnes résolutions.",
      horizon: "8 semaines",
      steps: markFirstCurrent([
        {
          id: "q-worst",
          kind: "question",
          title: "Quelle catégorie te gêne ?",
          detail: "On commence par une ligne, pas par tout le budget.",
          prompt: "Si tu ouvres tes 30 derniers jours, quelle ligne te pique le plus ?",
          options: ["Livraisons", "Abonnements", "Sorties"],
        },
        {
          id: "a-export",
          kind: "action",
          title: "Lister les 10 plus gros paiements",
          detail: "Juste les dix. Pas un tableur parfait — un constat.",
          cadence: "Cette semaine",
        },
        {
          id: "a-cut",
          kind: "action",
          title: "Couper une récurrence",
          detail: "Un abonnement oublié ou un plat livré 4× / semaine. L’argent part sur un compte tampon.",
          cadence: "Dès maintenant",
        },
        {
          id: "q-redirect",
          kind: "question",
          title: "Où va l’argent récupéré ?",
          detail: "Sans destination, il revient dans les habitudes.",
          prompt: "Les euros économisés, tu les envoies où ?",
          options: ["Épargne", "Dette", "Projet"],
        },
        {
          id: "a-weekly",
          kind: "action",
          title: "Point de 10 minutes le dimanche",
          detail: "Trois chiffres : dépensé, évité, transféré.",
          cadence: "Chaque semaine",
        },
      ]),
      chart: {
        labels: MONTHS.slice(0, 8),
        baseline: [0, 20, 35, 40, 42, 45, 48, 50],
        projected: [0, 90, 190, 310, 430, 560, 700, 860],
        metricLabel: "Économies cumulées",
      },
    };
  }

  if (goalId === "maison") {
    return {
      goalId,
      goalTitle: "Acheter une maison",
      tagline: "L’apport se construit comme une dette inversée : date, montant, rythme.",
      horizon: "36 mois",
      steps: markFirstCurrent([
        {
          id: "q-apport",
          kind: "question",
          title: "Quel apport vises-tu ?",
          detail: "Un chiffre rond suffit pour démarrer le calendrier.",
          prompt: "Quel apport te semblerait réaliste, pas idéal ?",
          options: ["15 000 €", "30 000 €", "50 000 €"],
        },
        {
          id: "a-compte",
          kind: "action",
          title: "Compte dédié, intouchable",
          detail: "Un compte séparé. Pas de carte. Virement le jour de paie.",
          cadence: "Une fois",
        },
        {
          id: "a-save",
          kind: "action",
          title: "Mettre de côté un montant fixe",
          detail: "Le même jour, le même montant. L’agent calera le X après ta réponse.",
          cadence: "Chaque mois",
        },
        {
          id: "q-horizon",
          kind: "question",
          title: "Dans combien de temps ?",
          detail: "Ça décide si on accélère l’épargne ou si on étale.",
          prompt: "Tu veux être prêt à chercher un bien dans…",
          options: ["18 mois", "3 ans", "5 ans"],
        },
        {
          id: "a-fees",
          kind: "action",
          title: "Prévoir notaire et imprévus",
          detail: "Garder 10 % du plan pour les frais, pas seulement l’apport affiché.",
          cadence: "Dans le plan",
        },
      ]),
      chart: {
        labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"],
        baseline: [400, 800, 1100, 1300, 1450, 1550, 1620, 1680],
        projected: [1200, 2800, 4600, 6600, 8800, 11200, 13800, 16600],
        metricLabel: "Apport estimé",
      },
    };
  }

  const title = customTitle?.trim() || "Mon objectif";
  return {
    goalId: "custom",
    goalTitle: title,
    tagline: "L’agent découpera ça en questions, puis en gestes concrets.",
    horizon: "À préciser",
    steps: markFirstCurrent([
      {
        id: "q-why",
        kind: "question",
        title: "Pourquoi maintenant ?",
        detail: "Une deadline personnelle donne un rythme, pas une motivation vague.",
        prompt: `Pour « ${title} », qu’est-ce qui rend ça urgent ou important cette année ?`,
        options: ["Une date", "Une envie", "Une contrainte"],
      },
      {
        id: "q-money",
        kind: "question",
        title: "Quel budget mensuel ?",
        detail: "Sans montant, la roadmap reste un souhait.",
        prompt: "Combien peux-tu y consacrer chaque mois ?",
        options: ["50 €", "150 €", "300 €"],
      },
      {
        id: "a-first",
        kind: "action",
        title: "Premier geste cette semaine",
        detail: "Ouvrir un compte ou une enveloppe dédiée, et y mettre le premier versement.",
        cadence: "Cette semaine",
      },
      {
        id: "a-habit",
        kind: "action",
        title: "Remplacer une dépense par ce projet",
        detail: "Un achat récurrent en moins, un virement en plus — même jour chaque mois.",
        cadence: "Chaque mois",
      },
    ]),
    chart: {
      labels: MONTHS.slice(0, 8),
      baseline: [0, 30, 50, 60, 70, 75, 80, 82],
      projected: [0, 150, 320, 510, 720, 950, 1200, 1480],
      metricLabel: "Avancée estimée",
    },
  };
}

export function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
