"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { useCatalogStore } from "@/store/catalogStore";
import { categories } from "@/data/categories";

const nav = [
  { href: "/seller", label: "Overview" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/earnings", label: "Earnings" },
  { href: "/seller/analytics", label: "Analytics" },
];

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const getById = useCatalogStore((s) => s.getById);
  const updateProduct = useCatalogStore((s) => s.updateProduct);
  const extras = useCatalogStore((s) => s.extras);
  const overrides = useCatalogStore((s) => s.overrides);
  void extras;
  void overrides;

  const product = useMemo(() => getById(params.id), [getById, params.id, extras, overrides]);
  const [saved, setSaved] = useState(false);

  if (!user || user.role !== "seller") {
    return (
      <div className="dashboard-shell text-center">
        <Link href="/auth/login" className="btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  if (!product || product.artisanId !== (user.artisanId ?? "art_ayesha")) {
    return (
      <div className="dashboard-shell text-center">
        <p className="text-brand-800">Product not found in your shop.</p>
        <Link href="/seller/products" className="btn-primary mt-4 inline-flex">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Edit product</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      {saved ? (
        <div className="mt-8 max-w-xl rounded-2xl bg-white p-8 ring-1 ring-brand-100">
          <p className="font-serif text-2xl text-brand-800">Changes saved</p>
          <button type="button" className="btn-primary mt-4" onClick={() => router.push("/seller/products")}>
            Back to products
          </button>
        </div>
      ) : (
        <form
          className="mt-8 grid max-w-2xl gap-4 rounded-2xl bg-white p-6 ring-1 ring-brand-100 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            updateProduct(product.id, {
              name: String(fd.get("name")),
              price: Number(fd.get("price")),
              stock: Number(fd.get("stock")),
              categoryId: String(fd.get("category")),
              description: String(fd.get("description")),
              shortDescription: String(fd.get("description")).slice(0, 120),
              materials: String(fd.get("materials"))
                .split(",")
                .map((m) => m.trim())
                .filter(Boolean),
              images: String(fd.get("image")).trim()
                ? [String(fd.get("image")).trim(), ...product.images.slice(1)]
                : product.images,
              launchCollection: fd.get("launch") === "on",
            });
            setSaved(true);
          }}
        >
          <div className="sm:col-span-2">
            <label className="label-field">Product name</label>
            <input className="input-field" required name="name" defaultValue={product.name} />
          </div>
          <div>
            <label className="label-field">Price (PKR)</label>
            <input
              className="input-field"
              type="number"
              required
              name="price"
              min={1}
              defaultValue={product.price}
            />
          </div>
          <div>
            <label className="label-field">Stock</label>
            <input
              className="input-field"
              type="number"
              required
              name="stock"
              min={0}
              defaultValue={product.stock}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Category</label>
            <select className="input-field" name="category" defaultValue={product.categoryId}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Description</label>
            <textarea
              className="input-field min-h-[120px]"
              required
              name="description"
              defaultValue={product.description}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Materials (comma-separated)</label>
            <input
              className="input-field"
              name="materials"
              defaultValue={product.materials.join(", ")}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-field">Primary image URL</label>
            <input className="input-field" name="image" defaultValue={product.images[0]} />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="launch" defaultChecked={product.launchCollection} />
            Include in Launch Collection
          </label>
          <button type="submit" className="btn-primary sm:col-span-2 sm:w-fit">
            Save changes
          </button>
        </form>
      )}
    </div>
  );
}
