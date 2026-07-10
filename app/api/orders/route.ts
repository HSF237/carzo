import { NextRequest, NextResponse } from "next/server";
import { addOrder } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, total } = body ?? {};

    if (
      !customer?.name ||
      !customer?.phone ||
      !customer?.address ||
      !customer?.city ||
      !customer?.state ||
      !customer?.pincode ||
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof total !== "number"
    ) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    const order = addOrder({
      customer,
      items,
      total,
      paymentMethod: "cod",
    });

    // TODO: send notification (email/WhatsApp) to store owner here.

    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
