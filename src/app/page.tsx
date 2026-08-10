import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift, Handshake, Package, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { StarRating } from "@/components/StarRating";
import { artisans, getNewSellerSpotlight } from "@/data/artisans";
import {
  getCategoriesWithCounts,
  getFeaturedProducts,
  getLaunchCollection,
  getTrendingProducts,
} from "@/data/products";
import { testimonials } from "@/data/reviews";

export default function HomePage() {
  const spotlight = getNewSellerSpotlight();
  const launch = getLaunchCollection().slice(0, 4);
  const trending = getTrendingProducts(8);
  const featuredArtisans = artisans.filter((a) => a.isFeatured).slice(0, 4);
  const categories = getCategoriesWithCounts();
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date("2026-09-08").getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div>
      {/* Hero  brand-first, full-bleed */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1800&q=80"
          alt="Artisan working with clay at a pottery wheel"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/85 via-brand-900/55 to-brand-900/25" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20 lg:px-6">
          <p className="animate-fade-up font-serif text-4xl text-cream sm:text-5xl md:text-6xl lg:text-7xl">
            Artisan Lane
          </p>
          <h1 className="animate-fade-up-delay mt-4 max-w-xl font-serif text-2xl font-medium leading-snug text-cream/95 sm:text-3xl">
            Handmade with heart, delivered with care
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 max-w-lg text-base text-cream/80 sm:text-lg">
            Discover unique ceramics, textiles, jewelry, and home goods from independent
            makers across Pakistan without the high fees of big marketplaces.
          </p>
          <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary bg-cream text-brand-800 hover:bg-white">
              Shop handmade
            </Link>
            <Link
              href="/auth/register/seller"
              className="btn-secondary border-cream/40 text-cream hover:bg-white/10"
            >
              Join as a seller
            </Link>
          </div>
        </div>
      </section>

      {/* Launch Collection banner */}
      <section className="border-b border-brand-100 bg-linen">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div>
            <p className="animate-soft-pulse text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
              Limited  {daysLeft} days left
            </p>
            <h2 className="mt-1 font-serif text-3xl text-brand-800">Launch Collection</h2>
            <p className="mt-2 max-w-xl text-sm text-brand-800/70">
              A curated drop for our first 30 days. Early sellers get homepage visibility;
              buyers get the freshest work from makers just joining the lane.
            </p>
          </div>
          <Link href="/shop?launch=1" className="btn-primary inline-flex gap-2">
            Browse Launch Collection <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pb-10 md:grid-cols-4 lg:px-6">
          {launch.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* Featured artisans */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
              Makers we love
            </p>
            <h2 className="mt-2 font-serif text-3xl text-brand-800 md:text-4xl">
              Featured artisans
            </h2>
          </div>
          <Link href="/shop" className="hidden text-sm font-semibold text-brand-700 sm:inline">
            Meet them in the shop →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredArtisans.map((a) => (
            <Link
              key={a.id}
              href={`/artisan/${a.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={a.photo}
                  alt={a.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-xl text-brand-800">{a.name}</h3>
                <p className="text-sm text-accent-700">{a.shopName}</p>
                <p className="mt-1 text-xs text-stone-500">
                  {a.city} · {a.specialty}
                </p>
                <div className="mt-2">
                  <StarRating rating={a.rating} count={a.reviewCount} size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Seller Spotlight */}
      <section className="bg-brand-800 text-cream">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2 lg:items-center lg:px-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={spotlight.photo}
              alt={spotlight.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-500">
              <Sparkles size={14} /> New Seller Spotlight · rotates weekly
            </p>
            <h2 className="mt-3 font-serif text-4xl">{spotlight.name}</h2>
            <p className="mt-1 text-accent-500">{spotlight.shopName}</p>
            <p className="mt-4 max-w-lg text-cream/80">{spotlight.story}</p>
            <p className="mt-3 text-sm text-cream/60">
              {spotlight.city}, {spotlight.province} · Joined{" "}
              {new Date(spotlight.joinedAt).toLocaleDateString("en-PK", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <Link
              href={`/artisan/${spotlight.slug}`}
              className="btn-primary mt-6 bg-accent-500 text-brand-900 hover:bg-accent-600"
            >
              Visit their shop
            </Link>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
              What buyers are loving
            </p>
            <h2 className="mt-2 font-serif text-3xl text-brand-800 md:text-4xl">
              Trending products
            </h2>
          </div>
          <Link href="/shop?sort=bestselling" className="text-sm font-semibold text-brand-700">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-brand-100 bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <h2 className="font-serif text-3xl text-brand-800 md:text-4xl">Shop by category</h2>
          <p className="mt-2 max-w-xl text-brand-800/70">
            From clay studios to embroidery collectives find the craft that fits your home.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className="group relative aspect-[5/4] overflow-hidden rounded-2xl"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-transparent" />
                <div className="absolute bottom-0 p-4 text-cream">
                  <h3 className="font-serif text-lg sm:text-xl">{c.name}</h3>
                  <p className="text-xs text-cream/70">{c.productCount} pieces</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <h2 className="text-center font-serif text-3xl text-brand-800 md:text-4xl">
          How Artisan Lane works
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-brand-800/70">
          A simple path from maker&apos;s bench to your doorstep.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Package,
              title: "Discover makers",
              text: "Browse curated handmade goods with filters for category, price, location, and ratings.",
            },
            {
              icon: Gift,
              title: "Checkout with care",
              text: "Pay via JazzCash, EasyPaisa, or card. Track orders from Placed to Delivered.",
            },
            {
              icon: Handshake,
              title: "Support small studios",
              text: "Just 10% launch commission means more of your purchase reaches the artisan.",
            },
          ].map((step) => (
            <div key={step.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linen text-brand-700">
                <step.icon size={20} />
              </div>
              <h3 className="mt-4 font-serif text-xl text-brand-800">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-800/70">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-linen">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <h2 className="font-serif text-3xl text-brand-800 md:text-4xl">From the lane</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-brand-100"
              >
                <StarRating rating={t.rating} size={13} />
                <p className="mt-3 flex-1 font-serif text-lg leading-relaxed text-brand-800">
                  “{t.quote}”
                </p>
                <footer className="mt-4 text-sm text-stone-500">
                  <span className="font-semibold text-brand-700">{t.name}</span>
                  <br />
                  {t.city} · {t.role === "seller" ? "Seller" : "Buyer"}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Join as seller CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1600&q=80"
            alt=""
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-700/90" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center text-cream lg:px-6">
          <h2 className="font-serif text-3xl md:text-5xl">Join as a seller</h2>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">
            List your handmade work for a Launch Rate of 10% rising to 15% after month two.
            Refer another seller and earn a featured-listing credit. Every new maker gets a
            turn in our weekly New Seller Spotlight.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/auth/register/seller" className="btn-primary bg-cream text-brand-800 hover:bg-white">
              Start selling
            </Link>
            <Link href="/about" className="btn-secondary border-cream/40 text-cream hover:bg-white/10">
              Why we built this
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter + referral teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-brand-100">
            <h3 className="font-serif text-2xl text-brand-800">Lane Letters</h3>
            <p className="mt-2 text-sm text-brand-800/70">
              Maker stories, Launch Collection updates, and early access to new shops.
            </p>
            <div className="mt-5">
              <NewsletterForm source="homepage" />
            </div>
          </div>
          <div className="rounded-2xl bg-brand-50 p-8 ring-1 ring-brand-100">
            <h3 className="font-serif text-2xl text-brand-800">Share the lane</h3>
            <p className="mt-2 text-sm text-brand-800/70">
              Buyers get a personal referral discount code. Sellers earn a featured-listing
              credit for every maker they refer built-in growth for month one.
            </p>
            <Link href="/account" className="btn-primary mt-5">
              Get your referral code
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-stone-400">
          Featured picks also include {getFeaturedProducts().length} evergreen bestsellers
          across the catalog.
        </p>
      </section>
    </div>
  );
}
