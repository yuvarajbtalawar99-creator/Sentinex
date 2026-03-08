import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { government } from "@/lib/api";
import { Landmark, Users, TrendingUp, Shield, Map, AlertTriangle, Brain, Globe, MessageSquare, Download } from "lucide-react";
import ExportButton from "@/components/ExportButton";
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell
} from "recharts";

const COLORS = ['#3B82F6', '#6366F1', '#F59E0B', '#EF4444']; // Cobalt, Indigo, Amber, Crimson

export default function GovernmentDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await government.metrics();
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch government data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Brain className="w-10 h-10 text-primary animate-pulse" />
                        <p className="text-primary/50 text-xs uppercase tracking-widest font-bold animate-pulse">Accessing National Intelligence Node...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-bold uppercase tracking-tighter">Public Commissioner Terminal</h2>
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2 uppercase tracking-widest font-black">
                            <Shield className="w-3.5 h-3.5 text-primary" />
                            Encryption Protocol: P-384 High-Persistence Isolation
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ExportButton
                            type="government"
                            data={[
                                { label: "Population Reach", value: data.populationReach },
                                { label: "Sentiment Index", value: data.sentimentIndex },
                                { label: "Volatility Level", value: data.volatilityLevel }
                            ]}
                            title="National Intelligence Report"
                        />
                        <div className="px-4 py-2 rounded-xl bg-secondary/50 border border-white/5 flex items-center gap-3">
                            <Globe className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Network Status: Synchronized</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Population Reach", value: data.populationReach, icon: Users, color: "text-primary" },
                        { label: "Sentiment Index", value: data.sentimentIndex, icon: MessageSquare, color: "text-accent" },
                        { label: "Volatility Level", value: data.volatilityLevel, icon: TrendingUp, color: "text-warning" },
                        { label: "Privacy Compliance", value: "100%", icon: Shield, color: "text-success" }
                    ].map((stat) => (
                        <div key={stat.label} className="glass-card p-6 border-border/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">{stat.label}</span>
                            </div>
                            <div className="font-display text-3xl font-bold">{stat.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card p-6 lg:col-span-1">
                        <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-6">Regional Sentiment Volatility</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.regionalVolatility}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                                    <XAxis dataKey="region" tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                                    <YAxis tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(11, 18, 33, 0.95)', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '10px' }} />
                                    <Bar dataKey="volatility" fill="url(#colorVolatility)" radius={[4, 4, 0, 0]}>
                                        <defs>
                                            <linearGradient id="colorVolatility" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(215, 100%, 50%)" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="hsl(215, 100%, 50%)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-6">Sentiment Composition</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.sectorSentiment}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.sectorSentiment.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(11, 18, 33, 0.95)', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center flex-wrap gap-4 mt-4">
                                {data.sectorSentiment.map((entry: any, index: number) => (
                                    <div key={entry.name} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-[9px] uppercase font-black text-muted-foreground">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
