"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Review } from "@/lib/types";
import { reviews as seedReviews } from "@/data/reviews";
import { generateId } from "@/lib/utils";

interface ReviewState {
  extras: Review[];
  addReview: (input: Omit<Review, "id" | "createdAt" | "verifiedPurchase">) => Review;
  getForProduct: (productId: string) => Review[];
  getForArtisan: (artisanId: string) => Review[];
  hasReviewed: (productId: string, authorName: string) => boolean;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      extras: [],
      addReview: (input) => {
        const review: Review = {
          ...input,
          id: generateId("rev"),
          createdAt: new Date().toISOString().slice(0, 10),
          verifiedPurchase: true,
        };
        set({ extras: [review, ...get().extras] });
        return review;
      },
      getForProduct: (productId) => [
        ...get().extras.filter((r) => r.productId === productId),
        ...seedReviews.filter((r) => r.productId === productId),
      ],
      getForArtisan: (artisanId) => [
        ...get().extras.filter((r) => r.artisanId === artisanId),
        ...seedReviews.filter((r) => r.artisanId === artisanId),
      ],
      hasReviewed: (productId, authorName) =>
        get().extras.some(
          (r) =>
            r.productId === productId &&
            r.authorName.toLowerCase() === authorName.toLowerCase()
        ),
    }),
    { name: "artisan-lane-reviews" }
  )
);
