import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { addProduct, getProducts } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  if (!b?.name || !b?.image || !b?.description || !b?.price || b?.stock == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let slug: string =
    b.slug ||
    String(b.name)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // ensure unique slug
  const existing = new Set((await getProducts()).map((p) => p.slug));
  if (existing.has(slug)) slug = `${slug}-${Date.now().toString(36)}`;

  const product = await addProduct({
    name: b.name,
    slug,
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

  return NextResponse.json(product, { status: 201 });
}
