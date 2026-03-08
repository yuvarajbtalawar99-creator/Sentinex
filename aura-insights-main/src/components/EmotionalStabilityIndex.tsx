import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap } from "lucide-react";

interface ESIProps {
    value: number; // 0-100
    trend?: string;
}

export const EmotionalStabilityIndex = ({ value = 75, trend = "+2.4%" }: ESIProps) => {
    const circumference = 2 * Math.PI * 80;
    const offset = circumference - (value / 100) * circumference;

    const getColor = (v: number) => {
        if (v >= 70) return "text-success stroke-success";
        if (v >= 40) return "text-warning stroke-warning";
        return "text-destructive stroke-destructive";
    };

    const status = value >= 70 ? "Stable" : value >= 40 ? "Building" : "Volatility Detected";
    const colors = getColor(value);

    return (
        <div className="glass-card overflow-hidden relative group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-24 h-24 text-primary" />
            </div>

            <div className="p-8 flex flex-col md:flex-row items-center gap-10">
                {/* Gauge */}
                <div className="relative w-48 h-48 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(var(--secondary))" strokeWidth="12" className="opacity-20" />
                        <motion.circle
                            cx="100" cy="100" r="80"
                            fill="none"
                            className={colors.split(' ')[1]}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="font-display text-5xl font-black tracking-tighter"
                        >
                            {value}
                        </motion.span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">ESI Units</span>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <Zap className="w-4 h-4 text-primary" />
                            <h2 className="font-display text-sm font-black uppercase tracking-[0.2em] text-primary">Emotional Stability Index</h2>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Persistence Metrics • Identity Verified</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <span className={cn("text-2xl font-black uppercase tracking-tighter", colors.split(' ')[0])}>
                                {status}
                            </span>
                            <span className="text-xs bg-white/5 px-2 py-0.5 rounded border border-white/5 text-success font-bold">
                                {trend}
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-xs mx-auto md:mx-0">
                            Your neural stability is currently {status.toLowerCase()}. SENTINEX detects patterns in emotional data that humans cannot notice early.
                        </p>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                        <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                            <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Weekly Delta</p>
                            <p className="text-xs font-bold text-success">+4.2</p>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                            <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Confidence</p>
                            <p className="text-xs font-bold text-primary">High</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal utility for class names
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
