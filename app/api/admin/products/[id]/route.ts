import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteProduct, updateProduct } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const b = await req.json();
  const updated = updateProduct(id, {
    name: b.name,
    slug: b.slug || undefined,
    category: b.category === "rc" ? "rc" : "diecast",
    price: Number(b.price),
    mrp: Number(b.mrp || b.price),
    image: b.image,
    description: b.description,
    scale: b.scale || undefined,
    brandLine: b.brandLine || undefined,
    stock: Number(b.stock),
    featured: Boolean(b.featured),
  });

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const ok = deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
