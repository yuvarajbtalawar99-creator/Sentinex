import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";
import {
    User,
    ShieldCheck,
    Bell,
    LayoutDashboard,
    Eye,
    FileDown,
    Lock,
    Trash2,
    Building2,
    ChevronRight,
    Check,
    X,
    Download,
    Key,
    Monitor,
    AlertTriangle,
    Save,
    UserCog,
    Cpu,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab =
    | "profile"
    | "privacy"
    | "notifications"
    | "dashboard"
    | "transparency"
    | "reports"
    | "security"
    | "account"
    | "admin";

// ─── Reusable Building Blocks ─────────────────────────────────────────────────
const SectionCard = ({
    title,
    subtitle,
    icon: Icon,
    children,
}: {
    title: string;
    subtitle?: string;
    icon: any;
    children: React.ReactNode;
}) => (
    <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-widest">{title}</h3>
                {subtitle && (
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{subtitle}</p>
                )}
            </div>
        </div>
        {children}
    </div>
);

const Toggle = ({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) => (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
                {checked ? (
                    <Check className="w-3 h-3 text-primary shrink-0" />
                ) : (
                    <X className="w-3 h-3 text-muted-foreground shrink-0" />
                )}
                <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-[10px] text-muted-foreground pl-5">{description}</p>
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 transition-all duration-300 focus:outline-none ${checked
                ? "bg-primary/20 border-primary shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                : "bg-white/5 border-white/10"
                }`}
        >
            <span
                className={`inline-block h-3 w-3 mt-0.5 rounded-full transition-transform duration-300 ${checked ? "translate-x-4 bg-primary" : "translate-x-0.5 bg-muted-foreground"
                    }`}
            />
        </button>
    </div>
);

const Field = ({
    label,
    value,
    type = "text",
    readOnly = false,
}: {
    label: string;
    value: string;
    type?: string;
    readOnly?: boolean;
}) => (
    <div className="mb-4">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
            {label}
        </label>
        <input
            type={type}
            defaultValue={value}
            readOnly={readOnly}
            className={`w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] transition-all ${readOnly ? "opacity-50 cursor-default" : ""
                }`}
        />
    </div>
);

const ActionButton = ({
    label,
    icon: Icon,
    variant = "default",
    onClick,
}: {
    label: string;
    icon?: any;
    variant?: "default" | "danger" | "ghost";
    onClick?: () => void;
}) => {
    const styles = {
        default: "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
        danger: "bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive/20",
        ghost: "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground",
    };
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${styles[variant]}`}
        >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {label}
        </button>
    );
};

// ─── Tab Sections ─────────────────────────────────────────────────────────────
const ProfileSection = ({ role }: { role: string }) => {
    const handleSave = () => toast.success("Profile updated successfully.");
    const handlePassword = () => toast.info("Password change email sent.");

    return (
        <SectionCard title="Profile Information" subtitle="Manage your identity" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Field label="Full Name" value="Yuvaraj" />
                <Field label="Email" value="yuvaraj@email.com" type="email" />
                <Field label="Organization" value="ABC University" />
                <Field label="Department" value="Computer Science" />
                <Field label="Role" value={role} readOnly />
            </div>
            <div className="flex gap-3 mt-2">
                <ActionButton label="Update Profile" icon={Save} onClick={handleSave} />
                <ActionButton label="Change Password" icon={Key} variant="ghost" onClick={handlePassword} />
            </div>
        </SectionCard>
    );
};

const PrivacySection = () => {
    const [toggles, setToggles] = useState({
        aiAnalysis: true,
        anonData: true,
        counselorAccess: false,
        research: true,
    });
    const set = (key: keyof typeof toggles) => (v: boolean) =>
        setToggles((prev) => ({ ...prev, [key]: v }));
    const handleSave = () => toast.success("Privacy preferences saved.");

    return (
        <SectionCard title="Privacy & Consent" subtitle="Control how SENTINEX uses your data" icon={ShieldCheck}>
            <Toggle
                label="Allow AI Emotional Analysis"
                description="Enables sentiment analysis of your journal entries."
                checked={toggles.aiAnalysis}
                onChange={set("aiAnalysis")}
            />
            <Toggle
                label="Allow Anonymous Data for Organization Insights"
                description="Your data will only be used in aggregated, de-identified form."
                checked={toggles.anonData}
                onChange={set("anonData")}
            />
            <Toggle
                label="Allow Counselor Access"
                description="Share emotional insights with an approved, assigned counselor."
                checked={toggles.counselorAccess}
                onChange={set("counselorAccess")}
            />
            <Toggle
                label="Participate in Research / AI Training"
                description="Help improve SENTINEX models with anonymized data."
                checked={toggles.research}
                onChange={set("research")}
            />
            <div className="mt-5">
                <ActionButton label="Save Preferences" icon={Save} onClick={handleSave} />
            </div>
        </SectionCard>
    );
};

