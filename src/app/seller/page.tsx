"use client";

import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { useCatalogStore } from "@/store/catalogStore";
import { usePlatformStore } from "@/store/platformStore";
import { getArtisanById } from "@/data/artisans";
import {
  formatPKR,
  calculateCommission,
  sellerPayout,
  LAUNCH_COMMISSION_RATE,
  STANDARD_COMMISSION_RATE,
  LAUNCH_ENDS_AT,
} from "@/lib/utils";

const nav = [
  { href: "/seller", label: "Overview" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/earnings", label: "Earnings" },
  { href: "/seller/analytics", label: "Analytics" },
];

export default function SellerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);
  const getByArtisan = useCatalogStore((s) => s.getByArtisan);
  const extras = useCatalogStore((s) => s.extras);
  const overrides = useCatalogStore((s) => s.overrides);
  const deletedIds = useCatalogStore((s) => s.deletedIds);
  const getFeaturedCredits = usePlatformStore((s) => s.getFeaturedCredits);
  const approvedArtisans = usePlatformStore((s) => s.approvedArtisans);
  void extras;
  void overrides;
  void deletedIds;

  if (!user || user.role !== "seller") {
    return (
      <div className="dashboard-shell text-center">
        <h1 className="font-serif text-3xl text-brand-800">Seller dashboard</h1>
        <p className="mt-2 text-sm text-brand-800/70">Sign in with a seller account to continue.</p>
        <Link href="/auth/login" className="btn-primary mt-6 inline-flex">
          Seller sign in
        </Link>
      </div>
    );
  }

  const artisanId = user.artisanId ?? "art_ayesha";
  const artisan =
    getArtisanById(artisanId) ?? approvedArtisans.find((a) => a.id === artisanId);
  const products = getByArtisan(artisanId);
  const credits = getFeaturedCredits(artisanId);
  const sellerOrders = orders.filter((o) =>
    o.items.some((i) => i.artisanId === artisanId)
  );
  const gross = sellerOrders.reduce(
    (sum, o) =>
      sum +
      o.items
        .filter((i) => i.artisanId === artisanId)
        .reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  return (
    <div className="dashboard-shell">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-brand-800">
            {artisan?.shopName ?? "Your shop"}
          </h1>
          <p className="mt-1 text-sm text-brand-800/70">Seller dashboard for {user.name}</p>
        </div>
        <Link href="/seller/products/new" className="btn-primary">
          Add product
        </Link>
      </div>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>

      <div className="mt-8 rounded-2xl border border-accent-500/40 bg-gradient-to-r from-linen to-white p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-accent-700">
          Launch Rate — active
        </p>
        <p className="mt-1 font-serif text-2xl text-brand-800">
          {LAUNCH_COMMISSION_RATE * 100}% commission
          <span className="text-base font-sans font-normal text-stone-500">
            {" "}
            · increasing to {STANDARD_COMMISSION_RATE * 100}% after{" "}
            {LAUNCH_ENDS_AT.toLocaleDateString("en-PK", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </p>
        <p className="mt-2 text-sm text-brand-800/70">
          Join early advantage vs typical 15–20% elsewhere. Featured listings available to
          boost category placement.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Products</p>
          <p className="font-serif text-3xl text-brand-800">{products.length}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Orders</p>
          <p className="font-serif text-3xl text-brand-800">{sellerOrders.length}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Gross sales</p>
          <p className="font-serif text-3xl text-brand-800">{formatPKR(gross)}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Your payout (est.)</p>
          <p className="font-serif text-3xl text-brand-800">{formatPKR(sellerPayout(gross))}</p>
          <p className="text-xs text-stone-500">
            Platform fee {formatPKR(calculateCommission(gross))}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="dash-card">
          <h2 className="font-serif text-xl">Recent orders</h2>
          <ul className="mt-3 divide-y divide-brand-50 text-sm">
            {sellerOrders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex justify-between py-2">
                <span>
                  {o.id} · <span className="capitalize">{o.status}</span>
                </span>
                <span className="font-medium">{formatPKR(o.total)}</span>
              </li>
            ))}
            {sellerOrders.length === 0 && (
              <li className="py-2 text-stone-500">No orders yet — list products to get started.</li>
            )}
          </ul>
        </div>
        <div className="dash-card">
          <h2 className="font-serif text-xl">Growth tips</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-brand-800/80">
            <li>
              Share your referral code <strong>{user.referralCode}</strong> — each seller you refer
              earns you a featured-listing credit (you have {credits}).
            </li>
            <li>New Seller Spotlight rotates weekly — keep your bio and photos fresh.</li>
            <li>Add Launch Collection tags while the 30-day banner is live.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
