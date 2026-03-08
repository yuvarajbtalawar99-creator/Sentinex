import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AIInsightPanel = () => {
    const [insights, setInsights] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const token = localStorage.getItem('sentinex_token');
                const response = await fetch('http://localhost:5000/api/dashboard/insights', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setInsights(data);
            } catch (error) {
                console.error('Failed to fetch insights:', error);
                setInsights(["Collecting baseline data for neural insight generation..."]);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground text-primary/80">Neural Insight Engine</h3>
                </div>
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        [1, 2].map(i => (
                            <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg" />
                        ))
                    ) : (
                        insights.map((insight, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group flex gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/20 transition-all cursor-default"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                <div className="flex-1">
                                    <p className="text-[11px] font-bold text-foreground leading-relaxed uppercase tracking-tight">
                                        {insight}
                                    </p>
                                </div>
                                <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Persistence Status: NOMINAL</p>
                <button className="text-[8px] font-black text-primary uppercase tracking-widest hover:underline transition-all">
                    View Full Report
                </button>
            </div>
        </div>
    );
};
