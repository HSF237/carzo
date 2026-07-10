"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { Product } from "@/lib/types";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.stock === 0) {
    return (
      <div className="rounded-md border border-line bg-bg-soft px-4 py-3 text-sm text-muted">
        Out of stock — check back soon.
      </div>
    );
  }

  const line = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-md border border-line">
        <button
          className="px-3 py-2 text-lg text-muted hover:text-white"
          onClick={() => setQty(Math.max(1, qty - 1))}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-8 text-center font-semibold">{qty}</span>
        <button
          className="px-3 py-2 text-lg text-muted hover:text-white"
          onClick={() => setQty(Math.min(product.stock, qty + 1))}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        onClick={() => {
          add(line, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="skew-chip btn-red rounded-sm px-6 py-3 font-bold text-white"
      >
        <span>{added ? "✓ Added!" : "Add to Cart"}</span>
      </button>
      <button
        onClick={() => {
          add(line, qty);
          router.push("/checkout");
        }}
        className="skew-chip rounded-sm border border-red-brand px-6 py-3 font-bold text-red-hot transition hover:bg-red-brand hover:text-white"
      >
        <span>Buy Now</span>
      </button>
    </div>
  );
}
