"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { inr } from "@/lib/format";

export default function CheckoutPage() {
  const { lines, total, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shipping = total >= 999 ? 0 : 79;
  const grandTotal = total + shipping;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      customer: {
        name: fd.get("name"),
        phone: fd.get("phone"),
        email: fd.get("email") || undefined,
        address: fd.get("address"),
        city: fd.get("city"),
        state: fd.get("state"),
        pincode: fd.get("pincode"),
      },
      items: lines.map((l) => ({
        productId: l.productId,
        name: l.name,
        price: l.price,
        qty: l.qty,
      })),
      total: grandTotal,
      paymentMethod: "cod",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Order failed");
      const { id } = await res.json();
      clear();
      router.push(`/checkout/success?id=${id}`);
    } catch {
      setError("Something went wrong placing your order. Please try again.");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <p className="text-4xl">🛒</p>
          <h1 className="display mt-4 text-3xl text-white">Nothing to check out</h1>
          <Link
            href="/shop"
            className="skew-chip btn-red mt-6 inline-block rounded-sm px-6 py-3 font-bold text-white"
          >
            <span>Back to Shop</span>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const input =
    "mt-1 w-full rounded-md border border-line bg-bg-soft px-3 py-2 text-white focus:border-red-brand focus:outline-none";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="display text-4xl text-white">
          Final <span className="text-red-hot">lap</span> 🏁
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <form onSubmit={onSubmit} className="space-y-5 lg:col-span-2">
            <div className="rounded-xl border border-line bg-card p-6">
              <h2 className="display text-lg text-white">Delivery details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm text-muted">Full name *</label>
                  <input name="name" required className={input} />
                </div>
                <div>
                  <label className="text-sm text-muted">Phone (10 digits) *</label>
                  <input
                    name="phone"
                    required
                    pattern="[0-9]{10}"
                    title="Enter a 10-digit mobile number"
                    className={input}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted">Email (optional)</label>
                  <input name="email" type="email" className={input} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-muted">Address *</label>
                  <textarea name="address" required rows={2} className={input} />
                </div>
                <div>
                  <label className="text-sm text-muted">City *</label>
                  <input name="city" required className={input} />
                </div>
                <div>
                  <label className="text-sm text-muted">State *</label>
                  <input name="state" required className={input} />
                </div>
                <div>
                  <label className="text-sm text-muted">PIN code *</label>
                  <input
                    name="pincode"
                    required
                    pattern="[0-9]{6}"
                    title="Enter a 6-digit PIN code"
                    className={input}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-card p-6">
              <h2 className="display text-lg text-white">Payment</h2>
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-md border border-red-brand bg-bg-soft p-4">
                <input type="radio" checked readOnly className="accent-red-600" />
                <div>
                  <p className="font-semibold text-white">💵 Cash on Delivery</p>
                  <p className="text-xs text-muted">
                    Pay in cash when your order arrives. Online payment coming soon.
                  </p>
                </div>
              </label>
            </div>

            {error && (
              <p className="rounded-md border border-red-brand bg-red-brand/10 p-3 text-sm text-red-hot">
                {error}
              </p>
            )}

            <button
              disabled={submitting}
              className="skew-chip btn-red red-glow w-full rounded-sm px-6 py-4 text-lg font-bold text-white disabled:opacity-60"
            >
              <span>{submitting ? "Placing order..." : `Place Order — ${inr(grandTotal)}`}</span>
            </button>
          </form>

          <aside className="h-fit rounded-xl border border-line bg-card p-6">
            <h2 className="display text-lg text-white">Your order</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {lines.map((l) => (
                <li key={l.productId} className="flex justify-between gap-2 text-muted">
                  <span className="line-clamp-1">
                    {l.name} <span className="text-xs">× {l.qty}</span>
                  </span>
                  <span className="shrink-0 text-white">{inr(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{inr(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE 🎉" : inr(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-white">
                <span>Total</span>
                <span>{inr(grandTotal)}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
