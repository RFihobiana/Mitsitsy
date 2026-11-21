import { Dashboard } from "@/components/dashboard";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { TopBar } from "@/components/top-bar";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <TopBar />
      <Hero />
      <Dashboard />
      <Footer />
    </main>
  );
}
