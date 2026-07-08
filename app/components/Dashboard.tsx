// import React from 'react';

// export default function Dashboard() {
//     return (
//         <div>
//             <h1> this is dashboard section</h1>
//         </div>
//     );
// };


'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Users, TrendingUp, Settings } from 'lucide-react';

const tabs = ['Overview', 'Insights', 'Automations'];

export default function DashboardPreview() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="py-20 border-t border-white/10 bg-black/40">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-5xl font-bold">Intelligence Dashboard</h2>
                        <p className="text-gray-400 mt-3">Real product interface preview</p>
                    </div>
                </div>

                <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    {/* Sidebar */}
                    <div className="flex h-[720px]">
                        <div className="w-72 border-r border-white/10 p-6 flex flex-col">
                            <div className="flex items-center gap-3 mb-12">
                                <div className="w-9 h-9 bg-cyan-500 rounded-xl" />
                                <span className="font-semibold text-2xl tracking-tight">Xai</span>
                            </div>

                            <nav className="space-y-2">
                                {['Workspace', 'Data Sources', 'Insights', 'Automations', 'Team'].map((item, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-2xl flex items-center gap-3 cursor-pointer ${i === 0 ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                                        {i === 0 && <BarChart3 />}
                                        {item}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-8 overflow-auto">
                            <div className="flex gap-3 mb-10 border-b border-white/10 pb-6">
                                {tabs.map((tab, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveTab(i)}
                                        className={`px-8 py-3 rounded-2xl transition-all ${activeTab === i ? 'bg-white text-black font-medium' : 'hover:bg-white/10'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 0 && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                    >
                                        <div className="bg-white/5 rounded-3xl p-8 h-96 flex items-center justify-center">
                                            <div className="text-center">
                                                <TrendingUp className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                                                <p className="text-4xl font-mono">+42%</p>
                                                <p className="text-gray-400">Efficiency Gain</p>
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="glass p-6 rounded-3xl">Key Insight: Q3 pipeline velocity increased 3.2×</div>
                                            <div className="glass p-6 rounded-3xl">Automated report generated for 14 stakeholders</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}