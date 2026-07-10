"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleGoogleSignIn() {
    setBusy(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "This email is not authorized as an administrator.");
        setBusy(false);
      }
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setError(err.message || "Google Sign-In was cancelled or failed.");
      setBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      let idToken = "";
      try {
        // Try Firebase Auth email/pass first
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        idToken = await userCredential.user.getIdToken();
      } catch (fbErr) {
        console.log("Firebase Auth credentials check bypassed, trying backend local fallback...");
      }

      // Send to server (server will verify token, or fallback to simple credentials check)
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: idToken || undefined,
          email,
          password,
        }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Invalid email or password.");
        setBusy(false);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 bg-bg">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-card p-8 shadow-2xl relative overflow-hidden">
        {/* Top visual glow detail */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-brand to-red-hot" />

        <div className="text-center">
          <Logo size="text-3xl" />
          <p className="mt-2 text-sm text-muted">Admin Control Room</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-bg-soft px-3 py-2 text-white focus:border-red-brand focus:outline-none transition"
              placeholder="admin@carzo.in"
            />
          </div>
          <div>
            <label className="text-sm text-muted">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-bg-soft px-3 py-2 text-white focus:border-red-brand focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-hot leading-snug">{error}</p>}

          <button
            disabled={busy}
            className="btn-red w-full rounded-md px-6 py-3 font-bold text-white disabled:opacity-60 transition"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute w-full border-t border-line" />
          <span className="relative bg-card px-3 text-xs text-muted uppercase tracking-wider font-bold">OR</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={busy}
          className="w-full flex items-center justify-center gap-3 rounded-md border border-line bg-bg-soft px-6 py-2.5 font-bold text-white transition hover:bg-card hover:border-red-brand disabled:opacity-60"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.86-4.53-6.16-4.53z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </main>
  );
}
