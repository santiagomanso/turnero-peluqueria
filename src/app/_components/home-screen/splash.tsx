"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const SUBTITLE = "Donde el color se vuelve arte";

// Timing constants
const CONTENT_APPEAR_MS = 1800;  // wait for splash content fade-in to finish
const CURSOR_WAIT_MS    = 3000;  // cursor blinks (no text) before/after typing
const TYPE_CHAR_MS      = 55;    // ms per character while typing
const DELETE_CHAR_MS    = 22;    // ms per character while deleting (fast)
const HOLD_FULL_MS      = 6000;  // pause after full text before deleting

type Phase = "idle" | "waiting" | "typing" | "full" | "deleting";

function TypewriterSubtitle() {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  // After content appears, move from idle → waiting (cursor blink)
  useEffect(() => {
    const t = setTimeout(() => setPhase("waiting"), CONTENT_APPEAR_MS);
    return () => clearTimeout(t);
  }, []);

  // Phase state machine
  useEffect(() => {
    if (phase === "waiting") {
      // Cursor blinks for CURSOR_WAIT_MS, then start typing
      const t = setTimeout(() => setPhase("typing"), CURSOR_WAIT_MS);
      return () => clearTimeout(t);
    }

    if (phase === "typing") {
      let i = displayed.length;
      const interval = setInterval(() => {
        i++;
        setDisplayed(SUBTITLE.slice(0, i));
        if (i >= SUBTITLE.length) {
          clearInterval(interval);
          setPhase("full");
        }
      }, TYPE_CHAR_MS);
      return () => clearInterval(interval);
    }

    if (phase === "full") {
      // Hold full text, then delete
      const t = setTimeout(() => setPhase("deleting"), HOLD_FULL_MS);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      let i = displayed.length;
      const interval = setInterval(() => {
        i--;
        setDisplayed(SUBTITLE.slice(0, Math.max(0, i)));
        if (i <= 0) {
          clearInterval(interval);
          setPhase("waiting"); // loop: cursor blinks again
        }
      }, DELETE_CHAR_MS);
      return () => clearInterval(interval);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const showCursor = phase === "waiting" || phase === "typing" || phase === "deleting";

  return (
    <p className="font-archivo text-micro lg:text-xs tracking-[0.24em] uppercase text-gold mt-1 lg:mt-3 h-4">
      {displayed}
      {showCursor && (
        <motion.span
          className="inline-block w-px h-[1em] bg-gold align-middle ml-px"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </p>
  );
}

export function SplashSection() {
  return (
    <section
      id="splash"
      className="relative h-svh bg-surface flex flex-col items-center justify-center overflow-hidden pt-14"
    >
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="absolute rounded-full border border-dashed border-gold/30"
          style={{
            animation:
              "ring-expand-outer 2.4s cubic-bezier(0.16,1,0.3,1) 0.1s forwards, ring-rotate-ccw 12s linear infinite",
            width: 60,
            height: 60,
          }}
        />
        <span
          className="absolute rounded-full border border-gold/60"
          style={{
            animation:
              "ring-expand 2.2s cubic-bezier(0.16,1,0.3,1) forwards, ring-rotate-cw 8s linear infinite",
            width: 60,
            height: 60,
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-2 text-center"
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      >
        <Image
          src="/logo.png"
          alt="Luckete Colorista"
          width={96}
          height={96}
          className="mb-4 object-contain dark:brightness-0 dark:invert w-20 h-20 lg:w-40 lg:h-40"
          priority
        />
        <h1 className="font-heebo font-light text-4xl lg:text-8xl tracking-[0.06em] text-content dark:text-zinc-100">
          Luckete Colorista
        </h1>
        <TypewriterSubtitle />
      </motion.div>

      {/* Scroll indicator — arrow */}
      <motion.button
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        onClick={() => {
          document
            .getElementById("section-01")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        aria-label="Ir a la primera sección"
      >
        <ChevronDown
          size={22}
          strokeWidth={1.5}
          className="text-gold group-hover:translate-y-1 transition-transform duration-300"
          style={{ animation: "scroll-pulse 2s ease 2.2s infinite" }}
        />
      </motion.button>
    </section>
  );
}
