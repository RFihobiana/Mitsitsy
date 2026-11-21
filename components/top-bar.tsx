"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANGS, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const THEME_KEY = "mitsitsy:theme";

export function TopBar() {
  const { lang, setLang, t } = useI18n();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-lg font-semibold tracking-tight">Mitsitsy</span>
      <div className="flex items-center gap-2">
        <div role="group" aria-label={t("language")} className="flex rounded-md border border-input p-0.5">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={cn(
                "rounded-sm px-2.5 py-1 text-xs font-medium uppercase transition-colors",
                lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <Button variant="outline" size="icon" onClick={toggleTheme} aria-label={t("theme")}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
