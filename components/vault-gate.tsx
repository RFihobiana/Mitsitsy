"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { PasswordInput } from "@/components/ui/password-input";
import { MIN_PASSPHRASE_LENGTH, useVault } from "@/lib/vault";

export function VaultGate({ children }: { children: ReactNode }) {
  const { status } = useVault();
  const { t } = useI18n();
  if (status === "unlocked") return <>{children}</>;
  if (status === "loading") return null;
  if (status === "unsupported") {
    return (
      <p className="rounded-md border border-destructive/40 p-4 text-sm text-destructive">
        {t("errUnsupported")}
      </p>
    );
  }
  return <LockScreen mode={status === "setup" ? "setup" : "unlock"} />;
}
function LockScreen({ mode }: { mode: "setup" | "unlock" }) {
  const { t } = useI18n();
  const { setup, unlock, eraseAll, waitUntil: until } = useVault();
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const isSetup = mode === "setup";

  // Tick while a wait is running, and stop by itself when it ends.
  useEffect(() => {
    setNow(Date.now());
    if (until <= Date.now()) return;
    const id = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= until) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [until]);

  const remaining = Math.max(0, Math.ceil((until - now) / 1000));
  const message = remaining > 0 ? t("errWait", { n: remaining }) : error;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (remaining > 0) return;
    setError("");
    if (isSetup) {
      if (pass.length < MIN_PASSPHRASE_LENGTH)
        return setError(t("errTooShort"));
      if (pass !== confirm) return setError(t("errMismatch"));
      setBusy(true);
      await setup(pass);
      return;
    }
    setBusy(true);
    const result = await unlock(pass);
    setBusy(false);
    if (!result.ok) setError(t("errWrong"));
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          {isSetup ? t("lockSetupTitle") : t("lockUnlockTitle")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isSetup ? t("lockSetupText") : t("lockUnlockText")}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="pass">{t("passphrase")}</Label>
            <PasswordInput
              id="pass"
              autoFocus
              autoComplete={isSetup ? "new-password" : "current-password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          {isSetup && (
            <div className="grid gap-1.5">
              <Label htmlFor="confirm">{t("passphraseConfirm")}</Label>
              <PasswordInput
                id="confirm"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {t("passphraseHint")}
              </p>
            </div>
          )}
          {message && (
            <p
              role={remaining > 0 ? "timer" : "alert"}
              className="text-sm text-destructive"
            >
              {message}
            </p>
          )}
          <Button type="submit" disabled={busy || remaining > 0}>
            {busy ? "…" : isSetup ? t("setupButton") : t("unlockButton")}
          </Button>
          {!isSetup && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => window.confirm(t("eraseConfirm")) && eraseAll()}
            >
              {t("forgot")}
            </Button>
          )}

          <Link
            href="/tutorial"
            className="text-center text-sm text-primary underline-offset-4 hover:underline"
          >
            {t("tutorialWatch")}
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
