"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "fr" | "mg";
export const LANGS: Lang[] = ["en", "fr", "mg"];

const en = {
  tag: "Pay yourself first",
  heroTitle: "The smartest way to keep your salary.",
  heroText:
    "Mitsitsy puts your savings above everything else: before rent, before shopping, before anything. You save first, spend what is left, and watch your goals come closer every month.",
  savingsShare: "Share to save: {pct}%",
  saveFirst: "Set aside on payday",
  toSpend: "To spend",
  salaryShort: "Salary",
  overview: "This month",
  spent: "Spent",
  left: "Left to spend",
  perDay: "Per day",
  daysLeft: "{n} days left",
  overspent: "You are {amount} over budget. Cut a want, not your savings.",
  expensePlaceholder: "Expense (e.g. transport)",
  amount: "Amount",
  need: "Need",
  want: "Want",
  add: "Add",
  remove: "Remove",
  noExpenses: "No expenses yet. Add the first one above.",
  newMonth: "Start a new month",
  goalTitle: "Savings goal",
  goalFor: "What for?",
  goalForPlaceholder: "e.g. laptop",
  goalRemaining:
    "{remaining} to go. At {rate} per month, you get there in {duration}.",
  durationDay: "{n} day",
  durationDays: "{n} days",
  durationMonth: "{n} month",
  durationMonths: "{n} months",
  durationYear: "{n} year",
  durationYears: "{n} years",
  goalReached: "Goal reached. Well done!",
  goalHint: "Enter your salary and a savings share to estimate the time.",
  addMonth: "Add this month's savings ({amount})",
  chartSplit: "Where your salary goes",
  chartGoal: "Road to your goal",
  chartGoalEmpty: "Set a goal to see the projection.",
  monthShort: "m",
  legendSave: "Savings",
  legendNeed: "Needs",
  legendWant: "Wants",
  legendLeft: "Left",
  theme: "Switch theme",
  language: "Language",
  footer: "Your data stays in this browser.",
  lockSetupTitle: "Protect your data",
  lockSetupText:
    "Choose a passphrase. Your data is encrypted on this device with it. If you forget it, your data cannot be recovered.",
  lockUnlockTitle: "Mitsitsy is locked",
  lockUnlockText: "Enter your passphrase to continue.",
  passphrase: "Passphrase",
  passphraseConfirm: "Confirm passphrase",
  passphraseHint:
    "At least 10 characters. A phrase of several words works best.",
  setupButton: "Encrypt and start",
  unlockButton: "Unlock",
  errTooShort: "The passphrase must have at least 10 characters.",
  errMismatch: "The passphrases do not match.",
  errWrong: "Wrong passphrase.",
  errWait: "Too many attempts. Wait {n} seconds.",
  errUnsupported: "Encryption is not available here. Open the app over HTTPS.",
  lockNow: "Lock now",
  backupExport: "Export encrypted backup",
  backupImport: "Import backup",
  backupImportPass: "Backup passphrase",
  backupImportConfirm: "Restore",
  backupDone: "Backup restored.",
  backupBad: "Invalid backup or wrong passphrase.",
  securityTitle: "Security",
  securityText:
    "Encrypted on this device. Locks after {n} minutes of inactivity.",
  eraseAll: "Erase all data",
  eraseConfirm: "Erase everything on this device? This cannot be undone.",
  forgot: "Forgot your passphrase? Erase all data",
  showPassphrase: "Show passphrase",
  hidePassphrase: "Hide passphrase",

  tutorial: "Tutorial",
  tutorialTitle: "How Mitsitsy works",
  tutorialWatch: "Watch the tutorial",
  tutorialPrev: "Previous",
  tutorialNext: "Next",
  tutorialStep: "Step {n} of {total}",
  tutorialVideo: "Video version",
  tutorialVideoLoad: "Load video",
  tutorialVideoNote: "Loading the video contacts YouTube and needs internet.",
  backToApp: "Back to the app",
  settings: "Settings",
  settingsAppearance: "Appearance",
  settingsAutoLock: "Lock after inactivity",
  minutesN: "{n} min",
  settingsLockBackground: "Lock when I leave the app",
  settingsLockBackgroundHint:
    "Locks one minute after the app goes to the background.",
  settingsChangePass: "Change passphrase",
  passCurrent: "Current passphrase",
  passNew: "New passphrase",
  passChanged: "Passphrase changed.",
  passChangeBad: "Wrong current passphrase.",
  settingsData: "Your data",
  settingsUnlockFirst: "Unlock the app to manage security and data.",
  settingsGoUnlock: "Go to unlock",
  tutorialIntro:
    "Practice with the real app: follow the highlighted steps. Nothing you type here is saved.",
  tutorialPractice: "Practice mode: nothing you do here is saved.",
  tutorialDoIt: "Do it for me",
  tutorialSkip: "Skip",
  tutorialDone: "Done",
  tutorialFinishTitle: "You are ready",
  tutorialFinishText:
    "Your practice data is discarded. Your real data starts empty and stays on this device.",
  tutorialStart: "Start using Mitsitsy",
  tutorialRestart: "Restart the practice",
  cryptoTitle: "Practice: encryption",
  cryptoEncrypt: "Encrypt",
  cryptoPlain: "Without encryption, your data would look like this:",
  cryptoStored: "What is really stored:",
  cryptoTry: "Try to unlock",
  cryptoOk: "Unlocked: the right passphrase decrypts the data.",
  cryptoBad: "Failed: a wrong passphrase reveals nothing.",
  tutorialExplain: "Show the explanation",
  tutorialYourTurn: "Your turn",
  tutorialWellDone: "Well done. Press Next to continue.",
  suggestTitle: "Suggested monthly budget",
  suggestIntro:
    "Tell us where you live. We suggest a lean list of expenses based on your salary and local prices.",
  placeLabel: "Where do you live?",
  placeChoose: "Choose a place",
  placeMadagascar: "Madagascar",
  placeOther: "Other country",
  placeSmallTown: "Small town or village (Madagascar)",
  priceLevel: "Cost of living there",
  price1: "Very low",
  price2: "Low",
  price3: "Medium",
  price4: "High",
  price5: "Very high",
  currencyLabel: "Currency",
  suggestNeedSalary: "Enter your salary first to see suggestions.",
  suggestTotal: "Estimated total: {total}",
  suggestCushion:
    "{cushion} stays free each month. Consider adding it to your savings.",
  suggestApply: "Add these expenses",
  suggestNote:
    "These are estimates, not exact prices. Edit any expense afterwards. Applying again replaces the previous suggestions and keeps your own expenses.",
  catHousing: "Rent",
  catFood: "Food",
  catTransport: "Transport",
  catUtilities: "Electricity and water",
  catPhone: "Phone and internet",
  catHealth: "Health",
  catLeisure: "Leisure",
  salary: "Monthly salary",
  goalTarget: "Target amount",
  goalSaved: "Already saved",
};

