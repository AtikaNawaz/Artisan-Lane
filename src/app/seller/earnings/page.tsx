"use client";

import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import {
  formatPKR,
  calculateCommission,
  sellerPayout,
  LAUNCH_COMMISSION_RATE,
  STANDARD_COMMISSION_RATE,
} from "@/lib/utils";

const nav = [
  { href: "/seller", label: "Overview" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/earnings", label: "Earnings" },
  { href: "/seller/analytics", label: "Analytics" },
];

export default function SellerEarningsPage() {
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
  const rows = orders
    .map((o) => {
      const items = o.items.filter((i) => i.artisanId === artisanId);
      if (!items.length) return null;
      const gross = items.reduce((s, i) => s + i.price * i.quantity, 0);
      return {
        id: o.id,
        date: o.createdAt,
        status: o.status,
        gross,
        fee: calculateCommission(gross),
        payout: sellerPayout(gross),
      };
    })
    .filter(Boolean);

  const totalGross = rows.reduce((s, r) => s + r!.gross, 0);
  const totalFee = rows.reduce((s, r) => s + r!.fee, 0);
  const totalPayout = rows.reduce((s, r) => s + r!.payout, 0);

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Earnings</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>

      <div className="mt-8 rounded-2xl bg-brand-800 p-6 text-cream">
        <p className="text-xs font-bold uppercase tracking-wider text-accent-500">
          Commission model
        </p>
        <p className="mt-2 font-serif text-2xl">
          Launch Rate — {LAUNCH_COMMISSION_RATE * 100}%
        </p>
        <p className="mt-1 text-sm text-cream/75">
          Increasing to {STANDARD_COMMISSION_RATE * 100}% after month 2. Keep listing now to
          lock in the early rate on launch-period sales.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Gross</p>
          <p className="font-serif text-3xl">{formatPKR(totalGross)}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Platform commission</p>
          <p className="font-serif text-3xl">{formatPKR(totalFee)}</p>
        </div>
        <div className="dash-card">
          <p className="text-xs uppercase text-stone-500">Your earnings</p>
          <p className="font-serif text-3xl">{formatPKR(totalPayout)}</p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl bg-white ring-1 ring-brand-100">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-brand-50/60 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Gross</th>
              <th className="px-4 py-3">Fee (10%)</th>
              <th className="px-4 py-3">Payout</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r!.id} className="border-t border-brand-50">
                <td className="px-4 py-3">
                  {r!.id}
                  <span className="ml-2 capitalize text-stone-400">{r!.status}</span>
                </td>
                <td className="px-4 py-3">{formatPKR(r!.gross)}</td>
                <td className="px-4 py-3">{formatPKR(r!.fee)}</td>
                <td className="px-4 py-3 font-semibold">{formatPKR(r!.payout)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
