"use client";

import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { artisans } from "@/data/artisans";
import { products } from "@/data/products";
import { pendingSellers, disputes } from "@/data/reviews";
import { formatPKR, calculateCommission } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/sellers", label: "Sellers" },
  { href: "/admin/disputes", label: "Disputes" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);

  if (!user || user.role !== "admin") {
    return (
      <div className="dashboard-shell text-center">
        <h1 className="font-serif text-3xl text-brand-800">Admin dashboard</h1>
        <p className="mt-2 text-sm text-brand-800/70">
          Sign in as admin@artisanlane.pk to manage the platform.
        </p>
        <Link href="/auth/login" className="btn-primary mt-6 inline-flex">
          Admin sign in
        </Link>
      </div>
    );
  }

  const gmv = orders.reduce((s, o) => s + o.subtotal, 0);
  const revenue = orders.reduce((s, o) => s + (o.commission || calculateCommission(o.subtotal)), 0);

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Platform admin</h1>
      <p className="mt-1 text-sm text-brand-800/70">Artisan Lane operations overview</p>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Approved sellers</p>
          <p className="font-serif text-3xl">{artisans.filter((a) => a.isApproved).length}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Pending approvals</p>
          <p className="font-serif text-3xl">{pendingSellers.length}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">GMV</p>
          <p className="font-serif text-3xl">{formatPKR(gmv)}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Commission revenue</p>
          <p className="font-serif text-3xl">{formatPKR(revenue)}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="dash-card">
          <h2 className="font-serif text-xl">Needs attention</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/admin/sellers" className="text-brand-700 hover:underline">
                {pendingSellers.length} seller applications awaiting approval
              </Link>
            </li>
            <li>
              <Link href="/admin/disputes" className="text-brand-700 hover:underline">
                {disputes.filter((d) => d.status !== "resolved").length} open disputes
              </Link>
            </li>
            <li>{products.length} live products across catalog</li>
          </ul>
        </div>
        <div className="dash-card">
          <h2 className="font-serif text-xl">Monetization</h2>
          <p className="mt-2 text-sm text-brand-800/75">
            Launch Rate 10% (months 1–2) → 15% thereafter. Optional Featured Listing upsells
            for category placement.
          </p>
        </div>
      </div>
    </div>
  );
}
