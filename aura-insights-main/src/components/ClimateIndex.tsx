import React from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, TrendingDown, Users } from 'lucide-react';

interface ClimateIndexProps {
    score: number; // 0-100
    delta: string; // "+2.5%"
    activeUsers: number;
}

export const ClimateIndex = ({ score = 72, delta = "+1.8%", activeUsers = 1240 }: ClimateIndexProps) => {
    const isUp = delta.startsWith('+');

    return (
        <div className="glass-card p-6 bg-primary/5 border-primary/20 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute -right-10 -bottom-10 opacity-5">
                <Globe className="w-40 h-40 text-primary" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-display text-lg font-black uppercase tracking-tighter">Emotional Climate Index</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">Global Persistence Status • Anonymous Aggregate</p>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="font-display text-5xl font-black tracking-tighter text-primary">
                            {score}
                        </span>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black tracking-tighter ${isUp ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {delta} WEEKLY
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 border-l border-white/5 pl-8">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Active Nodes</p>
                        <div className="flex items-center gap-2 text-xl font-black tracking-tight">
                            <Users className="w-4 h-4 text-primary/60" />
                            {activeUsers.toLocaleString()}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Sentiment Drift</p>
                        <p className="text-xl font-black tracking-tight text-success">NOMINAL</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Coherence Level</p>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '84%' }} />
                    </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Variance Threshold</p>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-warning" style={{ width: '32%' }} />
                    </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Prediction Trust</p>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-success" style={{ width: '92%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
