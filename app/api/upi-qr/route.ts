import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const amount = Number(req.nextUrl.searchParams.get("amount"));
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const upiId = process.env.UPI_ID;
  if (!upiId) {
    return NextResponse.json({ error: "UPI is not configured on this server." }, { status: 500 });
  }
  const payeeName = process.env.UPI_PAYEE_NAME || "Carzo";

  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Carzo order")}`;

  const dataUrl = await QRCode.toDataURL(upiLink, { width: 320, margin: 1 });
  return NextResponse.json({ dataUrl });
}
