import Link from "next/link";
import { Product } from "@/lib/types";
import { inr, discountPct } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const off = discountPct(product.price, product.mrp);
  return (
    <Link
      href={`/product/${product.slug}`}
      className="pcard group block overflow-hidden rounded-xl border border-line bg-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-sm bg-red-brand px-2 py-0.5 text-xs font-bold text-white">
            -{off}%
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-sm bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          {product.category === "rc" ? "RC" : product.scale ?? "Diecast"}
        </span>
      </div>
      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-red-hot">
          {product.brandLine ?? (product.category === "rc" ? "RC Cars" : "Scale Models")}
        </p>
        <h3 className="mt-1 line-clamp-1 font-semibold text-white">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-white">{inr(product.price)}</span>
          {off > 0 && (
            <span className="text-sm text-muted line-through">{inr(product.mrp)}</span>
          )}
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <p className="mt-1 text-xs text-amber-400">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="mt-1 text-xs text-red-hot">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
