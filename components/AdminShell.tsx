"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-line bg-bg-soft p-4">
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
      </aside>
      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}
