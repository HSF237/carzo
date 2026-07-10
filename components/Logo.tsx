import Link from "next/link";

export default function Logo({ size = "text-2xl" }: { size?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2 select-none group">
      <svg
        className="h-8 w-8 text-red-brand transition duration-300 group-hover:scale-110"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        {/* Tire/Speedometer track */}
        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" className="text-white/10" />
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeDasharray="200 100"
          strokeDashoffset="80"
          className="text-red-brand"
        />
        
        {/* Speed lines/Emblem stripes */}
        <rect x="25" y="45" width="32" height="7" rx="2" fill="currentColor" className="text-red-hot" />
        <rect x="18" y="33" width="22" height="7" rx="2" fill="currentColor" className="text-red-brand" />
        <rect x="32" y="57" width="25" height="7" rx="2" fill="currentColor" className="text-white" />
        
        {/* Center hub */}
        <circle cx="50" cy="50" r="10" className="text-white" />
      </svg>
      <div className={`display ${size} tracking-tight leading-none`}>
        <span className="text-white">Car</span>
        <span className="text-red-hot">zo</span>
      </div>
    </Link>
  );
}
