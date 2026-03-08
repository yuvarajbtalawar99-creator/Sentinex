import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { corporate } from "@/lib/api";
import { ShieldCheck, Briefcase, TrendingUp, TrendingDown, Activity, Zap, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import ExportButton from "@/components/ExportButton";
import ImpactModeling from "@/components/ImpactModeling";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function CorporateDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [heatmap, setHeatmap] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const [mRes, hRes] = await Promise.all([corporate.metrics(), corporate.heatmap()]);
                setMetrics(mRes.data);
                setHeatmap(hRes.data);
            } catch (err: any) {
                console.error("Failed to fetch corporate data", err);
                setError(err.response?.data?.message || err.message || "Failed to establish secure data link.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
                    <Activity className="w-12 h-12 text-destructive mb-4 animate-pulse" />
                    <h2 className="font-display text-xl font-bold text-destructive uppercase tracking-widest mb-2">Neural Link Interrupted</h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-tighter leading-relaxed">
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
                    >
                        Retry Handshake
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    if (loading || !metrics) return (
        <DashboardLayout loading={true}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-10 w-64 bg-white/5 animate-pulse rounded" />
                    <div className="h-10 w-32 bg-white/5 animate-pulse rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 h-64 bg-white/5 animate-pulse rounded-xl" />
                    <div className="h-64 bg-white/5 animate-pulse rounded-xl" />
                </div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={item} className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-bold">Corporate Workplace Analytics</h2>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-success" />
                            Workplace performance & burnout prevention architecture active
                        </p>
                    </div>
                    <ExportButton
                        type="corporate"
                        data={metrics.stats}
                        title="Workplace Performance Data"
                        label="Export HR Data"
                    />
                </motion.div>

                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.stats.map((stat: any) => (
                        <div key={stat.label} className="glass-card p-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                                {stat.up ? <TrendingUp className="w-3 h-3 text-success" /> : <TrendingDown className="w-3 h-3 text-accent" />}
                            </div>
                            <div className="font-display text-2xl font-bold">{stat.value}</div>
                            <p className="text-[10px] text-muted-foreground mt-2">Week vs Last: <span className={stat.trend.startsWith('+') ? 'text-success' : 'text-accent'}>{stat.trend}</span></p>
                        </div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <motion.div variants={item} className="lg:col-span-3 glass-card p-6">
                        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">Weekly Emotional & Productivity Trend</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={metrics.weeklyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: 'rgba(11, 18, 33, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)' }} />
                                    <Bar dataKey="stress" fill="hsl(348, 83%, 47%)" radius={[4, 4, 0, 0]} name="Stress Score" />
                                    <Bar dataKey="productivity" fill="hsl(215, 100%, 50%)" radius={[4, 4, 0, 0]} name="Productivity Index" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="glass-card p-6 flex flex-col justify-center items-center text-center">
                        <Zap className="w-12 h-12 text-primary mb-4" />
                        <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-1">Productivity Risk</h3>
                        <div className="text-4xl font-black font-display text-primary">{metrics.productivityRiskScore}%</div>
                        <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">
                            Based on AI-detected volatility and team fatigue levels. Target threshold is below 15%.
                        </p>
                    </motion.div>
                </div>

                <motion.div variants={item} className="glass-card p-6 border-white/5 hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display text-sm uppercase tracking-widest font-bold">Department Stress Heatmap</h3>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black bg-white/5 px-2 py-1 rounded">Live Data</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {heatmap.map((dept: any) => {
                            const stressLevel = Math.round(dept.stressLevel);
                            const burnoutRisk = dept.burnoutRisk ? Math.round(dept.burnoutRisk) : Math.round(stressLevel * 0.8);

                            return (
                                <div key={dept.department} className="p-5 rounded-2xl bg-secondary/40 border border-white/5 hover:bg-secondary/60 hover:border-primary/30 transition-all duration-300 group cursor-default">
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                                        <p className="text-sm font-display font-bold truncate group-hover:text-primary transition-colors">{dept.department}</p>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-background/50 px-2 py-1 rounded-md">{dept.headcount} Staff</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-end mb-1.5">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stress Level</span>
                                                <span className={`text-xs font-black ${stressLevel > 70 ? 'text-destructive' : stressLevel > 40 ? 'text-warning' : 'text-success glow-text-primary'}`}>{stressLevel}%</span>
                                            </div>
                                            <div className="h-1.5 bg-background rounded-full overflow-hidden shadow-inner">
                                                <div className={`h-full transition-all duration-1000 ${stressLevel > 70 ? 'bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]' : stressLevel > 40 ? 'bg-warning' : 'bg-success shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`} style={{ width: `${stressLevel}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-end mb-1.5">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Burnout Risk</span>
                                                <span className={`text-xs font-black ${burnoutRisk > 70 ? 'text-destructive' : burnoutRisk > 40 ? 'text-warning' : 'text-primary'}`}>{burnoutRisk}%</span>
                                            </div>
                                            <div className="h-1.5 bg-background rounded-full overflow-hidden shadow-inner">
                                                <div className={`h-full transition-all duration-1000 ${burnoutRisk > 70 ? 'bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]' : burnoutRisk > 40 ? 'bg-warning' : 'bg-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`} style={{ width: `${burnoutRisk}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div variants={item}>
                    <ImpactModeling />
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
}