export type Key = keyof typeof en;
type Dict = Record<Key, string>;

const fr: Dict = {
  tag: "Épargnez d’abord",
  heroTitle: "La façon la plus intelligente de garder votre salaire.",
  heroText:
    "Mitsitsy place votre épargne au-dessus de tout : avant le loyer, avant les achats, avant le reste. Vous épargnez d’abord, vous dépensez ce qui reste, et vos objectifs se rapprochent chaque mois.",
  savingsShare: "Part à épargner : {pct} %",
  saveFirst: "À mettre de côté dès la paie",
  toSpend: "À dépenser",
  salaryShort: "Salaire",
  overview: "Ce mois-ci",
  spent: "Dépensé",
  left: "Reste à dépenser",
  perDay: "Par jour",
  daysLeft: "{n} jours restants",
  overspent:
    "Vous dépassez votre budget de {amount}. Réduisez une envie, pas votre épargne.",
  expensePlaceholder: "Dépense (ex. transport)",
  amount: "Montant",
  need: "Besoin",
  want: "Envie",
  add: "Ajouter",
  remove: "Supprimer",
  noExpenses: "Aucune dépense pour l’instant. Ajoutez la première ci-dessus.",
  newMonth: "Commencer un nouveau mois",
  goalTitle: "Objectif d’épargne",
  goalFor: "Pour quoi ?",
  goalForPlaceholder: "ex. ordinateur portable",
  goalRemaining:
    "Il reste {remaining}. À {rate} par mois, vous y arrivez en {duration}.",
  durationDay: "{n} jour",
  durationDays: "{n} jours",
  durationMonth: "{n} mois",
  durationMonths: "{n} mois",
  durationYear: "{n} an",
  durationYears: "{n} ans",
  goalReached: "Objectif atteint. Bravo !",
  goalHint:
    "Saisissez votre salaire et une part d’épargne pour estimer la durée.",
  addMonth: "Ajouter l’épargne de ce mois ({amount})",
  chartSplit: "Où va votre salaire",
  chartGoal: "Chemin vers votre objectif",
  chartGoalEmpty: "Définissez un objectif pour voir la projection.",
  monthShort: "m",
  legendSave: "Épargne",
  legendNeed: "Besoins",
  legendWant: "Envies",
  legendLeft: "Reste",
  theme: "Changer de thème",
  language: "Langue",
  footer: "Vos données restent dans ce navigateur.",
  lockSetupTitle: "Protégez vos données",
  lockSetupText:
    "Choisissez une phrase secrète. Vos données sont chiffrées sur cet appareil avec elle. Si vous l’oubliez, vos données seront irrécupérables.",
  lockUnlockTitle: "Mitsitsy est verrouillé",
  lockUnlockText: "Saisissez votre phrase secrète pour continuer.",
  passphrase: "Phrase secrète",
  passphraseConfirm: "Confirmez la phrase secrète",
  passphraseHint:
    "Au moins 10 caractères. Une phrase de plusieurs mots est idéale.",
  setupButton: "Chiffrer et commencer",
  unlockButton: "Déverrouiller",
  errTooShort: "La phrase secrète doit contenir au moins 10 caractères.",
  errMismatch: "Les phrases secrètes ne correspondent pas.",
  errWrong: "Phrase secrète incorrecte.",
  errWait: "Trop de tentatives. Attendez {n} secondes.",
  errUnsupported:
    "Le chiffrement n’est pas disponible ici. Ouvrez l’application en HTTPS.",
  lockNow: "Verrouiller maintenant",
  backupExport: "Exporter une sauvegarde chiffrée",
  backupImport: "Importer une sauvegarde",
  backupImportPass: "Phrase secrète de la sauvegarde",
  backupImportConfirm: "Restaurer",
  backupDone: "Sauvegarde restaurée.",
  backupBad: "Sauvegarde invalide ou phrase secrète incorrecte.",
  securityTitle: "Sécurité",
  securityText:
    "Chiffré sur cet appareil. Verrouillage après {n} minutes d’inactivité.",
  eraseAll: "Effacer toutes les données",
  eraseConfirm:
    "Effacer tout sur cet appareil ? Cette action est irréversible.",
  forgot: "Phrase secrète oubliée ? Effacer toutes les données",
  showPassphrase: "Afficher la phrase secrète",
  hidePassphrase: "Masquer la phrase secrète",

  tutorial: "Tutoriel",
  tutorialTitle: "Comment fonctionne Mitsitsy",
  tutorialWatch: "Voir le tutoriel",
  tutorialPrev: "Précédent",
  tutorialNext: "Suivant",
  tutorialStep: "Étape {n} sur {total}",
  tutorialVideo: "Version vidéo",
  tutorialVideoLoad: "Charger la vidéo",
  tutorialVideoNote: "Charger la vidéo contacte YouTube et nécessite internet.",
  backToApp: "Retour à l’application",
  settings: "Réglages",
  settingsAppearance: "Apparence",
  settingsAutoLock: "Verrouiller après inactivité",
  minutesN: "{n} min",
  settingsLockBackground: "Verrouiller quand je quitte l’application",
  settingsLockBackgroundHint:
    "Verrouille une minute après le passage en arrière-plan.",
  settingsChangePass: "Changer la phrase secrète",
  passCurrent: "Phrase secrète actuelle",
  passNew: "Nouvelle phrase secrète",
  passChanged: "Phrase secrète modifiée.",
  passChangeBad: "Phrase secrète actuelle incorrecte.",
  settingsData: "Vos données",
  settingsUnlockFirst:
    "Déverrouillez l’application pour gérer la sécurité et les données.",
  settingsGoUnlock: "Aller au déverrouillage",
  tutorialIntro:
    "Exercez-vous avec la vraie application : suivez les étapes en surbrillance. Rien de ce que vous saisissez ici n’est enregistré.",
  tutorialPractice:
    "Mode exercice : rien de ce que vous faites ici n’est enregistré.",
  tutorialDoIt: "Faites-le pour moi",
  tutorialSkip: "Passer",
  tutorialDone: "Terminé",
  tutorialFinishTitle: "Vous êtes prêt",
  tutorialFinishText:
    "Vos données d’exercice sont effacées. Vos vraies données démarrent vides et restent sur cet appareil.",
  tutorialStart: "Commencer à utiliser Mitsitsy",
  tutorialRestart: "Recommencer l’exercice",
  cryptoTitle: "Exercice : chiffrement",
  cryptoEncrypt: "Chiffrer",
  cryptoPlain: "Sans chiffrement, vos données ressembleraient à ceci :",
  cryptoStored: "Ce qui est réellement stocké :",
  cryptoTry: "Essayer de déverrouiller",
  cryptoOk: "Déverrouillé : la bonne phrase secrète déchiffre les données.",
  cryptoBad: "Échec : une mauvaise phrase secrète ne révèle rien.",
  tutorialExplain: "Voir l’explication",
  tutorialYourTurn: "À vous de jouer",
  tutorialWellDone: "Bravo. Appuyez sur Suivant pour continuer.",
  suggestTitle: "Budget mensuel suggéré",
  suggestIntro:
    "Indiquez où vous vivez. Nous proposons une liste de dépenses réduite selon votre salaire et les prix locaux.",
  placeLabel: "Où habitez-vous ?",
  placeChoose: "Choisissez un lieu",
  placeMadagascar: "Madagascar",
  placeOther: "Autre pays",
  placeSmallTown: "Petite ville ou village (Madagascar)",
  priceLevel: "Coût de la vie là-bas",
  price1: "Très bas",
  price2: "Bas",
  price3: "Moyen",
  price4: "Élevé",
  price5: "Très élevé",
  currencyLabel: "Devise",
  suggestNeedSalary:
    "Saisissez d’abord votre salaire pour voir les suggestions.",
  suggestTotal: "Total estimé : {total}",
  suggestCushion:
    "{cushion} reste libre chaque mois. Pensez à l’ajouter à votre épargne.",
  suggestApply: "Ajouter ces dépenses",
  suggestNote:
    "Ce sont des estimations, pas des prix exacts. Modifiez chaque dépense ensuite. Appliquer à nouveau remplace les suggestions précédentes et garde vos propres dépenses.",
  catHousing: "Loyer",
  catFood: "Nourriture",
  catTransport: "Transport",
  catUtilities: "Électricité et eau",
  catPhone: "Téléphone et internet",
  catHealth: "Santé",
  catLeisure: "Loisirs",
  salary: "Salaire mensuel",
  goalTarget: "Montant visé",
  goalSaved: "Déjà épargné",
};

