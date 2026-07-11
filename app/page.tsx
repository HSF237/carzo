import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/db";
import { inr } from "@/lib/format";

export const revalidate = 60; // re-fetch products every 60 seconds

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const diecast = products.filter((p) => p.category === "diecast").slice(0, 4);
  const rc = products.filter((p) => p.category === "rc").slice(0, 4);

  return (
    <>
      <Header />
      <main>
        <section className="speedlines relative overflow-hidden border-b border-line">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
            <div>
              <p className="skew-chip inline-block rounded-sm bg-red-brand px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                <span>🏁 New drops every week</span>
              </p>
              <h1 className="display mt-5 text-5xl leading-[0.95] text-white md:text-7xl">
                Small cars.
                <br />
                <span className="text-red-hot">Big adrenaline.</span>
              </h1>
              <p className="mt-5 max-w-md text-muted">
                From ₹85 pocket rockets to full-throttle RC beasts — Carzo brings
                the garage of your dreams to your doorstep, anywhere in India.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/shop?cat=diecast"
                  className="skew-chip btn-red red-glow rounded-sm px-7 py-3 font-bold text-white"
                >
                  <span>Scale Models from {inr(85)}</span>
                </Link>
                <Link
                  href="/shop?cat=rc"
                  className="skew-chip rounded-sm border border-line bg-card px-7 py-3 font-bold text-white transition hover:border-red-brand"
                >
                  <span>RC Cars 🎮</span>
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="display select-none text-right leading-[0.85]">
                <div className="text-stroke text-8xl">CARZO</div>
                <div className="text-8xl text-red-brand/90">CARZO</div>
                <div className="text-stroke text-8xl">CARZO</div>
              </div>
            </div>
          </div>
        </section>

        <div className="overflow-hidden border-b border-line bg-red-brand py-2">
          <div className="marquee-track flex w-max gap-8 whitespace-nowrap text-sm font-bold uppercase tracking-widest text-white">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex gap-8">
                <span>🚚 Free shipping over ₹999</span>
                <span>💵 Cash on Delivery</span>
                <span>🏎️ 1:64 · 1:43 · 1:18 scales</span>
                <span>🎮 RC cars up to 35 km/h</span>
                <span>🛡️ 7-day replacement</span>
                <span>🚚 Free shipping over ₹999</span>
                <span>💵 Cash on Delivery</span>
                <span>🏎️ 1:64 · 1:43 · 1:18 scales</span>
                <span>🎮 RC cars up to 35 km/h</span>
                <span>🛡️ 7-day replacement</span>
              </span>
            ))}
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex items-end justify-between">
            <h2 className="display text-3xl text-white">
              🔥 Hot right <span className="text-red-hot">now</span>
            </h2>
            <Link href="/shop" className="text-sm text-muted hover:text-white">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2">
          <Link
            href="/shop?cat=diecast"
            className="group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-card to-bg-soft p-10"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-red-hot">
              Starting at just {inr(85)}
            </p>
            <h3 className="display mt-2 text-4xl text-white">Scale Models</h3>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Die-cast legends in 1:64 and 1:43. Collect them all.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-red-hot transition group-hover:translate-x-2">
              Shop diecast →
            </span>
            <span className="display absolute -bottom-4 -right-2 select-none text-8xl text-white/5">
              1:64
            </span>
          </Link>
          <Link
            href="/shop?cat=rc"
            className="group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-red-brand/25 to-bg-soft p-10"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-red-hot">
              {inr(1499)} – {inr(2999)}
            </p>
            <h3 className="display mt-2 text-4xl text-white">RC Cars</h3>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Drift, crawl, blast. 2.4GHz remotes, rechargeable power.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-red-hot transition group-hover:translate-x-2">
              Shop RC →
            </span>
            <span className="display absolute -bottom-4 -right-2 select-none text-8xl text-white/5">
              35km/h
            </span>
          </Link>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex items-end justify-between">
            <h2 className="display text-3xl text-white">
              Pocket <span className="text-red-hot">rockets</span>
            </h2>
            <Link href="/shop?cat=diecast" className="text-sm text-muted hover:text-white">
              All scale models →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {diecast.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="flex items-end justify-between">
            <h2 className="display text-3xl text-white">
              Full <span className="text-red-hot">throttle</span>
            </h2>
            <Link href="/shop?cat=rc" className="text-sm text-muted hover:text-white">
              All RC cars →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {rc.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section className="border-t border-line bg-bg-soft">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-center md:grid-cols-3">
            <div>
              <div className="text-3xl">🚚</div>
              <h4 className="display mt-2 text-white">Ships across India</h4>
              <p className="mt-1 text-sm text-muted">Free shipping on orders over ₹999.</p>
            </div>
            <div>
              <div className="text-3xl">💵</div>
              <h4 className="display mt-2 text-white">Cash on Delivery</h4>
              <p className="mt-1 text-sm text-muted">Pay when the box is in your hands.</p>
            </div>
            <div>
              <div className="text-3xl">🛡️</div>
              <h4 className="display mt-2 text-white">7-day replacement</h4>
              <p className="mt-1 text-sm text-muted">On all RC cars. No questions asked.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
