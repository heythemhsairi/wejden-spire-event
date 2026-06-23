/** Workforce Risk Scanner (Experience 2): 10 questions, 5 categories. */

export type RiskCategory =
  | "Risque d'épuisement"
  | "Risque de rotation"
  | "Visibilité organisationnelle"
  | "Maturité de l'intelligence des effectifs"
  | "Préparation du leadership";

export interface ScanQuestion {
  id: string;
  category: RiskCategory;
  text: string;
  /** Options ordered worst → best; index maps to a 0–4 maturity score. */
  options: string[];
}

export const SCAN_QUESTIONS: ScanQuestion[] = [
  {
    id: "q1",
    category: "Risque d'épuisement",
    text: "Votre direction peut-elle voir l'épuisement monter avant qu'une personne ne démissionne ?",
    options: ["Non — nous l'apprenons quand la personne part", "De façon anecdotique, manager par manager", "Nous menons des enquêtes périodiques", "Nous suivons des indicateurs avancés", "Nous disposons de signaux d'exposition à l'épuisement en temps réel"],
  },
  {
    id: "q2",
    category: "Risque d'épuisement",
    text: "Comment détectez-vous aujourd'hui la surcharge de travail chronique au sein des équipes ?",
    options: ["Nous ne le détectons pas", "Les plaintes nous parviennent de façon informelle", "Enquête d'engagement annuelle", "Sondage trimestriel + points avec les managers", "Indices continus de charge et de surcharge de travail"],
  },
  {
    id: "q3",
    category: "Risque de rotation",
    text: "Combien de temps à l'avance pouvez-vous prédire un départ regretté ?",
    options: ["Nous ne pouvons pas le prédire", "Nous réagissons après les démissions", "Les entretiens de départ nous en donnent les raisons", "Nous modélisons le risque de départ par équipe", "Nous anticipons les départs grâce à des signaux avancés"],
  },
  {
    id: "q4",
    category: "Risque de rotation",
    text: "Savez-vous quelles équipes présentent actuellement le risque de rotation le plus élevé ?",
    options: ["Aucune visibilité", "Au ressenti des managers", "Le rapport de rotation de l'an dernier", "Un registre des risques à jour", "Risque de rotation classé en direct par unité"],
  },
  {
    id: "q5",
    category: "Visibilité organisationnelle",
    text: "Dans quelle mesure les risques psychosociaux sont-ils visibles pour votre comité de direction ?",
    options: ["Invisibles", "Uniquement en cas de crise", "Synthétisés une fois par an", "Examinés chaque trimestre", "En continu sur le tableau de bord de la direction"],
  },
  {
    id: "q6",
    category: "Visibilité organisationnelle",
    text: "Pouvez-vous comparer les signaux de bien-être et de risque d'un département à l'autre ?",
    options: ["Non", "Uniquement les effectifs et les coûts", "Quelques indicateurs RH", "Données d'engagement inter-départements", "Indices de risque normalisés par département"],
  },
  {
    id: "q7",
    category: "Maturité de l'intelligence des effectifs",
    text: "À quel point vos décisions relatives aux collaborateurs sont-elles fondées sur les données aujourd'hui ?",
    options: ["Essentiellement à l'intuition", "Reporting RH de base", "Tableaux de bord d'indicateurs rétrospectifs", "Quelques analyses prédictives", "Aide à la décision fondée sur des indicateurs avancés"],
  },
  {
    id: "q8",
    category: "Maturité de l'intelligence des effectifs",
    text: "Quantifiez-vous le coût économique du risque psychosocial ?",
    options: ["Jamais", "Nous supposons qu'il est faible", "Nous l'avons estimé une fois", "Nous le suivons chaque année", "Nous le pilotons comme un indicateur économique en direct"],
  },
  {
    id: "q9",
    category: "Préparation du leadership",
    text: "Dans quelle mesure les managers sont-ils outillés pour agir sur les signaux de risque précoces ?",
    options: ["Pas du tout", "Uniquement en réaction", "Formés mais sans données", "Données + plans d'action", "Signaux en temps réel + actions guidées"],
  },
  {
    id: "q10",
    category: "Préparation du leadership",
    text: "Le bien-être des effectifs est-il lié à la responsabilité des dirigeants et aux KPI ?",
    options: ["Non", "Mentionné dans les valeurs", "Suivi de façon informelle", "Un sujet au niveau du conseil", "Un KPI avec des responsables et des objectifs"],
  },
];

const CATEGORIES: RiskCategory[] = [
  "Risque d'épuisement",
  "Risque de rotation",
  "Visibilité organisationnelle",
  "Maturité de l'intelligence des effectifs",
  "Préparation du leadership",
];

// Visibility & Maturity weighted higher — they predict capacity to act.
const WEIGHTS: Record<RiskCategory, number> = {
  "Risque d'épuisement": 1,
  "Risque de rotation": 1,
  "Visibilité organisationnelle": 1.25,
  "Maturité de l'intelligence des effectifs": 1.25,
  "Préparation du leadership": 1.15,
};

export interface ScanResult {
  overall: number; // 0–100 (higher = more mature / lower risk)
  band: "Critique" | "Élevé" | "En développement" | "Mature";
  categories: { category: RiskCategory; score: number }[];
  weakest: RiskCategory[];
  recommendations: string[];
}

const RECOMMENDATIONS: Record<RiskCategory, string> = {
  "Risque d'épuisement":
    "Déployez des signaux continus d'exposition à l'épuisement afin de voir la surcharge monter des semaines avant les démissions — et non après.",
  "Risque de rotation":
    "Passez des entretiens de départ à des indicateurs avancés de risque de départ, classés par équipe, pour rendre la rétention proactive.",
  "Visibilité organisationnelle":
    "Affichez des indices de risque psychosocial normalisés sur le tableau de bord de la direction afin que le risque soit visible au niveau du conseil, en continu.",
  "Maturité de l'intelligence des effectifs":
    "Quantifiez le coût économique du risque psychosocial comme un indicateur en direct pour ancrer les décisions RH dans leur impact financier.",
  "Préparation du leadership":
    "Outillez les managers avec des signaux en temps réel et des actions guidées, et liez le bien-être aux KPI des dirigeants avec des responsables désignés.",
};

export function scoreScan(answers: Record<string, number>): ScanResult {
  const byCat: Record<RiskCategory, number[]> = {
    "Risque d'épuisement": [],
    "Risque de rotation": [],
    "Visibilité organisationnelle": [],
    "Maturité de l'intelligence des effectifs": [],
    "Préparation du leadership": [],
  };
  for (const q of SCAN_QUESTIONS) {
    const v = answers[q.id];
    if (typeof v === "number") byCat[q.category].push(v);
  }

  const categories = CATEGORIES.map((category) => {
    const vals = byCat[category];
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0; // 0–4
    return { category, score: Math.round((avg / 4) * 100) };
  });

  const totalWeight = CATEGORIES.reduce((s, c) => s + WEIGHTS[c], 0);
  const overall = Math.round(
    categories.reduce((s, c) => s + c.score * WEIGHTS[c.category], 0) / totalWeight,
  );

  const band =
    overall >= 80 ? "Mature" : overall >= 60 ? "En développement" : overall >= 40 ? "Élevé" : "Critique";

  const weakest = [...categories]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((c) => c.category);

  return {
    overall,
    band,
    categories,
    weakest,
    recommendations: weakest.map((c) => RECOMMENDATIONS[c]),
  };
}
