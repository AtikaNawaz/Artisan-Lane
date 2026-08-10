"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { usePlatformStore } from "@/store/platformStore";
import type { UserRole } from "@/lib/types";

function LoginInner() {
  const login = useAuthStore((s) => s.login);
  const activateApprovedSeller = useAuthStore((s) => s.activateApprovedSeller);
  const pending = usePlatformStore((s) => s.pending);
  const approvedAccounts = usePlatformStore((s) => s.approvedAccounts);
  const router = useRouter();
  const searchParams = useSearchParams();
  const showPending = searchParams.get("pending") === "1";

  const [email, setEmail] = useState("buyer@artisanlane.pk");
  const [name, setName] = useState("Amina Buyer");
  const [role, setRole] = useState<UserRole>("buyer");
  const [notice, setNotice] = useState(
    showPending
      ? "Your seller application is pending admin review. You’ll unlock the dashboard once approved."
      : ""
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const emailKey = email.toLowerCase();

    if (role === "seller") {
      const stillPending = pending.find((p) => p.email.toLowerCase() === emailKey);
      if (stillPending) {
        setNotice(
          "Your application is still pending approval. An admin must approve your shop first."
        );
        return;
      }

      if (emailKey === "seller@artisanlane.pk") {
        login(email, name, "seller", "art_ayesha");
        router.push("/seller");
        return;
      }

      const account = approvedAccounts.find((a) => a.email === emailKey);
      if (account) {
        activateApprovedSeller(account.artisanId, account.name, account.email);
        router.push("/seller");
        return;
      }

      setNotice(
        "No approved seller account found for this email. Apply to sell, or use seller@artisanlane.pk for the demo shop."
      );
      return;
    }

    login(email, name, role);
    if (role === "admin") router.push("/admin");
    else router.push("/account");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-serif text-4xl text-brand-800">Sign in</h1>
      <p className="mt-2 text-sm text-brand-800/70">
        Demo accounts: buyer@artisanlane.pk · seller@artisanlane.pk · admin@artisanlane.pk
      </p>
      {notice && (
        <p className="mt-4 rounded-xl bg-linen px-4 py-3 text-sm text-brand-800">{notice}</p>
      )}
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl bg-white p-6 ring-1 ring-brand-100">
        <div>
          <label className="label-field">Name</label>
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Email</label>
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label-field">Sign in as</label>
          <select
            className="input-field"
            value={role}
            onChange={(e) => {
              const r = e.target.value as UserRole;
              setRole(r);
              if (r === "buyer") {
                setEmail("buyer@artisanlane.pk");
                setName("Amina Buyer");
              }
              if (r === "seller") {
                setEmail("seller@artisanlane.pk");
                setName("Ayesha Khan");
              }
              if (r === "admin") {
                setEmail("admin@artisanlane.pk");
                setName("Platform Admin");
              }
            }}
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn-primary w-full">
          Continue
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-stone-500">
        New here?{" "}
        <Link href="/auth/register" className="font-semibold text-brand-700">
          Create a buyer account
        </Link>{" "}
        or{" "}
        <Link href="/auth/register/seller" className="font-semibold text-brand-700">
          apply as a seller
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
