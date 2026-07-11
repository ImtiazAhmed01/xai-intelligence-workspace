"use client";

import { motion } from "framer-motion";

const LINKS = [
  { label: "Product", href: "#flow" },
  { label: "Workspace", href: "#dashboard" },
  { label: "How it thinks", href: "#signature" },
];

export default function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-14"
    >
      <a href="#hero" className="flex items-center gap-2 font-display text-sm text-paper-100">
        <span className="h-2 w-2 rounded-full bg-signal-500" />
        Xai
      </a>
      <nav className="hidden items-center gap-8 font-body text-sm text-mist-400 md:flex">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-paper-100"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <a
        href="#dashboard"
        className="rounded-full border border-ink-700 px-4 py-2 font-body text-xs font-medium text-paper-100 transition-colors hover:border-signal-500 hover:text-signal-400"
      >
        See the workspace
      </a>
    </motion.header>
  );
}
