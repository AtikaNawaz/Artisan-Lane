"use client";

import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";

const nav = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/messages", label: "Messages" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="dashboard-shell text-center">
        <Link href="/auth/login" className="btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Account settings</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      <form
        className="mt-8 max-w-lg space-y-4 rounded-2xl bg-white p-6 ring-1 ring-brand-100"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          updateProfile({
            name: String(data.get("name")),
            email: String(data.get("email")),
            phone: String(data.get("phone")),
          });
        }}
      >
        <div>
          <label className="label-field">Name</label>
          <input className="input-field" name="name" defaultValue={user.name} />
        </div>
        <div>
          <label className="label-field">Email</label>
          <input className="input-field" name="email" type="email" defaultValue={user.email} />
        </div>
        <div>
          <label className="label-field">Phone</label>
          <input className="input-field" name="phone" defaultValue={user.phone ?? ""} />
        </div>
        <div className="rounded-xl bg-linen p-3 text-sm">
          <p className="font-semibold text-brand-800">Your referral code</p>
          <p className="font-mono text-lg text-brand-700">{user.referralCode}</p>
          <p className="mt-1 text-xs text-stone-500">
            Share with friends they can use REFER50 for Rs. 500 off at checkout.
          </p>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">
            Save changes
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
          >
            Sign out
          </button>
        </div>
      </form>
    </div>
  );
}
