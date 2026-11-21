"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr" | "mg";
export const LANGS: Lang[] = ["en", "fr", "mg"];

const en = {
  tag: "Pay yourself first",
  heroTitle: "The smartest way to keep your salary.",
  heroText:
    "Mitsitsy puts your savings above everything else: before rent, before shopping, before anything. You save first, spend what is left, and watch your goals come closer every month.",
  salary: "Monthly salary (Ar)",
  savingsShare: "Share to save: {pct}%",
  saveFirst: "Set aside on payday",
  toSpend: "To spend",
  salaryShort: "Salary",
  overview: "This month",
  spent: "Spent",
  left: "Left to spend",
  perDay: "Per day",
  daysLeft: "{n} days left",
  overspent: "You are {amount} over budget. Cut a want, not your savings.",
  expensePlaceholder: "Expense (e.g. transport)",
  amount: "Amount",
  need: "Need",
  want: "Want",
  add: "Add",
  remove: "Remove",
  noExpenses: "No expenses yet. Add the first one above.",
  newMonth: "Start a new month",
  goalTitle: "Savings goal",
  goalFor: "What for?",
  goalForPlaceholder: "e.g. laptop",
  goalTarget: "Target amount (Ar)",
  goalSaved: "Already saved (Ar)",
  goalRemaining: "{remaining} to go. At {rate} per month, you get there in {months} months.",
  goalReached: "Goal reached. Well done!",
  goalHint: "Enter your salary and a savings share to estimate the time.",
  addMonth: "Add this month's savings ({amount})",
  chartSplit: "Where your salary goes",
  chartGoal: "Road to your goal",
  chartGoalEmpty: "Set a goal to see the projection.",
  monthShort: "m",
  legendSave: "Savings",
  legendNeed: "Needs",
  legendWant: "Wants",
  legendLeft: "Left",
  theme: "Switch theme",
  language: "Language",
  footer: "Your data stays in this browser.",
};

export type Key = keyof typeof en;
type Dict = Record<Key, string>;

const fr: Dict = {
  tag: "Épargnez d’abord",
  heroTitle: "La façon la plus intelligente de garder votre salaire.",
  heroText:
    "Mitsitsy place votre épargne au-dessus de tout : avant le loyer, avant les achats, avant le reste. Vous épargnez d’abord, vous dépensez ce qui reste, et vos objectifs se rapprochent chaque mois.",
  salary: "Salaire mensuel (Ar)",
  savingsShare: "Part à épargner : {pct} %",
  saveFirst: "À mettre de côté dès la paie",
  toSpend: "À dépenser",
  salaryShort: "Salaire",
  overview: "Ce mois-ci",
  spent: "Dépensé",
  left: "Reste à dépenser",
  perDay: "Par jour",
  daysLeft: "{n} jours restants",
  overspent: "Vous dépassez votre budget de {amount}. Réduisez une envie, pas votre épargne.",
  expensePlaceholder: "Dépense (ex. transport)",
  amount: "Montant",
  need: "Besoin",
  want: "Envie",
  add: "Ajouter",
  remove: "Supprimer",
  noExpenses: "Aucune dépense pour l’instant. Ajoutez la première ci-dessus.",
  newMonth: "Commencer un nouveau mois",
  goalTitle: "Objectif d’épargne",
  goalFor: "Pour quoi ?",
  goalForPlaceholder: "ex. ordinateur portable",
  goalTarget: "Montant visé (Ar)",
  goalSaved: "Déjà épargné (Ar)",
  goalRemaining: "Il reste {remaining}. À {rate} par mois, vous y arrivez en {months} mois.",
  goalReached: "Objectif atteint. Bravo !",
  goalHint: "Saisissez votre salaire et une part d’épargne pour estimer la durée.",
  addMonth: "Ajouter l’épargne de ce mois ({amount})",
  chartSplit: "Où va votre salaire",
  chartGoal: "Chemin vers votre objectif",
  chartGoalEmpty: "Définissez un objectif pour voir la projection.",
  monthShort: "m",
  legendSave: "Épargne",
  legendNeed: "Besoins",
  legendWant: "Envies",
  legendLeft: "Reste",
  theme: "Changer de thème",
  language: "Langue",
  footer: "Vos données restent dans ce navigateur.",
};

const mg: Dict = {
  tag: "Mitahiry aloha",
  heroTitle: "Ny fomba mahay indrindra hitahiry ny karamanao.",
  heroText:
    "Ny Mitsitsy dia mametraka ny fitehirizanao ho ambonin’ny zavatra rehetra: alohan’ny hofan-trano, alohan’ny fividianana, alohan’ny hafa rehetra. Mitahiry aloha ianao, mandany ny sisa, ary manakaiky ny tanjonao isam-bolana.",
  salary: "Karama isam-bolana (Ar)",
  savingsShare: "Anjara hotehirizina: {pct}%",
  saveFirst: "Hotehirizina rehefa mandray karama",
  toSpend: "Handaniana",
  salaryShort: "Karama",
  overview: "Ity volana ity",
  spent: "Efa nandany",
  left: "Sisa handaniana",
  perDay: "Isan’andro",
  daysLeft: "{n} andro sisa",
  overspent: "Mihoatra {amount} ny teti-bolanao. Ahena ny faniriana, fa aza ny fitehirizana.",
  expensePlaceholder: "Fandaniana (ohatra: fitaterana)",
  amount: "Vola",
  need: "Filàna",
  want: "Faniriana",
  add: "Ampio",
  remove: "Fafao",
  noExpenses: "Mbola tsy misy fandaniana. Ampio ny voalohany etsy ambony.",
  newMonth: "Manomboka volana vaovao",
  goalTitle: "Tanjona fitehirizana",
  goalFor: "Ho an’ny inona?",
  goalForPlaceholder: "ohatra: solosaina finday",
  goalTarget: "Vola tiana ho tratra (Ar)",
  goalSaved: "Efa voatahiry (Ar)",
  goalRemaining: "Mbola {remaining}. Raha {rate} isam-bolana ny fitehirizanao, ho tratra afaka {months} volana.",
  goalReached: "Tratra ny tanjona. Arahaba!",
  goalHint: "Ampidiro ny karama sy ny anjara hotehirizina mba hanombanana ny fotoana.",
  addMonth: "Ampio ny fitehirizan’ity volana ity ({amount})",
  chartSplit: "Ny fizaran’ny karamanao",
  chartGoal: "Lalana mankany amin’ny tanjona",
  chartGoalEmpty: "Mametraha tanjona mba hahitana ny tetika.",
  monthShort: "v",
  legendSave: "Fitehirizana",
  legendNeed: "Filàna",
  legendWant: "Faniriana",
  legendLeft: "Sisa",
  theme: "Hanova endrika",
  language: "Fiteny",
  footer: "Mijanona ao amin’ity navigateur ity ny angonao.",
};

const dictionaries: Record<Lang, Dict> = { en, fr, mg };

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);
const LANG_KEY = "mitsitsy:lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "fr" || saved === "mg") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "mg" ? "mg" : lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: Key, vars?: Record<string, string | number>) => {
      let text = dictionaries[lang][key];
      if (vars) for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
      return text;
    },
    [lang]
  );

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
