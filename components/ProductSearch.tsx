"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS, getLocalizedCopy, type Product } from "@/lib/products";
import { useT } from "@/lib/i18n";

type ProductSearchProps = {
  locale: string;
};

const MAX_RESULTS = 6;

function normalize(value: string) {
  const lower = value.toLocaleLowerCase();
  try {
    return lower.normalize("NFKD").replace(/\p{Diacritic}/gu, "");
  } catch {
    return lower;
  }
}

type SearchCandidate = {
  product: Product;
  terms: string[];
};

type SearchResult = {
  product: Product;
  score: number;
};

export function ProductSearch({ locale }: ProductSearchProps) {
  const t = useT();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const candidates: SearchCandidate[] = useMemo(() => {
    return PRODUCTS.map((product) => {
      const localizedDescription = getLocalizedCopy(product.description, locale);
      const terms = [
        product.title,
        product.brand,
        localizedDescription,
        ...(product.tags ?? []),
      ]
        .filter(Boolean)
        .map((term) => normalize(term));

      return { product, terms };
    });
  }, [locale]);

  const results: SearchResult[] = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const normalizedNeedle = normalize(trimmed);

    return candidates
      .map((entry) => {
        const matchIndex = entry.terms.findIndex((haystack) =>
          haystack.includes(normalizedNeedle)
        );

        if (matchIndex === -1) {
          return null;
        }

        return {
          product: entry.product,
          score: matchIndex,
        } satisfies SearchResult;
      })
      .filter((value): value is SearchResult => value !== null)
      .sort((a, b) => {
        if (a.score === b.score) {
          return a.product.title.localeCompare(b.product.title);
        }

        return a.score - b.score;
      })
      .slice(0, MAX_RESULTS);
  }, [candidates, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results.length, query]);

  useEffect(() => {
    if (!results.length) return;
    results.forEach((entry) => {
      const href = `/${locale}/product/${entry.product.slug}`;
      if (typeof router.prefetch === "function") {
        try {
          router.prefetch(href);
        } catch {
          /* noop */
        }
      }
    });
  }, [locale, results, router]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null;
        const isTyping =
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.getAttribute("contenteditable") === "true");

        if (!isTyping) {
          event.preventDefault();
          inputRef.current?.focus();
          setOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!query) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [query]);

  const handleSelect = (product: Product) => {
    const href = `/${locale}/product/${product.slug}`;
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div className="relative w-full max-w-xs" ref={containerRef}>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (!results.length) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((prev) => (prev + 1) % results.length);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
          } else if (event.key === "Enter") {
            if (results[activeIndex]) {
              event.preventDefault();
              handleSelect(results[activeIndex].product);
            }
          } else if (event.key === "Escape") {
            setOpen(false);
            setQuery("");
            inputRef.current?.blur();
          }
        }}
        placeholder={t("search.placeholder")}
        aria-label={t("search.ariaLabel")}
        className="w-full rounded-xl border border-white/30 bg-white/70 px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/40 dark:border-white/10 dark:bg-white/10 dark:text-white"
      />

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-black/10 bg-white/95 shadow-lg backdrop-blur dark:border-white/10 dark:bg-darkbg/90">
          {results.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto py-2">
              {results.map((entry, index) => {
                const { product } = entry;
                const isActive = index === activeIndex;
                const href = `/${locale}/product/${product.slug}`;

                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      className={`flex w-full items-start gap-3 px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? "bg-primary-500/10 text-primary-700 dark:text-primary-300"
                          : "hover:bg-black/5 dark:hover:bg-white/10"
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => handleSelect(product)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{product.title}</div>
                        <div className="text-xs opacity-70">
                          {product.brand} - {product.currency}
                        </div>
                      </div>
                      <span className="text-xs opacity-60">{href}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-foreground/60">
              {t("search.noResults")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
