import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
  size = "md",
}: {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = size === "sm" ? 28 : size === "lg" ? 48 : 36;
  const textClass =
    size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-xl";

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 group", className)}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0 transition-transform duration-300 group-hover:-rotate-3"
      >
        <path
          d="M32 10c-1.5 8-4 14-10 20 6 2 10 8 10 16 0-8 4-14 10-16-6-6-8.5-12-10-20z"
          stroke="#6B3F2A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 30c-4 2-7 6-8 12h36c-1-6-4-10-8-12"
          stroke="#6B3F2A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 42c1 6 5 10 12 10s11-4 12-10"
          stroke="#6B3F2A"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M38 16c4-1 8 1 10 5-3 1-6 1-9-1"
          stroke="#D4A574"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 18c2 3 2 6 0 9"
          stroke="#D4A574"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark && (
        <span className={cn("font-serif font-semibold tracking-tight text-brand-700", textClass)}>
          Artisan Lane
        </span>
      )}
    </Link>
  );
}
