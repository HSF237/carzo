"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { Product } from "@/lib/types";
import { inr } from "@/lib/format";

export default function StickyBuyBar({
  product,
  anchorRef,
}: {
  product: Product;
  anchorRef: React.RefObject<HTMLElement | null>;
}) {
  const { add, flyToCart } = useCart();
  const [show, setShow] = useState(false);
  const [added, setAdded] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [anchorRef]);

  if (product.stock === 0) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 backdrop-blur transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt="" className="hidden h-12 w-16 rounded object-cover sm:block" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{product.name}</p>
          <p className="text-sm font-bold text-red-hot">{inr(product.price)}</p>
        </div>
        <button
          ref={btnRef}
          onClick={() => {
            add(
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
              },
              1
            );
            if (btnRef.current) flyToCart(product.image, btnRef.current);
            setAdded(true);
            setTimeout(() => setAdded(false), 1200);
          }}
          className="skew-chip btn-red shrink-0 rounded-sm px-5 py-2.5 font-bold text-white"
        >
          <span>{added ? "✓ Added" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
}
