'use client';
import { useCart, applyNapsFee } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/lib/i18n";

export default function Checkout({ params }: { params: { locale: string } }) {
  const { items, method, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const t = useT();
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const total = method === "NAPS" ? applyNapsFee(subtotal) : subtotal;
  const router = useRouter();
  const pay = () => {
    const orderId = crypto.randomUUID();
    router.push(`/${params.locale}/checkout/return?status=success&orderId=${orderId}`);
  };
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
      <div className="card space-y-3 p-4 sm:p-6">
        <div>
          <label className="text-sm">{t("checkout.fullName")}</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">{t("checkout.email")}</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div className="card space-y-2 p-4 sm:p-6">
        <div className="text-sm">
          {t("items")}: {items.length}
        </div>
        <div className="text-sm">
          {t("subtotal")}: {subtotal.toFixed(2)}
        </div>
        <div className="text-sm font-semibold">
          {t("total")} ({t("naps")}): {total.toFixed(2)}
        </div>
        <button className="btn-primary w-full" onClick={pay}>
          {t("payWithNaps")}
        </button>
      </div>
    </div>
  );
}
