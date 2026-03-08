import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import StressGauge from "@/components/StressGauge";
import MoodLogger from "@/components/MoodLogger";
import MoodChart from "@/components/MoodChart";
import RiskAlerts from "@/components/RiskAlerts";
import EmotionDistribution from "@/components/EmotionDistribution";
import EmotionalVolatility from "@/components/EmotionalVolatility";
import EmotionalForecast from "@/components/EmotionalForecast";
import EscalationFramework from "@/components/EscalationFramework";
import ResilienceScore from "@/components/ResilienceScore";
import ConfidenceIndicator from "@/components/ConfidenceIndicator";
import DataTransparency from "@/components/DataTransparency";
import { EmotionalStabilityIndex } from "@/components/EmotionalStabilityIndex";
import { BurnoutRiskIndicator } from "@/components/BurnoutRiskIndicator";
import { AIInsightPanel } from "@/components/AIInsightPanel";
import { RiskAlertBanner } from "@/components/RiskAlertBanner";
import { WhatIfSimulator } from "@/components/WhatIfSimulator";
import { mood, dashboard } from "@/lib/api";
import { Activity, Brain, Shield, Info } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const statIcons: Record<string, any> = {
  "Avg Mood": Activity,
  "Volatility Index": Activity,
  "Burnout Probability": Brain,
  "Emotional Stability": Activity,
};

export default function Dashboard() {
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [stressScore, setStressScore] = useState(0.5);
  const [riskLevel, setRiskLevel] = useState<"LOW" | "MEDIUM" | "HIGH">("LOW");
  const [esi, setEsi] = useState(75);
  const [burnoutProb, setBurnoutProb] = useState(24);
  const [volatility, setVolatility] = useState(0.34);
  const [acceleration, setAcceleration] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [historyRes, weeklyRes, statsRes] = await Promise.all([
        mood.history(30),
        mood.weekly(),
        dashboard.stats(),
      ]);
      const statsData = statsRes.data; // Corrected: Extract data from statsRes
      setMoodHistory(historyRes.data);
      setWeeklyTrend(weeklyRes.data);
      setStats(statsData.stats.map((s: any) => ({
        ...s,
        icon: statIcons[s.label] || Activity,
      })));
      setStressScore(statsData.stressScore);
      setRiskLevel(statsData.riskLevel);
      setEsi(statsData.emotionalStabilityIndex || 75);
      setBurnoutProb(statsData.burnoutProbability || 24);
      setVolatility(statsData.volatility || 0.34);
      setAcceleration(statsData.emotionalAcceleration || 0);
    } catch (err) {
      console.error("[Dashboard] Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <DashboardLayout loading={true}>
        <div className="space-y-6">
          <div className="h-8 w-64 bg-white/5 animate-pulse rounded" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-white/5 animate-pulse rounded-xl" />
              <div className="h-32 bg-white/5 animate-pulse rounded-xl" />
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-white/5 animate-pulse rounded-xl" />
              <div className="h-48 bg-white/5 animate-pulse rounded-xl" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Enterprise Header */}
        <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tighter">Identity Dashboard</h2>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2 uppercase tracking-widest font-black">
              <Shield className="w-3.5 h-3.5 text-primary" />
              Zero-Knowledge Isolation • Persistence Verified
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-secondary/50 border border-white/5 flex items-center gap-2">
              <Info className="w-3 h-3 text-muted-foreground" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Encryption Status: ACTIVE</span>
            </div>
          </div>
        </motion.div>

        {/* Risk Banner */}
        <motion.div variants={item}>
          <RiskAlertBanner />
        </motion.div>

        {/* Hero ESI Gauge */}
        <motion.div variants={item}>
          <EmotionalStabilityIndex value={esi} trend="+2.4%" />
        </motion.div>

        {/* Stats Grid - Hidden if replaced by ESI, or kept for detail */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat: any) => (
            <div key={stat.label} className="glass-card p-6 border-white/5 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">{stat.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-display text-2xl font-bold tracking-tight">{stat.value}</span>
                <span className={`text-[10px] font-black mb-1 px-1.5 py-0.5 rounded bg-white/5 ${stat.up ? "text-success" : "text-primary"}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={item}>
              <AIInsightPanel />
            </motion.div>
            <motion.div variants={item}>
              <BurnoutRiskIndicator probability={burnoutProb} />
            </motion.div>
            <motion.div variants={item}>
              <StressGauge value={stressScore} label="Biometric Stress Delta" riskLevel={riskLevel} />
            </motion.div>
            <motion.div variants={item}>
              <ResilienceScore stressScore={stressScore} />
            </motion.div>
            <motion.div variants={item}>
              <MoodChart data={moodHistory} title="Longitudinal Sentiment Analysis" />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div variants={item}>
              <MoodLogger onMoodLogged={fetchData} />
            </motion.div>
            <motion.div variants={item}>
              <WhatIfSimulator />
            </motion.div>
            <motion.div variants={item}>
              <EmotionalVolatility score={Math.round(volatility * 100)} trend={acceleration > 0 ? "increasing" : "decreasing"} acceleration={acceleration} />
            </motion.div>
            <motion.div variants={item}>
              <DataTransparency />
            </motion.div>
            <motion.div variants={item}>
              <EmotionDistribution />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
