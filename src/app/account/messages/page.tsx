"use client";

import { useState } from "react";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuthStore } from "@/store/authStore";
import { useMessageStore } from "@/store/messageStore";
import Link from "next/link";

const nav = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/messages", label: "Messages" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

export default function MessagesPage() {
  const user = useAuthStore((s) => s.user);
  const { conversations, getMessages, sendMessage, markRead } = useMessageStore();
  const [active, setActive] = useState(conversations[0]?.id ?? "");
  const [body, setBody] = useState("");

  if (!user) {
    return (
      <div className="dashboard-shell text-center">
        <Link href="/auth/login" className="btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  const msgs = active ? getMessages(active) : [];
  const conv = conversations.find((c) => c.id === active);

  function reply(e: React.FormEvent) {
    e.preventDefault();
    if (!conv || !body.trim()) return;
    sendMessage({
      conversationId: conv.id,
      buyerId: conv.buyerId,
      buyerName: conv.buyerName,
      sellerId: conv.sellerId,
      sellerName: conv.sellerName,
      senderId: user!.id,
      senderName: user!.name,
      recipientId: conv.sellerId,
      body,
      productId: conv.productId,
      productName: conv.productName,
    });
    setBody("");
  }

  return (
    <div className="dashboard-shell">
      <h1 className="font-serif text-4xl text-brand-800">Messages</h1>
      <div className="mt-6">
        <DashboardNav items={nav} />
      </div>
      <div className="mt-8 grid min-h-[420px] overflow-hidden rounded-2xl bg-white ring-1 ring-brand-100 md:grid-cols-[260px_1fr]">
        <div className="border-b border-brand-50 md:border-b-0 md:border-r">
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActive(c.id);
                markRead(c.id, user.id);
              }}
              className={`block w-full border-b border-brand-50 px-4 py-3 text-left hover:bg-brand-50 ${
                active === c.id ? "bg-brand-50" : ""
              }`}
            >
              <p className="text-sm font-semibold text-brand-800">{c.sellerName}</p>
              <p className="truncate text-xs text-stone-500">{c.lastMessage}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-col">
          {conv ? (
            <>
              <div className="border-b border-brand-50 px-4 py-3">
                <p className="font-semibold">{conv.sellerName}</p>
                {conv.productName && (
                  <p className="text-xs text-stone-500">Re: {conv.productName}</p>
                )}
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {msgs.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      m.senderId === user.id || m.senderName === user.name
                        ? "ml-auto bg-brand-700 text-cream"
                        : "bg-linen text-brand-800"
                    }`}
                  >
                    <p>{m.body}</p>
                    <p className="mt-1 text-[10px] opacity-70">
                      {new Date(m.createdAt).toLocaleString("en-PK")}
                    </p>
                  </div>
                ))}
              </div>
              <form onSubmit={reply} className="flex gap-2 border-t border-brand-50 p-3">
                <input
                  className="input-field"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write a reply…"
                />
                <button type="submit" className="btn-primary shrink-0">
                  Send
                </button>
              </form>
            </>
          ) : (
            <p className="p-6 text-sm text-stone-500">Select a conversation</p>
          )}
        </div>
      </div>
    </div>
  );
}
