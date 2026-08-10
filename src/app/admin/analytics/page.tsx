"use client";

import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { products } from "@/data/products";
import { artisans } from "@/data/artisans";
import { categories } from "@/data/categories";
import { formatPKR, calculateCommission } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/sellers", label: "Sellers" },
  { href: "/admin/disputes", label: "Disputes" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminAnalyticsPage() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);

  if (!user || user.role !== "admin") {
    return (
      <div className="dashboard-shell text-center">
        <Link href="/auth/login" className="btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  const gmv = orders.reduce((s, o) => s + o.subtotal, 0);
  const fees = orders.reduce((s, o) => s + (o.commission || calculateCommission(o.subtotal)), 0);
  const byCategory = categories.map((c) => ({
    name: c.name,
    count: products.filter((p) => p.categoryId === c.id).length,
    sales: products
      .filter((p) => p.categoryId === c.id)
      .reduce((s, p) => s + p.salesCount, 0),
  }));
  const maxSales = Math.max(...byCategory.map((c) => c.sales), 1);

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Site-wide analytics</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">GMV</p>
          <p className="font-serif text-3xl">{formatPKR(gmv)}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Commission take</p>
          <p className="font-serif text-3xl">{formatPKR(fees)}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Orders</p>
          <p className="font-serif text-3xl">{orders.length}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Active makers</p>
          <p className="font-serif text-3xl">{artisans.length}</p>
        </div>
      </div>
      <div className="mt-8 dash-card">
        <h2 className="font-serif text-xl">Sales by category</h2>
        <div className="mt-4 space-y-3">
          {byCategory.map((c) => (
            <div key={c.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>
                  {c.name}{" "}
                  <span className="text-stone-400">({c.count} SKUs)</span>
                </span>
                <span>{c.sales} units</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-brand-50">
                <div
                  className="h-full rounded-full bg-accent-500"
                  style={{ width: `${(c.sales / maxSales) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
