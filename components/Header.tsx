// components/Header.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ProductSearch } from "./ProductSearch";
import { useT } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

type NavKey = "catalog" | "cart" | "account";

export function Header({ locale }: { locale: "en" | "fr" | "ar" | string }) {
  const t = useT();
  const count = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const navLinks = useMemo(
    () =>
      (["catalog", "cart", "account"] satisfies NavKey[]).map((key) => ({
        key,
        href: `/${locale}/${key === "catalog" ? "catalog" : key}`,
        label: t(key),
      })),
    [locale, t]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    navLinks.forEach((link) => {
      if (typeof router.prefetch === "function") {
        try {
          // Proactively warm the route cache so the switch feels instant.
          router.prefetch(link.href);
        } catch {
          /* ignore warm-up errors */
        }
      }
    });
  }, [navLinks, router]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur bg-white/60 dark:bg-darkbg/60">
      <div className="container h-14 flex items-center gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="YAKOGAME" className="h-7 w-7" />
          <span>YAKOGAME</span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden sm:block w-full max-w-xs">
            <ProductSearch locale={locale} />
          </div>
          <nav className="flex items-center gap-4 text-sm">
            {navLinks.map((link) => {
              const isActive =
                mounted &&
                (pathname === link.href ||
                  (!!pathname && pathname.startsWith(`${link.href}/`)));

              return (
                <Link
                  key={link.key}
                  href={link.href}
                  prefetch
                  data-active={isActive ? "true" : undefined}
                  className={`relative px-2 py-1 rounded-md transition-colors ${
                    isActive
                      ? "text-primary-600 font-semibold bg-primary-500/10"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  {link.key === "cart" && count > 0 && (
                    <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
            <LocaleSwitcher />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
