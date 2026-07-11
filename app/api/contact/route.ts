import { NextRequest, NextResponse } from "next/server";
import { addMessage } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, contact, message } = await req.json();

  if (!name || !contact || !message) {
    return NextResponse.json({ error: "Fill in all fields." }, { status: 400 });
  }

  try {
    await addMessage({ name, contact, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
