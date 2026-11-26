"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface Settings {
  autoLockMinutes: number;
  lockOnBackground: boolean;
}

export const AUTO_LOCK_CHOICES = [1, 2, 5, 10, 30];
export const DEFAULT_SETTINGS: Settings = {
  autoLockMinutes: 5,
  lockOnBackground: true,
};
const KEY = "mitsitsy:settings:v1";

function read(): Settings {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return {
      autoLockMinutes: AUTO_LOCK_CHOICES.includes(raw?.autoLockMinutes)
        ? raw.autoLockMinutes
        : DEFAULT_SETTINGS.autoLockMinutes,
      lockOnBackground:
        typeof raw?.lockOnBackground === "boolean"
          ? raw.lockOnBackground
          : DEFAULT_SETTINGS.lockOnBackground,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

interface SettingsValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsValue | null>(null);

/** Non-confidential preferences, stored unencrypted (they are needed before unlocking). */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => setSettings(read()), []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
