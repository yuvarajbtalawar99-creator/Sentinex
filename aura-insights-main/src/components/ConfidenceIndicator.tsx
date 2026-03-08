import { Gauge, TrendingUp } from "lucide-react";

interface ConfidenceIndicatorProps {
    dataPoints?: number;
    variance?: number;
}

export default function ConfidenceIndicator({ dataPoints = 30, variance = 0.3 }: ConfidenceIndicatorProps) {
    // Derive confidence from data volume and variance
    const getConfidence = (): { level: "HIGH" | "MEDIUM" | "LOW"; color: string; bgColor: string; borderColor: string; description: string } => {
        if (dataPoints >= 20 && variance < 0.5) {
            return {
                level: "HIGH",
                color: "text-success",
                bgColor: "bg-success/10",
                borderColor: "border-success/20",
                description: "Sufficient data points with stable patterns detected."
            };
        }
        if (dataPoints >= 10) {
            return {
                level: "MEDIUM",
                color: "text-warning",
                bgColor: "bg-warning/10",
                borderColor: "border-warning/20",
                description: "Building confidence — more data improves accuracy."
            };
        }
        return {
            level: "LOW",
            color: "text-destructive",
            bgColor: "bg-destructive/10",
            borderColor: "border-destructive/20",
            description: "Limited data available — predictions may have lower reliability."
        };
    };

    const confidence = getConfidence();
    const dots = [
        { label: "LOW", active: true },
        { label: "MED", active: confidence.level !== "LOW" },
        { label: "HIGH", active: confidence.level === "HIGH" },
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4 text-primary" />
                <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                    Model Confidence Indicator
                </h3>
            </div>
            <p className="text-[8px] uppercase tracking-widest text-muted-foreground/50 font-bold mb-5">
                SENTINEX communicates confidence, not certainty
            </p>

            {/* Confidence Bar */}
            <div className="flex items-center gap-2 mb-4">
                {dots.map((dot, i) => (
                    <div key={i} className="flex-1">
                        <div className={`h-2 rounded-full transition-all duration-700 ${dot.active
                                ? confidence.level === "HIGH" ? "bg-success" : confidence.level === "MEDIUM" ? "bg-warning" : "bg-destructive"
                                : "bg-white/5"
                            }`} />
                        <p className={`text-center text-[7px] font-black uppercase tracking-widest mt-1 ${dot.active ? confidence.color : "text-muted-foreground/20"
                            }`}>{dot.label}</p>
                    </div>
                ))}
            </div>

            {/* Confidence Badge */}
            <div className={`p-3 rounded-xl border ${confidence.bgColor} ${confidence.borderColor} flex items-center gap-3`}>
                <div className={`w-3 h-3 rounded-full ${confidence.color.replace("text-", "bg-")} animate-pulse`} />
                <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${confidence.color}`}>
                        {confidence.level} Confidence
                    </p>
                    <p className="text-[8px] text-muted-foreground/60 font-bold mt-0.5">
                        {confidence.description}
                    </p>
                </div>
            </div>

            {/* Data Quality */}
            <div className="mt-4 flex items-center justify-between text-[8px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {dataPoints} data points analyzed
                </div>
                <span>Variance: {(variance * 100).toFixed(0)}%</span>
            </div>
        </div>
    );
}
