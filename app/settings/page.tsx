import type { Metadata } from "next";
import { SettingsView } from "@/components/settings-view";

export const metadata: Metadata = {
  title: "Réglages",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return <SettingsView />;
}
