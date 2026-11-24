"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  KDF_ITERATIONS,
  cryptoSupported,
  decryptJson,
  deriveKey,
  encryptJson,
  fromBase64,
  isVault,
  randomBytes,
  toBase64,
} from "@/lib/crypto";
import { DEFAULT_STATE, type FinanceState } from "@/lib/finance";

export type VaultStatus =
  "loading" | "setup" | "locked" | "unlocked" | "unsupported";
export type UnlockResult = { ok: true } | { ok: false; wait: number };

const VAULT_KEY = "mitsitsy:vault:v1";
const LEGACY_KEY = "mitsitsy:data:v1"; // old plaintext storage, migrated then deleted
export const AUTO_LOCK_MINUTES = 5;
const HIDDEN_LOCK_MS = 60_000;

interface VaultValue {
  status: VaultStatus;
  state: FinanceState;
  setState: (next: FinanceState) => void;
  setup: (passphrase: string) => Promise<void>;
  unlock: (passphrase: string) => Promise<UnlockResult>;
  lock: () => void;
  exportBackup: () => Promise<void>;
  importBackup: (text: string, passphrase: string) => Promise<boolean>;
  eraseAll: () => void;
}

const VaultContext = createContext<VaultValue | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<VaultStatus>("loading");
  const [state, setStateRaw] = useState<FinanceState>(DEFAULT_STATE);
  const session = useRef<{ key: CryptoKey; salt: string; iter: number } | null>(
    null,
  );
  const queue = useRef<Promise<void>>(Promise.resolve());
  const failures = useRef(0);
  const blockedUntil = useRef(0);

  useEffect(() => {
    if (!cryptoSupported()) return setStatus("unsupported");
    setStatus(localStorage.getItem(VAULT_KEY) ? "locked" : "setup");
  }, []);

  /** Encrypt and store, one write at a time so saves never overlap. */
  const persist = useCallback((next: FinanceState) => {
    const s = session.current;
    if (!s) return queue.current;
    queue.current = queue.current.then(async () => {
      try {
        const vault = await encryptJson(s.key, s.salt, s.iter, next);
        localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
      } catch {
        /* storage full or unavailable: the app keeps working in memory */
      }
    });
    return queue.current;
  }, []);

  const setState = useCallback(
    (next: FinanceState) => {
      setStateRaw(next);
      void persist(next);
    },
    [persist],
  );

  const open = (
    key: CryptoKey,
    salt: string,
    iter: number,
    data: FinanceState,
  ) => {
    session.current = { key, salt, iter };
    setStateRaw(data);
    setStatus("unlocked");
  };

  const setup = useCallback(
    async (passphrase: string) => {
      const salt = toBase64(randomBytes(16));
      const key = await deriveKey(passphrase, fromBase64(salt), KDF_ITERATIONS);
      let initial = DEFAULT_STATE;
      try {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) initial = { ...DEFAULT_STATE, ...JSON.parse(legacy) };
      } catch {
        /* ignore unreadable legacy data */
      }
      open(key, salt, KDF_ITERATIONS, initial);
      await persist(initial);
      localStorage.removeItem(LEGACY_KEY);
    },
    [persist],
  );

  const unlock = useCallback(
    async (passphrase: string): Promise<UnlockResult> => {
      const remaining = () =>
        Math.max(0, Math.ceil((blockedUntil.current - Date.now()) / 1000));
      if (remaining() > 0) return { ok: false, wait: remaining() };
      try {
        const vault: unknown = JSON.parse(
          localStorage.getItem(VAULT_KEY) ?? "null",
        );
        if (!isVault(vault)) throw new Error("invalid vault");
        const key = await deriveKey(
          passphrase,
          fromBase64(vault.salt),
          vault.iter,
        );
        const data = (await decryptJson(key, vault)) as FinanceState;
        failures.current = 0;
        open(key, vault.salt, vault.iter, { ...DEFAULT_STATE, ...data });
        return { ok: true };
      } catch {
        failures.current += 1;
        if (failures.current >= 3) {
          blockedUntil.current =
            Date.now() + Math.min(30, 2 ** (failures.current - 2)) * 1000;
        }
        return { ok: false, wait: remaining() };
      }
    },
    [],
  );

  const lock = useCallback(() => {
    session.current = null; // queued writes already hold their own key reference
    setStateRaw(DEFAULT_STATE);
    setStatus("locked");
  }, []);

  const exportBackup = useCallback(async () => {
    await queue.current;
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return;
    const url = URL.createObjectURL(
      new Blob([raw], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `mitsitsy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importBackup = useCallback(
    async (text: string, passphrase: string) => {
      try {
        const vault: unknown = JSON.parse(text);
        if (!isVault(vault)) return false;
        const key = await deriveKey(
          passphrase,
          fromBase64(vault.salt),
          vault.iter,
        );
        const data = (await decryptJson(key, vault)) as FinanceState;
        setState({ ...DEFAULT_STATE, ...data }); // re-encrypted with the current passphrase
        return true;
      } catch {
        return false;
      }
    },
    [setState],
  );

  const eraseAll = useCallback(() => {
    localStorage.removeItem(VAULT_KEY);
    localStorage.removeItem(LEGACY_KEY);
    session.current = null;
    failures.current = 0;
    blockedUntil.current = 0;
    setStateRaw(DEFAULT_STATE);
    setStatus("setup");
  }, []);

  // Auto-lock: after inactivity, or shortly after the tab/app is hidden.
  useEffect(() => {
    if (status !== "unlocked") return;
    let timer: ReturnType<typeof setTimeout>;
    const arm = (ms: number) => {
      clearTimeout(timer);
      timer = setTimeout(lock, ms);
    };
    const idle = () => arm(AUTO_LOCK_MINUTES * 60_000);
    const onVisibility = () => (document.hidden ? arm(HIDDEN_LOCK_MS) : idle());
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, idle, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);
    idle();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, idle));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [status, lock]);

  return (
    <VaultContext.Provider
      value={{
        status,
        state,
        setState,
        setup,
        unlock,
        lock,
        exportBackup,
        importBackup,
        eraseAll,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault(): VaultValue {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used inside VaultProvider");
  return ctx;
}
