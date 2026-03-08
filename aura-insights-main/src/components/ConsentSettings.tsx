import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ConsentOption {
  id: string;
  label: string;
  description: string;
  default: boolean;
}

const consentOptions: ConsentOption[] = [
  {
    id: "counselor",
    label: "Allow Counselor Access",
    description: "A verified counselor can view your anonymized stress trends to offer guidance.",
    default: false,
  },
  {
    id: "aggregate",
    label: "Include in Org Analytics",
    description: "Your data contributes to aggregated department insights. Individual identity is never revealed.",
    default: true,
  },
  {
    id: "ai_training",
    label: "Improve AI Models",
    description: "Allow anonymized, encrypted patterns to improve prediction accuracy for all users.",
    default: false,
  },
];

export default function ConsentSettings() {
  const [consents, setConsents] = useState<Record<string, boolean>>({
    counselor: false,
    aggregate: true,
    ai_training: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('sentinex_token');
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.privacySettings) {
          setConsents({
            counselor: data.privacySettings.counselorAccess,
            aggregate: data.privacySettings.aggregateAnalytics,
            ai_training: data.privacySettings.aiTraining
          });
        }
      } catch (error) {
        console.error('Failed to fetch privacy settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const toggle = async (id: string) => {
    const newConsents = { ...consents, [id]: !consents[id] };
    setConsents(newConsents);

    try {
      const token = localStorage.getItem('sentinex_token');
      await fetch('http://localhost:5000/api/auth/privacy', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          privacySettings: {
            counselorAccess: newConsents.counselor,
            aggregateAnalytics: newConsents.aggregate,
            aiTraining: newConsents.ai_training
          }
        })
      });
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
    }
  };

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
          Privacy & Consent
        </h3>
      </div>

      <div className="space-y-3">
        {consentOptions.map((opt, i) => (
          <motion.div
            key={opt.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30"
          >
            <Switch
              checked={consents[opt.id]}
              onCheckedChange={() => toggle(opt.id)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                {opt.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        <Lock className="w-3 h-3 text-primary/60" />
        <p className="text-[10px] text-muted-foreground/60">
          All data is AES-256 encrypted. Changes apply immediately. You can revoke access at any time.
        </p>
      </div>
    </div>
  );
}
