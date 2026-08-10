"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { usePlatformStore } from "@/store/platformStore";

export default function RegisterSellerPage() {
  const setPendingSeller = useAuthStore((s) => s.setPendingSeller);
  const router = useRouter();
  const submitSellerApplication = usePlatformStore((s) => s.submitSellerApplication);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    shopName: "",
    city: "",
    specialty: "",
    bio: "",
    referredBy: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const application = submitSellerApplication({
      name: form.name,
      email: form.email,
      shopName: form.shopName,
      city: form.city,
      specialty: form.specialty,
      bio: form.bio,
      referredBy: form.referredBy || undefined,
    });
    setPendingSeller(application.id);
    setSubmitted(true);
    setTimeout(() => router.push("/auth/login?pending=1"), 1600);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="font-serif text-4xl text-brand-800">Join as a seller</h1>
      <p className="mt-2 text-brand-800/70">
        Launch Rate: <strong>10% commission</strong> for your first two months (then 15%).
        Refer another seller and earn a featured-listing credit.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-2xl bg-white p-8 text-center ring-1 ring-brand-100">
          <p className="font-serif text-2xl text-brand-800">Application received</p>
          <p className="mt-2 text-sm text-brand-800/70">
            An admin will review your shop within 1–2 business days. You&apos;ll get dashboard
            access as soon as you&apos;re approved.
          </p>
        </div>
      ) : (
        <form
          onSubmit={submit}
          className="mt-8 grid gap-4 rounded-2xl bg-white p-6 ring-1 ring-brand-100 sm:grid-cols-2"
        >
          <div>
            <label className="label-field">Your name</label>
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
            <label className="label-field">Shop name</label>
            <input
              className="input-field"
              required
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">City</label>
            <input
              className="input-field"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Specialty</label>
            <input
              className="input-field"
              required
              placeholder="e.g. Stoneware pottery"
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Short bio</label>
            <textarea
              className="input-field min-h-[100px]"
              required
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Referred by (seller code — optional)</label>
            <input
              className="input-field"
              placeholder="e.g. AYESHA2026 — earns them a featured-listing credit"
              value={form.referredBy}
              onChange={(e) => setForm({ ...form, referredBy: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Submit application
            </button>
            <p className="mt-3 text-xs text-stone-500">
              Applications are reviewed by admin. Already approved?{" "}
              <Link href="/auth/login" className="text-brand-700 underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
