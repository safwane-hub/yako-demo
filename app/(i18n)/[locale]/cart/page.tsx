'use client';
import Link from "next/link";
import { useCart, applyNapsFee } from "@/lib/cart";
import { useT } from "@/lib/i18n";

export default function Cart({ params }: { params: { locale: string } }) {
  const { items, remove, method, setMethod } = useCart();
  const t = useT();
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const total = method === "NAPS" ? applyNapsFee(subtotal) : subtotal;

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="card p-6">{t("cart.empty")}</div>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <div
              key={i.productId}
              className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-medium">{i.title}</div>
                <div className="text-xs opacity-60">
                  {i.price} {i.currency} A- {i.qty}
                </div>
              </div>
              <button
                className="self-start text-sm text-red-500 transition hover:text-red-600 sm:self-auto"
                onClick={() => remove(i.productId)}
              >
                {t("remove")}
              </button>
            </div>
          ))}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="text-sm">{t("paymentMethod")}</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="select w-full sm:w-auto"
            >
              <option value="NAPS">{t("naps")}</option>
              <option value="PAYPAL" disabled>
                {t("payment.paypalSoon")}
              </option>
              <option value="CARD" disabled>
                {t("payment.cardSoon")}
              </option>
            </select>
          </div>
          <div className="text-sm">
            {t("items")}: {items.length}
          </div>
          <div className="text-sm">
            {t("subtotal")}: {subtotal.toFixed(2)}
          </div>
          <div className="text-sm font-semibold">
            {t("total")}: {total.toFixed(2)}
          </div>
          <Link
            href={`/${params.locale}/checkout`}
            className="btn-primary inline-block w-full sm:w-auto"
          >
            {t("checkout")}
          </Link>
        </div>
      )}
    </div>
  );
}
