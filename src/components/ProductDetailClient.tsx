"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle, ShoppingBag, Zap } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPKR } from "@/lib/utils";
import { getArtisanById } from "@/data/artisans";
import { categories } from "@/data/categories";
import { StarRating } from "@/components/StarRating";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useMessageStore } from "@/store/messageStore";
import { useReviewStore } from "@/store/reviewStore";
import { usePlatformStore } from "@/store/platformStore";
import { useRouter } from "next/navigation";

export function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const seedArtisan = getArtisanById(product.artisanId);
  const approved = usePlatformStore((s) =>
    s.approvedArtisans.find((a) => a.id === product.artisanId)
  );
  const artisan = seedArtisan ?? approved;
  const category = categories.find((c) => c.id === product.categoryId);
  const getForProduct = useReviewStore((s) => s.getForProduct);
  const extras = useReviewStore((s) => s.extras);
  void extras;
  const reviews = getForProduct(product.id);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.productIds.includes(product.id));
  const user = useAuthStore((s) => s.user);
  const sendMessage = useMessageStore((s) => s.sendMessage);
  const router = useRouter();

  function buyNow() {
    addItem(product.id, qty);
    router.push("/checkout");
  }

  function contactSeller(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !artisan) return;
    const buyerId = user?.id ?? "demo_buyer";
    const buyerName = user?.name ?? "Guest Buyer";
    sendMessage({
      buyerId,
      buyerName,
      sellerId: artisan.id,
      sellerName: artisan.name,
      senderId: buyerId,
      senderName: buyerName,
      recipientId: artisan.id,
      body: message,
      productId: product.id,
      productName: product.name,
    });
    setSent(true);
    setMessage("");
  }

  if (!artisan) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-brand-800">{product.name}</h1>
        <p className="mt-2 text-stone-500">Maker profile is being prepared.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/shop" className="hover:text-brand-700">
          Shop
        </Link>
        <span className="mx-2">/</span>
        {category && (
          <>
            <Link href={`/shop?category=${category.slug}`} className="hover:text-brand-700">
              {category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-brand-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <div className="mt-3 flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative h-20 w-20 overflow-hidden rounded-xl ring-2 ${
                  i === activeImage ? "ring-brand-700" : "ring-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Link
            href={`/artisan/${artisan.slug}`}
            className="text-sm font-semibold uppercase tracking-wider text-accent-700"
          >
            {artisan.shopName}
          </Link>
          <h1 className="mt-2 font-serif text-4xl text-brand-800">{product.name}</h1>
          <div className="mt-3">
            <StarRating
              rating={product.rating}
              count={product.reviewCount}
              showValue
              size={16}
            />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-3xl font-semibold text-brand-800">{formatPKR(product.price)}</p>
            {product.compareAtPrice && (
              <p className="text-stone-400 line-through">{formatPKR(product.compareAtPrice)}</p>
            )}
          </div>
          <p className="mt-4 leading-relaxed text-brand-800/80">{product.description}</p>

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              Materials
            </h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {product.materials.map((m) => (
                <li
                  key={m}
                  className="rounded-full bg-linen px-3 py-1 text-sm text-brand-800"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <label className="text-sm font-medium">Qty</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="input-field w-20"
            />
            <span className="text-sm text-stone-500">{product.stock} in stock · Ships from {product.location}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addItem(product.id, qty)}
              className="btn-primary gap-2"
            >
              <ShoppingBag size={16} /> Add to cart
            </button>
            <button type="button" onClick={buyNow} className="btn-secondary gap-2">
              <Zap size={16} /> Buy now
            </button>
            <button
              type="button"
              onClick={() => toggleWish(product.id)}
              className="rounded-full border border-brand-100 p-2.5 text-brand-700 hover:bg-brand-50"
              aria-label="Wishlist"
            >
              <Heart size={18} className={wished ? "fill-brand-700" : ""} />
            </button>
          </div>

          {/* Artisan story */}
          <div className="mt-10 rounded-2xl bg-white p-5 ring-1 ring-brand-100">
            <div className="flex gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                <Image src={artisan.photo} alt={artisan.name} fill className="object-cover" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-brand-800">Meet {artisan.name}</h2>
                <p className="text-sm text-accent-700">
                  {artisan.city} · {artisan.specialty}
                </p>
                <p className="mt-2 font-serif text-base leading-relaxed text-brand-800/80">
                  {artisan.bio}
                </p>
                <Link
                  href={`/artisan/${artisan.slug}`}
                  className="mt-2 inline-block text-sm font-semibold text-brand-700"
                >
                  View full profile →
                </Link>
              </div>
            </div>
          </div>

          {/* Contact seller */}
          <div className="mt-6 rounded-2xl bg-linen p-5">
            <h3 className="flex items-center gap-2 font-serif text-xl text-brand-800">
              <MessageCircle size={18} /> Contact seller
            </h3>
            <p className="mt-1 text-sm text-brand-800/70">
              Ask about custom orders, sizing, or shipping timelines.
            </p>
            {sent ? (
              <p className="mt-3 text-sm font-medium text-brand-700">
                Message sent check your inbox in Account → Messages.
              </p>
            ) : (
              <form onSubmit={contactSeller} className="mt-3 space-y-3">
                <textarea
                  className="input-field min-h-[90px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hi ${artisan.name.split(" ")[0]}, I have a question about ${product.name}…`}
                  required
                />
                <button type="submit" className="btn-primary">
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="font-serif text-3xl text-brand-800">Reviews</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.length === 0 && (
            <p className="text-stone-500">No reviews yet be the first.</p>
          )}
          {reviews.map((r) => (
            <article key={r.id} className="rounded-2xl bg-white p-5 ring-1 ring-brand-100">
              <StarRating rating={r.rating} size={14} />
              <h3 className="mt-2 font-semibold text-brand-800">{r.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-brand-800/75">{r.comment}</p>
              <p className="mt-3 text-xs text-stone-500">
                {r.authorName}
                {r.verifiedPurchase && " · Verified purchase"} ·{" "}
                {new Date(r.createdAt).toLocaleDateString("en-PK")}
              </p>
            </article>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl text-brand-800">More from {artisan.shopName}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
