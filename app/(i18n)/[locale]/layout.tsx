// app/(i18n)/[locale]/layout.tsx
import "../../globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { ThemeWrap } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import { locales, type Locale, isRTL } from "@/lib/utils";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "YAKOGAME — Digital Gift Cards",
  description: "Fast, elegant store for vouchers & gift cards"
};

export function generateStaticParams() {
  return locales.map((l) => ({ locale: l }));
}

// Use a plain record keyed by string to avoid runtime key mismatches
const LOADERS: Record<string, () => Promise<Record<string, string>>> = {
  en: () => import("@/locales/en/common.json").then((m) => m.default),
  fr: () => import("@/locales/fr/common.json").then((m) => m.default),
  ar: () => import("@/locales/ar/common.json").then((m) => m.default),
};

const brandSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const arabicSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale | string };
}) {
  const locale = (params.locale || "en") as string;

  // ✅ Safe fallback if someone hits /xx or a weird value
  const load = LOADERS[locale] ?? LOADERS.en;
  const messages = await load();

  return (
    <html
      lang={locale}
      dir={isRTL(locale as any) ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${brandSans.variable} ${arabicSans.variable}`}
    >
      <body suppressHydrationWarning>
        <ThemeWrap>
          <I18nProvider messages={messages}>
            <Header locale={locale as any} />
            <main className="container py-6">{children}</main>
            <footer className="container py-10 text-sm opacity-70">
              © {new Date().getFullYear()} YAKOGAME
            </footer>
          </I18nProvider>
        </ThemeWrap>
      </body>
    </html>
  );
}
