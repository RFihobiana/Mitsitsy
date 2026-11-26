import { compute, type FinanceState } from "@/lib/finance";
import type { Lang } from "@/lib/i18n";

export type StepId =
  | "salary"
  | "share"
  | "need"
  | "want"
  | "overview"
  | "goal"
  | "addmonth"
  | "crypto"
  | "locks"
  | "privacy";

/** Practice values the learner is asked to enter. */
export const PRACTICE = {
  salary: 600000,
  share: 30,
  goal: 1000000,
  need: { label: "Transport", amount: 50000 },
  want: { label: "Cinema", amount: 20000 },
};

/** `target` matches a data-tour attribute in the UI ("" = nothing highlighted). */
export const STEP_META: { id: StepId; target: string }[] = [
  { id: "salary", target: "salary" },
  { id: "share", target: "share" },
  { id: "need", target: "expense-form" },
  { id: "want", target: "expense-form" },
  { id: "overview", target: "overview" },
  { id: "goal", target: "goal" },
  { id: "addmonth", target: "addmonth" },
  { id: "crypto", target: "crypto" },
  { id: "locks", target: "settings" },
  { id: "privacy", target: "" },
];

export function isDone(
  id: StepId,
  s: FinanceState,
  attempted: boolean,
): boolean {
  switch (id) {
    case "salary":
      return s.salary === PRACTICE.salary;
    case "share":
      return s.savingsPercent === PRACTICE.share;
    case "need":
      return s.expenses.some(
        (e) => e.kind === "need" && e.amount === PRACTICE.need.amount,
      );
    case "want":
      return s.expenses.some(
        (e) => e.kind === "want" && e.amount === PRACTICE.want.amount,
      );
    case "goal":
      return s.goal.target === PRACTICE.goal;
    case "addmonth":
      return s.goal.saved > 0;
    case "crypto":
      return attempted;
    default:
      return true; // information-only steps
  }
}

/** "Do it for me": applies the practice value so later steps still make sense. */
export function autofill(id: StepId, s: FinanceState): FinanceState {
  const add = (
    kind: "need" | "want",
    p: { label: string; amount: number },
  ): FinanceState =>
    isDone(id, s, false)
      ? s
      : {
          ...s,
          expenses: [
            { id: crypto.randomUUID(), label: p.label, amount: p.amount, kind },
            ...s.expenses,
          ],
        };

  switch (id) {
    case "salary":
      return { ...s, salary: PRACTICE.salary };
    case "share":
      return { ...s, savingsPercent: PRACTICE.share };
    case "need":
      return add("need", PRACTICE.need);
    case "want":
      return add("want", PRACTICE.want);
    case "goal":
      return {
        ...s,
        goal: {
          ...s.goal,
          name: s.goal.name || "Laptop",
          target: PRACTICE.goal,
        },
      };
    case "addmonth":
      return {
        ...s,
        goal: { ...s.goal, saved: s.goal.saved + compute(s).toSave },
      };
    default:
      return s;
  }
}

export interface StepText {
  title: string;
  text: string;
  task?: string;
}

