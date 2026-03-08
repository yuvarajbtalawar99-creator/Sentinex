import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Brain, Lock, BarChart3, Users, Eye, ArrowRight, Sparkles, Activity, ChevronDown, CheckCircle2 } from "lucide-react";

// --- Sub-components for Aesthetics ---

const NeonBadge = ({ children, color = "blue" }: { children: React.ReactNode, color?: string }) => {
    const colors: Record<string, string> = {
        green: "bg-success/10 text-success border-success/20",
        blue: "bg-primary/10 text-primary border-primary/20",
        purple: "bg-accent/10 text-accent border-accent/20",
        cyan: "bg-primary/10 text-primary border-primary/20",
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colors[color]}`}>
            {children}
        </span>
    );
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const features = [
    {
        icon: Brain,
        title: "AI Stress Prediction",
        desc: "7-day emotional forecasting using pattern analysis — not surveillance.",
    },
    {
        icon: Lock,
        title: "AES-256 Encryption",
        desc: "Emotional text encrypted at rest. Decryption only in ephemeral AI memory.",
    },
    {
        icon: BarChart3,
        title: "Burnout Analytics",
        desc: "Volatility scoring differentiates stability from masked stress.",
    },
    {
        icon: Users,
        title: "Anonymous Aggregation",
        desc: "Org admins see department trends — never individual data.",
    },
    {
        icon: Eye,
        title: "k-Anonymity Enforced",
        desc: "Minimum group sizes prevent re-identification of employees.",
    },
    {
        icon: Shield,
        title: "Consent-First Design",
        desc: "Users control counselor access, data sharing, and AI training opt-in.",
    },
];

const stats = [
    { value: "256-bit", label: "Encryption" },
    { value: "0%", label: "Data Exposure" },
    { value: "7-Day", label: "Forecast Window" },
    { value: "100%", label: "User Consent" },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-primary/30 relative">
            {/* Nav */}
            <nav className="fixed top-0 inset-x-0 z-[60] border-b border-white/10 bg-black">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
                    <div className="flex items-center gap-2">
                        <img src="/infinity-logo.svg" alt="SENTINEX" className="w-7 h-7 object-contain" />
                        <span className="font-display text-lg font-bold tracking-wider text-primary glow-text-primary">
                            SENTINEX
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
                        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                        <a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a>
                        <a href="#how" className="hover:text-foreground transition-colors">How It Works</a>
                    </div>
                    <Button onClick={() => navigate("/auth")} size="sm" className="glow-primary">
                        Get Started
                    </Button>
                </div>
            </nav>

            {/* No ambient effects for pure black */}
            <div className="absolute inset-0 bg-black -z-10" />

            {/* 1️⃣ HERO SECTION — REDESIGNED SPLIT LAYOUT */}
            <section className="relative min-h-screen flex items-center justify-center pt-24 px-6 lg:px-12 max-w-[1600px] mx-auto overflow-hidden bg-black">

                <div className="grid lg:grid-cols-2 gap-16 items-center w-full z-10">

                    {/* LEFT SIDE: Content & Action */}
                    <div className="flex flex-col items-start text-left space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-wrap gap-2"
                        >
                            <NeonBadge color="blue">🛡 Privacy-First Architecture</NeonBadge>
                            <NeonBadge color="purple">🧠 AI-Powered Forecasting</NeonBadge>
                            <NeonBadge color="blue">🤝 Voluntary Participation</NeonBadge>
                            <NeonBadge color="blue">🔒 Zero Personal Data</NeonBadge>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="font-display text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight"
                        >
                            Analyze Patterns. <br />
                            <span className="text-primary glow-text-primary">— Not People.</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4 max-w-xl"
                        >
                            <p className="text-xl text-muted-foreground/90 font-medium leading-relaxed">
                                SENTINEX uses ethical AI to forecast emotional stress and burnout trends
                                while keeping every individual anonymous and in control.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center gap-6 pt-4"
                        >
                            <Button
                                size="lg"
                                onClick={() => navigate("/auth")}
                                className="glow-primary text-base px-10 py-7 rounded-2xl font-black"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                            </Button>
                            <Button size="lg" variant="outline" className="px-10 py-7 rounded-2xl font-black border-white/10 text-white hover:bg-white/5">
                                View Privacy Model
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="pt-4"
                        >
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/60">
                                No names. No tracking. No exposure.
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                Only anonymous emotional intelligence.
                            </p>
                        </motion.div>

                        {/* Trust Anchor */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-3 pt-12 text-muted-foreground/40 border-t border-white/5 w-full"
                        >
                            <Lock className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest leading-none">Designed for privacy. Built for trust.</span>
                        </motion.div>
                    </div>

                    {/* RIGHT SIDE: Visual Intelligence Component */}
                    <div className="relative flex justify-center items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="w-full max-w-[600px] aspect-square relative"
                        >
                            {/* Abstract Waveform Visual */}
                            <div className="absolute inset-0 flex flex-col justify-center items-center space-y-12">
                                <div className="w-full flex justify-between px-4">
                                    {[...Array(24)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                height: [20, Math.random() * 80 + 20, 20],
                                                opacity: [0.3, 1, 0.3]
                                            }}
                                            transition={{
                                                duration: 1.5 + Math.random() * 2,
                                                repeat: Infinity,
                                                delay: i * 0.05
                                            }}
                                            className="w-2 rounded-full bg-gradient-to-t from-primary to-accent shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                        />
                                    ))}
                                </div>

                                {/* Graph Mockup */}
                                <div className="glass-card w-full p-6 neon-border-blue relative overflow-hidden group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-destructive/50" />
                                            <div className="w-3 h-3 rounded-full bg-warning/50" />
                                            <div className="w-3 h-3 rounded-full bg-success/50" />
                                        </div>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Global Risk Analytics</span>
                                    </div>
                                    <svg viewBox="0 0 400 100" className="w-full h-24 overflow-visible">
                                        <motion.path
                                            d="M0 80 Q 50 20, 100 70 T 200 30 T 300 80 T 400 40"
                                            fill="none"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth="3"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        />
                                        <motion.path
                                            d="M0 80 Q 50 20, 100 70 T 200 30 T 300 80 T 400 40"
                                            fill="none"
                                            stroke="var(--foreground)"
                                            strokeWidth="1"
                                            strokeDasharray="4 4"
                                            className="opacity-20"
                                        />
                                    </svg>
                                </div>

                                {/* Neural visualization */}
                                <div className="w-48 h-48 relative">
                                    <div className="absolute inset-0 border-2 border-purple-500/20 rounded-full animate-spin-slow" />
                                    <div className="absolute inset-4 border border-cyan-500/20 rounded-full animate-reverse-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Brain className="w-12 h-12 text-purple-500 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                                    </div>
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.2, 0.6, 0.2]
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Infinity,
                                                delay: i * 0.3
                                            }}
                                            className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"
                                            style={{
                                                top: `${50 + 42 * Math.sin(i * 45 * Math.PI / 180)}%`,
                                                left: `${50 + 42 * Math.cos(i * 45 * Math.PI / 180)}%`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Decorative background glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats bar */}
            <section className="border-y border-white/5 bg-black relative z-10">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border/30">
                    {stats.map((s) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="py-10 text-center"
                        >
                            <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
                            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-bold">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-32 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-20">
                        <h2 className="font-display text-4xl lg:text-5xl font-black mb-6">Built for Trust</h2>
                        <p className="text-xl text-muted-foreground/80 mt-4 max-w-2xl mx-auto">
                            Every feature is designed so organizations gain insight — while employees retain complete control.
                        </p>
                    </motion.div>
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {features.map((f) => (
                            <motion.div key={f.title} variants={fadeUp} className="glass-card p-8 group hover:border-primary/40 transition-all duration-500">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:shadow-[0_0_20px_rgba(0,255,156,0.3)] transition-all">
                                    <f.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-display text-xl font-bold mb-3">{f.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How it works */}
            <section id="how" className="py-32 px-6 border-t border-white/5 bg-black">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
                        <h2 className="font-display text-4xl lg:text-5xl font-black">How It Works</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 gap-12 text-left">
                        {[
                            { step: "01", title: "Log Your Mood", desc: "Select mood score, emotion type, and an optional encrypted reflection — once per day." },
                            { step: "02", title: "AI Analyzes Patterns", desc: "Sentiment analysis runs in ephemeral memory. Only scores are stored — never raw text." },
                            { step: "03", title: "Get Predictions", desc: "Receive 7-day stress forecasts, burnout risk alerts, and personalized wellness nudges." },
                            { step: "04", title: "Org Gets Aggregates", desc: "Department heatmaps and trend lines — with k-anonymity, so no individual is identifiable." },
                        ].map((s, i) => (
                            <motion.div
                                key={s.step}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex gap-8 items-start glass-card p-8 hover:bg-[#121212]/80 transition-all border-none shadow-none"
                            >
                                <div className="font-display text-5xl font-black text-primary/10 shrink-0 w-20 leading-none">{s.step}</div>
                                <div>
                                    <h3 className="font-display text-2xl font-bold mb-2">{s.title}</h3>
                                    <p className="text-lg text-muted-foreground/80 leading-relaxed">{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Privacy section */}
            <section id="privacy" className="py-32 px-6 border-t border-white/5 relative z-10 overflow-hidden">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                        <Shield className="w-16 h-16 text-primary mx-auto mb-10 glow-text-primary" />
                        <h2 className="font-display text-4xl lg:text-6xl font-black mb-8 leading-tight">
                            &ldquo;SENTINEX analyzes emotional patterns <span className="text-primary">— not people.</span>&rdquo;
                        </h2>
                        <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                            Zero dark patterns. Zero surveillance. Your emotional data is yours — encrypted, anonymized, and under your control at all times.
                        </p>
                        <Button size="lg" onClick={() => navigate("/auth")} className="mt-12 glow-primary px-12 py-8 rounded-2xl font-black text-xl">
                            Try SENTINEX Free <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/30 py-16 px-6 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <img src="/infinity-logo.svg" alt="SENTINEX" className="w-10 h-10 object-contain" />
                        <span className="font-display text-2xl font-black tracking-wider text-primary">SENTINEX</span>
                    </div>
                    <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
                        <a href="#" className="hover:text-primary transition-colors">Documentation</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Ethics Charter</a>
                    </div>
                    <p className="text-sm font-medium">&copy; {new Date().getFullYear()} SENTINEX. Privacy-first by design.</p>
                </div>
            </footer>
        </div>
    );
}
