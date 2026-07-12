import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getOrders } from "@/lib/db";
import { inr } from "@/lib/format";
import AdminShell from "@/components/AdminShell";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  if (!(await isAdmin())) redirect("/admin/login");
  const orders = await getOrders();

  return (
    <AdminShell>
      <h1 className="display text-3xl text-white">Orders</h1>
      <p className="mt-1 text-sm text-muted">
        {orders.length} total orders
      </p>

      <div className="mt-6 space-y-4">
        {orders.length === 0 && (
          <div className="rounded-xl border border-line bg-card p-12 text-center text-muted">
            No orders yet.
          </div>
        )}
        {orders.map((o) => (
          <details key={o.id} className="rounded-xl border border-line bg-card">
            <summary className="flex cursor-pointer flex-wrap items-center gap-4 p-4">
              <span className="font-mono font-bold text-white">{o.id}</span>
              <span className="text-white">{o.customer.name}</span>
              <span className="text-sm text-muted">{o.customer.phone}</span>
              <span className="text-sm text-muted">
                {new Date(o.createdAt).toLocaleString("en-IN")}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  o.paymentMethod === "online" ? "bg-emerald-600/20 text-emerald-400" : "bg-line text-muted"
                }`}
              >
                {o.paymentMethod === "online" ? "UPI" : "COD"}
              </span>
              <span className="ml-auto font-bold text-white">{inr(o.total)}</span>
              <OrderStatusSelect id={o.id} status={o.status} />
            </summary>
            <div className="grid gap-6 border-t border-line p-4 md:grid-cols-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-red-hot">
                  Items
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {o.items.map((it, i) => (
                    <li key={i} className="flex justify-between">
                      <span>
                        {it.name} × {it.qty}
                      </span>
                      <span className="text-white">{inr(it.price * it.qty)}</span>
                    </li>
                  ))}
                </ul>
                {o.paymentMethod === "online" && (
                  <p className="mt-3 text-xs text-muted">
                    UPI Reference (UTR):{" "}
                    <span className="font-mono text-white">{o.paymentId || "—"}</span>
                    <br />
                    Verify this against your UPI app/bank statement before confirming.
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-red-hot">
                  Deliver to
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {o.customer.name}
                  <br />
                  {o.customer.address}
                  <br />
                  {o.customer.city}, {o.customer.state} — {o.customer.pincode}
                  <br />
                  📞 {o.customer.phone}
                  {o.customer.email ? <> · ✉️ {o.customer.email}</> : null}
                </p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </AdminShell>
  );
}
