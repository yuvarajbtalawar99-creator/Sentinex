import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle2, XCircle, Shield, ToggleLeft, ToggleRight } from "lucide-react";

export default function DataTransparency() {
    const [monitoringEnabled, setMonitoringEnabled] = useState(() => {
        const saved = localStorage.getItem("sentinex_monitoring");
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem("sentinex_monitoring", JSON.stringify(monitoringEnabled));
    }, [monitoringEnabled]);

    const analyzed = [
        "Aggregated sentiment patterns",
        "Mood score trends over time",
        "Behavioral volatility indicators",
        "Anonymous emotional distribution",
    ];

    const notAnalyzed = [
        "Private messages or chats",
        "Raw text content or keystrokes",
        "Personal identifiable information",
        "Browsing history or location data",
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-primary" />
                <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                    Data Transparency Panel
                </h3>
            </div>
            <p className="text-[8px] uppercase tracking-widest text-muted-foreground/50 font-bold mb-5">
                User-controlled monitoring • Explainable analytics
            </p>

            {/* What IS analyzed */}
            <div className="mb-4">
                <span className="text-[8px] font-black uppercase tracking-widest text-success mb-2 block">
                    ✅ What We Analyze
                </span>
                <div className="space-y-1.5">
                    {analyzed.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* What is NOT analyzed */}
            <div className="mb-5">
                <span className="text-[8px] font-black uppercase tracking-widest text-destructive mb-2 block">
                    ❌ What We Never Analyze
                </span>
                <div className="space-y-1.5">
                    {notAnalyzed.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground/60">
                            <XCircle className="w-3 h-3 text-destructive/50 shrink-0" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Monitoring Toggle */}
            <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest">Emotional Monitoring</p>
                        <p className="text-[7px] uppercase tracking-widest text-muted-foreground/50 font-bold">
                            Opt-out by design • Disable anytime
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setMonitoringEnabled(!monitoringEnabled)}
                    className="transition-all hover:scale-105"
                    aria-label="Toggle monitoring"
                >
                    {monitoringEnabled ? (
                        <ToggleRight className="w-8 h-8 text-success" />
                    ) : (
                        <ToggleLeft className="w-8 h-8 text-muted-foreground/40" />
                    )}
                </button>
            </div>

            {!monitoringEnabled && (
                <div className="mt-3 p-2 rounded-lg bg-warning/5 border border-warning/10 text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-warning">
                        Monitoring paused — no data is being collected
                    </p>
                </div>
            )}
        </div>
    );
}
