import { Dashboard } from "@/components/dashboard";
import { Hero } from "@/components/hero";
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      <VaultGate>
        <Dashboard />
      </VaultGate>
    </>
  );
}
