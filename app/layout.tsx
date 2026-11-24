import type { Metadata } from "next";
import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SwRegister } from "@/components/sw-register";
import { VaultProvider } from "@/lib/vault";

export const metadata: Metadata = {
  metadataBase: new URL("https://mitsitsy-tsara.vercel.app"),
  title: {
    default: "Mitsitsy – Épargnez votre salaire d’abord",
    template: "%s | Mitsitsy",
  },
  description:
    "Mitsitsy vous aide à épargner votre salaire en premier et à dépenser le reste : budget mensuel, objectifs d’épargne et graphiques. En français, anglais et malagasy.",
  keywords: [
    "budget",
    "épargne",
    "salaire",
    "gestion d’argent",
    "Madagascar",
    "Ariary",
    "Mitsitsy",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Mitsitsy",
    title: "Mitsitsy – Épargnez votre salaire d’abord",
    description:
      "Épargnez d’abord, dépensez ce qui reste. Budget, objectifs et graphiques.",
    locale: "fr_FR",
    alternateLocale: ["en_US", "mg_MG"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitsitsy",
    description: "Épargnez votre salaire d’abord.",
  },
  robots: { index: true, follow: true },
  verification: { google: "eLRiXQ2YhX7cM9m4SRFCJSlVFV8iaQ6QvRr9RpQYf24" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <VaultProvider>{children}</VaultProvider>
        </I18nProvider>
        <SwRegister />
        <Analytics />
      </body>
    </html>
  );
}
