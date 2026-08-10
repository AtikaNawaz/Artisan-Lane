"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { usePlatformStore } from "@/store/platformStore";
import { artisans } from "@/data/artisans";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/sellers", label: "Sellers" },
  { href: "/admin/disputes", label: "Disputes" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminSellersPage() {
  const user = useAuthStore((s) => s.user);
  const pending = usePlatformStore((s) => s.pending);
  const approvedArtisans = usePlatformStore((s) => s.approvedArtisans);
  const approveSeller = usePlatformStore((s) => s.approveSeller);
  const declineSeller = usePlatformStore((s) => s.declineSeller);
  const [note, setNote] = useState("");

  if (!user || user.role !== "admin") {
    return (
      <div className="dashboard-shell text-center">
        <Link href="/auth/login" className="btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  const allApproved = [...approvedArtisans, ...artisans];

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Manage sellers</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      {note && (
        <p className="mt-4 rounded-xl bg-linen px-4 py-2 text-sm text-brand-800">{note}</p>
      )}

      <h2 className="mt-8 font-serif text-2xl">Pending approval</h2>
      <div className="mt-4 space-y-3">
        {pending.map((s) => (
          <div key={s.id} className="dash-card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{s.shopName}</p>
              <p className="text-sm text-stone-500">
                {s.name} · {s.city} · {s.specialty}
              </p>
              <p className="text-xs text-stone-400">
                {s.email} · Applied {s.appliedAt}
                {s.referredBy ? ` · Referred by ${s.referredBy}` : ""}
              </p>
              {s.artisanId && (
                <p className="mt-1 text-xs text-brand-700">
                  After approval, seller signs in with this email as role Seller and artisan id{" "}
                  <code className="rounded bg-brand-50 px-1">{s.artisanId}</code>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  const artisan = approveSeller(s.id);
                  if (artisan) {
                    setNote(
                      `${artisan.shopName} approved. Welcome email queued to ${s.email}. They can sign in as Seller.`
                    );
                  }
                }}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  declineSeller(s.id);
                  setNote(`${s.shopName} declined.`);
                }}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
        {pending.length === 0 && (
          <p className="text-sm text-stone-500">No pending applications.</p>
        )}
      </div>

      <h2 className="mt-10 font-serif text-2xl">Approved artisans</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-brand-100">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-brand-50/60 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Maker</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Sales</th>
            </tr>
          </thead>
          <tbody>
            {allApproved.map((a) => (
              <tr key={a.id} className="border-t border-brand-50">
                <td className="px-4 py-3">
                  <Link href={`/artisan/${a.slug}`} className="font-medium text-brand-800">
                    {a.name}
                  </Link>
                  <p className="text-xs text-stone-400">{a.shopName}</p>
                </td>
                <td className="px-4 py-3">{a.city}</td>
                <td className="px-4 py-3">{a.rating}</td>
                <td className="px-4 py-3">{a.totalSales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
