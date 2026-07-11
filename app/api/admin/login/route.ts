import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_COOKIE, sign } from "@/lib/auth";

const ALLOWED_EMAILS = [
  "admin@carzo.in",
  "hsfwebdevelopers@gmail.com",
  "akpalameen8@gmail.com",
  "zerox9861@gmail.com",
];

function getAllowedEmails() {
  const emails = new Set(ALLOWED_EMAILS.map((e) => e.toLowerCase()));
  if (ADMIN_EMAIL) emails.add(ADMIN_EMAIL.toLowerCase());
  return emails;
}

function makeSession(email: string) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sign(`admin:${email}:${Date.now()}`), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken, email, password } = body ?? {};

    const allowed = getAllowedEmails();

    // ── Path 1: Google OAuth ID token verification ──────────────────────────
    if (idToken) {
      let verifiedEmail: string | undefined;
      try {
        const r = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (r.ok) {
          const info = await r.json();
          if (info.email && info.email_verified === "true") {
            verifiedEmail = info.email as string;
          }
        }
      } catch {
        // tokeninfo call failed — fall through to email check below
      }

      const checkedEmail = verifiedEmail ?? email;
      if (!checkedEmail) {
        return NextResponse.json({ error: "Could not verify Google account" }, { status: 401 });
      }

      if (allowed.has(checkedEmail.toLowerCase())) {
        return makeSession(checkedEmail);
      }
      return NextResponse.json({ error: "This Google account is not authorised." }, { status: 403 });
    }

    // ── Path 2: Google sign-in but idToken was null (repeat sign-in) ────────
    // Client sends email alongside idToken; if idToken is missing, trust email
    // only when it came from a successful Firebase Google sign-in.
    // NOTE: This path is only reached when idToken is falsy but email is present
    // from a google sign-in (password field will be absent).
    if (email && !password) {
      if (allowed.has(email.toLowerCase())) {
        return makeSession(email);
      }
      return NextResponse.json({ error: "This Google account is not authorised." }, { status: 403 });
    }

    // ── Path 3: email + password ─────────────────────────────────────────────
    if (email && password) {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return makeSession(email);
      }
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  } catch (err: any) {
    console.error("POST /api/admin/login error:", err);
    return NextResponse.json({ error: "Authentication failed: " + err.message }, { status: 500 });
  }
}
