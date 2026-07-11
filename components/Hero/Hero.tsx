"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import ParticleField from "./ParticleField";
import { scrollProgress } from "@/lib/utils";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const labelOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;
      progress.current = scrollProgress(sectionRef.current, 0, 0.85);
    }
    function onPointerMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink-950">
        {/* Ambient grid backdrop */}
        <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* 3D canvas */}
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 9.5], fov: 45 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.6} />
            <ParticleField progress={progress} pointer={pointer} />
          </Canvas>
        </div>

        {/* Top nav spacer content lives in Nav component, overlaid globally */}

        {/* Copy */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
          <motion.span
            style={{ opacity: labelOpacity }}
            className="section-label mb-6 inline-flex items-center gap-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-soft" />
            Xai - Intelligence Workspace
          </motion.span>

          <motion.h1
            style={{ y: headlineY, opacity: headlineOpacity }}
            className="max-w-4xl text-balance text-5xl font-medium leading-[1.05] tracking-tightest text-gradient sm:text-6xl md:text-7xl"
          >
            Raw data becomes
            <br />
            structured intelligence.
          </motion.h1>

          <motion.p
            style={{ opacity: headlineOpacity }}
            className="mt-6 max-w-lg text-balance text-base text-mist-400 sm:text-lg"
          >
            Xai ingests the noise your organization produces every day and turns
            it into a calm, structured system of insight - built for the people
            who have to decide, not just report.
          </motion.p>

          <motion.div
            style={{ opacity: headlineOpacity }}
            className="mt-10 flex items-center gap-4"
          >
            <button className="rounded-full bg-white border border-white/10 px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.03] active:scale-[0.98]">
              See it in motion
            </button>
            <button className="rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-mist-200 transition-colors hover:border-white/25">
              Read the architecture
            </button>
          </motion.div>

          <motion.div
            style={{ opacity: labelOpacity }}
            className="absolute bottom-10 flex flex-col items-center gap-2 text-mist-500"
          >
            <span className="section-label">Scroll to structure the data</span>
            <span className="h-8 w-px bg-gradient-to-b from-signal to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
