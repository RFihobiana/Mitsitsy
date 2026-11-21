"use client";

import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return <footer className="mt-12 text-center text-xs text-muted-foreground">{t("footer")}</footer>;
}
