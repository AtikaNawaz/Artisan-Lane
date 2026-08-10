"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = 14,
  showValue = false,
  count,
  className,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 text-brand-700", className)}>
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "fill-accent-500 text-accent-500" : "text-stone-300"}
            />
          );
        })}
      </div>
      {showValue && <span className="text-sm font-medium">{rating.toFixed(1)}</span>}
      {typeof count === "number" && (
        <span className="text-sm text-stone-500">({count})</span>
      )}
    </div>
  );
}
