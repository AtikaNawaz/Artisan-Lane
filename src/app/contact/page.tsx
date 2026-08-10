"use client";

import { useState } from "react";
import { Mail, MapPin, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder: wire to support inbox / ticketing
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <h1 className="font-serif text-4xl text-brand-800">Contact & support</h1>
      <p className="mt-2 max-w-2xl text-brand-800/70">
        Questions about an order, a custom commission, or joining as a seller? We are here.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="dash-card flex gap-3">
            <Mail className="text-brand-700" size={20} />
            <div>
              <h2 className="font-semibold text-brand-800">Email</h2>
              <a
                href="mailto:contact.atikanawaz@gmail.com"
                className="text-sm text-accent-700 hover:underline"
              >
                contact.atikanawaz@gmail.com
              </a>
            </div>
          </div>
          <div className="dash-card flex gap-3">
            <MapPin className="text-brand-700" size={20} />
            <div>
              <h2 className="font-semibold text-brand-800">Coverage</h2>
              <p className="text-sm text-brand-800/70">Pakistan — nationwide delivery</p>
            </div>
          </div>
          <div className="dash-card flex gap-3">
            <MessageSquare className="text-brand-700" size={20} />
            <div>
              <h2 className="font-semibold text-brand-800">Buyer ↔ seller messaging</h2>
              <p className="text-sm text-brand-800/70">
                For product questions, use Contact Seller on any product or artisan page —
                it keeps custom-order talks in one thread.
              </p>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <h2 className="font-serif text-2xl text-brand-800">Send a message</h2>
          {sent ? (
            <p className="mt-4 text-brand-700">
              Thanks — your note is queued. We typically reply within one business day.
              (Email integration placeholder.)
            </p>
          ) : (
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div>
                <label className="label-field">Name</label>
                <input className="input-field" required name="name" />
              </div>
              <div>
                <label className="label-field">Email</label>
                <input className="input-field" type="email" required name="email" />
              </div>
              <div>
                <label className="label-field">Topic</label>
                <select className="input-field" name="topic" defaultValue="order">
                  <option value="order">Order help</option>
                  <option value="seller">Seller application</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label-field">Message</label>
                <textarea className="input-field min-h-[120px]" required name="message" />
              </div>
              <button type="submit" className="btn-primary">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
