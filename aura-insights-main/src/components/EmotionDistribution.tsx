import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { dashboard } from "@/lib/api";

export default function EmotionDistribution() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboard.emotions();
        setData(res.data || []);
      } catch (err) {
        console.error("[EmotionDistribution] Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-6">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">Emotion Distribution</h3>
        <p className="text-xs text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">Emotion Distribution</h3>
        <p className="text-xs text-muted-foreground">No mood data yet. Log your first mood to see emotion distribution.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">
        Emotion Distribution
      </h3>

      <div className="flex items-center gap-4">
        <div className="w-36 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="glass-card px-3 py-2 text-xs">
                      <p className="text-foreground">{payload[0].name}</p>
                      <p className="text-primary font-bold">{payload[0].value}%</p>
                    </div>
                  ) : null
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-1.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground flex-1">{item.name}</span>
              <span className="font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
