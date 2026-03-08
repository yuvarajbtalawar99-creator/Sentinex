import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { university } from "@/lib/api";
import { ShieldCheck, Brain, GraduationCap, TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ExportButton from "@/components/ExportButton";
import { ClimateIndex } from "@/components/ClimateIndex";
import { PublicClimate } from "@/components/PublicClimate";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function UniversityDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [heatmap, setHeatmap] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mRes, hRes] = await Promise.all([university.metrics(), university.heatmap()]);
                setMetrics(mRes.data);
                setHeatmap(hRes.data);
            } catch (err) {
                console.error("Failed to fetch university data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !metrics) return (
        <DashboardLayout>
            <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
                <GraduationCap className="w-10 h-10 text-primary animate-pulse" />
                <p className="text-primary/50 text-xs uppercase tracking-widest font-bold animate-pulse">Syncing Academic Analytics...</p>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={item} className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-bold">University Analytics</h2>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-success" />
                            Academic pressure forecasting active • Student anonymity preserved
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ExportButton
                            type="university"
                            data={metrics.stats}
                            title="Academic Infrastructure Metrics"
                        />
                    </div>
                </motion.div>

                <motion.div variants={item}>
                    <ClimateIndex
                        score={metrics.overallScore || 72}
                        delta={metrics.weeklyDelta || "+1.8%"}
                        activeUsers={metrics.activeUsers || 1240}
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div variants={item} className="lg:col-span-2 glass-card p-6">
                        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">Semester Stress Trend</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metrics.semesterTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} />
                                    <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(11, 18, 33, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)' }} />
                                    <Line type="monotone" dataKey="stress" stroke="hsl(348, 83%, 47%)" strokeWidth={2} dot={false} name="Stress Level" />
                                    <Line type="monotone" dataKey="risk" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} name="Burnout Risk" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="glass-card p-6 border-accent/20 bg-accent/5">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-4 h-4 text-accent" />
                            <h3 className="text-xs uppercase tracking-widest font-bold text-accent">Exam Period High Risk</h3>
                        </div>
                        <div className="space-y-4">
                            {metrics.examSpikes.map((spike: any) => (
                                <div key={spike.period} className="p-4 rounded-lg bg-background/50 border border-border/50">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-primary uppercase">{spike.period}</span>
                                        <span className="text-[10px] text-muted-foreground">{spike.date}</span>
                                    </div>
                                    <p className="text-xl font-bold font-display">{spike.risk}% <span className="text-xs font-normal text-muted-foreground ml-1">Est. Stress Level</span></p>
                                </div>
                            ))}
                            <div className="pt-4 mt-4 border-t border-border/30">
                                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                    * Based on historical neural patterns during high-pressure assessment windows.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="glass-card p-6">
                            <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">Department Stress Heatmap</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {heatmap.map((dept: any) => (
                                    <div key={dept.department} className="p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/20 transition-all group">
                                        <p className="text-xs font-bold truncate mb-2">{dept.department}</p>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-[10px] mb-1">
                                                    <span>Stress</span>
                                                    <span className="text-primary">{dept.stressLevel}%</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-destructive" style={{ width: `${dept.stressLevel}%` }} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] mb-1">
                                                    <span>Burnout Risk</span>
                                                    <span className="text-primary">{dept.burnoutRisk}%</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-warning" style={{ width: `${dept.burnoutRisk}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <PublicClimate />
                        <div className="glass-card p-6 border-primary/20 bg-primary/5">
                            <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-primary mb-4">Admin Neural Insights</h3>
                            <div className="space-y-3">
                                {[
                                    "Systemic stress spike detected in STEM faculty.",
                                    "Burnout probability rising in 3rd year students.",
                                    "Neural coherence improving across Arts department."
                                ].map((insight, i) => (
                                    <div key={i} className="flex gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] font-bold">
                                        <span className="text-primary">•</span>
                                        <span className="uppercase tracking-tight">{insight}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
}
