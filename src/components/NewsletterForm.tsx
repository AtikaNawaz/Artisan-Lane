"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // Placeholder: wire to email provider (Mailchimp / Resend / etc.)
    console.info(`[newsletter:${source}]`, email);
    setDone(true);
    setEmail("");
  }

  if (done) {
    return (
      <p className="flex items-center gap-2 text-sm text-brand-700">
        <Check size={16} /> You&apos;re on the list — welcome to the lane.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor={`newsletter-${source}`}>
        Email address
      </label>
      <input
        id={`newsletter-${source}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="flex-1 rounded-full border border-brand-200 bg-white px-4 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
      />
      <button
        type="submit"
        className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-brand-800"
      >
        Subscribe
      </button>
    </form>
  );
}
