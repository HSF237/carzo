import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <AdminShell>
      <h1 className="display text-3xl text-white">Add product</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </AdminShell>
  );
}
