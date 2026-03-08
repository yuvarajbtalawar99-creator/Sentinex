import { useState, useEffect } from "react";
import { BarChart3, TrendingDown, Users, Heart, Zap } from "lucide-react";
import { corporate } from "@/lib/api";

export default function ImpactModeling() {
    const [impactData, setImpactData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImpact = async () => {
            try {
                const res = await corporate.impact();
                setImpactData(res.data);
            } catch (err) {
                console.error("[ImpactModeling] Failed to fetch live impact data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchImpact();
    }, []);

    if (loading) {
        return (
            <div className="glass-card p-6 animate-pulse">
                <div className="h-4 w-32 bg-primary/10 rounded mb-4" />
                <div className="space-y-4">
                    <div className="h-10 bg-white/5 rounded" />
                    <div className="h-10 bg-white/5 rounded" />
                </div>
            </div>
        );
    }

    const metrics = impactData?.metrics || [
        { label: "Potential Burnouts Prevented", value: "12", trend: "Annual Est" },
        { label: "Productivity Optimization", value: "8%", trend: "Projected" },
        { label: "Estimated Retention Impact", value: "Significant", trend: "Long-term" }
    ];

    return (
        <div className="glass-card p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-24 h-24 text-primary" />
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <div>
                        <h3 className="font-display text-sm font-bold">Organizational Impact Modeling</h3>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                            ROI & Behavioral Outcomes
                        </p>
                    </div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary">AI PROJECTIONS</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {metrics.map((metric: any) => (
                    <div key={metric.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-colors">
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">{metric.label}</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-black font-display text-primary">{metric.value}</span>
                            <span className="text-[8px] font-bold text-success/70 uppercase">{metric.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${impactData?.burnoutRiskProfile === 'HIGH' ? 'bg-destructive' : 'bg-success'} animate-pulse`} />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Status: {impactData?.burnoutRiskProfile || 'STABLE'}
                    </span>
                </div>
                <p className="text-[9px] text-muted-foreground/50 italic max-w-md text-right">
                    {impactData?.disclaimer || "Model-based projections for enterprise planning."}
                </p>
            </div>
        </div>
    );
}
