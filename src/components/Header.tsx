"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?launch=1", label: "Launch Collection" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const wishCount = useWishlistStore((s) => s.productIds.length);
  const user = useAuthStore((s) => s.user);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  const accountHref =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "seller"
        ? "/seller"
        : "/account";

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100/80 bg-cream/90 backdrop-blur-md">
      <div className="bg-brand-700 px-4 py-2 text-center text-xs text-cream sm:text-sm">
        Launch Rate for sellers: <strong>10% commission</strong> for the first 2 months 
        <Link href="/auth/register/seller" className="ml-1 underline underline-offset-2">
          join as a maker
        </Link>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
        <button
          type="button"
          className="rounded-lg p-2 text-brand-700 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Logo className="mr-auto lg:mr-0" />

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium text-brand-800/80 transition hover:text-brand-700",
                pathname === l.href && "text-brand-700"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/auth/register/seller"
            className="text-sm font-semibold text-accent-700 transition hover:text-brand-700"
          >
            Sell on Artisan Lane
          </Link>
        </nav>

        <form
          action="/shop"
          className="relative ml-auto hidden max-w-xs flex-1 md:block lg:ml-4"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search handmade goods…"
            className="w-full rounded-full border border-brand-100 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-brand-500 focus:ring-2"
          />
        </form>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/account/wishlist"
            className="relative rounded-lg p-2 text-brand-700 hover:bg-brand-50"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {mounted && wishCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-brand-900">
                {wishCount}
              </span>
            )}
          </Link>
          <Link
            href={user ? accountHref : "/auth/login"}
            className="rounded-lg p-2 text-brand-700 hover:bg-brand-50"
            aria-label="Account"
          >
            <User size={20} />
          </Link>
          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-brand-700 hover:bg-brand-50"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {mounted && itemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-cream">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-900/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[80%] max-w-sm flex-col bg-cream p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo size="sm" />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X size={22} />
              </button>
            </div>
            <form action="/shop" className="mb-6">
              <input
                name="q"
                placeholder="Search…"
                className="w-full rounded-full border border-brand-100 bg-white px-4 py-2.5 text-sm"
              />
            </form>
            <div className="flex flex-col gap-4">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="font-serif text-xl text-brand-800">
                  {l.label}
                </Link>
              ))}
              <Link href="/auth/register/seller" className="font-semibold text-accent-700">
                Sell on Artisan Lane
              </Link>
              <Link href={user ? accountHref : "/auth/login"}>
                {user ? `Hi, ${user.name.split(" ")[0]}` : "Sign in"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
