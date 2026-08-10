"use client";

import Link from "next/link";
import Image from "next/image";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { useCatalogStore } from "@/store/catalogStore";
import { usePlatformStore } from "@/store/platformStore";
import { formatPKR } from "@/lib/utils";

const nav = [
  { href: "/seller", label: "Overview" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/earnings", label: "Earnings" },
  { href: "/seller/analytics", label: "Analytics" },
];

export default function SellerProductsPage() {
  const user = useAuthStore((s) => s.user);
  const getByArtisan = useCatalogStore((s) => s.getByArtisan);
  const deleteProduct = useCatalogStore((s) => s.deleteProduct);
  const updateProduct = useCatalogStore((s) => s.updateProduct);
  const extras = useCatalogStore((s) => s.extras);
  const overrides = useCatalogStore((s) => s.overrides);
  const deletedIds = useCatalogStore((s) => s.deletedIds);
  const spendFeaturedCredit = usePlatformStore((s) => s.spendFeaturedCredit);
  const getFeaturedCredits = usePlatformStore((s) => s.getFeaturedCredits);

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
  // subscribe to catalog mutations
  void extras;
  void overrides;
  void deletedIds;
  const products = getByArtisan(artisanId);
  const credits = getFeaturedCredits(artisanId);

  return (
    <div className="dashboard-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl text-brand-800">Products</h1>
          <p className="mt-1 text-sm text-stone-500">
            Featured listing credits available: <strong>{credits}</strong>
          </p>
        </div>
        <Link href="/seller/products/new" className="btn-primary">
          Add product
        </Link>
      </div>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-2xl bg-white ring-1 ring-brand-100">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-brand-50 bg-brand-50/50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Sales</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-brand-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                      <Image src={p.images[0]} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <Link href={`/product/${p.slug}`} className="font-medium text-brand-800">
                        {p.name}
                      </Link>
                      <p className="text-xs text-stone-400">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{formatPKR(p.price)}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    className="w-20 rounded-lg border border-brand-100 px-2 py-1"
                    value={p.stock}
                    onChange={(e) =>
                      updateProduct(p.id, { stock: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="px-4 py-3">{p.salesCount}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.featured && (
                      <span className="rounded-full bg-accent-500/30 px-2 py-0.5 text-[10px] font-semibold">
                        Featured
                      </span>
                    )}
                    {p.launchCollection && (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold">
                        Launch
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/seller/products/edit/${p.id}`}
                      className="text-xs font-semibold text-brand-700"
                    >
                      Edit
                    </Link>
                    {!p.featured && (
                      <button
                        type="button"
                        className="text-xs font-semibold text-accent-700"
                        onClick={() => {
                          if (spendFeaturedCredit(artisanId)) {
                            updateProduct(p.id, { featured: true });
                          } else {
                            alert(
                              "No featured credits left. Refer a seller or purchase a Featured Listing."
                            );
                          }
                        }}
                      >
                        Feature
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-700"
                      onClick={() => {
                        if (confirm(`Remove “${p.name}” from your shop?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                  No products yet.{" "}
                  <Link href="/seller/products/new" className="text-brand-700 underline">
                    Add your first listing
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
