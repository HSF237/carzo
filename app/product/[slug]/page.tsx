import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/db";
import { inr, discountPct } from "@/lib/format";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const off = discountPct(product.price, product.mrp);
  const related = (await getProducts())
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <nav className="text-sm text-muted">
          <Link href="/" className="hover:text-white">Home</Link> /{" "}
          <Link href="/shop" className="hover:text-white">Shop</Link> /{" "}
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-line bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-hot">
              {product.brandLine ?? (product.category === "rc" ? "RC Cars" : "Scale Models")}
              {product.scale ? ` · ${product.scale} scale` : ""}
            </p>
            <h1 className="display mt-2 text-4xl text-white">{product.name}</h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">{inr(product.price)}</span>
              {off > 0 && (
                <>
                  <span className="text-lg text-muted line-through">{inr(product.mrp)}</span>
                  <span className="rounded-sm bg-red-brand px-2 py-0.5 text-xs font-bold text-white">
                    SAVE {off}%
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-muted">Inclusive of all taxes · Cash on Delivery available</p>

            <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

            <div className="mt-8">
              <AddToCart product={product} />
            </div>

            <ul className="mt-8 space-y-2 rounded-xl border border-line bg-card p-5 text-sm text-muted">
              <li>🚚 Free shipping on orders over ₹999</li>
              <li>💵 Cash on Delivery across India</li>
              {product.category === "rc" && <li>🛡️ 7-day replacement warranty</li>}
              <li>📦 Ships in 24–48 hours</li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="display text-2xl text-white">
              You may also <span className="text-red-hot">like</span>
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
