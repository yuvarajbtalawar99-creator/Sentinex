import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { admin } from "@/lib/api";
import {
  Users,
  Building2,
  Cpu,
  Server,
  ShieldCheck,
  Activity,
  AlertCircle,
  Database,
  Gauge,
  Zap,
  Brain,
  CheckCircle,
  History,
  Search
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { toast } from "sonner";
import GlobalEmotionHeatmap from "@/components/superadmin/GlobalEmotionHeatmap";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const iconMap: Record<string, any> = { Users, Building2, Cpu, Server, ShieldCheck, Activity };

export default function AdminDashboard() {
  const [adminMetrics, setAdminMetrics] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"metrics" | "orgs" | "logs">("metrics");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, oRes, lRes] = await Promise.all([
        admin.metrics(),
        admin.organizations(),
        admin.auditLogs()
      ]);
      setAdminMetrics(mRes.data);
      setOrganizations(oRes.data);
      setAuditLogs(lRes.data);
    } catch (err) {
      console.error("[AdminDashboard] Fetch error:", err);
      toast.error("Failed to synchronize admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveOrg = async (id: string) => {
    try {
      await admin.approveOrganization(id);
      toast.success("Organization approved successfully");
      fetchData();
    } catch (err) {
      toast.error("Failed to approve organization");
    }
  };

  if (loading && !adminMetrics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Brain className="w-10 h-10 text-primary animate-pulse" />
            <p className="text-primary/50 text-xs uppercase tracking-widest font-bold animate-pulse">Synchronizing Global Control Alpha...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tighter">System Architect Terminal</h2>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2 uppercase tracking-widest font-medium">
              <ShieldCheck className="w-3 h-3 text-success" />
              Global Persistence Active • Cross-Tenant Isolation Verified
            </p>
          </div>
          <div className="flex bg-secondary/50 p-1 rounded-xl border border-white/5">
            {[
              { id: "metrics", label: "Metrics", icon: Activity },
              { id: "orgs", label: "Organizations", icon: Building2 },
              { id: "logs", label: "Audit Logs", icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-secondary' : 'text-muted-foreground hover:text-white'}`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === "metrics" && adminMetrics && (
          <div className="space-y-6">
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminMetrics.systemStats.map((stat: any) => {
                const Icon = iconMap[stat.icon] || Activity;
                return (
                  <div key={stat.label} className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">{stat.label}</span>
                    </div>
                    <div className="font-display text-3xl font-bold mb-1">{stat.value}</div>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">{stat.detail}</p>
                  </div>
                );
              })}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={item} className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground">Neural Persistence Stability</h3>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase">
                    <span className="text-primary">{adminMetrics.modelConfidence}% Confidence</span>
                    <span className="text-success">{adminMetrics.dataFlowStatus}</span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={adminMetrics.accuracyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 18%)" vertical={false} />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                      <YAxis domain={[90, 100]} tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(11, 18, 33, 0.95)', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '10px' }} />
                      <Line type="monotone" dataKey="accuracy" stroke="hsl(215, 100%, 50%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div variants={item} className="glass-card p-6 bg-primary/5 border-primary/20">
                <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-primary mb-6">Threat Mitigation</h3>
                <div className="flex flex-col items-center justify-center h-48">
                  <div className="text-5xl font-black font-display text-primary mb-2">{adminMetrics.activeRiskCount}</div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-center">Active High-Risk Signals</p>
                  <div className="w-full h-1 bg-primary/20 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-primary animate-pulse" style={{ width: '40%' }} />
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div variants={item}>
              <GlobalEmotionHeatmap />
            </motion.div>
          </div>
        )}

        {activeTab === "orgs" && (
          <motion.div variants={item} className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground">Registered Organizations</h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input type="text" placeholder="Filter Orgs..." className="bg-secondary/30 border border-white/5 rounded-lg py-1.5 pl-8 pr-4 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary/30" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Name / Code</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Created</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((org) => (
                    <tr key={org._id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold">{org.name}</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-mono">{org.orgCode}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase font-black">
                          {org.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border uppercase font-black ${org.status === 'approved' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[10px] text-muted-foreground">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {org.status === 'pending' && (
                          <button
                            onClick={() => handleApproveOrg(org._id)}
                            className="p-1.5 rounded-lg bg-success text-secondary hover:scale-105 transition-transform"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "logs" && (
          <motion.div variants={item} className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="font-display text-[10px] uppercase tracking-widest font-black text-muted-foreground">Security Audit Trail</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">IP / Method</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log._id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 text-[9px] text-muted-foreground font-mono">
                        {new Date(log.timestamp).toISOString()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold uppercase tracking-tight">{log.action}</p>
                      </td>
                      <td className="px-6 py-4 text-[9px] text-muted-foreground uppercase">
                        {log.method} • {log.ip}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-black text-success">SUCCESS</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