const NotificationsSection = () => {
    const [toggles, setToggles] = useState({
        riskAlerts: true,
        weeklyReport: true,
        dailyReminder: true,
    });
    const [reminderTime, setReminderTime] = useState("20:00");
    const set = (key: keyof typeof toggles) => (v: boolean) =>
        setToggles((prev) => ({ ...prev, [key]: v }));
    const handleSave = () => toast.success("Notification settings saved.");

    return (
        <SectionCard title="Notifications" subtitle="Choose what SENTINEX alerts you about" icon={Bell}>
            <Toggle
                label="Risk Alerts"
                description="Receive immediate notifications when your risk score changes significantly."
                checked={toggles.riskAlerts}
                onChange={set("riskAlerts")}
            />
            <Toggle
                label="Weekly Emotional Report"
                description="Get a weekly digest of your emotional trends and AI insights."
                checked={toggles.weeklyReport}
                onChange={set("weeklyReport")}
            />
            <Toggle
                label="Mood Reminder (Daily)"
                description="A gentle daily nudge to log your mood."
                checked={toggles.dailyReminder}
                onChange={set("dailyReminder")}
            />
            {toggles.dailyReminder && (
                <div className="mt-4">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                        Reminder Time
                    </label>
                    <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>
            )}
            <div className="mt-5">
                <ActionButton label="Save" icon={Save} onClick={handleSave} />
            </div>
        </SectionCard>
    );
};

const DashboardSection = () => {
    const [components, setComponents] = useState({
        esi: true,
        stressForecast: true,
        volatility: true,
        aiInsight: true,
        burnout: true,
    });
    const [defaultView, setDefaultView] = useState("personal");
    const toggle = (key: keyof typeof components) =>
        setComponents((prev) => ({ ...prev, [key]: !prev[key] }));
    const handleSave = () => toast.success("Dashboard preferences saved.");

    const componentList: { key: keyof typeof components; label: string; desc: string }[] = [
        { key: "esi", label: "Emotional Stability Index", desc: "Your primary ESI gauge" },
        { key: "stressForecast", label: "Stress Forecast", desc: "Predicted stress trajectory" },
        { key: "volatility", label: "Emotional Volatility Graph", desc: "Mood swing visualization" },
        { key: "aiInsight", label: "AI Insight Panel", desc: "Generative AI analysis" },
        { key: "burnout", label: "Burnout Risk Indicator", desc: "Burnout probability meter" },
    ];

    return (
        <SectionCard title="Dashboard Preferences" subtitle="Customize your workspace" icon={LayoutDashboard}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Show Components
            </p>
            {componentList.map((c) => (
                <Toggle
                    key={c.key}
                    label={c.label}
                    description={c.desc}
                    checked={components[c.key]}
                    onChange={() => toggle(c.key)}
                />
            ))}
            <div className="mt-5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                    Default View
                </label>
                <select
                    value={defaultView}
                    onChange={(e) => setDefaultView(e.target.value)}
                    className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary/50 transition-all"
                >
                    <option value="personal">Personal Dashboard</option>
                    <option value="university">University Hub</option>
                    <option value="corporate">Corporate Hub</option>
                    <option value="healthcare">Healthcare Unit</option>
                    <option value="government">Government Macro</option>
                </select>
            </div>
            <div className="mt-5">
                <ActionButton label="Save Preferences" icon={Save} onClick={handleSave} />
            </div>
        </SectionCard>
    );
};

