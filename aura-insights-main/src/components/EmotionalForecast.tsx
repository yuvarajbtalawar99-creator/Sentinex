import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { dashboard } from "@/lib/api";

interface ForecastDay {
  day: string;
  predicted: number;
  confidence: number;
}

export default function EmotionalForecast() {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboard.forecast();
        setForecast(res.data || []);
      } catch (err) {
        console.error("[EmotionalForecast] Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const avg = forecast.length > 0
    ? +(forecast.reduce((s, d) => s + d.predicted, 0) / forecast.length).toFixed(1)
    : 0;

  const moodColor = (v: number) =>
    v >= 7 ? "bg-success" : v >= 5 ? "bg-primary" : v >= 3 ? "bg-warning" : "bg-accent";

  if (loading) {
    return (
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider">7-Day Emotional Forecast</h3>
        </div>
        <p className="text-xs text-muted-foreground animate-pulse">Loading forecast...</p>
      </div>
    );
  }

  if (forecast.length === 0) {
    return (
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider">7-Day Emotional Forecast</h3>
        </div>
        <p className="text-xs text-muted-foreground">Not enough data to generate a forecast. Keep logging moods!</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
          7-Day Emotional Forecast
        </h3>
      </div>

      <p className="text-xs text-muted-foreground">
        AI-predicted mood trajectory based on your recent patterns.
      </p>

      <div className="space-y-2">
        {forecast.map((d, i) => (
          <motion.div
            key={d.day}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs font-medium w-8 text-muted-foreground">{d.day}</span>
            <div className="flex-1 h-3 rounded-full bg-muted/40 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.predicted * 10}%` }}
                transition={{ duration: 0.8, delay: i * 0.06 }}
                className={`h-full rounded-full ${moodColor(d.predicted)} opacity-80`}
              />
            </div>
            <span className="text-xs font-display font-semibold w-8 text-right">{d.predicted}</span>
            <span className="text-[10px] text-muted-foreground w-10 text-right">{d.confidence}%</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <span className="text-xs text-muted-foreground">Predicted Avg</span>
        <span className="font-display text-sm font-bold text-primary">{avg}/10</span>
      </div>

      <p className="text-[10px] text-muted-foreground/60">
        Confidence column shows prediction reliability. Forecasts update daily as new data arrives.
      </p>
    </div>
  );
}
