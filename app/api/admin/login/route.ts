import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_COOKIE, sign } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken, email, password } = body ?? {};

    // 1. Google ID Token Verification via tokeninfo endpoint (no Admin SDK needed)
    if (idToken) {
      const tokenInfoRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
      );

      if (!tokenInfoRes.ok) {
        return NextResponse.json({ error: "Invalid Google token" }, { status: 401 });
      }

      const tokenInfo = await tokenInfoRes.json();
      const userEmail = tokenInfo.email as string | undefined;

      if (!userEmail || !tokenInfo.email_verified) {
        return NextResponse.json({ error: "Google email not verified" }, { status: 401 });
      }

      // Allow config-defined email, as well as developer/support emails
      const allowedEmails = [
        ADMIN_EMAIL.toLowerCase(),
        "hsfwebdevelopers@gmail.com",
        "admin@carzo.in",
        "akpalameen8@gmail.com",
        "zerox9861@gmail.com",
      ];

      if (allowedEmails.includes(userEmail.toLowerCase())) {
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

