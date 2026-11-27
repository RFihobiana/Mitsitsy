import type { Kind } from "@/lib/finance";
import type { Key } from "@/lib/i18n";

/** Cost-of-living level: 1 = very low ... 5 = very high. These are estimates, adjust them freely. */
export type Tier = 1 | 2 | 3 | 4 | 5;

export interface Place {
  id: string;
  name?: string; // shown as-is
  nameKey?: Key; // or translated
  tier: Tier;
}

export const OTHER_ID = "other";

export const MADAGASCAR_PLACES: Place[] = [
  { id: "ambatondrazaka", name: "Ambatondrazaka", tier: 2 },
  { id: "ambositra", name: "Ambositra", tier: 2 },
  { id: "antalaha", name: "Antalaha", tier: 2 },
  { id: "antananarivo", name: "Antananarivo", tier: 4 },
  { id: "antsirabe", name: "Antsirabe", tier: 3 },
  { id: "antsiranana", name: "Antsiranana (Diego)", tier: 3 },
  { id: "fianarantsoa", name: "Fianarantsoa", tier: 3 },
  { id: "ihosy", name: "Ihosy", tier: 1 },
  { id: "mahajanga", name: "Mahajanga", tier: 3 },
  { id: "manakara", name: "Manakara", tier: 2 },
  { id: "maroantsetra", name: "Maroantsetra", tier: 2 },
  { id: "moramanga", name: "Moramanga", tier: 2 },
  { id: "morondava", name: "Morondava", tier: 2 },
  { id: "nosybe", name: "Nosy Be", tier: 4 },
  { id: "sambava", name: "Sambava", tier: 2 },
  { id: "taolagnaro", name: "Taolagnaro (Fort-Dauphin)", tier: 3 },
  { id: "toamasina", name: "Toamasina", tier: 3 },
  { id: "toliara", name: "Toliara", tier: 2 },
  { id: "tsiroanomandidy", name: "Tsiroanomandidy", tier: 2 },
  { id: "mg-small", nameKey: "placeSmallTown", tier: 1 },
];

interface Line {
  key: Key;
  kind: Kind;
  /** Share of the money left after savings, per level. */
  shares: Record<Tier, number>;
}

// Needs total 64-82% and leisure 4-5%: the rest stays free as a cushion.
const LINES: Line[] = [
  {
    key: "catHousing",
    kind: "need",
    shares: { 1: 0.1, 2: 0.15, 3: 0.2, 4: 0.24, 5: 0.34 },
  },
  {
    key: "catFood",
    kind: "need",
    shares: { 1: 0.34, 2: 0.31, 3: 0.28, 4: 0.26, 5: 0.2 },
  },
  {
    key: "catTransport",
    kind: "need",
    shares: { 1: 0.05, 2: 0.07, 3: 0.09, 4: 0.1, 5: 0.1 },
  },
  {
    key: "catUtilities",
    kind: "need",
    shares: { 1: 0.06, 2: 0.07, 3: 0.08, 4: 0.08, 5: 0.08 },
  },
  {
    key: "catPhone",
    kind: "need",
    shares: { 1: 0.04, 2: 0.04, 3: 0.04, 4: 0.04, 5: 0.03 },
  },
  {
    key: "catHealth",
    kind: "need",
    shares: { 1: 0.05, 2: 0.05, 3: 0.05, 4: 0.05, 5: 0.07 },
  },
  {
    key: "catLeisure",
    kind: "want",
    shares: { 1: 0.04, 2: 0.05, 3: 0.05, 4: 0.05, 5: 0.04 },
  },
];

/** Round to 2 significant digits so amounts look like real prices. */
function nice(n: number): number {
  if (n < 10) return Math.round(n);
  const step = 10 ** (Math.floor(Math.log10(n)) - 1);
  return Math.round(n / step) * step;
}

export interface Suggestion {
  key: Key;
  kind: Kind;
  amount: number;
}

export function suggest(spendable: number, tier: Tier): Suggestion[] {
  return LINES.map((l) => ({
    key: l.key,
    kind: l.kind,
    amount: nice(spendable * l.shares[tier]),
  })).filter((s) => s.amount > 0);
}
