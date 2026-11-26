"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { BookOpen, Download, Lock, Trash2, Upload } from "lucide-react";
import { LanguageSwitch, ThemeToggle } from "@/components/preferences";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useI18n } from "@/lib/i18n";
import { AUTO_LOCK_CHOICES, useSettings } from "@/lib/settings";
import { MIN_PASSPHRASE_LENGTH, useVault } from "@/lib/vault";
import { cn } from "@/lib/utils";

type Msg = { ok: boolean; text: string };

const Notice = ({ m }: { m: Msg | null }) =>
  m ? (
    <p
      role="status"
      className={cn("text-sm", m.ok ? "text-primary" : "text-destructive")}
    >
      {m.text}
    </p>
  ) : null;

export function SettingsView() {
  const { t } = useI18n();
  const {
    status,
    lock,
    changePassphrase,
    exportBackup,
    importBackup,
    eraseAll,
  } = useVault();
  const { settings, update } = useSettings();
  const unlocked = status === "unlocked";

  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [conf, setConf] = useState("");
  const [passMsg, setPassMsg] = useState<Msg | null>(null);
  const [backup, setBackup] = useState<string | null>(null);
  const [backupPass, setBackupPass] = useState("");
  const [backupMsg, setBackupMsg] = useState<Msg | null>(null);
  const [busy, setBusy] = useState(false);

  const submitPass = async (e: FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (next.length < MIN_PASSPHRASE_LENGTH)
      return setPassMsg({ ok: false, text: t("errTooShort") });
    if (next !== conf) return setPassMsg({ ok: false, text: t("errMismatch") });
    setBusy(true);
    const ok = await changePassphrase(cur, next);
    setBusy(false);
    setPassMsg({ ok, text: ok ? t("passChanged") : t("passChangeBad") });
    if (ok) {
      setCur("");
      setNext("");
      setConf("");
    }
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackup(await file.text());
    setBackupMsg(null);
    e.target.value = "";
  };

  const restore = async () => {
    if (!backup) return;
    setBusy(true);
    const ok = await importBackup(backup, backupPass);
    setBusy(false);
    setBackupMsg({ ok, text: ok ? t("backupDone") : t("backupBad") });
    if (ok) {
      setBackup(null);
      setBackupPass("");
    }
  };

  return (
    <section className="mx-auto grid max-w-2xl gap-5 py-8">
      <h1 className="text-3xl font-bold tracking-tight">{t("settings")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("settingsAppearance")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <Label>{t("language")}</Label>
            <LanguageSwitch />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label>{t("theme")}</Label>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {!unlocked ? (
        <Card>
          <CardContent className="grid gap-3 pt-5">
            <p className="text-sm text-muted-foreground">
              {t("settingsUnlockFirst")}
            </p>
            <Link href="/" className={buttonVariants({ className: "w-fit" })}>
              {t("settingsGoUnlock")}
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{t("securityTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="autolock">{t("settingsAutoLock")}</Label>
                <select
                  id="autolock"
                  value={settings.autoLockMinutes}
                  onChange={(e) =>
                    update({ autoLockMinutes: Number(e.target.value) })
                  }
                  className="h-10 rounded-md border border-input bg-card px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {AUTO_LOCK_CHOICES.map((m) => (
                    <option key={m} value={m}>
                      {t("minutesN", { n: m })}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={settings.lockOnBackground}
                  onChange={(e) =>
                    update({ lockOnBackground: e.target.checked })
                  }
                  className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]"
                />
                <span>
                  {t("settingsLockBackground")}
                  <span className="block text-xs text-muted-foreground">
                    {t("settingsLockBackgroundHint")}
                  </span>
                </span>
              </label>

              <form onSubmit={submitPass} className="grid gap-3 border-t pt-5">
                <p className="text-sm font-medium">{t("settingsChangePass")}</p>
                <PasswordInput
                  autoComplete="current-password"
                  placeholder={t("passCurrent")}
                  value={cur}
                  onChange={(e) => setCur(e.target.value)}
                />
                <PasswordInput
                  autoComplete="new-password"
                  placeholder={t("passNew")}
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                />
                <PasswordInput
                  autoComplete="new-password"
                  placeholder={t("passphraseConfirm")}
                  value={conf}
                  onChange={(e) => setConf(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {t("passphraseHint")}
                </p>
                <Notice m={passMsg} />
                <Button
                  type="submit"
                  disabled={busy || !cur || !next}
                  className="w-fit"
                >
                  {busy ? "…" : t("settingsChangePass")}
                </Button>
              </form>

              <Button variant="outline" onClick={lock} className="w-fit">
                <Lock className="h-4 w-4" /> {t("lockNow")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settingsData")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => void exportBackup()}>
                  <Download className="h-4 w-4" /> {t("backupExport")}
                </Button>
                <Button variant="outline" className="relative cursor-pointer">
                  <Upload className="h-4 w-4" /> {t("backupImport")}
                  <input
                    type="file"
                    accept="application/json,.json"
                    onChange={onFile}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label={t("backupImport")}
                  />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    window.confirm(t("eraseConfirm")) && eraseAll()
                  }
                >
                  <Trash2 className="h-4 w-4" /> {t("eraseAll")}
                </Button>
              </div>
              {backup && (
                <div className="flex flex-wrap gap-2">
                  <div className="w-full max-w-xs">
                    <PasswordInput
                      autoComplete="off"
                      placeholder={t("backupImportPass")}
                      value={backupPass}
                      onChange={(e) => setBackupPass(e.target.value)}
                    />
                  </div>
                  <Button onClick={restore} disabled={busy || !backupPass}>
                    {busy ? "…" : t("backupImportConfirm")}
                  </Button>
                </div>
              )}
              <Notice m={backupMsg} />
            </CardContent>
          </Card>
        </>
      )}

      <Link
        href="/tutorial"
        className={buttonVariants({ variant: "outline", className: "w-fit" })}
      >
        <BookOpen className="h-4 w-4" /> {t("tutorialWatch")}
      </Link>
    </section>
  );
}
