"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";
import { applyPromo } from "@/lib/utils";
import { resolveProduct } from "@/store/catalogStore";
import { usePlatformStore } from "@/store/platformStore";

interface CartState {
  items: CartItem[];
  promoCode: string;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setPromoCode: (code: string) => void;
  subtotal: () => number;
  discount: () => number;
  shipping: () => number;
  total: () => number;
  itemCount: () => number;
}

function referralLookup(code: string): number | null {
  const entry = usePlatformStore.getState().buyerReferralCodes[code.toUpperCase()];
  return entry ? entry.discount : null;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: "",
      addItem: (productId, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { productId, quantity }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [], promoCode: "" }),
      setPromoCode: (code) => set({ promoCode: code.trim().toUpperCase() }),
      subtotal: () =>
        get().items.reduce((sum, item) => {
          const product = resolveProduct(item.productId);
          return sum + (product?.price ?? 0) * item.quantity;
        }, 0),
      discount: () => applyPromo(get().promoCode, get().subtotal(), referralLookup),
      shipping: () => {
        const sub = get().subtotal() - get().discount();
        if (sub <= 0) return 0;
        return sub >= 5000 ? 0 : 250;
      },
      total: () => Math.max(0, get().subtotal() - get().discount() + get().shipping()),
      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
    }),
    { name: "artisan-lane-cart" }
  )
);
