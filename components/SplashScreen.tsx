"use client";

import { useEffect, useState } from "react";

type Phase = "get" | "set" | "carzo" | "exit" | "done";

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("get");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("carzo_splash_seen")) {
      setVisible(false);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("set"),   900));
    timers.push(setTimeout(() => setPhase("carzo"), 1700));
    timers.push(setTimeout(() => setPhase("exit"),  2900));
    timers.push(setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("carzo_splash_seen", "1");
    }, 3600));

    return () => timers.forEach(clearTimeout);
  }, []);

  if (!visible) return null;

  return (
    <div className={`splash-root ${phase === "exit" ? "splash-exit" : ""}`}>
      {/* Animated speedlines layer */}
      <div className="splash-lines" />

      {/* Countdown lights row */}
      <div className="splash-lights">
        <span className={`splash-light ${phase !== "get" ? "light-on" : ""}`} />
        <span className={`splash-light ${phase === "set" || phase === "carzo" || phase === "exit" ? "light-on" : ""}`} />
        <span className={`splash-light light-carzo ${phase === "carzo" || phase === "exit" ? "light-on-carzo" : ""}`} />
      </div>

      {/* Main word display */}
      <div className="splash-word-wrap">
        {/* GET */}
        <span
          className={`splash-word splash-get ${
            phase === "get" ? "word-show" : phase !== "get" ? "word-gone" : ""
          }`}
        >
          GET
        </span>

        {/* SET */}
        <span
          className={`splash-word splash-set ${
            phase === "set" ? "word-show" : phase === "carzo" || phase === "exit" ? "word-gone" : ""
          }`}
        >
          SET
        </span>

        {/* CARZO */}
        <span
          className={`splash-word splash-carzo ${
            phase === "carzo" || phase === "exit" ? "word-show-carzo" : ""
          }`}
        >
          CARZO
        </span>
      </div>

      {/* Red rev-up bar at bottom */}
      <div className={`splash-revbar ${phase === "carzo" || phase === "exit" ? "revbar-go" : ""}`} />

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
          transform: scale(1.04);
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
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #333;
          background: #1a1a1a;
          transition: background 0.25s ease, box-shadow 0.25s ease;
        }
        .light-on {
          background: #e10600;
          border-color: #ff2d20;
          box-shadow: 0 0 18px 4px rgba(225,6,0,0.75);
        }
        .light-carzo {
          width: 24px;
          height: 24px;
        }
        .light-on-carzo {
          background: #ff2d20;
          border-color: #ff6b00;
          box-shadow: 0 0 28px 8px rgba(255,100,0,0.8);
        }

        /* ── Word container ── */
        .splash-word-wrap {
          position: relative;
          z-index: 1;
          height: 120px;
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
          transform: translateY(30px) scale(0.85);
          transition: opacity 0.0s, transform 0.0s;
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
          font-size: clamp(56px, 14vw, 100px);
          background: linear-gradient(135deg, #ff2d20 0%, #e10600 50%, #ff6b00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 32px rgba(225,6,0,0.7));
        }

        /* ── Show / hide transitions ── */
        .word-show {
          animation: wordIn 0.35s cubic-bezier(.2,1.4,.4,1) forwards;
        }
        .word-gone {
          animation: wordOut 0.2s ease-in forwards;
        }
        .word-show-carzo {
          animation: carzoIn 0.5s cubic-bezier(.15,1.5,.4,1) forwards;
        }

        @keyframes wordIn {
          from { opacity: 0; transform: translateY(40px) scale(0.8); }
          to   { opacity: 1; transform: translateY(0)   scale(1);   }
        }
        @keyframes wordOut {
          from { opacity: 1; transform: translateY(0)    scale(1); }
          to   { opacity: 0; transform: translateY(-30px) scale(0.9); }
        }
        @keyframes carzoIn {
          0%   { opacity: 0; transform: translateX(-60px) scale(0.7) skewX(-15deg); }
          60%  { opacity: 1; transform: translateX(6px)   scale(1.06) skewX(-4deg); }
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
          transition: width 0.8s cubic-bezier(.4,0,.2,1);
          box-shadow: 0 0 20px 4px rgba(225,6,0,0.6);
        }
        .revbar-go {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
