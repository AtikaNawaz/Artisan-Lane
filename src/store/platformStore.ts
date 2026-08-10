"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { pendingSellers as seedPending } from "@/data/reviews";
import { generateId, slugify } from "@/lib/utils";
import type { Artisan } from "@/lib/types";

export interface PendingSeller {
  id: string;
  name: string;
  shopName: string;
  city: string;
  specialty: string;
  appliedAt: string;
  email: string;
  bio?: string;
  province?: string;
  referredBy?: string;
  artisanId?: string;
}

interface PlatformState {
  pending: PendingSeller[];
  approvedArtisans: Artisan[];
  /** email -> artisan credentials after approval */
  approvedAccounts: { email: string; artisanId: string; name: string }[];
  featuredCredits: Record<string, number>;
  /** buyer referralCode -> active (Rs. 500 friend discount) */
  buyerReferralCodes: Record<string, { ownerName: string; discount: number }>;
  /** seller referral codes that grant featured credit when used */
  sellerReferralCodes: Record<string, string>;
  submitSellerApplication: (data: Omit<PendingSeller, "id" | "appliedAt" | "artisanId">) => PendingSeller;
  approveSeller: (id: string) => Artisan | null;
  declineSeller: (id: string) => void;
  registerBuyerReferral: (code: string, ownerName: string) => void;
  registerSellerReferral: (code: string, artisanId: string) => void;
  consumeBuyerReferral: (code: string) => boolean;
  grantFeaturedCredit: (artisanId: string, amount?: number) => void;
  spendFeaturedCredit: (artisanId: string) => boolean;
  getFeaturedCredits: (artisanId: string) => number;
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set, get) => ({
      pending: seedPending,
      approvedArtisans: [],
      approvedAccounts: [],
      featuredCredits: {},
      buyerReferralCodes: {
        REFER50: { ownerName: "Artisan Lane", discount: 500 },
      },
      sellerReferralCodes: {
        AYESHA2026: "art_ayesha",
        BILAL2026: "art_bilal",
      },
      submitSellerApplication: (data) => {
        const application: PendingSeller = {
          ...data,
          id: generateId("pending"),
          appliedAt: new Date().toISOString().slice(0, 10),
          artisanId: generateId("art"),
        };
        set({ pending: [application, ...get().pending] });

        const ref = data.referredBy?.trim().toUpperCase();
        if (ref && get().sellerReferralCodes[ref]) {
          const referrerId = get().sellerReferralCodes[ref];
          get().grantFeaturedCredit(referrerId, 1);
        }

        return application;
      },
      approveSeller: (id) => {
        const app = get().pending.find((p) => p.id === id);
        if (!app) return null;
        const artisan: Artisan = {
          id: app.artisanId ?? generateId("art"),
          slug: slugify(app.shopName) || slugify(app.name),
          name: app.name,
          shopName: app.shopName,
          photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
          city: app.city,
          province: app.province ?? "Punjab",
          bio: app.bio ?? `${app.specialty} maker joining Artisan Lane.`,
          story: app.bio ?? `Welcome ${app.name} of ${app.shopName} — a new maker on Artisan Lane.`,
          specialty: app.specialty,
          joinedAt: new Date().toISOString().slice(0, 10),
          rating: 5,
          reviewCount: 0,
          totalSales: 0,
          isNew: true,
          isFeatured: false,
          isApproved: true,
          verified: false,
        };
        set({
          pending: get().pending.filter((p) => p.id !== id),
          approvedArtisans: [artisan, ...get().approvedArtisans],
          approvedAccounts: [
            { email: app.email.toLowerCase(), artisanId: artisan.id, name: artisan.name },
            ...get().approvedAccounts,
          ],
          sellerReferralCodes: {
            ...get().sellerReferralCodes,
            [`${app.name.replace(/\s+/g, "").slice(0, 4).toUpperCase()}2026`]: artisan.id,
          },
        });
        return artisan;
      },
      declineSeller: (id) =>
        set({ pending: get().pending.filter((p) => p.id !== id) }),
      registerBuyerReferral: (code, ownerName) => {
        const upper = code.toUpperCase();
        set({
          buyerReferralCodes: {
            ...get().buyerReferralCodes,
            [upper]: { ownerName, discount: 500 },
          },
        });
      },
      registerSellerReferral: (code, artisanId) => {
        set({
          sellerReferralCodes: {
            ...get().sellerReferralCodes,
            [code.toUpperCase()]: artisanId,
          },
        });
      },
      consumeBuyerReferral: (code) => {
        const upper = code.toUpperCase();
        return Boolean(get().buyerReferralCodes[upper] || upper === "REFER50");
      },
      grantFeaturedCredit: (artisanId, amount = 1) => {
        const current = get().featuredCredits[artisanId] ?? 0;
        set({
          featuredCredits: {
            ...get().featuredCredits,
            [artisanId]: current + amount,
          },
        });
      },
      spendFeaturedCredit: (artisanId) => {
        const current = get().featuredCredits[artisanId] ?? 0;
        if (current < 1) return false;
        set({
          featuredCredits: {
            ...get().featuredCredits,
            [artisanId]: current - 1,
          },
        });
        return true;
      },
      getFeaturedCredits: (artisanId) => get().featuredCredits[artisanId] ?? 0,
    }),
    { name: "artisan-lane-platform" }
  )
);
