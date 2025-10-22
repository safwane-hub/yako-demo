'use client';

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";

type Props = {
  locale: string;
  status: string;
  orderId: string;
};

export default function ReturnContent({ locale, status, orderId }: Props) {
  const { clear } = useCart();

  useEffect(() => {
    if (status === "success") clear();
  }, [status, clear]);

  return (
    <div className="card p-6 space-y-2">
      <div className="text-xl font-semibold">
        {status === "success" ? "Payment successful" : "Payment failed"}
      </div>
      <div className="text-sm opacity-70">Order ID: {orderId}</div>
      <Link href={`/${locale}`} className="btn-primary inline-block">
        Back to Home
      </Link>
    </div>
  );
}
