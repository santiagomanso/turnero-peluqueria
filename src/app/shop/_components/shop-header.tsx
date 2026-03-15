"use client";

import { motion } from "framer-motion";

export default function ShopHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-5"
    >
      <h2 className="text-2xl font-extrabold text-content dark:text-zinc-100 leading-tight">
        Categorías
      </h2>
      <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5 uppercase tracking-widest">
        Productos profesionales
      </p>
      <div className="w-7 h-px mt-2 bg-gold-gradient" />
    </motion.div>
  );
}
