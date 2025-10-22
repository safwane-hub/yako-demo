import { PRODUCTS, getLocalizedCopy } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductActions from "./parts";

export default function ProductPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const product = PRODUCTS.find((item) => item.slug === params.slug);

  if (!product) return notFound();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <img src={product.image} alt={product.title} className="rounded-2xl w-full aspect-[5/3]" />
      <div>
        <div className="text-sm opacity-60">{product.brand}</div>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="mt-3 text-sm text-foreground/70">
          {getLocalizedCopy(product.description, params.locale)}
        </p>
        <ProductActions product={product} locale={params.locale} />
      </div>
    </div>
  );
}
