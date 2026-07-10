import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/db";
import { inr } from "@/lib/format";
import AdminShell from "@/components/AdminShell";
import DeleteProductButton from "@/components/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  if (!(await isAdmin())) redirect("/admin/login");
  const products = getProducts();

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="display text-3xl text-white">Products</h1>
        <Link
          href="/admin/products/new"
          className="btn-red rounded-md px-5 py-2.5 font-bold text-white"
        >
          + Add product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-soft text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt=""
                      className="h-10 w-14 rounded object-cover"
                    />
                    <span className="font-semibold text-white">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {p.category === "rc" ? "RC Car" : "Scale Model"}
                </td>
                <td className="px-4 py-3 text-white">{inr(p.price)}</td>
                <td className={`px-4 py-3 ${p.stock <= 5 ? "text-amber-400" : "text-muted"}`}>
                  {p.stock}
                </td>
                <td className="px-4 py-3">{p.featured ? "⭐" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-xs text-white hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
