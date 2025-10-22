'use client';
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
export default function Return({ params }:{ params:{ locale:string } }){
  const sp = useSearchParams(); const status = sp.get('status') || 'success'; const id = sp.get('orderId') || 'n/a';
  const { clear } = useCart(); if (status==='success') clear();
  return (<div className="card p-6 space-y-2"><div className="text-xl font-semibold">{status==='success'?'Payment successful':'Payment failed'}</div><div className="text-sm opacity-70">Order ID: {id}</div><Link href={`/${params.locale}`} className="btn-primary inline-block">Back to Home</Link></div>);
}
