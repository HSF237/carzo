import Link from "next/link";
import Image from "next/image";

const HEIGHTS: Record<string, string> = {
  "text-xl": "h-6",
  "text-2xl": "h-8",
  "text-3xl": "h-10",
};

export default function Logo({ size = "text-2xl" }: { size?: string }) {
  const heightClass = HEIGHTS[size] ?? "h-8";
  return (
    <Link href="/" className="flex items-center select-none">
      <Image
        src="/logo.png"
        alt="Carzo"
        width={1197}
        height={326}
        priority
        className={`w-auto ${heightClass}`}
      />
    </Link>
  );
}
