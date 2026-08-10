import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Artisan Lane — a marketplace built so small local artisans can reach customers beyond their neighborhood without high marketplace fees.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative min-h-[50vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1600&q=80"
          alt="Handmade craft materials"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-900/65" />
        <div className="relative mx-auto flex min-h-[50vh] max-w-7xl items-end px-4 pb-12 lg:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">
              Our story
            </p>
            <h1 className="mt-2 font-serif text-4xl text-cream md:text-5xl">
              Built for makers who deserve better margins
            </h1>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-14 lg:px-6">
        <p className="font-serif text-2xl leading-relaxed text-brand-800">
          Artisan Lane started with a simple frustration: talented craftspeople across
          Pakistan were stuck choosing between neighbourhood bazaars and global platforms
          that take 15–20% — or more — of every sale.
        </p>
        <p className="mt-6 leading-relaxed text-brand-800/80">
          We built a boutique marketplace where local artisans and craftspeople sell
          handmade products directly to customers who care about authenticity. Our launch
          commission is intentionally low at <strong>10% for the first two months</strong>,
          then moves to a still-fair 15%. That gap is not a gimmick — it is how we help
          studios list early, earn faster, and grow with us.
        </p>
        <p className="mt-6 leading-relaxed text-brand-800/80">
          Every week, New Seller Spotlight rotates so newcomers get real visibility in
          their first days. Buyers share referral codes for discounts; sellers earn
          featured-listing credits when they bring another maker onboard. The Launch
          Collection creates urgency in month one without pretending handmade work is
          mass inventory.
        </p>
        <p className="mt-6 leading-relaxed text-brand-800/80">
          We are based in Pakistan with nationwide delivery. Whether you are looking for a
          one-of-a-kind gift or a durable piece for your home, you are shopping a living
          network of independent makers — not a warehouse of lookalikes.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary">
            Explore the shop
          </Link>
          <Link href="/auth/register/seller" className="btn-secondary">
            Apply as a seller
          </Link>
        </div>
      </article>
    </div>
  );
}
