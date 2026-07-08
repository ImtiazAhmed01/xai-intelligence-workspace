'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CoreCanvas from './Canvas3D/CoreCanvas';
import { Sparkles, AlertTriangle, Zap, Activity, Info } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type CoreState = 'idle' | 'query' | 'threat' | 'compress';

const statesConfig = [
    {
        id: 'idle' as CoreState,
        label: 'Synapse Core (Idle)',
        icon: Activity,
        description: 'Particles are distributed evenly on a spherical coordinate shell. Subtle orbital drift simulates network state ready to process traffic.',
        mathLabel: 'P_i(t) = R_shell * [sin(φ)cos(θ), sin(φ)sin(θ), cos(φ)]',
        themeColor: 'cyan' as const,
        themeHex: '#06b6d4',
        logText: '[Kernel] Core listening on port 8080. Semantic vector buffers initialized. Accretion rate: stable.'
    },
    {
        id: 'query' as CoreState,
        label: 'Inject Query Pulse',
        icon: Zap,
        description: 'Launches a shockwave sequence pushing nodes outward via a sine wave multiplier, simulating the ingestion and parsing of an API request.',
        mathLabel: 'r_i = r_i + sin(π * τ) * shockwave_amplitude',
        themeColor: 'cyan' as const,
        themeHex: '#22d3ee',
        logText: '[Query] Injecting payload size 4.2MB. Commencing forward propagation. Shockwave peak at 1.5ms.'
    },
    {
        id: 'threat' as CoreState,
        label: 'Trigger Threat Response',
        icon: AlertTriangle,
        description: 'Explodes nodes outward into high-amplitude chaos using a sine pulse function. Color changes to ruby-red/amber to indicate WAF block alerts.',
        mathLabel: 'r_i = r_base + random * 2.0; P_i = P_i * heartbeat_wave',
        themeColor: 'red' as const,
        themeHex: '#ef4444',
        logText: '[Threat] Alert: SQL injection threat vector detected from IP 182.112.5.4. Core firewall engaging.'
    },
    {
        id: 'compress' as CoreState,
        label: 'Compress Singularity',
        icon: Sparkles,
        description: 'Collapses the core particles into a dense nucleus, while outer nodes flatten onto the XY plane, forming a glowing, fast-spinning accretion disk.',
        mathLabel: 'z_i -> epsilon, x_i^2 + y_i^2 -> R_disk; rotation_y -> 4.5x',
        themeColor: 'emerald' as const,
        themeHex: '#10b981',
        logText: '[Compress] Compressing intelligence core vectors. Dimension reduction: 768d -> 2d. Accretion disk online.'
    }
];

// Tailwind v4 Static Class mapping to ensure build compilation
const activeBtnStyles: Record<CoreState, string> = {
    idle: "bg-cyan-950/30 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    query: "bg-cyan-950/30 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    threat: "bg-red-950/30 border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    compress: "bg-emerald-950/30 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
};

export default function Signature3D() {
    const [coreState, setCoreState] = useState<CoreState>('idle');
    const [mounted, setMounted] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headingRef.current, {
                opacity: 0, y: 48, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: headingRef.current, start: 'top 88%' }
            });
            gsap.from(controlsRef.current, {
                opacity: 0, x: -40, duration: 0.8, ease: 'power3.out', delay: 0.15,
                scrollTrigger: { trigger: controlsRef.current, start: 'top 88%' }
            });
            gsap.from(viewportRef.current, {
                opacity: 0, x: 40, duration: 0.9, ease: 'power3.out', delay: 0.2,
                scrollTrigger: { trigger: viewportRef.current, start: 'top 88%' }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleStateClick = (stateId: CoreState) => {
        setCoreState(stateId);

        // If it was a query pulse, revert to idle automatically after 1.8s
        if (stateId === 'query') {
            setTimeout(() => {
                setCoreState((current) => current === 'query' ? 'idle' : current);
            }, 1800);
        }
    };

    const activeConfig = statesConfig.find(s => s.id === coreState) || statesConfig[0];

    return (
        <section id="core" ref={sectionRef} className="py-32 border-t border-white/5 bg-black/90 relative overflow-hidden">
            {/* Background grids */}
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div ref={headingRef} className="max-w-2xl mb-20">
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Signature WOW Moment</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-2">
                        Interactive Intelligence Core
                    </h2>
                    <p className="text-gray-400 mt-4 text-base">
                        An interactive 3D manifestation of Xai's semantic engine. Manipulate vector geometry states in real-time, simulating queries, compression routines, and threats.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left Column: Controls */}
                    <div ref={controlsRef} className="lg:col-span-5 space-y-6">
                        <div className="glass rounded-3xl p-6 border border-white/5 space-y-6">
                            <span className="text-xs font-mono text-gray-500 block uppercase tracking-wider">// System State Controller</span>

                            <div className="flex flex-col gap-3">
                                {statesConfig.map((state) => {
                                    const Icon = state.icon;
                                    const isActive = coreState === state.id;
                                    return (
                                        <button
                                            key={state.id}
                                            onClick={() => handleStateClick(state.id)}
                                            className={`px-4 py-3.5 rounded-2xl border text-xs font-medium flex items-center justify-between text-left transition-all cursor-pointer ${isActive
                                                    ? activeBtnStyles[state.id]
                                                    : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                                                <span>{state.label}</span>
                                            </div>
                                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Interactive Heuristic / Math Breakdown */}
                        <div className="glass rounded-3xl p-6 border border-white/5 text-left space-y-4">
                            <div className="flex items-center gap-2 text-xs font-semibold text-white">
                                <Info className="w-4 h-4 text-purple-400" />
                                <span>Mathematical Transformation Blueprint</span>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    {activeConfig.description}
                                </p>

                                <div className="bg-black/60 rounded-xl p-3 border border-white/5 font-mono text-[10px] text-purple-300">
                                    <span className="text-gray-500 block mb-1">// Active Function mapping:</span>
                                    <code>{activeConfig.mathLabel}</code>
                                </div>
                            </div>
                        </div>

                        {/* Kernel Log Stream output */}
                        <div className="bg-black border border-white/5 rounded-2xl p-4 font-mono text-[9px] text-gray-500 text-left h-[72px] overflow-hidden flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={coreState}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="space-y-1"
                                >
                                    <p className="text-gray-400">{activeConfig.logText}</p>
                                    {mounted && (
                                        <p className="text-[8px] text-gray-600">Timestamp: {new Date().toISOString()}</p>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column: 3D Core Viewport */}
                    <div ref={viewportRef} className="lg:col-span-7">
                        <div className="w-full h-[520px] rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden relative shadow-2xl">

                            {/* Inner Viewport borders */}
                            <div className="absolute inset-x-6 top-6 flex items-center justify-between pointer-events-none z-20">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">CORE VIEWPORT</span>
                                </div>
                                <span className="text-[10px] font-mono text-gray-600">3D_RENDERER_ACTIVE</span>
                            </div>

                            {/* Accent Glow Backdrops */}
                            <div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] opacity-10 pointer-events-none transition-all duration-700"
                                style={{ backgroundColor: activeConfig.themeHex }}
                            />

                            {/* Render the actual ThreeJS Canvas */}
                            <CoreCanvas coreState={coreState} />

                            {/* Footer corner hints */}
                            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between pointer-events-none z-10 text-[9px] font-mono text-gray-600">
                                <span>MOUSE_DRAG_TO_ROTATE</span>
                                <span>FOV: 45 / DIST: LERPED</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
