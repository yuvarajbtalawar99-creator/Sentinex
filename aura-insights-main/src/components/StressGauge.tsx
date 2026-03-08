import { motion } from "framer-motion";

interface StressGaugeProps {
  value: number; // 0-1
  label: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

export default function StressGauge({ value, label, riskLevel }: StressGaugeProps) {
  const angle = value * 180;
  const riskColors = {
    LOW: "text-success glow-text-primary",
    MEDIUM: "text-warning",
    HIGH: "text-destructive glow-text-destructive",
  };

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">{label}</h3>

      <div className="relative w-48 h-24 overflow-hidden">
        {/* Background arc */}
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--success))" />
              <stop offset="50%" stopColor="hsl(var(--warning))" />
              <stop offset="100%" stopColor="hsl(var(--destructive))" />
            </linearGradient>
          </defs>
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <motion.path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 * (1 - value) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          style={{ width: 2, height: 70 }}
          initial={{ rotate: -90 }}
          animate={{ rotate: -90 + angle }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="w-0.5 h-full bg-gradient-to-t from-primary to-transparent rounded-full" />
        </motion.div>

        {/* Center dot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-primary glow-primary" />
      </div>

      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <span className={`font-display text-3xl font-bold ${riskColors[riskLevel]}`}>
          {value.toFixed(2)}
        </span>
        <span className={`ml-2 font-display text-lg font-bold ${riskColors[riskLevel]}`}>
          {riskLevel}
        </span>
      </motion.div>
    </div>
  );
}
