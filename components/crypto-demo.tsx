"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import {
  KDF_ITERATIONS,
  decryptJson,
  deriveKey,
  encryptJson,
  fromBase64,
  randomBytes,
  toBase64,
  type Vault,
} from "@/lib/crypto";
import type { FinanceState } from "@/lib/finance";
import { useI18n } from "@/lib/i18n";
import { MIN_PASSPHRASE_LENGTH } from "@/lib/vault";

/** Encrypts the practice data with the real code, so the learner sees what is really stored. */
export function CryptoDemo({
  state,
  onAttempt,
}: {
  state: FinanceState;
  onAttempt: () => void;
}) {
  const { t } = useI18n();
  const [pass, setPass] = useState("");
  const [attempt, setAttempt] = useState("");
  const [vault, setVault] = useState<Vault | null>(null);
  const [result, setResult] = useState<"ok" | "bad" | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const encrypt = async () => {
    setError("");
    setResult(null);
    if (pass.length < MIN_PASSPHRASE_LENGTH) return setError(t("errTooShort"));
    setBusy(true);
    try {
      const salt = toBase64(randomBytes(16));
      const key = await deriveKey(pass, fromBase64(salt), KDF_ITERATIONS);
      setVault(await encryptJson(key, salt, KDF_ITERATIONS, state));
    } catch {
      setError(t("errUnsupported"));
    } finally {
      setBusy(false);
    }
  };

  const tryUnlock = async () => {
    if (!vault) return;
    setBusy(true);
    try {
      const key = await deriveKey(attempt, fromBase64(vault.salt), vault.iter);
      await decryptJson(key, vault);
      setResult("ok");
    } catch {
      setResult("bad");
    } finally {
      setBusy(false);
      onAttempt();
    }
  };

  return (
    <Card data-tour="crypto">
      <CardHeader>
        <CardTitle>{t("cryptoTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="w-full max-w-xs">
            <PasswordInput
              autoComplete="off"
              placeholder={t("passphrase")}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <Button onClick={encrypt} disabled={busy || !pass}>
            {busy && !vault ? "…" : t("cryptoEncrypt")}
          </Button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        {vault && (
          <div className="grid gap-3 text-xs">
            <div>
              <p className="mb-1 text-muted-foreground">{t("cryptoPlain")}</p>
              <p className="break-all rounded-md bg-muted p-2 font-mono">
                {JSON.stringify(state).slice(0, 90)}…
              </p>
            </div>
            <div>
              <p className="mb-1 text-muted-foreground">{t("cryptoStored")}</p>
              <p className="break-all rounded-md bg-muted p-2 font-mono text-primary">
                {vault.data.slice(0, 120)}…
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="w-full max-w-xs">
                <PasswordInput
                  autoComplete="off"
                  placeholder={t("passphrase")}
                  value={attempt}
                  onChange={(e) => setAttempt(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={tryUnlock} disabled={busy}>
                {t("cryptoTry")}
              </Button>
            </div>
            {result && (
              <p
                role="status"
                className={
                  result === "ok"
                    ? "text-sm text-primary"
                    : "text-sm text-destructive"
                }
              >
                {result === "ok" ? t("cryptoOk") : t("cryptoBad")}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
