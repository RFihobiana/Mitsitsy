"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { SLIDES, SLIDE_ICONS } from "@/lib/tutorial-content";
import { cn } from "@/lib/utils";

const SLIDE_MS = 9000;

export function TutorialPlayer() {
  const { t, lang } = useI18n();
  const slides = SLIDES[lang];
  const last = slides.length - 1;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [reduced, setReduced] = useState(false);

  // With "reduce motion" there is no autoplay, only manual steps.
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReduced(reduce);
    setPlaying(!reduce);
  }, []);

  const go = (i: number) => {
    setIndex(Math.max(0, Math.min(last, i)));
    setFinished(false);
  };
  const onEnd = () => {
    if (index < last) setIndex(index + 1);
    else {
      setPlaying(false);
      setFinished(true);
    }
  };
  const toggle = () => {
    if (finished) {
      setIndex(0);
      setFinished(false);
      setPlaying(true);
    } else setPlaying(!playing);
  };

  const Icon = SLIDE_ICONS[index];
  const slide = slides[index];

  return (
    <div>
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex gap-1 px-4 pt-3">
          {slides.map((s, i) => {
            const active = i === index;
            const full = i < index || (active && reduced);
            const style = {
              width: full ? "100%" : "0%",
              "--slide-ms": `${SLIDE_MS}ms`,
              animationPlayState: playing ? "running" : "paused",
            } as CSSProperties;
            return (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`${t("tutorialStep", { n: i + 1, total: slides.length })}: ${s.title}`}
                className="flex-1 py-2"
              >
                <span className="block h-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className={cn(
                      "block h-full bg-primary",
                      active && !reduced && "animate-progress",
                    )}
                    style={style}
                    onAnimationEnd={active ? onEnd : undefined}
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div
          key={index}
          aria-live={playing ? "off" : "polite"}
          className="flex min-h-[280px] animate-fade-up flex-col items-center justify-center gap-4 px-6 py-8 text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Icon className="h-8 w-8" />
          </span>
          <h2 className="text-2xl font-semibold tracking-tight">
            {slide.title}
          </h2>
          <p className="max-w-lg leading-relaxed text-muted-foreground">
            {slide.text}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {t("tutorialStep", { n: index + 1, total: slides.length })}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label={t("tutorialPrev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {!reduced && (
            <Button
              size="icon"
              onClick={toggle}
              aria-label={
                finished
                  ? t("tutorialReplay")
                  : playing
                    ? t("tutorialPause")
                    : t("tutorialPlay")
              }
            >
              {finished ? (
                <RotateCcw className="h-4 w-4" />
              ) : playing ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(index + 1)}
            disabled={index === last}
            aria-label={t("tutorialNext")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <details className="mt-4 rounded-lg border bg-card p-4">
        <summary className="cursor-pointer text-sm font-medium">
          {t("tutorialRead")}
        </summary>
        <ol className="mt-3 grid gap-3 text-sm">
          {slides.map((s) => (
            <li key={s.title}>
              <p className="font-medium">{s.title}</p>
              <p className="text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
