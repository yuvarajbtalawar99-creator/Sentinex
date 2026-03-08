import { Sparkles, TrendingUp, Shield } from "lucide-react";

interface ResilienceScoreProps {
    stressScore?: number;
}

export default function ResilienceScore({ stressScore = 0.5 }: ResilienceScoreProps) {
    // Resilience is inversely related to stress, with a positive framing
    const resilience = Math.round(Math.max(0, Math.min(100, (1 - stressScore) * 100)));

    const getLevel = () => {
        if (resilience >= 70) return { label: "Strong", color: "text-success", ring: "stroke-success" };
        if (resilience >= 40) return { label: "Building", color: "text-warning", ring: "stroke-warning" };
        return { label: "Developing", color: "text-accent", ring: "stroke-accent" };
    };

    const level = getLevel();
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (resilience / 100) * circumference;

    const subMetrics = [
        { label: "Coping Capacity", value: Math.min(100, resilience + Math.floor(Math.random() * 10)), trend: "+3%" },
        { label: "Recovery Strength", value: Math.min(100, resilience + Math.floor(Math.random() * 8 - 2)), trend: "+5%" },
        { label: "Growth Trend", value: Math.min(100, resilience + Math.floor(Math.random() * 5)), trend: "+2%" },
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                    Emotional Resilience Score
                </h3>
            </div>
            <p className="text-[8px] uppercase tracking-widest text-muted-foreground/50 font-bold mb-5">
                Not a surveillance tool — a growth tool
            </p>

            {/* Circular Gauge */}
            <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(222, 30%, 15%)" strokeWidth="6" />
                        <circle
                            cx="50" cy="50" r="42"
                            fill="none"
                            className={level.ring}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-display text-2xl font-black">{resilience}</span>
                        <span className={`text-[7px] font-black uppercase tracking-widest ${level.color}`}>{level.label}</span>
                    </div>
                </div>

                {/* Sub-metrics */}
                <div className="flex-1 space-y-3">
                    {subMetrics.map((m) => (
                        <div key={m.label}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{m.label}</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-black">{m.value}%</span>
                                    <span className="text-[7px] text-success font-bold">{m.trend}</span>
                                </div>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary/60 rounded-full transition-all duration-1000"
                                    style={{ width: `${m.value}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-[7px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                <Shield className="w-3 h-3" />
                Positive framing • Empowerment-driven analytics
            </div>
        </div>
    );
}
