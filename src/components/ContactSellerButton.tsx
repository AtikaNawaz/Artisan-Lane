"use client";

import { useState } from "react";
import type { Artisan } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import { useMessageStore } from "@/store/messageStore";

export function ContactSellerButton({ artisan }: { artisan: Artisan }) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const user = useAuthStore((s) => s.user);
  const sendMessage = useMessageStore((s) => s.sendMessage);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const buyerId = user?.id ?? "demo_buyer";
    const buyerName = user?.name ?? "Guest Buyer";
    sendMessage({
      buyerId,
      buyerName,
      sellerId: artisan.id,
      sellerName: artisan.name,
      senderId: buyerId,
      senderName: buyerName,
      recipientId: artisan.id,
      body,
    });
    setSent(true);
    setBody("");
  }

  return (
    <>
      <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
        Contact seller
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-brand-900/50"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-cream p-6 shadow-xl">
            <h3 className="font-serif text-2xl text-brand-800">Message {artisan.name}</h3>
            {sent ? (
              <p className="mt-4 text-sm text-brand-700">
                Sent! View the thread under Account → Messages.
              </p>
            ) : (
              <form onSubmit={submit} className="mt-4 space-y-3">
                <textarea
                  className="input-field min-h-[120px]"
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Ask about custom orders, timelines, or wholesale…"
                />
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary">
                    Send
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