const TransparencySection = () => {
    const used = [
        "Mood Scores (1–10 scale)",
        "Journal Sentiment Analysis",
        "Emotional Trends Over Time",
        "Session Duration & Frequency",
    ];
    const notCollected = [
        "Private Messages or Emails",
        "Social Media Activity",
        "Location or GPS Data",
        "Biometric Hardware Data",
    ];

    return (
        <SectionCard title="Data Transparency" subtitle="What SENTINEX knows — and what it doesn't" icon={Eye}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Data Used by SENTINEX</p>
                    <ul className="space-y-2">
                        {used.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <Check className="w-3 h-3 text-primary shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-destructive mb-3">Data NOT Collected</p>
                    <ul className="space-y-2">
                        {notCollected.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <X className="w-3 h-3 text-destructive shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5">
                <ActionButton label="View Privacy Policy" icon={Eye} variant="ghost" onClick={() => window.open('/privacy', '_blank')} />
            </div>
        </SectionCard>
    );
};

const ReportsSection = () => {
    const handleDownload = (type: string) => toast.success(`${type} report download started.`);

    return (
        <SectionCard title="Download Reports" subtitle="Export your emotional data as PDF" icon={FileDown}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Format: PDF
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={() => handleDownload("Weekly Emotional")}
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-secondary/50 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="text-left">
                        <p className="text-xs font-bold uppercase tracking-widest">Weekly Emotional Report</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Last 7 days • PDF</p>
                    </div>
                </button>
                <button
                    onClick={() => handleDownload("Monthly Mental Health")}
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-secondary/50 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="text-left">
                        <p className="text-xs font-bold uppercase tracking-widest">Monthly Mental Health Summary</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Last 30 days • PDF</p>
                    </div>
                </button>
            </div>
        </SectionCard>
    );
};

const SecuritySection = () => {
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);

    const handleToggle2FA = () => {
        setTwoFAEnabled((prev) => !prev);
        toast.success(twoFAEnabled ? "2FA disabled." : "2FA setup initiated — check your email.");
    };

    return (
        <SectionCard title="Security" subtitle="Protect your SENTINEX account" icon={Lock}>
            <div className="space-y-4">
                {/* 2FA */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-white/5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest">Two-Factor Authentication</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            {twoFAEnabled ? "2FA is active — your account is secured." : "Add an extra layer of protection."}
                        </p>
                    </div>
                    <button
                        onClick={handleToggle2FA}
                        className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${twoFAEnabled
                            ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                            : "border-primary/30 text-primary hover:bg-primary/10"
                            }`}
                    >
                        {twoFAEnabled ? "Disable" : "Enable"}
                    </button>
                </div>

                {/* Sessions */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-white/5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest">Active Sessions</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">See all devices logged into SENTINEX.</p>
                    </div>
                    <ActionButton label="View Devices" icon={Monitor} variant="ghost" onClick={() => toast.info("Feature coming soon.")} />
                </div>

                {/* Last Login */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Login</p>
                    <p className="text-sm font-bold mt-1">March 6, 2026</p>
                    <p className="text-[9px] text-muted-foreground">Session authenticated via JWT</p>
                </div>
            </div>
        </SectionCard>
    );
};

const AccountSection = () => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleExport = () => toast.success("Data export initiated — you'll receive an email shortly.");
    const handleDeleteRequest = () => setShowDeleteConfirm(true);
    const handleDeleteConfirm = () => {
        toast.error("Account deletion initiated.");
        setShowDeleteConfirm(false);
    };

    return (
        <SectionCard title="Account Management" subtitle="Export or permanently remove your data" icon={UserCog}>
            <div className="space-y-4">
                {/* Export */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-white/5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest">Export My Data</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Download all your emotional data in JSON format.</p>
                    </div>
                    <ActionButton label="Export Data" icon={Download} onClick={handleExport} />
                </div>

                {/* Delete */}
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-destructive">Delete My Account</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                                Permanently deletes all emotional data, AI insights, mood logs, and risk scores.
                                This action <span className="text-destructive font-bold">cannot be undone</span>.
                            </p>
                        </div>
                    </div>
                    {!showDeleteConfirm ? (
                        <ActionButton label="Delete My Account" icon={Trash2} variant="danger" onClick={handleDeleteRequest} />
                    ) : (
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] text-destructive font-bold tracking-widest uppercase">Are you sure?</p>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 rounded-xl border border-destructive/40 bg-destructive/20 text-destructive text-[10px] font-bold uppercase tracking-widest hover:bg-destructive/30 transition-all"
                            >
                                Yes, Delete Everything
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-muted-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </SectionCard>
    );
};

const AdminSection = () => {
    const adminLinks = [
        { label: "Manage Departments", desc: "Create, edit, and remove departments.", icon: Building2 },
        { label: "Manage Employee Access", desc: "Control user roles and permissions.", icon: UserCog },
        { label: "View Organization Climate Index", desc: "Aggregate emotional health across the org.", icon: Cpu },
        { label: "Configure Risk Alerts", desc: "Set thresholds for organization-wide risk triggers.", icon: AlertTriangle },
    ];

    return (
        <SectionCard title="Admin Settings" subtitle="Organization management controls" icon={Building2}>
            <div className="space-y-3">
                {adminLinks.map((link) => (
                    <button
                        key={link.label}
                        onClick={() => toast.info(`${link.label} — coming soon.`)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <div className="text-left">
                                <p className="text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">{link.label}</p>
                                <p className="text-[9px] text-muted-foreground mt-0.5">{link.desc}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                ))}
            </div>
        </SectionCard>
    );
};

// ─── Settings Tab Config ───────────────────────────────────────────────────────
const tabs: { id: Tab; label: string; icon: any; adminOnly?: boolean }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "privacy", label: "Privacy & Consent", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "dashboard", label: "Dashboard Prefs", icon: LayoutDashboard },
    { id: "transparency", label: "Data Transparency", icon: Eye },
    { id: "reports", label: "Reports", icon: FileDown },
    { id: "security", label: "Security", icon: Lock },
    { id: "account", label: "Account", icon: UserCog },
    { id: "admin", label: "Admin Settings", icon: Building2, adminOnly: true },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Settings() {
    const { role } = useRole();
    const [activeTab, setActiveTab] = useState<Tab>("profile");

    const isAdmin = role && (role.includes("admin") || role === "super_admin");
    const visibleTabs = tabs.filter((t) => !t.adminOnly || isAdmin);

    const renderContent = () => {
        switch (activeTab) {
            case "profile": return <ProfileSection role={role || "individual"} />;
            case "privacy": return <PrivacySection />;
            case "notifications": return <NotificationsSection />;
            case "dashboard": return <DashboardSection />;
            case "transparency": return <TransparencySection />;
            case "reports": return <ReportsSection />;
            case "security": return <SecuritySection />;
            case "account": return <AccountSection />;
            case "admin": return isAdmin ? <AdminSection /> : null;
            default: return null;
        }
    };

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Page Header */}
                <div className="mb-8 flex items-center gap-5">
                    <div className="w-14 h-14 shrink-0 rounded-[1.25rem] bg-secondary/80 border border-white/5 flex items-center justify-center p-2.5 shadow-[0_0_20px_rgba(255,255,255,0.03)] group transition-all hover:bg-secondary hover:border-white/10">
                        <img
                            src="/infinity-logo.svg"
                            alt="Sentinex Logo"
                            className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div>
                        <h2 className="font-display text-3xl font-bold uppercase tracking-tighter drop-shadow-md">Settings</h2>
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2 uppercase tracking-widest font-black">
                            <ShieldCheck className="w-4 h-4 text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                            Privacy-first controls · SENTINEX v2.0
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <aside className="w-full lg:w-56 shrink-0">
                        <nav className="glass-card p-2 round-2xl space-y-0.5">
                            {visibleTabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const isAdminTab = tab.adminOnly;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${isActive
                                            ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_12px_rgba(59,130,246,0.1)]"
                                            : isAdminTab
                                                ? "text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
                                                : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        <tab.icon className="w-3.5 h-3.5 shrink-0" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{tab.label}</span>
                                        {isAdminTab && (
                                            <span className="ml-auto text-[8px] font-black uppercase tracking-widest text-destructive/60 bg-destructive/10 px-1 py-0.5 rounded">
                                                Admin
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Content Panel */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
