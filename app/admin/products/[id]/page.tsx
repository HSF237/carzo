import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <AdminShell>
      <h1 className="display text-3xl text-white">Edit product</h1>
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </AdminShell>
  );
}
