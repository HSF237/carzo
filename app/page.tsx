import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getProducts } from "@/lib/db";
import { inr } from "@/lib/format";

export const dynamic = "force-dynamic";

// ── Skeleton card for loading state ─────────────────────────────────────────
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

function GridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

// ── Async product sections (stream in after shell) ───────────────────────────
async function FeaturedProducts() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  if (!featured.length) return null;
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {featured.map((p, i) => (
        <Reveal key={p.id} index={i}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </div>
  );
}

async function DiecastProducts() {
  const products = await getProducts();
  const diecast = products.filter((p) => p.category === "diecast").slice(0, 4);
  if (!diecast.length) return null;
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {diecast.map((p, i) => (
        <Reveal key={p.id} index={i}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </div>
  );
}

async function RcProducts() {
  const products = await getProducts();
  const rc = products.filter((p) => p.category === "rc").slice(0, 4);
  if (!rc.length) return null;
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {rc.map((p, i) => (
        <Reveal key={p.id} index={i}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </div>
  );
}

async function FramesProducts() {
  const products = await getProducts();
  const frames = products.filter((p) => p.category === "frames").slice(0, 4);
  if (!frames.length) return null;
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {frames.map((p, i) => (
        <Reveal key={p.id} index={i}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero — renders INSTANTLY, no data needed */}
        <section className="relative overflow-hidden border-b border-line">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/hero-landscape.mp4" media="(min-width: 768px)" />
            <source src="/videos/hero-vertical.mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/40" />
          <div className="speedlines absolute inset-0" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
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

        {/* Marquee — renders INSTANTLY */}
        <div className="overflow-hidden border-b border-line bg-red-brand py-2">
          <div className="marquee-track flex w-max gap-8 whitespace-nowrap text-sm font-bold uppercase tracking-widest text-white">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex gap-8">
                <span>🚚 Free shipping over ₹999</span>
                <span>💵 Cash on Delivery</span>
                <span>🏎️ 1:64 · 1:43 · 1:18 scales</span>
                <span>🎮 RC cars up to 35 km/h</span>
                <span>🛡️ 7-day replacement</span>
              </span>
            ))}
          </div>
        </div>

        {/* Featured — streams in as soon as Firebase responds */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex items-end justify-between">
            <h2 className="display text-3xl text-white">
              🔥 Hot right <span className="text-red-hot">now</span>
            </h2>
            <Link href="/shop" className="text-sm text-muted hover:text-white">
              View all →
            </Link>
          </div>
          <Suspense fallback={<GridSkeleton count={4} />}>
            <FeaturedProducts />
          </Suspense>
        </section>

        {/* Category banners — no data, instant */}
        <section className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
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
          <Link
            href="/shop?cat=frames"
            className="group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-card to-bg-soft p-10"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-red-hot">
              Starting at just {inr(800)}
            </p>
            <h3 className="display mt-2 text-4xl text-white">3D Frames</h3>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Hand-crafted display frames — your favorite ride, mounted and ready to hang.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-red-hot transition group-hover:translate-x-2">
              Shop 3D frames →
            </span>
            <span className="display absolute -bottom-4 -right-2 select-none text-8xl text-white/5">
              🖼️
            </span>
          </Link>
        </section>

        {/* Diecast section */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex items-end justify-between">
            <h2 className="display text-3xl text-white">
              Pocket <span className="text-red-hot">rockets</span>
            </h2>
            <Link href="/shop?cat=diecast" className="text-sm text-muted hover:text-white">
              All scale models →
            </Link>
          </div>
          <Suspense fallback={<GridSkeleton count={4} />}>
            <DiecastProducts />
          </Suspense>
        </section>

        {/* RC section */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex items-end justify-between">
            <h2 className="display text-3xl text-white">
              Full <span className="text-red-hot">throttle</span>
            </h2>
            <Link href="/shop?cat=rc" className="text-sm text-muted hover:text-white">
              All RC cars →
            </Link>
          </div>
          <Suspense fallback={<GridSkeleton count={4} />}>
            <RcProducts />
          </Suspense>
        </section>

        {/* 3D Frames section */}
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="flex items-end justify-between">
            <h2 className="display text-3xl text-white">
              Framed &amp; <span className="text-red-hot">ready</span>
            </h2>
            <Link href="/shop?cat=frames" className="text-sm text-muted hover:text-white">
              All 3D frames →
            </Link>
          </div>
          <Suspense fallback={<GridSkeleton count={4} />}>
            <FramesProducts />
          </Suspense>
        </section>

        {/* Trust badges — instant */}
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
