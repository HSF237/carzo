"use client";

import { useEffect, useState } from "react";

const COLORS = ["#e10600", "#ff2d20", "#ffffff", "#9b9ba3"];

export default function SuccessCelebration() {
  const [active, setActive] = useState(true);
  const [pieces] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.8 + Math.random() * 1.2,
      rotate: Math.random() * 360,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 6,
    }))
  );

  useEffect(() => {
    const t = setTimeout(() => setActive(false), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size * 0.4,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
      <div className="car-drive-off">🏎️</div>
    </div>
  );
}
