"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SHOWN_FLAG = "carzo_splash_shown";

export default function SplashScreen() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  // Decide synchronously before paint: only on the homepage, only once per tab session
  useLayoutEffect(() => {
    if (pathname !== "/") return;
    if (sessionStorage.getItem(SHOWN_FLAG)) return;
    sessionStorage.setItem(SHOWN_FLAG, "1");
    setShow(true);
  }, [pathname]);

  useEffect(() => {
    if (!show) return;
    // Single timer — just remove from DOM after animation completes
    const t = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="splash-root">
      {/* Speedlines */}
      <div className="splash-lines" />

      {/* F1 start lights */}
      <div className="splash-lights">
        <span className="splash-light sl-1" />
        <span className="splash-light sl-2" />
        <span className="splash-light sl-3" />
      </div>

      {/* Words — entirely CSS-driven */}
      <div className="splash-word-wrap">
        <span className="splash-word sw-get">GET</span>
        <span className="splash-word sw-set">SET</span>
        <span className="splash-word sw-carzo">CARZO!</span>
      </div>

      {/* Rev bar */}
      <div className="splash-revbar" />

      <style>{`
        .splash-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #0a0a0b;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          overflow: hidden;
          animation: splashFadeOut 0.6s ease 3.3s forwards;
        }

        /* ── Speedlines ── */
        .splash-lines {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            100deg,
            transparent 0 60px,
            rgba(225,6,0,0.07) 60px 62px,
            transparent 62px 110px,
            rgba(255,255,255,0.03) 110px 112px
          );
          animation: speedScroll 0.5s linear infinite;
        }

        /* ── Lights ── */
        .splash-lights {
          display: flex; gap: 18px; margin-bottom: 48px;
          position: relative; z-index: 1;
        }
        .splash-light {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid #333; background: #1a1a1a;
        }
        .sl-3 { width: 26px; height: 26px; }

        /* Light 1 turns red at 0.8s */
        .sl-1 { animation: lightRed 0.2s ease 0.8s forwards; }
        /* Light 2 turns red at 1.1s */
        .sl-2 { animation: lightRed 0.2s ease 1.1s forwards; }
        /* Light 3 turns green at 1.9s */
        .sl-3 { animation: lightGreen 0.2s ease 1.9s forwards; }

        /* ── Word container ── */
        .splash-word-wrap {
          position: relative; z-index: 1;
          height: 120px; width: 100%;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Base word ── */
        .splash-word {
          position: absolute;
          font-family: var(--font-orbitron), "Arial Black", sans-serif;
          font-weight: 900; font-style: italic;
          text-transform: uppercase; letter-spacing: -0.02em;
          opacity: 0; white-space: nowrap; user-select: none;
        }

        /* GET: appears 0.1s, exits 0.9s */
        .sw-get {
          font-size: clamp(56px, 14vw, 100px);
          color: #f4f4f5;
          animation:
            wordIn  0.4s cubic-bezier(.2,1.4,.4,1)  0.1s forwards,
            wordOut 0.25s ease-in                    0.9s forwards;
        }

        /* SET: appears 1.1s, exits 1.8s */
        .sw-set {
          font-size: clamp(56px, 14vw, 100px);
          color: #f4f4f5;
          -webkit-text-stroke: 2px rgba(225,6,0,0.4);
          animation:
            wordIn  0.4s cubic-bezier(.2,1.4,.4,1)  1.1s forwards,
            wordOut 0.25s ease-in                    1.8s forwards;
        }

        /* CARZO: appears 2.0s, stays */
        .sw-carzo {
          font-size: clamp(60px, 15vw, 110px);
          background: linear-gradient(135deg, #ff2d20, #e10600 50%, #ff6b00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 40px rgba(225,6,0,0.8));
          animation: carzoIn 0.55s cubic-bezier(.15,1.5,.4,1) 2.0s forwards;
        }

        /* ── Rev bar: fills at 2.0s ── */
        .splash-revbar {
          position: absolute; bottom: 0; left: 0;
          height: 4px; width: 0%;
          background: linear-gradient(90deg, #e10600, #ff2d20, #ff6b00);
          box-shadow: 0 0 24px 6px rgba(225,6,0,0.6);
          animation: revFill 0.9s cubic-bezier(.4,0,.2,1) 2.0s forwards;
        }

        /* ════════ KEYFRAMES ════════ */

        @keyframes speedScroll {
          from { background-position-x: 0; }
          to   { background-position-x: 112px; }
        }

        @keyframes lightRed {
          to {
            background: #e10600; border-color: #ff2d20;
            box-shadow: 0 0 18px 4px rgba(225,6,0,0.75);
          }
        }
        @keyframes lightGreen {
          to {
            background: #00e676; border-color: #69f0ae;
            box-shadow: 0 0 30px 8px rgba(0,230,118,0.8);
          }
        }

        @keyframes wordIn {
          from { opacity: 0; transform: translateY(50px) scale(0.7); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        @keyframes wordOut {
          from { opacity: 1; transform: translateY(0)     scale(1);   }
          to   { opacity: 0; transform: translateY(-40px) scale(0.85); }
        }
        @keyframes carzoIn {
          0%   { opacity: 0; transform: translateX(-80px) scale(0.6) skewX(-18deg); }
          50%  { opacity: 1; transform: translateX(8px)   scale(1.08) skewX(-5deg);  }
          100% { opacity: 1; transform: translateX(0)     scale(1)    skewX(0deg);   }
        }

        @keyframes revFill {
          from { width: 0%; }
          to   { width: 100%; }
        }

        @keyframes splashFadeOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.08); pointer-events: none; }
        }
      `}</style>
    </div>
  );
}
