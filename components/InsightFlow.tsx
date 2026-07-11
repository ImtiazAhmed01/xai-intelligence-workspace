"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STAGES = [
  {
    index: "01",
    key: "ingest",
    title: "Ingest data",
    copy: "Every event, document, and signal your systems produce streams in continuously - unfiltered, untyped, and unordered.",
  },
  {
    index: "02",
    key: "analyze",
    title: "Analyze with AI",
    copy: "Xai's models trace relationships across the raw stream, clustering signal from noise and building a live semantic graph.",
  },
  {
    index: "03",
    key: "insight",
    title: "Generate insight",
    copy: "The graph resolves into a structured, ranked set of findings - written in plain language, ready for a decision.",
  },
];

export default function InsightFlow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<SVGGElement>(null);
  const linesRef = useRef<SVGGElement>(null);
  const cardsRef = useRef<SVGGElement>(null);
  const stageRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const wrap = wrapRef.current;
      if (!wrap) return;

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=250%",
          scrub: 0.6,
          pin: true,
        },
      });

      // Stage copy crossfade + slide
      stageRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i > 0) {
          master.to(
            stageRefs.current[i - 1]!,
            { opacity: 0, y: -18, duration: 0.28, ease: "power2.inOut" },
            i - 0.02
          );
        }
        master.fromTo(
          el,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
          i === 0 ? 0 : i - 0.02
        );
      });

      // Stage 1 -> scattered dots drift + gather toward a funnel line
      if (dotsRef.current) {
        const dots = dotsRef.current.querySelectorAll("circle");
        master.fromTo(
          dots,
          { opacity: 0.25, scale: 1 },
          {
            opacity: 1,
            scale: 0.85,
            transformOrigin: "center",
            stagger: { each: 0.008, from: "random" },
            duration: 0.5,
            ease: "power1.inOut",
          },
          0
        );
      }

      // Stage 2 -> connecting graph lines draw in
      if (linesRef.current) {
        const lines = linesRef.current.querySelectorAll("line");
        lines.forEach((line) => {
          const len = (line as SVGLineElement).getTotalLength
            ? 100
            : 100;
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        });
        master.to(
          lines,
          {
            strokeDashoffset: 0,
            stagger: 0.03,
            duration: 0.6,
            ease: "power2.inOut",
          },
          0.85
        );
        master.to(
          dotsRef.current!.querySelectorAll("circle"),
          { fill: "#6ee7ff", duration: 0.4 },
          0.9
        );
      }

      // Stage 3 -> structured cards rise into place
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll("rect, text");
        master.fromTo(
          cards,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: "power2.out" },
          1.85
        );
      }
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="ingest" ref={wrapRef} className="relative h-screen overflow-hidden bg-ink-900">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        {/* Left: stage copy */}
        <div ref={trackRef} className="relative h-64">
          {STAGES.map((s, i) => (
            <div
              key={s.key}
              ref={(el) => {
                stageRefs.current[i] = el;
              }}
              className="absolute inset-0 flex flex-col justify-center"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <span className="section-label mb-4">{`Stage ${s.index}`}</span>
              <h3 className="mb-4 text-4xl font-medium tracking-tightest text-mist-100 md:text-5xl">
                {s.title}
              </h3>
              <p className="max-w-md text-mist-400">{s.copy}</p>
            </div>
          ))}
        </div>

        {/* Right: geometry-based animated diagram */}
        <div className="relative flex h-[420px] items-center justify-center">
          <div className="glass-panel absolute inset-0 rounded-3xl" />
          <svg
            viewBox="0 0 400 400"
            className="relative z-10 h-[85%] w-[85%]"
            fill="none"
          >
            {/* Stage 1: raw scattered points */}
            <g ref={dotsRef}>
              {Array.from({ length: 36 }).map((_, i) => {
                const gx = (i % 6) * 62 + 40 + ((i * 13) % 20);
                const gy = Math.floor(i / 6) * 62 + 40 + ((i * 7) % 20);
                return (
                  <circle
                    key={i}
                    cx={gx}
                    cy={gy}
                    r={4}
                    fill="#9aa4b8"
                    opacity={0.5}
                  />
                );
              })}
            </g>

            {/* Stage 2: connecting analysis lines */}
            <g ref={linesRef} stroke="#6ee7ff" strokeWidth={1}>
              {Array.from({ length: 14 }).map((_, i) => {
                const x1 = 40 + ((i * 37) % 6) * 62;
                const y1 = 40 + Math.floor(((i * 37) % 36) / 6) * 62;
                const x2 = 40 + ((i * 53) % 6) * 62;
                const y2 = 40 + Math.floor(((i * 53) % 36) / 6) * 62;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity={0.55} />;
              })}
            </g>

            {/* Stage 3: resolved structured cards */}
            <g ref={cardsRef}>
              <rect x="40" y="40" width="150" height="70" rx="10" fill="rgba(110,231,255,0.08)" stroke="#6ee7ff" strokeWidth="1" opacity={0} />
              <text x="56" y="72" fill="#f5f7fa" fontSize="13" fontFamily="var(--font-mono)" opacity={0}>Anomaly detected</text>
              <text x="56" y="92" fill="#6ee7ff" fontSize="11" fontFamily="var(--font-mono)" opacity={0}>Confidence 94%</text>

              <rect x="210" y="40" width="150" height="70" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" opacity={0} />
              <text x="226" y="72" fill="#f5f7fa" fontSize="13" fontFamily="var(--font-mono)" opacity={0}>Revenue driver</text>
              <text x="226" y="92" fill="#9aa4b8" fontSize="11" fontFamily="var(--font-mono)" opacity={0}>Region: APAC</text>

              <rect x="40" y="290" width="320" height="70" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" opacity={0} />
              <text x="56" y="322" fill="#f5f7fa" fontSize="13" fontFamily="var(--font-mono)" opacity={0}>Recommended action</text>
              <text x="56" y="342" fill="#9aa4b8" fontSize="11" fontFamily="var(--font-mono)" opacity={0}>Reallocate budget to top 3 SKUs</text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
