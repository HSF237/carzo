"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { inr } from "@/lib/format";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { lines, total, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [error, setError] = useState("");

  const shipping = total >= 999 ? 0 : 79;
  const grandTotal = total + shipping;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const customer = {
      name: fd.get("name")?.toString() || "",
      phone: fd.get("phone")?.toString() || "",
      email: fd.get("email")?.toString() || undefined,
      address: fd.get("address")?.toString() || "",
      city: fd.get("city")?.toString() || "",
      state: fd.get("state")?.toString() || "",
      pincode: fd.get("pincode")?.toString() || "",
    };

    const items = lines.map((l) => ({
      productId: l.productId,
      name: l.name,
      price: l.price,
      qty: l.qty,
    }));

    const payload = {
      customer,
      items,
      total: grandTotal,
      paymentMethod,
    };

    if (paymentMethod === "online") {
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error("Failed to load Razorpay payment gateway script. Check your internet connection.");
        }

        const rzpOrderRes = await fetch("/api/checkout/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: grandTotal }),
        });

        if (!rzpOrderRes.ok) {
          const errData = await rzpOrderRes.json();
          throw new Error(errData.error || "Failed to initialize payment gateway.");
        }

        const razorpayOrder = await rzpOrderRes.json();

        const options = {
          key: razorpayOrder.keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Carzo Store",
          description: "Scale Models & RC Cars checkout",
          order_id: razorpayOrder.id,
          prefill: {
            name: customer.name,
            contact: customer.phone,
            email: customer.email || "",
          },
          theme: {
            color: "#e10600",
          },
          handler: async function (response: any) {
            setSubmitting(true);
            try {
              const finalPayload = {
                ...payload,
                paymentId: response.razorpay_payment_id,
              };

              const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalPayload),
              });

              if (!res.ok) throw new Error("Order creation failed");
              const { id } = await res.json();
              clear();
              router.push(`/checkout/success?id=${id}`);
            } catch (err) {
              setError("Payment was successful, but we failed to register the order. Please contact our support crew.");
              setSubmitting(false);
            }
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (err: any) {
        setError(err.message || "Failed to initiate online payment.");
        setSubmitting(false);
      }
    } else {
      // Cash on Delivery
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
              <h2 className="display text-lg text-white">Payment Method</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 transition ${
                    paymentMethod === "cod" ? "border-red-brand bg-bg-soft" : "border-line bg-card"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_choice"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-red-600"
                  />
                  <div>
                    <p className="font-semibold text-white">💵 Cash on Delivery</p>
                    <p className="text-xs text-muted">Pay in cash when your order arrives.</p>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod("online")}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 transition ${
                    paymentMethod === "online" ? "border-red-brand bg-bg-soft" : "border-line bg-card"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_choice"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="accent-red-600"
                  />
                  <div>
                    <p className="font-semibold text-white">💳 Pay Online</p>
                    <p className="text-xs text-muted">UPI, Cards, Netbanking via Razorpay.</p>
                  </div>
                </label>
              </div>
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
              <span>
                {submitting
                  ? "Processing..."
                  : paymentMethod === "online"
                  ? `Pay Online — ${inr(grandTotal)}`
                  : `Place COD Order — ${inr(grandTotal)}`}
              </span>
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
