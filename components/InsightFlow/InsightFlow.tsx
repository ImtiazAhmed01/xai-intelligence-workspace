"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STAGES = [
  {
    index: "01",
    key: "ingest",
    title: "Ingest",
    verb: "Collecting",
    description:
      "Every source - warehouses, event streams, spreadsheets, tickets - lands in one schema. Xai fingerprints each record as it arrives.",
    metric: "14 sources connected",
  },
  {
    index: "02",
    key: "analyze",
    title: "Analyze with AI",
    verb: "Reasoning",
    description:
      "Models trace relationships across the structured set, weighing signal against noise, and flag the patterns worth a human's attention.",
    metric: "2,431 patterns evaluated",
  },
  {
    index: "03",
    key: "generate",
    title: "Generate Insight",
    verb: "Synthesizing",
    description:
      "Findings are written in plain language, ranked by impact, and routed to the person who can act on them - with the evidence attached.",
    metric: "6 insights ready to act on",
  },
];

export default function InsightFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const track = trackRef.current;
    const line = lineRef.current;
    if (!section || !track || !line) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - window.innerWidth;
      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance + window.innerHeight * 0.6}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              STAGES.length - 1,
              Math.floor(self.progress * STAGES.length)
            );
            setActive(idx);
          },
        },
      });

      tl.to(track, { x: -distance, ease: "none" }, 0);
      tl.to(line, { strokeDashoffset: 0, ease: "none" }, 0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="flow"
      className="relative h-screen w-full overflow-hidden bg-ink-950"
    >
      <div className="absolute inset-0 bg-coord-grid opacity-30" />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-14">
        <header className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal-400">
              How Xai works
            </p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-medium tracking-tightest text-paper-100 md:text-5xl">
              Three stages. One continuous line.
            </h2>
          </div>
          <p className="hidden max-w-xs text-right font-body text-sm text-mist-400 md:block">
            Scroll to move the thread through ingestion, reasoning, and the
            insight it produces.
          </p>
        </header>

        {/* connective geometry: a single line threading through the 3 stages */}
        <svg
          className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-full -translate-y-8"
          viewBox="0 0 1200 2"
          preserveAspectRatio="none"
        >
          <path
            ref={lineRef}
            d="M0,1 L1200,1"
            stroke="#5B8CFF"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div
          ref={trackRef}
          className="flex w-max gap-8 md:gap-16"
          style={{ willChange: "transform" }}
        >
          {STAGES.map((stage, i) => (
            <StageCard key={stage.key} stage={stage} isActive={active === i} />
          ))}
          <div className="w-[10vw] shrink-0" aria-hidden />
        </div>

        <ProgressDots active={active} />
      </div>
    </section>
  );
}

function StageCard({
  stage,
  isActive,
}: {
  stage: (typeof STAGES)[number];
  isActive: boolean;
}) {
  return (
    <div
      className={`group w-[86vw] shrink-0 rounded-2xl border p-8 transition-colors duration-500 md:w-[38vw] md:p-10 ${isActive
          ? "border-signal-500/60 bg-ink-900"
          : "border-ink-800 bg-ink-900/40"
        }`}
    >
      <div className="flex items-center justify-between font-mono text-xs text-mist-400">
        <span
          className={`transition-colors duration-500 ${isActive ? "text-signal-400" : "text-mist-400"
            }`}
        >
          {stage.index}
        </span>
        <span
          className={`transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"
            }`}
        >
          {stage.verb}…
        </span>
      </div>

      <h3 className="mt-6 font-display text-2xl font-medium text-paper-100 md:text-3xl">
        {stage.title}
      </h3>
      <p className="mt-4 font-body text-sm leading-relaxed text-mist-400 md:text-base">
        {stage.description}
      </p>

      <div className="mt-8 flex items-center gap-2 border-t border-ink-800 pt-5 font-mono text-xs text-mist-300">
        <span
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${isActive ? "bg-insight-500" : "bg-ink-700"
            }`}
        />
        {stage.metric}
      </div>
    </div>
  );
}

function ProgressDots({ active }: { active: number }) {
  return (
    <div className="mt-10 flex items-center gap-2">
      {STAGES.map((s, i) => (
        <div
          key={s.key}
          className={`h-[3px] rounded-full transition-all duration-500 ${i === active ? "w-10 bg-signal-500" : "w-4 bg-ink-700"
            }`}
        />
      ))}
    </div>
  );
}
