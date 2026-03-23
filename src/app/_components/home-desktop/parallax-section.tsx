"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  counter: string;
  titleLine1: string;
  titleLine2: string;
  accentLine?: 1 | 2;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "gold" | "outline" | "whatsapp";
  dark?: boolean;
  external?: boolean;
  decoNumber: string;
};

const titleVariants = {
  hidden: { y: "105%" },
  visible: (delay: number) => ({
    y: "0%",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay },
  }),
};

export function ParallaxSection({
  id, counter, titleLine1, titleLine2, accentLine = 2,
  description, ctaLabel, ctaHref, ctaVariant, dark = false,
  external = false, decoNumber,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const decoY = useTransform(scrollYProgress, [0, 1], ["0px", "80px"]);

  const bgClass = dark
    ? "bg-[#1a1714]"
    : id === "section-02"
    ? "bg-[#e5e1db]"
    : "bg-surface";

  const ctaClass = cn(
    "inline-flex items-center gap-2 px-9 py-4 rounded-xl text-sm font-semibold transition-all",
    {
      "bg-gold text-content hover:shadow-[0_8px_32px_rgba(201,169,110,0.45)] hover:scale-[1.04]":
        ctaVariant === "gold",
      "border border-content/20 dark:border-zinc-700 text-content dark:text-zinc-100 hover:border-content/50 hover:bg-black/[0.03]":
        ctaVariant === "outline",
      "bg-[#25D366] text-white hover:shadow-[0_8px_28px_rgba(37,211,102,0.4)] hover:scale-[1.04]":
        ctaVariant === "whatsapp",
    }
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("relative h-svh flex items-center justify-center overflow-hidden", bgClass)}
    >
      {/* Parallax decorative number */}
      <motion.span
        style={{ y: decoY }}
        className={cn(
          "absolute pointer-events-none select-none font-heebo font-black text-[32vw] leading-none bottom-[-4vw] right-[-2vw] tracking-tighter",
          dark ? "text-white/[0.025]" : "text-gold/[0.055]"
        )}
        aria-hidden
      >
        {decoNumber}
      </motion.span>

      {/* Main content */}
      <div className="relative z-10 max-w-[680px] w-[90%] text-center mx-auto">

        {/* Counter */}
        <motion.span
          className={cn(
            "block text-tiny tracking-[0.22em] uppercase mb-6",
            dark ? "text-white/30" : "text-content-quaternary"
          )}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          {counter}
        </motion.span>

        {/* Title — clip reveal */}
        <h2 className={cn(
          "font-heebo font-light leading-[1.05] tracking-[0.03em] mb-0",
          "text-[clamp(2.8rem,7vw,5rem)]",
          dark ? "text-white" : "text-content dark:text-zinc-100"
        )}>
          <span className="block overflow-hidden">
            <motion.span
              className={cn("block", accentLine === 1 && "text-gold")}
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0}
            >
              {titleLine1}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className={cn("block", accentLine === 2 && "text-gold")}
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.08}
            >
              {titleLine2}
            </motion.span>
          </span>
        </h2>

        {/* Expanding divider */}
        <motion.div
          className="h-px bg-linear-to-r from-transparent via-gold to-transparent mx-auto mt-7 mb-7"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 }}
        />

        {/* Description */}
        <motion.p
          className={cn(
            "text-sm leading-[1.85] max-w-[400px] mx-auto mb-9",
            dark ? "text-white/38" : "text-content-secondary dark:text-zinc-400"
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          {description}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.55 }}
        >
          {external ? (
            <a href={ctaHref} target="_blank" rel="noreferrer" className={ctaClass}>
              {ctaLabel}
            </a>
          ) : (
            <Link href={ctaHref} className={ctaClass}>
              {ctaLabel}
            </Link>
          )}
        </motion.div>

      </div>
    </section>
  );
}
