"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { normalizeImageUrl } from "@/lib/image";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(product?.image ?? "");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      slug: String(fd.get("slug") || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      category: fd.get("category"),
      price: Number(fd.get("price")),
      mrp: Number(fd.get("mrp") || fd.get("price")),
      image: fd.get("image"),
      description: fd.get("description"),
      scale: fd.get("scale") || undefined,
      brandLine: fd.get("brandLine") || undefined,
      stock: Number(fd.get("stock")),
      featured: fd.get("featured") === "on",
    };

    const res = await fetch(
      product ? `/api/admin/products/${product.id}` : "/api/admin/products",
      {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to save product.");
      setBusy(false);
    }
  }

  const input =
    "mt-1 w-full rounded-md border border-line bg-bg-soft px-3 py-2 text-white focus:border-red-brand focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm text-muted">Product name *</label>
          <input name="name" required defaultValue={product?.name} className={input} />
        </div>
        <div>
          <label className="text-sm text-muted">Slug (URL, optional)</label>
          <input
            name="slug"
            defaultValue={product?.slug}
            placeholder="auto-generated from name if empty"
            className={input}
          />
        </div>
        <div>
          <label className="text-sm text-muted">Category *</label>
          <select
            name="category"
            required
            defaultValue={product?.category ?? "diecast"}
            className={input}
          >
            <option value="diecast">Scale Model (Diecast)</option>
            <option value="rc">RC Car</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted">Selling price (₹) *</label>
          <input name="price" type="number" min={1} required defaultValue={product?.price} className={input} />
        </div>
        <div>
          <label className="text-sm text-muted">MRP (₹, for discount display)</label>
          <input name="mrp" type="number" min={0} defaultValue={product?.mrp} className={input} />
        </div>
        <div>
          <label className="text-sm text-muted">Stock *</label>
          <input name="stock" type="number" min={0} required defaultValue={product?.stock ?? 10} className={input} />
        </div>
        <div>
          <label className="text-sm text-muted">Scale (e.g. 1:64)</label>
          <input name="scale" defaultValue={product?.scale} className={input} />
        </div>
        <div>
          <label className="text-sm text-muted">Series / line (e.g. Speed Series)</label>
          <input name="brandLine" defaultValue={product?.brandLine} className={input} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-muted">Image URL *</label>
          <input
            name="image"
            required
            defaultValue={product?.image}
            placeholder="https://... paste a direct image link or Google Drive share link"
            className={input}
            onChange={(e) => setPreview(normalizeImageUrl(e.target.value))}
          />
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              className="mt-3 h-40 rounded-md border border-line object-cover"
            />
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm text-muted">Description *</label>
          <textarea name="description" required rows={4} defaultValue={product?.description} className={input} />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured}
            className="accent-red-600"
          />
          Show in &quot;Hot right now&quot; on homepage
        </label>
      </div>

      {error && <p className="text-sm text-red-hot">{error}</p>}

      <div className="flex gap-3">
        <button
          disabled={busy}
          className="btn-red rounded-md px-8 py-3 font-bold text-white disabled:opacity-60"
        >
          {busy ? "Saving..." : product ? "Save changes" : "Add product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-md border border-line px-6 py-3 text-muted hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
