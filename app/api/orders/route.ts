import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { addOrder } from "@/lib/db";
import { sendOrderNotificationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, total, paymentMethod, paymentId, razorpayOrderId, razorpaySignature } = body ?? {};

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

    if (method === "online") {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret || !paymentId || !razorpayOrderId || !razorpaySignature) {
        return NextResponse.json({ error: "Missing payment verification data" }, { status: 400 });
      }
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${paymentId}`)
        .digest("hex");
      if (expectedSignature !== razorpaySignature) {
        return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
      }
    }

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
