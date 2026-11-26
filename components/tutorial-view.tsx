"use client";

import Link from "next/link";
import { useState } from "react";
import { Tour } from "@/components/tour";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { BookOpen } from "lucide-react";

function VideoEmbed({ url }: { url: string }) {
  const { t } = useI18n();
  const [load, setLoad] = useState(false);
  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>{t("tutorialVideo")}</CardTitle>
      </CardHeader>
      <CardContent>
        {load ? (
          <div className="aspect-video overflow-hidden rounded-md">
            <iframe
              src={url}
              title={t("tutorialVideo")}
              className="h-full w-full"
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">
              {t("tutorialVideoNote")}
            </p>
            <Button onClick={() => setLoad(true)}>
              {t("tutorialVideoLoad")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TutorialView({ videoUrl }: { videoUrl?: string }) {
  const { t } = useI18n();
  return (
    <section className="py-8">
      <header className="mb-8 max-w-2xl">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 px-3 py-1 text-xs font-medium text-primary">
          <BookOpen className="h-3.5 w-3.5" /> {t("tutorial")}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          {t("tutorialTitle")}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {t("tutorialIntro")}
        </p>
      </header>
      <Tour />
      {videoUrl && <VideoEmbed url={videoUrl} />}
      <Link
        href="/"
        className={buttonVariants({ variant: "outline", className: "mt-8" })}
      >
        {t("backToApp")}
      </Link>
    </section>
  );
}
