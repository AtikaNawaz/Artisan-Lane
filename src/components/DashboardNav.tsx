"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardNav({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto pb-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
              active
                ? "bg-brand-700 text-cream"
                : "bg-white text-brand-800 ring-1 ring-brand-100 hover:bg-brand-50"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
