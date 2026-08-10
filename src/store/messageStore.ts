"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Conversation, Message } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface MessageState {
  conversations: Conversation[];
  messages: Message[];
  sendMessage: (input: {
    conversationId?: string;
    buyerId: string;
    buyerName: string;
    sellerId: string;
    sellerName: string;
    senderId: string;
    senderName: string;
    recipientId: string;
    body: string;
    productId?: string;
    productName?: string;
  }) => string;
  markRead: (conversationId: string, readerId: string) => void;
  getMessages: (conversationId: string) => Message[];
}

const seedConversations: Conversation[] = [
  {
    id: "conv_01",
    buyerId: "demo_buyer",
    buyerName: "Amina Buyer",
    sellerId: "art_ayesha",
    sellerName: "Ayesha Khan",
    productId: "prod_02",
    productName: "Indus Speckle Serving Bowl",
    lastMessage: "Could you make a set of four bowls in the same glaze?",
    updatedAt: "2026-08-08T09:30:00Z",
  },
  {
    id: "conv_02",
    buyerId: "demo_buyer",
    buyerName: "Amina Buyer",
    sellerId: "art_sara",
    sellerName: "Sara Malik",
    productId: "prod_12",
    productName: "Riverstone Stacking Rings",
    lastMessage: "Yes — size 7 is available. I can ship tomorrow.",
    updatedAt: "2026-08-07T18:00:00Z",
  },
];

const seedMessages: Message[] = [
  {
    id: "msg_01",
    conversationId: "conv_01",
    senderId: "demo_buyer",
    senderName: "Amina Buyer",
    recipientId: "art_ayesha",
    body: "Hi Ayesha! I love the Indus Speckle bowl. Could you make a set of four bowls in the same glaze?",
    createdAt: "2026-08-08T09:20:00Z",
    read: true,
  },
  {
    id: "msg_02",
    conversationId: "conv_01",
    senderId: "art_ayesha",
    senderName: "Ayesha Khan",
    recipientId: "demo_buyer",
    body: "Absolutely — custom sets take about 10 days. I can quote Rs. 17,500 for four including careful packing.",
    createdAt: "2026-08-08T09:25:00Z",
    read: true,
  },
  {
    id: "msg_03",
    conversationId: "conv_01",
    senderId: "demo_buyer",
    senderName: "Amina Buyer",
    recipientId: "art_ayesha",
    body: "Could you make a set of four bowls in the same glaze?",
    createdAt: "2026-08-08T09:30:00Z",
    read: false,
  },
  {
    id: "msg_04",
    conversationId: "conv_02",
    senderId: "demo_buyer",
    senderName: "Amina Buyer",
    recipientId: "art_sara",
    body: "Do you have riverstone rings in size 7?",
    createdAt: "2026-08-07T17:50:00Z",
    read: true,
  },
  {
    id: "msg_05",
    conversationId: "conv_02",
    senderId: "art_sara",
    senderName: "Sara Malik",
    recipientId: "demo_buyer",
    body: "Yes — size 7 is available. I can ship tomorrow.",
    createdAt: "2026-08-07T18:00:00Z",
    read: true,
  },
];

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      conversations: seedConversations,
      messages: seedMessages,
      sendMessage: (input) => {
        let conversationId = input.conversationId;
        const now = new Date().toISOString();

        if (!conversationId) {
          conversationId = generateId("conv");
          const conv: Conversation = {
            id: conversationId,
            buyerId: input.buyerId,
            buyerName: input.buyerName,
            sellerId: input.sellerId,
            sellerName: input.sellerName,
            productId: input.productId,
            productName: input.productName,
            lastMessage: input.body,
            updatedAt: now,
          };
          set({ conversations: [conv, ...get().conversations] });
        } else {
          set({
            conversations: get().conversations.map((c) =>
              c.id === conversationId
                ? { ...c, lastMessage: input.body, updatedAt: now }
                : c
            ),
          });
        }

        const message: Message = {
          id: generateId("msg"),
          conversationId,
          senderId: input.senderId,
          senderName: input.senderName,
          recipientId: input.recipientId,
          body: input.body,
          createdAt: now,
          read: false,
        };
        set({ messages: [...get().messages, message] });
        return conversationId;
      },
      markRead: (conversationId, readerId) => {
        set({
          messages: get().messages.map((m) =>
            m.conversationId === conversationId && m.recipientId === readerId
              ? { ...m, read: true }
              : m
          ),
        });
      },
      getMessages: (conversationId) =>
        get().messages.filter((m) => m.conversationId === conversationId),
    }),
    { name: "artisan-lane-messages" }
  )
);
