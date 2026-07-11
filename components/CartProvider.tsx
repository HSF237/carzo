"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface FlyItem {
  id: number;
  src: string;
  from: { left: number; top: number; width: number; height: number };
  to: { left: number; top: number; width: number; height: number };
}

interface CartCtx {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
  total: number;
  cartIconRef: React.RefObject<HTMLAnchorElement | null>;
  flyToCart: (imageSrc: string, fromEl: HTMLElement) => void;
}

const Ctx = createContext<CartCtx | null>(null);

const KEY = "carzo_cart_v1";
let flyIdCounter = 0;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const cartIconRef = useRef<HTMLAnchorElement>(null);
  const [flyItems, setFlyItems] = useState<FlyItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const api = useMemo<CartCtx>(() => {
    const add: CartCtx["add"] = (line, qty = 1) =>
      setLines((prev) => {
        const i = prev.findIndex((l) => l.productId === line.productId);
        if (i >= 0) {
          const next = [...prev];
          next[i] = { ...next[i], qty: next[i].qty + qty };
          return next;
        }
        return [...prev, { ...line, qty }];
      });

    const setQty: CartCtx["setQty"] = (productId, qty) =>
      setLines((prev) =>
        qty <= 0
          ? prev.filter((l) => l.productId !== productId)
          : prev.map((l) => (l.productId === productId ? { ...l, qty } : l))
      );

    const remove: CartCtx["remove"] = (productId) =>
      setLines((prev) => prev.filter((l) => l.productId !== productId));

    const clear = () => setLines([]);

    const count = lines.reduce((a, l) => a + l.qty, 0);
    const total = lines.reduce((a, l) => a + l.qty * l.price, 0);

    const flyToCart: CartCtx["flyToCart"] = (imageSrc, fromEl) => {
      const target = cartIconRef.current;
      if (!target) return;
      const from = fromEl.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const id = ++flyIdCounter;
      setFlyItems((prev) => [
        ...prev,
        {
          id,
          src: imageSrc,
          from: { left: from.left, top: from.top, width: from.width, height: from.height },
          to: { left: to.left, top: to.top, width: to.width, height: to.height },
        },
      ]);
      setTimeout(() => {
        setFlyItems((prev) => prev.filter((f) => f.id !== id));
      }, 650);
    };

    return { lines, add, setQty, remove, clear, count, total, cartIconRef, flyToCart };
  }, [lines]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden="true">
        {flyItems.map((item) => (
          <img
            key={item.id}
            src={item.src}
            alt=""
            className="fly-to-cart"
            style={
              {
                position: "fixed",
                left: item.from.left,
                top: item.from.top,
                width: item.from.width,
                height: item.from.height,
                "--fly-tx": `${item.to.left + item.to.width / 2 - (item.from.left + item.from.width / 2)}px`,
                "--fly-ty": `${item.to.top + item.to.height / 2 - (item.from.top + item.from.height / 2)}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
