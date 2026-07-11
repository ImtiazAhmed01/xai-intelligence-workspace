"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import ClusterScene from "./ClusterScene";
import { useScrollProgress, usePointerNormalized } from "@/lib/useScrollProgress";

export default function Signature() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>(0.9);
  const pointer = usePointerNormalized();

  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  progressRef.current = progress;
  pointerRef.current = pointer;

  const stageLabel =
    progress < 0.15
      ? "Unstructured cluster"
      : progress < 0.55
      ? "Xai is finding structure…"
      : "Structured intelligence graph";

  return (
    <section
      ref={ref}
      id="signature"
      className="relative h-[220vh] w-full bg-ink-950"
      aria-label="A live data cluster reorganizing into a structured graph as you scroll"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        <div className="absolute inset-0 bg-coord-grid opacity-25" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between px-6 py-14 md:px-14">
          <div className="max-w-lg">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal-400">
              Watch it think
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tightest text-paper-100 md:text-5xl">
              Every point of data finds its place.
            </h2>
            <p className="mt-4 font-body text-mist-400">
              This is a live model of what Xai does to your data on ingest —
              not an illustration of it. Scroll to watch the cluster
              self-organize into a graph, ring by ring.
            </p>
          </div>

          <div className="flex items-center justify-between font-mono text-xs text-mist-400">
            <span className="mono-tick">{String(Math.round(progress * 100)).padStart(3, "0")}%</span>
            <motion.span
              key={stageLabel}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-signal-400"
            >
              {stageLabel}
            </motion.span>
          </div>
        </div>

        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 7], fov: 42 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true }}
          >
            <ClusterScene progressRef={progressRef} pointerRef={pointerRef} />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />
      </div>
    </section>
  );
}
