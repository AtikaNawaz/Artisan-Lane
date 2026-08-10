"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, User, UserRole } from "@/lib/types";
import { generateId, generateReferralCode } from "@/lib/utils";
import { usePlatformStore } from "@/store/platformStore";

interface AuthState {
  user: User | null;
  addresses: Address[];
  /** pending seller awaiting admin approval */
  pendingSellerId?: string;
  login: (email: string, name: string, role: UserRole, artisanId?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "name" | "email" | "phone">>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setPendingSeller: (id?: string) => void;
  activateApprovedSeller: (artisanId: string, name: string, email: string) => void;
}

const demoUsers: Record<string, { name: string; role: UserRole; artisanId?: string }> = {
  "buyer@artisanlane.pk": { name: "Amina Buyer", role: "buyer" },
  "seller@artisanlane.pk": { name: "Ayesha Khan", role: "seller", artisanId: "art_ayesha" },
  "admin@artisanlane.pk": { name: "Platform Admin", role: "admin" },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      pendingSellerId: undefined,
      addresses: [
        {
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
      ],
      login: (email, name, role, artisanId) => {
        const known = demoUsers[email.toLowerCase()];
        const finalName = known?.name ?? name;
        const finalRole = known?.role ?? role;
        const code = generateReferralCode(finalName);
        set({
          user: {
            id: generateId("user"),
            name: finalName,
            email,
            role: finalRole,
            artisanId: known?.artisanId ?? artisanId,
            referralCode: code,
          },
          pendingSellerId: undefined,
        });
        if (finalRole === "buyer") {
          usePlatformStore.getState().registerBuyerReferral(code, finalName);
        }
        if (finalRole === "seller" && (known?.artisanId ?? artisanId)) {
          usePlatformStore
            .getState()
            .registerSellerReferral(code, known?.artisanId ?? artisanId!);
        }
      },
      logout: () => set({ user: null, pendingSellerId: undefined }),
      updateProfile: (data) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, ...data } });
      },
      addAddress: (address) => {
        const id = generateId("addr");
        const addresses = address.isDefault
          ? get().addresses.map((a) => ({ ...a, isDefault: false }))
          : get().addresses;
        set({ addresses: [...addresses, { ...address, id }] });
      },
      removeAddress: (id) =>
        set({ addresses: get().addresses.filter((a) => a.id !== id) }),
      setDefaultAddress: (id) =>
        set({
          addresses: get().addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }),
      setPendingSeller: (id) => set({ pendingSellerId: id }),
      activateApprovedSeller: (artisanId, name, email) => {
        const code = generateReferralCode(name);
        set({
          user: {
            id: generateId("user"),
            name,
            email,
            role: "seller",
            artisanId,
            referralCode: code,
          },
          pendingSellerId: undefined,
        });
        usePlatformStore.getState().registerSellerReferral(code, artisanId);
        usePlatformStore.getState().registerBuyerReferral(code, name);
      },
    }),
    { name: "artisan-lane-auth" }
  )
);
