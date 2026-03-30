"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function SplashSection() {
  return (
    <section className="relative h-svh bg-surface flex flex-col items-center justify-center overflow-hidden pt-14">

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
          width={44}
          height={44}
          className="mb-2 object-contain dark:brightness-0 dark:invert"
          priority
        />
        <h1 className="font-heebo font-light text-4xl lg:text-5xl tracking-[0.06em] text-content dark:text-zinc-100">
          Luckete Colorista
        </h1>
        <p className="font-archivo text-micro tracking-[0.24em] uppercase text-gold mt-1">
          Donde el color se vuelve arte
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        onClick={() => {
          document.getElementById("section-01")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="font-archivo text-nano tracking-[0.22em] uppercase text-content-quaternary dark:text-zinc-600">
          Scroll
        </span>
        <span
          className="w-px h-9 bg-linear-to-b from-gold to-transparent"
          style={{ animation: "scroll-pulse 2s ease 2.2s infinite" }}
        />
      </motion.div>

    </section>
  );
}
