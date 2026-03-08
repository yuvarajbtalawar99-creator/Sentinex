import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Info, AlertCircle, Lightbulb } from "lucide-react";
import { dashboard } from "@/lib/api";

const alertIcons: Record<string, any> = {
  warning: AlertTriangle,
  info: Info,
  error: AlertCircle,
};

const alertStyles: Record<string, string> = {
  warning: "border-warning/30 bg-warning/5",
  info: "border-info/30 bg-info/5",
  error: "border-destructive/30 bg-destructive/5",
};

const alertIconColors: Record<string, string> = {
  warning: "text-warning",
  info: "text-info",
  error: "text-destructive",
};

export default function RiskAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [interventionLevel, setInterventionLevel] = useState<string>("MINIMAL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboard.risk();
        setAlerts(res.data.alerts || []);
        setRecommendations(res.data.recommendations || []);
        setInterventionLevel(res.data.interventionLevel || "MINIMAL");
      } catch (err) {
        console.error("[RiskAlerts] Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-6">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">Risk Support System</h3>
        <p className="text-xs text-muted-foreground animate-pulse">Analyzing stability patterns...</p>
      </div>
    );
  }

  const levelColors: Record<string, string> = {
    CRITICAL: "text-destructive",
    MODERATE: "text-warning",
    MINIMAL: "text-success",
  };

  return (
    <div className="space-y-4">
      {/* Alerts */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground">Risk Alerts</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-current ${levelColors[interventionLevel] || levelColors.MINIMAL}`}>
            {interventionLevel} SUPPORT
          </span>
        </div>
        {alerts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No risk alerts at this time.</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, i) => {
              const Icon = alertIcons[alert.type] || Info;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${alertStyles[alert.type] || alertStyles.info}`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alertIconColors[alert.type] || alertIconColors.info}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Structured Recommendations */}
      {recommendations.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">Professional Guidance</h3>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-4 rounded-lg bg-primary/5 border border-primary/10"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-primary">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-primary/50">{rec.type}</span>
                      {rec.actionLabel && (
                        <button className="text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition-colors">
                          {rec.actionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
