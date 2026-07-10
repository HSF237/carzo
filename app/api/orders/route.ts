import { NextRequest, NextResponse } from "next/server";
import { addOrder } from "@/lib/db";
import { sendOrderNotificationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, total, paymentMethod, paymentId } = body ?? {};

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

    const method = paymentMethod === "online" ? "online" : "cod";

    const order = await addOrder({
      customer,
      items,
      total,
      paymentMethod: method,
      paymentId: paymentId || undefined,
    });

    try {
      await sendOrderNotificationEmail(order);
    } catch (mailErr) {
      console.error("Failed to send order notification email:", mailErr);
    }

    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
