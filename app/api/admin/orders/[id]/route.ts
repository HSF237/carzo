import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/db";
import { Order } from "@/lib/types";

const VALID: Order["status"][] = [
  "new",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();
  if (!VALID.includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const updated = updateOrderStatus(id, status);
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
