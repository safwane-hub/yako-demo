import type { Locale } from "./utils";

export type Currency = "MAD" | "EUR" | "USD";
export type ProductCategory = "gaming" | "entertainment" | "shopping" | "mobile" | "gift";

export type LocalizedField = {
  en: string;
  fr: string;
  ar: string;
};

export function getLocalizedCopy(field: LocalizedField, locale: Locale | string) {
  const key = locale as keyof LocalizedField;
  if (typeof field[key] === "string") {
    return field[key];
  }
  return field.en;
}

export type FixedPricing = {
  type: "fixed";
  denominations: number[];
};

export type VariablePricing = {
  type: "variable";
  min: number;
  max: number;
  step?: number;
  defaultAmount?: number;
  suggested?: number[];
  label?: LocalizedField;
};

export type PricingModel = FixedPricing | VariablePricing;

export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  currency: Currency;
  image: string;
  category: ProductCategory;
  description: LocalizedField;
  highlights?: LocalizedField;
  pricing: PricingModel;
  tags?: string[];
};

export const FAKE_VOUCHER_DATA = {
  source: "yakogame-fake-seed",
  generatedAt: "2024-05-01T08:00:00.000Z",
  products: [
    {
      id: "ps-store-mad",
      slug: "playstation-store-morocco",
      title: "PlayStation Wallet",
      brand: "PlayStation",
      currency: "MAD",
      image: "/cards/1.svg",
      category: "gaming",
      description: {
        en: "Top up your PlayStation Store wallet for Moroccan accounts.",
        fr: "Rechargez votre portefeuille PlayStation Store pour les comptes marocains.",
        ar: "اشحن محفظة PlayStation Store لحسابات المغرب.",
      },
      pricing: {
        type: "fixed",
        denominations: [50, 100, 200, 400],
      },
      tags: ["console", "sony", "wallet"],
    },
    {
      id: "netflix-mena",
      slug: "netflix-mena",
      title: "Netflix Gift Code",
      brand: "Netflix",
      currency: "MAD",
      image: "/cards/2.svg",
      category: "entertainment",
      description: {
        en: "Stream the latest series and films with prepaid Netflix credit.",
        fr: "Regardez les s\u00e9ries et films les plus r\u00e9cents avec un cr\u00e9dit Netflix pr\u00e9pay\u00e9.",
        ar: "شاهد أحدث المسلسلات والأفلام باستخدام رصيد Netflix مسبق الدفع.",
      },
      pricing: {
        type: "fixed",
        denominations: [70, 100, 150, 250],
      },
      tags: ["streaming"],
    },
    {
      id: "spotify-premium",
      slug: "spotify-premium",
      title: "Spotify Premium",
      brand: "Spotify",
      currency: "EUR",
      image: "/cards/3.svg",
      category: "entertainment",
      description: {
        en: "Ad-free music, playlists and podcasts with flexible top ups.",
        fr: "Musique, playlists et podcasts sans publicit\u00e9 avec recharges flexibles.",
        ar: "استمتع بالموسيقى وقوائم التشغيل والبودكاست بدون إعلانات مع رصيد مرن.",
      },
      pricing: {
        type: "variable",
        min: 10,
        max: 100,
        step: 5,
        defaultAmount: 30,
        suggested: [15, 30, 60],
        label: {
          en: "Select the credit you want to send",
          fr: "Choisissez le montant à envoyer",
          ar: "اختر رصيد الإرسال",
        },
      },
      tags: ["music", "subscription"],
    },
    {
      id: "xbox-live-gold",
      slug: "xbox-live-gold",
      title: "Xbox Live Gold",
      brand: "Xbox",
      currency: "MAD",
      image: "/cards/4.svg",
      category: "gaming",
      description: {
        en: "Multiplayer access, monthly games and store credit.",
        fr: "Acc\u00e8s multijoueur, jeux mensuels et cr\u00e9dit boutique.",
        ar: "وصول إلى اللعب الجماعي، ألعاب شهرية ورصيد المتجر.",
      },
      pricing: {
        type: "fixed",
        denominations: [80, 160, 320],
      },
      tags: ["console", "microsoft"],
    },
    {
      id: "steam-global",
      slug: "steam-global",
      title: "Steam Global Wallet",
      brand: "Steam",
      currency: "USD",
      image: "/cards/5.svg",
      category: "gaming",
      description: {
        en: "Redeem worldwide for games, DLC and software on Steam.",
        fr: "Utilisez-le dans le monde entier pour des jeux, DLC et logiciels sur Steam.",
        ar: "استخدمه عالميًا للألعاب والمحتويات الإضافية والبرامج على Steam.",
      },
      pricing: {
        type: "variable",
        min: 5,
        max: 200,
        step: 5,
        defaultAmount: 20,
        suggested: [10, 20, 50, 100],
        label: {
          en: "Pick a wallet amount",
          fr: "Choisissez un montant de portefeuille",
          ar: "اختر مبلغ المحفظة",
        },
      },
      tags: ["pc", "global"],
    },
    {
      id: "universal-digital-visa",
      slug: "universal-digital-visa",
      title: "Universal Digital VISA",
      brand: "VISA",
      currency: "USD",
      image: "/cards/4.svg",
      category: "gift",
      description: {
        en: "Flexible prepaid VISA for online shopping anywhere in the world.",
        fr: "Carte VISA pr\u00e9pay\u00e9e flexible pour vos achats en ligne partout dans le monde.",
        ar: "بطاقة فيزا مسبقة الدفع مرنة للتسوق الإلكتروني في أي مكان حول العالم.",
      },
      pricing: {
        type: "variable",
        min: 25,
        max: 500,
        step: 25,
        defaultAmount: 100,
        suggested: [50, 100, 250, 500],
        label: {
          en: "Set the amount to load onto the card",
          fr: "Définissez le montant à charger sur la carte",
          ar: "حدد المبلغ الذي تريد شحنه على البطاقة",
        },
      },
      tags: ["universal", "prepaid"],
    },
  ] satisfies Product[],
} as const;

export const PRODUCTS: Product[] = FAKE_VOUCHER_DATA.products;
