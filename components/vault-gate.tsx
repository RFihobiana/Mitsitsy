"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useVault } from "@/lib/vault";
import { PasswordInput } from "@/components/ui/password-input";

const MIN_LENGTH = 10;

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
  const { setup, unlock, eraseAll } = useVault();
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isSetup = mode === "setup";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (isSetup) {
      if (pass.length < MIN_LENGTH) return setError(t("errTooShort"));
      if (pass !== confirm) return setError(t("errMismatch"));
      setBusy(true);
      await setup(pass);
      return;
    }
    setBusy(true);
    const result = await unlock(pass);
    setBusy(false);
    if (!result.ok)
      setError(
        result.wait > 0 ? t("errWait", { n: result.wait }) : t("errWrong"),
      );
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
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy}>
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
        </form>
      </CardContent>
    </Card>
  );
}
