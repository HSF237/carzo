import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snap = await adminDb.collection("products").limit(1).get();
    return NextResponse.json({
      ok: true,
      empty: snap.empty,
      count: snap.size,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "(fallback carzo-fa9f9)",
      clientEmailSet: !!process.env.FIREBASE_CLIENT_EMAIL,
      privateKeySet: !!process.env.FIREBASE_PRIVATE_KEY,
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err.message,
      code: err.code,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "(fallback carzo-fa9f9)",
      clientEmailSet: !!process.env.FIREBASE_CLIENT_EMAIL,
      privateKeySet: !!process.env.FIREBASE_PRIVATE_KEY,
    }, { status: 500 });
  }
}
