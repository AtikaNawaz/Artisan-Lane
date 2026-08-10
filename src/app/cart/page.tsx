"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { resolveProduct } from "@/store/catalogStore";
import { formatPKR, resolvePromo } from "@/lib/utils";
import { usePlatformStore } from "@/store/platformStore";
import { useState } from "react";

export default function CartPage() {
  const {
    items,
    setQuantity,
    removeItem,
    promoCode,
    setPromoCode,
    subtotal,
    discount,
    shipping,
    total,
  } = useCartStore();
  const buyerReferralCodes = usePlatformStore((s) => s.buyerReferralCodes);
  const [codeInput, setCodeInput] = useState(promoCode);
  const [promoMsg, setPromoMsg] = useState("");

  function applyCode() {
    const upper = codeInput.trim().toUpperCase();
    const result = resolvePromo(upper, subtotal(), (code) => {
      const entry = buyerReferralCodes[code];
      return entry ? entry.discount : null;
    });
    if (result) {
      setPromoCode(upper);
      setPromoMsg(`Applied: ${result.label}`);
    } else {
      setPromoMsg("Code not recognized");
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-4xl text-brand-800">Your cart is empty</h1>
        <p className="mt-3 text-brand-800/70">Discover something handmade instead.</p>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <h1 className="font-serif text-4xl text-brand-800">Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {items.map((item) => {
            const product = resolveProduct(item.productId);
            if (!product) return null;
            return (
              <div
                key={item.productId}
                className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-brand-100"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-serif text-lg text-brand-800"
                    >
                      {product.name}
                    </Link>
                    <p className="font-semibold">{formatPKR(product.price * item.quantity)}</p>
                  </div>
                  <p className="text-sm text-stone-500">{formatPKR(product.price)} each</p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2 rounded-full border border-brand-100 px-2 py-1">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-stone-400 hover:text-brand-700"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl bg-white p-5 ring-1 ring-brand-100 lg:sticky lg:top-28">
          <h2 className="font-serif text-xl text-brand-800">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPKR(subtotal())}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Discount</dt>
              <dd>-{formatPKR(discount())}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{shipping() === 0 ? "Free" : formatPKR(shipping())}</dd>
            </div>
            <div className="flex justify-between border-t border-brand-50 pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPKR(total())}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-stone-500">Free shipping on orders Rs. 5,000+</p>

          <div className="mt-5">
            <label className="label-field">Promo code</label>
            <div className="flex gap-2">
              <input
                className="input-field"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="WELCOME10"
              />
              <button type="button" className="btn-secondary shrink-0" onClick={applyCode}>
                Apply
              </button>
            </div>
            {promoMsg && <p className="mt-2 text-xs text-brand-700">{promoMsg}</p>}
            <p className="mt-2 text-[11px] text-stone-400">
              Try WELCOME10, HANDMADE5, LAUNCH15, REFER50, or a friend&apos;s personal referral code
            </p>
          </div>

          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
