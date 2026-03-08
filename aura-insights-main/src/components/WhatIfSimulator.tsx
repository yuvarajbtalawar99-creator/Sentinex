import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Calculator, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export const WhatIfSimulator = () => {
    const [moodDrop, setMoodDrop] = useState(2);
    const [currentBurnout, setCurrentBurnout] = useState(24);
    const [simulatedBurnout, setSimulatedBurnout] = useState(24);

    const runSimulation = () => {
        // Simple logic: Each point of mood drop adds ~15% to burnout probability
        const result = Math.min(100, Math.round(currentBurnout + (moodDrop * 15)));
        setSimulatedBurnout(result);
    };

    const resetSimulation = () => {
        setSimulatedBurnout(currentBurnout);
        setMoodDrop(2);
    };

    return (
        <div className="glass-card p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-purple-500/50" />

            <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-4 h-4 text-primary" />
                <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground">Neuro-Risk Simulator</h3>
            </div>

            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-8 leading-relaxed">
                Model future outcomes by simulating emotional volatility.
            </p>

            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-primary/80">Simulate Daily Mood Drop</span>
                        <span className="text-xs font-black text-primary">-{moodDrop} Points</span>
                    </div>
                    <Slider
                        value={[moodDrop]}
                        onValueChange={(v) => setMoodDrop(v[0])}
                        max={5}
                        step={0.5}
                        className="py-4"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Baseline Risk</p>
                        <p className="text-xl font-black">{currentBurnout}%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1">
                            <Zap className="w-2 h-2 text-primary animate-pulse" />
                        </div>
                        <p className="text-[8px] font-black text-primary uppercase mb-1">Simulated Result</p>
                        <p className={`text-xl font-black ${simulatedBurnout > 60 ? 'text-destructive' : 'text-primary'}`}>
                            {simulatedBurnout}%
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={runSimulation}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-[10px] hover:bg-primary/80 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    >
                        <Play className="w-3 h-3 fill-current" />
                        Run Processor
                    </button>
                    <button
                        onClick={resetSimulation}
                        className="w-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                        <RotateCcw className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            <p className="mt-8 text-[7px] text-muted-foreground/40 font-black uppercase tracking-widest text-center leading-relaxed">
                "Pattern detected: Burnout accelerates non-linearly below mood critical threshold 4.0"
            </p>
        </div>
    );
};
