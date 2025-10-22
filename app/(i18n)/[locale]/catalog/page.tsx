"use client";

import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { useT } from "@/lib/i18n";

export default function Catalog({ params }: { params: { locale: string } }) {
  const t = useT();

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {PRODUCTS.map((p) => (
        <Link
          key={p.id}
          href={`/${params.locale}/product/${p.slug}`}
          className="card p-3 hover:shadow"
        >
          <img src={p.image} alt={p.title} className="rounded-xl mb-3 w-full aspect-[5/3]" />
          <div className="text-sm opacity-70">{p.brand}</div>
          <div className="font-semibold">{p.title}</div>
          <div className="text-xs mt-1">
            {t("from")}{" "}
            {p.pricing.type === "fixed"
              ? Math.min(...p.pricing.denominations)
              : p.pricing.min}{" "}
            {p.currency}
            {p.pricing.type === "variable" ? "+" : ""}
          </div>
        </Link>
      ))}
    </div>
  );
}
