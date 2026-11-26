"use client";

import Link from "next/link";
import { useState } from "react";
import { TutorialPlayer } from "@/components/tutorial-player";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

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
    <section className="mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t("tutorialTitle")}
      </h1>
      <p className="mb-6 mt-3 text-muted-foreground">{t("tutorialIntro")}</p>
      <TutorialPlayer />
      {videoUrl && <VideoEmbed url={videoUrl} />}
      <Link
        href="/"
        className={buttonVariants({ variant: "outline", className: "mt-6" })}
      >
        {t("backToApp")}
      </Link>
    </section>
  );
}
