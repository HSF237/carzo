"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import Logo from "./Logo";

const nav = [
  { href: "/", label: "Home", icon: "🏁" },
  { href: "/shop", label: "Shop", icon: "🛒" },
  { href: "/shop?cat=diecast", label: "Scale Models", icon: "🏎️" },
  { href: "/shop?cat=rc", label: "RC Cars", icon: "🎮" },
  { href: "/about", label: "About", icon: "ℹ️" },
  { href: "/contact", label: "Contact", icon: "📞" },
];

export default function Header() {
  const { count, cartIconRef } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [kick, setKick] = useState(false);
  const prevCount = useRef(count);

  // lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Bump the cart badge whenever an item is added
  useEffect(() => {
    if (count > prevCount.current) {
      setKick(true);
      const t = setTimeout(() => setKick(false), 400);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 text-sm text-muted md:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`transition hover:text-white ${
                  pathname === n.href.split("?")[0] && !n.href.includes("?")
                    ? "text-white font-semibold"
                    : ""
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Shop button — always visible on mobile */}
            <Link
              href="/shop"
              className="skew-chip btn-red flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-bold text-white md:hidden"
            >
              <span className="skew-fix">🛒 Shop</span>
            </Link>

            {/* Cart button */}
            <Link
              href="/cart"
              ref={cartIconRef}
              className={`skew-chip btn-red relative flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-bold text-white ${kick ? "cart-kick" : ""}`}
            >
              <span>Cart</span>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-black/30 text-xs">
                {count}
              </span>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              className="mobile-menu-btn relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-md border border-line bg-card md:hidden"
            >
              <span className={`hamburger-line ${open ? "line-top-open" : ""}`} />
              <span className={`hamburger-line ${open ? "line-mid-open" : ""}`} />
              <span className={`hamburger-line ${open ? "line-bot-open" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`mobile-nav-overlay ${open ? "overlay-open" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      <nav className={`mobile-nav-drawer ${open ? "drawer-open" : ""}`}>
        {/* Racing speedlines background */}
        <div className="racing-bg" />

        {/* Red racing stripe at top */}
        <div className="h-1 w-full bg-gradient-to-r from-red-brand via-red-hot to-red-brand" />

        {/* Header inside drawer */}
        <div className="flex items-center justify-between px-6 py-5">
          <span className="display text-lg text-white tracking-wider">MENU</span>
          <button
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:border-red-brand hover:text-white transition"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Checkered accent line */}
        <div className="checkered-divider mx-6 mb-6 h-[3px] rounded-full" />

        {/* Nav links */}
        <div className="flex flex-col gap-2 px-4">
          {nav.map((n, i) => {
            const isActive = pathname === n.href.split("?")[0] && !n.href.includes("?");
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={close}
                style={{ animationDelay: open ? `${i * 60}ms` : "0ms" }}
                className={`nav-link-btn ${open ? "nav-link-enter" : ""} ${isActive ? "nav-link-active" : ""}`}
              >
                <span className="text-xl">{n.icon}</span>
                <span className="font-bold text-base">{n.label}</span>
                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-red-hot" />
                )}
                <span className="ml-auto text-muted text-xs">›</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom racing badge */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <span className="display text-[10px] text-muted/40 tracking-[0.3em]">CARZO RACING</span>
        </div>
      </nav>

      <style>{`
        /* Hamburger lines */
        .hamburger-line {
          display: block;
          width: 22px;
          height: 2px;
          background: #f4f4f5;
          border-radius: 2px;
          transition: transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.2s ease;
          transform-origin: center;
        }
        .line-top-open  { transform: translateY(7px) rotate(45deg); }
        .line-mid-open  { opacity: 0; transform: scaleX(0); }
        .line-bot-open  { transform: translateY(-7px) rotate(-45deg); }

        /* Overlay */
        .mobile-nav-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(3px);
          z-index: 60;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .mobile-nav-overlay.overlay-open {
          display: block;
          opacity: 1;
        }

        /* Drawer */
        .mobile-nav-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(85vw, 340px);
          background: #0a0a0b;
          border-left: 1px solid #26262b;
          z-index: 70;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .mobile-nav-drawer.drawer-open {
          transform: translateX(0);
        }

        /* Racing speedlines BG */
        .racing-bg {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            100deg,
            transparent 0 46px,
            rgba(225,6,0,0.05) 46px 48px,
            transparent 48px 90px,
            rgba(255,255,255,0.02) 90px 92px
          );
          pointer-events: none;
        }

        /* Checkered divider */
        .checkered-divider {
          background: repeating-linear-gradient(
            90deg,
            #e10600 0 8px,
            transparent 8px 16px
          );
          opacity: 0.7;
        }

        /* Nav link buttons */
        .nav-link-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid #26262b;
          background: #121214;
          color: #9b9ba3;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
          opacity: 0;
          transform: translateX(40px);
        }
        .nav-link-btn.nav-link-enter {
          animation: slideInRight 0.35s cubic-bezier(.4,0,.2,1) forwards;
        }
        .nav-link-btn:active { transform: scale(0.97); }
        .nav-link-btn:hover,
        .nav-link-btn.nav-link-active {
          background: #17171a;
          border-color: rgba(225,6,0,0.5);
          color: #f4f4f5;
        }
        .nav-link-active {
          border-color: rgba(225,6,0,0.6) !important;
          box-shadow: 0 0 18px -6px rgba(225,6,0,0.4);
        }

        /* Slide-in animation */
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* skew fix for inner content */
        .skew-fix {
          display: inline-block;
          transform: skewX(12deg);
        }
      `}</style>
    </>
  );
}
