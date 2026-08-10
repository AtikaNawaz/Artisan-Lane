"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/data/categories";
import { artisans } from "@/data/artisans";
import { useCatalogStore } from "@/store/catalogStore";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "";
  const initialLaunch = searchParams.get("launch") === "1";
  const initialSort = searchParams.get("sort") ?? "newest";

  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [launchOnly, setLaunchOnly] = useState(initialLaunch);
  const [sort, setSort] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState(0);

  const getAll = useCatalogStore((s) => s.getAll);
  const extras = useCatalogStore((s) => s.extras);
  const overrides = useCatalogStore((s) => s.overrides);
  const deletedIds = useCatalogStore((s) => s.deletedIds);

  const cities = useMemo(
    () => Array.from(new Set(artisans.map((a) => a.city))).sort(),
    []
  );

  const filtered = useMemo(() => {
    let list = [...getAll()];
    void extras;
    void overrides;
    void deletedIds;

    if (q.trim()) {
      const term = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.tags.some((t) => t.includes(term))
      );
    }

    if (category) {
      const cat = categories.find((c) => c.slug === category);
      if (cat) list = list.filter((p) => p.categoryId === cat.id);
    }

    if (launchOnly) list = list.filter((p) => p.launchCollection);
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    if (location) list = list.filter((p) => p.location === location);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);

    // Featured listings float to top within category views
    list.sort((a, b) => Number(b.featured) - Number(a.featured));

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "bestselling") list.sort((a, b) => b.salesCount - a.salesCount);
    if (sort === "newest")
      list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [
    q,
    category,
    launchOnly,
    sort,
    minPrice,
    maxPrice,
    location,
    minRating,
    getAll,
    extras,
    overrides,
    deletedIds,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-brand-800">Shop handmade</h1>
        <p className="mt-2 text-brand-800/70">
          {filtered.length} pieces from makers across Pakistan
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit space-y-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-brand-100 lg:sticky lg:top-28">
          <div>
            <label className="label-field">Search</label>
            <input
              className="input-field"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Mugs, indigo, silver…"
            />
          </div>
          <div>
            <label className="label-field">Category</label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Location</label>
            <select
              className="input-field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Nationwide</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">
              Price: Rs. {minPrice.toLocaleString()} – Rs. {maxPrice.toLocaleString()}
            </label>
            <input
              type="range"
              min={0}
              max={20000}
              step={500}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full accent-brand-700"
            />
            <input
              type="range"
              min={0}
              max={20000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-700"
            />
          </div>
          <div>
            <label className="label-field">Minimum rating</label>
            <select
              className="input-field"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value={0}>Any</option>
              <option value={4}>4+</option>
              <option value={4.5}>4.5+</option>
              <option value={5}>5 only</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-brand-800">
            <input
              type="checkbox"
              checked={launchOnly}
              onChange={(e) => setLaunchOnly(e.target.checked)}
              className="accent-brand-700"
            />
            Launch Collection only
          </label>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-stone-500">
              Featured listings appear first within your filters
            </p>
            <select
              className="input-field max-w-[200px]"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="bestselling">Best-selling</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-brand-100">
              <p className="font-serif text-2xl text-brand-800">No pieces match</p>
              <p className="mt-2 text-sm text-stone-500">Try widening your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading shop…</div>}>
      <ShopContent />
    </Suspense>
  );
}
