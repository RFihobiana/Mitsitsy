"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { CryptoDemo } from "@/components/crypto-demo";
import { Dashboard } from "@/components/dashboard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_STATE, type FinanceState } from "@/lib/finance";
import { useI18n } from "@/lib/i18n";
import { STEP_META, STEP_TEXT, autofill, isDone } from "@/lib/tutorial-content";

export function Tour() {
  const { t, lang } = useI18n();
  const [state, setState] = useState<FinanceState>(DEFAULT_STATE); // practice data only, never saved
  const [attempted, setAttempted] = useState(false);
  const [index, setIndex] = useState(0);

  const total = STEP_META.length;
  const finished = index >= total;
  const meta = finished ? null : STEP_META[index];
  const text = meta ? STEP_TEXT[lang][meta.id] : null;
  const done = meta ? isDone(meta.id, state, attempted) : true;

  // Highlight the target element of the current step and bring it into view.
  useEffect(() => {
    if (!meta?.target) return;
    const el = document.querySelector<HTMLElement>(
      `[data-tour="${meta.target}"]`,
    );
    if (!el) return;
    el.classList.add("tour-highlight");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({
      block: "center",
      behavior: reduce ? "auto" : "smooth",
    });
    return () => el.classList.remove("tour-highlight");
  }, [meta?.target, index]);

  const restart = () => {
    setState(DEFAULT_STATE);
    setAttempted(false);
    setIndex(0);
  };

  const helper = () => {
    if (!meta) return;
    if (meta.id === "crypto") setIndex(index + 1);
    else setState(autofill(meta.id, state));
  };

  return (
    <div>
      <p className="mb-4 rounded-md border border-primary/40 px-3 py-2 text-sm text-primary">
        {t("tutorialPractice")}
      </p>

      <Dashboard sandbox={{ state, setState }} />
      <div className="mt-5">
        <CryptoDemo state={state} onAttempt={() => setAttempted(true)} />
      </div>

      <div
        className="sticky bottom-3 z-20 mt-6"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <Card className="border-primary/40 shadow-lg">
          <CardContent className="grid gap-3 pt-5">
            {finished || !meta || !text ? (
              <>
                <h2 className="text-lg font-semibold">
                  {t("tutorialFinishTitle")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("tutorialFinishText")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/" className={buttonVariants()}>
                    {t("tutorialStart")}
                  </Link>
                  <Button variant="outline" onClick={restart}>
                    {t("tutorialRestart")}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(index / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {t("tutorialStep", { n: index + 1, total })}
                  </span>
                </div>
                <h2 className="text-lg font-semibold tracking-tight">
                  {text.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {text.text}
                </p>
                {text.task && (
                  <p className="flex items-start gap-2 rounded-md bg-muted p-2.5 text-sm font-medium">
                    {done && (
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        aria-label={t("tutorialDone")}
                      />
                    )}
                    <span>{text.task}</span>
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIndex(index - 1)}
                    disabled={index === 0}
                  >
                    {t("tutorialPrev")}
                  </Button>
                  <div className="flex gap-2">
                    {!done && text.task && (
                      <Button variant="ghost" onClick={helper}>
                        {meta.id === "crypto"
                          ? t("tutorialSkip")
                          : t("tutorialDoIt")}
                      </Button>
                    )}
                    <Button
                      onClick={() => setIndex(index + 1)}
                      disabled={!done}
                    >
                      {t("tutorialNext")}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
