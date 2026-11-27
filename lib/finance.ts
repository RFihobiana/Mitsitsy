export type Kind = "need" | "want";

export interface Goal {
  name: string;
  target: number;
  saved: number;
}

export interface Expense {
  id: string;
  label: string;
  amount: number;
  kind: Kind;
  template?: boolean; // added by the suggestions, replaced when applied again
}

export interface FinanceState {
  salary: number;
  savingsPercent: number;
  goal: Goal;
  expenses: Expense[];
  placeId: string; // "" = not chosen
  tier: number; // used when placeId is "other"
  currency: string;
}

export const DEFAULT_STATE: FinanceState = {
  salary: 0,
  savingsPercent: 20,
  goal: { name: "", target: 0, saved: 0 },
  expenses: [],
  placeId: "",
  tier: 3,
  currency: "Ar",
};

export function money(value: number, lang: string, currency = "Ar"): string {
  const locale = lang === "en" ? "en-US" : "fr-FR";
  const n = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );
  const c = currency.trim();
  return c ? `${n} ${c}` : n;
}

export function daysLeftInMonth(now = new Date()): number {
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return last - now.getDate() + 1;
}

export function compute(s: FinanceState) {
  const toSave = (s.salary * s.savingsPercent) / 100;
  const spendable = s.salary - toSave;
  const need = s.expenses
    .filter((e) => e.kind === "need")
    .reduce((a, e) => a + e.amount, 0);
  const want = s.expenses
    .filter((e) => e.kind === "want")
    .reduce((a, e) => a + e.amount, 0);
  const spent = need + want;
  const left = spendable - spent;
  const days = daysLeftInMonth();
  const perDay = left > 0 ? left / days : 0;
  const remainingGoal = Math.max(0, s.goal.target - s.goal.saved);
  const monthsToGoal =
    toSave > 0 && remainingGoal > 0 ? Math.ceil(remainingGoal / toSave) : 0;
  const goalPercent =
    s.goal.target > 0 ? Math.min(100, (s.goal.saved / s.goal.target) * 100) : 0;
  return {
    toSave,
    spendable,
    need,
    want,
    spent,
    left,
    days,
    perDay,
    remainingGoal,
    monthsToGoal,
    goalPercent,
  };
}

export interface Duration {
  unit: "day" | "month" | "year";
  value: number;
}

/** Time to reach the goal: days (< 1 month), months (up to 12), then years. */
export function goalDuration(
  remaining: number,
  toSave: number,
): Duration | null {
  if (remaining <= 0 || toSave <= 0) return null;
  const months = remaining / toSave;
  if (months < 1)
    return { unit: "day", value: Math.max(1, Math.ceil(months * 30)) };
  if (months <= 12) return { unit: "month", value: Math.ceil(months) };
  return { unit: "year", value: Math.ceil((months / 12) * 10) / 10 }; // one decimal, rounded up
}

/** Cumulative savings per month, capped at the target (max 12 months shown). */
export function projection(
  s: FinanceState,
  toSave: number,
  monthsToGoal: number,
): number[] {
  if (s.goal.target <= 0) return [];
  const months = Math.min(12, Math.max(monthsToGoal, 1));
  return Array.from({ length: months + 1 }, (_, i) =>
    Math.min(s.goal.target, s.goal.saved + toSave * i),
  );
}
