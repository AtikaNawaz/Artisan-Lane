"use client";

import Link from "next/link";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { useCatalogStore } from "@/store/catalogStore";

export function ProductPageClient({ slug }: { slug: string }) {
  const getBySlug = useCatalogStore((s) => s.getBySlug);
  const getByArtisan = useCatalogStore((s) => s.getByArtisan);
  const extras = useCatalogStore((s) => s.extras);
  const overrides = useCatalogStore((s) => s.overrides);
  const deletedIds = useCatalogStore((s) => s.deletedIds);
  void extras;
  void overrides;
  void deletedIds;

  const product = getBySlug(slug);
  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-brand-800">Product not found</h1>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">
          Back to shop
        </Link>
      </div>
    );
  }

  const related = getByArtisan(product.artisanId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
