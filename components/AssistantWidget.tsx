"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Node {
  label: string;
  reply: string;
  cta?: { href: string; label: string };
  next?: string[];
}

const ROOT = ["shop-diecast", "shop-rc", "shop-frames", "order-status", "payment-cod", "shipping", "warranty", "human"];

const NODES: Record<string, Node> = {
  "shop-diecast": {
    label: "🏎️ Shop Scale Models",
    reply: "We've got 1:64 and 1:43 die-cast legends starting at just ₹85! Tap below to browse.",
    cta: { href: "/shop?cat=diecast", label: "Browse Scale Models →" },
    next: ["shop-rc", "shop-frames", "human"],
  },
  "shop-rc": {
    label: "🎮 Shop RC Cars",
    reply: "Our RC beasts hit up to 35 km/h with rechargeable batteries. Ready to race?",
    cta: { href: "/shop?cat=rc", label: "Browse RC Cars →" },
    next: ["shop-diecast", "warranty", "human"],
  },
  "shop-frames": {
    label: "🖼️ Shop 3D Car Frames",
    reply: "Hand-crafted 3D car frames make a great display piece — your favorite ride, framed and ready to hang!",
    cta: { href: "/shop?cat=frames", label: "Browse 3D Frames →" },
    next: ["shop-diecast", "shop-rc", "human"],
  },
  "order-status": {
    label: "📦 Where's my order?",
    reply:
      "We'll call you to confirm before shipping, and orders go out within 24–48 hours! If it's been longer than that, our crew can check on it for you.",
    cta: { href: "/contact", label: "Contact Us →" },
    next: ["payment-cod", "shipping", "human"],
  },
  "payment-cod": {
    label: "💵 Payment & COD",
    reply:
      "Cash on Delivery is available everywhere in India — just pay when your box arrives! Or scan the UPI QR at checkout to pay upfront with any UPI app.",
    next: ["shipping", "order-status", "human"],
  },
  shipping: {
    label: "🚚 Shipping info",
    reply: "Free shipping on orders over ₹999, otherwise it's a flat ₹79. We ship across India in 24–48 hours!",
    next: ["payment-cod", "warranty", "human"],
  },
  warranty: {
    label: "🛠️ Warranty & returns",
    reply: "All RC cars come with a 7-day replacement warranty — no questions asked if something's off out of the box.",
    next: ["shipping", "human"],
  },
  human: {
    label: "💬 Talk to a human",
    reply: "Our crew's ready to help! Tap below and we'll sort you out.",
    cta: { href: "/contact", label: "Contact Carzo →" },
    next: ["shop-diecast", "shop-rc", "shop-frames"],
  },
};

interface Msg {
  from: "user" | "bot";
  text: string;
  cta?: { href: string; label: string };
}

export default function AssistantWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [options, setOptions] = useState<string[]>(ROOT);

  useEffect(() => {
    const t = setTimeout(() => setTeaser(true), 2200);
    return () => clearTimeout(t);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  function select(id: string) {
    if (id === "menu") {
      setMessages((prev) => [...prev, { from: "bot", text: "Sure — what else can I help with?" }]);
      setOptions(ROOT);
      return;
    }
    const node = NODES[id];
    if (!node) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: node.label },
      { from: "bot", text: node.reply, cta: node.cta },
    ]);
    setOptions(node.next ?? ROOT);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[150] flex flex-col items-end">
      {open && (
        <div className="mb-3 flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-line bg-bg-soft px-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mascot.png" alt="Turbo" className="h-10 w-10 object-contain" />
            <div className="min-w-0 flex-1">
              <p className="display text-sm text-white">TURBO</p>
              <p className="text-[11px] text-muted">Carzo's pit-crew assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="rounded-full p-1 text-muted hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {/* Greeting — mascot speaking */}
            <div className="flex items-end gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/mascot.png" alt="" className="h-14 w-14 shrink-0 object-contain" />
              <div className="speech-bubble rounded-2xl rounded-bl-sm bg-bg-soft px-3 py-2 text-sm text-white">
                🏁 Hey there! I&apos;m Turbo. How can I help you today?
              </div>
            </div>

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "user"
                      ? "rounded-br-sm bg-red-brand text-white"
                      : "rounded-bl-sm bg-bg-soft text-white"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.cta && (
                    <Link
                      href={m.cta.href}
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-block rounded-sm bg-red-brand px-3 py-1.5 text-xs font-bold text-white hover:brightness-110"
                    >
                      {m.cta.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Options — tap only, no typing */}
          <div className="flex flex-wrap gap-2 border-t border-line bg-bg-soft p-3">
            {options.map((id) => (
              <button
                key={id}
                onClick={() => select(id)}
                className="rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold text-white transition hover:border-red-brand hover:bg-red-brand"
              >
                {NODES[id]?.label}
              </button>
            ))}
            {messages.length > 0 && (
              <button
                onClick={() => select("menu")}
                className="rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-red-brand hover:text-white"
              >
                ⬅ Back to menu
              </button>
            )}
          </div>
        </div>
      )}

      {/* Teaser bubble */}
      {teaser && !open && (
        <button
          onClick={() => {
            setOpen(true);
            setTeaser(false);
          }}
          className="teaser-pop mb-2 mr-1 max-w-[200px] rounded-2xl rounded-br-sm border border-line bg-card px-3 py-2 text-left text-xs font-semibold text-white shadow-lg"
        >
          Hey! I&apos;m Turbo, your Carzo assistant 🏁 Need help?
        </button>
      )}

      {/* FAB */}
      <button
        onClick={() => {
          setOpen((o) => !o);
          setTeaser(false);
        }}
        aria-label="Open assistant"
        className="mascot-fab grid h-16 w-16 place-items-center rounded-full border-2 border-red-brand bg-card shadow-xl"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mascot.png" alt="Assistant" className="h-14 w-14 object-contain" />
      </button>

      <style>{`
        @keyframes mascot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .mascot-fab {
          animation: mascot-bounce 2.4s ease-in-out infinite;
        }
        @keyframes teaser-pop-in {
          from { opacity: 0; transform: translateY(8px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .teaser-pop {
          animation: teaser-pop-in 0.3s ease forwards;
        }
        .speech-bubble {
          position: relative;
        }
      `}</style>
    </div>
  );
}
