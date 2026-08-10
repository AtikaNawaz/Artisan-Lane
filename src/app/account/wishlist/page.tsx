"use client";

import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { ProductCard } from "@/components/ProductCard";
import { useWishlistStore } from "@/store/wishlistStore";
import { resolveProduct } from "@/store/catalogStore";
import { useCatalogStore } from "@/store/catalogStore";

const nav = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/messages", label: "Messages" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.productIds);
  const extras = useCatalogStore((s) => s.extras);
  const overrides = useCatalogStore((s) => s.overrides);
  void extras;
  void overrides;
  const products = ids.map(resolveProduct).filter(Boolean);

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Wishlist</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      {products.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-brand-800/70">No saved pieces yet.</p>
          <Link href="/shop" className="btn-primary mt-4 inline-flex">
            Browse shop
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p!.id} product={p!} />
          ))}
        </div>
      )}
    </div>
  );
}
