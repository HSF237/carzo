"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "carzo_music_muted";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setMuted(stored === null ? true : stored === "true");
    setReady(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !ready) return;
    audio.muted = muted;
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }, [muted, ready]);

  function toggle() {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/song.mp3" loop autoPlay muted playsInline />
      <button
        onClick={toggle}
        aria-label={muted ? "Unmute background music" : "Mute background music"}
        className="fixed bottom-5 left-5 z-[150] flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg-soft text-white shadow-lg transition hover:border-red-brand"
      >
        {muted ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m17 9 6 6M23 9l-6 6" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"
            />
          </svg>
        )}
      </button>
    </>
  );
}
