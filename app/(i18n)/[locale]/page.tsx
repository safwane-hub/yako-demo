"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function Home() {
  const t = useT();

  return (
    <section className="card p-8">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl font-semibold">{t("home.title")}</h1>
          <p className="mt-2 opacity-75">{t("home.subtitle")}</p>
          <div className="mt-4 flex gap-3">
            <Link href="./catalog" className="btn-primary">
              {t("home.cta")}
            </Link>
            <Link href="./checkout" className="btn-ghost border">
              {t("checkout")}
            </Link>
          </div>
        </div>
        <div className="h-56 rounded-2xl bg-gradient-to-br from-primary-500/20 to-white/10 border flex items-center justify-center">
          <img src="/logo.svg" alt="logo" className="h-24 w-24" />
        </div>
      </div>
    </section>
  );
}
