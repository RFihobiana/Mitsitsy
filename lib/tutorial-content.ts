import {
  Coins,
  KeyRound,
  Receipt,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  WifiOff,
  type LucideIcon,
} from "lucide-react";
import type { Lang } from "@/lib/i18n";

export const SLIDE_ICONS: LucideIcon[] = [
  Sparkles,
  Coins,
  Receipt,
  Target,
  ShieldCheck,
  KeyRound,
  Timer,
  WifiOff,
];

export interface SlideText {
  title: string;
  text: string;
}

export const SLIDES: Record<Lang, SlideText[]> = {
  en: [
    {
      title: "Welcome to Mitsitsy",
      text: "Mitsitsy puts your savings first. You set money aside the day your salary arrives, then spend only what is left.",
    },
    {
      title: "Start with your salary",
      text: "Enter your monthly salary and choose the share to save. The chart shows right away where every ariary goes.",
    },
    {
      title: "Track your spending",
      text: "Add each expense as a need or a want. Mitsitsy shows what is left, and how much you can spend per day until the end of the month.",
    },
    {
      title: "Set a savings goal",
      text: "Enter a target and what you already saved. Mitsitsy estimates the time to reach it, in days, months or years.",
    },
    {
      title: "Private by design",
      text: "There is no account and no server for your data. What you type stays on this device. Only anonymous visit counts are collected, never your numbers.",
    },
    {
      title: "Encrypted with your passphrase",
      text: "Your data is encrypted on this device (AES-256) with a key derived from your passphrase. The passphrase is never stored or sent, so it cannot be recovered. Export an encrypted backup to be safe.",
    },
    {
      title: "Locks itself",
      text: "The app locks after inactivity and when you leave it. Wrong passphrases trigger a growing delay. In Settings you can change the delay and the passphrase. No app can protect a device that is already infected.",
    },
    {
      title: "Works offline",
      text: "After your first visit, Mitsitsy opens without internet and can be installed like an app. Updates arrive when you are online.",
    },
  ],
  fr: [
    {
      title: "Bienvenue sur Mitsitsy",
      text: "Mitsitsy place votre épargne en premier. Vous mettez de l’argent de côté dès l’arrivée de votre salaire, puis vous ne dépensez que le reste.",
    },
    {
      title: "Commencez par votre salaire",
      text: "Saisissez votre salaire mensuel et choisissez la part à épargner. Le graphique montre aussitôt où va chaque ariary.",
    },
    {
      title: "Suivez vos dépenses",
      text: "Ajoutez chaque dépense comme besoin ou envie. Mitsitsy affiche ce qui reste et ce que vous pouvez dépenser par jour jusqu’à la fin du mois.",
    },
    {
      title: "Fixez un objectif d’épargne",
      text: "Saisissez un montant visé et ce que vous avez déjà épargné. Mitsitsy estime le temps nécessaire, en jours, mois ou années.",
    },
    {
      title: "Confidentiel par conception",
      text: "Il n’y a ni compte ni serveur pour vos données. Ce que vous saisissez reste sur cet appareil. Seuls des comptages de visites anonymes sont collectés, jamais vos chiffres.",
    },
    {
      title: "Chiffré avec votre phrase secrète",
      text: "Vos données sont chiffrées sur cet appareil (AES-256) avec une clé dérivée de votre phrase secrète. Elle n’est ni stockée ni envoyée : impossible de la récupérer. Exportez une sauvegarde chiffrée par précaution.",
    },
    {
      title: "Se verrouille tout seul",
      text: "L’application se verrouille après un temps d’inactivité et quand vous la quittez. Les mauvaises phrases secrètes déclenchent un délai croissant. Dans les Réglages, vous changez le délai et la phrase secrète. Aucune application ne protège un appareil déjà infecté.",
    },
    {
      title: "Fonctionne hors ligne",
      text: "Après votre première visite, Mitsitsy s’ouvre sans internet et peut être installée comme une application. Les mises à jour arrivent quand vous êtes en ligne.",
    },
  ],
  mg: [
    {
      title: "Tongasoa eto amin’ny Mitsitsy",
      text: "Ny Mitsitsy dia mametraka ny fitehirizana aloha. Mitahiry ianao raha vao tonga ny karama, ary mandany ny sisa ihany.",
    },
    {
      title: "Atombohy amin’ny karamanao",
      text: "Ampidiro ny karamanao isam-bolana ary misafidiana ny anjara hotehirizina. Hita avy hatrany ny fizaran’ny ariary tsirairay amin’ny sary.",
    },
    {
      title: "Araho ny fandaniana",
      text: "Ampidiro ho filàna na faniriana ny fandaniana tsirairay. Aseho ny sisa sy ny vola azonao holaniana isan’andro hatramin’ny faran’ny volana.",
    },
    {
      title: "Mametraha tanjona fitehirizana",
      text: "Ampidiro ny vola tiana ho tratra sy ny efa voatahiry. Hanombanan’ny Mitsitsy ny fotoana ilaina, amin’ny andro, volana na taona.",
    },
    {
      title: "Miaro ny tsiambaratelo hatrany am-piandohana",
      text: "Tsy misy kaonty na serivera ho an’ny angonao. Mijanona ao amin’ity fitaovana ity ny soratanao. Kajy fitsidihana tsy fantatra anarana ihany no angonina, fa tsy ny isa ampidirinao.",
    },
    {
      title: "Voasoratra mafina amin’ny teny miafinao",
      text: "Voasoratra mafina ao amin’ity fitaovana ity ny angonao (AES-256) amin’ny fanalahidy avy amin’ny teny miafinao. Tsy tehirizina izany teny izany, ka tsy azo tadiavina raha hadino. Avoaka amin'ny soratra miafina ny backup mba hiarovana azy.",
    },
    {
      title: "Mihidy irery",
      text: "Mihidy ny rindrambaiko rehefa tsy ampiasaina sy rehefa avelanao. Ny teny miafina diso dia mitarika fiandrasana mitombo. Ao amin’ny Fandrindrana no ahitana ny fiovana ny fotoana sy ny teny miafina. Tsy misy rindrambaiko afaka miaro fitaovana efa voan’ny virus.",
    },
    {
      title: "Mandeha tsy misy internet",
      text: "Aorian’ny fitsidihanao voalohany, mandeha tsy misy internet ny Mitsitsy ary azo apetraka toy ny rindrambaiko. Tonga rehefa misy internet ny fanavaozana.",
    },
  ],
};
