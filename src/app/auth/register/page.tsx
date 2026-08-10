"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function RegisterBuyerPage() {
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    login(form.email, form.name, "buyer");
    router.push("/account");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-serif text-4xl text-brand-800">Create buyer account</h1>
      <p className="mt-2 text-sm text-brand-800/70">
        Save wishlists, track orders, and unlock your personal referral discount code.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl bg-white p-6 ring-1 ring-brand-100">
        <div>
          <label className="label-field">Full name</label>
          <input
            className="input-field"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label-field">Email</label>
          <input
            className="input-field"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label-field">Phone</label>
          <input
            className="input-field"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Create account
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Want to sell?{" "}
        <Link href="/auth/register/seller" className="font-semibold text-brand-700">
          Seller registration
        </Link>
      </p>
    </div>
  );
}
