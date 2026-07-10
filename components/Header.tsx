"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import Logo from "./Logo";

const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?cat=diecast", label: "Scale Models" },
  { href: "/shop?cat=rc", label: "RC Cars" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { count } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-5 text-sm text-muted md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`transition hover:text-white ${
                pathname === n.href.split("?")[0] && !n.href.includes("?")
                  ? "text-white"
                  : ""
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="skew-chip btn-red relative flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold text-white"
          >
            <span>Cart</span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-black/30 text-xs">
              {count}
            </span>
          </Link>
        </div>
      </div>
      {/* mobile nav */}
      <nav className="flex gap-4 overflow-x-auto border-t border-line px-4 py-2 text-sm text-muted md:hidden">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="whitespace-nowrap hover:text-white">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
