import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker
} from "react-simple-maps";
import { admin } from "@/lib/api";
import { Globe, Users, Building2, Flame, ShieldAlert, Activity } from "lucide-react";

// Use an alternative, lightweight, and reliable map topology URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface RegionData {
    country: string;
    lat: number;
    lng: number;
    stress_level: number;
    burnout_risk: number;
    users: number;
    organizations: number;
    status: string;
    accentColor: string;
}

export default function GlobalEmotionHeatmap() {
    const [data, setData] = useState<RegionData[]>([]);
    const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
    const [loading, setLoading] = useState(true);

    // Real-time ping simulation state
    const [pings, setPings] = useState<{ id: string, lat: number, lng: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await admin.globalHeatmap();
                setData(res.data);
            } catch (err) {
                console.error("Failed to load map data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Data refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Simulate flowing data particles/pings over high-stress regions (neural feeling)
    useEffect(() => {
        if (data.length === 0) return;

        const pingInterval = setInterval(() => {
            // Pick a random region to ping
            const target = data[Math.floor(Math.random() * data.length)];
            if (target.stress_level > 0.4) {
                const newPing = { id: Math.random().toString(), lat: target.lat, lng: target.lng };
                setPings(prev => [...prev, newPing]);

                // Remove ping after animation finishes
                setTimeout(() => {
                    setPings(prev => prev.filter(p => p.id !== newPing.id));
                }, 1500);
            }
        }, 2000);

        return () => clearInterval(pingInterval);
    }, [data]);

    return (
        <div className="glass-card mt-8 overflow-hidden relative">
            {/* Component Header */}
            <div className="p-6 pb-2 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                    <h3 className="font-display text-sm uppercase tracking-widest font-black text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Global Emotional Signal Map
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1 max-w-md">
                        Real-time aggregated emotional intelligence signals across all connected organizations
                    </p>
                </div>

                {/* Status Legend */}
                <div className="flex flex-wrap items-center gap-4 bg-secondary/50 p-2 px-4 rounded-xl border border-white/5">
                    {[
                        { label: "Stable", color: "bg-success" },
                        { label: "Rising Stress", color: "bg-warning" },
                        { label: "High Stress", color: "bg-[#F97316]" },
                        { label: "Burnout Risk", color: "bg-destructive" },
                    ].map(legend => (
                        <div key={legend.label} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${legend.color} relative`}>
                                {legend.label === "Burnout Risk" && (
                                    <div className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-75"></div>
                                )}
                            </div>
                            <span className="text-[9px] uppercase tracking-widest font-black text-muted-foreground">{legend.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map Container */}
            <div className="relative w-full h-[500px] bg-[#020617] overflow-hidden flex items-center justify-center">

                {/* Ambient Background Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[120px] rounded-full"></div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Activity className="w-8 h-8 text-primary animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-widest text-primary/50">Synchronizing Global Geomatics...</span>
                    </div>
                ) : (
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{ scale: 140, center: [0, 30] }}
                        className="w-full h-full opacity-80"
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill="rgba(30, 41, 59, 0.4)" // Dark slate
                                        stroke="rgba(51, 65, 85, 0.5)" // Slate borders
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: "none" },
                                            hover: { fill: "rgba(51, 65, 85, 0.8)", outline: "none", transition: "all 250ms" },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>

                        {/* Render Markers for Regions */}
                        {data.map((region) => (
                            <Marker
                                key={region.country}
                                coordinates={[region.lng, region.lat]}
                                onMouseEnter={() => setHoveredRegion(region)}
                                onMouseLeave={() => setHoveredRegion(null)}
                                style={{ cursor: "crosshair" }}
                            >
                                {/* Base Glow Ring */}
                                <circle
                                    r={12}
                                    fill={region.accentColor}
                                    opacity={0.15}
                                />

                                {/* Pulsing Neural Effect for High Stress */}
                                {region.stress_level > 0.6 && (
                                    <circle
                                        r={region.stress_level * 20}
                                        fill="transparent"
                                        stroke={region.accentColor}
                                        strokeWidth={0.5}
                                        style={{
                                            animation: `pulse-ring ${3 - region.stress_level}s cubic-bezier(0.215, 0.61, 0.355, 1) infinite`
                                        }}
                                    />
                                )}

                                {/* Core Dot */}
                                <circle
                                    r={4}
                                    fill={region.accentColor}
                                    stroke="#fff"
                                    strokeWidth={1}
                                />
                            </Marker>
                        ))}

                        {/* Render Flowing Particles / Pings */}
                        {pings.map(ping => (
                            <Marker key={ping.id} coordinates={[ping.lng, ping.lat]}>
                                <motion.circle
                                    initial={{ r: 0, opacity: 1 }}
                                    animate={{ r: 30, opacity: 0 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    fill="transparent"
                                    stroke="#3B82F6"
                                    strokeWidth={1}
                                />
                            </Marker>
                        ))}
                    </ComposableMap>
                )}

                {/* Hover Tooltip Overlay (Absolutely Positioned) */}
                <AnimatePresence>
                    {hoveredRegion && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute bottom-6 left-6 z-20 pointer-events-none"
                        >
                            <div className="bg-[#0b1221]/95 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-2xl w-72 relative overflow-hidden">
                                {/* Dynamic Top Gradient Bar */}
                                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: hoveredRegion.accentColor }}></div>

                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-display font-black text-lg uppercase tracking-tight">{hoveredRegion.country}</h4>
                                    <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border" style={{ color: hoveredRegion.accentColor, borderColor: `${hoveredRegion.accentColor}40`, backgroundColor: `${hoveredRegion.accentColor}10` }}>
                                        {hoveredRegion.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-white/5 rounded-lg p-2.5">
                                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                            <Building2 className="w-3 h-3" />
                                            <span className="text-[9px] uppercase tracking-widest font-black">Orgs</span>
                                        </div>
                                        <span className="font-display font-bold text-sm">{hoveredRegion.organizations}</span>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-2.5">
                                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                            <Users className="w-3 h-3" />
                                            <span className="text-[9px] uppercase tracking-widest font-black">Users</span>
                                        </div>
                                        <span className="font-display font-bold text-sm">{hoveredRegion.users.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[9px] uppercase tracking-widest font-black text-muted-foreground">Emotional Stability Idx</span>
                                            <span className="text-[10px] font-black">{Math.round((1 - hoveredRegion.stress_level) * 100)}</span>
                                        </div>
                                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }} animate={{ width: `${(1 - hoveredRegion.stress_level) * 100}%` }}
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[9px] uppercase tracking-widest font-black flex items-center gap-1">
                                                <Flame className="w-3 h-3 text-destructive" />
                                                Burnout Risk
                                            </span>
                                            <span className="text-[10px] font-black">{Math.round(hoveredRegion.burnout_risk * 100)}%</span>
                                        </div>
                                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }} animate={{ width: `${hoveredRegion.burnout_risk * 100}%` }}
                                                className="h-full" style={{ backgroundColor: hoveredRegion.accentColor }}
                                            />
                                        </div>
                                    </div>

                                    {hoveredRegion.stress_level > 0.6 && (
                                        <div className="mt-3 pt-3 border-t border-white/5 flex items-start gap-2">
                                            <ShieldAlert className="w-4 h-4 text-warning shrink-0" />
                                            <p className="text-[9px] leading-relaxed text-warning/80">Regional stress acceleration detected. Click to isolate analytical sub-systems.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDAgNEw0IDRMNCAwWiIgZmlsbD0icmdiYSgwLCAwLCAwLCAxKSIgZmlsbC1vcGFjaXR5PSIwLjE1IiAvPgo8L3N2Zz4=')] opacity-[0.15]"></div>
            </div>

            {/* Global Styles for Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes pulse-ring {
                0% { transform: scale(0.8); opacity: 0.5; stroke-width: 1px; }
                80%, 100% { transform: scale(2.5); opacity: 0; stroke-width: 0px; }
            }
        `}} />
        </div>
    );
}
