import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  GraduationCap,
  Briefcase,
  HeartPulse,
  Landmark,
  ShieldAlert,
  LogOut,
  Shield,
  Bell,
  Settings,
  Users,
  Building
} from "lucide-react";
import { useRole, Role } from "@/hooks/useRole";
import { toast } from "sonner";
import { NotificationDropdown } from "./NotificationDropdown";

const DashboardLayout = ({ children, loading: externalLoading }: { children: React.ReactNode; loading?: boolean }) => {
  const { role, orgType, updateRole, loading: authLoading } = useRole();
  const loading = externalLoading || authLoading;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('sentinex_token');
    localStorage.removeItem('sentinex_user');
    updateRole(null as any);
    navigate('/');
  };

  const menuItems = [
    {
      label: "My Analytics",
      icon: Activity,
      path: "/dashboard/individual",
      allowed: ["individual", "university_admin", "corporate_admin", "healthcare_admin", "government_admin"]
    },
    {
      label: "University Hub",
      icon: GraduationCap,
      path: "/dashboard/university",
      allowed: ["university_admin"]
    },
    {
      label: "Corporate Hub",
      icon: Briefcase,
      path: "/dashboard/corporate",
      allowed: ["corporate_admin"]
    },
    {
      label: "Healthcare Unit",
      icon: HeartPulse,
      path: "/dashboard/healthcare",
      allowed: ["healthcare_admin"]
    },
    {
      label: "Public Macro",
      icon: Landmark,
      path: "/dashboard/government",
      allowed: ["government_admin"]
    },
    {
      label: "System Security",
      icon: ShieldAlert,
      path: "/dashboard/admin",
      allowed: ["super_admin"]
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
      allowed: ["individual", "university_admin", "corporate_admin", "healthcare_admin", "government_admin", "super_admin"]
    },
  ];

  const filteredMenu = menuItems.filter(item => role && item.allowed.includes(role));

  const roleLabels: Record<Role, string> = {
    individual: "Individual",
    university_admin: "University Admin",
    corporate_admin: "Corporate Admin",
    healthcare_admin: "Medical Director",
    government_admin: "Public Commissioner",
    super_admin: "System Architect"
  };

  // Pre-calculate role label if available
  const activeRoleLabel = role ? roleLabels[role] : "Verifying Auth...";

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        className="w-64 bg-secondary/30 border-r border-border shrink-0 flex flex-col p-6 h-screen overflow-y-auto"
      >
        <div className="flex items-center gap-3 mb-10 pl-2">
          <img src="/infinity-logo.svg" alt="SENTINEX" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-lg tracking-tight uppercase tracking-tighter">SENTINEX</span>
        </div>

        <nav className="space-y-1 flex-1">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-6">
          <div className="p-4 rounded-xl bg-secondary/50 border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center font-display font-bold text-primary text-[10px]">
                UX
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold truncate uppercase tracking-widest text-muted-foreground mb-0.5">Logged in as</p>
                <p className="text-[9px] text-foreground truncate uppercase font-black">{activeRoleLabel}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
              {(Object.keys(roleLabels) as Role[]).map(r => (
                <button
                  key={r}
                  onClick={() => updateRole(r)}
                  className={`text-[8px] py-1 rounded border transition-all uppercase font-bold tracking-tighter ${role === r ? 'bg-primary/10 border-primary text-primary' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
                >
                  {r.split('_')[0]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Terminate Access</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-background relative">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="h-4 w-[1px] bg-border mx-2 hidden md:block" />
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground">Neural Persistence:</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-warning animate-pulse' : 'bg-success shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
                <span className={`text-[8px] font-bold uppercase ${loading ? 'text-warning' : 'text-success'}`}>{loading ? 'Verifying' : 'Secured'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {orgType && (
              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                <Building className="w-3 h-3 text-primary" />
                <span className="text-[8px] font-black text-primary uppercase tracking-[0.1em]">{orgType} Environment</span>
              </div>
            )}
            <NotificationDropdown />
            <button onClick={() => navigate('/settings')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <Activity className="w-12 h-12 text-primary animate-pulse" />
              <p className="text-primary/50 text-[10px] uppercase tracking-widest font-black animate-pulse">Establishing Secure Neural Handshake...</p>
            </div>
          ) : children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
