"use client";

import { useRef } from "react";
import AddToCart from "./AddToCart";
import StickyBuyBar from "./StickyBuyBar";
import { Product } from "@/lib/types";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={anchorRef}>
        <AddToCart product={product} />
      </div>
      <StickyBuyBar product={product} anchorRef={anchorRef} />
    </>
  );
}
