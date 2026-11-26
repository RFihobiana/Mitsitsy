"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANGS, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const THEME_KEY = "mitsitsy:theme";

export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("language")}
      className="flex rounded-md border border-input p-0.5"
    >
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "rounded-sm px-2.5 py-1 text-xs font-medium uppercase transition-colors",
            lang === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle() {
  const { t } = useI18n();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    document.documentElement.classList.toggle(
      "dark",
      saved ? saved === "dark" : true,
    );
    const sync = () =>
      setDark(document.documentElement.classList.contains("dark"));
    sync();
    window.addEventListener("mitsitsy-theme", sync); // keeps every toggle on the page in sync
    return () => window.removeEventListener("mitsitsy-theme", sync);
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event("mitsitsy-theme"));
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={t("theme")}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
