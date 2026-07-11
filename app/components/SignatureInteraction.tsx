"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import SignatureField from "./SignatureField";
import { scrollProgress } from "@/lib/utils";

export default function SignatureInteraction() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const copyOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.15], [24, 0]);

  useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;
      progress.current = scrollProgress(sectionRef.current, 0.05, 0.75);
    }
    function onMove(e: PointerEvent) {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section id="automate" ref={sectionRef} className="relative h-[220vh] bg-ink-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-60" />
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 42 }} dpr={[1, 1.75]}>
            <SignatureField progress={progress} pointer={pointer} />
          </Canvas>
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
          <motion.div style={{ opacity: copyOpacity, y: copyY }} className="max-w-md">
            <span className="section-label mb-4 block">Signature interaction</span>
            <h2 className="mb-5 text-4xl font-medium tracking-tightest text-mist-100 md:text-5xl">
              Automations that organize themselves.
            </h2>
            <p className="text-mist-400">
              As new signal arrives, Xai continuously re-clusters related events
              into live automation groups — no manual tagging, no static rules.
              Move your cursor, keep scrolling: the system is reasoning about
              structure in real time, not just displaying it.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Inventory", "Churn", "Pricing", "Supply chain"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-mist-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
