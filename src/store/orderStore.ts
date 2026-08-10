"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, Order, OrderItem, OrderStatus, PaymentMethod } from "@/lib/types";
import { calculateCommission, generateId } from "@/lib/utils";

interface OrderState {
  orders: Order[];
  placeOrder: (input: {
    userId: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    discount: number;
    paymentMethod: PaymentMethod;
    shippingAddress: Address;
    promoCode?: string;
  }) => Order;
  updateStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  getOrdersForUser: (userId: string) => Order[];
  getOrdersForArtisan: (artisanId: string) => Order[];
}

const seedOrders: Order[] = [
  {
    id: "ord_sample_01",
    userId: "demo_buyer",
    items: [
      {
        productId: "prod_17",
        name: "Hammered Copper Lantern",
        price: 9800,
        quantity: 1,
        artisanId: "art_omar",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400&q=80",
      },
    ],
    status: "shipped",
    subtotal: 9800,
    shipping: 0,
    discount: 0,
    commission: 980,
    total: 9800,
    paymentMethod: "jazzcash",
    shippingAddress: {
      id: "addr_demo",
      label: "Home",
      fullName: "Sana B.",
      phone: "0321-1112233",
      line1: "44 DHA Phase 5",
      city: "Karachi",
      province: "Sindh",
      postalCode: "75500",
      isDefault: true,
    },
    createdAt: "2026-08-05T10:00:00Z",
    updatedAt: "2026-08-07T14:00:00Z",
    trackingNote: "Out for delivery via TCS",
  },
  {
    id: "ord_sample_02",
    userId: "demo_buyer",
    items: [
      {
        productId: "prod_09",
        name: "Day Satchel in Cognac",
        price: 14500,
        quantity: 1,
        artisanId: "art_hassan",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a674692?w=400&q=80",
      },
    ],
    status: "packed",
    subtotal: 14500,
    shipping: 0,
    discount: 500,
    commission: 1450,
    total: 14000,
    paymentMethod: "card",
    promoCode: "HANDMADE5",
    shippingAddress: {
      id: "addr_demo2",
      label: "Office",
      fullName: "Ali M.",
      phone: "0333-4455667",
      line1: "Blue Area",
      city: "Islamabad",
      province: "ICT",
      postalCode: "44000",
      isDefault: true,
    },
    createdAt: "2026-08-06T09:00:00Z",
    updatedAt: "2026-08-07T11:00:00Z",
  },
  {
    id: "ord_sample_03",
    userId: "demo_buyer",
    items: [
      {
        productId: "prod_01",
        name: "Amber Rim Stoneware Mug",
        price: 2200,
        quantity: 2,
        artisanId: "art_ayesha",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80",
      },
      {
        productId: "prod_15",
        name: "Jasmine & Cedar Pillar Candle",
        price: 2400,
        quantity: 1,
        artisanId: "art_zara",
        image: "https://images.unsplash.com/photo-1602602670622-304e685e0b4c?w=400&q=80",
      },
    ],
    status: "delivered",
    subtotal: 6800,
    shipping: 0,
    discount: 0,
    commission: 680,
    total: 6800,
    paymentMethod: "easypaisa",
    shippingAddress: {
      id: "addr_demo",
      label: "Home",
      fullName: "Amina Buyer",
      phone: "0300-1234567",
      line1: "12 Gulberg III",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54000",
      isDefault: true,
    },
    createdAt: "2026-07-20T12:00:00Z",
    updatedAt: "2026-07-24T16:00:00Z",
    trackingNote: "Delivered — thank you for shopping handmade",
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      placeOrder: (input) => {
        const commission = calculateCommission(input.subtotal);
        const order: Order = {
          id: generateId("ord"),
          userId: input.userId,
          items: input.items,
          status: "placed",
          subtotal: input.subtotal,
          shipping: input.shipping,
          discount: input.discount,
          commission,
          total: Math.max(0, input.subtotal - input.discount + input.shipping),
          paymentMethod: input.paymentMethod,
          shippingAddress: input.shippingAddress,
          promoCode: input.promoCode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          trackingNote: "Order placed — confirmation email queued (placeholder)",
        };
        set({ orders: [order, ...get().orders] });
        return order;
      },
      updateStatus: (orderId, status, note) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  updatedAt: new Date().toISOString(),
                  trackingNote: note ?? o.trackingNote,
                }
              : o
          ),
        });
      },
      getOrdersForUser: (userId) =>
        get().orders.filter((o) => o.userId === userId || o.userId === "demo_buyer"),
      getOrdersForArtisan: (artisanId) =>
        get().orders.filter((o) => o.items.some((i) => i.artisanId === artisanId)),
    }),
    { name: "artisan-lane-orders" }
  )
);
