"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: "grid" },
  { key: "signals", label: "Signals", icon: "activity" },
  { key: "reports", label: "Reports", icon: "file" },
  { key: "automations", label: "Automations", icon: "zap" },
];

const KPI = [
  { label: "Signals processed", value: "1.84M", delta: "+12.4%" },
  { label: "Insights generated", value: "342", delta: "+8.1%" },
  { label: "Avg. time to insight", value: "1.2s", delta: "-31%" },
];

const TABLE_ROWS = [
  { name: "Inventory drift — Northeast", conf: 96, status: "New" },
  { name: "Churn risk cluster #4", conf: 88, status: "Reviewed" },
  { name: "Pricing anomaly, SKU-2291", conf: 91, status: "New" },
  { name: "Supplier delay correlation", conf: 79, status: "Actioned" },
];

function Icon({ name }: { name: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
  };
  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "activity":
      return (
        <svg {...common}>
          <path d="M3 12h4l2 7 4-14 2 7h6" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <path d="M6 3h9l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" />
          <path d="M9 13h6M9 17h6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" strokeLinejoin="round" />
        </svg>
      );
  }
}

export default function Dashboard() {
  const [active, setActive] = useState("overview");

  return (
    <section id="reports" className="relative bg-ink-950 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 max-w-2xl"
        >
          <span className="section-label mb-4 block">Product</span>
          <h2 className="text-4xl font-medium tracking-tightest text-mist-100 md:text-5xl">
            One workspace for every insight.
          </h2>
          <p className="mt-4 text-mist-400">
            A single, calm surface where signals become reviewable, actionable
            findings — not another dashboard to babysit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel overflow-hidden rounded-2xl shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)]"
        >
          <div className="grid grid-cols-[220px_1fr]">
            {/* Sidebar */}
            <aside className="border-r border-white/[0.06] p-5">
              <div className="mb-8 flex items-center gap-2 px-1">
                <span className="h-2 w-2 rounded-full bg-signal" />
                <span className="font-mono text-xs text-mist-300">xai / workspace</span>
              </div>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActive(item.key)}
                    className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active === item.key
                        ? "text-mist-100"
                        : "text-mist-500 hover:text-mist-300"
                    }`}
                  >
                    {active === item.key && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-white/[0.06]"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">
                      <Icon name={item.icon} />
                    </span>
                    <span className="relative z-10">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-10 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="text-[11px] leading-relaxed text-mist-500">
                  Automations active
                </p>
                <p className="mt-1 font-mono text-lg text-signal">7</p>
              </div>
            </aside>

            {/* Main panel */}
            <div className="p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {/* KPI row */}
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    {KPI.map((k) => (
                      <div
                        key={k.label}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.14]"
                      >
                        <p className="text-[11px] text-mist-500">{k.label}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="font-mono text-xl text-mist-100">{k.value}</span>
                          <span
                            className={`text-[11px] ${
                              k.delta.startsWith("-") ? "text-signal" : "text-amber"
                            }`}
                          >
                            {k.delta}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-mist-300">Signal volume, 30 days</p>
                      <span className="section-label">Live</span>
                    </div>
                    <svg viewBox="0 0 560 140" className="w-full">
                      <defs>
                        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6ee7ff" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#6ee7ff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M0,110 C40,90 60,60 100,70 C140,80 160,40 200,45 C240,50 260,90 300,80 C340,70 360,20 400,30 C440,40 460,70 500,55 C520,48 540,60 560,50"
                        fill="none"
                        stroke="#6ee7ff"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, ease: "easeInOut" }}
                      />
                      <path
                        d="M0,110 C40,90 60,60 100,70 C140,80 160,40 200,45 C240,50 260,90 300,80 C340,70 360,20 400,30 C440,40 460,70 500,55 C520,48 540,60 560,50 L560,140 L0,140 Z"
                        fill="url(#chartFill)"
                      />
                    </svg>
                  </div>

                  {/* Table */}
                  <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-white/[0.02] text-[11px] uppercase tracking-wide text-mist-500">
                          <th className="px-4 py-3 font-normal">Finding</th>
                          <th className="px-4 py-3 font-normal">Confidence</th>
                          <th className="px-4 py-3 font-normal">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TABLE_ROWS.map((row, i) => (
                          <motion.tr
                            key={row.name}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06, duration: 0.4 }}
                            className="border-t border-white/[0.05] text-mist-300 transition-colors hover:bg-white/[0.02]"
                          >
                            <td className="px-4 py-3">{row.name}</td>
                            <td className="px-4 py-3 font-mono text-mist-400">{row.conf}%</td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] ${
                                  row.status === "New"
                                    ? "bg-signal/10 text-signal"
                                    : row.status === "Actioned"
                                    ? "bg-amber/10 text-amber"
                                    : "bg-white/[0.06] text-mist-400"
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
