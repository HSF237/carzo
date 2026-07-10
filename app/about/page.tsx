import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = { title: "About — Carzo" };

export default function About() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="display text-5xl text-white">
          Built by <span className="text-red-hot">petrolheads</span>,<br />
          for petrolheads.
        </h1>
        <div className="mt-8 space-y-5 leading-relaxed text-muted">
          <p>
            Carzo started with one simple obsession: tiny cars that make a big
            noise in your heart. What began as a personal collection of die-cast
            racers has grown into India&apos;s most passionate destination for scale
            models and RC machines.
          </p>
          <p>
            Every car in our garage is hand-picked. Our die-cast range covers
            everything from ₹85 pocket rockets — perfect for young collectors
            starting out — to limited-run 1:43 premium editions built for the
            display case. Our RC lineup is tested on real Indian terrain: drift
            cars for smooth floors, crawlers for rocky backyards, and buggies
            that don&apos;t mind a splash of monsoon.
          </p>
          <p>
            We ship across India, we accept Cash on Delivery, and every RC car
            comes with a 7-day replacement promise. Because the only thing we
            love more than cars is the smile when the box opens.
          </p>
        </div>

        <div className="mt-12 grid gap-6 text-center sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-card p-6">
            <div className="display text-3xl text-red-hot">100+</div>
            <p className="mt-1 text-sm text-muted">models in the garage</p>
          </div>
          <div className="rounded-xl border border-line bg-card p-6">
            <div className="display text-3xl text-red-hot">All India</div>
            <p className="mt-1 text-sm text-muted">doorstep delivery</p>
          </div>
          <div className="rounded-xl border border-line bg-card p-6">
            <div className="display text-3xl text-red-hot">7-day</div>
            <p className="mt-1 text-sm text-muted">RC replacement promise</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="skew-chip btn-red red-glow inline-block rounded-sm px-8 py-3 font-bold text-white"
          >
            <span>Enter the Garage →</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
