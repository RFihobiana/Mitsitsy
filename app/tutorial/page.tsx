import type { Metadata } from "next";
import { TutorialView } from "@/components/tutorial-view";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tutoriel",
  description:
    "Comment utiliser Mitsitsy et comment vos données restent privées et chiffrées.",
  alternates: { canonical: "/tutorial" },
};

export default function TutorialPage() {
  return <TutorialView videoUrl={siteConfig.tutorialVideoUrl} />;
}
