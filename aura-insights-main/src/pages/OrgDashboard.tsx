import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { org } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ShieldCheck, Users, Building2, Download, AlertTriangle, TrendingUp, TrendingDown, Activity, Brain } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="text-muted-foreground">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-bold">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

function getHeatColor(value: number) {
  if (value < 30) return "bg-success/20 text-success";
  if (value < 50) return "bg-warning/20 text-warning";
  return "bg-accent/20 text-accent";
}

export default function OrgDashboard() {
  const [deptData, setDeptData] = useState<any[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
  const [orgMetrics, setOrgMetrics] = useState<any>(null);
  const [orgAlerts, setOrgAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, heatmapRes, alertsRes, trendsRes] = await Promise.all([
          org.metrics(),
          org.heatmap(),
          org.alerts(),
          org.trends(),
        ]);
        setOrgMetrics(metricsRes.data);
        setDeptData(heatmapRes.data);
        setOrgAlerts(alertsRes.data);
        setWeeklyTrend(trendsRes.data);
      } catch (err) {
        console.error("[OrgDashboard] Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !orgMetrics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Brain className="w-10 h-10 text-primary animate-pulse" />
            <p className="text-primary/50 text-xs uppercase tracking-widest font-bold animate-pulse">Loading Organization Data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Organization Analytics</h2>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-success" />
              All data is anonymized and aggregated — no individual data visible
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
        </motion.div>

        {/* Emotional Climate Index Quick View */}
        <motion.div variants={item} className="glass-card p-6 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary/30 flex items-center justify-center relative">
              <span className="font-display text-xl font-bold text-primary">{orgMetrics.climateIndex}%</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Well-being Score</h3>
              <p className="font-display text-3xl font-bold">
                Campus Emotional Climate: <span className="text-primary">{orgMetrics.climateIndex}% {orgMetrics.climateStatus}</span>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Stats Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {orgMetrics.stats.map((stat: any) => (
                <div key={stat.label} className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                    {stat.up ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-accent" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold">{stat.value}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground">Week vs Last</span>
                      <span className={stat.weekVsLast.startsWith('+') ? "text-success" : stat.weekVsLast === '0%' ? "text-muted-foreground" : "text-accent"}>
                        {stat.weekVsLast}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground">Month vs Last</span>
                      <span className={stat.monthVsLast.startsWith('+') ? "text-success" : stat.monthVsLast === '0%' ? "text-muted-foreground" : "text-accent"}>
                        {stat.monthVsLast}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div className="glass-card p-6">
              <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Department Stress Heatmap
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {deptData.map((dept: any) => (
                  <div key={dept.department} className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-sm">{dept.department}</span>
                      <span className="text-xs text-muted-foreground">{dept.headcount} people</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`p-2 rounded text-center text-xs ${getHeatColor(dept.stressLevel)}`}>
                        <div className="font-display font-bold text-lg">{dept.stressLevel}%</div>
                        <div>Stress</div>
                      </div>
                      <div className={`p-2 rounded text-center text-xs ${getHeatColor(dept.burnoutRisk)}`}>
                        <div className="font-display font-bold text-lg">{dept.burnoutRisk}%</div>
                        <div>Burnout Risk</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Alerts Sidebar */}
          <div className="space-y-4">
            <div className="glass-card p-5 border-accent/20 bg-accent/5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-accent" />
                <h3 className="text-xs uppercase tracking-widest font-bold text-accent">Risk Zone Alerts</h3>
              </div>
              <div className="space-y-4">
                {orgAlerts.map((alert: any) => (
                  <div key={alert.id} className="p-3 rounded-lg bg-background/50 border border-border/50 relative overflow-hidden group">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.type === 'error' ? 'bg-accent' : 'bg-warning'}`} />
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-primary">{alert.target}</span>
                      <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-tight">{alert.message}</p>
                    <button className="mt-2 text-[10px] text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                      View Deep Analysis →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-xs uppercase tracking-widest font-bold">Trend Insight</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Overall emotional volatility is <strong>12% lower</strong> than last week, indicating improved stability across Engineering and Design.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={item} className="glass-card p-6">
            <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Weekly Stress Trend (Aggregated)
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 18%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="stress" stroke="hsl(340, 85%, 55%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="burnout" stroke="hsl(40, 95%, 55%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card p-6">
            <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Burnout Probability Index
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 18%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="burnout" fill="hsl(192, 100%, 50%)" radius={[4, 4, 0, 0]} opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
