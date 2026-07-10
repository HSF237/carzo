import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getOrders, getProducts } from "@/lib/db";
import { inr } from "@/lib/format";
import AdminShell from "@/components/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/login");

  const products = getProducts();
  const orders = getOrders();
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((a, o) => a + o.total, 0);
  const newOrders = orders.filter((o) => o.status === "new").length;
  const lowStock = products.filter((p) => p.stock <= 5).length;

  const card = (label: string, value: string, href: string) => (
    <Link
      href={href}
      className="rounded-xl border border-line bg-card p-6 transition hover:border-red-brand"
    >
      <p className="text-sm text-muted">{label}</p>
      <p className="display mt-2 text-3xl text-white">{value}</p>
    </Link>
  );

  return (
    <AdminShell>
      <h1 className="display text-3xl text-white">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {card("Total revenue", inr(revenue), "/admin/orders")}
        {card("New orders", String(newOrders), "/admin/orders")}
        {card("Products", String(products.length), "/admin/products")}
        {card("Low stock (≤5)", String(lowStock), "/admin/products")}
      </div>

      <h2 className="display mt-10 text-xl text-white">Latest orders</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-soft text-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-4 py-3 font-mono text-white">{o.id}</td>
                <td className="px-4 py-3 text-white">{o.customer.name}</td>
                <td className="px-4 py-3 text-white">{inr(o.total)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-red-brand/20 px-2 py-0.5 text-xs font-bold uppercase text-red-hot">
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(o.createdAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No orders yet. They&apos;ll appear here as customers check out.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
