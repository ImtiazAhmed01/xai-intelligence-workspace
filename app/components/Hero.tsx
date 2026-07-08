// /* eslint-disable react-hooks/purity */
// import React from 'react';

// export default function Hero() {
//     return (
//         <div>
//             <h1> this is hero section</h1>
//         </div>
//     );
// };


'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import DataTransformationCanvas from './Canvas3D/dataTransCanvas';
import { ArrowRight, Terminal, Shield, Cpu, Menu, X } from 'lucide-react';
import { Suspense } from 'react';

function useCountUp(target: number, duration = 1800, start = false) {
    const [value, setValue] = useState(0);
    const frame = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        const tick = (now: number) => {
            if (!startTime) startTime = now;
            const progress = Math.min((now - startTime) / duration, 1);
            setValue(Math.floor(progress * target));
            if (progress < 1) frame.current = setTimeout(() => tick(performance.now()), 16);
        };
        frame.current = setTimeout(() => tick(performance.now()), 16);
        return () => { if (frame.current) clearTimeout(frame.current); };
    }, [target, duration, start]);
    return value;
}

export default function Hero() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
            { threshold: 0.3 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    const eventsCount = useCountUp(10000000, 1600, statsVisible);
    const actionsCount = useCountUp(99999, 2000, statsVisible);

    return (
        <section className="relative min-h-screen flex flex-col justify-between overflow-hidden grid-bg pt-6">
            {/* Glowing decorative background orbs */}
            <div className="glow-orb w-[500px] h-[500px] bg-cyan-500/10 top-[-10%] left-[-10%] animate-pulse-glow" />
            <div className="glow-orb w-[600px] h-[600px] bg-purple-500/10 bottom-[10%] right-[-10%] animate-pulse-glow" style={{ animationDelay: '-6s' }} />

            {/* Navigation Header */}
            <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5 relative z-50">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg blur-sm opacity-70 animate-pulse" />
                        <div className="relative w-6 h-6 bg-black rounded-md border border-white/20 flex items-center justify-center font-bold text-sm text-cyan-400">
                            X
                        </div>
                    </div>
                    <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Xai <span className="text-xs font-mono font-normal text-gray-500 ml-1">Workspace</span>
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
                    <a href="#flow" className="hover:text-white transition-colors">Pipeline</a>
                    <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
                    <a href="#core" className="hover:text-white transition-colors">Core Engine</a>
                </nav>
                {/* Mobile nav toggle */}
                <button
                    className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setMobileNavOpen(o => !o)}
                    aria-label="Toggle navigation"
                >
                    {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                <div className="flex items-center gap-4">
                    <button className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
                        Sign In
                    </button>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-medium transition-all backdrop-blur-md">
                        Request Invite
                    </button>
                </div>
                {/* Mobile nav dropdown */}
                {mobileNavOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex flex-col gap-4 text-sm text-gray-300 z-50 md:hidden"
                    >
                        {['#flow', '#dashboard', '#core'].map((href, i) => (
                            <a key={i} href={href} onClick={() => setMobileNavOpen(false)}
                                className="hover:text-white transition-colors py-1">
                                {['Pipeline', 'Dashboard', 'Core Engine'][i]}
                            </a>
                        ))}
                    </motion.div>
                )}
            </header>

            {/* Hero Main Body */}
            <div className="max-w-7xl mx-auto px-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12 relative z-10">
                {/* Left Side: Content */}
                <div className="lg:col-span-7 flex flex-col justify-center text-left">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit mb-6 backdrop-blur-md"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs font-mono tracking-wider uppercase text-gray-300">
                            Intelligence Core v2.4 Live
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
                    >
                        Synthesize Raw Data <br />
                        Into <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Structured Intelligence</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 font-normal leading-relaxed"
                    >
                        Xai is the unified engineering workspace for real-time data parsing, semantic AI analysis, and continuous workflow automation. Built for decision makers.
                    </motion.p>

                    {/* Call to Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-wrap items-center gap-4 mb-16"
                    >
                        <button className="group px-6 py-3.5 bg-white text-black font-medium rounded-xl text-sm transition-all hover:bg-gray-100 flex items-center gap-2 shadow-lg shadow-white/5 active:scale-[0.98]">
                            Start Building
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl text-sm transition-all backdrop-blur-md active:scale-[0.98]">
                            Book Developer Demo
                        </button>
                    </motion.div>

                    {/* Animated micro telemetry stats */}
                    <motion.div
                        ref={statsRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        className="grid grid-cols-3 gap-6 max-w-md border-t border-white/5 pt-8"
                    >
                        <div>
                            <p className="text-2xl font-mono font-bold text-white tabular-nums">
                                {statsVisible ? (eventsCount >= 10000000 ? '10M+' : `${(eventsCount / 1000000).toFixed(1)}M`) : '0'}
                            </p>
                            <p className="text-xs font-mono text-gray-500 uppercase mt-1">Events / Sec</p>
                        </div>
                        <div>
                            <p className="text-2xl font-mono font-bold text-white">&lt; 15ms</p>
                            <p className="text-xs font-mono text-gray-500 uppercase mt-1">Query Latency</p>
                        </div>
                        <div>
                            <p className="text-2xl font-mono font-bold text-white tabular-nums">
                                {statsVisible ? '99.999%' : '0%'}
                            </p>
                            <p className="text-xs font-mono text-gray-500 uppercase mt-1">Parser Uptime</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: 3D Morphing Canvas */}
                <div className="lg:col-span-5 h-[500px] lg:h-full w-full flex items-center justify-center relative">
                    {/* Extra backdrop visual rings */}
                    <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-white/5 pointer-events-none animate-[spin_100s_linear_infinite]" />
                    <div className="absolute w-[240px] h-[240px] rounded-full border border-white/5 pointer-events-none animate-[spin_60s_linear_infinite_reverse]" />

                    <Suspense fallback={
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                        </div>
                    }>
                        <DataTransformationCanvas />
                    </Suspense>

                    {/* Scroll hint visual */}
                    <div className="absolute bottom-[-10%] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 select-none pointer-events-none hidden lg:flex">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Scroll to Morph</span>
                        <div className="w-[1px] h-8 bg-gradient-to-b from-cyan-400 to-transparent animate-bounce" />
                    </div>
                </div>
            </div>

            {/* Bottom Tech Features Ribbon */}
            <div className="w-full bg-black/60 border-t border-white/5 backdrop-blur-md py-6 relative z-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-cyan-400" />
                        <div>
                            <span className="text-white font-medium block">Advanced Schematics</span>
                            <span className="text-xs text-gray-500">Auto-generated type-safe schemas from json/yaml logs</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-purple-400" />
                        <div>
                            <span className="text-white font-medium block">Semantic AI Routing</span>
                            <span className="text-xs text-gray-500">Vector embedding classification at runtime</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <div>
                            <span className="text-white font-medium block">Continuous Compliance</span>
                            <span className="text-xs text-gray-500">On-the-fly PI redaction and governance matching</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
