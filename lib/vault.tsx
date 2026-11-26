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
import { useSettings } from "@/lib/settings";
import { DEFAULT_STATE, type FinanceState } from "@/lib/finance";

export type VaultStatus =
  "loading" | "setup" | "locked" | "unlocked" | "unsupported";
export type UnlockResult = { ok: true } | { ok: false; wait: number };

const VAULT_KEY = "mitsitsy:vault:v1";
const LEGACY_KEY = "mitsitsy:data:v1"; // old plaintext storage, migrated then deleted
export const MIN_PASSPHRASE_LENGTH = 10;
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
  waitUntil: number;
  changePassphrase: (current: string, next: string) => Promise<boolean>;
}

const VaultContext = createContext<VaultValue | null>(null);

const GUARD_KEY = "mitsitsy:guard:v1";
const MAX_WAIT_MS = 30_000;

interface Guard {
  failures: number;
  until: number; // timestamp (ms) when unlocking is allowed again
}

function readGuard(): Guard {
  try {
    const g = JSON.parse(localStorage.getItem(GUARD_KEY) ?? "null");
    if (g && Number.isFinite(g.failures) && Number.isFinite(g.until)) {
      return {
        failures: Math.max(0, Math.floor(g.failures)),
        // Never trust a far-future value (corrupted data or a changed clock).
        until: Math.min(g.until, Date.now() + MAX_WAIT_MS),
      };
    }
  } catch {
    /* ignore unreadable data */
  }
  return { failures: 0, until: 0 };
}

function writeGuard(g: Guard) {
  try {
    if (g.failures === 0) localStorage.removeItem(GUARD_KEY);
    else localStorage.setItem(GUARD_KEY, JSON.stringify(g));
  } catch {
    /* storage unavailable: the wait still works until reload */
  }
}

export function VaultProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<VaultStatus>("loading");
  const [state, setStateRaw] = useState<FinanceState>(DEFAULT_STATE);
  const session = useRef<{ key: CryptoKey; salt: string; iter: number } | null>(
    null,
  );
  const queue = useRef<Promise<void>>(Promise.resolve());
  const [waitUntil, setWaitUntil] = useState(0);
  const { settings } = useSettings();

  useEffect(() => {
    if (!cryptoSupported()) return setStatus("unsupported");
    setWaitUntil(readGuard().until);
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
      const guard = readGuard(); // read fresh each time, so other tabs are respected too
      const secondsLeft = (until: number) =>
        Math.max(0, Math.ceil((until - Date.now()) / 1000));
      if (secondsLeft(guard.until) > 0)
        return { ok: false, wait: secondsLeft(guard.until) };

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
        writeGuard({ failures: 0, until: 0 });
        setWaitUntil(0);
        open(key, vault.salt, vault.iter, { ...DEFAULT_STATE, ...data });
        return { ok: true };
      } catch {
        const failures = guard.failures + 1;
        const until =
          failures >= 3
            ? Date.now() + Math.min(30, 2 ** (failures - 2)) * 1000
            : 0;
        writeGuard({ failures, until });
        setWaitUntil(until);
        return { ok: false, wait: secondsLeft(until) };
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

  /** Re-encrypts everything with a new passphrase and a new salt. */
  const changePassphrase = useCallback(
    async (current: string, next: string): Promise<boolean> => {
      if (!session.current) return false;
      try {
        const vault: unknown = JSON.parse(
          localStorage.getItem(VAULT_KEY) ?? "null",
        );
        if (!isVault(vault)) return false;
        const oldKey = await deriveKey(
          current,
          fromBase64(vault.salt),
          vault.iter,
        );
        await decryptJson(oldKey, vault); // throws if the current passphrase is wrong
        const salt = toBase64(randomBytes(16));
        const key = await deriveKey(next, fromBase64(salt), KDF_ITERATIONS);
        await queue.current; // let pending saves finish with the old key
        session.current = { key, salt, iter: KDF_ITERATIONS };
        await persist(state);
        return true;
      } catch {
        return false;
      }
    },
    [persist, state],
  );

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
    writeGuard({ failures: 0, until: 0 });
    setWaitUntil(0);
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
    const idle = () => arm(settings.autoLockMinutes * 60_000);
    const onVisibility = () =>
      document.hidden && settings.lockOnBackground
        ? arm(HIDDEN_LOCK_MS)
        : idle();
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, idle, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);
    idle();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, idle));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [status, lock, settings.autoLockMinutes, settings.lockOnBackground]);

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
        waitUntil,
        changePassphrase,
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
