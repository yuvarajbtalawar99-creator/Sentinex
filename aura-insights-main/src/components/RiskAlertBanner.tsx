import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';

interface Alert {
    type: 'BURNOUT' | 'ANOMALY' | 'STRESS';
    severity: 'HIGH' | 'MEDIUM';
    message: string;
}

export const RiskAlertBanner = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const token = localStorage.getItem('sentinex_token');
                const response = await fetch('http://localhost:5000/api/dashboard/alerts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setAlerts(data);
            } catch (error) {
                console.error('Failed to fetch alerts:', error);
            }
        };
        fetchAlerts();
    }, []);

    if (alerts.length === 0 || !visible) return null;

    const highestAlert = alerts[0]; // For display priority

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-8"
            >
                <div className={`relative overflow-hidden rounded-2xl border ${highestAlert.severity === 'HIGH' ? 'bg-destructive/10 border-destructive/20' : 'bg-warning/10 border-warning/20'} p-4 flex items-center gap-4`}>
                    {/* Animated background pulse */}
                    <div className={`absolute inset-0 opacity-10 animate-pulse ${highestAlert.severity === 'HIGH' ? 'bg-destructive' : 'bg-warning'}`} />

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${highestAlert.severity === 'HIGH' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>
                        {highestAlert.type === 'BURNOUT' ? <ShieldAlert className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${highestAlert.severity === 'HIGH' ? 'text-destructive' : 'text-warning'}`}>
                                Neural Risk Detected
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Immediate Priority</span>
                        </div>
                        <p className={`text-xs font-bold leading-tight ${highestAlert.severity === 'HIGH' ? 'text-destructive/90' : 'text-warning/90'}`}>
                            {highestAlert.message}
                        </p>
                    </div>

                    <button
                        onClick={() => setVisible(false)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors relative z-10"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
