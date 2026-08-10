"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";
import { products as seedProducts } from "@/data/products";
import { generateId, slugify } from "@/lib/utils";

interface CatalogState {
  extras: Product[];
  overrides: Record<string, Partial<Product>>;
  deletedIds: string[];
  addProduct: (
    input: Omit<
      Product,
      | "id"
      | "slug"
      | "rating"
      | "reviewCount"
      | "salesCount"
      | "createdAt"
      | "tags"
      | "shortDescription"
    > & { shortDescription?: string; tags?: string[] }
  ) => Product;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getAll: () => Product[];
  getById: (id: string) => Product | undefined;
  getBySlug: (slug: string) => Product | undefined;
  getByArtisan: (artisanId: string) => Product[];
}

function mergeCatalog(
  extras: Product[],
  overrides: Record<string, Partial<Product>>,
  deletedIds: string[]
): Product[] {
  const deleted = new Set(deletedIds);
  const fromSeed = seedProducts
    .filter((p) => !deleted.has(p.id))
    .map((p) => (overrides[p.id] ? { ...p, ...overrides[p.id] } : p));
  const fromExtras = extras
    .filter((p) => !deleted.has(p.id))
    .map((p) => (overrides[p.id] ? { ...p, ...overrides[p.id] } : p));
  return [...fromExtras, ...fromSeed];
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      extras: [],
      overrides: {},
      deletedIds: [],
      addProduct: (input) => {
        const baseSlug = slugify(input.name) || "handmade-piece";
        const slug = `${baseSlug}-${Math.floor(Math.random() * 900 + 100)}`;
        const product: Product = {
          id: generateId("prod"),
          slug,
          name: input.name,
          description: input.description,
          shortDescription:
            input.shortDescription ?? input.description.slice(0, 120),
          price: input.price,
          compareAtPrice: input.compareAtPrice,
          images: input.images.length
            ? input.images
            : ["https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=900&q=80"],
          categoryId: input.categoryId,
          artisanId: input.artisanId,
          materials: input.materials,
          location: input.location,
          rating: 5,
          reviewCount: 0,
          salesCount: 0,
          stock: input.stock,
          featured: input.featured,
          launchCollection: input.launchCollection,
          createdAt: new Date().toISOString().slice(0, 10),
          tags: input.tags ?? ["handmade", "new"],
        };
        set({ extras: [product, ...get().extras] });
        return product;
      },
      updateProduct: (id, data) => {
        const isExtra = get().extras.some((p) => p.id === id);
        if (isExtra) {
          set({
            extras: get().extras.map((p) => (p.id === id ? { ...p, ...data } : p)),
          });
        } else {
          set({
            overrides: {
              ...get().overrides,
              [id]: { ...get().overrides[id], ...data },
            },
          });
        }
      },
      deleteProduct: (id) => {
        set({
          extras: get().extras.filter((p) => p.id !== id),
          deletedIds: get().deletedIds.includes(id)
            ? get().deletedIds
            : [...get().deletedIds, id],
        });
      },
      getAll: () => mergeCatalog(get().extras, get().overrides, get().deletedIds),
      getById: (id) => get().getAll().find((p) => p.id === id),
      getBySlug: (slug) => get().getAll().find((p) => p.slug === slug),
      getByArtisan: (artisanId) =>
        get().getAll().filter((p) => p.artisanId === artisanId),
    }),
    { name: "artisan-lane-catalog" }
  )
);

/** Sync helper for non-React callers (cart totals, etc.) */
export function resolveProduct(id: string) {
  return useCatalogStore.getState().getById(id);
}
