import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, EyeOff, Server, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';

const PrivacyPage = () => {
    const features = [
        {
            icon: EyeOff,
            title: "Zero-Knowledge Isolation",
            description: "SENTINEX does not store your real name or contact info. Your data is tied to a unique neural ID."
        },
        {
            icon: Server,
            title: "Local-First Analysis",
            description: "Sentiment analysis happens on our secure neural nodes, never leaving our high-security perimeter."
        },
        {
            icon: Lock,
            title: "AES-256 Encryption",
            description: "Every mood log and biometric data point is encrypted at rest and in transit."
        },
        {
            icon: CheckCircle2,
            title: "Consent-Based Sync",
            description: "You choose what to share. Opt-out of research or organizational analytics anytime."
        }
    ];

    const handleDeleteAccount = async () => {
        if (window.confirm("CRITICAL: This will permanently delete your account and all associated emotional history. This action cannot be undone. Proceed?")) {
            try {
                const token = localStorage.getItem('sentinex_token');
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    localStorage.removeItem('sentinex_token');
                    window.location.href = '/';
                }
            } catch (error) {
                alert("Deletion failed. Contact systems administrator.");
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-12 py-8">
                {/* Header */}
                <div className="space-y-4">
                    <Link to="/dashboard" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-70 transition-all">
                        <ArrowLeft className="w-3 h-3" />
                        Back to Identity Dashboard
                    </Link>
                    <h1 className="font-display text-4xl font-black tracking-tighter uppercase">How SENTINEX Protects You</h1>
                    <p className="text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        SENTINEX is designed as an Emotional Early Warning System. Our priority is your privacy. We detect patterns in emotional data that humans cannot notice early—without compromising your identity.
                    </p>
                </div>

                {/* Protection Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 border-white/5"
                        >
                            <f.icon className="w-6 h-6 text-primary mb-4" />
                            <h3 className="font-display text-lg font-bold mb-2 uppercase tracking-tight">{f.title}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                {f.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Enterprise Standards */}
                <div className="glass-card p-8 border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-4 mb-6">
                        <Shield className="w-10 h-10 text-primary" />
                        <div>
                            <h3 className="font-display text-xl font-black uppercase tracking-tighter">Enterprise Trust Stack</h3>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">ISO 27001 • HIPAA COMPLIANT ARCHITECTURE</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-sm text-foreground/80 leading-relaxed font-medium">
                        <p>
                            1. **No Data Sharing:** We never sell or share individual raw data with third parties or employers.
                        </p>
                        <p>
                            2. **Anonymous Aggregation:** Organizational insights only show department averages (minimum 10 users) to prevent de-anonymization.
                        </p>
                        <p>
                            3. **Right to be Forgotten:** You own your data. Our one-click deletion wipes every trace from our neural nodes.
                        </p>
                    </div>
                </div>

                {/* Destructive Actions */}
                <div className="pt-12 border-t border-white/5">
                    <div className="glass-card p-8 border-destructive/20 hover:border-destructive/40 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <h3 className="font-display text-xl font-black uppercase tracking-tighter text-destructive">Data Deletion Protocol</h3>
                                <p className="text-xs text-muted-foreground font-medium max-w-md">
                                    Initiate permanent cascading deletion of your account, mood history, and risk scores. This process is immediate and irreversible.
                                </p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-destructive text-white font-black uppercase tracking-widest text-xs hover:bg-destructive/80 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                            >
                                <Trash2 className="w-4 h-4" />
                                Initiate Deletion
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PrivacyPage;
