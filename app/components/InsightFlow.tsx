// import React from 'react';

// export default function InsightFlow() {
//     return (
//         <div>
//             <h1> this is InsightFlow section</h1>
//         </div>
//     );
// };
'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Cpu, Zap, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stages = [
    {
        id: 0, step: '01', title: 'Ingest Data Streams',
        desc: 'Connect logs, relational databases, webhooks, or files. Xai ingests raw text, automatically identifies format signatures, and casts them into high-speed buffers.',
        icon: Database, color: 'cyan', colorHex: '#06b6d4'
    },
    {
        id: 1, step: '02', title: 'Analyze with Semantic AI',
        desc: 'Extract entities, classify sentiment, detect operational anomalies, and generate vector embeddings on the fly. The engine routes payloads dynamically based on semantic context.',
        icon: Cpu, color: 'purple', colorHex: '#8b5cf6'
    },
    {
        id: 2, step: '03', title: 'Trigger AI Automations',
        desc: 'Deploy autonomous actions: send filtered alerts, write synthesized summaries directly back to databases, or trigger external API webhooks without writing boilerplate code.',
        icon: Zap, color: 'emerald', colorHex: '#10b981'
    }
];

const stageIconStyles: Record<string, string> = {
    cyan: 'bg-black border-cyan-500/30    text-cyan-400    shadow-[0_0_15px_rgba(6,182,212,0.12)]',
    purple: 'bg-black border-purple-500/30  text-purple-400  shadow-[0_0_15px_rgba(139,92,246,0.12)]',
    emerald: 'bg-black border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.12)]',
};

