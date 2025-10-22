"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function Home() {
  const t = useT();

  return (
    <section className="card p-6 sm:p-8">
      <div className="grid gap-6 items-center md:grid-cols-2 md:gap-8">
        <div>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{t("home.title")}</h1>
          <p className="mt-2 text-sm opacity-75 sm:text-base">{t("home.subtitle")}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:flex-nowrap">
            <Link href="./catalog" className="btn-primary w-full sm:w-auto">
              {t("home.cta")}
            </Link>
            <Link href="./checkout" className="btn-ghost border w-full sm:w-auto">
              {t("checkout")}
            </Link>
          </div>
        </div>
        <div className="flex h-48 items-center justify-center rounded-2xl border bg-gradient-to-br from-primary-500/20 to-white/10 sm:h-56">
          <img src="/logo.svg" alt="logo" className="h-20 w-20 sm:h-24 sm:w-24" />
        </div>
      </div>
    </section>
  );
}
