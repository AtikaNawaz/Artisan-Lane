"use client";

import { useState } from "react";
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

export default function AddressesPage() {
  const { user, addresses, addAddress, removeAddress, setDefaultAddress } = useAuthStore();
  const [form, setForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    line1: "",
    city: "",
    province: "Punjab",
    postalCode: "",
    isDefault: false,
  });

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
      <h1 className="font-serif text-4xl text-brand-800">Addresses</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="dash-card">
            <div className="flex justify-between">
              <h2 className="font-semibold">{a.label}</h2>
              {a.isDefault && (
                <span className="text-xs font-semibold text-accent-700">Default</span>
              )}
            </div>
            <p className="mt-2 text-sm text-brand-800/80">
              {a.fullName}
              <br />
              {a.line1}
              <br />
              {a.city}, {a.province} {a.postalCode}
              <br />
              {a.phone}
            </p>
            <div className="mt-3 flex gap-2">
              {!a.isDefault && (
                <button
                  type="button"
                  className="text-xs font-semibold text-brand-700"
                  onClick={() => setDefaultAddress(a.id)}
                >
                  Set default
                </button>
              )}
              <button
                type="button"
                className="text-xs text-stone-400"
                onClick={() => removeAddress(a.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <form
        className="mt-8 grid max-w-xl gap-3 rounded-2xl bg-white p-5 ring-1 ring-brand-100 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          addAddress(form);
          setForm({
            label: "Home",
            fullName: "",
            phone: "",
            line1: "",
            city: "",
            province: "Punjab",
            postalCode: "",
            isDefault: false,
          });
        }}
      >
        <h2 className="font-serif text-xl text-brand-800 sm:col-span-2">Add address</h2>
        {(
          [
            ["label", "Label"],
            ["fullName", "Full name"],
            ["phone", "Phone"],
            ["line1", "Street address"],
            ["city", "City"],
            ["postalCode", "Postal code"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="label-field">{label}</label>
            <input
              className="input-field"
              required={key !== "phone"}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        <div>
          <label className="label-field">Province</label>
          <input
            className="input-field"
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          />
          Set as default
        </label>
        <button type="submit" className="btn-primary sm:col-span-2 sm:w-fit">
          Save address
        </button>
      </form>
    </div>
  );
}
