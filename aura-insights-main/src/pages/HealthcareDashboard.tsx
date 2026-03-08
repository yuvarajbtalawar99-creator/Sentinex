import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { healthcare } from "@/lib/api";
import { ShieldCheck, HeartPulse, TrendingUp, TrendingDown, Activity, AlertCircle, Clock, Thermometer } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import ExportButton from "@/components/ExportButton";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function HealthcareDashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [heatmap, setHeatmap] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mRes, hRes] = await Promise.all([healthcare.metrics(), healthcare.heatmap()]);
                setMetrics(mRes.data);
                setHeatmap(hRes.data);
            } catch (err) {
                console.error("Failed to fetch healthcare data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !metrics) return (
        <DashboardLayout>
            <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
                <HeartPulse className="w-10 h-10 text-primary animate-pulse" />
                <p className="text-primary/50 text-xs uppercase tracking-widest font-bold animate-pulse">Establishing Medical Data Uplink...</p>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                <motion.div variants={item} className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-bold">Medical Staff Fatigue Analysis</h2>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-success" />
                            Patient safety & clinician well-being monitoring active
                        </p>
                    </div>
                    <ExportButton
                        type="healthcare"
                        data={metrics.stats}
                        title="Medical Fatigue Analytics"
                        label="Export Fatigue Log"
                    />
                </motion.div>

                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.stats.map((stat: any) => (
                        <div key={stat.label} className="glass-card p-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                                {stat.up ? <TrendingUp className="w-3 h-3 text-success" /> : <TrendingDown className="w-3 h-3 text-destructive" />}
                            </div>
                            <div className="font-display text-2xl font-bold">{stat.value}</div>
                            <p className="text-[10px] text-muted-foreground mt-2">Week vs Last: <span className={stat.monthVsLast.startsWith('-') ? 'text-success' : 'text-primary'}>{stat.monthVsLast}</span></p>
                        </div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div variants={item} className="lg:col-span-2 glass-card p-6">
                        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">Shift Stress & Fatigue Levels</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={metrics.shiftStress}>
                                    <defs>
                                        <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(348, 83%, 47%)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(348, 83%, 47%)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                                    <XAxis dataKey="shift" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(11, 18, 33, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)' }} />
                                    <Area type="monotone" dataKey="stress" stroke="hsl(348, 83%, 47%)" fillOpacity={1} fill="url(#colorStress)" name="Avg Stress" />
                                    <Area type="monotone" dataKey="fatigue" stroke="hsl(38, 92%, 50%)" fill="transparent" strokeWidth={2} name="Fatigue Level" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="glass-card p-6 border-primary/20 bg-primary/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Thermometer className="w-4 h-4 text-primary" />
                            <h3 className="text-xs uppercase tracking-widest font-bold text-primary">Emergency Volatility</h3>
                        </div>
                        <div className="flex flex-col items-center justify-center h-48">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary" strokeDasharray={351.8} strokeDashoffset={351.8 * (1 - metrics.emergencyVolatility / 100)} />
                                </svg>
                                <div className="absolute text-2xl font-black font-display text-primary">{metrics.emergencyVolatility}%</div>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-4 text-center">
                                High volatility detected in emergency units. Risk of staff fatigue-induced errors elevated.
                            </p>
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={item} className="glass-card p-6">
                    <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">Department Burnout Heatmap</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {heatmap.map((dept: any) => (
                            <div key={dept.department} className={`p-4 rounded-xl bg-secondary/30 border ${dept.burnoutRisk > 70 ? 'border-destructive/30' : 'border-border/30'}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold">{dept.department}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded ${dept.burnoutRisk > 70 ? 'bg-destructive/20 text-destructive' : 'bg-primary/10 text-primary'}`}>
                                        {dept.burnoutRisk > 70 ? 'CRITICAL' : 'OPTIMAL'}
                                    </span>
                                </div>
                                <div className="flex items-end gap-2 mb-1">
                                    <span className="text-2xl font-bold font-display">{dept.burnoutRisk}%</span>
                                    <span className="text-[10px] text-muted-foreground mb-1">Risk Factor</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${dept.burnoutRisk > 70 ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${dept.burnoutRisk}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
}
