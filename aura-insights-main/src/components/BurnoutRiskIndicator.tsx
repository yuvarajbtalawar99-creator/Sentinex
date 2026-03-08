import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Info, AlertTriangle } from 'lucide-react';

interface BurnoutProps {
    probability: number; // 0-100
}

export const BurnoutRiskIndicator = ({ probability = 24 }: BurnoutProps) => {
    const getLevel = (p: number) => {
        if (p >= 70) return { label: 'HIGH', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' };
        if (p >= 40) return { label: 'MEDIUM', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' };
        return { label: 'LOW', color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' };
    };

    const level = getLevel(probability);

    const getExplanation = (p: number) => {
        if (p >= 70) return "Based on high volatility and a consistent downward trend in mood synchronization.";
        if (p >= 40) return "Moderate risk detected due to fluctuating stress growth rates and irregular sleep patterns.";
        return "Minimal risk profile. Sentiment stability and neural coherence remain within optimal bounds.";
    };

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground">Burnout Risk Profile</h3>
                </div>
                <div className={`px-2 py-0.5 rounded text-[8px] font-black tracking-tighter border ${level.bg} ${level.color} ${level.border}`}>
                    INTELLIGENCE-BASED
                </div>
            </div>

            <div className="flex items-end gap-3 mb-4">
                <span className={`font-display text-4xl font-black tracking-tighter ${level.color}`}>
                    {probability}%
                </span>
                <span className={`text-xs font-black uppercase tracking-widest mb-1 ${level.color}`}>
                    {level.label} RISK
                </span>
            </div>

            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${probability}%` }}
                    className={`h-full rounded-full ${probability >= 70 ? 'bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]' : probability >= 40 ? 'bg-warning' : 'bg-success'}`}
                />
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3">
                <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Rationale</p>
                    <p className="text-[11px] text-foreground/80 leading-relaxed italic">
                        "{getExplanation(probability)}"
                    </p>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <AlertTriangle className="w-3 h-3 text-primary" />
                <p className="text-[9px] font-bold text-primary/80 uppercase tracking-tight">
                    SENTINEX detects patterns early. Consider a proactive neural reset.
                </p>
            </div>
        </div>
    );
};
