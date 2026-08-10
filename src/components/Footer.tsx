import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-100 bg-brand-900 text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo className="[&_span]:text-cream [&_path]:stroke-cream" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/75">
            Handmade with heart, delivered with care. A Pakistan-first marketplace for
            independent artisans with fees that respect their craft.
          </p>
          <div className="mt-4 flex gap-3">
            <SocialIcon href="https://instagram.com/artisanlane.pk" label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://facebook.com/artisanlane.pk" label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://linkedin.com/company/artisan-lane" label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.5 8.5A2 2 0 1 1 6.5 4.5a2 2 0 0 1 0 4zM4.8 20h3.4V9.8H4.8V20zM13.2 9.6c-1.1 0-1.9.4-2.5 1.1V9.8H7.4V20h3.3v-5.3c0-1.4.7-2.3 1.9-2.3 1.1 0 1.7.8 1.7 2.3V20H17.6v-5.8c0-3-1.6-4.6-4.4-4.6z" />
              </svg>
            </SocialIcon>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/75">
            <li>
              <Link href="/shop" className="hover:text-cream">
                Shop all
              </Link>
            </li>
            <li>
              <Link href="/shop?launch=1" className="hover:text-cream">
                Launch Collection
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-cream">
                Our story
              </Link>
            </li>
            <li>
              <Link href="/auth/register/seller" className="hover:text-cream">
                Become a seller
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg">Support</h3>
          <ul className="mt-4 space-y-2 text-sm text-cream/75">
            <li>
              <Link href="/contact" className="hover:text-cream">
                Contact & support
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-cream">
                Track an order
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="hover:text-cream">
                Buyer login
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="hover:text-cream">
                Seller login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg">Stay close</h3>
          <p className="mt-3 text-sm text-cream/75">
            New makers, Launch Collection drops, and referral perks — in your inbox.
          </p>
          <div className="mt-4 [&_input]:border-transparent [&_input]:bg-white/10 [&_input]:text-cream [&_input]:placeholder:text-cream/50 [&_button]:bg-accent-500 [&_button]:text-brand-900">
            <NewsletterForm source="footer" />
          </div>
          <div className="mt-6 space-y-2 text-sm text-cream/75">
            <p className="flex items-center gap-2">
              <Mail size={14} /> contact.atikanawaz@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={14} /> Pakistan — nationwide delivery
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} Artisan Lane. Built for makers. Loved by buyers.
      </div>
    </footer>
  );
}