export const STEP_TEXT: Record<Lang, Record<StepId, StepText>> = {
  en: {
    salary: {
      title: "Enter your salary",
      text: "This is your monthly income. Everything else is calculated from it.",
      task: "Type 600000 in the salary field. It is a practice amount.",
    },
    share: {
      title: "Choose what to save first",
      text: "The slider sets the share of your salary you put aside on payday. The “Set aside” amount updates instantly, and you only spend the rest.",
      task: "Move the slider to 30%.",
    },
    need: {
      title: "Add a need",
      text: "Needs are things you cannot skip, like transport or food. Every expense lowers what is left to spend.",
      task: "Type Transport, amount 50000, keep Need selected, then press Add.",
    },
    want: {
      title: "Add a want",
      text: "Wants are optional extras. If you go over budget, cut a want, never your savings.",
      task: "Type Cinema, amount 20000, choose Want, then press Add.",
    },
    overview: {
      title: "Read your month",
      text: "“Left to spend” is what remains after savings and expenses. “Per day” is that amount divided by the days left in the month. The donut shows where your salary goes.",
    },
    goal: {
      title: "Set a savings goal",
      text: "Give Mitsitsy a target and it estimates how long it takes at your saving rate, in days, months or years.",
      task: "Type 1000000 in Target amount.",
    },
    addmonth: {
      title: "Record your savings",
      text: "When payday comes and you set the money aside, press the button to add it to your goal. The chart shows your progress.",
      task: "Press the button to add this month’s savings.",
    },
    crypto: {
      title: "Your data is encrypted",
      text: "With a passphrase, your data is encrypted on this device (AES-256). The passphrase is never stored or sent, so nobody can recover it for you, not even us.",
      task: "In the practice box, type any passphrase of 10+ characters, press Encrypt, then try unlocking with a right and a wrong one.",
    },
    locks: {
      title: "It locks itself",
      text: "The app locks after inactivity and when you leave it. Wrong passphrases cause a growing delay. In Settings you can change the delay, the passphrase and the language.",
    },
    privacy: {
      title: "Private, backed up, offline",
      text: "No account and no server for your data: only anonymous visit counts are collected. Export an encrypted backup in Settings, since a forgotten passphrase cannot be recovered. After your first visit, the app works offline and can be installed.",
    },
  },
  fr: {
    salary: {
      title: "Saisissez votre salaire",
      text: "C’est votre revenu mensuel. Tout le reste en est calculé.",
      task: "Tapez 600000 dans le champ du salaire. C’est un montant d’exercice.",
    },
    share: {
      title: "Choisissez ce que vous épargnez d’abord",
      text: "Le curseur règle la part de votre salaire mise de côté dès la paie. Le montant « à mettre de côté » se met à jour tout de suite, et vous ne dépensez que le reste.",
      task: "Déplacez le curseur sur 30 %.",
    },
    need: {
      title: "Ajoutez un besoin",
      text: "Les besoins sont ce qu’on ne peut pas éviter, comme le transport ou la nourriture. Chaque dépense réduit ce qui reste à dépenser.",
      task: "Tapez Transport, montant 50000, gardez Besoin, puis appuyez sur Ajouter.",
    },
    want: {
      title: "Ajoutez une envie",
      text: "Les envies sont des extras facultatifs. Si vous dépassez le budget, réduisez une envie, jamais votre épargne.",
      task: "Tapez Cinema, montant 20000, choisissez Envie, puis appuyez sur Ajouter.",
    },
    overview: {
      title: "Lisez votre mois",
      text: "« Reste à dépenser » est ce qui reste après l’épargne et les dépenses. « Par jour » est ce montant divisé par les jours restants du mois. Le graphique en anneau montre où va votre salaire.",
    },
    goal: {
      title: "Fixez un objectif d’épargne",
      text: "Donnez un montant visé : Mitsitsy estime le temps nécessaire à votre rythme d’épargne, en jours, mois ou années.",
      task: "Tapez 1000000 dans « Montant visé ».",
    },
    addmonth: {
      title: "Enregistrez votre épargne",
      text: "Quand la paie arrive et que vous mettez l’argent de côté, appuyez sur le bouton pour l’ajouter à votre objectif. Le graphique montre votre progression.",
      task: "Appuyez sur le bouton pour ajouter l’épargne de ce mois.",
    },
    crypto: {
      title: "Vos données sont chiffrées",
      text: "Avec une phrase secrète, vos données sont chiffrées sur cet appareil (AES-256). Elle n’est jamais stockée ni envoyée : personne ne peut la récupérer pour vous, pas même nous.",
      task: "Dans la zone d’exercice, tapez une phrase secrète d’au moins 10 caractères, appuyez sur Chiffrer, puis essayez de déverrouiller avec la bonne et avec une mauvaise.",
    },
    locks: {
      title: "Se verrouille tout seul",
      text: "L’application se verrouille après un temps d’inactivité et quand vous la quittez. Les mauvaises phrases secrètes déclenchent un délai croissant. Dans les Réglages, vous changez le délai, la phrase secrète et la langue.",
    },
    privacy: {
      title: "Privé, sauvegardé, hors ligne",
      text: "Pas de compte ni de serveur pour vos données : seuls des comptages de visites anonymes sont collectés. Exportez une sauvegarde chiffrée dans les Réglages, car une phrase secrète oubliée est irrécupérable. Après votre première visite, l’application fonctionne hors ligne et peut être installée.",
    },
  },
  mg: {
    salary: {
      title: "Ampidiro ny karamanao",
      text: "Io no vola miditra isam-bolana. Avy amin’izany ny zavatra rehetra hafa no kajiana.",
      task: "Soraty 600000 ao amin’ny saha karama. Vola fampiharana ihany izany.",
    },
    share: {
      title: "Fidio ny hotehirizina aloha",
      text: "Ny slider no mametraka ny anjara karama apetrakao rehefa mandray karama. Miova avy hatrany ny vola « hotehirizina », ary ny sisa ihany no andaniana.",
      task: "Alefaso amin’ny 30% ny slider.",
    },
    need: {
      title: "Ampio filàna",
      text: "Ny filàna dia ireo tsy azo ihodivirana, toy ny fitaterana na ny sakafo. Mampihena ny sisa handaniana ny fandaniana rehetra.",
      task: "Soraty hoe Transport, vola 50000, avelao ho Filàna, ary tsindrio ny Ampio.",
    },
    want: {
      title: "Ampio faniriana",
      text: "Ny faniriana dia fanampiny azo tsy atao. Raha mihoatra ny teti-bola ianao, ahena ny faniriana, fa tsy ny fitehirizana.",
      task: "Soraty hoe Cinema, vola 20000, fidio ny Faniriana, ary tsindrio ny Ampio.",
    },
    overview: {
      title: "Vakio ny volanao",
      text: "Ny « sisa handaniana » dia ny sisa aorian’ny fitehirizana sy ny fandaniana. Ny « isan’andro » dia io vola io zaraina amin’ny andro sisa amin’ny volana. Ny sary boribory no mampiseho ny fizaran’ny karamanao.",
    },
    goal: {
      title: "Mametraha tanjona fitehirizana",
      text: "Omeo vola tiana ho tratra ny Mitsitsy dia hanombanana ny fotoana ilaina araka ny fitehirizanao, amin’ny andro, volana na taona.",
      task: "Soraty 1000000 ao amin’ny « Vola tiana ho tratra ».",
    },
    addmonth: {
      title: "Soraty ny fitehirizanao",
      text: "Rehefa tonga ny karama ary natokanao ny vola, tsindrio ny bokotra hanampiana azy amin’ny tanjona. Ny sary no mampiseho ny fandrosoanao.",
      task: "Tsindrio ny bokotra hanampiana ny fitehirizan’ity volana ity.",
    },
    crypto: {
      title: "Voasoratra mafina ny angonao",
      text: "Miaraka amin’ny teny miafina, voasoratra mafina ao amin’ity fitaovana ity ny angonao (AES-256). Tsy tehirizina na alefa mihitsy izany: tsy misy afaka mamerina azy ho anao, na izahay aza.",
      task: "Ao amin’ny faritra fampiharana, soraty teny miafina misy 10 tarehintsoratra farafahakeliny, tsindrio ny Asio fanafenana, dia andramo ny hanokatra amin’ny marina sy ny diso.",
    },
    locks: {
      title: "Mihidy irery",
      text: "Mihidy ny rindrambaiko rehefa tsy ampiasaina sy rehefa avelanao. Ny teny miafina diso dia mitarika fiandrasana mitombo. Ao amin’ny Fandrindrana no ahafahanao manova ny fotoana, ny teny miafina ary ny fiteny.",
    },
    privacy: {
      title: "Tsiambaratelo, backup, tsy misy internet",
      text: "Tsy misy kaonty na serivera ho an’ny angonao: kajy fitsidihana tsy fantatra anarana ihany no angonina. Avoaka backup voasoratra mafina ao amin’ny Fandrindrana, satria tsy azo averina ny teny miafina adino. Aorian’ny fitsidihanao voalohany, mandeha tsy misy internet ny rindrambaiko ary azo apetraka.",
    },
  },
};
