"use client";

import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { getProductsByArtisan } from "@/data/products";
import { useOrderStore } from "@/store/orderStore";

const nav = [
  { href: "/seller", label: "Overview" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/earnings", label: "Earnings" },
  { href: "/seller/analytics", label: "Analytics" },
];

export default function SellerAnalyticsPage() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);

  if (!user || user.role !== "seller") {
    return (
      <div className="dashboard-shell text-center">
        <Link href="/auth/login" className="btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  const artisanId = user.artisanId ?? "art_ayesha";
  const products = getProductsByArtisan(artisanId);
  const views = products.reduce((s, p) => s + p.salesCount * 12 + p.reviewCount * 8, 0);
  const sales = products.reduce((s, p) => s + p.salesCount, 0);
  const orderCount = orders.filter((o) =>
    o.items.some((i) => i.artisanId === artisanId)
  ).length;

  const maxSales = Math.max(...products.map((p) => p.salesCount), 1);

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Analytics</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Product views (est.)</p>
          <p className="font-serif text-3xl">{views.toLocaleString()}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Units sold</p>
          <p className="font-serif text-3xl">{sales}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Orders</p>
          <p className="font-serif text-3xl">{orderCount}</p>
        </div>
      </div>
      <div className="mt-8 dash-card">
        <h2 className="font-serif text-xl">Sales by product</h2>
        <div className="mt-4 space-y-3">
          {products.map((p) => (
            <div key={p.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="text-stone-500">{p.salesCount} sold</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-brand-50">
                <div
                  className="h-full rounded-full bg-brand-700 transition-all"
                  style={{ width: `${(p.salesCount / maxSales) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
