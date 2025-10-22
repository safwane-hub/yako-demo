'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const segs = pathname.split("/").filter(Boolean);
  const current = segs[0] || "en";
  const to = (locale: string) => "/" + [locale, ...segs.slice(1)].join("/");

  return (
    <div className="flex gap-2">
      {["en", "fr", "ar"].map((locale) => (
        <Link
          key={locale}
          href={to(locale)}
          prefetch
          className={locale === current ? "font-semibold" : "opacity-70 hover:opacity-100"}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
