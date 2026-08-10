"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { disputes as seedDisputes } from "@/data/reviews";
import type { Dispute } from "@/lib/types";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/sellers", label: "Sellers" },
  { href: "/admin/disputes", label: "Disputes" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminDisputesPage() {
  const user = useAuthStore((s) => s.user);
  const [disputes, setDisputes] = useState<Dispute[]>(seedDisputes);

  if (!user || user.role !== "admin") {
    return (
      <div className="dashboard-shell text-center">
        <Link href="/auth/login" className="btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  function setStatus(id: string, status: Dispute["status"]) {
    setDisputes((d) => d.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Disputes</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      <div className="mt-8 space-y-4">
        {disputes.map((d) => (
          <article key={d.id} className="dash-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{d.id}</h2>
                <p className="text-xs text-stone-500">
                  Order {d.orderId} · {d.createdAt}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  d.status === "open"
                    ? "bg-red-100 text-red-800"
                    : d.status === "in_review"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {d.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-3 text-sm text-brand-800/80">{d.reason}</p>
            <p className="mt-1 text-xs text-stone-500">
              {d.raisedBy} → {d.against}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStatus(d.id, "in_review")}
              >
                Mark in review
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setStatus(d.id, "resolved")}
              >
                Resolve
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
