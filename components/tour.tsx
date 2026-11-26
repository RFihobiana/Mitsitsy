"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MousePointerClick,
  PartyPopper,
} from "lucide-react";
import { CryptoDemo } from "@/components/crypto-demo";
import { Dashboard } from "@/components/dashboard";
import { Button, buttonVariants } from "@/components/ui/button";
import { DEFAULT_STATE, type FinanceState } from "@/lib/finance";
import { useI18n } from "@/lib/i18n";
import { STEP_META, STEP_TEXT, autofill, isDone } from "@/lib/tutorial-content";
import { cn } from "@/lib/utils";

const PANEL =
  "rounded-xl border border-primary/30 bg-card shadow-xl shadow-black/20";

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

  // Highlight the target of the current step and bring it into view.
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
    el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
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
    <div className="lg:grid lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start lg:gap-8">
      {/* Coach: top of the page on phones (pinned), left column on desktop (pinned) */}
      <aside className="sticky top-2 z-30 mb-5 lg:top-4 lg:mb-0">
        {finished || !meta || !text ? (
          <div className={cn(PANEL, "animate-pop p-6 text-center")}>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <PartyPopper className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              {t("tutorialFinishTitle")}
            </h2>
            <p className="mt-2 leading-relaxed text-foreground/85">
              {t("tutorialFinishText")}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link
                href="/"
                className={buttonVariants({ className: "h-11 px-5 text-base" })}
              >
                {t("tutorialStart")}
              </Link>
              <Button
                variant="outline"
                className="h-11 px-5 text-base"
                onClick={restart}
              >
                {t("tutorialRestart")}
              </Button>
            </div>
          </div>
        ) : (
          <div className={PANEL}>
            <div key={index} className="grid animate-pop gap-3 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div
                  className="flex items-center gap-1.5"
                  role="img"
                  aria-label={t("tutorialStep", { n: index + 1, total })}
                >
                  {STEP_META.map((s, i) => (
                    <span
                      key={s.id}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === index
                          ? "w-6 bg-primary"
                          : i < index
                            ? "w-1.5 bg-primary/60"
                            : "w-1.5 bg-muted-foreground/30",
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {t("tutorialStep", { n: index + 1, total })}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <h2 className="pt-0.5 text-xl font-semibold leading-tight tracking-tight">
                  {text.title}
                </h2>
              </div>

              {/* Desktop: explanation always visible. Phones: tap to expand, to save space. */}
              <p className="hidden text-[15px] leading-relaxed text-foreground/85 lg:block">
                {text.text}
              </p>
              <details className="group lg:hidden">
                <summary className="cursor-pointer list-none text-sm font-medium text-primary underline-offset-4 hover:underline">
                  {t("tutorialExplain")}
                </summary>
                <p className="mt-2 text-[15px] leading-relaxed text-foreground/85">
                  {text.text}
                </p>
              </details>

              {text.task && (
                <div
                  className={cn(
                    "rounded-lg border p-3 transition-colors",
                    done
                      ? "border-primary bg-primary/15"
                      : "border-primary/30 bg-primary/10",
                  )}
                >
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                    {done ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <MousePointerClick className="h-3.5 w-3.5" />
                    )}
                    {done ? t("tutorialDone") : t("tutorialYourTurn")}
                  </p>
                  <p className="text-base font-medium leading-snug">
                    {done ? t("tutorialWellDone") : text.task}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <Button
                  variant="ghost"
                  onClick={() => setIndex(index - 1)}
                  disabled={index === 0}
                >
                  <ChevronLeft className="h-4 w-4" /> {t("tutorialPrev")}
                </Button>
                <div className="flex items-center gap-2">
                  {!done && text.task && (
                    <Button variant="outline" onClick={helper}>
                      {meta.id === "crypto"
                        ? t("tutorialSkip")
                        : t("tutorialDoIt")}
                    </Button>
                  )}
                  <Button
                    className="h-11 px-5 text-base"
                    onClick={() => setIndex(index + 1)}
                    disabled={!done}
                  >
                    {t("tutorialNext")} <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Practice area: the real interface, clearly framed */}
      <div className="min-w-0">
        <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          {t("tutorialPractice")}
        </p>
        <div className="rounded-xl border border-dashed border-primary/30 p-3 sm:p-4">
          <Dashboard sandbox={{ state, setState }} />
          <div className="mt-5">
            <CryptoDemo state={state} onAttempt={() => setAttempted(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}
