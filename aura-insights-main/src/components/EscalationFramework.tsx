import { Shield, Heart, Phone, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

interface EscalationFrameworkProps {
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

const levels = [
    {
        level: 1,
        title: "AI Support",
        trigger: "LOW",
        icon: CheckCircle2,
        color: "text-success",
        borderColor: "border-success/20",
        bgColor: "bg-success/5",
        glowColor: "shadow-[0_0_15px_rgba(34,197,94,0.1)]",
        actions: [
            "Personalized coping suggestions",
            "Micro-interventions (breaks, reframing)",
            "Guided breathing exercises",
        ],
    },
    {
        level: 2,
        title: "Human Recommendation",
        trigger: "MEDIUM",
        icon: Heart,
        color: "text-warning",
        borderColor: "border-warning/20",
        bgColor: "bg-warning/5",
        glowColor: "shadow-[0_0_15px_rgba(234,179,8,0.1)]",
        actions: [
            "Counselor / HR wellness referral",
            "No automatic alert — user consent preserved",
            "Scheduled wellness check-in prompt",
        ],
    },
    {
        level: 3,
        title: "Crisis Safeguard",
        trigger: "HIGH",
        icon: Phone,
        color: "text-destructive",
        borderColor: "border-destructive/20",
        bgColor: "bg-destructive/5",
        glowColor: "shadow-[0_0_15px_rgba(239,68,68,0.1)]",
        actions: [
            "Crisis resources & helpline access",
            "Optional pre-approved emergency contact",
            "Triggered only at critical thresholds",
        ],
    },
];

const riskToLevel: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };

export default function EscalationFramework({ riskLevel }: EscalationFrameworkProps) {
    const activeLevel = riskToLevel[riskLevel] || 1;

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-primary" />
                        <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                            Structured Escalation Framework
                        </h3>
                    </div>
                    <p className="text-[8px] uppercase tracking-widest text-muted-foreground/50 font-bold">
                        Ethical intervention protocol • Consent-driven
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${riskLevel === "HIGH" ? "bg-destructive/10 border-destructive/30 text-destructive" :
                        riskLevel === "MEDIUM" ? "bg-warning/10 border-warning/30 text-warning" :
                            "bg-success/10 border-success/30 text-success"
                    }`}>
                    Level {activeLevel} Active
                </div>
            </div>

            <div className="space-y-3">
                {levels.map((lvl) => {
                    const isActive = lvl.level <= activeLevel;
                    const isCurrent = lvl.level === activeLevel;
                    const Icon = lvl.icon;

                    return (
                        <div
                            key={lvl.level}
                            className={`relative p-4 rounded-xl border transition-all duration-500 ${isCurrent
                                    ? `${lvl.bgColor} ${lvl.borderColor} ${lvl.glowColor}`
                                    : isActive
                                        ? `${lvl.bgColor} ${lvl.borderColor} opacity-60`
                                        : "bg-white/[0.01] border-white/5 opacity-30"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCurrent ? lvl.bgColor : "bg-white/5"
                                    } border ${isCurrent ? lvl.borderColor : "border-white/5"}`}>
                                    <Icon className={`w-5 h-5 ${isCurrent ? lvl.color : "text-muted-foreground/40"}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${isCurrent ? lvl.color : "text-muted-foreground/40"}`}>
                                            Level {lvl.level}
                                        </span>
                                        <ArrowRight className={`w-3 h-3 ${isCurrent ? lvl.color : "text-muted-foreground/20"}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${isCurrent ? "text-white" : "text-muted-foreground/40"}`}>
                                            {lvl.title}
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {lvl.actions.map((action, i) => (
                                            <div key={i} className={`flex items-center gap-2 text-[9px] font-bold ${isCurrent ? "text-muted-foreground" : "text-muted-foreground/30"
                                                }`}>
                                                <div className={`w-1 h-1 rounded-full ${isCurrent ? lvl.color.replace("text-", "bg-") : "bg-white/10"}`} />
                                                {action}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
