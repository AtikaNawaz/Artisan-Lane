"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { getCategoriesWithCounts } from "@/data/products";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/sellers", label: "Sellers" },
  { href: "/admin/disputes", label: "Disputes" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminCategoriesPage() {
  const user = useAuthStore((s) => s.user);
  const [cats, setCats] = useState(getCategoriesWithCounts());
  const [name, setName] = useState("");

  if (!user || user.role !== "admin") {
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
      <h1 className="font-serif text-4xl text-brand-800">Categories</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cats.map((c) => (
          <div key={c.id} className="dash-card">
            <h2 className="font-semibold text-brand-800">{c.name}</h2>
            <p className="mt-1 text-sm text-stone-500">{c.description}</p>
            <p className="mt-2 text-xs font-medium text-accent-700">
              {c.productCount} products · /{c.slug}
            </p>
          </div>
        ))}
      </div>
      <form
        className="mt-8 flex max-w-md flex-col gap-3 rounded-2xl bg-white p-5 ring-1 ring-brand-100 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          const slug = name.toLowerCase().replace(/\s+/g, "-");
          setCats((prev) => [
            ...prev,
            {
              id: `cat_${slug}`,
              name,
              slug,
              description: "Custom category",
              image: prev[0].image,
              productCount: 0,
            },
          ]);
          setName("");
        }}
      >
        <div className="flex-1">
          <label className="label-field">Add category</label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kids & Nursery"
          />
        </div>
        <button type="submit" className="btn-primary">
          Add
        </button>
      </form>
    </div>
  );
}
