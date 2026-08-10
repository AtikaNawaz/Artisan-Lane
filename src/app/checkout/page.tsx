"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { resolveProduct } from "@/store/catalogStore";
import { formatPKR } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/types";
import { CreditCard, Smartphone, Wallet } from "lucide-react";

const payments: {
  id: PaymentMethod;
  label: string;
  hint: string;
  icon: typeof Wallet;
}[] = [
  {
    id: "jazzcash",
    label: "JazzCash",
    hint: "Pay securely with your JazzCash mobile wallet",
    icon: Smartphone,
  },
  {
    id: "easypaisa",
    label: "EasyPaisa",
    hint: "Pay securely with your EasyPaisa wallet",
    icon: Wallet,
  },
  {
    id: "card",
    label: "Debit / Credit card",
    hint: "Visa & Mastercard accepted",
    icon: CreditCard,
  },
  {
    id: "cod",
    label: "Cash on delivery",
    hint: "Available in major cities across Pakistan",
    icon: Wallet,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, promoCode, subtotal, discount, shipping, total, clearCart } = useCartStore();
  const { user, addresses, login } = useAuthStore();
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState<PaymentMethod>("jazzcash");
  const [walletPhone, setWalletPhone] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [form, setForm] = useState({
    fullName: defaultAddress?.fullName ?? "",
    phone: defaultAddress?.phone ?? "",
    line1: defaultAddress?.line1 ?? "",
    line2: defaultAddress?.line2 ?? "",
    city: defaultAddress?.city ?? "",
    province: defaultAddress?.province ?? "Punjab",
    postalCode: defaultAddress?.postalCode ?? "",
    email: user?.email ?? "",
  });
  const [placing, setPlacing] = useState(false);
  const [payError, setPayError] = useState("");

  const lineItems = useMemo(
    () =>
      items
        .map((i) => {
          const p = resolveProduct(i.productId);
          if (!p) return null;
          return { ...i, product: p };
        })
        .filter(Boolean),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-brand-800">Nothing to checkout</h1>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">
          Continue shopping
        </Link>
      </div>
    );
  }

  function validatePayment(): boolean {
    setPayError("");
    if (payment === "jazzcash" || payment === "easypaisa") {
      if (!/^03\d{9}$/.test(walletPhone.replace(/[-\s]/g, ""))) {
        setPayError("Enter a valid Pakistani mobile number (03XXXXXXXXX).");
        return false;
      }
    }
    if (payment === "card") {
      if (card.number.replace(/\s/g, "").length < 12 || !card.expiry || !card.cvc) {
        setPayError("Enter complete card details to continue.");
        return false;
      }
    }
    return true;
  }

  function place() {
    if (!validatePayment()) return;
    setPlacing(true);
    // Simulate wallet/card authorization
    window.setTimeout(() => {
      if (!user) {
        login(form.email || "guest@artisanlane.pk", form.fullName || "Guest", "buyer");
      }
      const currentUser = useAuthStore.getState().user;
      const order = placeOrder({
        userId: currentUser?.id ?? "demo_buyer",
        items: lineItems.map((li) => ({
          productId: li!.product.id,
          name: li!.product.name,
          price: li!.product.price,
          quantity: li!.quantity,
          artisanId: li!.product.artisanId,
          image: li!.product.images[0],
        })),
        subtotal: subtotal(),
        shipping: shipping(),
        discount: discount(),
        paymentMethod: payment,
        promoCode: promoCode || undefined,
        shippingAddress: {
          id: "checkout",
          label: "Shipping",
          fullName: form.fullName,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
          isDefault: true,
        },
      });
      clearCart();
      router.push(`/account/orders?placed=${order.id}`);
    }, 900);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <h1 className="font-serif text-4xl text-brand-800">Checkout</h1>
      <div className="mt-4 flex gap-2 text-sm">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            className={`rounded-full px-3 py-1 ${
              step === s ? "bg-brand-700 text-cream" : "bg-brand-50 text-brand-700"
            }`}
          >
            {s === 1 ? "Shipping" : s === 2 ? "Payment" : "Review"}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-brand-100">
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-field">Full name</label>
                <input
                  className="input-field"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label-field">Phone</label>
                <input
                  className="input-field"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="label-field">Email</label>
                <input
                  className="input-field"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field">Address</label>
                <input
                  className="input-field"
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                />
              </div>
              <div>
                <label className="label-field">City</label>
                <input
                  className="input-field"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <label className="label-field">Province</label>
                <select
                  className="input-field"
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                >
                  {["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "ICT", "Gilgit-Baltistan"].map(
                    (p) => (
                      <option key={p}>{p}</option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="label-field">Postal code</label>
                <input
                  className="input-field"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <button type="button" className="btn-primary" onClick={() => setStep(2)}>
                  Continue to payment
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {payments.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${
                    payment === p.id ? "border-brand-700 bg-brand-50" : "border-brand-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === p.id}
                    onChange={() => setPayment(p.id)}
                    className="mt-1 accent-brand-700"
                  />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-semibold text-brand-800">
                      <p.icon size={16} /> {p.label}
                    </span>
                    <span className="text-xs text-stone-500">{p.hint}</span>
                  </span>
                </label>
              ))}

              {(payment === "jazzcash" || payment === "easypaisa") && (
                <div className="rounded-xl bg-linen p-4">
                  <label className="label-field">{payments.find((p) => p.id === payment)?.label} account</label>
                  <input
                    className="input-field"
                    placeholder="03XXXXXXXXX"
                    value={walletPhone}
                    onChange={(e) => setWalletPhone(e.target.value)}
                  />
                  <p className="mt-2 text-xs text-stone-500">
                    You will receive a payment request on your wallet to confirm {formatPKR(total())}.
                  </p>
                </div>
              )}

              {payment === "card" && (
                <div className="grid gap-3 rounded-xl bg-linen p-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label-field">Name on card</label>
                    <input
                      className="input-field"
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label-field">Card number</label>
                    <input
                      className="input-field"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label-field">Expiry</label>
                    <input
                      className="input-field"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label-field">CVC</label>
                    <input
                      className="input-field"
                      placeholder="123"
                      value={card.cvc}
                      onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {payError && <p className="text-sm text-red-700">{payError}</p>}
              <button
                type="button"
                className="btn-primary mt-4"
                onClick={() => {
                  if (validatePayment()) setStep(3);
                }}
              >
                Review order
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-serif text-xl text-brand-800">Confirm & place order</h2>
              <p className="mt-2 text-sm text-brand-800/70">
                Shipping to {form.fullName}, {form.line1}, {form.city}. Payment via{" "}
                {payments.find((p) => p.id === payment)?.label}.
              </p>
              <p className="mt-3 rounded-xl bg-linen px-3 py-2 text-xs text-brand-800/80">
                Order updates will be emailed to {form.email || "your account email"} as status
                moves Placed → Packed → Shipped → Delivered.
              </p>
              <button
                type="button"
                className="btn-primary mt-6"
                disabled={placing}
                onClick={place}
              >
                {placing ? "Confirming payment…" : `Pay ${formatPKR(total())}`}
              </button>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-white p-5 ring-1 ring-brand-100">
          <h2 className="font-serif text-xl">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {lineItems.map((li) => (
              <li key={li!.product.id} className="flex gap-3 text-sm">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                  <Image
                    src={li!.product.images[0]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium leading-tight">{li!.product.name}</p>
                  <p className="text-stone-500">
                    ×{li!.quantity} · {formatPKR(li!.product.price * li!.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-brand-50 pt-3 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPKR(subtotal())}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Discount</dt>
              <dd>-{formatPKR(discount())}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{shipping() === 0 ? "Free" : formatPKR(shipping())}</dd>
            </div>
            <div className="flex justify-between font-semibold">
              <dt>Total</dt>
              <dd>{formatPKR(total())}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
