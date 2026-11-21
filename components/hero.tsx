"use client";

import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="py-12 sm:py-16">
      <p
        className="mb-4 inline-block animate-fade-up rounded-full border border-primary/40 px-3 py-1 text-xs font-medium text-primary"
        style={{ animationDelay: "0ms" }}
      >
        {t("tag")}
      </p>
      <h1
        className="max-w-3xl animate-fade-up text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
        style={{ animationDelay: "120ms" }}
      >
        {t("heroTitle")}
      </h1>
      <p
        className="mt-5 max-w-2xl animate-fade-up text-base leading-relaxed text-muted-foreground sm:text-lg"
        style={{ animationDelay: "260ms" }}
      >
        {t("heroText")}
      </p>
    </section>
  );
}
