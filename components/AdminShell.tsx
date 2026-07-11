"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const item = (href: string, label: string) => (
    <Link
      href={href}
      className={`block rounded-md px-4 py-2 text-sm font-semibold transition ${
        pathname === href
          ? "bg-red-brand text-white"
          : "text-muted hover:bg-card hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebarContent = (
    <>
      <Logo />
      <p className="mt-1 text-xs text-muted">Admin Panel</p>
      <nav className="mt-8 space-y-1">
        {item("/admin", "📊 Dashboard")}
        {item("/admin/products", "🏎️ Products")}
        {item("/admin/orders", "📦 Orders")}
      </nav>
      <div className="mt-auto space-y-2">
        <Link href="/" className="block text-xs text-muted hover:text-white">
          ← View store
        </Link>
        <button
          onClick={logout}
          className="w-full rounded-md border border-line px-4 py-2 text-sm text-muted hover:border-red-brand hover:text-white"
        >
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen md:flex">
      {/* Mobile top bar — hidden on desktop */}
      <div className="flex items-center justify-between border-b border-line bg-bg-soft px-4 py-3 md:hidden">
        <Logo size="text-xl" />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-md border border-line p-2 text-white"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar: static column on desktop, slide-in drawer on mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-line bg-bg-soft p-4 transition-transform duration-200 md:static md:z-auto md:w-56 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="mb-2 self-end rounded-md p-1 text-muted hover:text-white md:hidden"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
        {sidebarContent}
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
