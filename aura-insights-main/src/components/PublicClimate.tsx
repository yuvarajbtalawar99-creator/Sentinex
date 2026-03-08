import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { LayoutGrid, Globe2 } from 'lucide-react';

const demoData = [
    { hour: '08:00', stress: 30, mood: 80 },
    { hour: '10:00', stress: 45, mood: 75 },
    { hour: '12:00', stress: 60, mood: 65 },
    { hour: '14:00', stress: 55, mood: 70 },
    { hour: '16:00', stress: 65, mood: 60 },
    { hour: '18:00', stress: 40, mood: 75 },
    { hour: '20:00', stress: 25, mood: 85 },
];

export const PublicClimate = () => {
    return (
        <div className="glass-card p-6 border-primary/10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-primary" />
                    <div>
                        <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground">Public Emotional Trend</h3>
                        <p className="text-[8px] text-primary/60 font-black uppercase tracking-[0.2em] leading-none">Demo Environment • 2.4k Data Points</p>
                    </div>
                </div>
                <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase">
                    Live Vision
                </div>
            </div>

            <div className="h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demoData}>
                        <XAxis dataKey="hour" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '10px' }}
                            itemStyle={{ fontSize: '10px', color: '#fff' }}
                        />
                        <Bar dataKey="stress" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} className="opacity-40" />
                        <Bar dataKey="mood" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} className="opacity-80 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>Campus Average Stability</span>
                    <span className="text-primary">74%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '74%' }}
                        className="h-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                    />
                </div>
                <p className="text-[9px] text-muted-foreground/60 leading-relaxed font-medium mt-2">
                    "SENTINEX detects patterns in campus-wide emotional data that humans cannot notice early. Aggregation ensures 100% individual anonymity."
                </p>
            </div>
        </div>
    );
};
