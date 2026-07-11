"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_ITEMS, NavKey, REVENUE_SERIES, CONFIDENCE_SERIES, INSIGHT_ROWS, AUTOMATIONS } from "./data";
import Sparkline from "./Sparkline";

export default function DashboardPreview() {
  const [active, setActive] = useState<NavKey>("overview");

  return (
    <section id="dashboard" className="relative bg-ink-950 px-6 py-28 md:px-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal-400">
            Inside the workspace
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tightest text-paper-100 md:text-5xl">
            One surface for the whole team.
          </h2>
          <p className="mt-4 font-body text-mist-400">
            Not a report you export once. A live workspace that stays current
            as new data - and new insight - arrives.
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 shadow-[0_40px_120px_-40px_rgba(91,140,255,0.25)]"
        >
          {/* window chrome */}
          <div className="flex items-center gap-2 border-b border-ink-800 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
            <span className="ml-3 font-mono text-[11px] text-mist-400">
              xai.app/workspace
            </span>
          </div>

          <div className="flex min-h-[520px] flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="flex shrink-0 flex-row gap-1 border-b border-ink-800 p-3 md:w-56 md:flex-col md:border-b-0 md:border-r md:p-4">
              <div className="mb-4 hidden items-center gap-2 px-2 font-display text-sm text-paper-100 md:flex">
                <span className="h-2 w-2 rounded-full bg-signal-500" />
                Xai
              </div>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className="relative rounded-lg px-3 py-2 text-left font-body text-sm text-mist-300 transition-colors hover:text-paper-100"
                >
                  {active === item.key && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-ink-800"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </aside>

            {/* Main panel */}
            <div className="flex-1 p-5 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {active === "overview" && <OverviewPanel />}
                  {active === "insights" && <InsightsPanel />}
                  {active === "automations" && <AutomationsPanel />}
                  {active === "sources" && <SourcesPanel />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-ink-800 bg-ink-850/60 p-5 transition-colors duration-300 hover:border-ink-700 ${className}`}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="font-body text-sm font-medium text-paper-100">{title}</h3>
        {subtitle && <span className="font-mono text-xs text-mist-400">{subtitle}</span>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function OverviewPanel() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card title="Structured revenue signal" subtitle="+18% MoM">
        <Sparkline data={REVENUE_SERIES} color="#5B8CFF" />
      </Card>
      <Card title="Model confidence" subtitle="88% avg">
        <Sparkline data={CONFIDENCE_SERIES} color="#F2A93B" />
      </Card>
      <Card title="Pipeline health" className="md:col-span-2">
        <div className="grid grid-cols-2 gap-4 font-mono text-xs text-mist-400 sm:grid-cols-4">
          {[
            { label: "Sources", value: "14" },
            { label: "Records / day", value: "2.1M" },
            { label: "Latency", value: "340ms" },
            { label: "Insights this week", value: "6" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-ink-900 p-3">
              <div className="text-lg font-medium text-paper-100">{stat.value}</div>
              <div className="mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function InsightsPanel() {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-800">
      <table className="w-full text-left font-body text-sm">
        <thead>
          <tr className="border-b border-ink-800 bg-ink-900/60 font-mono text-xs uppercase tracking-wide text-mist-400">
            <th className="px-4 py-3 font-normal">ID</th>
            <th className="px-4 py-3 font-normal">Insight</th>
            <th className="px-4 py-3 font-normal">Confidence</th>
            <th className="px-4 py-3 font-normal">Impact</th>
            <th className="px-4 py-3 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {INSIGHT_ROWS.map((row) => (
            <tr
              key={row.id}
              className="border-b border-ink-800/70 last:border-0 hover:bg-ink-900/60"
            >
              <td className="px-4 py-3 font-mono text-xs text-mist-400">{row.id}</td>
              <td className="px-4 py-3 text-paper-100">{row.title}</td>
              <td className="px-4 py-3 font-mono text-xs text-mist-300">{row.confidence}%</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${row.impact === "High"
                      ? "bg-insight-500/15 text-insight-400"
                      : row.impact === "Medium"
                        ? "bg-signal-500/15 text-signal-400"
                        : "bg-ink-700/60 text-mist-300"
                    }`}
                >
                  {row.impact}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-mist-400">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AutomationsPanel() {
  return (
    <div className="flex flex-col gap-3">
      {AUTOMATIONS.map((a) => (
        <div
          key={a.name}
          className="flex items-center justify-between rounded-xl border border-ink-800 bg-ink-850/60 px-5 py-4 transition-colors hover:border-ink-700"
        >
          <div>
            <p className="font-body text-sm text-paper-100">{a.name}</p>
            <p className="mt-1 font-mono text-xs text-mist-400">{a.trigger}</p>
          </div>
          <span
            className={`flex items-center gap-2 font-mono text-xs ${a.state === "Active" ? "text-signal-400" : "text-mist-400"
              }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${a.state === "Active" ? "bg-signal-500" : "bg-ink-700"
                }`}
            />
            {a.state}
          </span>
        </div>
      ))}
    </div>
  );
}

function SourcesPanel() {
  const sources = ["Postgres - prod", "Snowflake", "Stripe", "Zendesk", "Segment", "S3 - logs"];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {sources.map((s) => (
        <div
          key={s}
          className="flex items-center justify-between rounded-xl border border-ink-800 bg-ink-850/60 px-4 py-3 font-body text-sm text-mist-300 transition-colors hover:border-signal-500/50 hover:text-paper-100"
        >
          {s}
          <span className="h-1.5 w-1.5 rounded-full bg-signal-500" />
        </div>
      ))}
    </div>
  );
}
