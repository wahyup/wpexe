'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01';

/**
 * Judul beranimasi:
 * 1. Huruf "terdekripsi" satu per satu dari kiri ke kanan (efek scramble)
 * 2. Setelah selesai, gradient berkilau bergerak terus-menerus + kursor berkedip
 * 3. Klik judul untuk memutar ulang animasi
 *
 * Pakai font monospace supaya lebar huruf tidak melompat saat diacak.
 * Menghormati pengaturan "reduce motion" di perangkat.
 */
export default function AnimatedTitle({
  text = 'WP.EXE GEOMAP GENERATOR',
  className = '',
  duration = 1600, // ms, lama sampai semua huruf terbuka
}) {
  // Awal: spasi kosong dengan panjang sama, jadi server & client identik (tanpa hydration mismatch)
  const [display, setDisplay] = useState(() => text.replace(/\S/g, '\u00A0'));
  const [done, setDone] = useState(false);
  const frameRef = useRef(0);

  const play = useCallback(() => {
    cancelAnimationFrame(frameRef.current);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      setDone(true);
      return;
    }

    setDone(false);
    const chars = [...text];
    const start = performance.now();
    let lastPaint = 0;

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);

      if (t >= 1) {
        setDisplay(text);
        setDone(true);
        return;
      }

      // Acak ulang ~20x per detik supaya terlihat seperti glitch, bukan kedip cepat
      if (now - lastPaint > 50) {
        lastPaint = now;
        const resolved = Math.floor(t * chars.length);
        const next = chars
          .map((c, i) => {
            if (c === ' ') return ' ';
            if (i < resolved) return c;
            if (i < resolved + 6) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            return '\u00A0';
          })
          .join('');
        setDisplay(next);
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    play();
    return () => cancelAnimationFrame(frameRef.current);
  }, [play]);

  return (
    <>
      <h1
        className={`animated-title font-mono tracking-wider cursor-pointer select-none ${className}`}
        onClick={play}
        aria-label={text}
        title="Klik untuk memutar ulang animasi"
      >
        <span aria-hidden="true" className={`at-text ${done ? 'at-done' : ''}`}>
          {display}
        </span>
        <span aria-hidden="true" className="at-cursor" />
      </h1>

      <style>{`
        .animated-title { filter: drop-shadow(0 0 14px rgba(52, 211, 153, 0.3)); }

        .at-text {
          background: linear-gradient(110deg, #34d399 0%, #5eead4 30%, #ffffff 50%, #22d3ee 70%, #34d399 100%);
          background-size: 200% 100%;
          background-repeat: repeat-x;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .at-done { animation: at-shimmer 3.5s linear infinite; }
        @keyframes at-shimmer { to { background-position: 200% 0; } }

        .at-cursor {
          display: inline-block;
          width: 0.1em;
          height: 0.9em;
          margin-left: 0.2em;
          vertical-align: -0.1em;
          background: #34d399;
          animation: at-blink 1s steps(1) infinite;
        }
        @keyframes at-blink { 50% { opacity: 0; } }

        @media (prefers-reduced-motion: reduce) {
          .at-done, .at-cursor { animation: none; }
        }
      `}</style>
    </>
  );
}
