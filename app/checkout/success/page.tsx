import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SuccessCelebration from "@/components/SuccessCelebration";
import Link from "next/link";

export const metadata = { title: "Order placed — Carzo" };

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return (
    <>
      <SuccessCelebration />
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-6xl">🏆</p>
        <h1 className="display mt-6 text-4xl text-white">
          Order <span className="text-red-hot">confirmed!</span>
        </h1>
        {id && (
          <p className="mt-6 text-muted">
            Your order ID
            <br />
            <span className="plate-reveal mt-2 inline-block rounded-md border-4 border-black bg-gradient-to-b from-yellow-300 to-yellow-400 px-4 py-1.5 font-mono text-xl font-black tracking-wider text-black shadow-lg">
              {id}
            </span>
          </p>
        )}
        <p className="mt-4 text-muted">
          We&apos;ll call you to confirm before shipping. Keep the cash ready —
          pay only when the box is in your hands. 💵
        </p>
        <Link
          href="/shop"
          className="skew-chip btn-red red-glow mt-10 inline-block rounded-sm px-8 py-3 font-bold text-white"
        >
          <span>Keep Shopping →</span>
        </Link>
      </main>
      <Footer />
    </>
  );
}
