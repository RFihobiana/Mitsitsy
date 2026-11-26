"use client";

import Link from "next/link";
import { BookOpen, Lock, Settings } from "lucide-react";
import { LanguageSwitch, ThemeToggle } from "@/components/preferences";
import { Button, buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useVault } from "@/lib/vault";

export function TopBar() {
  const { t } = useI18n();
  const { status, lock } = useVault();
  const icon = buttonVariants({ variant: "outline", size: "icon" });

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        Mitsitsy
      </Link>
      <div className="flex flex-wrap items-center gap-1.5">
        <LanguageSwitch />
        <ThemeToggle />
        <Link href="/tutorial" className={icon} aria-label={t("tutorial")}>
          <BookOpen className="h-4 w-4" />
        </Link>
        <Link href="/settings" className={icon} aria-label={t("settings")}>
          <Settings className="h-4 w-4" />
        </Link>
        {status === "unlocked" && (
          <Button
            variant="outline"
            size="icon"
            onClick={lock}
            aria-label={t("lockNow")}
          >
            <Lock className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
