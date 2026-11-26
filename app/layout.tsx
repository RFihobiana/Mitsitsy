import type { Metadata } from "next";
import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SwRegister } from "@/components/sw-register";
import { VaultProvider } from "@/lib/vault";
import { Footer } from "@/components/footer";
import { TopBar } from "@/components/top-bar";
import { SettingsProvider } from "@/lib/settings";

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
          <SettingsProvider>
            <VaultProvider>
              <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
                <TopBar />
                {children}
                <Footer />
              </main>
            </VaultProvider>
          </SettingsProvider>
        </I18nProvider>
        <SwRegister />
        <Analytics />
      </body>
    </html>
  );
}
