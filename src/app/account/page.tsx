"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { DashboardNav } from "@/components/DashboardNav";
import { formatPKR } from "@/lib/utils";

const nav = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/messages", label: "Messages" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);
  const wishCount = useWishlistStore((s) => s.productIds.length);

  if (!user) {
    return (
      <div className="dashboard-shell text-center">
        <h1 className="font-serif text-3xl text-brand-800">Buyer dashboard</h1>
        <p className="mt-2 text-brand-800/70">Sign in to view orders, wishlist, and referral perks.</p>
        <Link href="/auth/login" className="btn-primary mt-6 inline-flex">
          Sign in
        </Link>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.userId === user.id || o.userId === "demo_buyer");

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Hello, {user.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-brand-800/70">Manage orders, saved pieces, and your referral code.</p>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="dash-card">
          <p className="text-xs uppercase tracking-wide text-stone-500">Orders</p>
          <p className="mt-1 font-serif text-3xl text-brand-800">{myOrders.length}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase tracking-wide text-stone-500">Wishlist</p>
          <p className="mt-1 font-serif text-3xl text-brand-800">{wishCount}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase tracking-wide text-stone-500">Your referral code</p>
          <p className="mt-1 font-mono text-xl font-semibold text-brand-700">{user.referralCode}</p>
          <p className="mt-1 text-xs text-stone-500">
            Friends get Rs. 500 off when they enter this code at checkout
          </p>
        </div>
      </div>

      <div className="mt-8 dash-card">
        <h2 className="font-serif text-xl text-brand-800">Recent orders</h2>
        <ul className="mt-4 divide-y divide-brand-50">
          {myOrders.slice(0, 3).map((o) => (
            <li key={o.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{o.id}</p>
                <p className="capitalize text-stone-500">{o.status}</p>
              </div>
              <p className="font-semibold">{formatPKR(o.total)}</p>
            </li>
          ))}
        </ul>
        <Link href="/account/orders" className="mt-3 inline-block text-sm font-semibold text-brand-700">
          View all orders →
        </Link>
      </div>
    </div>
  );
}
