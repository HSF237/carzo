import Link from "next/link";

export default function Logo({ size = "text-2xl" }: { size?: string }) {
  return (
    <Link href="/" className={`display ${size} tracking-tight select-none`}>
      <span className="text-white">Car</span>
      <span className="text-red-hot">zo</span>
      <span className="ml-1 inline-block h-[3px] w-6 bg-red-brand align-middle" />
    </Link>
  );
}
