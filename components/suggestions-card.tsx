"use client";

import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { compute, money, type Expense, type FinanceState } from "@/lib/finance";
import { useI18n, type Key } from "@/lib/i18n";
import {
  MADAGASCAR_PLACES,
  OTHER_ID,
  suggest,
  type Tier,
} from "@/lib/suggestions";
import { cn } from "@/lib/utils";

const selectClass =
  "h-10 w-full rounded-md border border-input bg-card px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SuggestionsCard({
  state,
  setState,
}: {
  state: FinanceState;
  setState: (s: FinanceState) => void;
}) {
  const { t, lang } = useI18n();
  const fmt = (n: number) => money(n, lang, state.currency);
  const c = compute(state);

  const isOther = state.placeId === OTHER_ID;
  const place = MADAGASCAR_PLACES.find((p) => p.id === state.placeId);
  const tier = (isOther ? state.tier : place?.tier) as Tier | undefined;

  const items = tier && c.spendable > 0 ? suggest(c.spendable, tier) : [];
  const total = items.reduce((sum, i) => sum + i.amount, 0);
  const cushion = c.spendable - total;

  const choose = (id: string) =>
    setState({
      ...state,
      placeId: id,
      currency:
        id === OTHER_ID
          ? state.currency === "Ar"
            ? ""
            : state.currency
          : "Ar",
    });

  const apply = () => {
    const mine = state.expenses.filter((e) => !e.template);
    const created: Expense[] = items.map((i) => ({
      id: crypto.randomUUID(),
      label: t(i.key),
      amount: i.amount,
      kind: i.kind,
      template: true,
    }));
    setState({ ...state, expenses: [...created, ...mine] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" /> {t("suggestTitle")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("suggestIntro")}</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="place">{t("placeLabel")}</Label>
          <select
            id="place"
            value={state.placeId}
            onChange={(e) => choose(e.target.value)}
            className={selectClass}
          >
            <option value="">{t("placeChoose")}</option>
            <optgroup label={t("placeMadagascar")}>
              {MADAGASCAR_PLACES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameKey ? t(p.nameKey) : p.name}
                </option>
              ))}
            </optgroup>
            <option value={OTHER_ID}>{t("placeOther")}</option>
          </select>
        </div>

        {isOther && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="tier">{t("priceLevel")}</Label>
              <select
                id="tier"
                value={state.tier}
                onChange={(e) =>
                  setState({ ...state, tier: Number(e.target.value) })
                }
                className={selectClass}
              >
                {([1, 2, 3, 4, 5] as const).map((n) => (
                  <option key={n} value={n}>
                    {t(`price${n}` as Key)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="currency">{t("currencyLabel")}</Label>
              <Input
                id="currency"
                maxLength={6}
                placeholder="EUR"
                value={state.currency}
                onChange={(e) =>
                  setState({ ...state, currency: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {!tier ? null : c.spendable <= 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("suggestNeedSalary")}
          </p>
        ) : (
          <>
            <ul className="text-sm">
              {items.map((i) => (
                <li
                  key={i.key}
                  className="flex items-center justify-between gap-3 border-t py-2"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        i.kind === "need"
                          ? "bg-[hsl(var(--need))]"
                          : "bg-[hsl(var(--want))]",
                      )}
                    />
                    {t(i.key)}
                  </span>
                  <span className="font-medium">{fmt(i.amount)}</span>
                </li>
              ))}
            </ul>
            <div className="grid gap-1 rounded-md bg-muted p-3 text-sm">
              <p>{t("suggestTotal", { total: fmt(total) })}</p>
              <p className="text-primary">
                {t("suggestCushion", { cushion: fmt(cushion) })}
              </p>
            </div>
            <Button onClick={apply}>{t("suggestApply")}</Button>
            <p className="text-xs text-muted-foreground">{t("suggestNote")}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
