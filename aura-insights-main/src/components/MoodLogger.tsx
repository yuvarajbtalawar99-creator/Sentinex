import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock } from "lucide-react";
import { mood } from "@/lib/api";

const EMOTIONS = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "stressed", label: "Stressed", emoji: "😤" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "energetic", label: "Energetic", emoji: "⚡" },
  { value: "tired", label: "Tired", emoji: "😴" },
  { value: "frustrated", label: "Frustrated", emoji: "😠" },
];

interface MoodLoggerProps {
  onSubmit?: (data: { mood: string; score: number; text: string }) => void;
  onMoodLogged?: () => void;
}

export default function MoodLogger({ onSubmit, onMoodLogged }: MoodLoggerProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [score, setScore] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedEmotion) return;
    setSubmitting(true);
    try {
      await mood.log({
        mood: selectedEmotion,
        intensity: score,
        note: text,
        timestamp: new Date().toISOString(),
      });
      onSubmit?.({ mood: selectedEmotion, score, text });
      onMoodLogged?.();
      setSubmitted(true);
      setSelectedEmotion(null);
      setScore(5);
      setText("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("[MoodLogger] Failed to log mood:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground">
          Daily Mood Check-In
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>Encrypted</span>
        </div>
      </div>

      {/* Emotion grid */}
      <div className="grid grid-cols-4 gap-3">
        {EMOTIONS.map((emotion) => (
          <button
            key={emotion.value}
            onClick={() => setSelectedEmotion(emotion.value)}
            className={`group relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 transform-gpu cursor-pointer
              ${selectedEmotion === emotion.value
                ? "bg-primary/20 border-2 border-primary shadow-[0_0_25px_rgba(59,130,246,0.4)] scale-105"
                : "bg-white/[0.03] border-2 border-transparent hover:bg-white/[0.08] hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:-translate-y-1"
              }`}
          >
            {/* Background ambient glow matching the emoji (optional nice touch) */}
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-white/10 to-transparent pointer-events-none`} />

            <span className={`text-2xl transition-transform duration-300 ${selectedEmotion === emotion.value ? "scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "group-hover:scale-110"}`}>
              {emotion.emoji}
            </span>
            <span className={`text-[10px] uppercase font-black tracking-widest transition-colors duration-300 ${selectedEmotion === emotion.value
              ? "text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              : "text-muted-foreground group-hover:text-foreground"
              }`}>
              {emotion.label}
            </span>
          </button>
        ))}
      </div>

      {/* Score slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Intensity</span>
          <span className="font-display text-primary">{score}/10</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_10px_hsl(192_100%_50%/0.5)]"
        />
      </div>

      {/* Text reflection */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="How was your day today? What happened that made you feel this way? (Optional, AES-256 encrypted)"
        className="w-full bg-secondary/30 border border-border/50 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
        rows={3}
      />

      {/* Submit */}
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-3 text-sm text-success font-medium"
          >
            ✓ Mood logged securely to database
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!selectedEmotion || submitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm
              bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:glow-primary
              disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Saving..." : "Log Mood"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