const mg: Dict = {
  tag: "Mitahiry aloha",
  heroTitle: "Ny fomba tsara indrindra hitehirizana ny karamanao.",
  heroText:
    "Ny Mitsitsy dia mametraka ny fitehirizanao ho ambonin’ny zavatra rehetra: alohan’ny hofan-trano, alohan’ny fividianana, alohan’ny hafa rehetra. Mitahiry aloha ianao, avieo vao mandany ny sisa, ary manakaiky ny fotoana ahatratraranao izay tanjona napetrakao.",
  savingsShare: "Anjara hotehirizina: {pct}%",
  saveFirst: "Hotehirizina rehefa mandray karama",
  toSpend: "Holaniana",
  salaryShort: "Karama",
  overview: "Ity volana ity",
  spent: "Efa nandany",
  left: "Sisa holaniana",
  perDay: "Isan’andro",
  daysLeft: "{n} andro sisa",
  overspent:
    "Mihoatra {amount} ny teti-bolanao. Ahena ny faniriana, fa aza ny fitehirizana.",
  expensePlaceholder: "Fandaniana (ohatra: fitaterana)",
  amount: "Vola",
  need: "Filàna",
  want: "Faniriana",
  add: "Ampio",
  remove: "Fafao",
  noExpenses: "Mbola tsy misy fandaniana. Ampio ny voalohany etsy ambony.",
  newMonth: "Manomboka volana vaovao",
  goalTitle: "Tanjona fitehirizana",
  goalFor: "Ho an’ny inona?",
  goalForPlaceholder: "ohatra: solosaina finday",
  goalRemaining:
    "Mbola {remaining}. Raha {rate} isam-bolana ny fitehirizanao, ho tratra afaka {duration}.",
  durationDay: "{n} andro",
  durationDays: "{n} andro",
  durationMonth: "{n} volana",
  durationMonths: "{n} volana",
  durationYear: "{n} taona",
  durationYears: "{n} taona",
  goalReached: "Tratra ny tanjona. Arahaba!",
  goalHint:
    "Ampidiro ny karama sy ny anjara hotehirizina mba hanombanana ny fotoana.",
  addMonth: "Ampio ny fitehirizan’ity volana ity ({amount})",
  chartSplit: "Ny fizaran’ny karamanao",
  chartGoal: "Lalana mankany amin’ny tanjona",
  chartGoalEmpty: "Mametraha tanjona mba hahitana ny tetika.",
  monthShort: "v",
  legendSave: "Fitehirizana",
  legendNeed: "Filàna",
  legendWant: "Faniriana",
  legendLeft: "Sisa",
  theme: "Hanova endrika",
  language: "Fiteny",
  footer: "Mijanona ao amin’ity navigateur ity ny angonao.",
  lockSetupTitle: "Arovy ny angonao",
  lockSetupText:
    "Misafidiana teny miafina. Voasoratra mafina ao amin’ity fitaovana ity ny angonao amin’izany. Raha adinonao izany, tsy azo averina intsony ny angonao.",
  lockUnlockTitle: "Mihidy ny Mitsitsy",
  lockUnlockText: "Ampidiro ny teny miafinao mba hanohizana.",
  passphrase: "Teny miafina",
  passphraseConfirm: "Averino ny teny miafina",
  passphraseHint:
    "10 tarehintsoratra farafahakeliny. Tsara kokoa ny fehezanteny misy teny maromaro.",
  setupButton: "Asio fanafenana ary atomboka",
  unlockButton: "Sokafy",
  errTooShort:
    "Tsy maintsy misy 10 tarehintsoratra farafahakeliny ny teny miafina.",
  errMismatch: "Tsy mitovy ny teny miafina roa.",
  errWrong: "Diso ny teny miafina.",
  errWait: "Be loatra ny fanandramana. Andraso {n} segondra.",
  errUnsupported:
    "Tsy azo ampiasaina eto ny fanafenana. Sokafy amin’ny HTTPS ny rindrambaiko.",
  lockNow: "Hidio izao",
  backupExport: "Avoaka ny backup voasoratra mafina",
  backupImport: "Ampidiro ny backup",
  backupImportPass: "Teny miafin’ny backup",
  backupImportConfirm: "Averina",
  backupDone: "Voaverina ny backup.",
  backupBad: "Backup tsy mety na diso ny teny miafina.",
  securityTitle: "Fiarovana",
  securityText:
    "Voasoratra mafina ao amin’ity fitaovana ity. Mihidy aorian’ny {n} minitra tsy fampiasana.",
  eraseAll: "Fafana ny angona rehetra",
  eraseConfirm:
    "Fafana ny zavatra rehetra ao amin’ity fitaovana ity? Tsy azo averina izany.",
  forgot: "Adino ny teny miafina? Fafana ny angona rehetra",
  showPassphrase: "Asehoy ny teny miafina",
  hidePassphrase: "Afeno ny teny miafina",

  tutorial: "Fampianarana",
  tutorialTitle: "Ny fiasan’ny Mitsitsy",
  tutorialWatch: "Jereo ny fampianarana",
  tutorialPrev: "Teo Aloha",
  tutorialNext: "Manaraka",
  tutorialStep: "Dingana {n} amin’ny {total}",
  tutorialVideo: "Dikan-tsary video",
  tutorialVideoLoad: "Ampidina ny video",
  tutorialVideoNote:
    "Mifandray amin’ny YouTube ny fampidinana ny video ary mila internet.",
  backToApp: "Hiverina amin’ny rindrambaiko",
  settings: "Fandrindrana",
  settingsAppearance: "Endrika",
  settingsAutoLock: "Hidio rehefa tsy ampiasaina",
  minutesN: "{n} min",
  settingsLockBackground: "Hidio rehefa miala amin’ny rindrambaiko aho",
  settingsLockBackgroundHint:
    "Mihidy iray minitra aorian’ny fandehanana ao ambadika.",
  settingsChangePass: "Ovay ny teny miafina",
  passCurrent: "Teny miafina ankehitriny",
  passNew: "Teny miafina vaovao",
  passChanged: "Voaova ny teny miafina.",
  passChangeBad: "Diso ny teny miafina ankehitriny.",
  settingsData: "Ny angonao",
  settingsUnlockFirst:
    "Sokafy ny rindrambaiko mba hitantanana ny fiarovana sy ny angona.",
  settingsGoUnlock: "Mankanesa hisokatra",
  tutorialIntro:
    "Mampiasà ny rindrambaiko tena izy: arahy ny dingana misongadina. Tsy voatahiry ny zavatra soratanao eto.",
  tutorialPractice:
    "Fomba fampiharana: tsy voatahiry ny zavatra rehetra atao eto.",
  tutorialDoIt: "Ataovy ho ahy",
  tutorialSkip: "Lasa",
  tutorialDone: "Vita",
  tutorialFinishTitle: "Vonona ianao",
  tutorialFinishText:
    "Foana ny angona fampiharana. Manomboka foana ny angonao tena izy ary mijanona ao amin’ity fitaovana ity.",
  tutorialStart: "Atombohy ny fampiasana ny Mitsitsy",
  tutorialRestart: "Avereno ny fampiharana",
  cryptoTitle: "Fampiharana: fanafenana",
  cryptoEncrypt: "Asio fanafenana",
  cryptoPlain: "Raha tsy misy fanafenana, toy izao no hiseho ny angonao:",
  cryptoStored: "Izay tena voatahiry:",
  cryptoTry: "Andramo ny hanokatra",
  cryptoOk: "Nisokatra: ny teny miafina marina no mamoha ny angona.",
  cryptoBad: "Tsy nety: tsy mamoaka na inona na inona ny teny miafina diso.",
  tutorialExplain: "Jereo ny fanazavana",
  tutorialYourTurn: "Anjaranao",
  tutorialWellDone: "Tsara izany. Tsindrio ny Manaraka mba hanohy.",
  suggestTitle: "Teti-bola isam-bolana soso-kevitra",
  suggestIntro:
    "Lazao izahay izay toerana onenanao. Hanolotra lisitry ny fandaniana voafetra izahay araka ny karamanao sy ny vidin-javatra eo an-toerana.",
  placeLabel: "Aiza no onenanao?",
  placeChoose: "Fidio ny toerana",
  placeMadagascar: "Madagasikara",
  placeOther: "Firenena hafa",
  placeSmallTown: "Tanàna kely na vohitra (Madagasikara)",
  priceLevel: "Ny fiainana ao",
  price1: "Ambany dia ambany",
  price2: "Ambany",
  price3: "Antonony",
  price4: "Avo",
  price5: "Avo dia avo",
  currencyLabel: "Vola",
  suggestNeedSalary: "Ampidiro aloha ny karamanao hahitana ny soso-kevitra.",
  suggestTotal: "Totalin’ny tombana: {total}",
  suggestCushion:
    "Mijanona malalaka isam-bolana ny {cushion}. Heveriko fa tsara raha ampiana amin’ny fitehirizana.",
  suggestApply: "Ampio ireo fandaniana ireo",
  suggestNote:
    "Tombana ihany ireo, fa tsy vidiny marina. Ovay ny fandaniana tsirairay aorian’izay. Ny fampiharana indray dia manolo ny soso-kevitra teo aloha ary mitazona ny fandaniana nampidirinao.",
  catHousing: "Hofan-trano",
  catFood: "Sakafo",
  catTransport: "Fitaterana",
  catUtilities: "Jirama (jiro sy rano)",
  catPhone: "Finday sy internet",
  catHealth: "Fahasalamana",
  catLeisure: "Fialamboly",
  salary: "Karama isam-bolana",
  goalTarget: "Vola tiana ho tratra",
  goalSaved: "Efa voatahiry",
};

const dictionaries: Record<Lang, Dict> = { en, fr, mg };

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);
const LANG_KEY = "mitsitsy:lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "fr" || saved === "mg") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: Key, vars?: Record<string, string | number>) => {
      let text = dictionaries[lang][key];
      if (vars)
        for (const [k, v] of Object.entries(vars))
          text = text.replaceAll(`{${k}}`, String(v));
      return text;
    },
    [lang],
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