export default function InsightFlow() {
    const [activeStage, setActiveStage] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

    // ── GSAP ScrollTrigger: pin the section and drive stage changes ─────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading entrance
            gsap.from(headingRef.current, {
                opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: headingRef.current, start: 'top 85%' }
            });

            // Stagger in stage cards
            stageRefs.current.forEach((el, i) => {
                if (!el) return;
                gsap.from(el, {
                    opacity: 0, x: -30, duration: 0.6, delay: i * 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' }
                });
            });

            // ScrollTrigger that drives active stage from scroll position
            if (sectionRef.current) {
                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: 'top 40%',
                    end: 'bottom 60%',
                    onUpdate: (self) => {
                        const p = self.progress;
                        if (p < 0.33) setActiveStage(0);
                        else if (p < 0.66) setActiveStage(1);
                        else setActiveStage(2);
                    }
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="flow"
            ref={sectionRef}
            className="relative min-h-[200vh] bg-black/80 py-32 border-t border-white/5"
        >
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Heading */}
                <div ref={headingRef} className="max-w-2xl mb-24">
                    <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Process Pipeline</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-2">
                        How Data Becomes<br />Actionable Intelligence
                    </h2>
                    <p className="text-gray-400 mt-4 text-base">
                        Watch how the workspace processes unstructured events, layers semantic reasoning over it, and routes decisions autonomously.
                    </p>
                </div>

                {/* 2-Column Sticky Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* Left: Timeline Steps */}
                    <div className="lg:col-span-5 space-y-12">
                        {stages.map((stage, i) => {
                            const isActive = activeStage === stage.id;
                            const IconComponent = stage.icon;
                            return (
                                <div
                                    key={stage.id}
                                    ref={el => { stageRefs.current[i] = el; }}
                                    onClick={() => setActiveStage(stage.id)}
                                    className={`group flex gap-6 cursor-pointer text-left transition-all duration-500 relative py-3 pl-5 rounded-2xl border border-transparent ${isActive
                                            ? 'bg-white/[0.025] border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                                            : 'opacity-35 hover:opacity-60'
                                        }`}
                                >
                                    {/* Active glow bar */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTimelineGlow"
                                            className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                                            style={{
                                                backgroundColor: stage.colorHex,
                                                boxShadow: `0 0 10px ${stage.colorHex}`
                                            }}
                                        />
                                    )}

                                    <div className="flex-shrink-0">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${isActive ? stageIconStyles[stage.color] : 'bg-white/5 border-white/10 text-gray-400'
                                            }`}>
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-xs font-mono text-gray-500 block mb-1">STAGE {stage.step}</span>
                                        <h3 className="text-xl font-semibold text-white mb-2">{stage.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{stage.desc}</p>

                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="mt-3 flex items-center gap-1 text-xs font-mono text-cyan-400"
                                            >
                                                <span>Active Step</span>
                                                <ArrowRight className="w-3 h-3 animate-pulse" />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Sticky Live Visual */}
                    <div className="lg:col-span-7 sticky top-24">
                        <div className="w-full h-[480px] rounded-3xl border border-white/5 bg-black/60 backdrop-blur-md overflow-hidden relative shadow-2xl">
                            {/* Accent glow */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[80px] opacity-15 pointer-events-none transition-all duration-700"
                                style={{ backgroundColor: stages[activeStage].colorHex }}
                            />
                            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                            {/* Header bar */}
                            <div className="w-full border-b border-white/5 px-6 py-4 flex items-center justify-between bg-black/40">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Live Pipeline Monitor</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                </div>
                            </div>

                            {/* Stage Visuals */}
                            <div className="p-8 h-[calc(100%-60px)] relative overflow-hidden flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    {activeStage === 0 && <StageIngestVisual key="ingest" />}
                                    {activeStage === 1 && <StageAnalyzeVisual key="analyze" />}
                                    {activeStage === 2 && <StageGenerateVisual key="generate" />}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── Stage 1: Ingest ─────────────────────────────────────────────────────── */
function StageIngestVisual() {
    const rawLogs = [
        '192.168.1.18 [08/Jul 19:50:11] "POST /api/webhook" 200 payload_len=1420',
        'database_user_actions -> INSERT INTO transactions (id, user_id, amount) VALUES (982, 110, 250.0)',
        'auth-service-stdout: { "event": "user.login_success", "user_id": "usr_9901b", "ip": "102.14.99.1" }',
        'cloudflare_waf_event BLOCK ip=182.112.5.4 country=CN rule=sql_injection',
    ];

    const parsedOutput = [
        { source: 'http_server', client_ip: '192.168.1.18', endpoint: '/api/webhook', status: 200, payload_bytes: 1420 },
        { source: 'postgres_audit', table: 'transactions', action: 'INSERT', inserted_id: 982, amount_usd: 250.0 },
        { source: 'auth-service', event: 'user.login_success', account_id: 'usr_9901b', origin_ip: '102.14.99.1' },
        { source: 'cloudflare_waf', action: 'BLOCK', attacker_ip: '182.112.5.4', violation: 'sql_injection' },
    ];

    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setIdx(p => (p + 1) % rawLogs.length), 3000);
        return () => clearInterval(t);
    }, [rawLogs.length]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col justify-between"
        >
            <div className="text-left font-mono text-xs text-cyan-400 mb-2">// Raw Ingest Log Buffer</div>

            <div className="flex-1 grid grid-cols-2 gap-3 items-center">
                {/* Input buffer */}
                <div className="flex flex-col gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-2xl h-[240px] overflow-hidden relative">
                    <div className="absolute top-2 right-3 text-[9px] font-mono text-gray-600">INPUT BUFFER</div>
                    <div className="space-y-2 mt-4">
                        {rawLogs.map((log, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    opacity: i === idx ? 1 : 0.2,
                                    x: i === idx ? 3 : 0,
                                    borderColor: i === idx ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.05)'
                                }}
                                className="p-1.5 border rounded text-[9px] font-mono text-gray-300 truncate bg-black/40"
                            >{log}</motion.div>
                        ))}
                    </div>
                </div>

                {/* Parsed output */}
                <div className="flex flex-col p-3 bg-white/[0.02] border border-white/5 rounded-2xl h-[240px] overflow-hidden relative">
                    <div className="absolute top-2 right-3 text-[9px] font-mono text-gray-600">SCHEMATIC CAST</div>
                    <div className="flex-1 flex items-center justify-center font-mono text-[10px] text-cyan-300 mt-4">
                        <AnimatePresence mode="wait">
                            <motion.pre
                                key={idx}
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="w-full text-left bg-black/60 p-3 rounded-xl border border-cyan-500/10 leading-relaxed"
                            >
                                {JSON.stringify(parsedOutput[idx], null, 2)}
                            </motion.pre>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-[9px] font-mono text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Auto-indexing 4 schemas • Telemetry rate 24.2k eps</span>
            </div>
        </motion.div>
    );
}

/* ── Stage 2: Analyze ────────────────────────────────────────────────────── */
function StageAnalyzeVisual() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col justify-between text-left font-mono"
        >
            <div className="text-xs text-purple-400 mb-2">// Semantic Embedding & Classification</div>

            <div className="flex-1 relative flex items-center justify-center bg-black/40 rounded-2xl border border-white/5 p-4 overflow-hidden">
                <svg className="w-full h-full max-h-[220px]" viewBox="0 0 400 200">
                    <g stroke="rgba(139,92,246,0.2)" strokeWidth="1.5">
                        <line x1="40" y1="100" x2="130" y2="50" /><line x1="40" y1="100" x2="130" y2="100" /><line x1="40" y1="100" x2="130" y2="150" />
                        <line x1="130" y1="50" x2="250" y2="50" /><line x1="130" y1="50" x2="250" y2="100" />
                        <line x1="130" y1="100" x2="250" y2="50" /><line x1="130" y1="100" x2="250" y2="150" />
                        <line x1="130" y1="150" x2="250" y2="100" /><line x1="130" y1="150" x2="250" y2="150" />
                        <line x1="250" y1="50" x2="340" y2="100" /><line x1="250" y1="100" x2="340" y2="100" /><line x1="250" y1="150" x2="340" y2="100" />
                    </g>
                    <g>
                        <circle r="4" fill="#a855f7">
                            <animateMotion path="M 40 100 L 130 50 L 250 100 L 340 100" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle r="4" fill="#06b6d4">
                            <animateMotion path="M 40 100 L 130 150 L 250 150 L 340 100" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
                        </circle>
                        <circle r="3" fill="#10b981">
                            <animateMotion path="M 40 100 L 130 100 L 250 50 L 340 100" dur="3s" repeatCount="indefinite" begin="1s" />
                        </circle>
                    </g>
                    <circle cx="40" cy="100" r="8" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" className="animate-pulse" />
                    <circle cx="130" cy="50" r="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
                    <circle cx="130" cy="100" r="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
                    <circle cx="130" cy="150" r="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5" />
                    <circle cx="250" cy="50" r="6" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />
                    <circle cx="250" cy="100" r="6" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />
                    <circle cx="250" cy="150" r="6" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />
                    <circle cx="340" cy="100" r="10" fill="#2e1065" stroke="#c084fc" strokeWidth="2" />
                    <text x="32" y="86" fill="#9ca3af" fontSize="7" fontFamily="monospace">RAW</text>
                    <text x="112" y="37" fill="#9ca3af" fontSize="7" fontFamily="monospace">TOKENIZE</text>
                    <text x="238" y="37" fill="#9ca3af" fontSize="7" fontFamily="monospace">VECTOR</text>
                    <text x="316" y="83" fill="#d8b4fe" fontSize="7" fontFamily="monospace">INTEL</text>
                </svg>

                <div className="absolute bottom-3 left-4 flex gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-300">Entity: transaction_fraud</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-300">Similarity: 0.941</span>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-[9px] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Running Llama-3-Embed 768d • Latency = 8.1ms</span>
            </div>
        </motion.div>
    );
}

/* ── Stage 3: Generate ───────────────────────────────────────────────────── */
function StageGenerateVisual() {
    const [step, setStep] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setStep(p => (p + 1) % 4), 2000);
        return () => clearInterval(t);
    }, []);

    const logs = [
        '[Trigger] High transaction amount ($250) flagged in cloud logs',
        '[Agent] Evaluation: Verified usr_9901b IP discrepancy – country: CN',
        '[Action] Dispatching emergency Slack alert & DB rollback',
        '[Compliance] Transaction BLOCKED, notification delivered',
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col justify-between text-left font-mono"
        >
            <div className="text-xs text-emerald-400 mb-2">// Active Integration & Actions</div>

            <div className="flex-1 flex flex-col justify-center gap-4 bg-black/40 rounded-2xl border border-white/5 p-6 relative">
                <div className="absolute top-1/2 left-16 right-16 h-[1px] border-t border-dashed border-white/10 -translate-y-1/2 pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                    {[
                        { icon: AlertTriangle, label: 'Anomaly', color: step >= 0, activeClass: 'bg-amber-950/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]' },
                        { icon: Cpu, label: 'Xai Agent', color: step >= 1, activeClass: 'bg-indigo-950/20 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]' },
                        { icon: CheckCircle2, label: 'Action', color: step >= 2, activeClass: 'bg-emerald-950/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
                    ].map(({ icon: Icon, label, color, activeClass }, i) => (
                        <React.Fragment key={i}>
                            <div className="flex flex-col items-center">
                                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${color ? activeClass : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-[9px] text-gray-400 mt-2">{label}</span>
                            </div>
                            {i < 2 && (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden relative">
                                        {step >= i + 1 && (
                                            <motion.div
                                                initial={{ left: '-100%' }} animate={{ left: '100%' }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                                className={`absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent ${i === 0 ? 'via-cyan-400' : 'via-emerald-400'} to-transparent`}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="h-10 text-[9px] font-mono text-gray-500 text-center bg-black/30 p-2 rounded-lg border border-white/5 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.span key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {logs[step]}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-[9px] text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Automations: 12 integrations online • Slack, Datadog, Webhook, Postgres</span>
            </div>
        </motion.div>
    );
}
