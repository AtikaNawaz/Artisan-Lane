import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, BadgeCheck } from "lucide-react";
import { artisans, getArtisanBySlug } from "@/data/artisans";
import { getProductsByArtisan } from "@/data/products";
import { getReviewsForArtisan } from "@/data/reviews";
import { ProductCard } from "@/components/ProductCard";
import { StarRating } from "@/components/StarRating";
import { ContactSellerButton } from "@/components/ContactSellerButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return artisans.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artisan = getArtisanBySlug(slug);
  if (!artisan) return { title: "Artisan not found" };
  return {
    title: `${artisan.name} ${artisan.shopName}`,
    description: artisan.bio,
  };
}

export default async function ArtisanPage({ params }: Props) {
  const { slug } = await params;
  const artisan = getArtisanBySlug(slug);
  if (!artisan) notFound();

  const products = getProductsByArtisan(artisan.id);
  const reviews = getReviewsForArtisan(artisan.id);

  return (
    <div>
      <section className="relative h-56 bg-brand-800 md:h-72">
        <Image
          src={products[0]?.images[0] ?? artisan.photo}
          alt=""
          fill
          className="object-cover opacity-40"
          sizes="100vw"
        />
      </section>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end">
          <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-cream">
            <Image src={artisan.photo} alt={artisan.name} fill className="object-cover" />
          </div>
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-4xl text-brand-800">{artisan.name}</h1>
              {artisan.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-linen px-2 py-0.5 text-xs font-semibold text-brand-700">
                  <BadgeCheck size={14} /> Verified
                </span>
              )}
            </div>
            <p className="text-lg text-accent-700">{artisan.shopName}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
              <MapPin size={14} /> {artisan.city}, {artisan.province} · {artisan.specialty}
            </p>
            <div className="mt-2">
              <StarRating rating={artisan.rating} count={artisan.reviewCount} showValue />
            </div>
          </div>
          <ContactSellerButton artisan={artisan} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-serif text-2xl text-brand-800">Their story</h2>
            <p className="prose-artisan mt-3 font-serif text-lg text-brand-800/85">
              {artisan.story}
            </p>
            <h2 className="mt-12 font-serif text-2xl text-brand-800">
              Shop ({products.length})
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
          <aside className="space-y-4">
            <div className="dash-card">
              <h3 className="font-semibold text-brand-800">Studio snapshot</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-stone-500">Total sales</dt>
                  <dd className="font-medium">{artisan.totalSales}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">Joined</dt>
                  <dd className="font-medium">
                    {new Date(artisan.joinedAt).toLocaleDateString("en-PK", {
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">Rating</dt>
                  <dd className="font-medium">{artisan.rating} / 5</dd>
                </div>
              </dl>
            </div>
            <div className="dash-card">
              <h3 className="font-semibold text-brand-800">Recent reviews</h3>
              <div className="mt-3 space-y-3">
                {reviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="border-t border-brand-50 pt-3 first:border-0 first:pt-0">
                    <StarRating rating={r.rating} size={12} />
                    <p className="mt-1 text-sm text-brand-800/80">{r.comment}</p>
                    <p className="mt-1 text-xs text-stone-400">{r.authorName}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-sm text-stone-500">No reviews yet.</p>
                )}
              </div>
            </div>
            <Link href="/shop" className="btn-secondary w-full">
              Back to shop
            </Link>
          </aside>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
