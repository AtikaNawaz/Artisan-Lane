"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPKR, cn } from "@/lib/utils";
import { getArtisanById } from "@/data/artisans";
import { StarRating } from "./StarRating";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const artisan = getArtisanById(product.artisanId);
  const toggle = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.productIds.includes(product.id));
  const addItem = useCartStore((s) => s.addItem);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>
        {product.launchCollection && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-700 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
            Launch
          </span>
        )}
        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105",
            wished && "text-brand-700"
          )}
        >
          <Heart size={16} className={wished ? "fill-brand-700" : ""} />
        </button>
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        {artisan && (
          <Link
            href={`/artisan/${artisan.slug}`}
            className="text-xs font-medium uppercase tracking-wider text-accent-600 hover:text-brand-700"
          >
            {artisan.shopName}
          </Link>
        )}
        <Link href={`/product/${product.slug}`} className="mt-1">
          <h3 className="font-serif text-lg leading-snug text-brand-800 transition group-hover:text-brand-600">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5">
          <StarRating rating={product.rating} count={product.reviewCount} size={12} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="font-semibold text-brand-800">{formatPKR(product.price)}</p>
            {product.compareAtPrice && (
              <p className="text-xs text-stone-400 line-through">
                {formatPKR(product.compareAtPrice)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => addItem(product.id)}
            className="rounded-full bg-brand-700 px-3 py-1.5 text-xs font-semibold text-cream opacity-100 transition hover:bg-brand-800 sm:opacity-0 sm:group-hover:opacity-100"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
