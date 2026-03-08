import { motion } from "framer-motion";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";

interface Props {
  score: number; // 0-100
  trend: "stable" | "increasing" | "decreasing";
  acceleration?: number;
}

export default function EmotionalVolatility({ score = 34, trend = "decreasing", acceleration = 0 }: Partial<Props>) {
  const level = score < 30 ? "LOW" : score < 60 ? "MODERATE" : "HIGH";
  const levelColor =
    level === "LOW" ? "text-success" : level === "MODERATE" ? "text-warning" : "text-destructive";
  const barColor =
    level === "LOW"
      ? "from-success/80 to-success/40"
      : level === "MODERATE"
        ? "from-warning/80 to-warning/40"
        : "from-destructive/80 to-destructive/40";

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
            Emotional Volatility
          </h3>
        </div>
        <span className={`text-xs font-bold uppercase ${levelColor}`}>{level}</span>
      </div>

      {/* Score bar */}
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <span className="font-display text-3xl font-bold">{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          />
        </div>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {trend === "decreasing" ? (
          <TrendingDown className="w-3.5 h-3.5 text-success" />
        ) : trend === "increasing" ? (
          <TrendingUp className="w-3.5 h-3.5 text-destructive" />
        ) : (
          <Activity className="w-3.5 h-3.5 text-primary" />
        )}
        <span>
          {trend === "decreasing"
            ? "Volatility decreasing — good stability"
            : trend === "increasing"
              ? "Volatility rising — monitor patterns"
              : "Emotionally stable this period"}
        </span>
      </div>

      {/* Acceleration Metric */}
      <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Emotional Acceleration</p>
          <p className={cn("text-xs font-bold", acceleration > 0 ? "text-destructive" : "text-success")}>
            {acceleration > 0 ? "+" : ""}{acceleration} Δ/day
          </p>
        </div>
        <div>
          <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Anomaly Detection</p>
          <p className="text-xs font-bold text-primary">NOMINAL</p>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/70 leading-relaxed pt-2">
        SENTINEX detects patterns in emotional data that humans cannot notice early. Acceleration measures the rate of mood change.
      </p>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
