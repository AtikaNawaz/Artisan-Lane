"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";
import { StarRating } from "@/components/StarRating";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { useReviewStore } from "@/store/reviewStore";
import { formatPKR } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const nav = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/messages", label: "Messages" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

const steps: OrderStatus[] = ["placed", "packed", "shipped", "delivered"];

function OrdersInner() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const addReview = useReviewStore((s) => s.addReview);
  const hasReviewed = useReviewStore((s) => s.hasReviewed);
  const extras = useReviewStore((s) => s.extras);
  void extras;
  const placed = useSearchParams().get("placed");
  const [reviewDraft, setReviewDraft] = useState<
    Record<string, { rating: number; title: string; comment: string }>
  >({});
  const [reviewMsg, setReviewMsg] = useState("");

  if (!user) {
    return (
      <div className="dashboard-shell text-center">
        <Link href="/auth/login" className="btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.userId === user.id || o.userId === "demo_buyer");

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Order history</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      {placed && (
        <div className="mt-6 rounded-2xl bg-linen px-4 py-3 text-sm text-brand-800">
          Order <strong>{placed}</strong> placed successfully. Confirmation sent to your email
          we&apos;ll notify you at each shipping milestone.
        </div>
      )}
      {reviewMsg && (
        <p className="mt-4 rounded-xl bg-brand-50 px-4 py-2 text-sm text-brand-800">{reviewMsg}</p>
      )}
      <div className="mt-8 space-y-4">
        {myOrders.map((o) => {
          const idx = steps.indexOf(o.status === "cancelled" ? "placed" : o.status);
          return (
            <article key={o.id} className="dash-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-brand-800">{o.id}</h2>
                  <p className="text-xs text-stone-500">
                    {new Date(o.createdAt).toLocaleString("en-PK")} ·{" "}
                    {o.paymentMethod.toUpperCase()}
                  </p>
                </div>
                <p className="font-semibold">{formatPKR(o.total)}</p>
              </div>
              <div className="mt-4 flex gap-1">
                {steps.map((s, i) => (
                  <div key={s} className="flex-1">
                    <div
                      className={`h-1.5 rounded-full ${
                        i <= idx ? "bg-brand-700" : "bg-brand-100"
                      }`}
                    />
                    <p className="mt-1 text-[10px] capitalize text-stone-500">{s}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-4 space-y-1 text-sm text-brand-800/80">
                {o.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} ×{item.quantity}
                  </li>
                ))}
              </ul>
              {o.trackingNote && (
                <p className="mt-3 text-xs text-accent-700">{o.trackingNote}</p>
              )}

              {/* Demo helper: advance to delivered so review UI is testable */}
              {o.status !== "delivered" && o.status !== "cancelled" && (
                <button
                  type="button"
                  className="mt-3 text-xs font-semibold text-brand-700"
                  onClick={() => {
                    const next =
                      o.status === "placed"
                        ? "packed"
                        : o.status === "packed"
                          ? "shipped"
                          : "delivered";
                    updateStatus(o.id, next as OrderStatus);
                  }}
                >
                  Mark next status (demo)
                </button>
              )}

              {o.status === "delivered" && (
                <div className="mt-5 space-y-4 border-t border-brand-50 pt-4">
                  <h3 className="font-serif text-lg text-brand-800">Leave a review</h3>
                  {o.items.map((item) => {
                    const already = hasReviewed(item.productId, user.name);
                    const draft = reviewDraft[item.productId] ?? {
                      rating: 5,
                      title: "",
                      comment: "",
                    };
                    if (already) {
                      return (
                        <p key={item.productId} className="text-sm text-stone-500">
                          You reviewed {item.name}.
                        </p>
                      );
                    }
                    return (
                      <form
                        key={item.productId}
                        className="rounded-xl bg-linen p-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!draft.title.trim() || !draft.comment.trim()) return;
                          addReview({
                            productId: item.productId,
                            artisanId: item.artisanId,
                            authorName: user.name,
                            rating: draft.rating,
                            title: draft.title,
                            comment: draft.comment,
                          });
                          setReviewMsg(`Thanks your review of ${item.name} is live.`);
                          setReviewDraft((d) => {
                            const next = { ...d };
                            delete next[item.productId];
                            return next;
                          });
                        }}
                      >
                        <p className="text-sm font-medium text-brand-800">{item.name}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-stone-500">Rating</span>
                          <select
                            className="input-field max-w-[100px]"
                            value={draft.rating}
                            onChange={(e) =>
                              setReviewDraft({
                                ...reviewDraft,
                                [item.productId]: {
                                  ...draft,
                                  rating: Number(e.target.value),
                                },
                              })
                            }
                          >
                            {[5, 4, 3, 2, 1].map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                          <StarRating rating={draft.rating} size={14} />
                        </div>
                        <input
                          className="input-field mt-2"
                          placeholder="Review title"
                          value={draft.title}
                          onChange={(e) =>
                            setReviewDraft({
                              ...reviewDraft,
                              [item.productId]: { ...draft, title: e.target.value },
                            })
                          }
                          required
                        />
                        <textarea
                          className="input-field mt-2 min-h-[80px]"
                          placeholder="What did you love about this handmade piece?"
                          value={draft.comment}
                          onChange={(e) =>
                            setReviewDraft({
                              ...reviewDraft,
                              [item.productId]: { ...draft, comment: e.target.value },
                            })
                          }
                          required
                        />
                        <button type="submit" className="btn-primary mt-3">
                          Submit review
                        </button>
                      </form>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersInner />
    </Suspense>
  );
}
