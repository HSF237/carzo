"use client";

import { useEffect, useRef, useState } from "react";

const PHASES = ["get", "set", "carzo", "exit", "done"] as const;
type Phase = (typeof PHASES)[number];

const DELAYS: Record<Phase, number> = {
  get:   900,
  set:   800,
  carzo: 1200,
  exit:  700,
  done:  0,
};

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("get");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Skip if already seen this session
    try {
      if (sessionStorage.getItem("carzo_splash_seen")) {
        setPhase("done");
        return;
      }
    } catch { /* SSR or private browsing */ }

    mountedRef.current = true;

    function advance(current: Phase) {
      const idx = PHASES.indexOf(current);
      const next = PHASES[idx + 1];
      if (!next || !mountedRef.current) return;

      timerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(next);
        if (next === "done") {
          try { sessionStorage.setItem("carzo_splash_seen", "1"); } catch {}
        } else {
          advance(next);
        }
      }, DELAYS[current]);
    }

    advance("get");

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`splash-root ${phase === "exit" ? "splash-exit" : ""}`}>
      {/* Animated speedlines layer */}
      <div className="splash-lines" />

      {/* Countdown lights row */}
      <div className="splash-lights">
        <span className={`splash-light ${phase !== "get" ? "light-on" : ""}`} />
        <span
          className={`splash-light ${
            phase === "set" || phase === "carzo" || phase === "exit"
              ? "light-on"
              : ""
          }`}
        />
        <span
          className={`splash-light light-green ${
            phase === "carzo" || phase === "exit" ? "light-on-go" : ""
          }`}
        />
      </div>

      {/* Main word display */}
      <div className="splash-word-wrap">
        {/* GET */}
        <span
          key="get"
          className={`splash-word splash-get ${
            phase === "get"
              ? "word-show"
              : "word-gone"
          }`}
        >
          GET
        </span>

        {/* SET */}
        <span
          key="set"
          className={`splash-word splash-set ${
            phase === "set"
              ? "word-show"
              : phase === "carzo" || phase === "exit"
              ? "word-gone"
              : ""
          }`}
        >
          SET
        </span>

        {/* CARZO */}
        <span
          key="carzo"
          className={`splash-word splash-carzo ${
            phase === "carzo" || phase === "exit" ? "word-show-carzo" : ""
          }`}
        >
          CARZO<span className="splash-exclaim">!</span>
        </span>
      </div>

      {/* Red rev-up bar at bottom */}
      <div
        className={`splash-revbar ${
          phase === "carzo" || phase === "exit" ? "revbar-go" : ""
        }`}
      />

      <style>{`
        /* ── Root overlay ── */
        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #0a0a0b;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: opacity 0.55s ease, transform 0.55s cubic-bezier(.4,0,.2,1);
        }
        .splash-exit {
          opacity: 0;
          transform: scale(1.06);
          pointer-events: none;
        }

        /* ── Speedlines ── */
        .splash-lines {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            100deg,
            transparent 0 60px,
            rgba(225,6,0,0.07) 60px 62px,
            transparent 62px 110px,
            rgba(255,255,255,0.03) 110px 112px
          );
          animation: speedScroll 0.6s linear infinite;
        }
        @keyframes speedScroll {
          from { background-position-x: 0; }
          to   { background-position-x: 112px; }
        }

        /* ── Countdown lights ── */
        .splash-lights {
          display: flex;
          gap: 18px;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
        }
        .splash-light {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #333;
          background: #1a1a1a;
          transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .light-on {
          background: #e10600;
          border-color: #ff2d20;
          box-shadow: 0 0 18px 4px rgba(225,6,0,0.75);
        }
        .light-green {
          width: 26px;
          height: 26px;
        }
        .light-on-go {
          background: #00e676;
          border-color: #69f0ae;
          box-shadow: 0 0 28px 8px rgba(0,230,118,0.8);
        }

        /* ── Word container ── */
        .splash-word-wrap {
          position: relative;
          z-index: 1;
          height: 120px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Base word style ── */
        .splash-word {
          position: absolute;
          font-family: var(--font-orbitron), "Arial Black", sans-serif;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          opacity: 0;
          white-space: nowrap;
          user-select: none;
        }

        /* GET — white */
        .splash-get {
          font-size: clamp(56px, 14vw, 100px);
          color: #f4f4f5;
          -webkit-text-stroke: 2px rgba(255,255,255,0.15);
        }
        /* SET — muted red outline */
        .splash-set {
          font-size: clamp(56px, 14vw, 100px);
          color: #f4f4f5;
          -webkit-text-stroke: 2px rgba(225,6,0,0.4);
        }
        /* CARZO — full red gradient */
        .splash-carzo {
          font-size: clamp(60px, 15vw, 110px);
          background: linear-gradient(135deg, #ff2d20 0%, #e10600 50%, #ff6b00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 40px rgba(225,6,0,0.8));
        }
        .splash-exclaim {
          -webkit-text-fill-color: #ff6b00;
        }

        /* ── Show / hide animations ── */
        .word-show {
          animation: wordIn 0.4s cubic-bezier(.2,1.4,.4,1) forwards;
        }
        .word-gone {
          animation: wordOut 0.25s ease-in forwards;
        }
        .word-show-carzo {
          animation: carzoIn 0.55s cubic-bezier(.15,1.5,.4,1) forwards;
        }

        @keyframes wordIn {
          0%   { opacity: 0; transform: translateY(50px) scale(0.7); }
          100% { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        @keyframes wordOut {
          0%   { opacity: 1; transform: translateY(0)     scale(1);   }
          100% { opacity: 0; transform: translateY(-40px) scale(0.85); }
        }
        @keyframes carzoIn {
          0%   { opacity: 0; transform: translateX(-80px) scale(0.6) skewX(-18deg); }
          50%  { opacity: 1; transform: translateX(8px)   scale(1.08) skewX(-5deg); }
          100% { opacity: 1; transform: translateX(0)     scale(1)    skewX(0deg);  }
        }

        /* ── Rev bar ── */
        .splash-revbar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          width: 0%;
          background: linear-gradient(90deg, #e10600, #ff2d20, #ff6b00);
          transition: width 0.9s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 0 24px 6px rgba(225,6,0,0.6);
        }
        .revbar-go {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
