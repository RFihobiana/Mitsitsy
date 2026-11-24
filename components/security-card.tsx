"use client";

import { useState, type ChangeEvent } from "react";
import { Download, Lock, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { useI18n } from "@/lib/i18n";
import { AUTO_LOCK_MINUTES, useVault } from "@/lib/vault";

export function SecurityCard() {
  const { t } = useI18n();
  const { lock, exportBackup, importBackup, eraseAll } = useVault();
  const [backup, setBackup] = useState<string | null>(null);
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackup(await file.text());
    setMsg(null);
    e.target.value = "";
  };

  const restore = async () => {
    if (!backup) return;
    setBusy(true);
    const ok = await importBackup(backup, pass);
    setBusy(false);
    setMsg({ ok, text: ok ? t("backupDone") : t("backupBad") });
    if (ok) {
      setBackup(null);
      setPass("");
    }
  };

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>{t("securityTitle")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("securityText", { n: AUTO_LOCK_MINUTES })}
        </p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={lock}>
            <Lock className="h-4 w-4" /> {t("lockNow")}
          </Button>
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
            onClick={() => window.confirm(t("eraseConfirm")) && eraseAll()}
          >
            <Trash2 className="h-4 w-4" /> {t("eraseAll")}
          </Button>
        </div>

        {backup && (
          <div className="flex flex-wrap gap-2">
            <div className="w-full max-w-xs">
              <PasswordInput
                autoComplete="off"
                className="max-w-xs"
                placeholder={t("backupImportPass")}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
            <Button onClick={restore} disabled={busy || !pass}>
              {busy ? "…" : t("backupImportConfirm")}
            </Button>
          </div>
        )}
        {msg && (
          <p
            role="status"
            className={
              msg.ok ? "text-sm text-primary" : "text-sm text-destructive"
            }
          >
            {msg.text}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
