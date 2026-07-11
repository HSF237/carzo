"use client";

import { useState } from "react";

export default function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus("idle");
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          contact: fd.get("contact"),
          message: fd.get("message"),
        }),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }

  const input =
    "mt-1 w-full rounded-md border border-line bg-bg-soft px-3 py-2 text-white focus:border-red-brand focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-line bg-card p-6">
      <div>
        <label className="text-sm text-muted">Your name</label>
        <input name="name" required className={input} />
      </div>
      <div>
        <label className="text-sm text-muted">Phone or email</label>
        <input name="contact" required className={input} />
      </div>
      <div>
        <label className="text-sm text-muted">Message</label>
        <textarea name="message" rows={4} required className={input} />
      </div>

      {status === "sent" && (
        <p className="text-sm text-emerald-400">✓ Message sent! We&apos;ll get back to you soon.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-hot">Something went wrong. Please try again or reach us directly.</p>
      )}

      <button
        disabled={busy}
        className="skew-chip btn-red w-full rounded-sm px-6 py-3 font-bold text-white disabled:opacity-60"
      >
        <span>{busy ? "Sending..." : "Send Message 🏁"}</span>
      </button>
    </form>
  );
}
