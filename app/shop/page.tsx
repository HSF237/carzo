import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/lib/db";
import { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-line bg-card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-bg-soft" />
      <div className="p-4 space-y-2">
        <div className="h-2 w-1/3 rounded bg-line" />
        <div className="h-4 w-3/4 rounded bg-line" />
        <div className="h-4 w-1/4 rounded bg-line" />
      </div>
    </div>
  );
}

async function ProductGrid({
  cat,
  q,
  sort,
}: {
  cat?: string;
  q?: string;
  sort?: string;
}) {
  let products = await getProducts();

  if (cat === "diecast" || cat === "rc") {
    products = products.filter((p) => p.category === (cat as Category));
  }
  if (q) {
    const needle = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        (p.brandLine ?? "").toLowerCase().includes(needle)
    );
  }
  if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);

  if (products.length === 0) {
    return (
      <div className="mt-16 rounded-xl border border-line bg-card p-12 text-center text-muted">
        No cars matched your search.{" "}
        <Link href="/shop" className="text-red-hot">
          Reset filters →
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-2 text-muted">{products.length} machines ready to roll.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {products.map((p, i) => (
          <Reveal key={p.id} index={i % 8}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </>
  );
}

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; sort?: string }>;
}) {
  const { cat, q, sort } = await searchParams;

  const chip = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      className={`skew-chip rounded-sm px-4 py-1.5 text-sm font-bold transition ${
        active
          ? "btn-red text-white"
          : "border border-line bg-card text-muted hover:border-red-brand hover:text-white"
      }`}
    >
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      <Header />
      {/* Shell renders instantly */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="display text-4xl text-white">
          The <span className="text-red-hot">Garage</span>
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {chip("/shop", "All", !cat)}
          {chip("/shop?cat=diecast", "Scale Models", cat === "diecast")}
          {chip("/shop?cat=rc", "RC Cars", cat === "rc")}
          <form action="/shop" className="ml-auto flex gap-2">
            {cat && <input type="hidden" name="cat" value={cat} />}
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search cars..."
              className="rounded-md border border-line bg-card px-3 py-1.5 text-sm text-white placeholder:text-muted focus:border-red-brand focus:outline-none"
            />
            <select
              name="sort"
              defaultValue={sort ?? ""}
              className="rounded-md border border-line bg-card px-2 py-1.5 text-sm text-muted"
            >
              <option value="">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
            <button className="skew-chip btn-red rounded-sm px-4 py-1.5 text-sm font-bold text-white">
              <span>Go</span>
            </button>
          </form>
        </div>

        {/* Products stream in with skeleton */}
        <Suspense
          fallback={
            <>
              <p className="mt-2 text-muted animate-pulse">Loading products...</p>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            </>
          }
        >
          <ProductGrid cat={cat} q={q} sort={sort} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
