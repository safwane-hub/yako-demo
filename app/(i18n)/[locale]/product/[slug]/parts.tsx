"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { useT } from "@/lib/i18n";
import type { Product, VariablePricing } from "@/lib/products";
import { getLocalizedCopy } from "@/lib/products";

type ProductActionsProps = {
  product: Product;
  locale: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function ProductActions({ product, locale }: ProductActionsProps) {
  const { pricing } = product;
  const addToCart = useCart((state) => state.add);
  const t = useT();

  const fixedOptions = useMemo(() => {
    return pricing.type === "fixed"
      ? [...pricing.denominations].sort((a, b) => a - b)
      : [];
  }, [pricing]);

  const initialAmount = useMemo(() => {
    if (pricing.type === "fixed") {
      return Math.min(...pricing.denominations);
    }

    const fallback = pricing.defaultAmount ?? pricing.min;
    return clamp(fallback, pricing.min, pricing.max);
  }, [pricing]);

  const [selectedAmount, setSelectedAmount] = useState(initialAmount);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSelectedAmount(initialAmount);
  }, [initialAmount, product.id]);

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: selectedAmount,
      qty: 1,
      currency: product.currency,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleManualChange = (value: string) => {
    if (!value) return;
    const next = Number(value);
    if (Number.isNaN(next)) return;
    if (pricing.type === "variable") {
      setSelectedAmount(clamp(next, pricing.min, pricing.max));
    }
  };

  return (
    <div className="mt-6 space-y-5">
      {pricing.type === "fixed" ? (
        <div className="flex flex-wrap gap-2">
          {fixedOptions.map((value) => {
            const isActive = value === selectedAmount;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedAmount(value)}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-primary-500 bg-primary-500/10 text-primary-600"
                    : "border-white/20 bg-white/70 text-foreground/80 hover:border-primary-200 hover:text-primary-600 dark:border-white/10 dark:bg-white/10"
                }`}
                aria-pressed={isActive}
              >
                {value} {product.currency}
              </button>
            );
          })}
        </div>
      ) : (
        <VariableAmountPicker
          pricing={pricing}
          currency={product.currency}
          selectedAmount={selectedAmount}
          onSelect={setSelectedAmount}
          onManualChange={handleManualChange}
          locale={locale}
        />
      )}

      <div className="text-sm text-foreground/70">
        {selectedAmount} {product.currency}
      </div>

      <button
        className={`w-full sm:w-auto ${added ? "btn-ghost border" : "btn-primary"}`}
        onClick={handleAdd}
      >
        {added ? t("added") : t("addToCart")}
      </button>
    </div>
  );
}

type VariableAmountPickerProps = {
  pricing: VariablePricing;
  currency: string;
  selectedAmount: number;
  onSelect: (value: number) => void;
  onManualChange: (value: string) => void;
  locale: string;
};

function VariableAmountPicker({
  pricing,
  currency,
  selectedAmount,
  onSelect,
  onManualChange,
  locale,
}: VariableAmountPickerProps) {
  const suggestions = pricing.suggested
    ? [...pricing.suggested].sort((a, b) => a - b)
    : [];

  return (
    <div className="space-y-3">
      {pricing.label && (
        <p className="text-xs uppercase tracking-wide text-foreground/60">
          {getLocalizedCopy(pricing.label, locale)}
        </p>
      )}

      {suggestions.length ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((value) => {
            const isActive = value === selectedAmount;

            return (
              <button
                key={`suggested-${value}`}
                type="button"
                onClick={() => onSelect(value)}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-primary-500 bg-primary-500/10 text-primary-600"
                    : "border-white/20 bg-white/70 text-foreground/80 hover:border-primary-200 hover:text-primary-600 dark:border-white/10 dark:bg-white/10"
                }`}
                aria-pressed={isActive}
              >
                {value} {currency}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={pricing.min}
          max={pricing.max}
          step={pricing.step ?? 1}
          value={selectedAmount}
          onChange={(event) => onSelect(Number(event.target.value))}
          className="flex-1 cursor-pointer accent-primary-600"
        />
        <input
          type="number"
          min={pricing.min}
          max={pricing.max}
          step={pricing.step ?? 1}
          value={selectedAmount}
          onChange={(event) => onManualChange(event.target.value)}
          className="w-24 rounded border border-white/20 bg-white/70 px-2 py-1 text-sm text-foreground dark:border-white/10 dark:bg-white/10"
        />
      </div>

      <p className="text-xs text-foreground/60">
        {pricing.min} - {pricing.max} {currency}
      </p>
    </div>
  );
}
