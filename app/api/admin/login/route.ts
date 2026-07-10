import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_COOKIE, sign } from "@/lib/auth";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (getApps().length === 0) {
  try {
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (initErr) {
    console.error("Failed to initialize Firebase Admin SDK:", initErr);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken, email, password } = body ?? {};

    // 1. Firebase Auth Token Verification
    if (idToken) {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const userEmail = decodedToken.email;

      // Allow config-defined email, as well as developer/support email
      const allowedEmails = [
        ADMIN_EMAIL.toLowerCase(),
        "hsfwebdevelopers@gmail.com",
        "admin@carzo.in",
      ];

      if (userEmail && allowedEmails.includes(userEmail.toLowerCase())) {
        const res = NextResponse.json({ ok: true });
        res.cookies.set(SESSION_COOKIE, sign(`admin:${userEmail}:${Date.now()}`), {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return res;
      }
      return NextResponse.json({ error: "Unauthorized email address" }, { status: 403 });
    }

    // 2. Standard email/password fallback
    if (email && password) {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const res = NextResponse.json({ ok: true });
        res.cookies.set(SESSION_COOKIE, sign(`admin:${email}:${Date.now()}`), {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return res;
      }
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  } catch (err: any) {
    console.error("POST /api/admin/login error:", err);
    return NextResponse.json({ error: "Authentication failed: " + err.message }, { status: 500 });
  }
}
