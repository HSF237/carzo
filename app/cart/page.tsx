"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { inr } from "@/lib/format";

export default function CartPage() {
  const { lines, setQty, remove, total, count } = useCart();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="display text-4xl text-white">
          Your <span className="text-red-hot">garage cart</span>
        </h1>

        {lines.length === 0 ? (
          <div className="mt-10 rounded-xl border border-line bg-card p-12 text-center">
            <p className="text-4xl">🏎️💨</p>
            <p className="mt-3 text-muted">Your cart is empty — the garage awaits.</p>
            <Link
              href="/shop"
              className="skew-chip btn-red mt-6 inline-block rounded-sm px-6 py-3 font-bold text-white"
            >
              <span>Start Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {lines.map((l) => (
                <div
                  key={l.productId}
                  className="flex items-center gap-4 rounded-xl border border-line bg-card p-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.image}
                    alt={l.name}
                    className="h-20 w-24 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${l.slug}`}
                      className="line-clamp-1 font-semibold text-white hover:text-red-hot"
                    >
                      {l.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{inr(l.price)} each</p>
                    <button
                      onClick={() => remove(l.productId)}
                      className="mt-1 text-xs text-red-hot hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center rounded-md border border-line">
                    <button
                      className="px-3 py-1.5 text-muted hover:text-white"
                      onClick={() => setQty(l.productId, l.qty - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{l.qty}</span>
                    <button
                      className="px-3 py-1.5 text-muted hover:text-white"
                      onClick={() => setQty(l.productId, l.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="w-24 text-right font-bold text-white">
                    {inr(l.price * l.qty)}
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-xl border border-line bg-card p-6">
              <h2 className="display text-xl text-white">Summary</h2>
              <div className="mt-4 space-y-2 text-sm text-muted">
                <div className="flex justify-between">
                  <span>Items ({count})</span>
                  <span>{inr(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{total >= 999 ? "FREE 🎉" : inr(79)}</span>
                </div>
                <div className="mt-3 flex justify-between border-t border-line pt-3 text-base font-bold text-white">
                  <span>Total</span>
                  <span>{inr(total + (total >= 999 ? 0 : 79))}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="skew-chip btn-red red-glow mt-6 block rounded-sm px-6 py-3 text-center font-bold text-white"
              >
                <span>Checkout →</span>
              </Link>
              <p className="mt-3 text-center text-xs text-muted">
                💵 Cash on Delivery available at checkout
              </p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
