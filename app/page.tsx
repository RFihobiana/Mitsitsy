import { Dashboard } from "@/components/dashboard";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { TopBar } from "@/components/top-bar";
import { SecurityCard } from "@/components/security-card";
import { VaultGate } from "@/components/vault-gate";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Mitsitsy",
  url: "https://mitsitsy-tsara.vercel.app",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  inLanguage: ["fr", "en", "mg"],
  description: "Épargnez votre salaire d’abord, dépensez ce qui reste.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "MGA" },
};

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TopBar />
      <Hero />
      <VaultGate>
        <Dashboard />
        <SecurityCard />
      </VaultGate>
      <Footer />
    </main>
  );
}
