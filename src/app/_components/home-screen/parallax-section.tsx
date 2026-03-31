"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
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
  ctaIcon: React.ElementType;
  dark?: boolean;
  external?: boolean;
  decoNumber: string;
  bgClass?: string;
  nextSectionId?: string;
  prevSectionId?: string;
};

export function ParallaxSection({
  id,
  counter,
  titleLine1,
  titleLine2,
  accentLine = 2,
  description,
  ctaLabel,
  ctaHref,
  ctaVariant,
  ctaIcon: CtaIcon,
  dark = false,
  external = false,
  decoNumber,
  bgClass,
  nextSectionId,
  prevSectionId,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const decoY = useTransform(scrollYProgress, [0, 1], ["0px", "80px"]);

  // Trigger reveal when section reaches 25% visibility in viewport.
  // useInView targets sectionRef (always in-position, no transform), so
  // intersection fires reliably — unlike whileInView on translated children.
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  const baseCta =
    "inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold transition-all group";
  const ctaClass = cn(baseCta, {
    "bg-gold text-content hover:shadow-[0_8px_32px_rgba(201,169,110,0.45)] hover:scale-[1.04]":
      ctaVariant === "gold",
    "border border-content/20 dark:border-zinc-700 text-content dark:text-zinc-100 hover:border-content/50 hover:bg-black/[0.03]":
      ctaVariant === "outline",
    "bg-[#25D366] text-white hover:shadow-[0_8px_28px_rgba(37,211,102,0.4)] hover:scale-[1.04]":
      ctaVariant === "whatsapp",
  });

  const ctaContent = (
    <>
      <CtaIcon size={15} strokeWidth={2} />
      <span>{ctaLabel}</span>
      <ArrowRight
        size={14}
        strokeWidth={2}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </>
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "relative h-svh flex items-center justify-center overflow-hidden scroll-mt-14",
        bgClass ?? "bg-surface",
        prevSectionId && "pt-16",
        nextSectionId && "pb-24",
      )}
    >
      {/* Parallax decorative number */}
      <motion.span
        style={{ y: decoY }}
        className={cn(
          "absolute pointer-events-none select-none font-heebo font-black text-[32vw] leading-none bottom-[-4vw] right-[-2vw] tracking-tighter",
          dark ? "text-white/[0.025]" : "text-gold/[0.055]",
        )}
        aria-hidden
      >
        {decoNumber}
      </motion.span>

      {/* Main content */}
      <div className="relative z-10 max-w-[720px] w-[90%] text-center mx-auto">
        {/* Counter */}
        <motion.span
          className={cn(
            "block text-tiny tracking-[0.22em] uppercase mb-8",
            dark
              ? "text-white/30"
              : "text-content-quaternary dark:text-zinc-500",
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
        >
          {counter}
        </motion.span>

        {/* Title — clip reveal */}
        <h2
          className={cn(
            "font-heebo font-light leading-[1.0] tracking-[0.06em] mb-0",
            "text-[clamp(3rem,8vw,6rem)]",
            dark ? "text-white" : "text-content dark:text-zinc-100",
          )}
        >
          <span className="block overflow-hidden">
            <motion.span
              className={cn("block", accentLine === 1 && "text-gold")}
              initial={{ y: "105%" }}
              animate={isInView ? { y: "0%" } : { y: "105%" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
            >
              {titleLine1}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className={cn("block", accentLine === 2 && "text-gold")}
              initial={{ y: "105%" }}
              animate={isInView ? { y: "0%" } : { y: "105%" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
            >
              {titleLine2}
            </motion.span>
          </span>
        </h2>

        {/* Expanding divider */}
        <motion.div
          className="h-px bg-linear-to-r from-transparent via-gold to-transparent mx-auto mt-8 mb-7"
          initial={{ width: 0 }}
          animate={isInView ? { width: 80 } : { width: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.35 }}
        />

        {/* Description */}
        <motion.p
          className={cn(
            "text-sm leading-[1.85] max-w-[400px] mx-auto mb-9",
            dark
              ? "text-white/40"
              : "text-content-secondary dark:text-zinc-400",
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
        >
          {description}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.55 }}
        >
          {external ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noreferrer"
              className={ctaClass}
            >
              {ctaContent}
            </a>
          ) : (
            <Link href={ctaHref} className={ctaClass}>
              {ctaContent}
            </Link>
          )}
        </motion.div>
      </div>

      {/* Up arrow — just below navbar */}
      {prevSectionId && (
        <motion.button
          className="absolute top-5 left-1/2 -translate-x-1/2 cursor-pointer group"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={() =>
            document
              .getElementById(prevSectionId)
              ?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="Ir a la sección anterior"
        >
          <ChevronUp
            size={22}
            strokeWidth={1.5}
            className={cn(
              "group-hover:-translate-y-1 transition-transform duration-300",
              dark ? "text-white/40" : "text-gold",
            )}
          />
        </motion.button>
      )}

      {/* Down arrow — above bottom edge */}
      {nextSectionId && (
        <motion.button
          className="absolute bottom-20 left-1/2 -translate-x-1/2 cursor-pointer group"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={() =>
            document
              .getElementById(nextSectionId)
              ?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="Ir a la siguiente sección"
        >
          <ChevronDown
            size={22}
            strokeWidth={1.5}
            className={cn(
              "group-hover:translate-y-1 transition-transform duration-300",
              dark ? "text-white/40" : "text-gold",
            )}
          />
        </motion.button>
      )}
    </section>
  );
}
