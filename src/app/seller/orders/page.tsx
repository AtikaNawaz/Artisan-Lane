"use client";

import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { formatPKR } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const nav = [
  { href: "/seller", label: "Overview" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/earnings", label: "Earnings" },
  { href: "/seller/analytics", label: "Analytics" },
];

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "packed",
  packed: "shipped",
  shipped: "delivered",
};

export default function SellerOrdersPage() {
  const user = useAuthStore((s) => s.user);
  const { orders, updateStatus } = useOrderStore();

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
  const sellerOrders = orders.filter((o) =>
    o.items.some((i) => i.artisanId === artisanId)
  );

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Orders</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      <div className="mt-8 space-y-4">
        {sellerOrders.map((o) => {
          const items = o.items.filter((i) => i.artisanId === artisanId);
          const next = nextStatus[o.status];
          return (
            <article key={o.id} className="dash-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{o.id}</h2>
                  <p className="text-xs capitalize text-stone-500">
                    Status: {o.status} · {o.shippingAddress.city}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatPKR(items.reduce((s, i) => s + i.price * i.quantity, 0))}
                </p>
              </div>
              <ul className="mt-3 text-sm text-brand-800/80">
                {items.map((i) => (
                  <li key={i.productId}>
                    {i.name} ×{i.quantity}
                  </li>
                ))}
              </ul>
              {next && (
                <button
                  type="button"
                  className="btn-secondary mt-4"
                  onClick={() =>
                    updateStatus(
                      o.id,
                      next,
                      `Status updated to ${next} — buyer email notification queued`
                    )
                  }
                >
                  Mark as {next}
                </button>
              )}
            </article>
          );
        })}
        {sellerOrders.length === 0 && (
          <p className="text-stone-500">No orders for your shop yet.</p>
        )}
      </div>
    </div>
  );
}
