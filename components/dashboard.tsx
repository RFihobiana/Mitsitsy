"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { AnimatedNumber } from "@/components/animated-number";
import { DonutChart } from "@/components/donut-chart";
import { GoalChart } from "@/components/goal-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  compute,
  goalDuration,
  money,
  projection,
  type Expense,
  type Kind,
  type FinanceState,
} from "@/lib/finance";
import { useI18n, type Key } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useVault } from "@/lib/vault";
import { SuggestionsCard } from "@/components/suggestions-card";

const toNumber = (v: string) => Math.max(0, Number(v) || 0);

export function Dashboard({
  sandbox,
}: {
  sandbox?: { state: FinanceState; setState: (s: FinanceState) => void };
}) {
  const { t, lang } = useI18n();
  const vault = useVault();
  const { state, setState } = sandbox ?? vault;
  const fmt = (n: number) => money(n, lang, state.currency);
  const c = compute(state);
  const points = projection(state, c.toSave, c.monthsToGoal);

  const duration = goalDuration(c.remainingGoal, c.toSave);

  const durationText = (() => {
    if (!duration) return "";
    const locale = lang === "en" ? "en-US" : "fr-FR";
    const n = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    }).format(duration.value);
    // French uses the singular up to 2 ("1,5 an"); English only for exactly 1.
    const singular = lang === "fr" ? duration.value < 2 : duration.value === 1;
    const base =
      duration.unit === "day"
        ? "durationDay"
        : duration.unit === "month"
          ? "durationMonth"
          : "durationYear";
    return t((base + (singular ? "" : "s")) as Key, { n });
  })();

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState<Kind>("need");

  const addExpense = () => {
    const value = toNumber(amount);
    if (!label.trim() || value <= 0) return;
    const expense: Expense = {
      id: crypto.randomUUID(),
      label: label.trim(),
      amount: value,
      kind,
    };
    setState({ ...state, expenses: [expense, ...state.expenses] });
    setLabel("");
    setAmount("");
  };

  const overspent = c.left < 0;
  const segments = [
    { label: "save", value: c.toSave, color: "hsl(var(--save))" },
    { label: "need", value: c.need, color: "hsl(var(--need))" },
    { label: "want", value: c.want, color: "hsl(var(--want))" },
    { label: "left", value: Math.max(0, c.left), color: "hsl(var(--left))" },
  ];
  const legend = [
    { key: "legendSave", color: "bg-[hsl(var(--save))]", value: c.toSave },
    { key: "legendNeed", color: "bg-[hsl(var(--need))]", value: c.need },
    { key: "legendWant", color: "bg-[hsl(var(--want))]", value: c.want },
    {
      key: "legendLeft",
      color: "bg-[hsl(var(--left))]",
      value: Math.max(0, c.left),
    },
  ] as const;

  return (
    <div className={cn("grid gap-5", !sandbox && "lg:grid-cols-2")}>
      <div className="grid content-start gap-5">
        <Card>
          <CardContent className="grid gap-4 pt-5">
            <div className="grid gap-1.5" data-tour="salary">
              <Label htmlFor="salary">{t("salary")}</Label>
              <Input
                id="salary"
                type="number"
                inputMode="numeric"
                placeholder="600000"
                value={state.salary || ""}
                onChange={(e) =>
                  setState({ ...state, salary: toNumber(e.target.value) })
                }
              />
            </div>
            <div className="grid gap-1.5" data-tour="share">
              <Label htmlFor="pct">
                {t("savingsShare", { pct: state.savingsPercent })}
              </Label>
              <input
                id="pct"
                type="range"
                min={0}
                max={60}
                value={state.savingsPercent}
                onChange={(e) =>
                  setState({ ...state, savingsPercent: Number(e.target.value) })
                }
                className="h-2 w-full cursor-pointer accent-[hsl(var(--primary))]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-md bg-muted p-3 text-sm">
              <div>
                <p className="text-muted-foreground">{t("saveFirst")}</p>
                <p className="text-xl font-semibold text-primary">
                  <AnimatedNumber value={c.toSave} format={fmt} />
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("toSpend")}</p>
                <p className="text-xl font-semibold">
                  <AnimatedNumber value={c.spendable} format={fmt} />
                </p>
              </div>
            </div>
          </CardContent>
          {!sandbox && <SuggestionsCard state={state} setState={setState} />}
        </Card>

        <Card data-tour="overview">
          <CardHeader>
            <CardTitle>{t("overview")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">{t("spent")}</p>
                <p className="font-semibold">
                  <AnimatedNumber value={c.spent} format={fmt} />
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("left")}</p>
                <p
                  className={cn(
                    "font-semibold",
                    overspent && "text-destructive",
                  )}
                >
                  <AnimatedNumber value={c.left} format={fmt} />
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("perDay")}</p>
                <p className="font-semibold">
                  <AnimatedNumber value={c.perDay} format={fmt} />
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("daysLeft", { n: c.days })}
                </p>
              </div>
            </div>

            {overspent && (
              <p className="animate-pop rounded-md border border-destructive/40 p-3 text-sm text-destructive">
                {t("overspent", { amount: fmt(-c.left) })}
              </p>
            )}

            <form
              data-tour="expense-form"
              className="grid grid-cols-2 gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                addExpense();
              }}
            >
              <Input
                className="col-span-2 sm:col-span-1"
                placeholder={t("expensePlaceholder")}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
              <Input
                type="number"
                inputMode="numeric"
                placeholder={t("amount")}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as Kind)}
                className="h-10 rounded-md border border-input bg-card px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="need">{t("need")}</option>
                <option value="want">{t("want")}</option>
              </select>
              <Button type="submit">{t("add")}</Button>
            </form>

            {state.expenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noExpenses")}</p>
            ) : (
              <ul>
                {state.expenses.map((e) => (
                  <li
                    key={e.id}
                    className="flex animate-pop items-center justify-between gap-3 border-t py-2.5 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          e.kind === "need"
                            ? "bg-[hsl(var(--need))]"
                            : "bg-[hsl(var(--want))]",
                        )}
                      />
                      {e.label}
                      <span className="text-xs text-muted-foreground">
                        {t(e.kind)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      {fmt(e.amount)}
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`${t("remove")} ${e.label}`}
                        onClick={() =>
                          setState({
                            ...state,
                            expenses: state.expenses.filter(
                              (x) => x.id !== e.id,
                            ),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {state.expenses.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setState({ ...state, expenses: [] })}
              >
                {t("newMonth")}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid content-start gap-5">
        <Card>
          <CardHeader>
            <CardTitle>{t("chartSplit")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <DonutChart
              segments={segments}
              center={
                <>
                  <span className="text-xs text-muted-foreground">
                    {t("salaryShort")}
                  </span>
                  <span className="text-lg font-semibold">
                    <AnimatedNumber value={state.salary} format={fmt} />
                  </span>
                </>
              }
            />
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {legend.map((l) => (
                <li key={l.key} className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", l.color)} />
                  <span className="text-muted-foreground">{t(l.key)}</span>
                  <span className="ml-auto font-medium">{fmt(l.value)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card data-tour="goal">
          <CardHeader>
            <CardTitle>{t("goalTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="goal-name">{t("goalFor")}</Label>
                <Input
                  id="goal-name"
                  placeholder={t("goalForPlaceholder")}
                  value={state.goal.name}
                  onChange={(e) =>
                    setState({
                      ...state,
                      goal: { ...state.goal, name: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="goal-target">{t("goalTarget")}</Label>
                <Input
                  id="goal-target"
                  type="number"
                  inputMode="numeric"
                  value={state.goal.target || ""}
                  onChange={(e) =>
                    setState({
                      ...state,
                      goal: { ...state.goal, target: toNumber(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="goal-saved">{t("goalSaved")}</Label>
                <Input
                  id="goal-saved"
                  type="number"
                  inputMode="numeric"
                  value={state.goal.saved || ""}
                  onChange={(e) =>
                    setState({
                      ...state,
                      goal: { ...state.goal, saved: toNumber(e.target.value) },
                    })
                  }
                />
              </div>
            </div>

            <p className="text-sm font-medium">{t("chartGoal")}</p>
            {points.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("chartGoalEmpty")}
              </p>
            ) : (
              <>
                <GoalChart
                  points={points}
                  target={state.goal.target}
                  format={fmt}
                  monthLabel={t("monthShort")}
                />
                <p className="text-sm">
                  {c.remainingGoal === 0
                    ? t("goalReached")
                    : c.monthsToGoal > 0
                      ? t("goalRemaining", {
                          remaining: fmt(c.remainingGoal),
                          rate: fmt(c.toSave),
                          duration: durationText,
                        })
                      : t("goalHint")}
                </p>
                {c.toSave > 0 && c.remainingGoal > 0 && (
                  <Button
                    data-tour="addmonth"
                    onClick={() =>
                      setState({
                        ...state,
                        goal: {
                          ...state.goal,
                          saved: state.goal.saved + c.toSave,
                        },
                      })
                    }
                  >
                    {t("addMonth", { amount: fmt(c.toSave) })}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
