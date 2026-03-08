import React, { useEffect, useState } from "react";
import {
    Bell,
    Check,
    Loader2,
    Calendar,
    Sparkles,
    AlertCircle
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Notification {
    _id: string;
    type: 'ALERT' | 'SUMMARY';
    message: string;
    readStatus: boolean;
    createdAt: string;
}

export const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('sentinex_token');
            const response = await fetch('http://localhost:5000/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('sentinex_token');
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, readStatus: true } : n
            ));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.readStatus).length;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative group">
                    <Bell className={cn(
                        "w-5 h-5 transition-colors",
                        unreadCount > 0 ? "text-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "text-muted-foreground"
                    )} />
                    <AnimatePresence>
                        {unreadCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                            />
                        )}
                    </AnimatePresence>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-80 bg-[#050505]/95 border-white/10 backdrop-blur-2xl p-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] border-t-primary/20"
            >
                <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Alerts</span>
                    {unreadCount > 0 && (
                        <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">
                            {unreadCount} New
                        </span>
                    )}
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-white/5" />

                <div className="max-h-[400px] overflow-y-auto space-y-1 py-1 custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">No active transmissions</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification._id}
                                className={cn(
                                    "p-3 rounded-xl border transition-all cursor-pointer mb-2 block",
                                    notification.type === 'SUMMARY'
                                        ? "bg-gradient-to-br from-primary/10 to-purple-500/5 border-primary/20 hover:border-primary/40"
                                        : "bg-white/5 border-transparent hover:bg-white/10",
                                    !notification.readStatus && "border-l-2 border-l-primary"
                                )}
                                onClick={() => markAsRead(notification._id)}
                            >
                                <div className="flex gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-inner",
                                        notification.type === 'SUMMARY' ? "bg-primary/20" : "bg-white/10"
                                    )}>
                                        {notification.type === 'SUMMARY' ? (
                                            <Sparkles className="w-4 h-4 text-primary" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-warning" />
                                        )}
                                    </div>
                                    <div className="space-y-1 flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">
                                                {notification.type === 'SUMMARY' ? 'Weekly Insight' : 'System Alert'}
                                            </span>
                                            <span className="text-[8px] text-muted-foreground">
                                                {format(new Date(notification.createdAt), 'MMM d, HH:mm')}
                                            </span>
                                        </div>
                                        <p className={cn(
                                            "text-[11px] leading-relaxed",
                                            !notification.readStatus ? "text-foreground font-medium" : "text-muted-foreground"
                                        )}>
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>

                <DropdownMenuSeparator className="bg-white/5" />

                <button
                    className="w-full py-2 text-[8px] font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-colors mt-1"
                    onClick={fetchNotifications}
                >
                    Synchronize Feed
                </button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
