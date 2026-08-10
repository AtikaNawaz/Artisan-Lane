"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { useCatalogStore } from "@/store/catalogStore";
import { usePlatformStore } from "@/store/platformStore";
import { categories } from "@/data/categories";
import { getArtisanById } from "@/data/artisans";

const nav = [
  { href: "/seller", label: "Overview" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/earnings", label: "Earnings" },
  { href: "/seller/analytics", label: "Analytics" },
];

export default function NewProductPage() {
  const user = useAuthStore((s) => s.user);
  const addProduct = useCatalogStore((s) => s.addProduct);
  const spendFeaturedCredit = usePlatformStore((s) => s.spendFeaturedCredit);
  const getFeaturedCredits = usePlatformStore((s) => s.getFeaturedCredits);
  const router = useRouter();
  const [featuredOptIn, setFeaturedOptIn] = useState(false);
  const [error, setError] = useState("");

  if (!user || user.role !== "seller") {
    return (
      <div className="dashboard-shell text-center">
        <Link href="/auth/login" className="btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  const artisanId = user.artisanId ?? "art_ayesha";
  const artisan =
    getArtisanById(artisanId) ??
    usePlatformStore.getState().approvedArtisans.find((a) => a.id === artisanId);
  const credits = getFeaturedCredits(artisanId);

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Add product</h1>
      <p className="mt-1 text-sm text-stone-500">
        Featured listing credits: {credits}. Optional paid Featured Listing available at checkout
        of boosts.
      </p>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      <form
        className="mt-8 grid max-w-2xl gap-4 rounded-2xl bg-white p-6 ring-1 ring-brand-100 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          const fd = new FormData(e.currentTarget);
          const name = String(fd.get("name") || "").trim();
          const price = Number(fd.get("price"));
          const stock = Number(fd.get("stock"));
          const categoryId = String(fd.get("category"));
          const description = String(fd.get("description") || "").trim();
          const materials = String(fd.get("materials") || "")
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean);
          const image = String(fd.get("image") || "").trim();
          const launch = fd.get("launch") === "on";

          let featured = false;
          if (featuredOptIn) {
            if (credits > 0) {
              spendFeaturedCredit(artisanId);
              featured = true;
            } else {
              // Paid Featured Listing  mark featured and note billing
              featured = true;
            }
          }

          if (!name || !price || !description) {
            setError("Please fill in name, price, and description.");
            return;
          }

          const product = addProduct({
            name,
            price,
            stock,
            categoryId,
            description,
            materials: materials.length ? materials : ["Handmade materials"],
            images: image
              ? [image]
              : ["https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=900&q=80"],
            artisanId,
            location: artisan?.city ?? "Pakistan",
            featured,
            launchCollection: launch,
          });

          router.push(`/seller/products?created=${product.id}`);
        }}
      >
        <div className="sm:col-span-2">
          <label className="label-field">Product name</label>
          <input className="input-field" required name="name" />
        </div>
        <div>
          <label className="label-field">Price (PKR)</label>
          <input className="input-field" type="number" required name="price" min={1} />
        </div>
        <div>
          <label className="label-field">Stock</label>
          <input className="input-field" type="number" required name="stock" min={0} defaultValue={10} />
        </div>
        <div className="sm:col-span-2">
          <label className="label-field">Category</label>
          <select className="input-field" name="category" defaultValue={categories[0].id}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label-field">Description</label>
          <textarea className="input-field min-h-[120px]" required name="description" />
        </div>
        <div className="sm:col-span-2">
          <label className="label-field">Materials (comma-separated)</label>
          <input className="input-field" name="materials" placeholder="Stoneware, food-safe glaze" />
        </div>
        <div className="sm:col-span-2">
          <label className="label-field">Image URL</label>
          <input
            className="input-field"
            name="image"
            placeholder="https://images.unsplash.com/…"
          />
        </div>
        <label className="flex items-start gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={featuredOptIn}
            onChange={(e) => setFeaturedOptIn(e.target.checked)}
          />
          <span>
            <strong>Featured Listing</strong> appear at the top of category pages.
            {credits > 0
              ? ` Uses 1 of your ${credits} referral credit(s).`
              : " Rs. 2,500 / 14 days billed to your seller balance if you have no credits."}
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" name="launch" />
          Include in Launch Collection (first 30 days)
        </label>
        {error && <p className="text-sm text-red-700 sm:col-span-2">{error}</p>}
        <button type="submit" className="btn-primary sm:col-span-2 sm:w-fit">
          Save product
        </button>
      </form>
    </div>
  );
}
