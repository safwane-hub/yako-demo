// components/Header.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

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

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  const renderLink = (link: (typeof navLinks)[number]) => {
    const isActive =
      mounted &&
      (pathname === link.href || (!!pathname && pathname.startsWith(`${link.href}/`)));

    return (
      <Link
        key={link.key}
        href={link.href}
        prefetch
        data-active={isActive ? "true" : undefined}
        className={`relative px-3 py-2 rounded-md transition-colors ${
          isActive
            ? "text-primary-600 font-semibold bg-primary-500/10"
            : "text-foreground/80 hover:text-foreground"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {link.label}
        {link.key === "cart" && count > 0 && (
          <span className="absolute -top-2 -right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] text-white">
            {count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/70 backdrop-blur dark:bg-darkbg/70">
      <div className="container flex h-14 items-center gap-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="YAKOGAME" className="h-7 w-7" />
          <span>YAKOGAME</span>
        </Link>

        <div className="ml-auto flex flex-1 items-center justify-end gap-3">
          <div className="hidden md:flex min-w-[180px] flex-1 justify-end">
            <ProductSearch locale={locale} className="max-w-md" />
          </div>
          <nav className="hidden sm:flex items-center gap-3 text-sm">
            {navLinks.map(renderLink)}
            <LocaleSwitcher />
            <ThemeToggle />
          </nav>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent bg-white/70 text-sm font-medium text-foreground/80 shadow-sm transition hover:bg-white dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:hidden"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden fixed inset-0 z-30">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div className="absolute top-14 left-0 right-0">
            <div className="container">
              <div
                id="mobile-navigation"
                className="card overflow-hidden border border-black/10 bg-white/95 p-4 shadow-xl dark:border-white/10 dark:bg-darkbg/95"
              >
                <div className="space-y-4">
                  <ProductSearch locale={locale} className="w-full" />
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={`mobile-${link.key}`}
                        href={link.href}
                        className="rounded-lg px-3 py-2 text-sm text-foreground/80 transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                        onClick={closeMenu}
                      >
                        {link.label}
                        {link.key === "cart" && count > 0 && (
                          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] text-white">
                            {count}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 border-t border-black/10 pt-3 dark:border-white/10">
                    <LocaleSwitcher />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
