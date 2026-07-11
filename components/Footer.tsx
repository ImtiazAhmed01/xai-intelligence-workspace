"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
        >
          <div>
            <span className="section-label mb-4 block">Get started</span>
            <h2 className="max-w-lg text-4xl font-medium tracking-tightest text-mist-100 md:text-5xl">
              Bring structure to what your data already knows.
            </h2>
          </div>
          <button className="shrink-0 rounded-full bg-mist-100 px-7 py-3.5 text-sm font-medium text-ink-950 transition-transform hover:scale-[1.03] active:scale-[0.98]">
            Request access
          </button>
        </motion.div>

        <div className="hairline mb-8" />

        <div className="flex flex-col items-start justify-between gap-6 text-sm text-mist-500 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 20L12 4L20 20" stroke="#6ee7ff" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M8 14H16" stroke="#6ee7ff" strokeWidth="1.6" />
            </svg>
            <span className="font-mono text-xs text-mist-400">
              xai - intelligence workspace
            </span>
          </div>
          <p>Designed &amp; built as a product-quality interaction study.</p>
        </div>
      </div>
    </footer>
  );
}
